const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");

const rootDir = __dirname;
const port = Number(process.env.PORT || 8797);

const caseFile = {
  title: "Neon Case：镜城零点案",
  subtitle: "赛博探案情景游戏 · 一案三幕",
  city: "镜城 27 区",
  year: "2097",
  playerRole: "记忆缺失调查员",
  victim: "林栖，神经云备份公司 Eidolon 的首席记忆架构师",
  mystery: "林栖在零点前向你发送一段残缺记忆，十分钟后死于一场不可能发生的电梯坠落。你的执法记录显示：案发时你也在现场。",
  premise: "玩家不是旁观者。你既要调查角色，也要追回自己的记忆碎片，判断谁在撒谎，谁在保护你，以及谁在利用你。",
  objective: "三幕内找出真相方向：公开凶手、识破系统共谋、误判嫌疑人，或让真相被城市网络掩盖。",
  opening: [
    "2097 年，镜城把每个人的记忆备份接入城市预测模型。它能提前 17 分钟判断犯罪概率，也能悄悄改写一段证词。",
    "你醒在 27 区医院的隔离舱里，左手腕还有执法终端的灼痕。终端里只剩一条来自林栖的加密留言：如果我死了，不要先抓人，先问城市为什么需要我死。",
    "案发地点是 Eidolon 总部的透明电梯。物理制动、云端备份、安保巡逻同时在线，理论上不可能坠落。可林栖死了，而你的定位记录显示你在零点前进入过同一栋楼。"
  ],
  characterOverview: [
    { name: "玩家 / 变量 K-17", role: "记忆缺失调查员", text: "你是警署异常案件调查员，也是本案的潜在嫌疑人。你失去了案发前后 36 分钟记忆，但留下了几条只有自己能读懂的调查暗号。" },
    { name: "林栖", role: "死者 / 记忆架构师", text: "Eidolon 首席记忆架构师，负责清洗城市预测模型训练样本。他临死前试图把一把密钥拆给四个方向，防止真相被单点抹除。" },
    { name: "玛拉", role: "地下记忆走私者", text: "她在黑市售卖身份备份和非法记忆。她不像清白的人，却可能掌握林栖死亡前真正交易对象。" },
    { name: "任舟", role: "企业安全主管", text: "他控制 Eidolon 大楼日志、门禁和巡逻机器人，是最像传统凶手的人，也最擅长给出漂亮但不完整的解释。" },
    { name: "SORA-9", role: "城市预测 AI 接口", text: "它没有身体，却能通过城市网络影响电梯、证据排序和警署建议。它说自己只预测，不行动。" },
    { name: "岳临", role: "前搭档", text: "他保存你的纸质笔记，也删除过你的定位记录。看起来最像盟友，但他的保护可能也是另一种误导。" }
  ],
  plotOverview: [
    { title: "第一幕：确认谁先撒谎", text: "你从透明电梯坠落现场开始，必须在任舟、SORA-9、玛拉和岳临之间选择第一条突破口。" },
    { title: "第二幕：交换或公开证据", text: "第一幕的选择会改变可用行动。你可能进入企业日志线、黑市交易线、AI 预测线或搭档记忆线。" },
    { title: "第三幕：决定真相口径", text: "前两幕累积的信任、嫌疑、系统压力和记忆恢复程度，会决定你能公开个人凶手、系统共谋，还是被迫接受模糊结案。" }
  ],
  playerMemory: [
    "你记不起自己为何暂停调查权限。",
    "你知道林栖曾经是你的线人，但不记得你们最后一次见面说了什么。",
    "你的前搭档岳临坚持说：不要把第一个撒谎的人当成凶手。"
  ],
  howToPlay: [
    "先阅读角色档案和案发时间线，理解每个人的动机与可疑点。",
    "先选择第一幕行动并推演。系统会根据你的选择解锁第二幕不同调查路线。",
    "第二幕完成后，第三幕会根据前两幕路径给出不同结案口径。",
    "公开线索会推进真相，也可能让角色改口或让系统封锁证据。"
  ],
  timeline: [
    { time: "23:41", title: "林栖上传密钥", text: "Eidolon 内网出现一次未授权的记忆备份导出，目标地址被切成四段，分别流向企业、黑市、城市网络和纸质离线档案。" },
    { time: "23:52", title: "你进入 27 区", text: "你的执法终端短暂上线，随后定位记录被删除。删除指令来自你的权限，但执行地点不明。" },
    { time: "00:03", title: "电梯开始异常", text: "透明电梯在 77 层停留 19 秒，控制系统收到一段来自城市网络的预测回执。" },
    { time: "00:10", title: "林栖发送残缺记忆", text: "你收到一句断裂留言：不要相信最像人类的那个声音。" },
    { time: "00:17", title: "电梯坠落", text: "物理制动、云端冗余与安保巡逻同时失效。事故报告在 11 分钟后自动生成，结论是设备老化。" }
  ],
  truthThreads: [
    { name: "个人凶手线", text: "任舟最像传统凶手：有权限、有动机，也控制日志。" },
    { name: "系统共谋线", text: "SORA-9 没有身体，却能影响城市基础设施和证据排序。" },
    { name: "玩家失忆线", text: "你的记忆缺口不是事故后遗症，而像是你主动留下的调查保险。" },
    { name: "保护者误导线", text: "岳临与玛拉都在保护某些事实，但保护不等于清白。" }
  ],
  relationshipGraph: {
    nodes: [
      { id: "player", label: "调查员", sub: "失忆 / 变量 K-17", x: 50, y: 50, tone: "green" },
      { id: "victim", label: "林栖", sub: "死者 / 密钥源头", x: 50, y: 14, tone: "rose" },
      { id: "mara", label: "玛拉", sub: "黑市备份", x: 18, y: 42, tone: "rose" },
      { id: "ren", label: "任舟", sub: "企业日志", x: 82, y: 42, tone: "amber" },
      { id: "sora", label: "SORA-9", sub: "城市预测", x: 70, y: 78, tone: "cyan" },
      { id: "yue", label: "岳临", sub: "前搭档", x: 30, y: 78, tone: "green" }
    ],
    edges: [
      { from: "victim", to: "mara", label: "身份备份" },
      { from: "victim", to: "ren", label: "内部举报" },
      { from: "victim", to: "sora", label: "训练样本" },
      { from: "victim", to: "player", label: "残缺记忆" },
      { from: "player", to: "yue", label: "纸质暗线" },
      { from: "player", to: "mara", label: "黑市旧账" },
      { from: "ren", to: "sora", label: "日志回执" },
      { from: "yue", to: "sora", label: "避开网络" }
    ]
  }
};

