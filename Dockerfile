# 使用 Node.js 作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 安装 serve 用于运行构建后的应用
RUN npm install -g serve

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["serve", "-s", "build", "-l", "3000"] 