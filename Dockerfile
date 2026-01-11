FROM node:18-alpine AS builder
LABEL "language"="nodejs"
LABEL "framework"="taro"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:h5

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# 创建新的 Nginx 配置文件，直接监听 8080
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
    listen 8080;
    listen [::]:8080;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    error_page 404 /index.html;
}
EOF

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
