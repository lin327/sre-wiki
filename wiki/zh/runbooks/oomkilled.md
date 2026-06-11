---
title: "OOMKilled 排障"
created: 2026-06-11
updated: 2026-06-11
type: runbook
tags: [component/data-plane, topic/troubleshooting, tech/kubernetes, severity/p1]
sources: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/]
confidence: high
---

## 症状

容器被内核 OOM Killer 终止，Pod 状态显示 `OOMKilled`，退出码 137。

## 根因清单（按概率排序）

1. **内存 Limit 设置过低** (40%) — 应用实际需要的内存超过 limits
2. **内存泄漏** (30%) — 应用代码问题，内存持续增长
3. **JVM/Python 等运行时未限制** (20%) — 堆内存、缓存未限制
4. **突发流量** (10%) — 短时间内大量请求导致内存飙升

## 排查步骤

### Step 1: 确认 OOM 事件

```bash
kubectl describe pod <pod-name> -n <namespace> | grep -A 5 "Last State"
```

确认 `Reason: OOMKilled`。

### Step 2: 查看实际内存用量

```bash
# 实时用量
kubectl top pod <pod-name> -n <namespace>

# 历史用量（如果有 Prometheus）
# 查询 container_memory_working_set_bytes
```

### Step 3: 检查 limits 配置

```bash
kubectl get pod <pod-name> -n <namespace> -o jsonpath='{.spec.containers[0].resources.limits.memory}'
```

### Step 4: 查看内核日志

```bash
# 在节点上查看
dmesg | grep -i oom
journalctl -k | grep -i oom
```

## 修复方案

### 调整 limits

```bash
kubectl set resources deployment/<deploy-name> -n <namespace> --limits=memory=512Mi
```

### 限制 JVM 堆内存

```yaml
env:
  - name: JAVA_OPTS
    value: "-Xmx384m -Xms128m"
```

## 预防措施

- 使用 VPA（Vertical Pod Autoscaler）自动调整资源
- 设置 requests = limits 保证 QoS 为 Guaranteed
- 监控 container_memory_working_set_bytes 趋势

## 相关页面

- [[crashloopbackoff]] — CrashLoopBackOff 排障
- [[pod-lifecycle]] — Pod 生命周期
- [[process-model]] — Linux 进程模型（OOM Killer 的底层机制）
