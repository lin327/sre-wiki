---
title: 架构设计
description: 云原生架构模式 — 高可用集群、GitOps 流水线和生产级部署方案
tags:
  - kubernetes
  - architecture
---

# 架构设计

本分类收录常见的云原生架构模式、设计方案和最佳实践，帮助 SRE 设计可靠、可扩展的系统。

## 页面列表

| 页面 | 说明 | 标签 |
|------|------|------|
| [[ha-cluster]] | 高可用集群 — etcd 集群、控制面冗余、多区域部署 | `kubernetes` `architecture` |
| [[gitops-pipeline]] | GitOps 流水线 — ArgoCD、Flux、声明式部署和渐进式发布 | `kubernetes` `architecture` |

## 前置知识

学习架构设计前，建议先掌握：

- [[kubernetes/index\|Kubernetes]] — 集群的基本操作和资源模型
- [[kubernetes/pod-lifecycle\|Pod 生命周期]] — 理解工作负载的调度和管理
- [[docker/networking\|Docker 网络]] — 理解容器网络基础

## 设计原则

架构设计应遵循以下原则：

1. **声明式优于命令式** — 使用 GitOps 管理集群状态
2. **松耦合、高内聚** — 微服务边界清晰，依赖最小化
3. **可观测性优先** — 日志、指标、链路追踪全覆盖
4. **故障隔离** — 爆炸半径可控，降级方案完备

## 延伸阅读

- [[runbooks/index\|排障手册]] — 架构决策影响排障效率
- [[incidents/index\|故障案例]] — 从事故中验证架构设计
- [[comparisons/index\|对比分析]] — 技术选型支撑架构决策
- [Google SRE Book](https://sre.google/sre-book/table-of-contents/) — SRE 方法论
- [12-Factor App](https://12factor.net/) — 应用设计原则
