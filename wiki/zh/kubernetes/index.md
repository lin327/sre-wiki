---
title: Kubernetes
description: Kubernetes 容器编排 — Pod 生命周期、容器运行时、Service Mesh 和集群管理
tags:
  - kubernetes
  - intermediate
---

# Kubernetes

Kubernetes（K8s）是容器编排的行业标准。本分类涵盖 Pod 管理、容器运行时和 Service Mesh 等核心概念。

## 页面列表

| 页面 | 说明 | 标签 |
|------|------|------|
| [[pod-lifecycle]] | Pod 生命周期 — Init Container、探针、优雅终止和 QoS 等级 | `kubernetes` `intermediate` |
| [[container-runtime]] | 容器运行时 — CRI、containerd、CRI-O 和运行时类 | `kubernetes` `intermediate` |
| [[service-mesh]] | Service Mesh — Istio、Linkerd、流量管理和 mTLS | `kubernetes` `advanced` |

## 前置知识

学习 Kubernetes 之前，建议先掌握：

- [[docker/index\|Docker]] — Kubernetes 管理的最小单元是容器
  - [[docker/image-layers\|镜像分层]] — 理解容器镜像的构建和分发
  - [[docker/networking\|Docker 网络]] — 理解容器网络模型的基础
- [[linux/network-stack\|Linux 网络栈]] — Kubernetes 网络模型建立在 Linux 网络之上

## 延伸阅读

完成 Kubernetes 基础后，建议深入以下方向：

- [[runbooks/index\|排障手册]] — 生产环境常见故障的排查步骤
  - [[runbooks/crashloopbackoff\|CrashLoopBackOff]] — 最常见的 Pod 异常
  - [[runbooks/oomkilled\|OOMKilled]] — 内存溢出问题
- [[architectures/index\|架构设计]] — 集群架构和部署方案
  - [[architectures/ha-cluster\|高可用集群]] — 生产级集群设计
  - [[architectures/gitops-pipeline\|GitOps 流水线]] — 声明式部署方案
- [[incidents/index\|故障案例]] — 从真实事故中学习
- [[comparisons/index\|对比分析]] — 技术选型参考
- [Kubernetes 官方文档](https://kubernetes.io/zh-cn/docs/) — 权威参考
- [CNCF Landscape](https://landscape.cncf.io/) — 云原生技术全景
