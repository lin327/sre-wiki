---
title: "Docker 镜像与分层机制"
created: 2026-06-11
updated: 2026-06-11
type: concept
tags: [component/docker-engine, topic/concept, tech/docker]
sources: [https://docs.docker.com/storage/storagedriver/, https://docs.docker.com/build/buildkit/]
confidence: high
---

## 概述

Docker 镜像由多个只读层叠加而成，每层记录文件系统的变更。理解分层机制是优化镜像大小、加速构建、排查存储问题的基础。

## 核心原理

### 镜像分层

```
┌─────────────────────┐
│  Layer 4: COPY app  │  ← 每条 Dockerfile 指令生成一层
├─────────────────────┤
│  Layer 3: RUN npm   │
├─────────────────────┤
│  Layer 2: COPY pkg  │
├─────────────────────┤
│  Layer 1: apt-get   │
├─────────────────────┤
│  Layer 0: Ubuntu    │  ← 基础镜像
└─────────────────────┘
```

### Dockerfile 指令与层

| 指令 | 创建新层 | 可缓存 |
|------|---------|--------|
| `FROM` | ✅ 基础镜像层 | ✅ |
| `RUN` | ✅ | ✅（指令不变时） |
| `COPY` | ✅ | ✅（文件不变时） |
| `ADD` | ✅ | ✅ |
| `ENV` | ✅ | ✅ |
| `EXPOSE` | ❌ | ❌ |
| `CMD` | ❌ | ❌ |
| `ENTRYPOINT` | ❌ | ❌ |

### UnionFS（联合文件系统）

容器运行时将镜像层 + 可写层合并：

```
容器视角：看到完整的文件系统
  ↑ 合并
┌─────────────────────┐
│  可写层 (Container)  │  ← 运行时修改
├─────────────────────┤
│  镜像层 (只读)       │  ← 多个容器共享
└─────────────────────┘
```

### 构建缓存

```dockerfile
# ❌ 错误：任何文件变化都会重新安装依赖
COPY . /app
RUN npm install

# ✅ 正确：先复制 package.json，利用缓存
COPY package.json /app/
RUN npm install
COPY . /app
```

## 镜像大小优化

| 技巧 | 说明 |
|------|------|
| 多阶段构建 | `FROM ... AS builder`，只复制产物到最终镜像 |
| 合并 RUN | `RUN apt-get update && apt-get install -y ... && rm -rf /var/lib/apt/lists/*` |
| 使用 .dockerignore | 排除不需要的文件 |
| 选择小基础镜像 | `alpine` > `slim` > `full` |
| 清理缓存 | `pip install --no-cache-dir`、`npm cache clean --force` |

### 多阶段构建示例

```dockerfile
# 构建阶段
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

## 关键命令

```bash
# 查看镜像层
docker history nginx:alpine
docker inspect nginx:alpine

# 查看镜像大小
docker images nginx:alpine

# 清理未使用的镜像
docker image prune -a
docker system df
```

## 常见问题

- 镜像太大 → 检查是否清理了缓存，是否用多阶段构建
- 构建慢 → 检查缓存是否生效，调整 Dockerfile 指令顺序
- 层共享失败 → 检查基础镜像是否一致

## 相关页面

- [[filesystem]] — Linux 文件系统（OverlayFS 是镜像分层的底层实现）
- [[storage]] — Docker 存储驱动（Volume 和持久化）
- [[container-runtime]] — 容器运行时（镜像如何被运行）
