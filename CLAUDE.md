# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

个人作品集网站，Node.js/Express 后端 + 原生 JavaScript 前端，内置管理后台通过浏览器编辑所有内容，数据持久化到 JSON 文件。UI 语言为中文。

## 常用命令

```bash
npm start          # 启动服务器 (node server.js)
npm run dev        # 开发模式，文件变更自动重启 (node --watch server.js)
```

启动后访问 `http://localhost:{PORT}`，端口在 `.env` 中配置。

## 架构要点

**单文件服务器** (`server.js`): Express 应用，同时提供静态文件服务和 REST API。无构建步骤，无路由拆分。

**前端模块加载顺序** (全部通过 `<script>` 标签加载):
1. `js/api.js` - 认证 token 管理和 fetch 封装
2. `js/config.js` - 默认数据定义、运行时配置、数据加载/保存/迁移
3. `js/ui.js` - Toast 通知、确认对话框
4. `js/render.js` - 前台页面渲染函数
5. `js/admin.js` - 管理后台逻辑（最大模块，768 行）
6. `js/app.js` - 入口点，初始化动画和交互

**数据流**: 页面加载 → `loadCfg()` 从 `GET /api/data` 获取数据 → `migrate()` 填充缺失字段 → 存入全局 `cfg` → `renderAll()` 渲染 DOM。

**环境隔离**: `NODE_ENV` 控制数据目录——`dev` 用 `data/local/`，`prod` 用 `data/prod/`。密码文件也按环境隔离 (`data/{env}/.pwd`)。

## API 端点

| 方法 | 路径 | 认证 | 用途 |
|------|------|------|------|
| GET | `/api/data` | 否 | 加载数据 |
| POST | `/api/data` | 是 | 保存完整数据 |
| GET | `/api/data/export` | 否 | 导出 JSON 文件 |
| POST | `/api/data/import` | 是 | 导入 JSON 替换数据 |
| POST | `/api/auth` | 否 | 验证密码返回 token |
| POST | `/api/change-pwd` | 是 | 修改密码 |

认证方式: 密码 MD5 哈希前 8 位加 "h" 前缀作为 token，通过 `Bearer` 头发送。

## 关键数据结构

`cfg` 对象包含: `sortMode`（排序模式）、`personal`（个人信息）、`projects`（项目列表）、`skills`（技能分类）、`experiences`（工作经历）。完整结构见 `js/config.js` 中的 `DEF_CFG`。

## 外部 CDN 依赖

- Tailwind CSS（CDN，非本地构建）
- Font Awesome 6.5
- Google Fonts (Space Grotesk + DM Sans)
- SortableJS 1.15.6（管理后台拖拽排序）

## 开发注意事项

- 无构建管线，修改 JS/CSS 后刷新浏览器即可生效
- 管理后台入口：页面右下角齿轮图标
- 默认密码：`admin`
- 图片上传在客户端压缩为 Base64 存入数据
- 数据迁移逻辑在 `js/config.js` 的 `migrate()` 函数中，新字段需在此添加默认值
