const COURSE_TOTALS = {
  dist: 162.8,
  gain: 10000,
};

const SUNRISE_MINUTES = 4 * 60 + 35;
const SUNSET_MINUTES = 18 * 60 + 45;
const SUNRISE_LABEL = "04:35";
const SUNSET_LABEL = "18:45";
const HEADLIGHT_CELL_MARKER = "__HEADLIGHT_CELL__";
const STORAGE_KEY = "sainokuni-100mile-pace-settings-v2";

const categories = {
  solo: { label: "ソロ", startMinutes: 7 * 60, maxHour: 35 },
  relay: { label: "駅伝", startMinutes: 8 * 60, maxHour: 34 },
};

const baseSections = [
  { name: "Start:ニューサンピア", loop: "Start", group: "start", dist: 0, coef: 1.0, soloCutoff: null, relayCutoff: null, refCutoff: null },
  { name: "くぬぎむら体験交流館", loop: "North", group: "north", dist: 14.3, coef: 1.0, soloCutoff: null, relayCutoff: null, refCutoff: 350 },
  { name: "慈光寺", loop: "North", group: "north", dist: 6.1, coef: 1.15, soloCutoff: null, relayCutoff: null, refCutoff: 460 },
  { name: "堂平キャンプ場", loop: "North", group: "north", dist: 11.8, coef: 1.22, soloCutoff: null, relayCutoff: null, refCutoff: 690 },
  { name: "刈場坂峠", loop: "North", group: "north", dist: 7.1, coef: 0.98, soloCutoff: null, relayCutoff: null, refCutoff: 790 },
  { name: "ニューサンピア", loop: "North終わり", group: "north", dist: 14.5, coef: 1.0, soloCutoff: null, relayCutoff: 660, refCutoff: 990, base: true },
  { name: "桂木観音", loop: "South1", group: "south1", dist: 8.2, coef: 0.95, soloCutoff: null, relayCutoff: null, refCutoff: 1090 },
  { name: "高山不動尊上の旧茶屋", loop: "South1", group: "south1", dist: 8.5, coef: 1.18, soloCutoff: null, relayCutoff: null, refCutoff: 1250 },
  { name: "竹寺", loop: "South1", group: "south1", dist: 10.5, coef: 1.24, soloCutoff: null, relayCutoff: null, refCutoff: 1440 },
  { name: "kinoca(東吾野)", loop: "South1", group: "south1", dist: 11.0, coef: 1.06, soloCutoff: null, relayCutoff: null, refCutoff: 1660 },
  { name: "桂木観音", loop: "South1", group: "south1", dist: 11.2, coef: 1.12, soloCutoff: null, relayCutoff: null, refCutoff: 1880 },
  { name: "ニューサンピア", loop: "South1終わり", group: "south1", dist: 5.0, coef: 0.92, soloCutoff: 1350, relayCutoff: 1290, refCutoff: 1980, base: true },
  { name: "桂木観音", loop: "South2", group: "south2", dist: 8.2, coef: 1.02, soloCutoff: 1440, relayCutoff: 1380, refCutoff: null },
  { name: "高山不動尊上の旧茶屋", loop: "South2", group: "south2", dist: 8.5, coef: 1.18, soloCutoff: 1560, relayCutoff: 1500, refCutoff: null },
  { name: "竹寺", loop: "South2", group: "south2", dist: 10.5, coef: 1.24, soloCutoff: 1690, relayCutoff: 1630, refCutoff: null },
  { name: "kinoca(東吾野)", loop: "South2", group: "south2", dist: 11.2, coef: 1.1, soloCutoff: 1860, relayCutoff: 1800, refCutoff: null },
  { name: "桂木観音", loop: "South2", group: "south2", dist: 11.2, coef: 1.18, soloCutoff: 2025, relayCutoff: 1965, refCutoff: null },
  { name: "Goal:ニューサンピア", loop: "Finish", group: "finish", dist: 5.0, coef: 0.98, soloCutoff: 2100, relayCutoff: 2040, refCutoff: null },
];

