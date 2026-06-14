const $ = (id) => document.getElementById(id);

let config = null;
let eventSource = null;
let running = false;
let latestMetrics = null;
let currentAct = 1;
let finalCompleted = false;

const selectedChoices = ["press-ren", "audit-security-bot", "expose-system"];
const completedActs = new Set();
const selectedClues = new Set(["elevator-gap", "paper-note"]);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function init() {
  config = await loadConfig();
  renderCase();
  renderStory();
  renderOverviews();
  renderCaseContext();
  renderChoices();
  renderClues();
  renderSuspects(config.suspects.map(initialSuspectState));
  renderMetrics(config.baseState, "初始状态");
  renderDossiers();
  bindEvents();
  setRunning(false);
}

async function loadConfig() {
  try {
    const response = await fetch("/api/config");
    if (!response.ok) throw new Error("无法加载案件配置");
    return await response.json();
  } catch (error) {
    if (window.neonCaseConfig) return window.neonCaseConfig;
    throw error;
  }
}

function bindEvents() {
  $("runButton").addEventListener("click", startRun);
  $("rerunButton").addEventListener("click", resetInvestigation);
  $("stopButton").addEventListener("click", stopRun);
}

function renderCase() {
  const item = config.caseFile;
  $("caseTitle").textContent = item.title;
  $("stageTitle").textContent = item.title;
  $("caseMeta").textContent = `${item.city} / ${item.year}`;
  $("casePremise").textContent = item.premise;
  $("playerRole").textContent = item.playerRole;
  $("victim").textContent = item.victim;
  $("mystery").textContent = item.mystery;
  $("stageObjective").textContent = item.objective;
}

function renderStory() {
  $("openingStory").innerHTML = config.caseFile.opening.map((text) => `<p>${escapeHtml(text)}</p>`).join("");
  $("playerMemory").innerHTML = config.caseFile.playerMemory.map((text) => `<li>${escapeHtml(text)}</li>`).join("");
}

function renderOverviews() {
  $("characterOverview").innerHTML = config.caseFile.characterOverview.map((item) => `
    <article class="overview-card">
      ${item.image ? imageTag(item.image, item.name, "overview-portrait") : ""}
      <span>${escapeHtml(item.role)}</span>
      <strong>${escapeHtml(item.name)}</strong>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join("");

  $("plotOverview").innerHTML = config.caseFile.plotOverview.map((item, index) => `
    <article class="plot-card">
      <span>ACT ${index + 1}</span>
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join("");
}

function renderCaseContext() {
  $("timelineList").innerHTML = config.caseFile.timeline.map((item) => `
    <article class="timeline-item">
      <time>${escapeHtml(item.time)}</time>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.text)}</p>
      </div>
    </article>
  `).join("");

  $("truthThreads").innerHTML = config.caseFile.truthThreads.map((item, index) => `
    <article class="thread-card">
      <span>0${index + 1}</span>
      <strong>${escapeHtml(item.name)}</strong>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join("");

  $("howToPlay").innerHTML = config.caseFile.howToPlay.map((text) => `<li>${escapeHtml(text)}</li>`).join("");
  renderCaseMap();
}

function renderChoices() {
  syncChoicesFrom(1);
  $("choiceSlots").innerHTML = config.acts.map((act, index) => {
    const selected = getChoice(selectedChoices[index]);
    return `
      <div class="choice-slot ${choiceSlotClass(act.id)}">
        <div class="slot-head">
          <span>ACT ${act.id}</span>
          <strong>${escapeHtml(act.title)}</strong>
        </div>
        <select data-choice-slot="${index}" aria-label="${escapeHtml(act.title)}" ${act.id !== currentAct || running || finalCompleted ? "disabled" : ""}>
          ${choicesForAct(act.id).map((choice) => `
            <option value="${choice.id}" ${selectedChoices[index] === choice.id ? "selected" : ""}>${escapeHtml(choice.label)}</option>
          `).join("")}
        </select>
        <p id="choice-desc-${index}">${escapeHtml(selected.description)}</p>
        <div class="slot-status">${slotStatus(act.id)}</div>
        ${lockedSlotOverlay(act.id)}
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-choice-slot]").forEach((select) => {
    select.addEventListener("change", () => {
      const index = Number(select.dataset.choiceSlot);
      selectedChoices[index] = select.value;
      syncChoicesFrom(index + 2);
      renderChoices();
      updateCurrentActCopy();
    });
  });
  updateCurrentActCopy();
}

