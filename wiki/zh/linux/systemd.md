---
title: "systemd 与服务管理"
created: 2026-06-11
updated: 2026-06-11
type: concept
tags: [layer/systemd, topic/concept]
sources: [https://man7.org/linux/man-pages/man1/systemctl.1.html, https://man7.org/linux/man-pages/man5/systemd.unit.5.html]
confidence: high
---

## 概述

systemd 是现代 Linux 的 init 系统和服务管理器。理解 systemd 是管理 Linux 服务、排查启动问题的基础，也是理解 Kubernetes 节点服务管理的前提。

## 核心概念

### 启动流程

```
BIOS/UEFI
  → Bootloader (GRUB)
    → Kernel
      → systemd (PID 1)
        → default.target
          → multi-user.target / graphical.target
            → 各种 service
```

### Unit 类型

| 类型 | 文件后缀 | 用途 |
|------|---------|------|
| Service | .service | 服务进程 |
| Socket | .socket | Socket 激活 |
| Timer | .timer | 定时任务（替代 cron） |
| Mount | .mount | 文件系统挂载 |
| Target | .target | 启动目标（类似 runlevel） |

### Service 文件

```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My Application
After=network.target
Requires=postgresql.service

[Service]
Type=simple
User=appuser
ExecStart=/usr/bin/myapp --config /etc/myapp.conf
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
RestartSec=5
LimitNOFILE=65536
MemoryMax=512M

[Install]
WantedBy=multi-user.target
```

### 常用命令

```bash
# 服务管理
systemctl start/stop/restart/status nginx
systemctl enable/disable nginx
systemctl daemon-reload

# 日志查看
journalctl -u nginx -f
journalctl -u nginx --since "1 hour ago"
journalctl -p err  # 只看错误

# 分析启动时间
systemd-analyze blame
systemd-analyze critical-chain
```

### Timer（定时任务）

```ini
# /etc/systemd/system/backup.timer
[Unit]
Description=Daily Backup

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

## 关键参数

| 参数 | 说明 |
|------|------|
| `Restart=on-failure` | 失败时自动重启 |
| `RestartSec=5` | 重启间隔 5 秒 |
| `LimitNOFILE=65536` | 文件描述符限制 |
| `MemoryMax=512M` | 内存限制（cgroup v2） |
| `CPUQuota=200%` | CPU 限制（2 核） |

## 常见问题

- 服务启动失败 → `journalctl -u xxx -n 50` 查看日志
- 服务被 OOM Kill → 检查 MemoryMax 和实际内存使用
- 启动慢 → `systemd-analyze blame` 找到瓶颈

## 相关页面

- [[process-model]] — 进程模型（systemd 管理的正是 Linux 进程）
- [[container-runtime]] — 容器运行时（kubelet 作为 systemd 服务运行）
- [[crashloopbackoff]] — CrashLoopBackOff 排障（服务启动失败的 K8s 版本）
