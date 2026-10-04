// Add future projects here. Featured motion studies refer to stable project IDs.
window.portfolioProjects = [
  {id:'flowing-piano',name:'Flowing Piano',category:'音乐创作',label:'MUSIC & CREATION',description:'把脑海里的旋律，变成可以触碰的作品。',detail:'从一个音符到一段旋律。探索如何让音乐创作变得直观：看见音符、调整节奏，再听见自己的想法。',tags:['MIDI','钢琴卷帘','AI 辅助'],scene:0},
  {id:'guanlan',name:'观澜 · ETF Quant',category:'数据研究',label:'DATA & RESEARCH',description:'在行情、策略与模拟运行之间，寻找有依据的判断。',detail:'把行情观察、策略回放与模拟账户放进同一个研究空间。每一步判断都能回到数据与依据，持续观察，持续验证。',tags:['行情','策略回放','模拟账户'],scene:1},
  {id:'software-hub',name:'Software Hub',category:'效率工具',label:'TOOLS & CONNECTIONS',description:'把分散的项目，连接成一个创作空间。',detail:'从项目登记、状态查看到流程图，让不同形态的项目拥有共同的入口，让创作过程更容易被看见和管理。',tags:['项目管理','工作区','流程图'],scene:2},
  {id:'skc-assistant',name:'SKC 商业文件助手',category:'自动化',label:'FILES & WORKFLOWS',description:'从一个商品编号，找到对应素材并完成回复。',detail:'连接本地素材库与企业微信工作流，支持素材索引、编号查询和附件准备。',tags:['素材管理','企业微信','文件检索']},
  {id:'chrome-profile-manager',name:'Chrome Profile Manager',category:'效率工具',label:'BROWSER & ORGANIZATION',description:'为多个浏览器 Profile 建立清晰的组织方式。',detail:'发现已登录的 Chrome Profile，按分类整理，维护管理员与直属账号层级，并按队列打开各自独立的浏览器环境。',tags:['独立 Profile','分类与层级','批量队列'],scene:3},
  {id:'local-mcp',name:'Local MCP 工作台',category:'自动化',label:'AGENTS & CONNECTIONS',description:'让 AI 与本地工作环境建立连接。',detail:'通过本地工作台管理 MCP 服务、连接状态与访问范围，探索 AI 工具和本地项目的协作方式。',tags:['MCP','AI 工具','本地服务']},
];

