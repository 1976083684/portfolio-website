@echo off
chcp 65001 >nul
title 个人作品集 - 启动中...

echo.
echo   ╔══════════════════════════════════════╗
echo   ║      个人作品集网站 - 一键启动       ║
echo   ╚══════════════════════════════════════╝
echo.

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo   [错误] 未找到 Node.js，请先安装 Node.js
    echo   https://nodejs.org/
    pause
    exit /b 1
)
echo   [√] Node.js 已安装:
node -v

:: 检查依赖
if not exist "node_modules\" (
    echo   [→] 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo   [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo   [√] 依赖安装完成
) else (
    echo   [√] 依赖已就绪
)

:: 启动服务器
echo.
echo   [→] 正在启动服务器...
start "" http://localhost:3000
echo.
echo   ╔══════════════════════════════════════╗
echo   ║   服务已启动: http://localhost:3000   ║
echo   ║   默认密码: admin                     ║
echo   ║   按 Ctrl+C 停止服务                  ║
echo   ╚══════════════════════════════════════╝
echo.

node server.js
pause
