---
title: "Helm vs Kustomize"
created: 2026-06-11
updated: 2026-06-11
type: comparison
tags: [component/cicd, topic/comparison, tech/helm, tech/kubernetes]
sources: [https://kubernetes.io/docs/concepts/overview/working-with-objects/kustomization/]
confidence: high
---

## 概述

Helm 和 Kustomize 是 Kubernetes 配置管理的两种主流方案。

## 对比

| 维度 | Helm | Kustomize |
|------|------|-----------|
| 模板语言 | Go Template | 无模板（Overlay 叠加） |
| 包管理 | ✅ Chart 仓库 | ❌ 无包管理 |
| 学习曲线 | 中等 | 平缓 |
| K8s 原生 | 需安装 | kubectl 内置 |
| 多环境 | values-{env}.yaml | overlay/{env}/ |
| 变量替换 | ✅ 内置 | ❌ 需要外部工具 |

## 适用场景

### 选 Helm 当

- 使用第三方软件（Prometheus、Grafana、ArgoCD）
- 需要 Chart 仓库管理版本
- 团队熟悉 Go Template

### 选 Kustomize 当

- 配置相对简单，主要是多环境差异
- 不想引入额外依赖
- 喜欢声明式、无模板的方式

### 两者结合

ArgoCD 同时支持 Helm 和 Kustomize，可以在不同项目中混用。

## 相关页面

- [[gitops-pipeline]] — GitOps 部署流水线
- [[istio-vs-linkerd]] — Istio vs Linkerd 对比