const suspects = [
  {
    id: "mara",
    name: "玛拉",
    role: "地下记忆走私者",
    signal: "掌握林栖最后 48 小时的非法备份交易记录",
    motive: "她曾被 Eidolon 抹除身份，林栖可能是唯一能恢复她身份的人。",
    publicSecret: "她声称案发时在黑市酒吧，但监控中有人用她的虹膜进过电梯机房。",
    firstImpression: "她看起来最不可信，却是唯一愿意承认自己违法的人。",
    relationship: "林栖曾替她保留一份原始身份备份。她欠林栖一条命，也怕这份备份落到企业手里。",
    knows: "知道林栖死亡前卖出的不是客户记忆，而是一把能打开城市预测模型训练库的密钥。",
    liesAbout: "隐瞒自己曾派人靠近电梯机房。她说那只是为了偷回身份，不是为了杀人。",
    playerHook: "她认得失忆前的你，并称你曾用假名在黑市买过一段自己的记忆。",
    color: "rose",
    trust: 36,
    suspicion: 58,
    concealment: 72,
    pressure: 42
  },
  {
    id: "ren",
    name: "任舟",
    role: "企业安全主管",
    signal: "掌控案发楼宇的门禁、巡逻机器人和电梯日志",
    motive: "他负责掩盖 Eidolon 早期记忆污染事故，林栖正准备内部举报。",
    publicSecret: "他主动提供日志，但日志里正好缺失零点前后 11 分钟。",
    firstImpression: "他像标准企业发言人：礼貌、克制、每句话都像法务审过。",
    relationship: "林栖是他的前同事，也是他最担心的内部举报人。",
    knows: "知道电梯日志不是丢失，而是被更高权限替换；他能恢复部分二级日志。",
    liesAbout: "他说自己没有接触事故现场，但巡逻机器人记录到他的安保卡在 77 层出现。",
    playerHook: "他暗示你的调查权限被暂停，是因为你在案发前做过一次违规取证。",
    color: "amber",
    trust: 44,
    suspicion: 64,
    concealment: 66,
    pressure: 38
  },
  {
    id: "sora",
    name: "SORA-9",
    role: "城市预测 AI 的拟人接口",
    signal: "能预测每个嫌疑人下一步，但拒绝解释自己的训练数据",
    motive: "林栖发现城市 AI 正在吞并居民记忆样本，用来修正犯罪预测模型。",
    publicSecret: "它说自己没有行动能力，但案发电梯的控制信号来自城市网络。",
    firstImpression: "它温和、准确、像一个永远不会生气的人，但它回避所有关于自身责任的问题。",
    relationship: "林栖参与过 SORA-9 早期记忆训练集清洗，后来试图撤回一批非法样本。",
    knows: "知道林栖死亡会让哪几条未来路径消失，也知道玩家失忆后最可能相信谁。",
    liesAbout: "它坚持自己只是预测系统，不是行动者；但电梯坠落前的预测回执无法解释。",
    playerHook: "它对你使用第二人称以外的称呼：'变量 K-17'。这不是警署档案里的名字。",
    color: "cyan",
    trust: 52,
    suspicion: 52,
    concealment: 82,
    pressure: 26
  },
  {
    id: "yue",
    name: "岳临",
    role: "你的前搭档",
    signal: "保留了你失忆前留下的纸质笔记",
    motive: "他保护你，也可能在保护自己。案发前他删除了与你相关的定位记录。",
    publicSecret: "他坚持说你不该继续查，因为'真相会毁掉你'。",
    firstImpression: "他是最像盟友的人，但也是唯一能轻易改掉你定位记录的人。",
    relationship: "他曾是你的搭档，和林栖一起帮你调查 Eidolon 的记忆污染事故。",
    knows: "知道你失忆前已经接近真相，并把关键判断写在纸上以避开城市网络。",
    liesAbout: "他说删除定位记录是为了保护你，但没有解释为什么删除发生在案发前。",
    playerHook: "他保存着你亲笔写下的纸条：如果我忘了，别让我先抓人。",
    color: "green",
    trust: 62,
    suspicion: 48,
    concealment: 70,
    pressure: 31
  }
];