function choicesForAct(actId) {
  if (actId === 1) return config.choices.filter((choice) => choice.act === 1);
  const previousChoice = selectedChoices[actId - 2];
  const unlocked = config.choices.filter((choice) => choice.act === actId && (!choice.after || choice.after.includes(previousChoice)));
  return unlocked.length ? unlocked : config.choices.filter((choice) => choice.act === actId);
}

function ensureChoiceForAct(actId) {
  const options = choicesForAct(actId);
  if (!options.length) return;
  if (!options.some((choice) => choice.id === selectedChoices[actId - 1])) {
    selectedChoices[actId - 1] = options[0].id;
  }
}

function syncChoicesFrom(actId) {
  for (let id = Math.max(1, actId); id <= 3; id += 1) {
    ensureChoiceForAct(id);
  }
}

function choiceSlotClass(actId) {
  if (completedActs.has(actId)) return "completed";
  if (actId === currentAct && !finalCompleted) return "active";
  return "locked";
}

function slotStatus(actId) {
  if (completedActs.has(actId)) return "已完成";
  if (actId === currentAct && !finalCompleted) return "当前可推演";
  return "等待上一幕完成";
}

function lockedSlotOverlay(actId) {
  if (completedActs.has(actId) || (actId === currentAct && !finalCompleted)) return "";
  const reason = finalCompleted ? "案件已结算" : "完成上一幕后解锁";
  return `<div class="slot-lock" aria-hidden="true"><span>${reason}</span></div>`;
}

function renderClues() {
  $("clueList").innerHTML = config.clues.map((clue) => `
    <label class="clue-card ${selectedClues.has(clue.id) ? "active" : ""}">
      <input type="checkbox" value="${clue.id}" ${selectedClues.has(clue.id) ? "checked" : ""} />
      <span class="clue-type">${escapeHtml(clue.type)}</span>
      <strong>${escapeHtml(clue.name)}</strong>
      <small>${escapeHtml(clue.text)}</small>
    </label>
  `).join("");

  document.querySelectorAll(".clue-card input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) selectedClues.add(input.value);
      else selectedClues.delete(input.value);
      input.closest(".clue-card").classList.toggle("active", input.checked);
    });
  });
}

function getChoice(id) {
  return config.choices.find((choice) => choice.id === id) || config.choices[0];
}

function resetInvestigation() {
  stopRun();
  currentAct = 1;
  finalCompleted = false;
  latestMetrics = null;
  completedActs.clear();
  $("liveFeed").innerHTML = "";
  $("reportBody").innerHTML = "<p>选择当前幕行动与公开线索后，点击“推演当前幕”。每一幕完成后才会解锁下一幕。</p>";
  $("endingMeta").textContent = "未生成";
  $("phaseTicker").textContent = "等待第 1 幕启动";
  $("activeSpeaker").textContent = "等待角色入场";
  $("actCounter").textContent = "0 / 3";
  $("streamState").textContent = "待启动";
  $("riskBadge").textContent = "未推演";
  $("riskBadge").className = "risk-pill neutral";
  renderChoices();
  renderSuspects(config.suspects.map(initialSuspectState));
  renderMetrics(config.baseState, "初始状态");
}

function prepareActRun() {
  latestMetrics = null;
  if (currentAct === 1 && completedActs.size === 0) {
    $("liveFeed").innerHTML = "";
  }
  if (!finalCompleted) {
    $("reportBody").innerHTML = "<p>推演进行中。实时证词会说明：这个选择发现了什么、它证明了什么、它为什么会解锁下一幕。</p>";
    $("endingMeta").textContent = "推演中";
  }
  $("phaseTicker").textContent = "连接事件流";
  $("activeSpeaker").textContent = "等待角色入场";
  $("actCounter").textContent = `${currentAct - 1} / 3`;
  $("streamState").textContent = "连接中";
  $("riskBadge").textContent = "推演中";
  $("riskBadge").className = "risk-pill neutral";
}

