# 2026-11-04 冻结 21 项处置与复审台账

## 结论与权限边界

21/21 已完成原文检索、SHA256 对照和处置决定：18 项复审留存、3 项归档（含 inbox 索引）；没有合并发布。两篇事故的英文镜像同步归档，共移动 5 个 MDX，文件字节均不变。

“复审”表示本轮完成静态问题复核并登记待办，不表示命令、性能或恢复流程已验证。18 篇仍保留冻结告警，未补写 reviewed/reviewed_by/reviewed_at。未经作者真实审校与隔离演练，不得宣称已经完成元数据迁移。legacy-canonical-baseline.json 原文件与 21 个指纹均未刷新。

## 逐项决定与证据

全部原始路径相对于仓库；行号按本次原文快照。完整哈希和原文片段见外置 frozen-21-evidence.json；下表短指纹仅便于复核。

| # | 原路径（src/pages/ 前缀省略） | 决定 | 原文证据与复审缺口 | 运行核验边界 | SHA256 前 12 位 |
|---|---|---|---|---|---|
| 1 | `architectures/gitops-pipeline.mdx` | 复审 | L66：把自动同步与本仓 GHCR 构建混同的风险；分钟级回滚与合规结论未见实测。先明确控制器、同步策略与失败恢复。 | 无 ArgoCD/Flux 控制器演练；本轮只验证本站静态镜像切换。 | `2bdcd955d882` |
| 2 | `architectures/ha-cluster.mdx` | 复审 | L25：“无切换延迟”和 quorum 公式缺少适用条件，未见多节点故障证据。 | 未做 HA 集群/网络分区演练；本站当前非生产单容器。 | `43fc6b404dc0` |
| 3 | `comparisons/helm-vs-kustomize.mdx` | 复审 | L109：将 helm rollback 无条件称为可靠原子操作；未见 Chart、版本、hooks/持久数据的回滚夹具。 | 未安装/运行 Helm；需补渲染差异、失败和恢复结果。 | `471d81ff8a1f` |
| 4 | `comparisons/istio-vs-linkerd.mdx` | 复审 | L83：内存、P99 对比数字缺版本、负载与原始测量；与 Service Mesh 页交叉内容待核对。 | 未做网格压测；删除数字或附可重放基准前不得称验证通过。 | `406dcf54164f` |
| 5 | `docker/compose.mdx` | 复审 | L19：示例依赖仓外 web/api 构建目录；环境变量优先级、健康依赖与滚动更新说法缺夹具。 | 未执行 compose up；需独立示例 config 校验、健康失败与保卷回退。 | `586db71400d8` |
| 6 | `docker/image-layers.mdx` | 复审 | L12：镜像分层概念可保留；默认存储实现需版本限定，示例 Node 20 不能等同本站 Node 22。 | 本轮实际构建/inspect 已运行；这不覆盖文章所有示例。 | `500ca8d41fa2` |
| 7 | `docker/networking.mdx` | 复审 | L46：把 Docker overlay 与 Kubernetes 网络泛化，且“零网络开销”缺测量前提。 | 本轮只实测回环端口映射与相对重定向；未验证 CNI/Swarm。 | `0f31a5345b99` |
| 8 | `docker/storage.mdx` | 复审 | L83：默认 overlay2 与 prune 清理命名卷的说明需按版本修订；包含会删数据的操作。 | 只跑 prune --help，确认 --all 才包括全部未使用卷；从未执行清理。 | `c0379475cdf3` |
| 9 | `incidents/dns-resolution-failure.mdx` | 归档 | L87：未见真实事件来源、时间线、影响或恢复日志；诊断示例不能冒充复盘，SLO 数字无项目证据。 | 中英原字节归档；四种旧 URL（中英、带/不带斜杠）均须在 nginx 验 410。 | `817a2c743655` |
| 10 | `incidents/etcd-data-corruption.mdx` | 归档 | L48：未见真实事件或快照恢复证据；含删除数据目录和未限定版本的 snapshot restore 操作。 | 中英原字节归档；etcd 3.6 官方恢复文档使用 etcdutl，新 runbook 需隔离恢复演练。 | `97fdfaacb11a` |
| 11 | `kubernetes/container-runtime.mdx` | 复审 | L149：文中以 operatingSystem 查询辅助 cgroup 驱动检查；未见 CRI/OCI 版本与 RuntimeClass 隔离验证。 | 未变更运行时或集群；需专用沙箱，禁止把本机 Docker 等同 K8s CRI 验证。 | `e4887eaf03b1` |
| 12 | `kubernetes/pod-lifecycle.mdx` | 复审 | L53：postStart 先于主进程完成的描述与官方并发执行说明冲突；终止时序需指定版本。 | 仅完成文本/官方文档对照，未运行 Pod 钩子时序夹具。 | `f0a48b78f24b` |
| 13 | `kubernetes/service-mesh.mdx` | 复审 | L50：内存/P99 数字未见测量，追踪上下文与自动串联说法缺应用传播验证；与对比页内容重叠。 | 未安装服务网格；先区分 sidecar/ambient、数据面和可重放基准。 | `ac1633b16185` |
| 14 | `linux/filesystem.mdx` | 复审 | L87：包含自动修复与 remount 写操作，未见盘镜像备份恢复证据；告警百分比缺现场依据。 | 未挂载/修复宿主磁盘；只可先用隔离文件系统镜像演练。 | `c9e85b07f7f7` |
| 15 | `linux/network-stack.mdx` | 复审 | L90：包含防火墙 DROP、sysctl 写操作，未记录原值、隔离条件与恢复命令。 | 未变更宿主网络；需隔离网络命名空间、修改前后探针与回退。 | `6981276920ff` |
| 16 | `linux/process-model.mdx` | 复审 | L78：强杀父进程缺影响确认与退路；孤儿进程收养/PID 1 的表述待补命名空间与 subreaper 条件。 | 本轮浏览器验证只证明页面可读，不证明进程故障处置安全。 | `a479f5d91862` |
| 17 | `linux/systemd.mdx` | 复审 | L46：示例限速字段位置、依赖失败行为和重启前后核验待复核；无 unit 验证日志。 | 本次 Alpine/nginx 容器不是 systemd 环境；不得声称 systemctl 演练通过。 | `e4531055017f` |
| 18 | `runbooks/crashloopbackoff.mdx` | 复审 | L31：正文“非零退出码”与自身退出码 0/Always 表格矛盾；PDB 不能用来承诺防崩溃。 | 官方 Always 允许成功退出后重启；仍需隔离 Pod 复现、前置备份与恢复。 | `e05819c75fb5` |
| 19 | `runbooks/imagepullbackoff.mdx` | 复审 | L75：需避免把解码凭据写入日志；Registry 限额与运行时配置需标版本，并补失败/恢复夹具。 | 未访问私有 Registry/解码真实 Secret；本轮站点构建不等同此 runbook 验证。 | `3056569e05a0` |
| 20 | `runbooks/oomkilled.mdx` | 复审 | L164：示例 CPU request 250m、limit 500m，却称 Guaranteed；需纠正 QoS 断言与 OOM 归因条件。 | 官方要求每个容器 CPU/内存 request=limit；未注入节点/业务内存故障。 | `f1ac6724601c` |
| 21 | `src/inbox/linux/index.mdx` | 归档 | L12：旧索引固定声称 88 篇，与当前发布树不符；并非合规草稿，自动栏目列表已替代其用途。 | 原文件从未是公开路由，移至 archive，不新增公开 URL/410。 | `302d92467ff4` |