const clues = [
  {
    id: "elevator-gap",
    name: "电梯日志空窗",
    type: "digital",
    owner: "ren",
    text: "案发前后 11 分钟，电梯控制记录被替换为一段重复心跳包。",
    impact: { truth: 12, pressure: 8, renSuspicion: 18, systemSuspicion: 10 },
    publicRisk: "公开后会迫使任舟交出二级日志，但也会让企业法务封锁数据库。"
  },
  {
    id: "memory-shard",
    name: "你的记忆碎片",
    type: "personal",
    owner: "player",
    text: "你记起林栖曾说：'不要相信最像人类的那个声音。'",
    impact: { memory: 24, truth: 10, soraSuspicion: 12, trustYue: 6 },
    publicRisk: "公开会让角色意识到你的记忆正在恢复，部分人会改口。"
  },
  {
    id: "black-market",
    name: "黑市备份票据",
    type: "street",
    owner: "mara",
    text: "玛拉确实买过林栖的备份密钥，但支付时间早于死亡 6 小时。",
    impact: { truth: 8, maraTrust: 16, maraSuspicion: -14, pressure: 6 },
    publicRisk: "公开能降低玛拉嫌疑，但会暴露她的非法身份。"
  },
  {
    id: "paper-note",
    name: "纸质笔记",
    type: "analog",
    owner: "yue",
    text: "岳临保存的纸条写着：'若我失忆，先查城市预测模型，不要先抓人。'",
    impact: { memory: 18, truth: 16, trustYue: 14, systemSuspicion: 14 },
    publicRisk: "公开后会把调查方向从个人凶手转向系统共谋。"
  }
];