function startRun() {
  if (running || finalCompleted) return;
  stopRun();
  prepareActRun();
  setRunning(true);
  renderChoices();

  const params = new URLSearchParams({
    choices: JSON.stringify(selectedChoices.slice(0, currentAct)),
    publicClues: JSON.stringify([...selectedClues]),
    actLimit: String(currentAct),
    focusAct: String(currentAct)
  });

  eventSource = new EventSource(`/api/play?${params.toString()}`);
  eventSource.addEventListener("start", (event) => handleStart(JSON.parse(event.data)));
  eventSource.addEventListener("metrics", (event) => handleMetrics(JSON.parse(event.data)));
  eventSource.addEventListener("act-start", (event) => handleActStart(JSON.parse(event.data)));
  eventSource.addEventListener("dialogue", (event) => handleDialogue(JSON.parse(event.data)));
  eventSource.addEventListener("state-shift", (event) => handleStateShift(JSON.parse(event.data)));
  eventSource.addEventListener("step-complete", (event) => handleStepComplete(JSON.parse(event.data)));
  eventSource.addEventListener("report", (event) => renderReport(JSON.parse(event.data)));
  eventSource.addEventListener("done", () => {
    $("streamState").textContent = finalCompleted ? "已完成" : "本幕完成";
    setRunning(false);
    renderChoices();
    closeEventSource();
  });
  eventSource.onerror = () => {
    $("streamState").textContent = "连接中断";
    $("phaseTicker").textContent = "请重新启动推演";
    setRunning(false);
    closeEventSource();
  };
}

function stopRun() {
  closeEventSource();
  setRunning(false);
}

function closeEventSource() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
}

function setRunning(value) {
  running = value;
  $("runButton").disabled = value || finalCompleted;
  $("rerunButton").disabled = value;
  $("stopButton").disabled = !value;
  if (!value) updateCurrentActCopy();
}

function handleStart(data) {
  $("streamState").textContent = "事件流运行中";
  $("phaseTicker").textContent = data.message;
  appendSystem(data.message);
}

function handleMetrics(data) {
  if (!data.metrics) return;
  latestMetrics = data.metrics;
  renderMetrics(data.metrics, data.label);
  if (data.metrics.cast) renderSuspects(data.metrics.cast);
}

function handleActStart(data) {
  $("actCounter").textContent = `${data.act.id - 1} / 3`;
  $("phaseTicker").textContent = `${data.act.title} · ${data.act.time}`;
  $("riskBadge").textContent = `${data.risk.label} ${data.risk.score}`;
  $("riskBadge").className = `risk-pill ${data.risk.tone}`;
  appendSystem(`${data.act.title}：玩家选择“${data.choice.label}”。`);
  if (data.state?.cast) renderSuspects(data.state.cast);
}

function handleDialogue(item) {
  $("activeSpeaker").textContent = item.speaker;
  const article = document.createElement("article");
  article.className = `feed-item ${item.agentId}`;
  article.innerHTML = `
    <div class="feed-avatar">${escapeHtml(item.speaker.slice(0, 2))}</div>
    <div class="feed-body">
      <div class="feed-meta">
        <strong>${escapeHtml(item.speaker)}</strong>
        <span>${escapeHtml(item.time)}</span>
      </div>
      <p>${escapeHtml(item.text)}</p>
    </div>
  `;
  $("liveFeed").prepend(article);
}

function handleStateShift(data) {
  $("phaseTicker").textContent = `${data.label} · ${data.reason}`;
  $("riskBadge").textContent = `${data.risk.label} ${data.risk.score}`;
  $("riskBadge").className = `risk-pill ${data.risk.tone}`;
  renderMetrics(data.state, data.label);
  if (data.state?.cast) renderSuspects(data.state.cast);
  appendSystem("局势更新：证词、线索权重和后续可选路径已改变。");
}

function handleStepComplete(data) {
  completedActs.add(data.completedAct);
  currentAct = Math.min(3, data.nextAct);
  ensureChoiceForAct(currentAct);
  $("actCounter").textContent = `${data.completedAct} / 3`;
  $("streamState").textContent = "本幕完成";
  $("phaseTicker").textContent = data.message;
  $("riskBadge").textContent = `${data.risk.label} ${data.risk.score}`;
  $("riskBadge").className = `risk-pill ${data.risk.tone}`;
  renderMetrics(data.state, `第 ${data.completedAct} 幕后`);
  if (data.state?.cast) renderSuspects(data.state.cast);
  renderChoices();
  appendSystem(data.message);
}