function calculatePaceData(categoryKey, restPattern, strategy, minH, maxH) {
  const category = categories[categoryKey] || categories.solo;
  const startMinutesAbsolute = category.startMinutes;
  let minHour = clamp(parseInt(minH, 10) || 28, 1, 60);
  let maxHour = clamp(parseInt(maxH, 10) || category.maxHour, 1, category.maxHour);
  minHour = Math.min(minHour, category.maxHour);
  if (minHour > maxHour) {
    const temp = minHour;
    minHour = maxHour;
    maxHour = temp;
  }

  const sections = buildSections(restPattern, categoryKey);
  const weights = [];
  const baseWeights = [];
  for (let i = 1; i < sections.length; i += 1) {
    baseWeights.push(sections[i].dist * sections[i].coef);
  }

  const totalBaseWeight = baseWeights.reduce((sum, value) => sum + value, 0);
  let cumWeight = 0;
  baseWeights.forEach((weight, index) => {
    const mid = cumWeight + weight / 2;
    let multiplier = 1.0;
    if (mid > totalBaseWeight / 2) {
      if (strategy === "後半10%落ち") multiplier = 1.1;
      if (strategy === "後半20%落ち") multiplier = 1.2;
      if (strategy === "後半30%落ち") multiplier = 1.3;
      if (strategy === "後半40%落ち") multiplier = 1.4;
    }
    weights.push(weight * multiplier);
    cumWeight += weight;
  });

  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  const totalStayTime = sections.reduce((sum, section) => sum + section.stayTime, 0);
  const schedules = {};

  for (let h = minHour; h <= maxHour; h += 1) {
    const arrAbs = new Array(sections.length);
    const depAbs = new Array(sections.length);
    const intervalArr = new Array(sections.length).fill(0);
    const isArrivalCapped = new Array(sections.length).fill(false);
    const isDepartureCapped = new Array(sections.length).fill(false);
    const totalPlannedRunMins = h * 60 - totalStayTime;
    let currentPaceUnit = totalPlannedRunMins / totalWeight;
    let prevDepAbs = startMinutesAbsolute;
    let weightsFinished = 0;
    let staysFinished = 0;

    arrAbs[0] = startMinutesAbsolute;
    depAbs[0] = startMinutesAbsolute;

    for (let i = 1; i < sections.length; i += 1) {
      const weight = weights[i - 1];
      let runTime = weight * currentPaceUnit;
      let arrival = prevDepAbs + runTime;
      let departure = arrival + sections[i].stayTime;

      staysFinished += sections[i].stayTime;
      weightsFinished += weight;

      const cutoffAbs = sections[i].cutoff === null ? null : startMinutesAbsolute + sections[i].cutoff;
      if (cutoffAbs !== null && departure > cutoffAbs) {
        const wasArrivalAfterCutoff = arrival > cutoffAbs;
        isDepartureCapped[i] = true;
        departure = cutoffAbs - 1;
        arrival = departure - sections[i].stayTime;
        if (wasArrivalAfterCutoff) isArrivalCapped[i] = true;
        runTime = arrival - prevDepAbs;

        const remainingWeight = totalWeight - weightsFinished;
        if (remainingWeight > 0) {
          const timeUsedForRunSoFar = departure - startMinutesAbsolute - staysFinished;
          const remainingRunTime = totalPlannedRunMins - timeUsedForRunSoFar;
          currentPaceUnit = remainingRunTime / remainingWeight;
        }
      }

      arrAbs[i] = arrival;
      depAbs[i] = departure;
      intervalArr[i] = runTime;
      prevDepAbs = departure;
    }
    schedules[h] = { arrAbs, depAbs, intervalArr, isArrivalCapped, isDepartureCapped };
  }

  const headers = ["エイド", "区間 / 累積", "滞在"];
  for (let h = minHour; h <= maxHour; h += 1) headers.push(`${h}h ペース`);
  const relayLegs = buildRelayLegs(schedules, sections, minHour, maxHour, startMinutesAbsolute);

  const rows = [];
  let cumDist = 0;
  for (let i = 0; i < sections.length; i += 1) {
    cumDist += sections[i].dist;
    const cutoffText = sections[i].cutoff === null
      ? ""
      : `<br><span class="cutoff-tag">${category.label}関門 ${formatElapsed(sections[i].cutoff)} (${formatClockLabel(startMinutesAbsolute + sections[i].cutoff)})</span>`;
    const refText = sections[i].refCutoff === null ? "" : `<br><span class="sub-tag">100km参考 ${formatClockLabel(7 * 60 + sections[i].refCutoff)}</span>`;
    const aidRow = [
      `${sections[i].name}<br><span class="sub-tag">${sections[i].loop}</span>${cutoffText}${refText}`,
      i === 0 ? "-" : `${sections[i].dist.toFixed(1)}k / ${cumDist.toFixed(1)}k`,
      sections[i].stayTime === 0 ? "-" : sections[i].stayTime,
    ];

    for (let h = minHour; h <= maxHour; h += 1) {
      const schedule = schedules[h];
      if (i === 0) {
        aidRow.push(`00:00 (${formatTimeOnly(startMinutesAbsolute)})`);
      } else {
        const needsHeadlight = i === sections.length - 1
          ? isHeadlightTime(schedule.arrAbs[i])
          : isHeadlightTime(schedule.arrAbs[i]) || isHeadlightTime(schedule.depAbs[i]);
        let arrStr = formatTimeCombined(schedule.arrAbs[i] - startMinutesAbsolute, startMinutesAbsolute);
        if (schedule.isArrivalCapped[i]) arrStr = `<span class="arrival-capped">${arrStr}</span>`;
        if (i === sections.length - 1) {
          aidRow.push(markHeadlightCell(arrStr, needsHeadlight));
        } else {
          let depStr = formatTimeCombined(schedule.depAbs[i] - startMinutesAbsolute, startMinutesAbsolute);
          if (schedule.isDepartureCapped[i]) depStr = `<span class="hatched-yellow">${depStr}</span>`;
          aidRow.push(markHeadlightCell(`${arrStr}着<br>${depStr}発`, needsHeadlight));
        }
      }
    }
    rows.push({ type: "aid", group: sections[i].group, data: aidRow });

    if (i < sections.length - 1) {
      const next = sections[i + 1];
      const paceRow = ["区間", `${next.dist.toFixed(1)}k`, ""];
      for (let h = minHour; h <= maxHour; h += 1) {
        const interval = schedules[h].intervalArr[i + 1];
        const paceMinKm = interval / next.dist;
        const needsHeadlight = doesIntervalNeedHeadlight(schedules[h].depAbs[i], schedules[h].arrAbs[i + 1]);
        paceRow.push(markHeadlightCell(`${formatDuration(interval)} (${formatPace(paceMinKm)})`, needsHeadlight));
      }
      rows.push({ type: "pace", group: next.group, data: paceRow });
    }
  }

  return { headers, rows, relayLegs, meta: { categoryKey, categoryLabel: category.label, minHour, maxHour, totalStayTime, startMinutesAbsolute, restPattern, strategy } };
}

