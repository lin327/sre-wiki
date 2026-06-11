---
title: "Linux 文件系统与存储"
created: 2026-06-11
updated: 2026-06-11
type: concept
tags: [layer/filesystem, layer/kernel, topic/concept]
sources: [https://man7.org/linux/man-pages/man5/filesystems.5.html, https://www.kernel.org/doc/html/latest/filesystems/]
confidence: high
---

## 概述

Linux 文件系统是容器镜像分层和存储卷的基础。理解 VFS、inode、挂载机制，才能理解 Docker 镜像为什么是分层的，以及 Volume 是怎么工作的。

## 核心概念

### 虚拟文件系统（VFS）

VFS 是内核的抽象层，为所有文件系统提供统一接口：

```
用户空间：open() / read() / write()
    ↓
VFS（虚拟文件系统）
    ↓
┌──────────┬──────────┬──────────┬──────────┐
│  ext4    │  xfs     │  btrfs   │  tmpfs   │
└──────────┴──────────┴──────────┴──────────┘
```

### 常见文件系统

| 文件系统 | 特点 | 用途 |
|----------|------|------|
| ext4 | 稳定、成熟 | 默认 Linux 文件系统 |
| xfs | 高性能、大文件 | 数据库、大容量存储 |
| btrfs | 快照、压缩、校验 | 需要高级特性的场景 |
| tmpfs | 内存文件系统 | /tmp、容器临时文件 |
| overlayfs | 联合文件系统 | Docker 镜像分层的核心 |
| procfs | 进程信息 | /proc |
| sysfs | 设备信息 | /sys |

### inode

每个文件对应一个 inode，存储元数据：

```bash
# 查看 inode 信息
stat /etc/passwd
ls -i /etc/passwd

# inode 包含：
# - 文件类型和权限
# - 所有者 UID/GID
# - 大小、时间戳
# - 数据块指针
# 注意：不包含文件名！文件名存在目录的 inode 中
```

### 挂载机制

```bash
# 挂载文件系统
mount /dev/sdb1 /mnt/data

# 查看挂载信息
mount | grep sdb1
cat /proc/mounts

# bind mount（Docker Volume 的基础）
mount --bind /host/path /container/path
```

### OverlayFS（Docker 镜像分层的核心）

```
┌─────────────────────┐
│   merged (容器层)    │  ← 容器看到的文件系统
├─────────────────────┤
│   upper (可写层)     │  ← 容器运行时的修改
├─────────────────────┤
│   lower (只读镜像层) │  ← Docker 镜像的各层
└─────────────────────┘
```

```bash
# 创建 overlay 挂载
mount -t overlay overlay \
  -o lowerdir=/lower,upperdir=/upper,workdir=/work \
  /merged
```

## 关键路径

| 路径 | 说明 |
|------|------|
| `/proc/mounts` | 当前挂载信息 |
| `/proc/filesystems` | 内核支持的文件系统 |
| `/dev/sd*` | 块设备 |
| `/sys/fs/cgroup/` | Cgroup 文件系统 |

## 常见问题

- 磁盘空间满但 df 显示有空间 → inode 耗尽（`df -i`）
- 容器内写文件报错 → 只读文件系统或磁盘满
- Docker 镜像占用空间大 → 理解分层机制和 docker system prune

## 相关页面

- [[process-model]] — 进程模型（文件系统是进程的存储基础）
- [[image-layers]] — Docker 镜像分层（OverlayFS 的应用）
- [[storage]] — Docker 存储驱动（Volume 和 Bind Mount）
