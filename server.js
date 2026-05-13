const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio_data.json');
const PWD_FILE = path.join(DATA_DIR, '.pwd');

// 确保 data 目录存在
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ============================================================
//   默认数据
// ============================================================
const DEFAULT_DATA = {
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
    { id: 1, title: "CloudFlow", description: "云端工作流编排平台，支持可视化拖拽构建 CI/CD 管道，实时监控与日志聚合，服务于 50+ 企业团队", tags: ["Vue 3", "Go", "gRPC", "K8s"], image: "https://picsum.photos/seed/cloudflow/600/400.jpg", link: "#", github: "#", star: 5, showPreview: true, showSource: true, showDetail: true },
    { id: 2, title: "PixelForge", description: "基于 WebGL 的在线图像编辑器，支持图层、滤镜、矢量绘制和实时协作，核心渲染引擎自研", tags: ["React", "WebGL", "TypeScript"], image: "https://picsum.photos/seed/pixelforge/600/400.jpg", link: "#", github: "#", star: 5, showPreview: true, showSource: true, showDetail: true },
    { id: 3, title: "DataPulse", description: "实时数据可视化仪表盘，支持百万级数据点渲染，拖拽式图表配置，深色/浅色主题自适应", tags: ["Vue 3", "D3.js", "WebSocket"], image: "https://picsum.photos/seed/datapulse/600/400.jpg", link: "#", github: "#", star: 4, showPreview: true, showSource: true, showDetail: true },
    { id: 4, title: "NexusChat", description: "端到端加密即时通讯应用，支持群组、文件共享、语音消息，消息同步延迟小于 100ms", tags: ["React", "Node.js", "Socket.io"], image: "https://picsum.photos/seed/nexuschat/600/400.jpg", link: "#", github: "#", star: 3, showPreview: true, showSource: true, showDetail: true },
    { id: 5, title: "SwiftCLI", description: "轻量级命令行工具框架，自动生成帮助文档、参数解析、子命令嵌套，npm 周下载量 2K+", tags: ["Node.js", "TypeScript"], image: "https://picsum.photos/seed/swiftcli/600/400.jpg", link: "#", github: "#", star: 4, showPreview: true, showSource: true, showDetail: true },
    { id: 6, title: "AeroNote", description: "Markdown 笔记应用，支持双向链接、知识图谱、离线使用，数据本地存储注重隐私", tags: ["Svelte", "IndexedDB", "ProseMirror"], image: "https://picsum.photos/seed/aeronote/600/400.jpg", link: "#", github: "#", star: 3, showPreview: true, showSource: true, showDetail: true }
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

// ============================================================
//   数据读写
// ============================================================
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) { /* 文件损坏回退默认 */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ============================================================
//   密码管理
// ============================================================
function hash(s) {
  return 'h' + crypto.createHash('md5').update(s).digest('hex').substring(0, 8);
}

function getPasswordHash() {
  try {
    if (fs.existsSync(PWD_FILE)) return fs.readFileSync(PWD_FILE, 'utf8').trim();
  } catch (e) { /* ignore */ }
  return hash('admin');
}

function setPasswordHash(h) {
  fs.writeFileSync(PWD_FILE, h, 'utf8');
}

// ============================================================
//   中间件
// ============================================================
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// 文件上传配置
const upload = multer({ dest: DATA_DIR, limits: { fileSize: 50 * 1024 * 1024 } });

// 认证中间件 — 写入操作须携带有效 token
function checkAuth(req, res, next) {
  const token = (req.headers['authorization'] || '').replace('Bearer ', '');
  if (token === getPasswordHash()) return next();
  res.status(401).json({ success: false, message: '未授权' });
}

// ============================================================
//   API 路由
// ============================================================

// 获取数据
app.get('/api/data', (_req, res) => {
  res.json({ success: true, data: loadData() });
});

// 保存数据
app.post('/api/data', checkAuth, (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, message: '无效数据' });
    }
    saveData(data);
    res.json({ success: true, message: '数据已保存' });
  } catch (e) {
    res.status(500).json({ success: false, message: '保存失败: ' + e.message });
  }
});

// 导出数据 (JSON 下载)
app.get('/api/data/export', (_req, res) => {
  const data = loadData();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="portfolio_data.json"');
  res.json(data);
});

// 导入数据
app.post('/api/data/import', checkAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: '未上传文件' });
    const content = fs.readFileSync(req.file.path, 'utf8');
    fs.unlinkSync(req.file.path); // 删除临时文件
    const data = JSON.parse(content);
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, message: '无效的 JSON 数据' });
    }
    saveData(data);
    res.json({ success: true, message: '数据已导入', data });
  } catch (e) {
    res.status(500).json({ success: false, message: '导入失败: ' + e.message });
  }
});

// 验证密码
app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  if (hash(password || '') === getPasswordHash()) {
    res.json({ success: true, token: hash(password || '') });
  } else {
    res.status(401).json({ success: false, message: '密码错误' });
  }
});

// 修改密码
app.post('/api/change-pwd', checkAuth, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: '请填写所有字段' });
  }
  if (hash(oldPassword) !== getPasswordHash()) {
    return res.status(401).json({ success: false, message: '当前密码错误' });
  }
  if (newPassword.length < 3) {
    return res.status(400).json({ success: false, message: '新密码至少3位' });
  }
  const newHash = hash(newPassword);
  setPasswordHash(newHash);
  res.json({ success: true, message: '密码已修改', token: newHash });
});

// ============================================================
//   启动服务
// ============================================================
app.listen(PORT, () => {
  console.log(`\n  🚀 作品集服务已启动: http://localhost:${PORT}\n`);
  console.log(`  📁 数据目录: ${DATA_DIR}`);
  console.log(`  🔑 默认密码: admin\n`);
});