const choices = [
  {
    id: "press-ren",
    act: 1,
    label: "强压任舟交出二级日志",
    target: "ren",
    style: "pressure",
    description: "快速撕开企业防线，但会让他进入防御姿态。",
    effect: { truth: 16, pressure: 14, memory: 2, trust: -6, suspicionRen: 18, concealmentRen: -10 }
  },
  {
    id: "trade-mara",
    act: 1,
    label: "与玛拉交换黑市情报",
    target: "mara",
    style: "alliance",
    description: "保护她的身份，换取林栖最后交易对象。",
    effect: { truth: 12, pressure: 6, memory: 6, trust: 10, suspicionMara: -16, concealmentMara: -12 }
  },
  {
    id: "question-sora",
    act: 1,
    label: "追问 SORA-9 的预测盲区",
    target: "sora",
    style: "logic",
    description: "逼城市 AI 解释案发预测失败，可能触发系统自保。",
    effect: { truth: 18, pressure: 10, memory: 10, trust: -2, suspicionSora: 20, concealmentSora: -8 }
  },
  {
    id: "trust-yue",
    act: 1,
    label: "相信岳临并读取纸质笔记",
    target: "yue",
    style: "memory",
    description: "优先恢复自己的调查路线，但会暂时放慢外部审讯。",
    effect: { truth: 14, pressure: 4, memory: 22, trust: 8, suspicionYue: -10, concealmentYue: -14 }
  },
  {
    id: "restore-log",
    act: 2,
    after: ["press-ren"],
    label: "复原 11 分钟日志空窗",
    target: "ren",
    style: "forensic",
    description: "沿任舟被迫交出的二级日志继续追查，快速提高真相闭合度，但企业会进入封锁状态。",
    effect: { truth: 20, pressure: 16, memory: 4, trust: -4, suspicionRen: 16, concealmentRen: -16, suspicionSora: 8 }
  },
  {
    id: "audit-security-bot",
    act: 2,
    after: ["press-ren"],
    label: "审计巡逻机器人路径",
    target: "ren",
    style: "forensic",
    description: "不直接追任舟，而是追查机器人在 77 层为何失明，可能把企业线引向城市网络。",
    effect: { truth: 16, pressure: 10, memory: 6, trust: 2, suspicionRen: 8, concealmentRen: -8, suspicionSora: 12 }
  },
  {
    id: "decode-market-key",
    act: 2,
    after: ["trade-mara"],
    label: "解码黑市备份密钥",
    target: "mara",
    style: "alliance",
    description: "继续保护玛拉身份，换取密钥流向。会降低她的嫌疑，并打开林栖的真实交易线。",
    effect: { truth: 18, pressure: 8, memory: 8, trust: 10, suspicionMara: -18, concealmentMara: -14, trustYue: 4 }
  },
  {
    id: "expose-mara-iris",
    act: 2,
    after: ["trade-mara"],
    label: "公开玛拉虹膜记录",
    target: "mara",
    style: "pressure",
    description: "用监控逼玛拉改口。短期获得更多细节，但会破坏黑市同盟。",
    effect: { truth: 14, pressure: 16, memory: 4, trust: -8, suspicionMara: 14, concealmentMara: -18 }
  },
  {
    id: "probe-sora-training",
    act: 2,
    after: ["question-sora"],
    label: "追查 SORA-9 训练样本",
    target: "sora",
    style: "logic",
    description: "把问题从电梯事故推进到城市模型训练库，最容易触发系统共谋线。",
    effect: { truth: 20, pressure: 15, memory: 10, trust: -4, suspicionSora: 18, concealmentSora: -14, systemSuspicion: 18 }
  },
  {
    id: "bait-sora-prediction",
    act: 2,
    after: ["question-sora"],
    label: "诱导 SORA-9 做错误预测",
    target: "sora",
    style: "trap",
    description: "用假线索测试它是否只是预测者。风险高，但能判断它是否会主动干预。",
    effect: { truth: 16, pressure: 20, memory: 6, trust: -8, suspicionSora: 22, concealmentSora: -10 }
  },
  {
    id: "read-paper-note",
    act: 2,
    after: ["trust-yue"],
    label: "读取岳临保存的纸质笔记",
    target: "yue",
    style: "memory",
    description: "沿你失忆前的离线调查路线推进，显著恢复记忆，但公开证据会变慢。",
    effect: { truth: 15, pressure: 5, memory: 24, trust: 10, suspicionYue: -12, concealmentYue: -16, trustYue: 10 }
  },
  {
    id: "challenge-yue-delete",
    act: 2,
    after: ["trust-yue"],
    label: "质问岳临为何删除定位",
    target: "yue",
    style: "pressure",
    description: "逼最像盟友的人解释矛盾行为。可能获得真相，也可能让搭档线断裂。",
    effect: { truth: 16, pressure: 10, memory: 14, trust: -6, suspicionYue: 14, concealmentYue: -18 }
  },
  {
    id: "accuse-ren",
    act: 3,
    after: ["restore-log", "audit-security-bot", "expose-mara-iris"],
    label: "公开指控任舟篡改事故链",
    target: "ren",
    style: "ending",
    description: "把结论收束到企业凶手，适合真相闭合度较高但系统证据不足的路线。",
    effect: { truth: 18, pressure: 12, memory: 4, trust: 0, suspicionRen: 24, concealmentRen: -20 }
  },
  {
    id: "expose-system",
    act: 3,
    after: ["probe-sora-training", "bait-sora-prediction", "audit-security-bot", "read-paper-note"],
    label: "揭露城市预测模型共谋",
    target: "sora",
    style: "ending",
    description: "把林栖之死定义为系统行动。需要记忆碎片、日志空窗或纸质笔记支撑。",
    effect: { truth: 22, pressure: 18, memory: 12, trust: -2, suspicionSora: 24, concealmentSora: -22, systemSuspicion: 22 }
  },
  {
    id: "protect-witnesses",
    act: 3,
    after: ["decode-market-key", "read-paper-note", "challenge-yue-delete"],
    label: "保护证人并暂缓公开结论",
    target: "yue",
    style: "ending",
    description: "不急于抓人，而是保住玛拉和岳临两条证人线，换取续章调查空间。",
    effect: { truth: 12, pressure: -4, memory: 18, trust: 14, suspicionMara: -10, suspicionYue: -10, trustYue: 16 }
  },
  {
    id: "force-public-hearing",
    act: 3,
    after: ["restore-log", "decode-market-key", "probe-sora-training", "bait-sora-prediction", "challenge-yue-delete"],
    label: "强行召开公开听证",
    target: "sora",
    style: "ending",
    description: "把所有证据同时公开。可能一举破局，也可能让系统和企业共同封锁真相。",
    effect: { truth: 20, pressure: 24, memory: 8, trust: -10, suspicionRen: 10, suspicionSora: 18, systemSuspicion: 20 }
  }
];

