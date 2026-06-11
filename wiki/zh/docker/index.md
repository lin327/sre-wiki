---
title: Docker
description: Docker 容器技术 — 镜像分层、网络模型、存储驱动和 Compose 编排
tags:
  - docker
  - beginner
---

# Docker

Docker 是容器化技术的事实标准，也是 Kubernetes 的基础。理解 Docker 的镜像、网络和存储模型是掌握 Kubernetes 的前提。

## 页面列表

| 页面 | 说明 | 标签 |
|------|------|------|
| [[image-layers]] | 镜像分层 — UnionFS、层共享、构建缓存和多阶段构建 | `docker` `beginner` |
| [[networking]] | Docker 网络 — bridge、host、overlay 网络模型和端口映射 | `docker` `intermediate` |
| [[storage]] | Docker 存储 — volume、bind mount、tmpfs 和存储驱动 | `docker` `intermediate` |
| [[compose]] | Docker Compose — 多容器编排、服务依赖和环境管理 | `docker` `intermediate` |

## 前置知识

学习 Docker 之前，建议先掌握以下内容：

- [[linux/process-model\|进程模型]] — 容器本质上是受限的 Linux 进程
- [[linux/filesystem\|文件系统]] — 镜像分层依赖 UnionFS 和 mount namespace

## 延伸阅读

完成 Docker 基础后，建议继续学习：

- [[kubernetes/index\|Kubernetes]] — 容器编排平台，建立在 Docker（或 containerd）之上
  - [[kubernetes/pod-lifecycle\|Pod 生命周期]] — 理解容器在集群中的调度和管理
  - [[kubernetes/container-runtime\|容器运行时]] — 从 dockerd 到 containerd 的演进
- [Docker 官方文档](https://docs.docker.com/) — 参考手册
- [OCI Runtime Specification](https://github.com/opencontainers/runtime-spec) — 容器运行时标准
