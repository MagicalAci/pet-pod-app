# 构建阶段 - 使用完整 Node 镜像 (Debian)，不使用 Alpine
# 因为 Taro CLI 需要 glibc，而 Alpine 使用 musl
FROM node:18-slim AS builder

WORKDIR /app

# 复制 package 文件和配置文件
COPY package*.json ./
COPY config ./config
COPY tsconfig.json ./
COPY babel.config.js ./
COPY project.config.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY src ./src
COPY public ./public

# 构建 H5
RUN npm run build:h5

# 生产阶段 - 使用 nginx 服务静态文件
FROM nginx:alpine

# 复制构建产物到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