function appendSystem(text) {
  const item = document.createElement("article");
  item.className = "feed-system";
  item.textContent = text;
  $("liveFeed").prepend(item);
}

function renderCaseMap() {
  const mapNode = $("caseMap");
  const graph = config.caseFile.relationshipGraph;
  if (!mapNode || !graph) return;

  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const clipDefs = graph.nodes.map((node, index) => node.image
    ? `<clipPath id="node-clip-${index}"><circle r="6.1"></circle></clipPath>`
    : "").join("");
  const edges = graph.edges.map((edge) => {
    const from = nodes.get(edge.from);
    const to = nodes.get(edge.to);
    if (!from || !to) return "";
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    return `
      <line class="graph-edge" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" />
      <text class="graph-label" x="${mx}" y="${my}">${escapeHtml(edge.label)}</text>
    `;
  }).join("");

  const nodeMarkup = graph.nodes.map((node, index) => `
    <g class="graph-node ${escapeHtml(node.tone)}" transform="translate(${node.x} ${node.y})">
      ${node.image
        ? `<image class="node-image" href="${escapeHtml(node.image)}" x="-6.1" y="-6.1" width="12.2" height="12.2" preserveAspectRatio="xMidYMid slice" clip-path="url(#node-clip-${index})"></image><circle class="node-frame" r="6.3"></circle>`
        : `<circle class="node-frame no-image" r="5.8"></circle>`}
      <text class="node-title" y="-8">${escapeHtml(node.label)}</text>
      <text class="node-sub" y="11">${escapeHtml(node.sub)}</text>
    </g>
  `).join("");

  mapNode.innerHTML = `
    <svg viewBox="0 0 100 100" role="img" aria-label="人物关系与情节图谱">
      <defs>${clipDefs}</defs>
      ${edges}
      ${nodeMarkup}
    </svg>
  `;
}

function initialSuspectState(suspect) {
  return {
    id: suspect.id,
    trust: suspect.trust,
    suspicion: suspect.suspicion,
    concealment: suspect.concealment,
    pressure: suspect.pressure
  };
}

function renderMetrics(metrics, label) {
  const metaNode = $("metricMeta");
  const gridNode = $("metricsGrid");
  if (!metaNode || !gridNode) return;

  const rows = [
    ["truth", "真相闭合度", "cyan"],
    ["memory", "记忆恢复", "green"],
    ["pressure", "系统压力", "rose"],
    ["trust", "整体信任", "amber"],
    ["systemSuspicion", "系统嫌疑", "violet"]
  ];
  metaNode.textContent = label;
  gridNode.innerHTML = rows.map(([key, title, tone]) => {
    const value = Number(metrics[key] || 0);
    return `
      <div class="metric-card">
        <div class="bar-plot">
          <div class="bar-axis"><span>100</span><span>50</span><span>0</span></div>
          <div class="bar-column">
            <i class="${tone}" style="height:${value}%"></i>
          </div>
        </div>
        <div class="metric-top"><span>${title}</span><strong>${value}</strong></div>
      </div>
    `;
  }).join("");
}

function renderSuspects(castState) {
  const gridNode = $("suspectGrid");
  if (!gridNode) return;

  const stateMap = new Map(castState.map((item) => [item.id, item]));
  gridNode.innerHTML = config.suspects.map((suspect) => {
    const state = stateMap.get(suspect.id) || initialSuspectState(suspect);
    const heat = Math.max(state.suspicion, state.concealment);
    return `
      <article class="suspect-card ${suspect.color}" style="--heat:${heat}%">
        ${imageTag(suspect.image, suspect.name, "suspect-portrait")}
        <div class="suspect-head">
          <span>${escapeHtml(suspect.role)}</span>
          <strong>${escapeHtml(suspect.name)}</strong>
        </div>
        <p>${escapeHtml(suspect.firstImpression || suspect.signal)}</p>
        <div class="suspect-signal">${escapeHtml(suspect.signal)}</div>
        <div class="mini-bars">
          ${miniBar("信任", state.trust, "green")}
          ${miniBar("嫌疑", state.suspicion, "rose")}
          ${miniBar("隐瞒", state.concealment, "amber")}
        </div>
      </article>
    `;
  }).join("");
}

