---
title: "容器运行时"
created: 2026-06-11
updated: 2026-06-11
type: concept
tags: [component/data-plane, topic/concept, tech/kubernetes, tech/docker]
sources: [https://kubernetes.io/docs/setup/production-environment/container-runtimes/]
confidence: high
---

## 概述

容器运行时（Container Runtime）是负责运行容器的软件。Kubernetes 通过 CRI（Container Runtime Interface）与运行时交互。

## 核心原理

### CRI 架构

```
kubelet → CRI (gRPC) → 容器运行时 → 容器
```

### 主流运行时

| 运行时 | CRI 兼容 | 特点 |
|--------|---------|------|
| containerd | ✅ 原生 CRI | 轻量，K8s 默认推荐 |
| CRI-O | ✅ 原生 CRI | 专为 K8s 设计 |
| Docker（dockershim） | ⚠️ 需要 shim | K8s 1.24 移除内置支持 |
| gVisor (runsc) | ✅ 通过 containerd | 安全沙箱，性能有损耗 |
| Kata Containers | ✅ 通过 containerd | 轻量 VM，强隔离 |

### 关键路径

| 路径 | 说明 |
|------|------|
| `/var/run/containerd/containerd.sock` | containerd socket |
| `/var/run/crio/crio.sock` | CRI-O socket |
| `/var/lib/containerd/` | containerd 数据目录 |

## 常见问题

- 容器启动失败 → 检查运行时日志：`journalctl -u containerd`
- 镜像拉取超时 → 检查运行时配置的镜像仓库
- 节点 NotReady → 检查 kubelet 和运行时连接

## 相关页面

- [[pod-lifecycle]] — Pod 生命周期（运行时如何管理容器生命周期）
- [[imagepullbackoff]] — 镜像拉取失败排障
- [[image-layers]] — Docker 镜像分层（运行时如何存储镜像）
