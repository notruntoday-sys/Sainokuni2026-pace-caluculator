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
const LOOP_SPLIT_STRATEGY = "9・11・13時間";
const LOOP_SPLIT_TARGET_HOURS = {
  north: 9,
  south1: 11,
  south2: 13,
};
const LOOP_END_INDEXES = {
  north: 5,
  south1: 11,
  south2: 17,
};

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

const elevationSectionStats = [{"ele":108,"gain":0,"loss":0,"cumGain":0,"cumLoss":0},{"ele":442,"gain":1024,"loss":686,"cumGain":1024,"cumLoss":686},{"ele":345,"gain":317,"loss":419,"cumGain":1341,"cumLoss":1105},{"ele":868,"gain":1234,"loss":704,"cumGain":2575,"cumLoss":1809},{"ele":827,"gain":432,"loss":474,"cumGain":3007,"cumLoss":2283},{"ele":107,"gain":310,"loss":1038,"cumGain":3317,"cumLoss":3321},{"ele":236,"gain":438,"loss":299,"cumGain":3755,"cumLoss":3620},{"ele":756,"gain":779,"loss":263,"cumGain":4534,"cumLoss":3883},{"ele":577,"gain":622,"loss":799,"cumGain":5156,"cumLoss":4682},{"ele":144,"gain":671,"loss":1110,"cumGain":5827,"cumLoss":5792},{"ele":278,"gain":690,"loss":553,"cumGain":6517,"cumLoss":6345},{"ele":108,"gain":161,"loss":335,"cumGain":6678,"cumLoss":6680},{"ele":246,"gain":444,"loss":307,"cumGain":7122,"cumLoss":6987},{"ele":772,"gain":779,"loss":251,"cumGain":7901,"cumLoss":7238},{"ele":568,"gain":604,"loss":811,"cumGain":8505,"cumLoss":8049},{"ele":130,"gain":699,"loss":1134,"cumGain":9204,"cumLoss":9183},{"ele":291,"gain":704,"loss":541,"cumGain":9908,"cumLoss":9724},{"ele":106,"gain":152,"loss":335,"cumGain":10060,"cumLoss":10059}];

