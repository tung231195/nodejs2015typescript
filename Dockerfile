# ---- Base image ----
FROM node:20-alpine AS base
WORKDIR /nodejs2025

# Copy package.json + lock
COPY package*.json ./

# Install dependencies
RUN npm install

# ---- Build stage ----
FROM base AS build

# Copy toàn bộ project vào
COPY . .

# Build TypeScript: src → dist
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS production
WORKDIR /nodejs2025

# Copy package.json để cài dependency production
COPY package*.json ./

RUN npm install --only=production

# Copy dist build từ stage build
COPY --from=build /nodejs2025/dist ./dist


# Copy thư mục public (nếu dùng)
COPY --from=build /nodejs2025/public ./public


# Expose port
EXPOSE 5000

# Chạy file server.js
CMD ["node", "dist/server.js"]
