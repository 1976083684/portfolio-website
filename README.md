# Portfolio Website

[![HTML5](https://img.shields.io/badge/HTML5-%23E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-%231572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v3-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](LICENSE)
**一个现代化的个人作品集网站模板，内置可视化管理面板，无需数据库即可快速部署。**

[在线预览](https://curious-sunburst-3dc7ea.netlify.app) · [报告问题](../../issues) · [功能建议](../../issues)



![个人作品集](images/README_images/个人作品集.png)

## 目录

- [特性](#特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [项目结构](#项目结构)
- [管理面板](#管理面板)
- [API 文档](#api-文档)
- [部署指南](#部署指南)
- [浏览器支持](#浏览器支持)
- [贡献指南](#贡献指南)
- [许可证](#许可证)
- [致谢](#致谢)

## 特性

- **零数据库依赖** — 数据以 JSON 格式持久化到服务端文件，轻量且易于备份迁移
- **可视化管理面板** — 通过右下角齿轮图标进入，支持在线编辑所有内容
- **环境隔离** — `dev` / `prod` 环境数据完全隔离，开发生产互不干扰
- **Canvas 动态背景** — 流动光斑 + 微粒子动画，支持鼠标交互
- **打字机效果** — Hero 区域多标题轮播打字动画
- **响应式设计** — 基于 Tailwind CSS，完美适配桌面和移动端
- **作品筛选与排序** — 按技术标签过滤项目，支持星级排序
- **图片上传** — 客户端自动压缩为 Base64，无需额外图床
- **数据导入导出** — 支持 JSON 格式的完整数据备份与恢复

## 技术栈

| 层级 | 技术 |
|------|------|
| **后端** | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) |
| **前端** | HTML5 + CSS3 + Vanilla JavaScript |
| **样式** | [Tailwind CSS](https://tailwindcss.com/) (CDN) |
| **图标** | [Font Awesome 6.5](https://fontawesome.com/) |
| **字体** | [Google Fonts](https://fonts.google.com/) (Space Grotesk + DM Sans) |
| **拖拽** | [SortableJS](https://sortablejs.github.io/Sortable/) 1.15.6 |

## 快速开始

### 前置条件

- [Node.js](https://nodejs.org/) >= 18.0.0
- npm 或 yarn

### 方式一：一键启动（推荐）

**Windows：**
```bash
双击 start.bat
```

**Linux / macOS：**
```bash
chmod +x start.sh
./start.sh
```

脚本会自动检查 Node.js 环境、安装依赖并启动服务。

### 方式二：手动启动

```bash
# 克隆项目
git clone <your-repo-url>
cd portfolio-website

# 安装依赖
npm install

# 启动服务
npm start

# 或者开发模式（文件变更自动重启）
npm run dev
```

启动后访问 `http://localhost:3001`（默认端口）。

## 环境配置

复制 `.env.example` 为 `.env` 文件进行配置：

```bash
cp .env.example .env
```

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3001` | 服务监听端口 |
| `NODE_ENV` | `dev` | 运行环境：`dev`（开发）/ `prod`（生产） |

> **注意：** `dev` 和 `prod` 环境的数据分别存储在 `data/local/` 和 `data/prod/` 目录，互不影响。

## 项目结构

```
portfolio-website/
├── server.js                  # Express 后端服务（单文件，含所有 API）
├── index.html                 # 前端页面
├── package.json               # 项目配置与依赖
├── .env.example               # 环境变量模板
├── .env                       # 环境变量配置（需自行创建）
├── start.bat                  # Windows 一键启动脚本
├── start.sh                   # Linux/macOS 一键启动脚本
├── LICENSE                    # MIT 许可证
│
├── css/                       # 样式文件
│   ├── base.css               # 基础样式与 CSS 变量
│   ├── components.css         # 组件样式
│   └── admin.css              # 管理面板样式
│
├── js/                        # JavaScript 模块
│   ├── api.js                 # 认证 token 管理和 fetch 封装
│   ├── config.js              # 默认数据定义、数据加载/保存/迁移
│   ├── ui.js                  # Toast 通知、确认对话框
│   ├── render.js              # 前台页面渲染函数
│   ├── admin.js               # 管理后台逻辑
│   └── app.js                 # 入口点，初始化动画和交互
│
├── data/                      # 数据目录（运行时生成）
│   ├── local/                 # 开发环境数据
│   │   ├── portfolio_data.json
│   │   └── .pwd              # 密码哈希
│   └── prod/                  # 生产环境数据
│       ├── portfolio_data.json
│       └── .pwd
│
└── images/                    # 图片资源
```

## 管理面板

### 访问方式

1. 点击页面右下角的齿轮图标
2. 输入管理密码（默认：`admin`）
3. 进入管理面板

### 功能模块

| 模块 | 功能 |
|------|------|
| **个人信息** | 编辑姓名、头衔、简介、社交链接、统计数字 |
| **作品管理** | 添加/编辑/删除作品，支持图片上传、星级排序、拖拽排序 |
| **技能管理** | 分类和技能项的增删改，支持进度条展示 |
| **经历管理** | 工作和教育经历的时间线管理 |
| **数据管理** | 修改密码、导出/导入 JSON、重置默认数据 |

### 修改密码

进入管理面板 → 数据管理 → 修改密码。密码哈希值保存在 `data/{env}/.pwd` 文件中。

## API 文档

所有 API 端点以 `/api` 为前缀。

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| `GET` | `/api/data` | 否 | 获取作品集数据 |
| `POST` | `/api/data` | 是 | 保存完整数据 |
| `GET` | `/api/data/export` | 否 | 导出 JSON 文件下载 |
| `POST` | `/api/data/import` | 是 | 上传 JSON 导入数据 |
| `POST` | `/api/auth` | 否 | 密码验证，返回 token |
| `POST` | `/api/change-pwd` | 是 | 修改密码 |

### 认证方式

写入操作需要在请求头中携带 Bearer Token：

```http
Authorization: Bearer <token>
```

Token 通过 `/api/auth` 接口获取，格式为密码 MD5 哈希的前 8 位加 `h` 前缀。

### 请求示例

```bash
# 获取数据
curl http://localhost:3001/api/data

# 验证密码
curl -X POST http://localhost:3001/api/auth \
  -H "Content-Type: application/json" \
  -d '{"password": "admin"}'

# 保存数据（需要认证）
curl -X POST http://localhost:3001/api/data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer h<token>" \
  -d '{"personal": {...}, "projects": [...]}'
```

## 部署指南

### PM2 部署（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server.js --name portfolio

# 设置开机自启
pm2 save
pm2 startup

# 常用命令
pm2 status          # 查看状态
pm2 logs portfolio  # 查看日志
pm2 restart portfolio  # 重启服务
```

指定端口启动：

```bash
# Windows
set PORT=8080 && pm2 start server.js --name portfolio

# Linux/macOS
PORT=8080 pm2 start server.js --name portfolio
```

### Docker 部署

```bash
# 构建镜像
docker build -t portfolio .

# 运行容器
docker run -d -p 3001:3001 --name portfolio portfolio

# 或使用 docker-compose
docker-compose up -d
```

### Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 浏览器支持

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Edge |
|:---:|:---:|:---:|:---:|
| ✓ | ✓ | ✓ | ✓ |

支持所有现代浏览器的最新两个版本。

## 贡献指南

欢迎贡献代码、报告问题或提出改进建议！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

### 开发规范

- 遵循现有代码风格
- 提交信息使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- 确保代码无语法错误
- 更新相关文档（如有必要）

### 问题反馈

- 使用 [GitHub Issues](../../issues) 报告 bug
- 提供清晰的问题描述和复现步骤
- 包含环境信息（操作系统、Node.js 版本等）

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 致谢

- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Font Awesome](https://fontawesome.com/) - 矢量图标库
- [Google Fonts](https://fonts.google.com/) - 网络字体服务
- [SortableJS](https://sortablejs.github.io/Sortable/) - 拖拽排序库
- [Express](https://expressjs.com/) - Node.js Web 框架

---

<div align="center">
**如果这个项目对你有帮助，请给一个 [Star](../../stargazers) 支持一下！**

</div>
