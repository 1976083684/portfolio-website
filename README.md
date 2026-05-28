# Portfolio Website

[![HTML5](https://img.shields.io/badge/HTML5-%23E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-%231572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v3-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](LICENSE)

**一个现代化的个人作品集网站模板，内置可视化管理面板，无需数据库即可快速部署。**

[在线预览](https://curious-sunburst-3dc7ea.netlify.app)

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
  - [方案一：Linux + PM2 部署](#方案一linux--pm2-部署推荐)
  - [方案二：Docker 部署](#方案二docker-部署)
  - [方案三：Nginx 反向代理](#方案三nginx-反向代理)
  - [后续更新与维护](#后续更新与维护)
  - [常见运维场景](#常见运维场景)
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

### 方案一：Linux + PM2 部署（推荐）

适合长期运行的生产环境，PM2 提供进程守护、日志管理、开机自启等功能。

#### 1. 安装 Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v  # >= 18.0.0
npm -v
```

#### 2. 部署项目

```bash
# 克隆项目
git clone <your-repo-url>
cd portfolio-website

# 安装依赖
npm install --production

# 配置环境变量
cp .env.example .env
# 编辑 .env 设置端口和环境
vi .env
```

#### 3. 使用 PM2 管理进程

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server.js --name portfolio

# 设置开机自启（生成启动脚本）
pm2 startup
pm2 save

# 指定端口启动
PORT=8080 pm2 start server.js --name portfolio
```

#### 4. PM2 常用命令

```bash
# 进程管理
pm2 status                # 查看所有进程状态
pm2 list                  # 同上，更详细的列表
pm2 stop portfolio        # 停止服务
pm2 start portfolio       # 启动服务
pm2 restart portfolio     # 重启服务
pm2 reload portfolio      # 平滑重载（0 秒停机）
pm2 delete portfolio      # 删除进程

# 日志管理
pm2 logs portfolio        # 查看实时日志
pm2 logs --lines 100      # 查看最近 100 行日志
pm2 flush                 # 清空所有日志
pm2 logrotate             # 设置日志轮转

# 监控
pm2 monit                 # 实时监控 CPU/内存
pm2 show portfolio        # 查看进程详情

# 集群模式（多核 CPU）
pm2 start server.js -i max --name portfolio  # 自动使用所有 CPU 核心
```

---

### 方案二：Docker 部署

适合容器化环境，便于迁移和扩展。

#### 1. 创建 Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
# 创建数据目录
RUN mkdir -p data/prod data/local
# 设置环境变量
ENV NODE_ENV=prod
ENV PORT=3001
EXPOSE 3001
# 使用非 root 用户运行
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs
CMD ["node", "server.js"]
```

#### 2. 创建 .dockerignore

```
node_modules
data/prod
data/local
.env
.git
*.md
*.png
```

#### 3. 构建与运行

```bash
# 构建镜像
docker build -t portfolio .

# 运行容器
docker run -d \
  --name portfolio \
  -p 3001:3001 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  portfolio

# 使用自定义端口
docker run -d \
  --name portfolio \
  -p 8080:3001 \
  -e PORT=3001 \
  -v portfolio-data:/app/data \
  --restart unless-stopped \
  portfolio
```

#### 4. Docker Compose 部署

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  portfolio:
    build: .
    container_name: portfolio
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=prod
      - PORT=3001
    volumes:
      - portfolio-data:/app/data
    restart: unless-stopped

volumes:
  portfolio-data:
```

启动服务：

```bash
# 启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

#### 5. Docker 常用命令

```bash
# 容器管理
docker ps                        # 查看运行中的容器
docker ps -a                     # 查看所有容器
docker stop portfolio            # 停止容器
docker start portfolio           # 启动容器
docker restart portfolio         # 重启容器
docker rm portfolio              # 删除容器

# 日志查看
docker logs portfolio            # 查看日志
docker logs -f portfolio         # 实时跟踪日志
docker logs --tail 100 portfolio # 最近 100 行

# 进入容器
docker exec -it portfolio sh     # 进入容器终端

# 镜像管理
docker images                    # 查看镜像
docker rmi portfolio             # 删除镜像
docker system prune              # 清理无用资源
```

---

### 方案三：Nginx 反向代理

配合 PM2 或 Docker 使用，提供 HTTPS、负载均衡、静态缓存等功能。

#### 1. 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 2. 配置反向代理

创建配置文件 `/etc/nginx/conf.d/portfolio.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名

    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3001;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # API 和页面代理
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 限制请求体大小（图片上传）
    client_max_body_size 50m;
}
```

#### 3. 启用 HTTPS（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx  # Ubuntu/Debian
sudo yum install certbot python3-certbot-nginx  # CentOS

# 获取证书并自动配置
sudo certbot --nginx -d your-domain.com

# 测试自动续期
sudo certbot renew --dry-run

# 设置自动续期定时任务
sudo crontab -e
# 添加：0 3 * * * certbot renew --quiet
```

#### 4. Nginx 常用命令

```bash
# 服务管理
sudo systemctl start nginx      # 启动
sudo systemctl stop nginx       # 停止
sudo systemctl restart nginx    # 重启
sudo systemctl reload nginx     # 平滑重载配置
sudo systemctl status nginx     # 查看状态

# 配置检查
sudo nginx -t                   # 测试配置语法
sudo nginx -T                   # 测试并显示完整配置

# 日志查看
sudo tail -f /var/log/nginx/access.log  # 访问日志
sudo tail -f /var/log/nginx/error.log   # 错误日志
```

---

### 后续更新与维护

#### 代码更新流程

**PM2 方式：**

```bash
# 1. 进入项目目录
cd /path/to/portfolio-website

# 2. 拉取最新代码
git pull origin master

# 3. 安装新依赖（如有）
npm install --production

# 4. 平滑重启（0 秒停机）
pm2 reload portfolio

# 5. 验证更新
pm2 logs portfolio --lines 20
```

**Docker 方式：**

```bash
# 1. 拉取最新代码
git pull origin master

# 2. 重新构建镜像
docker build -t portfolio .

# 3. 停止并删除旧容器
docker stop portfolio
docker rm portfolio

# 4. 启动新容器（数据通过 volume 保留）
docker run -d \
  --name portfolio \
  -p 3001:3001 \
  -v portfolio-data:/app/data \
  --restart unless-stopped \
  portfolio

# 或使用 docker-compose
docker-compose down
docker-compose build
docker-compose up -d
```

#### 数据备份与恢复

```bash
# 备份数据目录（PM2 方式）
tar -czf portfolio-backup-$(date +%Y%m%d).tar.gz data/prod/

# 备份 Docker 数据卷
docker run --rm -v portfolio-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/portfolio-data-$(date +%Y%m%d).tar.gz -C /data .

# 恢复 Docker 数据卷
docker run --rm -v portfolio-data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/portfolio-data-20240101.tar.gz -C /data

# 通过管理面板导出
# 访问网站 → 齿轮图标 → 数据管理 → 导出 JSON
```

#### 常见运维场景

**场景 1：修改端口**

```bash
# PM2 方式
vi .env  # 修改 PORT=8080
pm2 restart portfolio

# Docker 方式
docker stop portfolio
docker rm portfolio
docker run -d --name portfolio -p 8080:3001 \
  -v portfolio-data:/app/data --restart unless-stopped portfolio
```

**场景 2：重置密码**

```bash
# 删除密码文件，重启后密码恢复为默认 admin
rm data/prod/.pwd
pm2 restart portfolio  # 或 docker restart portfolio
```

**场景 3：查看实时日志**

```bash
# PM2
pm2 logs portfolio --lines 50

# Docker
docker logs -f portfolio --tail 50
```

**场景 4：磁盘空间清理**

```bash
# 清理 PM2 日志
pm2 flush

# 清理 Docker 无用资源
docker system prune -a

# 清理 Node.js 缓存
npm cache clean --force
```

**场景 5：性能监控**

```bash
# PM2 监控
pm2 monit

# Docker 资源占用
docker stats portfolio

# 系统资源
htop
df -h  # 磁盘使用
free -h  # 内存使用
```

**场景 6：服务异常排查**

```bash
# 检查进程是否运行
pm2 status  # 或 docker ps

# 查看错误日志
pm2 logs portfolio --err --lines 100

# 检查端口占用
sudo lsof -i :3001
sudo netstat -tlnp | grep 3001

# 检查防火墙
sudo ufw status  # Ubuntu
sudo firewall-cmd --list-all  # CentOS

# 测试服务响应
curl -I http://localhost:3001
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


**如果这个项目对你有帮助，请给一个 [Star](../../stargazers) 支持一下！**