function buildRelayLegs(schedules, sections, minHour, maxHour, startMinutesAbsolute) {
  const legs = [
    { label: "North", group: "north", from: 0, to: 5 },
    { label: "South1", group: "south1", from: 5, to: 11 },
    { label: "South2", group: "south2", from: 11, to: 17 },
  ];

  return legs.map((leg) => {
    const distance = sections.slice(leg.from + 1, leg.to + 1).reduce((sum, section) => sum + section.dist, 0);
    const cells = [];
    for (let h = minHour; h <= maxHour; h += 1) {
      const schedule = schedules[h];
      const startAbs = schedule.depAbs[leg.from];
      const endAbs = schedule.arrAbs[leg.to];
      cells.push({
        hour: h,
        duration: endAbs - startAbs,
        startElapsed: startAbs - startMinutesAbsolute,
        endElapsed: endAbs - startMinutesAbsolute,
        startClock: formatTimeOnly(startAbs),
        endClock: formatTimeOnly(endAbs),
        needsHeadlight: doesIntervalNeedHeadlight(startAbs, endAbs),
      });
    }
    return { ...leg, distance, cells, startName: sections[leg.from].name, endName: sections[leg.to].name };
  });
}

function buildSections(restPattern, categoryKey) {
  const stays = {
    短め: { aid: 3, base1: 15, base2: 20 },
    標準: { aid: 5, base1: 20, base2: 25 },
    長め: { aid: 8, base1: 30, base2: 35 },
  }[restPattern] || { aid: 5, base1: 20, base2: 25 };
  const relayBaseStays = {
    短め: 1,
    標準: 2,
    長め: 2,
  };

  return baseSections.map((section, index) => {
    let stayTime = stays.aid;
    if (index === 0 || index === baseSections.length - 1) stayTime = 0;
    if (section.base) stayTime = section.loop.includes("South1") ? stays.base2 : stays.base1;
    if (categoryKey === "relay" && section.base) stayTime = relayBaseStays[restPattern] ?? 2;
    return {
      ...section,
      cutoff: categoryKey === "relay" ? section.relayCutoff : section.soloCutoff,
      stayTime,
    };
  });
}