function miniBar(label, value, tone) {
  return `
    <div class="mini-bar">
      <span>${escapeHtml(label)}</span>
      <div><i class="${tone}" style="width:${value}%"></i></div>
      <strong>${value}</strong>
    </div>
  `;
}

function renderDossiers() {
  $("dossierGrid").innerHTML = config.suspects.map((suspect) => `
    <article class="dossier-card ${suspect.color}">
      ${imageTag(suspect.image, suspect.name, "dossier-portrait")}
      <div class="dossier-title">
        <span>${escapeHtml(suspect.role)}</span>
        <strong>${escapeHtml(suspect.name)}</strong>
      </div>
      ${dossierRow("关系", suspect.relationship)}
      ${dossierRow("动机", suspect.motive)}
      ${dossierRow("知道什么", suspect.knows)}
      ${dossierRow("正在隐瞒", suspect.liesAbout)}
      ${dossierRow("与你有关", suspect.playerHook)}
    </article>
  `).join("");
}

function dossierRow(label, text) {
  return `
    <div class="dossier-row">
      <span>${escapeHtml(label)}</span>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

function imageTag(src, alt, className) {
  if (!src) return "";
  return `<img class="${escapeHtml(className)}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />`;
}

function renderReport(report) {
  finalCompleted = true;
  completedActs.add(3);
  $("actCounter").textContent = "3 / 3";
  $("streamState").textContent = "已完成";
  $("phaseTicker").textContent = "三幕推演完成";
  $("endingMeta").textContent = report.title;
  $("reportBody").innerHTML = `
    <div class="ending-card ${escapeHtml(report.tone)}">
      <span>ENDING</span>
      <strong>${escapeHtml(report.title)}</strong>
      <p>${escapeHtml(report.summary)}</p>
    </div>
    <div class="report-section">
      <h3>已选择行动</h3>
      ${report.chosen.map((item) => `<div class="report-line">${escapeHtml(item)}</div>`).join("")}
    </div>
    <div class="report-section">
      <h3>关键证据</h3>
      ${report.evidence.map((item) => `
        <div class="report-line ${item.public ? "public" : ""}">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${item.public ? "已公开" : "未公开"}</span>
        </div>
      `).join("")}
    </div>
    <div class="report-section">
      <h3>遗漏与下一步</h3>
      ${report.missed.concat(report.recommendations).map((item) => `<div class="report-line">${escapeHtml(item)}</div>`).join("")}
    </div>
  `;
  if (report.finalState) {
    latestMetrics = report.finalState;
    renderMetrics(report.finalState, "最终状态");
    if (report.finalState.cast) renderSuspects(report.finalState.cast);
  }
  renderChoices();
  updateCurrentActCopy();
}

function updateCurrentActCopy() {
  const act = config?.acts?.[currentAct - 1];
  if (!act) return;
  $("stepMeta").textContent = finalCompleted ? "三幕已完成" : `第 ${currentAct} 幕${running ? "推演中" : "待推演"}`;
  $("currentActTitle").textContent = finalCompleted ? "案件已结算" : act.title;
  $("currentActHint").textContent = finalCompleted
    ? "可以点击顶部“重置”重新调查，尝试另一条真相路线。"
    : `${act.focus} 当前行动：${getChoice(selectedChoices[currentAct - 1]).label}`;
  $("runButton").querySelector("span").textContent = finalCompleted ? "推演已完成" : `推演第 ${currentAct} 幕`;
  $("runButton").disabled = running || finalCompleted;
}

init().catch((error) => {
  $("streamState").textContent = "启动失败";
  $("phaseTicker").textContent = error.message;
  renderArchiveError(error);
  console.error(error);
});

function renderArchiveError(error) {
  const message = escapeHtml(error.message || "案件加载失败，请刷新页面");
  ["openingStory", "characterOverview", "timelineList", "truthThreads", "dossierGrid"].forEach((id) => {
    const node = $(id);
    if (node) node.innerHTML = `<article class="archive-error">${message}</article>`;
  });
}