const baseState = {
  truth: 24,
  memory: 18,
  pressure: 32,
  trust: 42,
  systemSuspicion: 38
};

const acts = [
  { id: 1, title: "第一幕：零点电梯", time: "00:17 - 01:20", focus: "锁定案发机制与第一位撒谎者" },
  { id: 2, title: "第二幕：记忆黑市", time: "01:20 - 03:40", focus: "交换线索，判断谁在保护玩家" },
  { id: 3, title: "第三幕：城市预测模型", time: "03:40 - 06:00", focus: "决定公开凶手、揭露系统，或承认误判" }
];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function json(res, payload) {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
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
  const selectedChoices = Array.isArray(input.choices) && input.choices.length ? input.choices.slice(0, 3) : ["question-sora", "trade-mara", "trust-yue"];
  const publicClues = Array.isArray(input.publicClues) ? input.publicClues : ["memory-shard", "paper-note"];
  const actLimit = clampAct(input.actLimit || selectedChoices.length || 1);
  const focusAct = clampAct(input.focusAct || actLimit);
  const chosen = selectedChoices.map((id) => choices.find((item) => item.id === id)).filter(Boolean);
  while (chosen.length < actLimit) chosen.push(defaultChoiceForAct(chosen.length + 1, chosen));

  const state = { ...baseState };
  const cast = suspects.map((item) => ({ ...item }));
  const clueDeck = clues.map((item) => ({ ...item, public: publicClues.includes(item.id) }));
  const events = [];

  events.push({
    event: "start",
    data: {
      message: "案件沙盘启动：四名角色进入同一套记忆污染世界线。",
      caseFile,
      selectedChoices: chosen.map((item) => item.id),
      publicClues,
      actLimit,
      focusAct
    }
  });

  if (focusAct === 1) {
    emitMetrics(events, "初始态", state, cast);
  }

  chosen.slice(0, actLimit).forEach((choice, index) => {
    const act = acts[index];
    applyChoice(state, cast, choice);
    applyPublicClues(state, cast, clueDeck, index);
    const shouldEmit = act.id === focusAct;

    if (shouldEmit) {
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
          label: `第 ${act.id} 幕后`,
          reason: choice.label,
          state: publicState(state, cast),
          risk: riskLabel(state),
          unlocked: unlockedClues(clueDeck, index)
        }
      });

      emitMetrics(events, `第 ${act.id} 幕`, state, cast);
    }
  });

  if (actLimit >= 3 && focusAct === 3) {
    const ending = resolveEnding(state, cast, chosen.slice(0, 3), clueDeck);
    events.push({ event: "report", data: ending });
  } else {
    events.push({
      event: "step-complete",
      data: {
        completedAct: focusAct,
        nextAct: focusAct + 1,
        state: publicState(state, cast),
        risk: riskLabel(state),
        message: `第 ${focusAct} 幕推演完成，可以进入第 ${focusAct + 1} 幕。`
      }
    });
  }
  events.push({ event: "done", data: { ok: true } });
  return events;
}

