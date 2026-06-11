---
title: "Service Mesh"
created: 2026-06-11
updated: 2026-06-11
type: concept
tags: [component/networking, topic/concept, tech/kubernetes, tech/istio]
sources: [https://istio.io/latest/docs/concepts/what-is-istio/]
confidence: medium
---

## 概述

Service Mesh 是处理服务间通信的基础设施层，通过 Sidecar 代理实现流量管理、可观测性和安全策略，无需修改应用代码。

## 核心原理

### 架构

```
Service A → Sidecar Proxy → 网络 → Sidecar Proxy → Service B
```

### 数据面 vs 控制面

| 层 | 职责 | 组件 |
|----|------|------|
| 数据面 | 请求转发、负载均衡、mTLS | Envoy / Linkerd-proxy |
| 控制面 | 配置下发、证书管理、策略 | istiod / Linkerd control plane |

### 主流方案对比

| 维度 | Istio | Linkerd | Cilium Service Mesh |
|------|-------|---------|-------------------|
| 代理 | Envoy | linkerd-proxy | eBPF（无 sidecar） |
| 资源占用 | 高（~100MB/sidecar） | 低（~20MB/sidecar） | 极低（内核级） |
| 功能丰富度 | 最高 | 够用 | 中等 |
| 学习曲线 | 陡峭 | 平缓 | 中等 |

## 常见问题

- Sidecar 注入失败 → 检查 namespace label 和 webhook 配置
- mTLS 握手失败 → 检查证书过期和 CA 配置
- 流量规则不生效 → 检查 VirtualService 和 DestinationRule

## 相关页面

- [[pod-lifecycle]] — Pod 生命周期（Sidecar 注入时机）
- [[istio-vs-linkerd]] — Istio vs Linkerd 对比
- [[networking]] — Docker 网络模式（Service Mesh 的底层网络）
- [[network-stack]] — Linux 网络栈（Service Mesh 的根基）
