#!/bin/bash

# 爱宠POD 本地部署脚本
# ========================

echo "🐾 爱宠POD 本地部署启动中..."
echo "================================"

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 node 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

echo -e "${BLUE}📦 检查依赖...${NC}"

# 安装前端依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}安装前端依赖...${NC}"
    npm install
fi

# 安装后端依赖
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}安装后端依赖...${NC}"
    cd server && npm install && cd ..
fi

echo -e "${GREEN}✅ 依赖检查完成${NC}"
echo ""

# 停止可能正在运行的进程
echo -e "${BLUE}🔄 清理旧进程...${NC}"
pkill -f "taro build" 2>/dev/null || true
pkill -f "ts-node.*server" 2>/dev/null || true
sleep 1

# 启动后端服务
echo -e "${BLUE}🚀 启动后端AI服务...${NC}"
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 检查后端是否启动成功
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端服务启动成功 (http://localhost:3001)${NC}"
else
    echo -e "${YELLOW}⚠️  后端服务启动中...${NC}"
fi

# 启动前端服务
echo -e "${BLUE}🚀 启动前端H5服务...${NC}"
npm run dev:h5 &
FRONTEND_PID=$!

# 等待前端编译
echo -e "${YELLOW}⏳ 等待前端编译完成...${NC}"
sleep 15

echo ""
echo "================================"
echo -e "${GREEN}🎉 爱宠POD 部署完成！${NC}"
echo "================================"
echo ""
echo -e "📱 ${GREEN}前端地址:${NC} http://localhost:10086"
echo -e "🤖 ${GREEN}后端API:${NC} http://localhost:3001"
echo ""
echo -e "${YELLOW}提示:${NC}"
echo "  - 如果端口被占用，前端会自动切换到 10087 等端口"
echo "  - 按 Ctrl+C 停止所有服务"
echo ""

# 捕获退出信号
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

# 保持脚本运行
wait