// Current film versions shared by the exhibition and demos/review.html.
window.portfolioFilms = {
  'flowing-piano': {
    src:'demos/piano/v04b/Flowing-Piano-V04b-APT-1080p.mp4',
    poster:'demos/piano/v04b/frame-00.jpg', contact:'demos/piano/v04b/contact.jpg',
    validation:'demos/piano/v04b/validation.json', version:'V04b', duration:30,
    tagline:'同一首歌，弹出下一种可能。',
    summary:'APT. 钢琴改编 → AI 助手指令 → 实际编配改变 → 新风格与皮肤试听。',
    chapters:[
      [0,'先听原乐句。','旋律、低音与和弦，听见当前弹奏。'],
      [6.5,'打开 AI 助手，给出修改要求。','输入、发送、确认提案，再应用到音符。'],
      [9.9,'反拍加入，和弦变短。','实际音符变化与修改后的弹奏同步呈现。'],
      [17.2,'快节奏里，换一种弹法。','再次给助手要求，确认新的编配。'],
      [20.6,'同一乐句，新的听感。','伴奏换音区、时值拉长，切换 Paper 皮肤。'],
      [27.9,'Flowing Piano','从编辑，到听见自己的想法。']
    ]
  },
  'chrome-profile-manager': {
    src:'demos/profiles/motion-v02b/Chrome-Profiles-Motion-V02b-1080p.mp4',
    poster:'demos/profiles/motion-v02b/frame-00.jpg', contact:'demos/profiles/motion-v02b/contact.jpg',
    transitions:'demos/profiles/motion-v02b/transitions.jpg', validation:'demos/profiles/motion-v02b/validation.json', version:'V02b', duration:21.2,
    tagline:'多个环境，清楚有序。', summary:'分类整理 → 搜索工作 Profile → 确认与启动 → 对应环境示意。',
    chapters:[
      [0,'这次，该打开哪个环境？','为不同用途组织本机 Chrome Profile。'],
      [2.4,'按用途归类。','工作与个人用途各自归位。'],
      [5.6,'筛选工作分类。','真实分类入口，缩小列表范围。'],
      [8.8,'搜索工作 B。','真实搜索控件与结果特写。'],
      [12,'确认，再启动。','真实选择与启动派发反馈。'],
      [15.2,'对应环境，保持清楚。','独立 Profile 的功能示意。'],
      [19.2,'Chrome Profile Manager','选准身份，再出发。']
    ]
  },
  'software-hub': {
    src:'demos/hub/motion-v03/Software-Hub-Motion-V03-Structure-1080p.mp4',
    poster:'demos/hub/motion-v03/frame-00.jpg', contact:'demos/hub/motion-v03/contact.jpg',
    transitions:'demos/hub/motion-v03/transitions.jpg', validation:'demos/hub/motion-v03/validation.json', version:'V03', duration:20,
    tagline:'把项目，变成看得懂的结构。', summary:'不同项目放入管理器 → 选择项目 → 展开对应的可视化结构；使用示例项目的功能动效。',
    chapters:[
      [0,'项目，变成结构。','不同项目汇入 Software Hub。'],
      [2,'把不同项目，放进管理。','三个示例项目进入工作区，生成对应结构。'],
      [5.2,'Flowing Piano · 结构展开。','音符编辑、音频引擎与 AI 助手的树状示意。'],
      [8.4,'观澜 · 结构展开。','行情、策略与研究依据的模块连接示意。'],
      [11.6,'Profile Manager · 结构展开。','管理界面、扫描、分类与启动的结构示意。'],
      [14.8,'同一个管理，展开不同的项目。','三种项目结构并列呈现。'],
      [18,'Software Hub','把项目，变成看得懂的结构。']
    ]
  },
  'guanlan': {
    src:'demos/guanlan/motion-v02/Guanlan-Motion-V02-1080p.mp4',
    poster:'demos/guanlan/motion-v02/frame-00.jpg', contact:'demos/guanlan/motion-v02/contact.jpg',
    transitions:'demos/guanlan/motion-v02/transitions.jpg', validation:'demos/guanlan/motion-v02/validation.json', version:'V02', duration:24,
    tagline:'每一次判断，都有依据。', summary:'研究状态 → 数据时间 → 证据缺口 → 逐项追溯依据；使用虚构研究快照。',
    chapters:[
      [0,'这一刻，依据是什么？','从数据时间与研究判断开始。'],
      [2.4,'连接状态、时间和证据。','把判断所需的信息组织在一起。'],
      [5.6,'分清已完成与待补。','同一演示快照的真实界面状态。'],
      [8.8,'先看数据到了何时。','时间轴与 09:45 数据时间特写。'],
      [12,'缺一项，也明确显示。','事件证据缺口 1。'],
      [15.2,'展开到具体标的。','逐项核对研究依据。'],
      [19.2,'把依据看清楚。','状态、时间、证据共同支撑判断。'],
      [22,'观澜','每一次判断，都有依据。']
    ]
  }
};

// The collection is a film, not a ninth software project.
window.portfolioFilms['skc-assistant']={
  src:'demos/skc/skc-chat-v4-720x1280.mp4',poster:'demos/skc/chat-v4-00.8s.png',
  contact:'demos/skc/contact-sheet-chat-v4.jpg',validation:'demos/skc/validation-chat-v4.json',
  version:'V04',duration:24,format:'720 × 1280',tagline:'一个编号，找到对应素材。',
  summary:'连接素材库与企业微信工作流：编号查询、找到素材、准备附件。',
  chapters:[[0,'SKC 商业文件助手','从编号查询到素材与附件。']]
};
window.portfolioCollection = {
  id:'collection',name:'Ideas in motion',label:'SIX PROJECTS / ONE COLLECTION',
  src:'demos/collection/v04/Qingyv-Collection-V04-1080p.mp4',
  poster:'demos/collection/v04/poster.jpg',version:'COLLECTION V04',duration:32,
  tagline:'6 件工具，让事情更好做。',summary:'编辑音乐、研究策略、管理项目、查找素材、组织浏览器环境、管理 AI 工具连接。',
  chapters:[[0,'让想法，动起来。','六件工具，六种具体用途。'],[1.6,'Flowing Piano','音符编辑 → AI 要求 → 编配变化示意。'],
    [6.4,'观澜 · ETF Quant','研究策略，核对数据与证据。'],[11.2,'Software Hub','放入项目 → 展开与组织模块结构。'],
    [16,'SKC 商业文件助手','商品编号 → 匹配素材与附件。'],[20.8,'Chrome Profile Manager','分类 → 搜索 → 启动对应环境。'],
    [25.6,'Local MCP 工作台','管理服务、连接与访问范围。'],[30.4,'把想法，变成可用的工具。','继续探索下方独立影片。']]
};
for(const id of ['flowing-piano','guanlan','software-hub','chrome-profile-manager','skc-assistant']){
  window.portfolioFilms[id].cover='demos/collection/v02/'+id+'-cover.jpg';
}
