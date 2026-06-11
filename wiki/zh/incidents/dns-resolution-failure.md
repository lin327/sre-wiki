---
title: "DNS 解析失败故障复盘"
created: 2026-06-11
updated: 2026-06-11
type: incident
tags: [component/networking, topic/incident, tech/kubernetes, severity/p1]
sources: [https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/]
confidence: medium
---

## 事故概述

集群内 Pod 无法解析 Service 名称，导致服务间通信中断。

## 时间线

| 时间 | 事件 |
|------|------|
| T+0 | 用户报告服务间调用超时 |
| T+5min | 确认 DNS 解析失败（nslookup 返回 SERVFAIL） |
| T+10min | 发现 CoreDNS Pod OOMKilled |
| T+15min | 增加 CoreDNS 内存限制，重启 Pod |
| T+20min | DNS 恢复正常 |

## 根因

1. CoreDNS 内存限制过低（64Mi），在高并发 DNS 查询下 OOM
2. 某应用大量 DNS 查询（未配置 DNS 缓存）
3. CoreDNS 未配置 HPA，无法自动扩容

## 修复措施

```bash
# 增加 CoreDNS 内存限制
kubectl -n kube-system patch deployment coredns -p '{"spec":{"template":{"spec":{"containers":[{"name":"coredns","resources":{"limits":{"memory":"256Mi"}}}]}}}}'

# 启用 DNS 缓存（NodeLocal DNSCache）
kubectl apply -f https://k8s.io/examples/admin/dns/dns-node-local-cache.yaml
```

## 预防措施

- 部署 NodeLocal DNSCache 减少 CoreDNS 压力
- 应用层面配置 DNS 缓存
- CoreDNS 配置 HPA（基于 CPU/内存）
- 监控 CoreDNS 的 request_count 和 latency

## 相关页面

- [[pod-lifecycle]] — Pod 生命周期
- [[crashloopbackoff]] — CrashLoopBackOff 排障
