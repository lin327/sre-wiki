---
title: Linux 基础
description: Linux 操作系统核心概念 — 进程模型、文件系统、网络栈和 systemd 服务管理
tags:
  - linux
  - beginner
---

# Linux 基础

Linux 是 SRE 学习路径的起点。掌握 Linux 核心概念是理解容器技术和云原生生态的前提。

## 页面列表

| 页面 | 说明 | 标签 |
|------|------|------|
| [[process-model]] | 进程模型 — 进程、线程、信号和调度 | `linux` `beginner` |
| [[filesystem]] | 文件系统 — 层次结构、挂载点、权限和 inode | `linux` `beginner` |
| [[network-stack]] | 网络栈 — TCP/IP、socket、iptables 和 netfilter | `linux` `intermediate` |
| [[systemd]] | systemd — 服务管理、单元文件和日志查看 | `linux` `intermediate` |

## 前置知识

无。本分类是学习路径的起点。

## 延伸阅读

完成 Linux 基础后，建议继续学习：

- [[docker/index\|Docker]] — 容器技术建立在 Linux 进程隔离和文件系统之上
  - [[docker/image-layers\|镜像分层]] — 依赖 Linux UnionFS
  - [[docker/networking\|Docker 网络]] — 依赖 Linux network namespace
- [The Linux Programming Interface](https://man7.org/tlpi/) — 深入理解 Linux 系统编程
- [Linux Kernel Documentation](https://www.kernel.org/doc/html/latest/) — 内核官方文档
