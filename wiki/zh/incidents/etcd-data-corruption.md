---
title: "etcd 数据损坏故障复盘"
created: 2026-06-11
updated: 2026-06-11
type: incident
tags: [component/control-plane, topic/incident, tech/etcd, tech/kubernetes, severity/p0]
sources: [https://github.com/etcd-io/etcd/issues/14701]
confidence: medium
---

## 事故概述

etcd 数据损坏导致集群状态丢失，所有 Deployment、Service、ConfigMap 等资源不可用。

## 时间线

| 时间 | 事件 |
|------|------|
| T+0 | etcd 磁盘写满，停止接受写入 |
| T+5min | API Server 返回 500 错误 |
| T+10min | 所有 Pod 调度停止 |
| T+15min | 运维介入，发现 etcd 数据不一致 |
| T+2h | 从快照恢复，集群恢复 |

## 根因

1. etcd 数据目录所在磁盘空间不足
2. 没有配置 etcd 自动 compaction 和 defrag
3. 监控告警未覆盖 etcd 磁盘使用率

## 修复措施

### 短期

```bash
# 检查 etcd 磁盘使用
etcdctl endpoint status --write-out=table

# 手动 compact
etcdctl compact $(etcdctl endpoint status --write-out=json | jq '.[0].Status.header.revision')

# 手动 defrag
etcdctl defrag
```

### 长期

- 配置 `--auto-compaction-mode=periodic --auto-compaction-retention=1h`
- 配置 `--quota-backend-bytes=8589934592`（8GB）
- etcd 磁盘使用率告警（> 80% 报警）
- 每日自动快照备份

## 预防措施

- etcd 数据目录使用独立磁盘（SSD）
- 配置 etcd 自动 compaction 和 defrag
- 监控 etcd_disk_wal_fsync_duration_seconds
- 定期验证快照可恢复性

## 相关页面

- [[ha-cluster]] — 高可用集群架构
- [[pod-lifecycle]] — Pod 生命周期（理解 etcd 故障影响）
