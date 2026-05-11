# Portfolio Website

纯静态单文件个人作品集网站，内置可视化管理面板，无需数据库、无需后端。

## 特性

- **单文件架构** — 一个 HTML 文件包含所有 CSS 和 JS，部署极其简单
- **可视化管理面板** — 通过右下角齿轮图标进入，支持在线编辑所有内容
- **数据持久化** — 使用 LocalStorage 存储配置，刷新不丢失
- **Canvas 动态背景** — 流动光斑 + 微粒子动画，支持鼠标交互
- **打字机效果** — Hero 区域多Title轮播打字
- **响应式设计** — 基于 Tailwind CSS，适配桌面和移动端
- **作品筛选** — 按技术标签过滤项目
- **星级排序** — 作品按星级自动排列

## 技术栈

- HTML5 / CSS3 / Vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com/) (CDN)
- [Font Awesome](https://fontawesome.com/) 图标 (CDN)
- [Google Fonts](https://fonts.google.com/) (Space Grotesk + DM Sans)

## 快速开始

### 方式一：直接打开

直接在浏览器中打开 `index.html` 即可预览。

### 方式二：本地服务器

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# VS Code Live Server 插件
```

### 方式三：Docker

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
```

```bash
docker build -t portfolio .
docker run -d -p 8080:80 portfolio
```

### 方式四：GitHub Pages

1. 将 `index.html` 重命名为 `index.html` 并推送到仓库
2. Settings → Pages → 选择分支 → 保存

### 方式五：Vercel / Netlify

直接将文件拖入或连接仓库，自动部署。

## 管理面板

1. 点击页面右下角齿轮图标
2. 输入密码（默认：`admin`）
3. 进入后可管理：
   - **个人信息** — 姓名、头衔、简介、社交链接、统计数字
   - **作品管理** — 添加/编辑/删除作品，支持图片上传（Base64）
   - **技能管理** — 分类和技能项的增删改
   - **经历管理** — 工作和教育经历
   - **数据管理** — 修改密码、导出/导入 JSON、重置默认

### 修改默认密码

进入管理面板 → 数据管理 → 修改密码。

### 修改默认配置

编辑 HTML 文件中 `DEF_CFG` 对象（约第 243 行）可永久变更初始默认内容。

## 项目结构

```
portfolio-website/
├── index.html    # 主文件（包含 HTML/CSS/JS 全部代码）
└── README.md
```

## 数据导出与迁移

管理面板支持：
- **导出 JSON** — 将当前所有配置导出为 JSON 文件
- **导入 JSON** — 从 JSON 文件恢复配置（会覆盖当前数据）
- **重置默认** — 恢复为代码中的默认配置

## 浏览器支持

所有现代浏览器（Chrome、Firefox、Safari、Edge）。

## License

MIT