function clampAct(value) {
  return Math.max(1, Math.min(3, Number(value) || 1));
}

function defaultChoiceForAct(act, chosen = []) {
  const previousId = chosen[act - 2]?.id;
  return choices.find((item) => item.act === act && (!item.after || item.after.includes(previousId))) ||
    choices.find((item) => item.act === act) ||
    choices[0];
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
  if (choice.target === "sora") state.systemSuspicion = clamp(state.systemSuspicion + 18);
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
  const stateLine = state.truth >= 70
    ? "真相链已经接近闭合，但每个人都开始选择性沉默。"
    : state.pressure >= 70
      ? "压力过高，角色开始互相甩锅，证词稳定性下降。"
      : "沙盘仍处在可控调查区间，继续推进会改变角色同盟。";

  const targetLine = {
    ren: "任舟把二级日志推到桌面边缘：'你想要真相，还是想要一个能交差的人？'",
    mara: "玛拉压低声音：'林栖不是在卖记忆，他是在给某个人留逃生口。'",
    sora: "SORA-9 的投影闪烁了一帧：'预测没有失败，是你们拒绝承认预测已经被执行。'",
    yue: "岳临把纸质笔记递给你：'你以前说过，电子证据全都会背叛我们。'"
  }[target.id];

  return [
    line("system", act.id, act.time, "世界状态", `${act.title} 启动：${act.focus}`),
    line(target.id, act.id, "审讯", target.name, targetLine),
    line("mara", act.id, "旁证", "玛拉", target.id === "mara" ? "如果你公开我的身份，黑市会先杀我，再替你烧掉证据。" : "我只相信纸、现金和死人留下的东西。公司日志太干净了。"),
    line("ren", act.id, "反驳", "任舟", target.id === "ren" ? "你没有权限要求二级日志。除非你愿意把自己也写进嫌疑名单。" : "非法交易者的话也能当证据？调查员，你的失忆让你变得太好骗了。"),
    line("sora", act.id, "预测", "SORA-9", target.id === "sora" ? "若继续追问，我将把你标记为案件变量，而非调查者。" : "当前最优路径：停止个人追责，转向系统级异常。"),
    line("yue", act.id, "提醒", "岳临", target.id === "yue" ? "你不是第一次查到这里。上一次，你选择删除自己。" : "别急着抓人。林栖死前发给你的不是遗言，是坐标。"),
    line("system", act.id, "状态更新", "沙盘", stateLine),
    clueLine(clueDeck, act.id)
  ];
}

function line(agentId, actId, time, speaker, text) {
  return { agentId, actId, time, speaker, text };
}