## 已核对的一手资料

- [Kubernetes 生命周期钩子](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/)：postStart 与 ENTRYPOINT 并发，不能当成启动前置脚本。
- [Kubernetes QoS 条件](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/)：Guaranteed 要求各容器 CPU 与内存的 request/limit 分别相等。
- [Kubernetes Pod 生命周期](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)：Always 会重启正常退出的容器；退出码不是 CrashLoopBackOff 的充分判据。
- [etcd 3.6 灾难恢复](https://etcd.io/docs/v3.6/op-guide/recovery/)：区分 etcdctl 保存、etcdutl 状态/恢复，Kubernetes 恢复还需评估 revision/cache 问题。这里只核对文档，未运行 etcd 恢复。
- [Docker containerd image store](https://docs.docker.com/engine/storage/containerd/)：存储后端需标明版本；本机 Docker 29 实际 inspect 为 overlayfs，不能宣称所有当前环境均是 overlay2。
- 以上是本次复审的局部事实检查，未给任何一篇补造完整人工审校或实机验证。

## 归档与发现集合

- 归档目录：archive/frozen-20261104/{zh,en}/incidents/ 与 archive/frozen-20261104/inbox/linux/index.mdx。保留原字节、历史 layout 和哈希，只供追溯，不可原样回迁。
- 中英 DNS/etcd 旧路由的带/不带斜杠共 8 个精确键加入 nginx 410 map；目录入口 /incidents 保留 200，七栏目不变。
- 原 31 条发现路由只删除 /incidents/dns-resolution-failure、/incidents/etcd-data-corruption，目标变为 29；英文镜像原本未精选，不属于发现集合；inbox 原本不构建，移出不改变发现集合。
- 首页、侧栏与英文统计同步去掉归档入口和虚假“Updated today”；不新增栏目或内容。
- 验收必须比较发现策略、sitemap、Pagefind 的完整集合，不能只比较条数；最终结果见发布记录。

## 后续关闭规则

每篇复审项单独准备版本锁定的隔离夹具、可重放命令、原始输出、异常注入与回退结果，再由作者真实签署审校字段并通过完整内容门禁。不会以“刷新豁免哈希”代替修订，也不会为了维持 31 而补充凑数页面。

证据目录：/Users/pineapple/.codex/visualizations/2026/11/03/01a1a185-f7be-7072-b8a5-62849f7d1a8e/sre-wiki-execution-20261104-q5fohy6x。