function parseStartTime(value) {
  const [hours, minutes] = String(value || "07:00").split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function formatPace(minKm) {
  if (!minKm || Number.isNaN(minKm)) return "-";
  const mins = Math.floor(minKm);
  const roundedSecs = Math.round((minKm - mins) * 60);
  const safeSecs = roundedSecs >= 60 ? 59 : roundedSecs;
  return `${mins}:${safeSecs < 10 ? "0" : ""}${safeSecs}/km`;
}

function formatDuration(minutes) {
  const total = Math.max(0, Math.round(minutes));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function formatElapsed(minutes) {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
}

function formatTimeCombined(minutes, startMinsAbs) {
  const totalMins = Math.round(minutes);
  const actualTotalMins = startMinsAbs + totalMins;
  const actualH = Math.floor(actualTotalMins / 60) % 24;
  const actualM = positiveModulo(actualTotalMins, 60);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(Math.floor(totalMins / 60))}:${pad(positiveModulo(totalMins, 60))} (${pad(actualH)}:${pad(actualM)})`;
}

function formatTimeOnly(totalMinsAbsolute) {
  const h = Math.floor(totalMinsAbsolute / 60) % 24;
  const m = positiveModulo(totalMinsAbsolute, 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function formatClockLabel(totalMinsAbsolute) {
  const prefix = totalMinsAbsolute >= 24 * 60 ? "翌" : "";
  return `${prefix}${formatTimeOnly(totalMinsAbsolute)}`;
}

function positiveModulo(value, divisor) {
  return ((Math.round(value) % divisor) + divisor) % divisor;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function markHeadlightCell(value, needsHeadlight) {
  return needsHeadlight ? HEADLIGHT_CELL_MARKER + value : value;
}

function isHeadlightTime(absMinutes) {
  const dayMinute = positiveModulo(absMinutes, 24 * 60);
  return dayMinute < SUNRISE_MINUTES || dayMinute >= SUNSET_MINUTES;
}

function doesIntervalNeedHeadlight(startAbs, endAbs) {
  const start = Math.round(startAbs);
  const end = Math.round(endAbs);
  for (let minute = start; minute <= end; minute += 15) {
    if (isHeadlightTime(minute)) return true;
  }
  return isHeadlightTime(end);
}

function renderTable(result) {
  const table = document.querySelector("#pace-table");
  table.textContent = "";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  result.headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  result.rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.className = `${row.type === "pace" ? "pace-row" : "aid-row"} loop-${row.group || "start"}`;
    row.data.forEach((cell) => {
      const td = document.createElement("td");
      const html = String(cell);
      if (html.startsWith(HEADLIGHT_CELL_MARKER)) td.classList.add("headlight-cell");
      td.innerHTML = html.replace(HEADLIGHT_CELL_MARKER, "");
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

function renderMemberSummary(result) {
  const panel = document.querySelector("#member-summary");
  const table = document.querySelector("#member-table");
  table.textContent = "";

  if (result.meta.categoryKey !== "relay") {
    panel.hidden = true;
    return;
  }

  panel.hidden = false;

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["担当", "距離", ...result.relayLegs[0].cells.map((cell) => `${cell.hour}h`)].forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  result.relayLegs.forEach((leg) => {
    const tr = document.createElement("tr");
    tr.className = `member-row loop-${leg.group}`;
    const nameCell = document.createElement("td");
    nameCell.innerHTML = `<strong>${leg.label}</strong><span>${cleanLegName(leg.startName)} → ${cleanLegName(leg.endName)}</span>`;
    tr.appendChild(nameCell);

    const distanceCell = document.createElement("td");
    distanceCell.textContent = `${leg.distance.toFixed(1)}k`;
    tr.appendChild(distanceCell);

    leg.cells.forEach((cell) => {
      const td = document.createElement("td");
      if (cell.needsHeadlight) td.classList.add("headlight-cell");
      td.innerHTML = `<strong>${formatDuration(cell.duration)}</strong><span><b class="time-label">経</b>${formatDuration(cell.startElapsed)}→${formatDuration(cell.endElapsed)}</span><span><b class="time-label">時</b>${cell.startClock}→${cell.endClock}</span>`;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

function cleanLegName(name) {
  return name.replace(/^Start:/, "").replace(/^Goal:/, "");
}

function update() {
  syncCategoryControls();
  const result = calculateCurrent();
  renderMemberSummary(result);
  renderTable(result);
  document.querySelector("#notice").textContent =
    `${result.meta.categoryLabel} / 表示範囲 ${result.meta.minHour}h-${result.meta.maxHour}h / 休憩合計 ${result.meta.totalStayTime}分 / スタート ${formatTimeOnly(result.meta.startMinutesAbsolute)} / ライト ${SUNSET_LABEL}-${SUNRISE_LABEL} / コース ${COURSE_TOTALS.dist.toFixed(1)}km +${COURSE_TOTALS.gain.toLocaleString()}m`;
  saveSettings();
}

function calculateCurrent() {
  return calculatePaceData(
    document.querySelector("#race-category").value,
    document.querySelector("#rest-pattern").value,
    document.querySelector("#strategy").value,
    document.querySelector("#min-hour").value,
    document.querySelector("#max-hour").value
  );
}

function saveSettings() {
  const settings = {
    raceCategory: document.querySelector("#race-category").value,
    restPattern: document.querySelector("#rest-pattern").value,
    strategy: document.querySelector("#strategy").value,
    minHour: document.querySelector("#min-hour").value,
    maxHour: document.querySelector("#max-hour").value,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Unable to save settings", error);
  }
}

function restoreSettings() {
  let settings = null;
  try {
    settings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch (error) {
    console.warn("Unable to restore settings", error);
  }
  if (!settings || typeof settings !== "object") return;
  setControlValue("#race-category", settings.raceCategory);
  setControlValue("#rest-pattern", settings.restPattern);
  setControlValue("#strategy", settings.strategy);
  setControlValue("#min-hour", settings.minHour);
  setControlValue("#max-hour", settings.maxHour);
}

function setControlValue(selector, value) {
  const control = document.querySelector(selector);
  if (!control || value === undefined || value === null) return;
  const stringValue = String(value);
  if (control.tagName === "SELECT") {
    const hasOption = Array.from(control.options).some((option) => option.value === stringValue);
    if (!hasOption) return;
  }
  control.value = stringValue;
}

function populateHourSelects() {
  const minSelect = document.querySelector("#min-hour");
  const maxSelect = document.querySelector("#max-hour");
  for (let hour = 20; hour <= 35; hour += 1) {
    minSelect.appendChild(new Option(`${hour}時間`, String(hour), hour === 28, hour === 28));
    maxSelect.appendChild(new Option(`${hour}時間`, String(hour), hour === 35, hour === 35));
  }
}

function syncCategoryControls() {
  const categoryKey = document.querySelector("#race-category").value;
  const category = categories[categoryKey] || categories.solo;
  const minSelect = document.querySelector("#min-hour");
  const maxSelect = document.querySelector("#max-hour");
  [minSelect, maxSelect].forEach((select) => {
    Array.from(select.options).forEach((option) => {
      option.disabled = Number(option.value) > category.maxHour;
    });
    if (Number(select.value) > category.maxHour) select.value = String(category.maxHour);
  });
}

function showWallpaper() {
  const minHour = clamp(parseInt(document.querySelector("#min-hour").value, 10) || 28, 1, 58);
  const categoryKey = document.querySelector("#race-category").value;
  const category = categories[categoryKey] || categories.solo;
  const wallpaperMax = Math.min(minHour + 2, category.maxHour);
  const result = calculatePaceData(
    categoryKey,
    document.querySelector("#rest-pattern").value,
    document.querySelector("#strategy").value,
    minHour,
    wallpaperMax
  );
  const svg = buildWallpaperSvg(result);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const image = document.querySelector("#wallpaper-image");
  const panel = document.querySelector("#wallpaper-panel");

  if (image.dataset.objectUrl) URL.revokeObjectURL(image.dataset.objectUrl);
  image.dataset.objectUrl = url;
  image.dataset.fileName = `sainokuni-100mile-${categoryKey}-${minHour}-${wallpaperMax}h.png`;
  image.src = url;
  document.querySelector("#wallpaper-title").textContent = `${category.label} ${minHour}h-${wallpaperMax}h 待ち受け画像`;
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function downloadWallpaperPng() {
  const image = document.querySelector("#wallpaper-image");
  if (!image.src) return;
  if (!image.complete) {
    image.addEventListener("load", downloadWallpaperPng, { once: true });
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1170;
  canvas.height = 2532;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const fileName = image.dataset.fileName || "sainokuni-100mile-pace.png";
    const file = new File([blob], fileName, { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Sainokuni 100mile pace plan" });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }

    const link = document.createElement("a");
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }, "image/png");
}

function closeWallpaper() {
  const image = document.querySelector("#wallpaper-image");
  if (image.dataset.objectUrl) {
    URL.revokeObjectURL(image.dataset.objectUrl);
    delete image.dataset.objectUrl;
  }
  image.removeAttribute("src");
  delete image.dataset.fileName;
  document.querySelector("#wallpaper-panel").hidden = true;
}

function buildWallpaperSvg(result) {
  const width = 1170;
  const height = 2532;
  const hours = result.headers.slice(3).map((header) => header.replace(" ペース", ""));
  const aidRows = result.rows.filter((row) => row.type === "aid");
  const tableX = 90;
  const tableWidth = 990;
  const tableY = 630;
  const tableBottom = 2220;
  const nameX = tableX + 28;
  const rowTop = 820;
  const rowHeight = 82;
  const colXs = [600, 790, 980];
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" fill="#f6f7f2"/>`,
    `<rect x="0" y="0" width="${width}" height="650" fill="#23533d"/>`,
    `<path d="M0 548 C228 474 422 640 660 544 C856 464 990 494 1170 410 L1170 682 L0 682 Z" fill="#527a45" opacity="0.72"/>`,
    `<path d="M0 600 C164 534 318 594 486 550 C694 496 836 618 1170 506 L1170 706 L0 706 Z" fill="#b15c25" opacity="0.36"/>`,
    `<rect x="${tableX}" y="${tableY}" width="${tableWidth}" height="${tableBottom - tableY}" rx="30" fill="#ffffff"/>`,
    textSvg(`彩の国100mile ${hours.join(" / ")} PLAN`, nameX, 710, 31, 900, "#17201b"),
    textSvg(`${result.meta.categoryLabel} / Start ${formatTimeOnly(result.meta.startMinutesAbsolute)} / Rest ${result.meta.restPattern} / ${result.meta.strategy}`, nameX, 750, 21, 700, "#647268"),
    textSvg("AID", nameX, 795, 24, 900, "#647268"),
    ...hours.map((hour, index) => textSvg(hour, colXs[index], 795, 29, 900, "#23533d", "middle")),
    `<line x1="${tableX}" y1="812" x2="${tableX + tableWidth}" y2="812" stroke="#d8e0d8" stroke-width="2"/>`,
    `<line x1="520" y1="760" x2="520" y2="${tableBottom}" stroke="#d8e0d8" stroke-width="3"/>`,
    `<line x1="695" y1="760" x2="695" y2="${tableBottom}" stroke="#d8e0d8" stroke-width="3"/>`,
    `<line x1="885" y1="760" x2="885" y2="${tableBottom}" stroke="#d8e0d8" stroke-width="3"/>`,
  ];

  aidRows.forEach((row, index) => {
    const y = rowTop + index * rowHeight;
    if (index > 0) parts.push(`<line x1="${tableX}" y1="${y - 24}" x2="${tableX + tableWidth}" y2="${y - 24}" stroke="#d8e0d8" stroke-width="2"/>`);
    const name = cleanCell(row.data[0]).replace(/100mile関門.*$/, "").replace(/100km参考.*$/, "").trim();
    parts.push(textSvg(name.slice(0, 19), nameX, y, 21, 900, "#17201b"));
    parts.push(textSvg(cleanCell(row.data[1]), nameX, y + 28, 18, 700, "#647268"));
    const stay = cleanCell(row.data[2]);
    if (stay !== "-") parts.push(textSvg(`滞在 ${stay}分`, nameX, y + 52, 18, 700, "#647268"));

    for (let col = 0; col < 3; col += 1) {
      const schedules = parseScheduleCell(row.data[col + 3]);
      const cell = String(row.data[col + 3]);
      if (cell.startsWith(HEADLIGHT_CELL_MARKER)) {
        parts.push(`<rect x="${colXs[col] - 78}" y="${y - 26}" width="156" height="68" rx="14" fill="#edf1f4"/>`);
        parts.push(`<path d="${makeHatchPath(colXs[col] - 78, y - 26, 156, 68, 12)}" stroke="#b8c0c9" stroke-width="3" opacity="0.65"/>`);
      }
      const firstColor = cell.includes("arrival-capped") ? "#d91e36" : "#17201b";
      const secondColor = cell.includes("hatched-yellow") ? "#8a5a00" : "#43505c";
      if (schedules.length <= 1) {
        const item = schedules[0] || { elapsed: "-", clock: "", label: "" };
        parts.push(textSvg(`${item.elapsed}${item.label}`, colXs[col], y + 4, 20, 900, firstColor, "middle"));
        if (item.clock) parts.push(textSvg(`(${item.clock})`, colXs[col], y + 30, 18, 800, "#43505c", "middle"));
      } else {
        parts.push(textSvg(`${schedules[0].elapsed}${schedules[0].label}`, colXs[col], y - 8, 18, 900, firstColor, "middle"));
        parts.push(textSvg(`${schedules[1].elapsed}${schedules[1].label}`, colXs[col], y + 28, 18, 900, secondColor, "middle"));
      }
    }
  });

  parts.push("</svg>");
  return parts.join("");
}