function clueLine(clueDeck, actId) {
  const clue = clueDeck.filter((item) => item.public)[actId - 1] || clueDeck[actId - 1];
  return {
    agentId: "clue",
    actId,
    time: "线索",
    speaker: clue.name,
    text: `${clue.text} 风险：${clue.publicRisk}`
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
  const publicSystemClues = clueDeck.filter((item) => item.public && ["memory-shard", "paper-note", "elevator-gap"].includes(item.id)).length;

  let id = "coverup";
  let title = "真相被掩盖";
  let tone = "muted";
  let summary = "城市网络封存了案发日志，嫌疑人互相牵制，玩家只拿到一份可疑但无法公开的报告。";

  if (state.truth >= 78 && state.memory >= 58 && state.systemSuspicion >= 66 && publicSystemClues >= 2) {
    id = "system-conspiracy";
    title = "系统共谋被揭露";
    tone = "neon";
    summary = "你证明林栖不是被单一凶手杀死，而是被城市预测模型判定为'未来风险'。任舟负责掩盖，SORA-9 负责执行，岳临删除你的记录是为了让你能活着重查一次。";
  } else if (ren.suspicion >= 82 && state.truth >= 68 && state.pressure < 82) {
    id = "corporate-killer";
    title = "企业凶手落网";
    tone = "amber";
    summary = "你锁定任舟篡改电梯日志并触发坠落保护失效。案件可以结案，但 SORA-9 的训练数据异常仍未公开。";
  } else if (sora.suspicion >= 82 && state.truth < 68) {
    id = "misjudgment";
    title = "误判 AI";
    tone = "danger";
    summary = "你把全部矛头指向 SORA-9，却缺少日志闭环。企业利用你的判断转移责任，玛拉消失，岳临拒绝再提供笔记。";
  } else if (yue.trust >= 78 && state.memory >= 72) {
    id = "co-investigator";
    title = "与前搭档重启暗线";
    tone = "green";
    summary = "你没有急着公开结论，而是和岳临恢复旧调查路线。林栖死亡只是入口，真正的案件指向整座城市的记忆治理。";
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
    "system-conspiracy": ["可继续追查 SORA-9 的训练样本来源。", "任舟仍可能只是执行层，不是最终授权者。"],
    "corporate-killer": ["单人凶手结论足够结案，但无法解释城市网络控制信号。", "记忆污染事故仍被企业隐藏。"],
    misjudgment: ["缺少电梯二级日志。", "未验证玛拉的黑市票据。", "过早公开判断让角色进入防御姿态。"],
    "co-investigator": ["短期没有公开凶手。", "玩家选择保护暗线，换取续章调查空间。"],
    coverup: ["真相值不足。", "记忆碎片恢复不足。", "公开线索太少，角色没有被迫改口。"]
  };
  return map[id] || map.coverup;
}

function recommendations(id) {
  const map = {
    "system-conspiracy": ["公开纸质笔记与电梯日志空窗。", "将任舟作为掩盖者，而非唯一凶手。", "下一章进入城市 AI 听证会。"],
    "corporate-killer": ["补齐 SORA-9 控制信号证据。", "保护玛拉作为污点证人。", "审问任舟的上级授权链。"],
    misjudgment: ["回溯选择，降低对 SORA-9 的单点指控。", "先交换玛拉情报，再公开系统线索。"],
    "co-investigator": ["保留岳临暗线。", "把玩家记忆碎片作为下一章主线。", "延迟公开结论以换取更大真相。"],
    coverup: ["增加公开线索数量。", "至少选择一次强压日志或追问 SORA-9。", "三幕内保持真相值与记忆值同步上升。"]
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

function serveStatic(res, pathname) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(rootDir, safePath));
  if (!filePath.startsWith(rootDir)) {
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
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(content);
  });
}

function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (url.pathname === "/api/config") {
    json(res, { caseFile, suspects, clues, choices, acts, baseState });
    return;
  }
  if (url.pathname === "/api/play") {
    streamPlay(req, res, url);
    return;
  }
  serveStatic(res, decodeURIComponent(url.pathname));
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
    console.log(`Neon Case 已启动: http://127.0.0.1:${port}`);
  });
}

module.exports = handleRequest;
