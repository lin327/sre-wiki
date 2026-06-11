---
title: "Istio vs Linkerd"
created: 2026-06-11
updated: 2026-06-11
type: comparison
tags: [component/networking, topic/comparison, tech/istio, tech/kubernetes]
sources: [https://istio.io/latest/docs/ops/deployment/comparison/]
confidence: medium
---

## 概述

Istio 和 Linkerd 是最主流的 Service Mesh 方案。

## 对比

| 维度 | Istio | Linkerd |
|------|-------|---------|
| 代理 | Envoy | linkerd-proxy (Rust) |
| Sidecar 内存 | ~100MB | ~20MB |
| 功能丰富度 | 最高 | 够用 |
| 安装复杂度 | 高 | 低 |
| 多集群支持 | ✅ | ✅ |
| mTLS | ✅ 默认开启 | ✅ 默认开启 |
| 流量管理 | 极其丰富 | 基本够用 |
| 社区活跃度 | 极高 | 高 |

## 适用场景

### 选 Istio 当

- 需要高级流量管理（金丝雀、A/B 测试、故障注入）
- 大型企业级部署
- 团队有能力维护复杂系统

### 选 Linkerd 当

- 追求轻量和简单
- 资源有限（小集群）
- 不需要 Envoy 的高级功能
- 快速上手

## 相关页面

- [[service-mesh]] — Service Mesh 概念
- [[helm-vs-kustomize]] — Helm vs Kustomize 对比
