/* ============================================================
 *  配置与数据管理模块
 *
 *  职责：定义默认数据结构、从服务端加载/保存配置、数据迁移兼容
 *
 *  全局变量：
 *  - DEF_CFG: 默认配置（只读参考，用于重置和对比）
 *  - cfg: 当前运行时配置（可读写，所有渲染和管理操作的数据源）
 *
 *  函数：
 *  - gid(): 生成随机 ID（用于统计数字等需要唯一标识的场景）
 *  - esc(s): HTML 特殊字符转义，防 XSS
 *  - loadCfg(): 从 GET /api/data 加载配置并执行 migrate
 *  - saveCfg(): 将 cfg 整体 POST 到 /api/data 保存
 *  - migrate(c): 数据迁移，补全旧版本缺失的字段
 * ============================================================ */

/* --- 默认配置（完整数据结构参考） --- */
const DEF_CFG = {
  sortMode: 'star-desc',
  personal: {
    name: "陈逸飞", logo: "YF.",
    titles: ["全栈开发工程师", "前端架构师", "开源贡献者", "UI/UX 爱好者"],
    bio: "热爱构建优雅且高性能的 Web 应用，5年全栈开发经验，专注前端工程化与用户体验",
    aboutText1: "我是一名全栈开发工程师，专注于构建高性能、用户友好的 Web 应用。从 Vue、React 到 Node.js、Go，我享受在不同技术栈之间游走，用最合适的工具解决实际问题。",
    aboutText2: "工作之余，我活跃于开源社区，维护着几个被广泛使用的工具库。我相信好的代码应该像好的设计一样——简洁、优雅、让人愉悦。",
    location: "上海, 中国", email: "hello@chenyifei.dev",
    github: "https://github.com/chenyifei", twitter: "https://twitter.com/chenyifei_dev", linkedin: "https://linkedin.com/in/chenyifei",
    stats: [
      { id: "s1", label: "年开发经验", value: "5+" },
      { id: "s2", label: "完成项目", value: "30+" },
      { id: "s3", label: "合作客户", value: "20+" },
      { id: "s4", label: "GitHub Stars", value: "1K+" }
    ]
  },
  projects: [
    { id: 1, title: "CloudFlow", description: "云端工作流编排平台，支持可视化拖拽构建 CI/CD 管道，实时监控与日志聚合，服务于 50+ 企业团队", tags: ["Vue 3", "Go", "gRPC", "K8s"], image: "https://picsum.photos/seed/cloudflow/600/400.jpg", link: "#", github: "#", star: 5, order: 0, showPreview: true, showSource: true, showDetail: true },
    { id: 2, title: "PixelForge", description: "基于 WebGL 的在线图像编辑器，支持图层、滤镜、矢量绘制和实时协作，核心渲染引擎自研", tags: ["React", "WebGL", "TypeScript"], image: "https://picsum.photos/seed/pixelforge/600/400.jpg", link: "#", github: "#", star: 5, order: 1, showPreview: true, showSource: true, showDetail: true },
    { id: 3, title: "DataPulse", description: "实时数据可视化仪表盘，支持百万级数据点渲染，拖拽式图表配置，深色/浅色主题自适应", tags: ["Vue 3", "D3.js", "WebSocket"], image: "https://picsum.photos/seed/datapulse/600/400.jpg", link: "#", github: "#", star: 4, order: 2, showPreview: true, showSource: true, showDetail: true },
    { id: 4, title: "NexusChat", description: "端到端加密即时通讯应用，支持群组、文件共享、语音消息，消息同步延迟小于 100ms", tags: ["React", "Node.js", "Socket.io"], image: "https://picsum.photos/seed/nexuschat/600/400.jpg", link: "#", github: "#", star: 3, order: 3, showPreview: true, showSource: true, showDetail: true },
    { id: 5, title: "SwiftCLI", description: "轻量级命令行工具框架，自动生成帮助文档、参数解析、子命令嵌套，npm 周下载量 2K+", tags: ["Node.js", "TypeScript"], image: "https://picsum.photos/seed/swiftcli/600/400.jpg", link: "#", github: "#", star: 4, order: 4, showPreview: true, showSource: true, showDetail: true },
    { id: 6, title: "AeroNote", description: "Markdown 笔记应用，支持双向链接、知识图谱、离线使用，数据本地存储注重隐私", tags: ["Svelte", "IndexedDB", "ProseMirror"], image: "https://picsum.photos/seed/aeronote/600/400.jpg", link: "#", github: "#", star: 3, order: 5, showPreview: true, showSource: true, showDetail: true }
  ],
  skills: [
    { category: "前端开发", items: [{ name: "Vue.js / Nuxt", level: 95 }, { name: "React / Next.js", level: 90 }, { name: "TypeScript", level: 92 }, { name: "CSS / Tailwind", level: 88 }, { name: "Three.js / WebGL", level: 75 }] },
    { category: "后端开发", items: [{ name: "Node.js / Express", level: 88 }, { name: "Go / Gin", level: 78 }, { name: "Python / FastAPI", level: 72 }, { name: "PostgreSQL", level: 82 }, { name: "Redis / MongoDB", level: 80 }] },
    { category: "DevOps & 工具", items: [{ name: "Docker / K8s", level: 80 }, { name: "CI/CD (GitHub Actions)", level: 85 }, { name: "Git / Monorepo", level: 90 }, { name: "Linux / Nginx", level: 82 }, { name: "AWS / Vercel", level: 76 }] },
    { category: "设计 & 其他", items: [{ name: "Figma", level: 78 }, { name: "UI/UX 设计", level: 72 }, { name: "敏捷 / Scrum", level: 80 }, { name: "技术写作", level: 75 }, { name: "英语 (流利)", level: 85 }] }
  ],
  experiences: [
    { company: "星辰科技", role: "高级前端工程师", period: "2022 - 至今", description: "主导公司核心产品前端架构升级，从 Vue 2 迁移至 Vue 3 + TypeScript，性能提升 40%。搭建前端监控体系和组件库，团队开发效率提升 30%。" },
    { company: "云途网络", role: "全栈开发工程师", period: "2020 - 2022", description: "负责数据可视化平台全栈开发，基于 D3.js + Node.js 实现百万级数据点实时渲染。设计并实现 RESTful API，支撑日均百万请求。" },
    { company: "极简工作室", role: "前端开发工程师", period: "2019 - 2020", description: "参与多个 ToB SaaS 产品开发，独立完成权限管理、动态表单等核心模块。推动团队采用 CI/CD 自动化流程，部署效率提升 60%。" }
  ]
};

