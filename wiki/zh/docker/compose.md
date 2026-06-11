---
title: "Docker Compose 编排实践"
created: 2026-06-11
updated: 2026-06-11
type: concept
tags: [pattern/compose, topic/concept, tech/docker]
sources: [https://docs.docker.com/compose/, https://docs.docker.com/compose/compose-file/]
confidence: high
---

## 概述

Docker Compose 用于定义和运行多容器应用。一个 YAML 文件描述所有服务、网络、卷，一条命令启动整个应用栈。

## 核心概念

### compose.yaml 结构

```yaml
# 顶层元素
services:    # 服务定义
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    depends_on:
      - api
    networks:
      - frontend

  api:
    build: ./api
    environment:
      DB_HOST: postgres
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - frontend
      - backend

  postgres:
    image: postgres:15
    volumes:
      - pg-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

volumes:     # 持久化存储
  pg-data:

networks:    # 网络定义
  frontend:
  backend:
```

### 常用命令

```bash
# 启动所有服务
docker compose up -d

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f api
docker compose logs --tail=100

# 停止并删除
docker compose down

# 停止并删除（包含 volumes）
docker compose down -v

# 重新构建
docker compose build
docker compose up -d --build
```

### 环境变量管理

```yaml
# 方式 1：直接定义
environment:
  DB_HOST: postgres
  DB_PORT: 5432

# 方式 2：从文件读取
env_file:
  - .env

# 方式 3：使用 secrets（Swarm 模式）
secrets:
  db_password:
    file: ./secrets/db_password.txt
```

### 健康检查

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### 依赖管理

```yaml
services:
  api:
    depends_on:
      postgres:
        condition: service_healthy  # 等待健康检查通过
      redis:
        condition: service_started  # 只等待启动
```

## 多环境配置

```bash
# 基础配置 + 环境覆盖
docker compose -f compose.yaml -f compose.prod.yaml up -d

# 环境变量替换
DB_HOST=prod-db docker compose up -d
```

## 常见问题

- 服务启动顺序问题 → 使用 `depends_on` + `condition: service_healthy`
- 网络不通 → 检查服务是否在同一网络，使用服务名而非 IP
- 数据丢失 → 确认使用命名 volume

## 相关页面

- [[networking]] — Docker 网络模式（Compose 网络配置的底层）
- [[storage]] — Docker 存储驱动（Volume 配置）
- [[image-layers]] — Docker 镜像分层（build 配置）
