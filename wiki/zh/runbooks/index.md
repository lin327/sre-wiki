---
title: 排障手册
description: Kubernetes 生产环境常见故障的排查步骤和修复方案 — 按故障现象组织
tags:
  - kubernetes
  - troubleshooting
---

# 排障手册

排障手册按故障现象组织，提供快速定位和修复方案。每个 runbook 包含：现象描述、排查步骤、根因分析和修复方案。

## 页面列表

| 页面 | 故障现象 | 标签 |
|------|----------|------|
| [[crashloopbackoff]] | Pod 反复重启，状态为 CrashLoopBackOff | `kubernetes` `troubleshooting` |
| [[oomkilled]] | 容器因内存溢出被终止，退出码 137 | `kubernetes` `troubleshooting` |
| [[imagepullbackoff]] | Pod 无法拉取容器镜像，状态为 ImagePullBackOff | `kubernetes` `troubleshooting` |

## 前置知识

使用排障手册前，建议先掌握：

- [[kubernetes/index\|Kubernetes]] — 基本的集群操作和 kubectl 命令
- [[kubernetes/pod-lifecycle\|Pod 生命周期]] — 理解 Pod 状态转换和探针机制

## 使用方法

1. 根据故障现象找到对应的 runbook
2. 按排查步骤逐步定位问题
3. 根据根因分析选择修复方案
4. 参考延伸阅读预防同类问题

## 延伸阅读

- [[incidents/index\|故障案例]] — 真实事故复盘，理解故障的完整链路
- [[architectures/index\|架构设计]] — 通过架构优化预防故障
- [Kubernetes Troubleshooting](https://kubernetes.io/zh-cn/docs/tasks/debug/) — 官方排障指南
