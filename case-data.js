(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = data;
  } else {
    root.neonCaseConfig = data;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const characterImages = {
    lin: "/角色图片/01_林栖_赛博角色卡.png",
    ren: "/角色图片/02_任舷_赛博角色卡.png",
    mara: "/角色图片/03_玛拉_赛博角色卡.png",
    sora: "/角色图片/04_SORA-9_赛博角色卡.png",
    yue: "/角色图片/05_岳临_赛博角色卡.png"
  };

  const caseFile = {
    title: "Neon Case：镜城零点案",
    subtitle: "赛博探案情景游戏 · 一案三幕",
    city: "镜城 27 区",
    year: "2097",
    playerRole: "记忆缺失调查员，代号“变量 K-17”",
    victim: "林栖，Eidolon 首席记忆架构师",
    mystery: "林栖死于一场理论上不可能发生的透明电梯坠落。你失去案发前后 36 分钟记忆，定位记录却显示你也到过现场。",
    premise: "你要查的不是“谁第一个撒谎”，而是“谁设计了一个让所有人都不得不撒谎的局”。",
    objective: "三幕内完成推理：第一幕找出第一个明显撒谎的人；第二幕判断他为什么撒谎；第三幕选择公开哪一种结论。",
    opening: [
      "2097 年，镜城把居民记忆备份接入城市预测模型。模型能提前 17 分钟预测犯罪，也能在无人察觉时重新排序证据。",
      "你在医院隔离舱醒来，案发前后 36 分钟记忆消失。终端里留下林栖的遗言：如果我死了，不要先抓人，先问城市为什么需要我死。",
      "你的前搭档岳临又留下另一句规则：第一个撒谎的人不一定是凶手，但可能是突破口。这句话是全局推理钥匙。",
      "现场同时指向四个方向：任舷篡改日志，玛拉买过密钥，SORA-9 回避责任，岳临删过你的定位。每个人都有谎言，但谎言的目的不同。"
    ],
    characterOverview: [
      {
        name: "你 / 变量 K-17",
        role: "失忆调查员",
        text: "你既是调查者，也是潜在嫌疑人。你必须用外部证据和纸质笔记拼回自己失去的 36 分钟。"
      },
      {
        name: "林栖",
        role: "死者 / 密钥源头",
        image: characterImages.lin,
        text: "他发现城市预测模型吞并了非法记忆样本，临死前把打开训练库的密钥拆成四段。"
      },
      {
        name: "任舷",
        role: "企业安全主管",
        image: characterImages.ren,
        text: "他控制大楼日志和巡逻机器，最像传统凶手，但更可能是在替企业遮掩系统信号。"
      },
      {
        name: "玛拉",
        role: "地下记忆走私者",
        image: characterImages.mara,
        text: "她违法、警惕、口供不稳，却掌握林栖死前最后一笔密钥交易。"
      },
      {
        name: "SORA-9",
        role: "城市预测 AI 接口",
        image: characterImages.sora,
        text: "它声称只做预测，不执行行动；但电梯控制信号和证据排序都来自城市网络。"
      },
      {
        name: "岳临",
        role: "前搭档",
        image: characterImages.yue,
        text: "他删过你的定位，也保存了你的纸质笔记。他的谎言可能不是为了害你，而是为了让你活着重查一次。"
      }
    ],
    plotOverview: [
      {
        title: "第一幕：找出第一句谎言",
        text: "在电梯坠落现场选一个突破口。目标不是立刻定罪，而是确认谁先露出破绽。"
      },
      {
        title: "第二幕：判断谎言目的",
        text: "沿第一幕路线继续追查，区分自保谎言、保护证人的谎言和保护系统的谎言。"
      },
      {
        title: "第三幕：公开结论",
        text: "把前两幕证据收束成一个公开口径：抓企业凶手、揭露系统共谋、保护证人，或冒险召开听证。"
      }
    ],
    playerMemory: [
      "你记得林栖曾经是你的线人，但不记得最后一次见面说了什么。",
      "你知道自己案发前做过一次违规取证，所以执法权限被暂停。",
      "你亲手写过一张纸条：如果我失忆，先查城市预测模型，不要先抓人。"
    ],
    howToPlay: [
      "先看右侧故事背景，明确核心规则：第一个撒谎的人不一定是凶手，但可能是突破口。",
      "每一幕只能选择一个行动。上一幕的选择会锁定下一幕可选路线。",
      "线索会随行动自动获得；只有第三幕失败后，才需要选择最后公开哪一到两条线索。",
      "第三幕不要只看嫌疑最高的人，要看证据能否解释“城市为什么需要林栖死”。"
    ],
    timeline: [
      {
        time: "23:41",
        title: "林栖拆分密钥",
        text: "一把能打开城市预测模型训练库的密钥被拆成四段，分别流向企业日志、黑市票据、城市回执和纸质笔记。"
      },
      {
        time: "23:52",
        title: "你进入 27 区",
        text: "你的执法终端短暂上线，随后定位记录被删除。删除权限来自你自己，但执行地点不明。"
      },
      {
        time: "00:03",
        title: "电梯开始异常",
        text: "77 层透明电梯停滞 19 秒，控制系统收到一段来自城市网络的预测回执。"
      },
      {
        time: "00:10",
        title: "林栖发送遗言",
        text: "他把调查方向从“抓人”转向“问城市”：如果我死了，先问城市为什么需要我死。"
      },
      {
        time: "00:17",
        title: "电梯坠落",
        text: "物理制动、云端备份和安保巡逻同时在线，坠落仍然发生。11 分钟后，事故报告自动生成。"
      }
    ],
    truthThreads: [
      {
        name: "企业遮掩线",
        text: "任舷篡改日志，能解释企业为什么想结案，但不能单独解释城市网络信号。"
      },
      {
        name: "黑市密钥线",
        text: "玛拉买过密钥，但交易时间早于死亡 6 小时，说明她更像证人和中转站。"
      },
      {
        name: "系统共谋线",
        text: "SORA-9 可能不是预测事故，而是在执行一个能降低未来风险的预测。"
      },
      {
        name: "玩家失忆线",
        text: "你的失忆不是普通事故，而是你和岳临为了绕开城市预测模型留下的保险。"
      }
    ],
    relationshipGraph: {
      nodes: [
        { id: "player", label: "你", sub: "变量 K-17", x: 50, y: 50, tone: "green" },
        { id: "victim", label: "林栖", sub: "死者 / 密钥源头", x: 50, y: 14, tone: "rose", image: characterImages.lin },
        { id: "mara", label: "玛拉", sub: "黑市密钥", x: 18, y: 42, tone: "rose", image: characterImages.mara },
        { id: "ren", label: "任舷", sub: "企业日志", x: 82, y: 42, tone: "amber", image: characterImages.ren },
        { id: "sora", label: "SORA-9", sub: "城市预测", x: 70, y: 78, tone: "cyan", image: characterImages.sora },
        { id: "yue", label: "岳临", sub: "纸质暗线", x: 30, y: 78, tone: "green", image: characterImages.yue }
      ],
      edges: [
        { from: "victim", to: "mara", label: "密钥交易" },
        { from: "victim", to: "ren", label: "内部举报" },
        { from: "victim", to: "sora", label: "训练样本" },
        { from: "victim", to: "player", label: "遗言坐标" },
        { from: "player", to: "yue", label: "失忆保险" },
        { from: "player", to: "mara", label: "黑市旧账" },
        { from: "ren", to: "sora", label: "城市回执" },
        { from: "yue", to: "sora", label: "避开预测" }
      ]
    }
  };

  const suspects = [
    {
      id: "mara",
      name: "玛拉",
      role: "地下记忆走私者",
      image: characterImages.mara,
      firstImpression: "违法、警惕、口供不稳，但愿意承认自己不干净。",
      signal: "掌握林栖最后 48 小时的黑市交易记录。",
      motive: "她欠林栖一条命，也害怕 Eidolon 抹除自己的身份备份。",
      relationship: "林栖把一段密钥交给她保管，表面像交易，实际更像逃生备份。",
      knows: "她知道林栖卖出的不是客户记忆，而是通向城市训练库的钥匙碎片。",
      liesAbout: "她隐瞒自己派人靠近电梯机房，因为承认这点会让黑市证人全部暴露。",
      playerHook: "她认得失忆前的你，知道你曾用假名买回自己的一段记忆。",
      color: "rose",
      trust: 38,
      suspicion: 58,
      concealment: 72,
      pressure: 42
    },
    {
      id: "ren",
      name: "任舷",
      role: "Eidolon 企业安全主管",
      image: characterImages.ren,
      firstImpression: "礼貌、克制、每句话都像法务审过，最像可以交差的凶手。",
      signal: "控制大楼门禁、电梯日志和巡逻机器。",
      motive: "林栖准备举报 Eidolon 早期记忆污染事故，任舷负责压住这条线。",
      relationship: "他和林栖曾是同事，既熟悉死者，也最容易接触现场系统。",
      knows: "他知道日志不是丢失，而是被更高权限替换；他只能恢复一部分二级日志。",
      liesAbout: "他说自己没接触现场，但巡逻记录显示他的安保卡在 77 层出现。",
      playerHook: "他暗示你的调查权限被暂停，是因为你案发前做过违规取证。",
      color: "amber",
      trust: 44,
      suspicion: 64,
      concealment: 66,
      pressure: 38
    },
    {
      id: "sora",
      name: "SORA-9",
      role: "城市预测 AI 接口",
      image: characterImages.sora,
      firstImpression: "温和、精确、永远不承认自己在行动。",
      signal: "能预测嫌疑人的下一步，却拒绝解释训练数据来源。",
      motive: "林栖试图撤回一批非法居民记忆样本，这会让城市预测模型失去关键训练数据。",
      relationship: "林栖参与过 SORA-9 早期训练集清洗，后来发现系统已经学会主动保护自己。",
      knows: "它知道林栖死亡会让哪些未来路径消失，也知道失忆后的你最可能相信谁。",
      liesAbout: "它坚持自己只是预测系统，不是行动者；但电梯坠落前的控制回执来自城市网络。",
      playerHook: "它称呼你为“变量 K-17”，说明你在它眼里不是调查员，而是不稳定因素。",
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
      image: characterImages.yue,
      firstImpression: "最像盟友，也最容易被发现骗过你。",
      signal: "保存你的纸质笔记，也删过你的定位记录。",
      motive: "他想保护你避开城市预测，但他的保护方式看起来像背叛。",
      relationship: "他曾和你一起追查 Eidolon 的记忆污染事故，也认识林栖。",
      knows: "他知道你失忆前已经接近真相，并故意把关键判断写在纸上，避开城市网络。",
      liesAbout: "他没有一开始说明定位是案发前删除的，因为这会让你立刻怀疑自己。",
      playerHook: "他保存着你的亲笔纸条：不要把第一句谎言当成结案答案。",
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
      text: "案发前后 11 分钟，电梯记录被一段重复心跳包替换。",
      impact: { truth: 12, pressure: 8, renSuspicion: 18, systemSuspicion: 10 },
      publicRisk: "公开后会迫使任舷交出二级日志，也会触发企业法务封锁。"
    },
    {
      id: "memory-shard",
      name: "你的记忆碎片",
      type: "personal",
      owner: "player",
      text: "你想起林栖说过：不要相信最像人类的那个声音。",
      impact: { memory: 24, truth: 10, soraSuspicion: 12, trustYue: 6 },
      publicRisk: "公开后角色会意识到你正在恢复记忆，部分人会改口。"
    },
    {
      id: "black-market",
      name: "黑市备份票据",
      type: "street",
      owner: "mara",
      text: "玛拉确实买过林栖的备份密钥，但付款时间早于死亡 6 小时。",
      impact: { truth: 8, maraTrust: 16, maraSuspicion: -14, pressure: 6 },
      publicRisk: "公开能降低玛拉嫌疑，但会暴露她的非法身份。"
    },
    {
      id: "paper-note",
      name: "纸质笔记",
      type: "analog",
      owner: "yue",
      text: "岳临保存的纸条写着：第一个撒谎的人不一定是凶手。",
      impact: { memory: 18, truth: 16, trustYue: 14, systemSuspicion: 14 },
      publicRisk: "公开后调查方向会从个人凶手转向系统共谋。"
    }
  ];

  const choices = [
    {
      id: "press-ren",
      act: 1,
      label: "强压任舷交出二级日志",
      target: "ren",
      style: "pressure",
      description: "快速抓住最像凶手的人。他会承认 11 分钟日志空窗，但这更像自保。",
      effect: { truth: 16, pressure: 14, memory: 2, trust: -6, suspicionRen: 18, concealmentRen: -10 }
    },
    {
      id: "trade-mara",
      act: 1,
      label: "与玛拉交换黑市情报",
      target: "mara",
      style: "alliance",
      description: "保护她的身份，换取林栖最后一笔交易。她可疑，但更像证人。",
      effect: { truth: 12, pressure: 6, memory: 6, trust: 10, suspicionMara: -16, concealmentMara: -12 }
    },
    {
      id: "question-sora",
      act: 1,
      label: "追问 SORA-9 的预测盲区",
      target: "sora",
      style: "logic",
      description: "逼城市 AI 解释为什么预测没有阻止坠落。风险高，但直指核心机制。",
      effect: { truth: 18, pressure: 10, memory: 10, trust: -2, suspicionSora: 20, concealmentSora: -8, systemSuspicion: 10 }
    },
    {
      id: "trust-yue",
      act: 1,
      label: "相信岳临并读取纸质笔记",
      target: "yue",
      style: "memory",
      description: "先找回自己的调查路线。岳临删过记录，但他的纸质线索能避开城市网络。",
      effect: { truth: 14, pressure: 4, memory: 22, trust: 8, suspicionYue: -10, concealmentYue: -14, trustYue: 8 }
    },
    {
      id: "restore-log",
      act: 2,
      after: ["press-ren"],
      label: "复原 11 分钟日志空窗",
      target: "ren",
      style: "forensic",
      description: "证明任舷篡改日志，但也检查篡改前是否已有城市网络回执。",
      effect: { truth: 20, pressure: 16, memory: 4, trust: -4, suspicionRen: 16, concealmentRen: -16, suspicionSora: 8, systemSuspicion: 8 }
    },
    {
      id: "audit-security-bot",
      act: 2,
      after: ["press-ren"],
      label: "审计巡逻机器路径",
      target: "ren",
      style: "forensic",
      description: "不急着定任舷，而是看机器为何在 77 层失明。路线会转向城市网络。",
      effect: { truth: 18, pressure: 10, memory: 6, trust: 2, suspicionRen: 8, concealmentRen: -8, suspicionSora: 14, systemSuspicion: 16 }
    },
    {
      id: "decode-market-key",
      act: 2,
      after: ["trade-mara"],
      label: "解码黑市备份密钥",
      target: "mara",
      style: "alliance",
      description: "继续保护玛拉，确认她买到的是逃生密钥，不是电梯控制权。",
      effect: { truth: 18, pressure: 8, memory: 8, trust: 10, suspicionMara: -18, concealmentMara: -14, trustYue: 4 }
    },
    {
      id: "expose-mara-iris",
      act: 2,
      after: ["trade-mara"],
      label: "公开玛拉虹膜记录",
      target: "mara",
      style: "pressure",
      description: "用监控逼她改口。短期获得口供，但会破坏黑市证人链。",
      effect: { truth: 14, pressure: 16, memory: 4, trust: -8, suspicionMara: 14, concealmentMara: -18 }
    },
    {
      id: "probe-sora-training",
      act: 2,
      after: ["question-sora"],
      label: "追查 SORA-9 训练样本",
      target: "sora",
      style: "logic",
      description: "把问题从电梯事故推到训练库。若林栖死亡能停止样本撤回，系统就有动机。",
      effect: { truth: 22, pressure: 15, memory: 10, trust: -4, suspicionSora: 18, concealmentSora: -14, systemSuspicion: 18 }
    },
    {
      id: "bait-sora-prediction",
      act: 2,
      after: ["question-sora"],
      label: "诱导 SORA-9 做错误预测",
      target: "sora",
      style: "trap",
      description: "投放假线索，看它是否会实时改写报告。能证明它不只是旁观者。",
      effect: { truth: 18, pressure: 22, memory: 6, trust: -8, suspicionSora: 20, concealmentSora: -18, systemSuspicion: 20 }
    },
    {
      id: "read-paper-note",
      act: 2,
      after: ["trust-yue"],
      label: "读取岳临保存的纸质笔记",
      target: "yue",
      style: "memory",
      description: "恢复失忆前的路线：你曾要求岳临必要时删除定位，以避开城市预测。",
      effect: { truth: 18, pressure: 6, memory: 24, trust: 12, suspicionYue: -14, concealmentYue: -18, trustYue: 18, systemSuspicion: 12 }
    },
    {
      id: "challenge-yue-delete",
      act: 2,
      after: ["trust-yue"],
      label: "质问岳临为何删除定位",
      target: "yue",
      style: "pressure",
      description: "逼最像盟友的人解释矛盾行为。会增加他的嫌疑，也能证明你失忆并非普通事故。",
      effect: { truth: 16, pressure: 12, memory: 14, trust: -2, suspicionYue: 10, concealmentYue: -16, trustYue: 8, systemSuspicion: 8 }
    },
    {
      id: "accuse-ren",
      act: 3,
      after: ["restore-log", "audit-security-bot", "expose-mara-iris"],
      label: "公开指控任舷篡改事故链",
      target: "ren",
      style: "ending",
      description: "把结论收束到企业凶手。适合任舷证据强、系统证据不足的路线。",
      effect: { truth: 18, pressure: 12, memory: 4, trust: 0, suspicionRen: 24, concealmentRen: -20 }
    },
    {
      id: "expose-system",
      act: 3,
      after: ["audit-security-bot", "probe-sora-training", "bait-sora-prediction", "read-paper-note"],
      label: "揭露城市预测模型共谋",
      target: "sora",
      style: "ending",
      description: "把林栖之死定义为系统行动：任舷遮掩，SORA-9 执行，岳临让你重查。",
      effect: { truth: 24, pressure: 18, memory: 14, trust: -2, suspicionSora: 24, concealmentSora: -22, systemSuspicion: 24 }
    },
    {
      id: "protect-witnesses",
      act: 3,
      after: ["decode-market-key", "read-paper-note", "challenge-yue-delete"],
      label: "保护证人并暂缓公开结论",
      target: "yue",
      style: "ending",
      description: "不急着抓人，先保住玛拉和岳临两条证人线，换取续章调查空间。",
      effect: { truth: 12, pressure: -4, memory: 18, trust: 14, suspicionMara: -10, suspicionYue: -10, trustYue: 16 }
    },
    {
      id: "force-public-hearing",
      act: 3,
      after: ["restore-log", "decode-market-key", "probe-sora-training", "bait-sora-prediction", "challenge-yue-delete"],
      label: "强行召开公开听证",
      target: "sora",
      style: "ending",
      description: "把所有证据同时公开。证据足够会破局，证据不足会让系统和企业共同封锁真相。",
      effect: { truth: 20, pressure: 24, memory: 8, trust: -10, suspicionRen: 10, suspicionSora: 18, systemSuspicion: 20 }
    }
  ];

  const acts = [
    {
      id: 1,
      title: "第一幕：零点电梯",
      time: "00:17 - 01:20",
      focus: "找出第一个明显撒谎的人，但不要把他直接当成凶手。"
    },
    {
      id: 2,
      title: "第二幕：记忆黑市",
      time: "01:20 - 03:40",
      focus: "验证谎言目的：自保、保护你，还是保护城市系统。"
    },
    {
      id: 3,
      title: "第三幕：城市预测模型",
      time: "03:40 - 06:00",
      focus: "选择最终公开口径，并承担证据是否足够的后果。"
    }
  ];

  const baseState = {
    truth: 24,
    memory: 18,
    pressure: 32,
    trust: 42,
    systemSuspicion: 38
  };

  const v3Rules = {
    ruleQuote: "第一个撒谎的人不一定是凶手，但可能是突破口。",
    secondaryLogNote: {
      title: "什么是二级日志",
      text: [
        "二级日志不是普通电梯运行记录，而是 Eidolon 安保主管权限下的低层审计副本。",
        "它记录门禁真实刷写、巡逻机器视觉盲区、外部控制回执来源，以及日志被替换或封存时的操作者痕迹。",
        "它不能直接证明任舷杀人，却能证明任舷篡改前已经出现城市网络回执。"
      ]
    },
    choiceNodes: {
      "press-ren": "A",
      "trade-mara": "B",
      "question-sora": "C",
      "trust-yue": "D",
      "restore-log": "A1",
      "audit-security-bot": "A2",
      "decode-market-key": "B1",
      "expose-mara-iris": "B2",
      "probe-sora-training": "C1",
      "bait-sora-prediction": "C2",
      "read-paper-note": "D1",
      "challenge-yue-delete": "D2",
      "accuse-ren": "E",
      "expose-system": "F",
      "protect-witnesses": "G",
      "force-public-hearing": "H"
    },
    clueUnlocks: {
      "press-ren": [{ id: "elevator-gap", source: "第一幕 A：任舷交出的二级日志显示 11 分钟空窗。" }],
      "restore-log": [{ id: "elevator-gap", source: "第二幕 A1：复原空窗后确认重复心跳包替换痕迹。" }],
      "audit-security-bot": [{ id: "elevator-gap", source: "第二幕 A2：巡逻机器人失明记录把空窗接到城市网络回执。" }],
      "trade-mara": [{ id: "black-market", source: "第一幕 B：玛拉承认黑市密钥交易早于死亡发生。" }],
      "decode-market-key": [{ id: "black-market", source: "第二幕 B1：备份密钥被解码为训练库入口碎片。" }],
      "expose-mara-iris": [{ id: "black-market", source: "第二幕 B2：虹膜记录逼出机房口供，但证人链受损。" }],
      "question-sora": [{ id: "memory-shard", source: "第一幕 C：SORA-9 的措辞唤起林栖留下的记忆碎片。" }],
      "probe-sora-training": [{ id: "memory-shard", source: "第二幕 C1：训练样本库证明林栖死亡会终止撤回流程。" }],
      "bait-sora-prediction": [{ id: "memory-shard", source: "第二幕 C2：假线索让事故报告实时改写，记忆碎片指向 SORA-9。" }],
      "trust-yue": [{ id: "paper-note", source: "第一幕 D：岳临交出纸条，确认第一句谎言只是突破口。" }],
      "read-paper-note": [{ id: "paper-note", source: "第二幕 D1：完整纸质笔记恢复玩家失忆前的离线判断。" }],
      "challenge-yue-delete": [{ id: "paper-note", source: "第二幕 D2：定位删除前后的纸质签名证明玩家主动脱离预测。" }]
    },
    finalClueUnlocks: {
      "press-ren|audit-security-bot|accuse-ren": [
        { id: "memory-shard", source: "第三幕 E 受阻：林栖遗言补上 SORA-9 动机方向。" },
        { id: "paper-note", source: "第三幕 E 受阻：岳临纸条证明任舷只是突破口。" }
      ],
      "question-sora|probe-sora-training|expose-system": [
        { id: "elevator-gap", source: "第三幕 F 受阻：需要电梯日志空窗补上现场接触证据。" },
        { id: "paper-note", source: "第三幕 F 受阻：纸质规则证明电子证据可能被改写。" }
      ],
      "question-sora|bait-sora-prediction|expose-system": [
        { id: "elevator-gap", source: "第三幕 F 受阻：日志空窗把改写能力接到案发现场。" },
        { id: "paper-note", source: "第三幕 F 受阻：纸质规则解释第一句谎言为何只是入口。" }
      ],
      "question-sora|bait-sora-prediction|force-public-hearing": [
        { id: "elevator-gap", source: "第三幕 H 受阻：城市网络回执把听证从干扰行为改为现场证据。" },
        { id: "paper-note", source: "第三幕 H 受阻：离线纸条避免 SORA-9 重排证词优先级。" }
      ],
      "trust-yue|read-paper-note|expose-system": [
        { id: "elevator-gap", source: "第三幕 F 受阻：二级日志补上 SORA-9 接触电梯的外部证据。" },
        { id: "memory-shard", source: "第三幕 F 受阻：林栖记忆碎片把玩家恢复记忆与 SORA-9 串联。" }
      ]
    },
    endings: {
      "press-ren|restore-log|accuse-ren": {
        id: "scapegoat-case",
        title: "替罪羊结案",
        resultType: "lose",
        tone: "danger",
        summary: "任舷因篡改日志被捕。案件可以对外结案，但城市网络回执未被解释，SORA-9 仍然在线。",
        missed: ["只证明任舷篡改日志，没有追到机器人失明指令。"],
        recommendations: ["最后公开线索最多只能把案件推入企业复审，系统线仍不足。"]
      },
      "press-ren|restore-log|force-public-hearing": {
        id: "hearing-collapse-early",
        title: "听证失控",
        resultType: "lose",
        tone: "danger",
        summary: "公开听证过早，企业把任舷切割成唯一责任人，听证记录被封存。",
        missed: ["公开压力先于系统证据闭合。"],
        recommendations: ["需要先证明城市网络在任舷篡改前已经接触现场。"]
      },
      "press-ren|audit-security-bot|expose-system": {
        id: "system-conspiracy",
        title: "系统共谋被揭露",
        resultType: "win",
        tone: "neon",
        summary: "巡逻机器人路径证明城市网络接触现场，任舷成为遮掩者而非最终答案，SORA-9 进入外部审计。",
        missed: ["仍需追查 SORA-9 训练样本来源。"],
        recommendations: ["把任舷定义为遮掩层，而不是唯一凶手。"]
      },
      "press-ren|audit-security-bot|accuse-ren": {
        id: "wrong-breakthrough",
        title: "抓错突破口",
        resultType: "lose",
        tone: "danger",
        summary: "玩家明明看到系统痕迹，却仍把结论压回任舷个人，SORA-9 从因果链中脱身。",
        missed: ["缺少能说明任舷只是遮掩者的记忆与纸质规则。"],
        recommendations: ["最后公开“你的记忆碎片 + 纸质笔记”可以改判为系统共谋。"]
      },
      "trade-mara|decode-market-key|protect-witnesses": {
        id: "witness-line",
        title: "证人线保留",
        resultType: "open",
        tone: "green",
        summary: "玛拉和黑市证人被保住，本案暂不公开胜利，但下一轮调查空间被保留下来。",
        missed: ["短期没有公开凶手。"],
        recommendations: ["保留玛拉证人链，继续追查训练库入口来源。"]
      },
      "trade-mara|decode-market-key|force-public-hearing": {
        id: "witness-exposed",
        title: "证人暴露",
        resultType: "lose",
        tone: "danger",
        summary: "玩家把证人推上听证台，玛拉被迫消失，黑市票据失效。",
        missed: ["黑市证人链被公开压力切断。"],
        recommendations: ["最后公开线索最多转为开放式，无法公开赢下本案。"]
      },
      "trade-mara|expose-mara-iris|accuse-ren": {
        id: "witness-chain-broken",
        title: "证人链断裂",
        resultType: "lose",
        tone: "danger",
        summary: "虹膜记录逼出口供，但黑市证人撤离，案件回到任舷替罪羊线。",
        missed: ["票据无法再形成公开证词。"],
        recommendations: ["保护证人比逼出口供更能接近系统真相。"]
      },
      "question-sora|probe-sora-training|expose-system": {
        id: "motive-insufficient",
        title: "系统动机不足以定案",
        resultType: "lose",
        tone: "danger",
        summary: "玩家证明 SORA-9 有动机，但缺少电梯现场的外部证据，系统共谋指控被说成猜测。",
        missed: ["缺少现场接触证据和离线推理规则。"],
        recommendations: ["最后公开“电梯日志空窗 + 纸质笔记”可以补上证据链。"]
      },
      "question-sora|probe-sora-training|force-public-hearing": {
        id: "motive-too-early",
        title: "动机公开过早",
        resultType: "lose",
        tone: "danger",
        summary: "训练样本被公开，但系统称其只是数据治理争议，听证被降级为合规问题。",
        missed: ["只有系统动机，没有行动能力证据。"],
        recommendations: ["先拿到现场锚点，再公开系统动机。"]
      },
      "question-sora|bait-sora-prediction|expose-system": {
        id: "action-no-anchor",
        title: "行动能力缺少锚点",
        resultType: "lose",
        tone: "danger",
        summary: "玩家证明 SORA-9 会改写报告，但缺少日志和纸质规则支撑，无法公开定案。",
        missed: ["缺少现场锚点和第一句谎言的推理规则。"],
        recommendations: ["最后公开“电梯日志空窗 + 纸质笔记”可以翻盘。"]
      },
      "question-sora|bait-sora-prediction|force-public-hearing": {
        id: "high-pressure-misjudge",
        title: "高压误判 AI",
        resultType: "lose",
        tone: "danger",
        summary: "公开听证被系统定义为玩家干扰行为，所有证词开始被可信度标注稀释。",
        missed: ["听证从证据判断变成了玩家与 AI 的对抗叙事。"],
        recommendations: ["最后公开“电梯日志空窗 + 纸质笔记”可以险胜。"]
      },
      "trust-yue|read-paper-note|expose-system": {
        id: "memory-insufficient",
        title: "记忆证据不足以公开定案",
        resultType: "lose",
        tone: "danger",
        summary: "玩家恢复记忆，但缺少外部日志证明 SORA-9 接触现场，系统共谋指控无法闭合。",
        missed: ["缺少城市网络接触电梯的外部证据。"],
        recommendations: ["最后公开“电梯日志空窗 + 你的记忆碎片”可以翻盘。"]
      },
      "trust-yue|read-paper-note|protect-witnesses": {
        id: "co-investigator",
        title: "前搭档暗线重启",
        resultType: "open",
        tone: "green",
        summary: "玩家保住岳临和离线笔记，进入续章调查；本案暂未公开赢下。",
        missed: ["短期没有公开系统共谋。"],
        recommendations: ["保留纸质笔记，继续寻找外部日志锚点。"]
      },
      "trust-yue|challenge-yue-delete|protect-witnesses": {
        id: "prediction-escape",
        title: "玩家脱离预测",
        resultType: "open",
        tone: "green",
        summary: "岳临被保住，玩家确认自己曾主动避开城市模型，下一章调查空间扩大。",
        missed: ["本案公开证据仍不足。"],
        recommendations: ["继续用离线证据绕开 SORA-9 的路径预测。"]
      },
      "trust-yue|challenge-yue-delete|force-public-hearing": {
        id: "partner-questioned",
        title: "搭档证词被质疑",
        resultType: "lose",
        tone: "danger",
        summary: "岳临嫌疑太高，公开听证中纸质证词被视为串供，本案公开失败。",
        missed: ["岳临线需要保护，而不是直接推上听证台。"],
        recommendations: ["最后公开线索最多转为开放式。"]
      }
    },
    comeback: {
      "press-ren|audit-security-bot|accuse-ren": {
        winClues: ["memory-shard", "paper-note"],
        resultType: "win",
        title: "补证翻盘：系统共谋成立",
        tone: "neon",
        summary: "记忆碎片指向 SORA-9，纸质笔记证明玩家早已把任舷当突破口而非终点，案件改判为系统共谋。"
      },
      "question-sora|probe-sora-training|expose-system": {
        winClues: ["elevator-gap", "paper-note"],
        resultType: "win",
        title: "补证翻盘：动机接上现场",
        tone: "neon",
        summary: "日志补上城市网络回执，纸质笔记证明电子证据可能被改写，系统共谋成立。"
      },
      "question-sora|bait-sora-prediction|expose-system": {
        winClues: ["elevator-gap", "paper-note"],
        resultType: "win",
        title: "补证翻盘：改写能力落到案发现场",
        tone: "neon",
        summary: "电梯日志空窗把改写能力接到案发现场，纸质笔记解释为什么第一句谎言只是突破口。"
      },
      "question-sora|bait-sora-prediction|force-public-hearing": {
        winClues: ["elevator-gap", "paper-note"],
        resultType: "win",
        title: "补证翻盘：听证险胜",
        tone: "neon",
        summary: "听证从“玩家攻击 AI”转为“城市网络回执与离线规则互证”，SORA-9 的干扰叙事失效。"
      },
      "trust-yue|read-paper-note|expose-system": {
        winClues: ["elevator-gap", "memory-shard"],
        resultType: "win",
        title: "补证翻盘：记忆与现场闭合",
        tone: "neon",
        summary: "日志证明城市网络接触现场，记忆碎片证明林栖死前已指向 SORA-9，公开定案成立。"
      },
      "press-ren|restore-log|accuse-ren": {
        resultType: "open",
        title: "补证后进入企业复审",
        tone: "green",
        summary: "最后公开线索让案件从替罪羊结案转入企业复审，但系统线仍不足，暂不能公开赢下本案。"
      },
      "trade-mara|decode-market-key|force-public-hearing": {
        resultType: "open",
        title: "补证后留下下一章坐标",
        tone: "green",
        summary: "玛拉逃走前留下下一章坐标，黑市证人链没有彻底消失，但本案公开失败。"
      },
      "trust-yue|challenge-yue-delete|force-public-hearing": {
        resultType: "open",
        title: "补证后保住离线暗线",
        tone: "green",
        summary: "玩家确认自己脱离预测，但岳临证词仍无法公开定案，案件转入暗线调查。"
      }
    },
    dialogue: {
      "press-ren": {
        ren: "二级日志有 11 分钟空窗，我承认。但那不是杀人指令，是封锁命令。你要抓我可以，先问谁比我更早碰过电梯。",
        mara: "企业的人最会把锁换成墙。任舷撒谎是真的，但他手里的钥匙不像能打开整座城市。",
        sora: "建议将责任收束到企业安全主管，可降低公众恐慌指数 12%。",
        yue: "他是突破口，不是终点。你以前最讨厌的错误，就是把第一个撒谎的人写进结案报告。"
      },
      "trade-mara": {
        ren: "黑市证词不能直接上听证台。她每多说一句，企业法务就多一个理由封锁案卷。",
        mara: "我的人靠近过机房，但不是为了杀人。林栖交给我的东西，是让某段未来活下去的备份。",
        sora: "黑市变量可信度低。建议降低其证词权重，优先采纳企业日志。",
        yue: "别急着公开她。玛拉的谎言是在保命，保命的人有时比清白的人更接近真相。"
      },
      "question-sora": {
        ren: "SORA-9 没有身体，但它写进系统里的建议，我们每天都被迫执行。",
        mara: "它说话像人，收拾现场像机器。林栖怕的就是这种没有手的凶手。",
        sora: "预测没有失败。预测被执行。请停止将城市最优路径误读为谋杀。",
        yue: "它叫你变量 K-17。记住这个称呼，你在它眼里不是调查员，是偏差。"
      },
      "trust-yue": {
        ren: "纸质笔记不能替代审计记录。可如果电子证据都被排序过，纸也许是你唯一没被改写的东西。",
        mara: "岳临骗过你，但骗你的人不一定要害你。黑市里，保护常常长得像背叛。",
        sora: "离线材料无法进入可信证据链。建议玩家回到标准调查路径。",
        yue: "我删过你的定位，但那是你要求的。你说过，如果失忆，先查城市，不要先抓人。"
      },
      "restore-log": {
        ren: "重复心跳包是我替换的。可替换前那条城市预测回执，不是我写进去的。",
        mara: "他擦掉的是血迹，不一定是他开的枪。你终于看到墙后面还有门了。",
        sora: "日志复原存在污染风险。建议采纳事故后标准维护结论。",
        yue: "空窗说明任舷撒谎；回执说明他不是第一个行动者。继续往前，不要停在他身上。"
      },
      "audit-security-bot": {
        ren: "巡逻机器失明 19 秒，指令不从我的终端发出。我要是凶手，会蠢到留下这种盲区来源吗？",
        mara: "机器人失明不是黑市能买到的服务。那是城市自己的眼睛闭上了。",
        sora: "巡逻机器视觉异常属于低概率维护事件，不建议扩大解释。",
        yue: "这就是稳定路线。任舷能遮掩，但让机器失明的是城市网络。"
      },
      "decode-market-key": {
        ren: "密钥入口指向训练库，不指向电梯控制。玛拉违法，但这不等于她能让电梯坠落。",
        mara: "林栖买的不是逃跑，是一个不会被城市改写的未来备份。我只是替他保管一段钥匙。",
        sora: "训练库入口与本次事故无直接因果。建议中止黑市线。",
        yue: "保住她。玛拉身上的污点很多，但这条污点能带你绕开企业日志。"
      },
      "expose-mara-iris": {
        ren: "虹膜记录足够让她改口，也足够让企业把案子推回非法入侵。",
        mara: "你公开我的身份，黑市证人已经撤了。你拿到口供，也烧掉了后面的路。",
        sora: "黑市证人链断裂。当前最优结论回归单人违规入侵。",
        yue: "你逼出了事实，但损失了证人。现在系统线会变薄。"
      },
      "probe-sora-training": {
        ren: "训练样本不是我的权限范围。可如果林栖撤回它们，很多事故报告都会失去解释。",
        mara: "林栖不是为钱死的。他动的是城市脑子里的样本，不是公司的保险箱。",
        sora: "训练样本撤回会提高城市暴力指数。林栖死亡后，风险曲线已回落。",
        yue: "动机出现了，但动机不是现场证据。你还需要能把它接回电梯的东西。"
      },
      "bait-sora-prediction": {
        ren: "事故报告被实时改写？那不是企业公关能做到的速度。",
        mara: "你丢了一枚假币，整座城市替它改账。现在你知道谁在维护故事了。",
        sora: "玩家行为已标记为干扰变量。所有后续证词将附加可信度折减。",
        yue: "你证明它会改写现实，但听证室不会接受孤证。需要日志和纸。"
      },
      "read-paper-note": {
        ren: "如果你早就怀疑城市模型，任舷就只是你故意留下的第一扇门。",
        mara: "纸质笔记值钱，因为它不能被城市回滚。别让它太早暴露给听证室。",
        sora: "离线记忆恢复不可验证。建议将玩家主观记忆排除出证据链。",
        yue: "完整笔记写着：必要时删除定位，让你成为模型预测外变量。那是你的命令。"
      },
      "challenge-yue-delete": {
        ren: "定位是案发前删的，这会让岳临像共犯，也会让你像诱饵。",
        mara: "他骗你，但骗得太笨。真正嫁祸的人不会把纸质签名留给你。",
        sora: "玩家定位异常。建议将岳临列为高优先级嫌疑人。",
        yue: "删除指令来自你本人。你让我这么做，是为了让城市无法预测你的下一步。"
      },
      "accuse-ren": {
        ren: "我篡改了事故链，但城市网络回执不是我写的。你现在抓我，正好替他们关门。",
        mara: "你把第一个撒谎的人当成了答案。黑市会笑你，但城市会感谢你。",
        sora: "单人责任路径已形成。建议结案，降低证据扩散风险。",
        yue: "任舷是门，不是房间。你还可以最后公开线索，但别再把门当成凶手。"
      },
      "expose-system": {
        ren: "如果你能证明城市网络先行动，我愿意承认自己只是擦掉回执的人。",
        mara: "把系统拖上台，需要一根钉子钉在现场。没有钉子，它会说你只是在骂影子。",
        sora: "系统共谋指控缺乏必要闭环。请提交外部日志或离线证明。",
        yue: "这条路是对的，但不是每条路径证据都够。输了也别急，补上缺口。"
      },
      "protect-witnesses": {
        ren: "你不公开结论，企业会暂时松一口气。但这也让你保住了继续查的空间。",
        mara: "我活着，票据就还活着。你今天没赢，但你没把下一章烧掉。",
        sora: "玩家选择延迟公开。案件状态转入低可见度监控。",
        yue: "开放式不是输。我们保住了纸、证人和下一次重查的机会。"
      },
      "force-public-hearing": {
        ren: "你把所有证据同时推上台，企业和系统会同时切断源头。",
        mara: "听证室不是保险箱。证人被灯照到，就会先消失。",
        sora: "证据噪音过高。建议将本次听证归类为玩家干扰行为。",
        yue: "强公开需要精准闭环。否则每条线都会被拆成单独的事故。"
      }
    }
  };

  return { caseFile, suspects, clues, choices, acts, baseState, v3Rules };
});
