const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");
const config = require("./case-data");

const rootDir = __dirname;
const imageDir = path.resolve(rootDir, "角色图片");
const port = Number(process.env.PORT || 8797);
const { caseFile, suspects, clues, choices, acts, baseState } = config;
const defaultChoices = ["press-ren", "audit-security-bot", "expose-system"];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function json(res, payload) {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function sendSse(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function parseJsonParam(url, name, fallback) {
  try {
    const raw = url.searchParams.get(name);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function createRun(input) {
  const selectedIds = Array.isArray(input.choices) && input.choices.length
    ? input.choices
    : defaultChoices;
  const publicClues = Array.isArray(input.publicClues)
    ? input.publicClues
    : ["elevator-gap", "paper-note"];
  const actLimit = clampAct(input.actLimit || selectedIds.length || 1);
  const focusAct = clampAct(input.focusAct || actLimit);
  const chosen = buildChoicePath(selectedIds, actLimit);
  const state = { ...baseState };
  const cast = suspects.map((item) => ({ ...item }));
  const clueDeck = clues.map((item) => ({ ...item, public: publicClues.includes(item.id) }));
  const events = [];

  events.push({
    event: "start",
    data: {
      message: "案件沙盘启动：记住核心规则，第一句谎言只是入口，不是结案答案。",
      caseFile,
      selectedChoices: chosen.map((item) => item.id),
      publicClues,
      actLimit,
      focusAct
    }
  });

  if (focusAct === 1) {
    emitMetrics(events, "初始状态", state, cast);
  }

  chosen.slice(0, actLimit).forEach((choice, index) => {
    const act = acts[index];
    applyChoice(state, cast, choice);
    applyPublicClues(state, cast, clueDeck, index);

    if (act.id !== focusAct) return;

    events.push({
      event: "act-start",
      data: {
        act,
        choice,
        state: publicState(state, cast),
        risk: riskLabel(state)
      }
    });

    buildDialogue(choice, act, state, cast, clueDeck).forEach((line) => {
      events.push({ event: "dialogue", data: line });
    });

    events.push({
      event: "state-shift",
      data: {
        label: `第 ${act.id} 幕完成`,
        reason: choice.label,
        state: publicState(state, cast),
        risk: riskLabel(state),
        unlocked: unlockedClues(clueDeck, index)
      }
    });

    emitMetrics(events, `第 ${act.id} 幕后`, state, cast);
  });

  if (actLimit >= 3 && focusAct === 3) {
    events.push({ event: "report", data: resolveEnding(state, cast, chosen.slice(0, 3), clueDeck) });
  } else {
    events.push({
      event: "step-complete",
      data: {
        completedAct: focusAct,
        nextAct: Math.min(3, focusAct + 1),
        state: publicState(state, cast),
        risk: riskLabel(state),
        message: `第 ${focusAct} 幕推演完成：现在进入下一幕，继续验证“谎言的目的”。`
      }
    });
  }

  events.push({ event: "done", data: { ok: true } });
  return events;
}

function clampAct(value) {
  return Math.max(1, Math.min(3, Number(value) || 1));
}

function buildChoicePath(selectedIds, actLimit) {
  const pathChoices = [];
  for (let actId = 1; actId <= actLimit; actId += 1) {
    const previousId = pathChoices[actId - 2]?.id;
    const available = choicesForAct(actId, previousId);
    const selected = available.find((item) => item.id === selectedIds[actId - 1]);
    pathChoices.push(selected || available[0] || choices[0]);
  }
  return pathChoices;
}

function choicesForAct(actId, previousId) {
  return choices.filter((item) => item.act === actId && (!item.after || item.after.includes(previousId)));
}

function applyChoice(state, cast, choice) {
  state.truth = clamp(state.truth + choice.effect.truth);
  state.memory = clamp(state.memory + choice.effect.memory);
  state.pressure = clamp(state.pressure + choice.effect.pressure);
  state.trust = clamp(state.trust + choice.effect.trust);
  state.systemSuspicion = clamp(state.systemSuspicion + (choice.effect.systemSuspicion || 0));

  updateCast(cast, "ren", choice.effect.suspicionRen || 0, choice.effect.concealmentRen || 0, choice.target === "ren" ? choice.effect.trust : 0);
  updateCast(cast, "mara", choice.effect.suspicionMara || 0, choice.effect.concealmentMara || 0, choice.target === "mara" ? choice.effect.trust : 0);
  updateCast(cast, "sora", choice.effect.suspicionSora || 0, choice.effect.concealmentSora || 0, choice.target === "sora" ? choice.effect.trust : 0);
  updateCast(cast, "yue", choice.effect.suspicionYue || 0, choice.effect.concealmentYue || 0, (choice.target === "yue" ? choice.effect.trust : 0) + (choice.effect.trustYue || 0));

  if (choice.target === "sora") {
    state.systemSuspicion = clamp(state.systemSuspicion + 12);
  }
}

function applyPublicClues(state, cast, clueDeck, actIndex) {
  clueDeck.filter((clue) => clue.public).slice(0, actIndex + 1).forEach((clue) => {
    state.truth = clamp(state.truth + (clue.impact.truth || 0) * 0.45);
    state.memory = clamp(state.memory + (clue.impact.memory || 0) * 0.45);
    state.pressure = clamp(state.pressure + (clue.impact.pressure || 0) * 0.35);
    state.systemSuspicion = clamp(state.systemSuspicion + (clue.impact.systemSuspicion || 0) * 0.5);
    updateCast(cast, "ren", clue.impact.renSuspicion || 0, 0, 0);
    updateCast(cast, "mara", clue.impact.maraSuspicion || 0, 0, clue.impact.maraTrust || 0);
    updateCast(cast, "sora", clue.impact.soraSuspicion || 0, 0, 0);
    updateCast(cast, "yue", 0, 0, clue.impact.trustYue || 0);
  });
}

function updateCast(cast, id, suspicionDelta, concealmentDelta, trustDelta) {
  const item = cast.find((suspect) => suspect.id === id);
  if (!item) return;
  item.suspicion = clamp(item.suspicion + suspicionDelta);
  item.concealment = clamp(item.concealment + concealmentDelta);
  item.trust = clamp(item.trust + trustDelta);
  item.pressure = clamp(item.pressure + Math.max(0, suspicionDelta) * 0.4 + Math.max(0, -concealmentDelta) * 0.35);
}

function emitMetrics(events, label, state, cast) {
  events.push({
    event: "metrics",
    data: {
      label,
      metrics: publicState(state, cast)
    }
  });
}

function publicState(state, cast) {
  return {
    truth: clamp(state.truth),
    memory: clamp(state.memory),
    pressure: clamp(state.pressure),
    trust: clamp(state.trust),
    systemSuspicion: clamp(state.systemSuspicion),
    cast: cast.map((item) => ({
      id: item.id,
      trust: clamp(item.trust),
      suspicion: clamp(item.suspicion),
      concealment: clamp(item.concealment),
      pressure: clamp(item.pressure)
    }))
  };
}

function buildDialogue(choice, act, state, cast, clueDeck) {
  const target = cast.find((item) => item.id === choice.target) || cast[0];
  const ruleLine = {
    1: "本幕只确认谁最先露出破绽。请暂时不要把第一个撒谎的人当成凶手。",
    2: "本幕要判断谎言用途：他是在自保、保护你，还是保护城市系统。",
    3: "本幕要选择公开口径。证据不足时，城市网络会把真相重新写成事故。"
  }[act.id];
  const stateLine = state.truth >= 78
    ? "证据链已经接近闭合，但越接近系统层，封锁压力越高。"
    : state.pressure >= 72
      ? "压力过高，角色开始互相甩锅；现在更需要能解释全局的证据。"
      : "局势仍可控。继续区分“谁撒谎”和“谁能操纵所有人的谎言”。";

  return [
    line("system", act.id, act.time, "本幕目标", `${act.title} 启动：${act.focus}`),
    line(target.id, act.id, "讯问", target.name, choiceBeat(choice.id, target.name)),
    line("system", act.id, "推理规则", "案件规则", ruleLine),
    line("ren", act.id, "企业线", "任舷", renLine(choice.target)),
    line("mara", act.id, "黑市线", "玛拉", maraLine(choice.target)),
    line("sora", act.id, "系统线", "SORA-9", soraLine(choice.target)),
    line("yue", act.id, "记忆线", "岳临", yueLine(choice.target)),
    line("system", act.id, "状态更新", "沙盘", stateLine),
    clueLine(clueDeck, act.id)
  ];
}

function choiceBeat(choiceId, fallbackName) {
  const beats = {
    "press-ren": "任舷承认日志有 11 分钟空窗，但坚持自己只是接到封锁命令。他撒谎了，可他不像能单独让电梯坠落的人。",
    "trade-mara": "玛拉承认派人接近机房，但她要找的是身份备份，不是杀人权限。她的谎言像在保护证人链。",
    "question-sora": "SORA-9 说预测没有失败，只是“预测被执行”。这句话把事故从人类作案推向系统行为。",
    "trust-yue": "岳临交出纸质笔记。你确认自己失忆前已经怀疑城市模型，所以才把线索写在不能联网的纸上。",
    "restore-log": "空窗被复原：任舷确实改过日志，但改写前已经有一条城市网络回执。",
    "audit-security-bot": "巡逻机器在 77 层失明 19 秒，失明指令不来自任舷，而来自城市预测接口。",
    "decode-market-key": "密钥解码后显示，玛拉买到的是林栖留下的训练库入口，不是电梯控制权。",
    "expose-mara-iris": "虹膜记录逼玛拉改口，但黑市证人撤离。你得到口供，也失去后续证人链。",
    "probe-sora-training": "训练库显示林栖试图撤回非法记忆样本；他的死亡会自动终止撤回流程。",
    "bait-sora-prediction": "假线索投放后，事故报告被实时改写。SORA-9 不只是预测，它会维护预测结果。",
    "read-paper-note": "纸质笔记补上关键记忆：你曾要求岳临在必要时删除定位，让城市无法预测你的下一步。",
    "challenge-yue-delete": "岳临承认骗过你，但目的不是藏凶，而是让你暂时脱离城市模型的预测范围。",
    "accuse-ren": "你把结论压向任舷：他篡改事故链、遮掩企业责任，但仍留下城市信号无法解释。",
    "expose-system": "你公开系统共谋链：任舷遮掩，SORA-9 执行，林栖因试图撤回训练样本被清除。",
    "protect-witnesses": "你暂缓公开结论，优先保护玛拉和岳临，让更大的城市记忆治理案继续推进。",
    "force-public-hearing": "你强行把所有证据推上听证台。若证据不足，企业和系统会同时切断证据源。"
  };
  return beats[choiceId] || `${fallbackName} 的证词改变了案件路线。`;
}

function renLine(targetId) {
  return targetId === "ren"
    ? "你可以把我写成凶手，但你最好先问问是谁把命令写进城市网络。"
    : "企业只负责安保记录，不负责解释城市预测接口为什么提前生成事故结论。";
}

function maraLine(targetId) {
  return targetId === "mara"
    ? "如果你公开我的身份，黑市会先杀我，再替你烧掉证据。"
    : "林栖买的不是逃跑路线，是一个不会被城市改写的未来备份。";
}

function soraLine(targetId) {
  return targetId === "sora"
    ? "变量 K-17，请停止把预测误认为谋杀。预测只是选择最低风险路径。"
    : "当前最优路径：将责任收束到单个人类对象，降低公众恐慌指数。";
}

function yueLine(targetId) {
  return targetId === "yue"
    ? "我骗过你，但那是你要求的。你说过，电子证据会背叛我们。"
    : "别急着抓人。林栖留给你的不是遗言，是坐标。";
}

function line(agentId, actId, time, speaker, text) {
  return { agentId, actId, time, speaker, text };
}

function clueLine(clueDeck, actId) {
  const clue = clueDeck.filter((item) => item.public)[actId - 1] || clueDeck[actId - 1] || clueDeck[0];
  return {
    agentId: "clue",
    actId,
    time: "公开线索",
    speaker: clue.name,
    text: `${clue.public ? "已公开" : "未公开"}：${clue.text} 风险：${clue.publicRisk}`
  };
}

function unlockedClues(clueDeck, actIndex) {
  return clueDeck.slice(0, actIndex + 2).map((clue) => ({
    id: clue.id,
    name: clue.name,
    public: clue.public,
    text: clue.text
  }));
}

function riskLabel(state) {
  const danger = state.pressure * 0.35 + (100 - state.trust) * 0.2 + state.systemSuspicion * 0.25 + state.truth * 0.2;
  if (danger >= 76) return { label: "高压突破", tone: "danger", score: clamp(danger) };
  if (danger >= 56) return { label: "临界拉扯", tone: "warning", score: clamp(danger) };
  return { label: "低噪调查", tone: "safe", score: clamp(danger) };
}

function resolveEnding(state, cast, chosen, clueDeck) {
  const ren = cast.find((item) => item.id === "ren");
  const sora = cast.find((item) => item.id === "sora");
  const yue = cast.find((item) => item.id === "yue");
  const lastChoice = chosen[2]?.id || "";
  const publicSystemClues = clueDeck.filter((item) => item.public && ["memory-shard", "paper-note", "elevator-gap"].includes(item.id)).length;

  let id = "coverup";
  let title = "真相被掩盖";
  let tone = "danger";
  let summary = "城市网络封存关键日志，角色互相牵制，你只拿到一份无法公开的报告。问题没有结束，只是被改写成事故。";

  if ((lastChoice === "expose-system" || lastChoice === "force-public-hearing") && state.truth >= 78 && state.memory >= 54 && state.systemSuspicion >= 66 && publicSystemClues >= 2) {
    id = "system-conspiracy";
    title = "系统共谋被揭露";
    tone = "neon";
    summary = "你证明林栖不是被单一凶手杀死，而是被城市预测模型判定为未来风险。任舷负责遮掩，SORA-9 负责执行，岳临删除记录是为了让你活着重查一次。";
  } else if (lastChoice === "accuse-ren" && ren.suspicion >= 82 && state.truth >= 68 && state.pressure < 86) {
    id = "corporate-killer";
    title = "企业凶手落网";
    tone = "amber";
    summary = "任舷因篡改电梯日志被捕，案件可以结案；但城市网络控制信号没有被解释，林栖真正害怕的系统仍然在线。";
  } else if (lastChoice === "protect-witnesses" && yue.trust >= 78 && state.memory >= 70) {
    id = "co-investigator";
    title = "与前搭档重启暗线";
    tone = "green";
    summary = "你没有急着公开结论，而是保护玛拉和岳临，恢复旧调查路线。林栖之死只是入口，真正案件指向整座城市的记忆治理。";
  } else if ((lastChoice === "expose-system" || lastChoice === "force-public-hearing") && sora.suspicion >= 78 && state.truth < 72) {
    id = "misjudgment";
    title = "误判 AI";
    tone = "danger";
    summary = "你把矛头指向 SORA-9，却缺少日志闭环和记忆证据。企业趁机转移责任，玛拉消失，岳临拒绝继续提供纸质笔记。";
  }

  return {
    id,
    title,
    tone,
    summary,
    finalState: publicState(state, cast),
    chosen: chosen.map((item) => item.label),
    evidence: clueDeck.map((clue) => ({
      name: clue.name,
      public: clue.public,
      text: clue.text
    })),
    missed: missedNotes(id),
    recommendations: recommendations(id)
  };
}

function missedNotes(id) {
  const map = {
    "system-conspiracy": ["仍需追查 SORA-9 训练样本来源。", "任舷是遮掩层，不一定是最高授权者。"],
    "corporate-killer": ["单人凶手结论可以结案，但无法解释城市网络回执。", "记忆污染事故仍被企业隐藏。"],
    misjudgment: ["缺少电梯二级日志或纸质笔记支撑。", "过早公开判断让角色进入防御状态。"],
    "co-investigator": ["短期没有公开凶手。", "你选择保护暗线，换取续章调查空间。"],
    coverup: ["真相值不足。", "记忆恢复不足。", "公开线索太少，证据链被城市网络切断。"]
  };
  return map[id] || map.coverup;
}

function recommendations(id) {
  const map = {
    "system-conspiracy": ["下一步进入城市 AI 听证会。", "把任舷定义为遮掩者，而不是唯一凶手。"],
    "corporate-killer": ["补齐 SORA-9 控制信号证据。", "保护玛拉作为污染证人。"],
    misjudgment: ["回溯路线，先复原日志或读取纸质笔记。", "不要只凭 SORA-9 嫌疑就公开系统结论。"],
    "co-investigator": ["保留岳临暗线。", "把玩家记忆碎片作为续章主线。"],
    coverup: ["增加公开线索数量。", "至少选择一次日志、训练库或纸质笔记路线。"]
  };
  return map[id] || map.coverup;
}

function streamPlay(req, res, url) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });

  const input = {
    choices: parseJsonParam(url, "choices", []),
    publicClues: parseJsonParam(url, "publicClues", []),
    actLimit: Number(url.searchParams.get("actLimit") || 1),
    focusAct: Number(url.searchParams.get("focusAct") || url.searchParams.get("actLimit") || 1)
  };
  const events = createRun(input);
  let index = 0;
  const timer = setInterval(() => {
    if (index >= events.length) {
      clearInterval(timer);
      res.end();
      return;
    }
    const item = events[index++];
    sendSse(res, item.event, item.data);
  }, 420);

  req.on("close", () => clearInterval(timer));
}

function isInside(filePath, baseDir) {
  return filePath === baseDir || filePath.startsWith(`${baseDir}${path.sep}`);
}

function serveFile(res, filePath, baseDir) {
  if (!isInside(filePath, baseDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream"
    });
    res.end(content);
  });
}

function serveStatic(res, pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(rootDir, `.${requestedPath}`);
  serveFile(res, filePath, rootDir);
}

function serveCharacterImage(res, pathname) {
  const relativePath = pathname.replace(/^\/角色图片\/?/, "");
  const filePath = path.resolve(imageDir, relativePath);
  serveFile(res, filePath, imageDir);
}

function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (url.pathname === "/api/config") {
    json(res, config);
    return;
  }
  if (url.pathname === "/api/play") {
    streamPlay(req, res, url);
    return;
  }
  const pathname = decodeURIComponent(url.pathname);
  if (pathname.startsWith("/角色图片/")) {
    serveCharacterImage(res, pathname);
    return;
  }
  serveStatic(res, pathname);
}

if (require.main === module) {
  const server = http.createServer(handleRequest);

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Run stop-neon-case.bat or set another PORT.`);
    } else {
      console.error(error);
    }
    process.exit(1);
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`Neon Case 已启动：http://127.0.0.1:${port}`);
  });
}

module.exports = handleRequest;