/* --- 当前运行时配置（页面加载后从服务端获取） --- */
let cfg = null;

/**
 * 生成随机 ID（下划线开头 + 9位随机字符）
 * @returns {string}
 */
function gid() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * HTML 特殊字符转义，防止 XSS
 * @param {string} s - 原始字符串
 * @returns {string} 转义后的安全字符串
 */
function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * 从服务端加载配置数据
 * 请求 GET /api/data，成功则执行数据迁移后返回
 * 失败则返回 DEF_CFG 的深拷贝作为兜底
 * @returns {Promise<object>} 配置对象
 */
async function loadCfg() {
  try {
    const res = await fetch('/api/data');
    const json = await res.json();
    if (json.success) return migrate(json.data);
  } catch (e) { /* 网络错误兜底 */ }
  return JSON.parse(JSON.stringify(DEF_CFG));
}

/**
 * 将当前 cfg 保存到服务端
 * 需要已登录（token 存在），否则静默跳过
 */
async function saveCfg() {
  if (!token) return;
  try {
    await api('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg) });
  } catch (e) { /* 静默失败 */ }
}

/**
 * 数据迁移 — 补全旧版本缺失的字段，保证数据结构完整
 * - stats: 旧版可能是对象格式，转为数组
 * - stats[].id: 补全缺失的 ID
 * - projects[].star/order/showPreview/showSource/showDetail: 补默认值
 * - sortMode: 默认 'star-desc'
 * @param {object} c - 原始配置
 * @returns {object} 迁移后的配置
 */
function migrate(c) {
  /* stats 从旧版对象格式迁移到数组格式 */
  if (c.personal.stats && !Array.isArray(c.personal.stats)) {
    const o = c.personal.stats;
    c.personal.stats = [];
    if (o.years) c.personal.stats.push({ id: gid(), label: '年开发经验', value: o.years });
    if (o.projects) c.personal.stats.push({ id: gid(), label: '完成项目', value: o.projects });
    if (o.clients) c.personal.stats.push({ id: gid(), label: '合作客户', value: o.clients });
    if (o.stars) c.personal.stats.push({ id: gid(), label: 'GitHub Stars', value: o.stars });
  }
  /* 补全 stats 缺失的 id */
  if (Array.isArray(c.personal.stats)) {
    c.personal.stats.forEach(s => { if (!s.id) s.id = gid(); });
  }
  /* 补全 projects 缺失的字段 */
  c.projects.forEach((p, i) => {
    if (p.star === undefined) p.star = 3;
    if (p.order === undefined) p.order = i;
    if (p.showPreview === undefined) p.showPreview = true;
    if (p.showSource === undefined) p.showSource = true;
    if (p.showDetail === undefined) p.showDetail = true;
  });
  /* 默认排序模式 */
  if (!c.sortMode) c.sortMode = 'star-desc';
  return c;
}
