#!/bin/bash
# 个人作品集网站 - 一键启动 (Linux / macOS)

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║      个人作品集网站 - 一键启动       ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "  [错误] 未找到 Node.js，请先安装 Node.js"
    echo "  https://nodejs.org/"
    exit 1
fi
echo "  [√] Node.js 已安装: $(node -v)"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "  [→] 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "  [错误] 依赖安装失败"
        exit 1
    fi
    echo "  [√] 依赖安装完成"
else
    echo "  [√] 依赖已就绪"
fi

# 启动服务器
echo ""
echo "  [→] 正在启动服务器..."
echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║   服务已启动: http://localhost:3000   ║"
echo "  ║   默认密码: admin                     ║"
echo "  ║   按 Ctrl+C 停止服务                  ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# 尝试自动打开浏览器
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 &> /dev/null &
fi

node server.js
