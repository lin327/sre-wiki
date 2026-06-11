---
title: "Linux 进程与资源模型"
created: 2026-06-11
updated: 2026-06-11
type: concept
tags: [layer/process, layer/kernel, topic/concept]
sources: [https://man7.org/linux/man-pages/man7/namespaces.7.html, https://man7.org/linux/man-pages/man2/fork.2.html]
confidence: high
---

## 概述

Linux 进程模型是理解容器技术的根基。容器本质上就是一组受限的 Linux 进程——理解了进程模型，才能理解 Docker 和 Kubernetes 的底层原理。

## 核心概念

### 进程生命周期

| 状态 | 说明 |
|------|------|
| R (Running) | 正在运行或等待 CPU 时间片 |
| S (Sleeping) | 可中断睡眠，等待事件 |
| D (Disk Sleep) | 不可中断睡眠，通常等待 I/O |
| Z (Zombie) | 已退出但父进程未回收 |
| T (Stopped) | 被信号停止（如 SIGSTOP） |

### 进程创建

```c
// fork() 创建子进程，子进程是父进程的副本
pid_t pid = fork();
if (pid == 0) {
    // 子进程
    execve("/bin/ls", args, env);
} else {
    // 父进程
    wait(&status);
}
```

### 命名空间（Namespaces）

命名空间是容器隔离的基础：

| 命名空间 | 隔离内容 | 系统调用 |
|----------|---------|---------|
| PID | 进程 ID | `CLONE_NEWPID` |
| NET | 网络栈（接口、路由、端口） | `CLONE_NEWNET` |
| MNT | 挂载点 | `CLONE_NEWNS` |
| UTS | 主机名 | `CLONE_NEWUTS` |
| IPC | 进程间通信 | `CLONE_NEWIPC` |
| USER | 用户和组 ID | `CLONE_NEWUSER` |
| Cgroup | Cgroup 根目录 | `CLONE_NEWCGROUP` |

### Cgroup（控制组）

Cgroup 限制进程的资源使用：

```bash
# 限制进程内存为 512MB
mkdir /sys/fs/cgroup/memory/my-group
echo 536870912 > /sys/fs/cgroup/memory/my-group/memory.limit_in_bytes
echo $PID > /sys/fs/cgroup/memory/my-group/cgroup.procs
```

| 资源 | Cgroup 控制器 | 用途 |
|------|--------------|------|
| CPU | cpu, cpuset | 限制 CPU 时间和亲和性 |
| 内存 | memory | 限制内存使用 |
| I/O | blkio | 限制块设备 I/O |
| 网络 | net_cls, net_prio | 网络包分类和优先级 |

## 容器的真相

容器不是虚拟机。容器就是一个（或一组）进程，加上：
- **Namespace**：隔离视图（看到自己的 PID、网络、文件系统）
- **Cgroup**：限制资源（CPU、内存、I/O）
- **Capabilities**：细粒度权限控制
- **Seccomp**：系统调用过滤

```bash
# 这就是一个"容器"的核心
unshare --pid --net --mount --uts --ipc --cgroup /bin/bash
```

## 关键参数

| 参数 | 说明 |
|------|------|
| `/proc/[pid]/status` | 进程状态信息 |
| `/proc/[pid]/cgroup` | 进程所属 cgroup |
| `/proc/[pid]/ns/` | 进程的命名空间链接 |
| `/sys/fs/cgroup/` | cgroup 文件系统 |

## 常见问题

- 进程变僵尸 → 父进程未调用 wait()，参考 [[systemd]] 的进程管理
- 容器内 PID 1 问题 → 理解 init 进程和信号传递
- OOM Killer → 内存不足时内核杀进程，参考 [[oomkilled]]

## 相关页面

- [[filesystem]] — Linux 文件系统（进程的存储基础）
- [[systemd]] — 服务管理（进程生命周期管理）
- [[container-runtime]] — 容器运行时（进程模型的应用）
- [[pod-lifecycle]] — Pod 生命周期（K8s 如何管理容器进程）
