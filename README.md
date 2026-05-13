# Portfolio Website

[![HTML5](https://img.shields.io/badge/HTML5-%23E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-%231572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v3-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Font Awesome](https://img.shields.io/badge/Font%20Awesome-v6-528DD7?style=flat&logo=font-awesome&logoColor=white)](https://fontawesome.com/)
[![Google Fonts](https://img.shields.io/badge/Google%20Fonts-Available-4285F4?style=flat&logo=google&logoColor=white)](https://fonts.google.com/)
[![License](https://img.shields.io/badge/License-MIT-000000?style=flat&logo=github&logoColor=white)](https://github.com/1976083684/portfolio-website)





基于 Node.js 后端的个人作品集网站，内置可视化管理面板，数据持久化到服务端 JSON 文件。
预览地址：[https://curious-sunburst-3dc7ea.netlify.app](https://curious-sunburst-3dc7ea.netlify.app)


![个人作品集](images/README_images/个人作品集.png)

## 特性

- **Node.js 后端** — Express 服务器，REST API 读写数据
- **数据持久化** — 数据以 JSON 格式保存在 `data/` 目录，刷新不丢失
- **可视化管理面板** — 通过右下角齿轮图标进入，支持在线编辑所有内容
- **Canvas 动态背景** — 流动光斑 + 微粒子动画，支持鼠标交互
- **打字机效果** — Hero 区域多Title轮播打字
- **响应式设计** — 基于 Tailwind CSS，适配桌面和移动端
- **作品筛选** — 按技术标签过滤项目
- **星级排序** — 作品按星级自动排列

## 技术栈

- **后端**: Node.js / Express
- **前端**: HTML5 / CSS3 / Vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com/) (CDN)
- [Font Awesome](https://fontawesome.com/) 图标 (CDN)
- [Google Fonts](https://fonts.google.com/) (Space Grotesk + DM Sans)

## 快速开始

### 方式一：一键启动（推荐）

**Windows：**
```
双击 start.bat
```

**Linux / macOS：**
```bash
chmod +x start.sh
./start.sh
```

脚本会自动检查 Node.js 环境、安装依赖并启动服务，浏览器将自动打开 `http://localhost:3000`。

### 方式二：手动启动

```bash
# 安装依赖（仅首次）
npm install

# 启动服务
npm start

# 或者开发模式（文件变更自动重启）
npm run dev
```

浏览器访问 `http://localhost:3000`。

## 部署

### Windows 部署

1. 安装 [Node.js](https://nodejs.org/)（18+ 版本）
2. 将项目文件夹放到目标目录
3. 双击 `start.bat` 一键启动
4. 如需后台运行，可使用 [pm2](https://pm2.keymetrics.io/)：
   ```cmd
   npm install -g pm2
   :: 默认端口 3000
   pm2 start server.js --name portfolio
   :: 指定端口（如 8080）
   set PORT=8080 && pm2 start server.js --name portfolio
   pm2 save
   pm2 startup
   ```

### Linux 部署

```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 克隆项目
git clone <your-repo-url>
cd portfolio-website

# 安装依赖
npm install

# 方式一：直接运行
./start.sh

# 方式二：使用 pm2 后台运行
npm install -g pm2
# 默认端口 3000
pm2 start server.js --name portfolio
# 指定端口（如 8080）
PORT=8080 pm2 start server.js --name portfolio
pm2 save
pm2 startup
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t portfolio .
docker run -d -p 3000:3000 portfolio
```

### 反向代理（Nginx）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

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

密码哈希值保存在 `data/.pwd` 文件中。

### 修改默认配置

编辑 `server.js` 中的 `DEFAULT_DATA` 对象可永久变更初始默认内容（在 `data/portfolio_data.json` 不存在时生效）。

## 项目结构

```
portfolio-website/
├── server.js                  # Express 后端服务
├── package.json               # 项目依赖
├── index.html                 # 前端页面（HTML/CSS/JS）
├── start.bat                  # Windows 一键启动
├── start.sh                   # Linux/macOS 一键启动
├── data/
│   ├── portfolio_data.json    # 用户数据（JSON 格式）
│   └── .pwd                   # 密码哈希（自动生成）
├── images/                    # 图片资源
├── bak/                       # 历史备份
└── README.md
```

## API 接口

| 方法 | 路径 | 说明 | 认证 |
|---|---|---|---|
| GET | `/api/data` | 获取作品集数据 | 否 |
| POST | `/api/data` | 保存数据到 JSON 文件 | 是 |
| GET | `/api/data/export` | 下载 JSON 文件 | 否 |
| POST | `/api/data/import` | 上传 JSON 导入 | 是 |
| POST | `/api/auth` | 密码验证 | 否 |
| POST | `/api/change-pwd` | 修改密码 | 是 |

## 数据导出与迁移

管理面板支持：
- **导出 JSON** — 将当前所有配置导出为标准 JSON 文件
- **导入 JSON** — 从 JSON 文件恢复配置（会覆盖当前数据）
- **重置默认** — 恢复为代码中的默认配置

数据文件位于 `data/portfolio_data.json`，可直接备份或迁移此文件。

## 浏览器支持

所有现代浏览器（Chrome、Firefox、Safari、Edge）。

## License

MIT
