---
title: "CrashLoopBackOff 排障"
created: 2026-06-11
updated: 2026-06-11
type: runbook
tags: [component/data-plane, topic/troubleshooting, tech/kubernetes, severity/p1]
sources: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/]
confidence: high
---

## 症状

Pod 状态显示 `CrashLoopBackOff`，容器反复启动后退出，重启间隔指数增长（10s, 20s, 40s, ...）。

## 根因清单（按概率排序）

1. **应用启动失败** (40%) — 配置错误、依赖不可用、端口冲突
2. **OOMKilled** (25%) — 内存不足被 kill，参考 [[oomkilled]]
3. **健康检查失败** (20%) — livenessProbe 配置不当
4. **权限问题** (10%) — RBAC、文件权限、SELinux
5. **镜像问题** (5%) — 镜像损坏、ENTRYPOINT 错误

## 排查步骤

### Step 1: 查看 Pod 状态

```bash
kubectl get pod <pod-name> -n <namespace> -o wide
```

确认 Pod 状态为 `CrashLoopBackOff`，查看 RESTARTS 次数。

### Step 2: 查看容器日志

```bash
# 当前日志
kubectl logs <pod-name> -n <namespace>

# 上一次崩溃的日志（关键）
kubectl logs <pod-name> -n <namespace> --previous

# 多容器 Pod
kubectl logs <pod-name> -n <namespace> -c <container-name> --previous
```

### Step 3: 查看 Pod 事件

```bash
kubectl describe pod <pod-name> -n <namespace> | grep -A 20 "Events:"
```

关注 `BackOff`、`Failed`、`OOMKilled` 等关键字。

### Step 4: 检查退出码

```bash
kubectl get pod <pod-name> -n <namespace> -o jsonpath='{.status.containerStatuses[0].lastState.terminated}'
```

| 退出码 | 含义 |
|--------|------|
| 0 | 正常退出（检查 restartPolicy） |
| 1 | 应用错误 |
| 137 | OOMKilled (128+9) 或 SIGKILL |
| 139 | SIGSEGV (128+11) |
| 143 | SIGTERM (128+15) |

## 修复方案

### 应用启动失败

```bash
# 检查配置
kubectl get configmap,secret -n <namespace>
kubectl describe pod <pod-name> -n <namespace> | grep -A 5 "Environment"

# 检查依赖服务
kubectl get svc,endpoints -n <namespace>
```

### OOMKilled

```bash
# 增加内存限制
kubectl patch deployment <deploy-name> -n <namespace> -p '{"spec":{"template":{"spec":{"containers":[{"name":"<container>","resources":{"limits":{"memory":"512Mi"}}}]}}}}'
```

### 健康检查失败

```bash
# 临时禁用 livenessProbe 排查
kubectl edit pod <pod-name> -n <namespace>
# 删除 livenessProbe 部分，观察容器是否正常运行
```

## 预防措施

- 设置合理的资源 limits（参考历史用量 + 20% 缓冲）
- 使用 startupProbe 处理慢启动应用
- 配置 PodDisruptionBudget 避免全部重启

## 相关页面

- [[oomkilled]] — OOM 排障
- [[imagepullbackoff]] — 镜像拉取失败
- [[pod-lifecycle]] — Pod 生命周期
