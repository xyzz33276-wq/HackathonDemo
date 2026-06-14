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
      "你的前搭档岳临又留下另一句规则：第一个撒谎的人不一定是凶手。这句话是全局推理钥匙。",
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
      "先看右侧故事背景，明确核心规则：第一个撒谎的人不一定是凶手。",
      "每一幕只能选择一个行动。上一幕的选择会锁定下一幕可选路线。",
      "公开线索会提高真相值，但也会让角色防御或让系统封锁证据。",
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

  return { caseFile, suspects, clues, choices, acts, baseState };
});