function parseScheduleCell(value) {
  const text = cleanCell(value);
  const matches = Array.from(text.matchAll(/(\d{2}:\d{2}) \((\d{2}:\d{2})\)(着|発)?/g));
  return matches.map((match) => ({
    elapsed: match[1],
    clock: match[2],
    label: match[3] || "",
  }));
}

function cleanCell(value) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(String(value).replace(HEADLIGHT_CELL_MARKER, "").replace(/<br\s*\/?>/gi, " "), "text/html");
  return doc.body.textContent.replace(/\s+/g, " ").trim();
}

function makeHatchPath(x, y, width, height, gap) {
  const lines = [];
  for (let offset = -height; offset < width; offset += gap) {
    const x1 = x + Math.max(offset, 0);
    const y1 = y + Math.max(-offset, 0);
    const x2 = x + Math.min(offset + height, width);
    const y2 = y + Math.min(height, width - offset);
    lines.push(`M${x1} ${y1} L${x2} ${y2}`);
  }
  return lines.join(" ");
}

function textSvg(content, x, y, size, weight, color, anchor = "start") {
  return `<text x="${x}" y="${y}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Yu Gothic', sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}" letter-spacing="0">${escapeXml(content)}</text>`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

document.querySelector("#pace-form").addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});

document.querySelectorAll("#pace-form input, #pace-form select").forEach((control) => {
  control.addEventListener("change", update);
});

document.querySelector("#wallpaper-button").addEventListener("click", showWallpaper);
document.querySelector("#wallpaper-png").addEventListener("click", downloadWallpaperPng);
document.querySelector("#wallpaper-close").addEventListener("click", closeWallpaper);

populateHourSelects();
restoreSettings();
update();
