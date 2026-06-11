---
title: "Pod 生命周期"
created: 2026-06-11
updated: 2026-06-11
type: concept
tags: [component/data-plane, topic/concept, tech/kubernetes]
sources: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/]
confidence: high
---

## 概述

Pod 是 Kubernetes 中最小的可部署单元，包含一个或多个容器。Pod 的生命周期由多个阶段组成，理解这些阶段是排查 Pod 异常的基础。

## 核心原理

### Pod 阶段（Phase）

| 阶段 | 说明 |
|------|------|
| Pending | 已被 API Server 接受，但容器尚未全部创建（调度中、拉取镜像中） |
| Running | 至少有一个容器正在运行 |
| Succeeded | 所有容器正常退出（exit code 0） |
| Failed | 至少一个容器异常退出（exit code 非 0） |
| Unknown | 无法获取 Pod 状态（通常是 Node 失联） |

### 容器状态（Container State）

| 状态 | 说明 |
|------|------|
| Waiting | 等待启动（拉取镜像、初始化容器） |
| Running | 正在执行 |
| Terminated | 已退出（含 exit code 和原因） |

### 重启策略（Restart Policy）

| 策略 | 行为 |
|------|------|
| Always（默认） | 容器退出后自动重启 |
| OnFailure | 仅在 exit code 非 0 时重启 |
| Never | 不自动重启 |

### 探针（Probes）

| 探针 | 用途 | 失败后果 |
|------|------|---------|
| livenessProbe | 容器是否存活 | 重启容器 |
| readinessProbe | 容器是否就绪 | 从 Service 端点移除 |
| startupProbe | 容器是否启动完成 | 阻塞其他探针 |

## 关键参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `spec.restartPolicy` | Always | 容器重启策略 |
| `spec.terminationGracePeriodSeconds` | 30 | 优雅终止等待时间 |
| `spec.containers[].livenessProbe` | 无 | 存活探针 |
| `spec.containers[].readinessProbe` | 无 | 就绪探针 |
| `spec.containers[].startupProbe` | 无 | 启动探针 |

## 常见问题

- Pod 一直处于 Pending → 参考 [[crashloopbackoff]] 中的调度问题排查
- 容器频繁重启 → 检查 livenessProbe 配置，参考 [[oomkilled]]
- Pod 无法删除 → 检查 finalizer

## 相关页面

- [[container-runtime]] — 容器运行时（Pod 底层如何运行容器）
- [[crashloopbackoff]] — CrashLoopBackOff 排障
- [[oomkilled]] — 容器 OOM 排障
- [[imagepullbackoff]] — 镜像拉取失败排障
- [[process-model]] — Linux 进程模型（Pod 的底层实现）