const elevationProfile = [[0,108,0],[1,96,37],[2,95,45],[3,104,63],[4,292,244],[5,342,331],[6,191,331],[7,299,435],[8,313,489],[9,449,625],[10,351,673],[11,387,750],[12,592,953],[13,647,1024],[14,486,1024],[15,457,1073],[16,397,1139],[17,275,1139],[18,149,1139],[19,146,1139],[20,297,1292],[21,416,1412],[22,492,1512],[23,409,1606],[24,319,1626],[25,183,1661],[26,347,1823],[27,404,1914],[28,543,2054],[29,662,2175],[30,846,2371],[31,712,2389],[32,867,2566],[33,862,2611],[34,828,2700],[35,800,2738],[36,806,2778],[37,855,2883],[38,863,2942],[39,867,3007],[40,814,3062],[41,816,3086],[42,768,3117],[43,755,3184],[44,656,3184],[45,571,3184],[46,476,3184],[47,431,3211],[48,329,3230],[49,273,3238],[50,309,3309],[51,240,3317],[52,117,3317],[53,109,3317],[54,113,3325],[55,136,3359],[56,83,3390],[57,77,3390],[58,209,3518],[59,237,3585],[60,186,3618],[61,306,3738],[62,236,3755],[63,259,3803],[64,171,3803],[65,242,3903],[66,168,3920],[67,256,4004],[68,452,4209],[69,584,4335],[70,718,4481],[71,660,4534],[72,557,4544],[73,448,4544],[74,416,4607],[75,232,4607],[76,393,4771],[77,417,4832],[78,590,5001],[79,583,5066],[80,572,5121],[81,577,5156],[82,445,5174],[83,514,5249],[84,285,5265],[85,400,5378],[86,342,5439],[87,433,5564],[88,445,5664],[89,423,5736],[90,443,5811],[91,257,5827],[92,144,5827],[93,191,5871],[94,323,6017],[95,280,6025],[96,380,6145],[97,415,6189],[98,438,6304],[99,486,6370],[100,442,6412],[101,407,6452],[102,321,6468],[103,303,6517],[104,343,6604],[105,368,6670],[106,158,6670],[107,113,6670],[108,106,6678],[109,146,6721],[110,147,6735],[111,80,6759],[112,114,6788],[113,259,6952],[114,164,6952],[115,246,7044],[116,304,7122],[117,271,7162],[118,236,7170],[119,172,7198],[120,241,7287],[121,211,7326],[122,374,7496],[123,504,7623],[124,580,7711],[125,766,7901],[126,581,7901],[127,523,7911],[128,409,7920],[129,252,7974],[130,294,8031],[131,408,8177],[132,482,8262],[133,616,8412],[134,567,8420],[135,568,8486],[136,487,8521],[137,550,8620],[138,516,8662],[139,467,8681],[140,409,8719],[141,270,8751],[142,280,8834],[143,253,8915],[144,193,8948],[145,406,9204],[146,167,9204],[147,143,9218],[148,260,9329],[149,318,9416],[150,358,9488],[151,380,9544],[152,435,9635],[153,458,9713],[154,476,9774],[155,440,9821],[156,371,9851],[157,323,9868],[158,275,9908],[159,368,10034],[160,302,10060],[161,120,10060],[162,108,10060],[162.8,106,10060]];

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

  const sections = buildSections(restPattern, categoryKey, strategy);
  const weights = buildWeights(sections, strategy);

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

  const headers = ["エイド", "区間 / 累積 / 上昇下降", "滞在"];
  for (let h = minHour; h <= maxHour; h += 1) headers.push(`${h}h ペース`);
  const relayLegs = buildRelayLegs(schedules, sections, minHour, maxHour, startMinutesAbsolute);

  const rows = [];
  let cumDist = 0;
  for (let i = 0; i < sections.length; i += 1) {
    cumDist += sections[i].dist;
    const elevation = elevationSectionStats[i];
    const cutoffText = sections[i].cutoff === null
      ? ""
      : `<br><span class="cutoff-tag">${category.label}関門 ${formatElapsed(sections[i].cutoff)} (${formatClockLabel(startMinutesAbsolute + sections[i].cutoff)})</span>`;
    const refText = sections[i].refCutoff === null ? "" : `<br><span class="sub-tag">100km参考 ${formatClockLabel(7 * 60 + sections[i].refCutoff)}</span>`;
    const aidRow = [
      `${sections[i].name}<br><span class="sub-tag">${sections[i].loop}</span>${cutoffText}${refText}`,
      i === 0
        ? `<span class="elevation-cell">+0 / -0</span>`
        : `<span class="elevation-cell">${sections[i].dist.toFixed(1)}k / ${cumDist.toFixed(1)}k</span><span class="elevation-cell">+${elevation.cumGain} / -${elevation.cumLoss}</span>`,
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
      const nextElevation = elevationSectionStats[i + 1];
      const paceRow = ["区間", `<span class="elevation-cell">${next.dist.toFixed(1)}k</span><span class="elevation-cell">+${nextElevation.gain} / -${nextElevation.loss}</span>`, ""];
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

function buildWeights(sections, strategy) {
  const baseWeights = [];
  for (let i = 1; i < sections.length; i += 1) {
    baseWeights.push(sections[i].dist * sections[i].coef);
  }

  if (strategy === LOOP_SPLIT_STRATEGY) {
    return buildLoopSplitWeights(sections, baseWeights);
  }

  const totalBaseWeight = baseWeights.reduce((sum, value) => sum + value, 0);
  const weights = [];
  let cumWeight = 0;
  baseWeights.forEach((weight) => {
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
  return weights;
}

function buildLoopSplitWeights(sections, baseWeights) {
  const groups = {
    north: { raw: 0, stay: 0 },
    south1: { raw: 0, stay: 0 },
    south2: { raw: 0, stay: 0 },
  };

  for (let i = 1; i < sections.length; i += 1) {
    const loop = getLoopKey(sections[i]);
    groups[loop].raw += baseWeights[i - 1];
    if (i !== LOOP_END_INDEXES[loop]) groups[loop].stay += sections[i].stayTime;
  }

  return baseWeights.map((weight, index) => {
    const sectionIndex = index + 1;
    const loop = getLoopKey(sections[sectionIndex]);
    const targetRunTime = LOOP_SPLIT_TARGET_HOURS[loop] * 60 - groups[loop].stay;
    return (targetRunTime * weight) / groups[loop].raw;
  });
}

function getLoopKey(section) {
  if (section.group === "north") return "north";
  if (section.group === "south1") return "south1";
  return "south2";
}

function buildRelayLegs(schedules, sections, minHour, maxHour, startMinutesAbsolute) {
  const legs = [
    { label: "North", group: "north", from: 0, to: 5 },
    { label: "South1", group: "south1", from: 5, to: 11 },
    { label: "South2", group: "south2", from: 11, to: 17 },
  ];

  return legs.map((leg) => {
    const distance = sections.slice(leg.from + 1, leg.to + 1).reduce((sum, section) => sum + section.dist, 0);
    const gain = elevationSectionStats.slice(leg.from + 1, leg.to + 1).reduce((sum, section) => sum + section.gain, 0);
    const loss = elevationSectionStats.slice(leg.from + 1, leg.to + 1).reduce((sum, section) => sum + section.loss, 0);
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
    return { ...leg, distance, gain, loss, cells, startName: sections[leg.from].name, endName: sections[leg.to].name };
  });
}

function buildSections(restPattern, categoryKey, strategy) {
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
    if (strategy === LOOP_SPLIT_STRATEGY && section.base) stayTime = 30;
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
    distanceCell.innerHTML = `${leg.distance.toFixed(1)}k<span>+${leg.gain} / -${leg.loss}</span>`;
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

function renderElevationChart() {
  const svg = document.querySelector("#elevation-chart");
  const total = document.querySelector("#elevation-total");
  if (!svg || !total) return;

  const width = 1000;
  const height = 260;
  const pad = { left: 54, right: 24, top: 18, bottom: 34 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const maxKm = 162.8;
  const maxGain = Math.ceil(elevationProfile.at(-1)[2] / 1000) * 1000;
  const maxEle = Math.ceil(Math.max(...elevationProfile.map((point) => point[1])) / 100) * 100;
  const x = (km) => pad.left + (km / maxKm) * plotW;
  const yGain = (gain) => pad.top + plotH - (gain / maxGain) * plotH;
  const yEle = (ele) => pad.top + plotH - (ele / maxEle) * plotH * 0.72;
  const gainPoints = elevationProfile.map(([km, , gain]) => `${x(km).toFixed(1)},${yGain(gain).toFixed(1)}`).join(" ");
  const elePoints = elevationProfile.map(([km, ele]) => `${x(km).toFixed(1)},${yEle(ele).toFixed(1)}`).join(" ");
  const eleArea = `${pad.left},${pad.top + plotH} ${elePoints} ${x(maxKm)},${pad.top + plotH}`;
  const ticks = [0, 2500, 5000, 7500, 10000];
  const aidKms = [];
  let cumKm = 0;
  baseSections.forEach((section, index) => {
    cumKm += section.dist;
    if (index > 0 && (section.base || index === baseSections.length - 1)) aidKms.push({ km: cumKm, label: section.loop });
  });

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = `
    <rect width="${width}" height="${height}" rx="8" fill="#ffffff"></rect>
    ${ticks.map((tick) => `<line x1="${pad.left}" y1="${yGain(tick)}" x2="${width - pad.right}" y2="${yGain(tick)}" stroke="#e3e8e3"></line><text x="${pad.left - 10}" y="${yGain(tick) + 4}" text-anchor="end" class="chart-label">${tick.toLocaleString()}</text>`).join("")}
    ${aidKms.map((aid) => `<line x1="${x(aid.km)}" y1="${pad.top}" x2="${x(aid.km)}" y2="${pad.top + plotH}" stroke="#cfd8cf" stroke-dasharray="4 5"></line><text x="${x(aid.km)}" y="${height - 10}" text-anchor="middle" class="chart-label">${aid.label.replace("終わり", "")}</text>`).join("")}
    <polygon points="${eleArea}" fill="#dbeafe" opacity="0.55"></polygon>
    <polyline points="${elePoints}" fill="none" stroke="#7aa0c8" stroke-width="2" opacity="0.75"></polyline>
    <polyline points="${gainPoints}" fill="none" stroke="#23533d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
    <line x1="${pad.left}" y1="${pad.top + plotH}" x2="${width - pad.right}" y2="${pad.top + plotH}" stroke="#bfc8bf"></line>
    <text x="${width - pad.right}" y="${pad.top + 14}" text-anchor="end" class="chart-note">緑: 累積上昇 / 青: 標高</text>
    <text x="${pad.left}" y="${height - 10}" class="chart-label">0km</text>
    <text x="${width - pad.right}" y="${height - 10}" text-anchor="end" class="chart-label">162.8km</text>
  `;
  total.textContent = `GPX累積 +${elevationProfile.at(-1)[2].toLocaleString()}m`;
}

function cleanLegName(name) {
  return name.replace(/^Start:/, "").replace(/^Goal:/, "");
}

function update() {
  syncCategoryControls();
  const result = calculateCurrent();
  renderMemberSummary(result);
  renderElevationChart();
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
