---
title: "Docker 存储驱动与 Volume"
created: 2026-06-11
updated: 2026-06-11
type: concept
tags: [component/storage-driver, layer/filesystem, topic/concept, tech/docker]
sources: [https://docs.docker.com/storage/, https://docs.docker.com/storage/storagedriver/]
confidence: high
---

## 概述

Docker 提供两种持久化数据的方式：Volume（Docker 管理）和 Bind Mount（直接挂载宿主机目录）。理解存储机制是设计有状态服务的基础。

## 存储类型

### Volume（推荐）

```bash
# 创建 volume
docker volume create my-data

# 使用 volume
docker run -v my-data:/app/data nginx

# 查看 volume
docker volume ls
docker volume inspect my-data
```

**优点**：
- Docker 管理生命周期
- 可跨容器共享
- 支持 volume driver（NFS、云存储）
- 数据在 Docker 目录下，不会被 `docker rm` 删除

### Bind Mount

```bash
# 直接挂载宿主机目录
docker run -v /host/path:/container/path nginx

# 只读挂载
docker run -v /host/path:/container/path:ro nginx
```

**优点**：直接访问宿主机文件
**缺点**：依赖宿主机目录结构，不可移植

### tmpfs Mount

```bash
# 内存中的临时文件系统
docker run --tmpfs /app/tmp nginx
```

**用途**：敏感数据、临时缓存

## 存储驱动

| 驱动 | 后端文件系统 | 特点 |
|------|------------|------|
| overlay2 | OverlayFS | 推荐，性能好 |
| devicemapper | Device Mapper | CentOS 7 默认 |
| btrfs | Btrfs | Btrfs 文件系统专用 |
| zfs | ZFS | ZFS 文件系统专用 |

```bash
# 查看当前存储驱动
docker info | grep "Storage Driver"
```

## 数据持久化最佳实践

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:15
    volumes:
      - pg-data:/var/lib/postgresql/data  # 命名 volume
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro  # bind mount
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

volumes:
  pg-data:
    driver: local
```

## 关键命令

```bash
# 清理未使用的 volume
docker volume prune

# 备份 volume
docker run --rm -v my-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/my-data-backup.tar.gz -C /data .

# 恢复 volume
docker run --rm -v my-data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/my-data-backup.tar.gz -C /data
```

## 常见问题

- 容器内写文件权限不足 → 检查 UID/GID 映射
- Volume 数据丢失 → 确认用的是命名 volume 而非匿名 volume
- 磁盘空间不足 → `docker system df` + `docker volume prune`

## 相关页面

- [[filesystem]] — Linux 文件系统（存储驱动的底层实现）
- [[image-layers]] — Docker 镜像分层（存储驱动如何工作）
- [[compose]] — Docker Compose（Volume 配置实践）
