---
title: 故障案例
description: 真实故障复盘 — 从 etcd 数据损坏到 DNS 解析失败的事故分析
tags:
  - kubernetes
  - incident
---

# 故障案例

本分类收录真实生产环境的故障案例，通过复盘分析事故原因、影响范围和修复过程，帮助 SRE 从事故中学习。

## 页面列表

| 页面 | 说明 | 标签 |
|------|------|------|
| [[etcd-data-corruption]] | etcd 数据损坏 — 集群数据不一致导致调度异常 | `kubernetes` `incident` |
| [[dns-resolution-failure]] | DNS 解析失败 — CoreDNS 故障导致服务发现中断 | `kubernetes` `incident` |

## 事故复盘框架

每个故障案例按以下结构组织：

1. **事故概述** — 时间线、影响范围、严重等级
2. **现象描述** — 用户可见的症状和监控告警
3. **排查过程** — 定位问题的关键步骤
4. **根因分析** — 技术层面的根本原因
5. **修复方案** — 紧急修复和长期改进
6. **经验总结** — 可复用的教训和预防措施

## 前置知识

理解故障案例前，建议先掌握：

- [[kubernetes/index\|Kubernetes]] — 集群基本操作和架构
- [[kubernetes/pod-lifecycle\|Pod 生命周期]] — 理解 Pod 异常状态
- [[runbooks/index\|排障手册]] — 基本的排障方法论

## 延伸阅读

- [[runbooks/index\|排障手册]] — 快速排障的标准化流程
- [[architectures/index\|架构设计]] — 通过架构优化预防故障
- [Kubernetes Failure Stories](https://k8s.af/) — 社区故障案例集合
- [SRE Weekly](https://sreweekly.com/) — SRE 领域周报
