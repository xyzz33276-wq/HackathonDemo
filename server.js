const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");
const config = require("./case-data");

const rootDir = __dirname;
const imageDir = path.resolve(rootDir, "角色图片");
const port = Number(process.env.PORT || 8797);
const { caseFile, suspects, clues, choices, acts, baseState, v3Rules } = config;
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
  const actLimit = clampAct(input.actLimit || selectedIds.length || 1);
  const focusAct = clampAct(input.focusAct || actLimit);
  const chosen = buildChoicePath(selectedIds, actLimit);
  const state = { ...baseState };
  const cast = suspects.map((item) => ({ ...item }));
  const earnedBeforeFocus = earnedClueEntries(chosen.slice(0, Math.max(0, focusAct - 1)));
  const earnedForRun = earnedClueEntries(chosen.slice(0, actLimit));
  const events = [];

  events.push({
    event: "start",
    data: {
      message: "案件沙盘启动：第一个撒谎的人不一定是凶手，但可能是突破口。",
      caseFile,
      selectedChoices: chosen.map((item) => item.id),
      earnedClues: cluePayload(earnedBeforeFocus),
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

    if (act.id !== focusAct) return;
    const newlyEarned = diffClueEntries(
      earnedClueEntries(chosen.slice(0, index + 1)),
      earnedClueEntries(chosen.slice(0, index))
    );

    events.push({
      event: "act-start",
      data: {
        act,
        choice,
        node: nodeForChoice(choice.id),
        state: publicState(state, cast),
        risk: riskLabel(state)
      }
    });

    buildDialogue(choice, act, state, cast, earnedForRun).forEach((line) => {
      events.push({ event: "dialogue", data: line });
    });

    if (newlyEarned.length) {
      events.push({
        event: "clue-earned",
        data: {
          actId: act.id,
          choiceId: choice.id,
          clues: cluePayload(newlyEarned)
        }
      });
    }

    events.push({
      event: "state-shift",
      data: {
        label: `第 ${act.id} 幕完成`,
        reason: choice.label,
        state: publicState(state, cast),
        risk: riskLabel(state),
        earnedClues: cluePayload(earnedClueEntries(chosen.slice(0, index + 1)))
      }
    });

    emitMetrics(events, `第 ${act.id} 幕后`, state, cast);
  });

  if (actLimit >= 3 && focusAct === 3) {
    events.push({ event: "report", data: resolveEnding(state, cast, chosen.slice(0, 3)) });
  } else {
    events.push({
      event: "step-complete",
      data: {
        completedAct: focusAct,
        nextAct: Math.min(3, focusAct + 1),
        state: publicState(state, cast),
        risk: riskLabel(state),
        earnedClues: cluePayload(earnedClueEntries(chosen.slice(0, focusAct))),
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

function nodeForChoice(choiceId) {
  return v3Rules.choiceNodes[choiceId] || "";
}

function pathKeyFromChoices(pathChoices) {
  return pathChoices.map((choice) => choice.id).join("|");
}

function getClue(id) {
  return clues.find((clue) => clue.id === id);
}

function mergeClueEntries(entries) {
  const seen = new Map();
  entries.forEach((entry) => {
    if (!entry?.id) return;
    if (!seen.has(entry.id)) {
      seen.set(entry.id, { ...entry });
      return;
    }
    const current = seen.get(entry.id);
    if (entry.source && !current.source.includes(entry.source)) {
      current.source = `${current.source} / ${entry.source}`;
    }
  });
  return [...seen.values()];
}

function earnedClueEntries(pathChoices) {
  const entries = [];
  pathChoices.forEach((choice) => {
    entries.push(...(v3Rules.clueUnlocks[choice.id] || []));
  });
  if (pathChoices.length >= 3) {
    entries.push(...(v3Rules.finalClueUnlocks[pathKeyFromChoices(pathChoices)] || []));
  }
  return mergeClueEntries(entries);
}

function diffClueEntries(nextEntries, previousEntries) {
  const previousIds = new Set(previousEntries.map((entry) => entry.id));
  return nextEntries.filter((entry) => !previousIds.has(entry.id));
}

function cluePayload(entries) {
  return entries
    .map((entry) => {
      const clue = getClue(entry.id);
      if (!clue) return null;
      return {
        id: clue.id,
        name: clue.name,
        type: clue.type,
        text: clue.text,
        source: entry.source || "",
        publicRisk: clue.publicRisk
      };
    })
    .filter(Boolean);
}

function endingForPath(pathChoices) {
  const key = pathKeyFromChoices(pathChoices);
  return v3Rules.endings[key] || {
    id: "unknown-coverup",
    title: "真相被掩盖",
    resultType: "lose",
    tone: "danger",
    summary: "证据链没有闭合，城市网络把案件重新写成事故。",
    missed: ["路径证据不足。"],
    recommendations: ["回溯三幕选择，寻找能把突破口接到系统因果链的路线。"]
  };
}

function sortedIds(ids) {
  return [...ids].sort().join("|");
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

function simulatePath(pathChoices) {
  const state = { ...baseState };
  const cast = suspects.map((item) => ({ ...item }));
  pathChoices.forEach((choice) => applyChoice(state, cast, choice));
  return { state, cast };
}

function buildDialogue(choice, act, state, cast, earnedEntries) {
  const target = cast.find((item) => item.id === choice.target) || cast[0];
  const node = nodeForChoice(choice.id);
  const scripted = v3Rules.dialogue[choice.id] || {};
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
    line("system", act.id, act.time, "本幕目标", `${act.title} / 节点 ${node}：${act.focus}`),
    line(target.id, act.id, "讯问", target.name, choiceBeat(choice.id, target.name)),
    line("system", act.id, "推理规则", "案件规则", ruleLine),
    line("ren", act.id, "企业线", "任舷", scripted.ren || renLine(choice.target)),
    line("mara", act.id, "黑市线", "玛拉", scripted.mara || maraLine(choice.target)),
    line("sora", act.id, "系统线", "SORA-9", scripted.sora || soraLine(choice.target)),
    line("yue", act.id, "记忆线", "岳临", scripted.yue || yueLine(choice.target)),
    line("system", act.id, "状态更新", "沙盘", stateLine),
    clueLine(earnedEntries, act.id)
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

function clueLine(earnedEntries, actId) {
  const payload = cluePayload(earnedEntries);
  const clue = payload[payload.length - 1] || payload[0];
  if (!clue) {
    return {
      agentId: "clue",
      actId,
      time: "获得线索",
      speaker: "线索板",
      text: "本幕尚未获得可公开线索。继续推进选择，证据会随路径解锁。"
    };
  }
  return {
    agentId: "clue",
    actId,
    time: "获得线索",
    speaker: clue.name,
    text: `已获得：${clue.text} 来源：${clue.source || "当前行动"}`
  };
}

function riskLabel(state) {
  const danger = state.pressure * 0.35 + (100 - state.trust) * 0.2 + state.systemSuspicion * 0.25 + state.truth * 0.2;
  if (danger >= 76) return { label: "高压突破", tone: "danger", score: clamp(danger) };
  if (danger >= 56) return { label: "临界拉扯", tone: "warning", score: clamp(danger) };
  return { label: "低噪调查", tone: "safe", score: clamp(danger) };
}

function resolveEnding(state, cast, chosen) {
  const ending = endingForPath(chosen);
  const earned = earnedClueEntries(chosen);
  return {
    ok: true,
    id: ending.id,
    title: ending.title,
    tone: ending.tone,
    resultType: ending.resultType,
    summary: ending.summary,
    allowComeback: ending.resultType === "lose",
    finalState: publicState(state, cast),
    chosen: chosen.map((item) => item.label),
    path: chosen.map((item) => ({
      id: item.id,
      node: nodeForChoice(item.id),
      label: item.label
    })),
    evidence: cluePayload(earned),
    missed: ending.missed || [],
    recommendations: ending.recommendations || []
  };
}

function resolveComeback(chosen, finalClues) {
  const ending = endingForPath(chosen);
  const key = pathKeyFromChoices(chosen);
  const earnedIds = new Set(earnedClueEntries(chosen).map((entry) => entry.id));
  const selected = Array.isArray(finalClues) ? finalClues.filter(Boolean) : [];

  if (ending.resultType !== "lose") {
    return {
      ok: false,
      allowed: false,
      resultType: ending.resultType,
      title: ending.title,
      summary: "当前结局不是失败结局，不触发最后公开线索。",
      reason: "开放式与胜利结局不进入补证。"
    };
  }

  if (selected.length === 0) {
    return {
      ok: false,
      allowed: true,
      resultType: "lose",
      title: "未公开线索",
      tone: "danger",
      summary: "你没有公开任何线索，等同于接受失败结局。",
      reason: "最后公开至少需要 1 条线索。"
    };
  }

  if (selected.length > 2) {
    return {
      ok: false,
      allowed: true,
      resultType: "lose",
      title: "证据噪音过高",
      tone: "danger",
      summary: "公开 3 条或更多线索会被 SORA-9 归类为不可信组合，仍然失败。",
      reason: "最后公开最多 2 条线索。"
    };
  }

  const unavailable = selected.filter((id) => !earnedIds.has(id));
  if (unavailable.length) {
    return {
      ok: false,
      allowed: true,
      resultType: "lose",
      title: "线索尚未获得",
      tone: "danger",
      summary: "最后公开只能使用本次路径已经获得的线索。",
      reason: `未获得线索：${unavailable.join(", ")}`
    };
  }

  const comeback = v3Rules.comeback[key];
  const selectedKey = sortedIds(selected);
  const winKey = comeback?.winClues ? sortedIds(comeback.winClues) : "";

  if (comeback?.resultType === "win" && selectedKey === winKey) {
    return {
      ok: true,
      allowed: true,
      resultType: "win",
      title: comeback.title,
      tone: comeback.tone,
      summary: comeback.summary,
      reason: "精确命中败局缺口。",
      evidence: selected.map((id) => getClue(id)).filter(Boolean).map((clue) => ({
        id: clue.id,
        name: clue.name,
        text: clue.text,
        public: true
      }))
    };
  }

  if (comeback?.resultType === "open") {
    return {
      ok: true,
      allowed: true,
      resultType: "open",
      title: comeback.title,
      tone: comeback.tone,
      summary: comeback.summary,
      reason: "补证无法赢下本案，但保住了后续调查空间。",
      evidence: selected.map((id) => getClue(id)).filter(Boolean).map((clue) => ({
        id: clue.id,
        name: clue.name,
        text: clue.text,
        public: true
      }))
    };
  }

  return {
    ok: true,
    allowed: true,
    resultType: "lose",
    title: "补证失败",
    tone: "danger",
    summary: "公开组合没有命中当前败局缺口，证据链仍被系统和企业拆散。",
    reason: "线索组合不精确。",
    evidence: selected.map((id) => getClue(id)).filter(Boolean).map((clue) => ({
      id: clue.id,
      name: clue.name,
      text: clue.text,
      public: true
    }))
  };
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
  if (url.pathname === "/api/comeback") {
    const selectedIds = parseJsonParam(url, "choices", defaultChoices);
    const finalClues = parseJsonParam(url, "finalClues", []);
    const chosen = buildChoicePath(selectedIds, 3);
    const simulation = simulatePath(chosen);
    json(res, {
      ...resolveComeback(chosen, finalClues),
      finalState: publicState(simulation.state, simulation.cast),
      defaultEnding: endingForPath(chosen),
      choices: chosen.map((choice) => choice.id),
      earnedClues: cluePayload(earnedClueEntries(chosen))
    });
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
