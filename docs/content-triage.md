# 待整理内容逐页清单

> 本清单盘点当前七个分类目录中的 516 篇非精选中文文章。表格中的“建议领域”按标题关键词规则判定；tags 仅在标题无领域或细分类命中时作辅助判定，不覆盖标题规则。建议仅用于人工复核，不代表已经完成分类或内容审校。此文件不改变路由、文章正文、frontmatter 或发布状态。

## 现状与边界

- 七个分类目录共有 536 篇实质文章：20 篇 `canonical: true` 种子页、516 篇待整理文章；分类索引另计。
- 待整理数量：Linux 351、Docker 16、Kubernetes 62、Runbooks 47、Architectures 13、Incidents 27、Comparisons 0。
- 另有 447 篇根目录占位页，正文为“内容待补充”；它们不是本清单中的实质文章，不应当作精选内容。英文目录另有 506 篇页面，本轮没有逐篇改动。
- 当前内容边界主要由 `canonical: true` 控制 sitemap、搜索与精选列表；非精选页的直达 URL 仍可能存在。生成内容多数保留原目录和 URL，不能仅凭本清单批量搬迁或改名。
- 现有 7 类混合了技术领域（Linux、Docker、Kubernetes）与文档类型（Runbooks、Architectures、Incidents、Comparisons）。高置信度命中 observability 的文章约占总数一半（254/516），建议正式新增 Observability 为独立领域；最终以 schema 冻结结论为准。

## 整理建议

1. 先按下方线索人工确认主题和内容质量，不要按关键词自动改目录。一个主题应归入一个主目录；文档形态（runbook、复盘、架构说明、对比）可由 `type` 表达，避免重复造类目。
2. 若标题、正文和来源显示文章只是 GitHub Issue/PR、flaky test 或单点 UI 修复复述，保持 `canonical: false`，优先放入 inbox 或后续合并进可复用知识页。
3. 对跨类或放错目录的页面，先确认现有反向链接和稳定 URL，再单独制定迁移/重定向方案；本清单不建议直接批量改名。
4. 只有通过准确性、可复用性、来源质量、结构完整性审校的页面才考虑晋升为精选；保留中文正文，技术术语可用英文。
5. containerd 等容器运行时内容当前暂归 kubernetes（高），最终领域可能独立为 container-runtime，待 schema 冻结时再定。

## 逐页清单

说明：建议领域按标题关键词优先判定；标题命中多领域时归为“存疑”。observability 高：Grafana、Prometheus、Alertmanager、Loki、Tempo、Mimir、OpenTelemetry、PromQL、告警、链路追踪，以及 alerting、TraceQL、o11y、可观测性；Monitor 为中。containerd、crictl、runc、snapshotter、overlayfs、shim 暂映射 kubernetes（高）；cgroup、bpf/ebpf、AppArmor、SELinux、内核、syscall 映射 linux（高）；docker/Docker引擎/docker engine 映射 docker（高）。标题同时命中 observability 与 docker 关键词时，observability 优先。

标题无领域或细分类命中时，tags 含 prometheus、tsdb、wal、consul-sd、service-discovery 可辅助映射 observability（中）。存疑细分仅存疑行填写，候选值：etcd / terraform-iac / chaos-mesh / kubernetes-platform / security / ai / docker-engine / linux-distro / other；etcd、terraform/packer、chaos-mesh 为中，其余默认低，标题强命中可为中。

### observability

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/linux/flaky-tests-testreshardpartialbatch-prometheus-远程写分片重平衡死锁分析.mdx` | [flaky tests] TestReshardPartialBatch - Prometheus 远程写分片重平衡死锁分析 | 存储与数据管道 | [prometheus, remote-write, testing, concurrency, deadlock, goroutine, sharding] | observability |  | 高 |  |
| `src/pages/linux/alerting-alert-history-save-failure-due-to-tag-value-length.mdx` | Alerting: Alert History Save Failure Due to Tag Value Length | Alerting | [grafana, alerting, postgresql, database, state-history] | observability |  | 高 |  |
| `src/pages/linux/alerting-fix-error-toaster-when-removing-last-rule-from-group.mdx` | Alerting: Fix error toaster when removing last rule from group | 告警管理 | [alerting, grafana, ux, reliability] | observability |  | 高 |  |
| `src/pages/linux/alerting-inconsistent-time-range-in-rule-edit-and-view-pages.mdx` | Alerting: Inconsistent time range in Rule Edit and View pages | alerting | [grafana, alerting, ui, bug, configuration-management] | observability |  | 高 |  |
| `src/pages/linux/alerting-recording-rules-do-not-write-stale-markers.mdx` | Alerting: Recording rules do not write stale markers | 可观测性：告警与记录规则 | [Prometheus, Grafana, stale marker, recording rules, SRE, 数据完整性] | observability |  | 高 |  |
| `src/pages/incidents/alertmanager-选择器在-grafana-升级后失效问题分析.mdx` | Alertmanager 选择器在 Grafana 升级后失效问题分析 | issue | [grafana, alerting, alertmanager, datasource, upgrade-issue] | observability |  | 高 |  |
| `src/pages/linux/alertmanager数据源自定义ca证书配置问题.mdx` | Alertmanager数据源自定义CA证书配置问题 | 告警管理 | [grafana, alertmanager, tls, 证书, 故障排除] | observability |  | 高 |  |
| `src/pages/linux/aws-emr-serverless-grafana-监控作业级别维度缺失问题.mdx` | AWS EMR Serverless Grafana 监控：作业级别维度缺失问题 | 监控与可观测性 | [Grafana, CloudWatch, EMR Serverless, AWS, 监控, 可观测性, SRE, 仪表板] | observability |  | 高 |  |
| `src/pages/runbooks/azure-data-explorer与grafana在kubernetes中的workload-identity认证故障.mdx` | Azure Data Explorer与Grafana在Kubernetes中的Workload Identity认证故障 | 故障排除 | [azure-data-explorer, grafana, kubernetes, workload-identity, authentication, aks] | observability |  | 高 |  |
| `src/pages/linux/azure-monitor-数据源在主权云环境下的区域获取错误.mdx` | Azure Monitor 数据源在主权云环境下的区域获取错误 | 数据源与监控 | [azure-monitor, grafana, sovereign-cloud, error-handling, ux] | observability |  | 中 |  |
| `src/pages/linux/canonical-基于-prometheus-的监控栈迁移实践.mdx` | Canonical 基于 Prometheus 的监控栈迁移实践 | 监控与可观测性 | [Prometheus, 监控迁移, OpenStack, 云服务, Canonical, Ubuntu] | observability |  | 高 |  |
| `src/pages/linux/chaos-mesh-与-skywalking-结合提升混沌工程可观测性.mdx` | Chaos Mesh 与 SkyWalking 结合：提升混沌工程可观测性 | 混沌工程 | [chaos-engineering, observability, chaos-mesh, skywalking, kubernetes, 故障注入, 性能监控] | observability |  | 高 |  |
| `src/pages/linux/chaos-mesh-监控指标增强实践.mdx` | Chaos Mesh 监控指标增强实践 | 混沌工程与可观测性 | [Chaos-Mesh, Observability, Metrics, Kubernetes, SRE-Practices] | observability |  | 高 |  |
| `src/pages/linux/custom-alertmanager-templates.mdx` | Custom Alertmanager Templates | Alerting | [alertmanager, slack, templates, monitoring, runbook] | observability |  | 高 |  |
| `src/pages/linux/cve-2025-30204-grafana-容器镜像中的高危漏洞.mdx` | CVE-2025-30204: Grafana 容器镜像中的高危漏洞 | 安全漏洞 | [安全漏洞, 容器镜像, Grafana, CVE, JWT库] | observability |  | 高 |  |
| `src/pages/linux/digitalocean-的-prometheus-实践从-opentsdb-迁移到拉取模型.mdx` | DigitalOcean 的 Prometheus 实践：从 OpenTSDB 迁移到拉取模型 | 可观测性实践 | [Prometheus, 迁移, 可观测性, 监控, SRE, 拉取模型] | observability |  | 高 |  |
| `src/pages/linux/explore视图中loki日志条目重叠或重复显示问题.mdx` | Explore视图中Loki日志条目重叠或重复显示问题 | 故障与排查 | [grafana, loki, logging, visualization, bug, explore] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-1161-在-mariadb-10116-上数据库迁移失败.mdx` | Grafana 11.6.1 在 MariaDB 10.11.6 上数据库迁移失败 | 故障排除 | [grafana, mariadb, database-migration, compatibility, troubleshooting] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-1231-过滤器查询变量引号缺失问题.mdx` | Grafana 12.3.1 过滤器查询变量引号缺失问题 | 问题与故障 | [grafana, bug, filter, query, variable, regression] | observability |  | 高 |  |
| `src/pages/linux/grafana-13-仪表板文件配置不兼容-gui-导出格式问题.mdx` | Grafana 13 仪表板文件配置不兼容 GUI 导出格式问题 | 配置与部署 | [grafana, provisioning, dashboard, v2, json, file-based-provisioning] | observability |  | 高 |  |
| `src/pages/linux/grafana-1301-tempo-请求上下文取消导致的查询失败与界面崩溃.mdx` | Grafana 13.0.1 Tempo 请求“上下文取消”导致的查询失败与界面崩溃 | 可观测性与故障排除 | [Grafana, Tempo, Context-Canceled, Bug, Troubleshooting, Frontend-State] | observability |  | 高 |  |
| `src/pages/linux/grafana-1301-升级后-elasticsearch-数据源在气隙环境中失效.mdx` | Grafana 13.0.1 升级后 Elasticsearch 数据源在气隙环境中失效 | 配置与环境依赖 | [Elasticsearch, Grafana, 气隙环境, 数据源, 升级, 配置漂移] | observability |  | 高 |  |
| `src/pages/linux/grafana-alerting-provisioning-api导出告警规则时文件夹信息丢失.mdx` | Grafana Alerting Provisioning API：导出告警规则时文件夹信息丢失 | 监控与告警 | [grafana, alerting, api, provisioning, regression, folder] | observability |  | 高 |  |
| `src/pages/linux/grafana-alerting-中-mimir-与-loki-本地存储警报的不一致行为.mdx` | Grafana Alerting 中 Mimir 与 Loki 本地存储警报的不一致行为 | SRE可观测性实践 | [Grafana, Alerting, Mimir, Loki, SRE, Observability, Consistency] | observability |  | 高 |  |
| `src/pages/linux/grafana-api-数据源-uid-校验增强.mdx` | Grafana API 数据源 UID 校验增强 | Grafana | [grafana, api, datasource, validation, error-handling] | observability |  | 高 |  |
| `src/pages/linux/grafana-assistant预先学习基础设施以加速故障排除.mdx` | Grafana Assistant：预先学习基础设施以加速故障排除 | 可观测性工具 | [AI辅助, 可观测性, Grafana, SRE, 事件响应, 故障排除] | observability |  | 高 |  |
| `src/pages/linux/grafana-azure-data-explorer-数据源托管身份认证故障排查.mdx` | Grafana Azure Data Explorer 数据源：托管身份认证故障排查 | 数据源与集成 | ["Grafana", "Azure", "Managed Identity", "ADX", "Authentication", "Troubleshooting"] | observability |  | 高 |  |
| `src/pages/linux/grafana-canvas-tooltip-交互问题分析与修复.mdx` | Grafana Canvas Tooltip 交互问题分析与修复 | Grafana | [Grafana, Canvas, tooltip, 交互, 前端, 可观测性, Bug修复] | observability |  | 高 |  |
| `src/pages/linux/grafana-canvas面板编辑模式性能瓶颈与规避.mdx` | Grafana Canvas面板编辑模式性能瓶颈与规避 | Monitoring | [grafana, canvas, performance, dashboard, state-management, reliability] | observability |  | 高 |  |
| `src/pages/linux/grafana-cli-插件卸载故障windows-server-2012-r2-与参数错误.mdx` | Grafana CLI 插件卸载故障：Windows Server 2012 R2 与参数错误 | 问题排查与故障恢复 | [grafana, cli, windows, plugin, troubleshooting, file-system] | observability |  | 高 |  |
| `src/pages/linux/grafana-cli-配置参数问题.mdx` | grafana CLI 配置参数问题 | CLI 工具 | [grafana, cli, configuration, plugins, debugging] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-cloud-adaptive-logs-丢弃规则.mdx` | Grafana Cloud Adaptive Logs 丢弃规则 | SRE 实践 | [日志管理, 成本优化, Grafana Cloud, 可观测性, 自适应遥测] | observability |  | 高 |  |
| `src/pages/linux/grafana-cloud-ai-observability监控代理工作负载的完整解决方案.mdx` | Grafana Cloud AI Observability：监控代理工作负载的完整解决方案 | 可观测性 | [AI, 可观测性, 代理, Grafana, OpenTelemetry, SRE, LLM] | observability |  | 高 |  |
| `src/pages/linux/grafana-cloud-时间序列面板渲染错误canvasgradientaddcolorstop-偏移量超限.mdx` | Grafana Cloud 时间序列面板渲染错误：CanvasGradient.addColorStop 偏移量超限 | 可观测性与可视化工具 | [grafana, dashboard, visualization, bug, sre-troubleshooting, canvas] | observability |  | 高 |  |
| `src/pages/linux/grafana-configfromquery-decimals-映射越界导致面板崩溃.mdx` | Grafana ConfigFromQuery 'Decimals' 映射越界导致面板崩溃 | Grafana面板与可视化 | [grafana, transformer, fieldConfig, decimals, RangeError, toFixed, input-validation, error-budget] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-csv-导出中文乱码问题分析.mdx` | Grafana CSV 导出中文乱码问题分析 | 问题与故障 | [grafana, csv, 国际化, 数据导出, 可靠性, 数据流水线] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-csv导出乱码问题.mdx` | Grafana CSV导出乱码问题 | 故障排查 | [grafana, csv, encoding, bug, table-panel] | observability |  | 高 |  |
| `src/pages/linux/grafana-dashboard-api-中-storedversion-字段的错误报告.mdx` | Grafana Dashboard API 中 storedVersion 字段的错误报告 | dashboard | [grafana, api, storage-version, observability] | observability |  | 高 |  |
| `src/pages/linux/grafana-dashboard-api-更新-repo-managed-dashboard-因空提交消息失败.mdx` | Grafana Dashboard API 更新 Repo-Managed Dashboard 因空提交消息失败 | Provisioning | [grafana, provisioning, git, bug] | observability |  | 高 |  |
| `src/pages/linux/grafana-dashboard-insights-用户活动数据间歇性丢失问题分析.mdx` | Grafana Dashboard Insights 用户活动数据间歇性丢失问题分析 | SRE 技术实践 | [Grafana, Observability, Dashboard, Data Consistency, Incident Analysis] | observability |  | 高 |  |
| `src/pages/docker/grafana-dashboard-provisioning-允许ui更新失效问题.mdx` | Grafana Dashboard Provisioning 允许UI更新失效问题 | 配置管理 | [grafana, bug, provisioning, configuration-management] | observability |  | 高 |  |
| `src/pages/linux/grafana-dashboard-versions-api-响应格式变更说明.mdx` | Grafana Dashboard Versions API 响应格式变更说明 | API 与集成 | [grafana, api, dashboard, versioning, compatibility, breaking-change] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-dashboard-数据合并时的空数据帧处理问题.mdx` | Grafana Dashboard 数据合并时的空数据帧处理问题 | SRE实践 | [grafana, dashboard, visualization, data-transformation, reliability, monitoring] | observability |  | 高 |  |
| `src/pages/linux/grafana-dashboard查询变量重复值问题解析.mdx` | Grafana Dashboard查询变量重复值问题解析 | 可观测性工具配置 | [Grafana, Dashboard, 变量, Query变量, 可观测性] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-datasource-uid-不匹配的-api-早期错误检测.mdx` | Grafana Datasource UID 不匹配的 API 早期错误检测 | 故障排查 | [API, 错误处理, 数据一致性, Grafana] | observability |  | 高 |  |
| `src/pages/incidents/grafana-enforce-domain-配置与云原生环境冲突分析.mdx` | Grafana enforce_domain 配置与云原生环境冲突分析 | 安全与合规 | [grafana, security, configuration, kubernetes, dns-rebinding, sre-practices] | observability |  | 高 |  |
| `src/pages/linux/grafana-explore-add-to-dashboard-功能失效分析.mdx` | Grafana Explore 'Add to Dashboard' 功能失效分析 | 问题分析 | [grafana, bug, dashboard, explore, panel, workflow] | observability |  | 高 |  |
| `src/pages/linux/grafana-geomap-插件经度180边界问题分析与实践.mdx` | Grafana Geomap 插件经度180°边界问题分析与实践 | 可观测性工具 | [Grafana, Geomap, 地理空间可视化, 监控仪表板, 数据可视化, InfluxDB] | observability |  | 高 |  |
| `src/pages/linux/grafana-geomap-面板外部-geojson-数据缓存问题.mdx` | Grafana Geomap 面板外部 GeoJSON 数据缓存问题 | 可观测性 | [grafana, geomap, cache, geojson, data-freshness] | observability |  | 高 |  |
| `src/pages/linux/grafana-git-sync-v13-子模块意外删除问题.mdx` | Grafana Git Sync v13 子模块意外删除问题 | SRE 实践与故障 | [git-sync, grafana, iac, version-control, incident] | observability |  | 高 |  |
| `src/pages/linux/grafana-influxdb3-sql-数据源资源管理器无法处理包含点的标识符.mdx` | Grafana InfluxDB3 SQL 数据源资源管理器无法处理包含点的标识符 | Data Sources | [grafana, influxdb3, sql, query-builder, identifier-quoting, data-source-explorer] | observability |  | 高 |  |
| `src/pages/linux/grafana-irm-中-teams-自适应卡片未正确显示自动确认警报组状态.mdx` | Grafana IRM 中 Teams 自适应卡片未正确显示自动确认警报组状态 | Grafana IRM | [grafana-irm, teams-integration, adaptive-card, auto-acknowledge, bug] | observability |  | 高 |  |
| `src/pages/linux/grafana-jira-v2-集成-cannot-coerce-empty-string-问题与修复.mdx` | Grafana Jira v2 集成 'Cannot coerce empty String' 问题与修复 | Alerting module | [alerting, jira, contact-point, bugfix, reliability, backport] | observability |  | 高 |  |
| `src/pages/linux/grafana-kiosk-模式界面元素显示问题.mdx` | Grafana Kiosk 模式界面元素显示问题 | 监控与可视化 | [grafana, kiosk-mode, ui-regression, noc, dashboard] | observability |  | 高 |  |
| `src/pages/linux/grafana-legacyvariablewrappergetvalue-类型检查缺陷导致多值变量损坏.mdx` | Grafana LegacyVariableWrapper.getValue() 类型检查缺陷导致多值变量损坏 | SRE知识库 | [grafana, 变量, 模板, 数据可视化, 前端缺陷, 可观测性] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-llm-生成功能在版本更新后失效问题分析.mdx` | Grafana LLM 生成功能在版本更新后失效问题分析 | 故障排除 | [grafana, llm, dashboard, troubleshooting, websocket, regression] | observability |  | 高 |  |
| `src/pages/linux/grafana-loki-查询构建器中的引号自动替换问题.mdx` | Grafana Loki 查询构建器中的引号自动替换问题 | 可观测性工具 | [Grafana, Loki, Query Builder, Regex, SRE, 可观测性] | observability |  | 高 |  |
| `src/pages/linux/grafana-metricscache-按组织id作用域划分.mdx` | Grafana MetricsCache 按组织ID作用域划分 | 可观测性平台 | [grafana, caching, multi-tenancy, performance] | observability |  | 高 |  |
| `src/pages/linux/grafana-mixed-数据源与时间覆盖的面板永久加载问题.mdx` | Grafana Mixed 数据源与时间覆盖的面板永久加载问题 | 监控与可观测性 | [grafana, datasource, dashboard, panel, loading, bug, time-override] | observability |  | 高 |  |
| `src/pages/linux/grafana-mixed-数据源时间范围切换时的过时数据问题修复.mdx` | Grafana Mixed 数据源时间范围切换时的过时数据问题修复 | 可观测性与监控 | [Grafana, Mixed-datasource, ReplaySubject, Time-Range, Race-Condition, Dashboard, SRE] | observability |  | 高 |  |
| `src/pages/linux/grafana-mixed数据源面板时间范围更新问题修复.mdx` | Grafana Mixed数据源面板时间范围更新问题修复 | 可观测性 | [Grafana, Mixed-DataSource, RxJS, 数据流, 前端可观测性, 时间范围] | observability |  | 高 |  |
| `src/pages/linux/grafana-oss日志时间戳格式解析差异.mdx` | Grafana OSS日志时间戳格式解析差异 | SRE/可观测性 | [logfmt, timestamp, grafana-oss, observability, log-parsing] | observability |  | 高 |  |
| `src/pages/linux/grafana-paneleditnext-崩溃prometheus-both-查询类型问题.mdx` | Grafana PanelEditNext 崩溃：Prometheus “Both” 查询类型问题 | 故障与调试 | [grafana, prometheus, panel-editor, bug, debugging] | observability |  | 高 |  |
| `src/pages/linux/grafana-queryfield-自动补全时删除查询片段的-bug.mdx` | Grafana QueryField 自动补全时删除查询片段的 Bug | 可观测性工具 | [grafana, bug, autocomplete, UI, query-builder, SuggestionPlugin] | observability |  | 高 |  |
| `src/pages/linux/grafana-sql表达式中的数据格式转换问题.mdx` | Grafana SQL表达式中的数据格式转换问题 | 数据处理与查询 | [Grafana, SQL, 数据平面, 可观测性, Alerting] | observability |  | 高 |  |
| `src/pages/linux/grafana-sql表达式告警预览异常错误.mdx` | Grafana SQL表达式告警预览异常错误 | 监控与告警 | [grafana, alerting, sql, troubleshooting, error-handling] | observability |  | 高 |  |
| `src/pages/linux/grafana-stat面板字体大小回退问题分析.mdx` | Grafana Stat面板字体大小回退问题分析 | 可观测性 | [grafana, dashboard, ui, regression, font-size, reliability, observability] | observability |  | 高 |  |
| `src/pages/linux/grafana-table-面板因-csp-策略导致-evalerror.mdx` | Grafana Table 面板因 CSP 策略导致 EvalError | CSP与安全配置 | [grafana, csp, table-panel, security, dashboard, upgrade] | observability |  | 高 |  |
| `src/pages/linux/grafana-tempo-中-traceql-编辑器处理无效-trace-id-的优雅响应.mdx` | Grafana Tempo 中 TraceQL 编辑器处理无效 Trace ID 的优雅响应 | troubleshooting | [tempo, traceql, observability, user-experience, grafana, error-handling] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-testdata-插件导航至配置页面时出现-404-空白页.mdx` | Grafana TestData 插件导航至配置页面时出现 404/空白页 | 故障排除 | [grafana, bug, datasource, testdata, connectivity, troubleshooting] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-traceql-metric-查询不支持-dashboard-变量替换-step-参数.mdx` | Grafana TraceQL Metric 查询不支持 Dashboard 变量替换 Step 参数 | 故障排查 | [Grafana, TraceQL, Tempo, Dashboard, 变量, 监控, SRE] | observability |  | 高 |  |
| `src/pages/linux/grafana-traces-drilldown-root-cause-latency-查询无数据问题.mdx` | Grafana Traces Drilldown 'Root Cause Latency' 查询无数据问题 | 可观测性工具 | [grafana, tempo, traces, drilldown, traceql, root-cause-analysis, latency, bug] | observability |  | 高 |  |
| `src/pages/linux/grafana-tracing面板span属性值长文本显示问题.mdx` | Grafana Tracing面板Span属性值长文本显示问题 | 可观测性 | [grafana, tracing, ui, usability, observability] | observability |  | 高 |  |
| `src/pages/linux/grafana-v12-仪表盘编辑内存泄漏问题.mdx` | Grafana v12 仪表盘编辑内存泄漏问题 | 可观测性与监控工具 | [grafana, memory-leak, dashboard, frontend, kubernetes] | observability |  | 高 |  |
| `src/pages/linux/grafana-v12-表格图例文本截断问题分析.mdx` | Grafana V12 表格图例文本截断问题分析 | 前端与 UI | [grafana, ui, regression, observability, visualization] | observability |  | 高 |  |
| `src/pages/linux/grafana-v13-仪表盘侧边栏菜单自动展开问题.mdx` | Grafana v13 仪表盘侧边栏菜单自动展开问题 | 前端可观测性工具问题 | [Grafana, UI, Dashboard, 可用性, 用户体验, Bug] | observability |  | 高 |  |
| `src/pages/linux/grafana-v1301-告警规则通过-kubernetes-configmap-配置在-postgresql-上失败.mdx` | Grafana v13.0.1 告警规则通过 Kubernetes ConfigMap 配置在 PostgreSQL 上失败 | Grafana | [grafana, kubernetes, postgresql, provisioning, bug] | observability |  | 高 |  |
| `src/pages/linux/grafana-v2-仪表板-schema-自动配置问题分析.mdx` | Grafana v2 仪表板 Schema 自动配置问题分析 | 监控与可视化 | [grafana, dashboard, provisioning, v2-schema, sre] | observability |  | 高 |  |
| `src/pages/linux/grafana-v2-仪表板公共分享标签页显示异常.mdx` | Grafana v2 仪表板公共分享标签页显示异常 | 仪表板与可视化 | [grafana, dashboard, public-sharing, bug, layout, observability] | observability |  | 高 |  |
| `src/pages/linux/grafana-rows-to-fields-转换中的无数据状态提示异常.mdx` | Grafana “rows to fields” 转换中的“无数据”状态提示异常 | 可观测性工具 | [grafana, transformation, data-visualization, bug] | observability |  | 高 |  |
| `src/pages/linux/grafana-中-jaeger-exemplar-追踪链接失效问题分析.mdx` | Grafana 中 Jaeger Exemplar 追踪链接失效问题分析 | 可观测性 | [Grafana, Jaeger, Exemplars, 追踪, 指标, 可观测性] | observability |  | 高 |  |
| `src/pages/linux/grafana-中-loki-ruler-api-间歇性不可用错误分析.mdx` | Grafana 中 Loki Ruler API 间歇性不可用错误分析 | 告警与事件管理 | [Grafana, Loki, Ruler API, Alerting Rules, Transient Error, Kubernetes, UI Bug] | observability |  | 高 |  |
| `src/pages/linux/grafana-仪表板内数据链接变量更新不触发面板刷新.mdx` | Grafana 仪表板内数据链接变量更新不触发面板刷新 | 可观测性工具 | [Grafana, Bug, Data Links, Dashboard Variables, Regression] | observability |  | 高 |  |
| `src/pages/linux/grafana-仪表板区间变量auto值修复.mdx` | Grafana 仪表板区间变量（Auto）值修复 | 监控与可视化 | [Grafana, dashboard, variable, interval, bugfix, data-accuracy] | observability |  | 高 |  |
| `src/pages/linux/grafana-仪表板变量在时间范围刷新模式下加载不更新问题.mdx` | Grafana 仪表板变量在时间范围刷新模式下加载不更新问题 | 可观测性工具与集成 | [grafana, dashboard, variables, bug, troubleshooting] | observability |  | 高 |  |
| `src/pages/linux/grafana-仪表板变量截断与哈希化问题.mdx` | Grafana 仪表板变量截断与哈希化问题 | 可观测性 | [Grafana, 可观测性, 仪表板变量, PromQL, 故障] | observability |  | 高 |  |
| `src/pages/linux/grafana-仪表板变量过滤器大小写敏感回归问题.mdx` | Grafana 仪表板变量过滤器大小写敏感回归问题 | 可观测性工具 | [Grafana, Bug, Dashboard, Variables, Filtering, Case-Sensitive, Regression] | observability |  | 高 |  |
| `src/pages/linux/grafana-仪表板数据链接的双重url编码问题.mdx` | Grafana 仪表板数据链接的双重URL编码问题 | 可观测性工具 | [Grafana, URL编码, 数据链接, 仪表板, 故障排查] | observability |  | 高 |  |
| `src/pages/linux/grafana-仪表板日期选择器设置继承问题.mdx` | Grafana 仪表板日期选择器设置继承问题 | 监控与可观测性 | [grafana, dashboard, bug, configuration, user-experience] | observability |  | 高 |  |
| `src/pages/linux/grafana-仪表盘注释数据源刷新问题.mdx` | Grafana 仪表盘注释数据源刷新问题 | 可观测性 | [grafana, dashboard, annotations, panel, data-source, bug] | observability |  | 高 |  |
| `src/pages/linux/grafana-仪表盘版本历史ui与api数据不一致问题.mdx` | Grafana 仪表盘版本历史UI与API数据不一致问题 | 前端与可观测性 | [grafana, dashboard, version-control, ui-bug, audit-log, data-consistency] | observability |  | 高 |  |
| `src/pages/linux/grafana-关联链接与全局仪表板变量.mdx` | Grafana 关联链接与全局仪表板变量 | 可观测性工具 | [grafana, dashboard, variables, correlations, bug] | observability |  | 高 |  |
| `src/pages/linux/grafana-动态仪表板权限绕过漏洞editable-标志失效.mdx` | Grafana 动态仪表板权限绕过漏洞：Editable 标志失效 | 问题分析与排查 | [grafana, 动态仪表板, 权限, UI, 前端, SRE, 可观测性] | observability |  | 高 |  |
| `src/pages/linux/grafana-动态阈值颜色配置限制.mdx` | Grafana 动态阈值颜色配置限制 | 可视化与监控 | [grafana, 可视化, 动态阈值, 仪表板, 监控配置] | observability |  | 高 |  |
| `src/pages/linux/grafana-区域tab变量无法引用同标签页变量.mdx` | Grafana 区域（Tab）变量无法引用同标签页变量 | Grafana | [grafana, variables, dashboard, tabs, bug] | observability |  | 高 |  |
| `src/pages/linux/grafana-匿名访问下-tab-row-级别变量不显示问题.mdx` | Grafana 匿名访问下 Tab/Row 级别变量不显示问题 | 监控与可视化 | [grafana, dashboard-variables, anonymous-access, feature-toggle] | observability |  | 高 |  |
| `src/pages/linux/grafana-升级后-tempo-多租户链路追踪失效问题分析.mdx` | Grafana 升级后 Tempo 多租户链路追踪失效问题分析 | 可观察性 | [grafana, tempo, multitenancy, tracing, upgrade, grpc] | observability |  | 高 |  |
| `src/pages/linux/grafana-升级时-grafanaini-配置项未更新问题.mdx` | Grafana 升级时 Grafana.ini 配置项未更新问题 | 应用与平台问题 | [grafana, helm, configuration, upgrade, bug] | observability |  | 高 |  |
| `src/pages/incidents/grafana-变量依赖解析假阳性containsvariable-bug.mdx` | Grafana 变量依赖解析假阳性（containsVariable Bug） | issue | [grafana, variable, dependency-graph, false-positive, bug] | observability |  | 高 |  |
| `src/pages/linux/grafana-变量查询-api-信息缺失问题.mdx` | Grafana 变量查询 API 信息缺失问题 | 监控与可视化 | [grafana, variable, datasource, api, observability] | observability |  | 高 |  |
| `src/pages/linux/grafana-可访问性问题注解颜色选择器的标签未程序化关联.mdx` | Grafana 可访问性问题：注解颜色选择器的标签未程序化关联 | 可观测性与前端 | [accessibility, wcag, screen-reader, grafana, ux, compliance] | observability |  | 高 |  |
| `src/pages/linux/grafana-告警规则-orm-映射错误导致的-postgresql-查询异常.mdx` | Grafana 告警规则 ORM 映射错误导致的 PostgreSQL 查询异常 | Alerting & Monitoring | [Grafana, Alerting, PostgreSQL, ORM, xorm, Bug-Fix] | observability |  | 高 |  |
| `src/pages/linux/grafana-告警通知绕过静默时段问题.mdx` | Grafana 告警通知绕过静默时段问题 | alerting | [grafana, alerting, mute-timing, bug, reliability] | observability |  | 高 |  |
| `src/pages/linux/grafana-告警通知配置故障测试成功但实际失败且日志不足.mdx` | Grafana 告警通知配置故障：测试成功但实际失败且日志不足 | alerting | [alerting, webhook, notification, gotify, troubleshooting, logging, grafana] | observability |  | 高 |  |
| `src/pages/linux/grafana-告警配置中环境变量被错误解析为数字的问题排查.mdx` | Grafana 告警配置中环境变量被错误解析为数字的问题排查 | Grafana | [grafana, alerting, provisioning, configuration, environment-variables, troubleshooting] | observability |  | 高 |  |
| `src/pages/linux/grafana-图例选项折叠时斜杠符号显示错误.mdx` | Grafana 图例选项折叠时斜杠符号显示错误 | 可视化与监控 | [Grafana, 可视化, UI问题, 显示错误, 模板变量] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-工具提示精度问题.mdx` | Grafana 工具提示精度问题 | SRE实践 | [grafana, visualization, observability, bug, time-series] | observability |  | 高 |  |
| `src/pages/linux/grafana-报表功能与动态仪表板的兼容性问题.mdx` | Grafana 报表功能与动态仪表板的兼容性问题 | reporting | [grafana, reporting, dynamic-layouts, conditional-rendering, v1-format, sre-workflow] | observability |  | 高 |  |
| `src/pages/linux/grafana-插件上下文用户代理警告.mdx` | Grafana 插件上下文用户代理警告 | 可观测性与日志管理 | [grafana, logging, user-agent, plugin-context] | observability |  | 高 |  |
| `src/pages/linux/grafana-数据源-api-的-uid-一致性校验.mdx` | Grafana 数据源 API 的 UID 一致性校验 | API与数据管理 | [api, grafana, data-source, validation, rest-api, reliability] | observability |  | 高 |  |
| `src/pages/linux/grafana-数据源插件版本不兼容问题排查.mdx` | Grafana 数据源插件版本不兼容问题排查 | Grafana | [Grafana, 插件, 兼容性, Kubernetes, 数据源] | observability |  | 高 |  |
| `src/pages/docker/grafana-数据源配置错误data-source-not-found-问题排查.mdx` | Grafana 数据源配置错误：'data source not found' 问题排查 | 配置管理 | [grafana, datasource, provisioning, configuration, troubleshooting, docker] | observability |  | 高 |  |
| `src/pages/linux/grafana-数据链接上下文菜单键盘定位错误.mdx` | Grafana 数据链接上下文菜单键盘定位错误 | 可观测性工具 | [grafana, ui-bug, accessibility, keyboard-navigation, sre-tools, incident-response] | observability |  | 高 |  |
| `src/pages/linux/grafana-日志表格面板过滤器-0-的行为差异问题.mdx` | Grafana 日志表格面板过滤器 \|=0 的行为差异问题 | SRE 工具与可视化 | [Grafana, Logs, Panel, Filter, Debugging, Observability] | observability |  | 高 |  |
| `src/pages/linux/grafana-日志面板修复自定义字段与-otel-日志属性交互.mdx` | Grafana 日志面板修复：自定义字段与 OTel 日志属性交互 | 日志分析 | [grafana, logs, opentelemetry, otel, observability, bug-fix] | observability |  | 高 |  |
| `src/pages/linux/grafana-时间序列可视化中的类型相关隔离缺陷.mdx` | Grafana 时间序列可视化中的类型相关隔离缺陷 | 可视化与仪表板 | [grafana, visualization, bug, boolean-series, legend-interaction, override-mechanism] | observability |  | 高 |  |
| `src/pages/linux/grafana-时间选择器无效日期问题分析.mdx` | Grafana 时间选择器：无效日期问题分析 | 可观测性工具 | [grafana, timepicker, date-time, bug, SRE] | observability |  | 高 |  |
| `src/pages/linux/grafana-服务启动失败openapi-模型生成错误.mdx` | Grafana 服务启动失败：OpenAPI 模型生成错误 | 监控与可观测性 | [grafana, kubernetes, feature-flag, openapi, startup-failure] | observability |  | 高 |  |
| `src/pages/linux/grafana-模板变量多选显示问题.mdx` | Grafana 模板变量多选显示问题 | 可视化与仪表板 | [grafana, dashboard, template-variables, troubleshooting, observability] | observability |  | 高 |  |
| `src/pages/linux/grafana-比较查询在滚动时间窗口中的-bug-修复.mdx` | Grafana 比较查询在滚动时间窗口中的 Bug 修复 | 监控与可观测性 | [grafana, time-series, dashboard, bugfix, observability, monitoring] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-注释查询中-matchanyfalse-的标签过滤错误.mdx` | Grafana 注释查询中 MatchAny=False 的标签过滤错误 | 故障分析 | [grafana, annotations, bug, query, sre-troubleshooting, metrics-filtering] | observability |  | 高 |  |
| `src/pages/linux/grafana-混合数据源与仪表板数据源变量变更同步问题.mdx` | Grafana 混合数据源与仪表板数据源变量变更同步问题 | 仪表板与可视化 | [grafana, dashboard, datasource, variable, sre, observability] | observability |  | 高 |  |
| `src/pages/linux/grafana-热力图数据链接在多帧查询与添加字段转换下的字段解析错误.mdx` | Grafana 热力图数据链接在多帧查询与添加字段转换下的字段解析错误 | 可观测性工具 | [grafana, heatmap, bug, datalink, transformation] | observability |  | 高 |  |
| `src/pages/linux/grafana-版本升级失败资源版本缺失与启动失败.mdx` | Grafana 版本升级失败：资源版本缺失与启动失败 | Grafana 故障处理 | [grafana, upgrade, database, versioning, startup-failure] | observability |  | 高 |  |
| `src/pages/linux/grafana-直方图-y-轴单位误设置问题诊断与处理.mdx` | Grafana 直方图 Y 轴单位误设置问题诊断与处理 | 可视化与图表 | [grafana, histogram, visualization, prometheus, bug] | observability |  | 高 |  |
| `src/pages/runbooks/grafana-组织切换器-url-重定向问题.mdx` | Grafana 组织切换器 URL 重定向问题 | 故障排除 | [grafana, organisations, root_url, reverse-proxy, url-redirection] | observability |  | 高 |  |
| `src/pages/linux/grafana-编辑模式修复区域级变量事件传播.mdx` | Grafana 编辑模式：修复区域级变量事件传播 | 可观测性 | [grafana, dashboard, variable, edit-mode, bug-fix, ui] | observability |  | 高 |  |
| `src/pages/linux/grafana-自定义查询头部编码问题导致-waf-拦截.mdx` | Grafana 自定义查询头部编码问题导致 WAF 拦截 | 可观测性 | [grafana, waf, encoding, reliability, http-headers] | observability |  | 高 |  |
| `src/pages/linux/grafana-行布局填充屏幕功能失效问题.mdx` | Grafana 行布局“填充屏幕”功能失效问题 | observability-tools | [bug, layout, grafana-dashboard, observability] | observability |  | 高 |  |
| `src/pages/linux/grafana-表格整行着色功能回归问题分析.mdx` | Grafana 表格“整行着色”功能回归问题分析 | Monitoring & Observability | [Grafana, Table Panel, Regression, Observability, Dashboard] | observability |  | 高 |  |
| `src/pages/linux/grafana-警报规则分组视图分页问题.mdx` | Grafana 警报规则分组视图分页问题 | 可观测性 | [grafana, alerting, UI, performance, usability] | observability |  | 高 |  |
| `src/pages/linux/grafana-警报规则表达式字段丢失问题分析.mdx` | Grafana 警报规则表达式字段丢失问题分析 | 监控与告警 | [grafana, alerting, regression, schema-validation, zod, expression-queries] | observability |  | 高 |  |
| `src/pages/linux/grafana-认证后-ssrf-漏洞告警接收者测试端点安全事件分析.mdx` | Grafana 认证后 SSRF 漏洞：告警接收者测试端点安全事件分析 | 可观测性与告警 | [SSRF, Grafana, 安全漏洞, 告警系统, 事件响应, 可观测性] | observability |  | 高 |  |
| `src/pages/linux/grafana-通用-oauth-集成组织映射与升级指南.mdx` | Grafana 通用 OAuth 集成：组织映射与升级指南 | Authentication and Authorization | [grafana, oauth, auth0, authentication, upgrade, configuration] | observability |  | 高 |  |
| `src/pages/linux/grafana-重复行变量刷新失效问题.mdx` | Grafana 重复行变量刷新失效问题 | 可观测性与监控 | [Grafana, 仪表板, 重复, 变量, 刷新, 可观测性] | observability |  | 高 |  |
| `src/pages/linux/grafana-重复行布局异常问题-issue-96537.mdx` | Grafana 重复行布局异常问题 (Issue #96537) | 可观测性和告警 | [grafana, dashboard, bug, layout, repeated-rows, variable, reliability] | observability |  | 高 |  |
| `src/pages/linux/grafana-面板尺寸影响转换计算结果.mdx` | Grafana 面板尺寸影响转换计算结果 | 可观测性平台 | [Grafana, Dashboard, Panel, Transformation, Bug, Reliability, Opensearch] | observability |  | 高 |  |
| `src/pages/linux/grafana-面板时间偏移导致时间范围失效问题.mdx` | Grafana 面板时间偏移导致时间范围失效问题 | Grafana | [grafana, dashboard, bug, timeshift, time-range, visualization, incident] | observability |  | 高 |  |
| `src/pages/linux/grafana-面板标题链接在模板变量切换时更新异常.mdx` | Grafana 面板标题链接在模板变量切换时更新异常 | 可观测性工具与平台 | [grafana, dashboard, template-variable, panel-link, bug, reliability] | observability |  | 高 |  |
| `src/pages/linux/grafana-面板粘贴-bug-导致配置数据丢失.mdx` | Grafana 面板粘贴 Bug 导致配置数据丢失 | bugs | [grafana, dashboard, configuration, bug, panels] | observability |  | 高 |  |
| `src/pages/linux/grafana-面板编辑崩溃与隐形转换行.mdx` | Grafana 面板编辑崩溃与隐形转换行 | 错误处理与数据验证 | [grafana, transformations, error-handling, provisioning, rxjs, compatibility] | observability |  | 高 |  |
| `src/pages/linux/grafana-饼图值映射颜色覆盖问题分析与解决.mdx` | Grafana 饼图值映射颜色覆盖问题分析与解决 | bug | [grafana, pie-chart, value-mapping, visualization, bug] | observability |  | 高 |  |
| `src/pages/linux/grafana与外部alertmanager连接泄漏问题分析与缓解.mdx` | Grafana与外部AlertManager连接泄漏问题分析与缓解 | alerting | [grafana, alertmanager, connection-leak, tcp, file-descriptors, sre-troubleshooting] | observability |  | 高 |  |
| `src/pages/linux/grafana仪表板变量搜索与unicode字符的大小写敏感性.mdx` | Grafana仪表板变量搜索与Unicode字符的大小写敏感性 | 可观测性 | [grafana, dashboard, variable, unicode, bug, search, multi-language] | observability |  | 高 |  |
| `src/pages/linux/grafana仪表板变量溢出问题分析.mdx` | Grafana仪表板变量溢出问题分析 | SRE工具链 | [grafana, ui, dashboard, variable, reliability] | observability |  | 高 |  |
| `src/pages/runbooks/grafana仪表板外部共享时的数据源缺失故障分析与处理.mdx` | Grafana仪表板外部共享时的“数据源缺失”故障分析与处理 | 故障排查 | [grafana, dashboard, datasource, troubleshooting, sharing] | observability |  | 高 |  |
| `src/pages/linux/grafana仪表板快照重复行标题显示问题.mdx` | Grafana仪表板快照：重复行标题显示问题 | 监控与可观测性 | [grafana, dashboard, snapshot, bug] | observability |  | 高 |  |
| `src/pages/docker/grafana仪表板预配置文件夹层级结构失效.mdx` | Grafana仪表板预配置文件夹层级结构失效 | 配置管理 | [grafana, provisioning, configuration-management, dashboards] | observability |  | 高 |  |
| `src/pages/linux/grafana会话管理与令牌刷新机制.mdx` | Grafana会话管理与令牌刷新机制 | 会话与身份验证 | [grafana, session-management, authentication, docker, token-refresh] | observability |  | 高 |  |
| `src/pages/runbooks/grafana动态仪表板tab链接中变量id小写化问题.mdx` | Grafana动态仪表板：Tab链接中变量ID小写化问题 | SRE工具与平台 | [Grafana, Dashboard, Bug, Dynamic-Dashboards, Templating, Linking] | observability |  | 高 |  |
| `src/pages/linux/grafana升级过程中的sqlite数据库锁定故障.mdx` | Grafana升级过程中的SQLite数据库锁定故障 | 故障排查与解决 | [Grafana, SQLite, Database Lock, Kubernetes, EFS, Migration, Upgrade] | observability |  | 高 |  |
| `src/pages/linux/grafana告警规则页面身份验证失败问题.mdx` | Grafana告警规则页面身份验证失败问题 | Grafana | [grafana, alerting, authentication, cookie, proxy, datasource] | observability |  | 高 |  |
| `src/pages/linux/grafana告警通知分组问题排查与配置.mdx` | Grafana告警通知分组问题排查与配置 | 告警与通知 | [grafana, alerting, notification-policy, group-by, sre] | observability |  | 高 |  |
| `src/pages/linux/grafana告警重试风暴与系统稳定性.mdx` | Grafana告警重试风暴与系统稳定性 | Alerting | [alerting, retry-storm, system-stability, grafana, webhook, failure-mode-analysis] | observability |  | 高 |  |
| `src/pages/runbooks/grafana子路径部署下metrics-drilldown的explore链接失效问题.mdx` | Grafana子路径部署下Metrics Drilldown的Explore链接失效问题 | 问题排查 | [grafana, bug, metrics-drilldown, subpath, front-end-routing] | observability |  | 高 |  |
| `src/pages/linux/grafana插件属性重命名与向后兼容性.mdx` | Grafana插件属性重命名与向后兼容性 | 变更管理与兼容性 | [Grafana, 插件, 向后兼容, 变更管理, 配置解析] | observability |  | 高 |  |
| `src/pages/linux/grafana数据源时间戳时区显示偏移问题分析与解决.mdx` | Grafana数据源时间戳时区显示偏移问题分析与解决 | 数据源配置 | [grafana, mysql, timezone, ist, utc, 数据源配置] | observability |  | 高 |  |
| `src/pages/linux/grafana数据源重命名失败url验证错误.mdx` | Grafana数据源重命名失败：URL验证错误 | 监控与可观测性 | [Grafana, 数据源, 配置管理, UI Bug, 验证错误] | observability |  | 高 |  |
| `src/pages/linux/grafana数据转换链中的变量引用可见性问题.mdx` | Grafana数据转换链中的变量引用可见性问题 | 可观测性与可视化 | [grafana, transformations, variables, data-pipeline, bug, dashboard] | observability |  | 高 |  |
| `src/pages/linux/grafana模板变量解析一致性问题.mdx` | Grafana模板变量解析一致性问题 | 可观测性 | [grafana, template-variables, dashboard-reliability, sql, bug] | observability |  | 高 |  |
| `src/pages/linux/grafana注释查询首行结束时间null导致注释异常.mdx` | Grafana注释查询：首行结束时间NULL导致注释异常 | 监控与可视化 | [grafana, annotation, bug, dashboard, observability] | observability |  | 高 |  |
| `src/pages/runbooks/grafana版本升级失败mysql迁移索引错误.mdx` | Grafana版本升级失败：MySQL迁移索引错误 | 故障排除 | [grafana, mysql, migration, upgrade, troubleshooting, indexing] | observability |  | 高 |  |
| `src/pages/runbooks/grafana统计面板最小最大值显示异常.mdx` | Grafana统计面板最小最大值显示异常 | 故障排除 | [grafana, monitoring, visualization, statistics, troubleshooting] | observability |  | 高 |  |
| `src/pages/linux/grafana警报规则导出功能存在陈旧数据源uid的问题.mdx` | Grafana警报规则导出功能存在陈旧数据源UID的问题 | Alerting | [Grafana, Alerting, DataSource, Export, Bug, YAML, JSON, UID, Prometheus] | observability |  | 高 |  |
| `src/pages/linux/grafana重复行面板查询检查器功能失效问题.mdx` | Grafana重复行面板查询检查器功能失效问题 | 监控与可视化 | [grafana, ui, dashboard, troubleshooting, monitoring] | observability |  | 高 |  |
| `src/pages/linux/grafana重复行面板的变量切换状态同步问题.mdx` | Grafana重复行面板的变量切换状态同步问题 | 可观测性工具 | [grafana, dashboard, panel, variable, repeat, reliability] | observability |  | 高 |  |
| `src/pages/linux/grafana面板默认可视化建议失效问题.mdx` | Grafana面板默认可视化建议失效问题 | 可视化与监控 | [grafana, UI, panel-editor, visualization, feature-flag, reliability] | observability |  | 高 |  |
| `src/pages/incidents/hostinger-的-prometheus-监控实践案例研究.mdx` | Hostinger 的 Prometheus 监控实践案例研究 | case-study | [prometheus, monitoring, case-study, high-availability, caching, metrics] | observability |  | 高 |  |
| `src/pages/linux/kubernetes-ccm路由同步指标提升云环境路由可观测性.mdx` | Kubernetes CCM路由同步指标：提升云环境路由可观测性 | 监控与可观测性 | [kubernetes, cloud-controller-manager, monitoring, metrics, routing, reliability] | observability |  | 高 |  |
| `src/pages/kubernetes/kubernetes-v136-控制器过时性缓解与可观测性增强.mdx` | Kubernetes v1.36: 控制器过时性缓解与可观测性增强 | 容器编排与平台 | [kubernetes, controllers, staleness, observability, SRE, client-go, kube-controller-manager] | observability |  | 高 |  |
| `src/pages/linux/kubernetes-可观测性工具迁移从-dashboard-到-headlamp.mdx` | Kubernetes 可观测性工具迁移：从 Dashboard 到 Headlamp | 可观测性 | [headlamp, kubernetes, migration, observability, dashboard, ui] | observability |  | 高 |  |
| `src/pages/linux/loki-adhoc-过滤器对结构化元数据失效问题.mdx` | Loki Adhoc 过滤器对结构化元数据失效问题 | 可观测性 | [Grafana, Loki, Logs, Query, StructuredMetadata, AdhocFilter] | observability |  | 高 |  |
| `src/pages/linux/o11y-bench评估可观测性ai代理的开源基准测试.mdx` | o11y-bench：评估可观测性AI代理的开源基准测试 | 可观测性与监控 | [AI代理, 可观测性, 基准测试, SRE, Grafana, 可靠性工程] | observability |  | 高 |  |
| `src/pages/linux/oidc-discovery-中的-cors-问题与-grafana-自定义请求头.mdx` | OIDC Discovery 中的 CORS 问题与 Grafana 自定义请求头 | 认证与授权 | [CORS, OIDC, OAuth, Grafana, 身份提供商, 集成, 互操作性] | observability |  | 高 |  |
| `src/pages/linux/presslabs从graphite到prometheus的监控演进实践.mdx` | Presslabs：从Graphite到Prometheus的监控演进实践 | 监控与可观测性 | [prometheus, monitoring, kubernetes, migration, observability] | observability |  | 高 |  |
| `src/pages/linux/promcon-2017会议回顾及其对sre社区的价值.mdx` | PromCon 2017会议回顾及其对SRE社区的价值 | 社区与生态 | [prometheus, monitoring, community, best-practices, promcon] | observability |  | 中 |  |
| `src/pages/runbooks/promcon-2025prometheus-生态系统的最新进展与-sre-最佳实践.mdx` | PromCon 2025：Prometheus 生态系统的最新进展与 SRE 最佳实践 | SRE 会议与社区 | [prometheus, promcon, sre, observability, monitoring, promql, opentelemetry, openmetrics] | observability |  | 高 |  |
| `src/pages/linux/promcon-europe-2023前沿监控实践与社区动态.mdx` | PromCon Europe 2023：前沿监控实践与社区动态 | 社区与事件 | [Prometheus, PromCon, 监控, 可观测性, Kubernetes, SRE, 社区] | observability |  | 高 |  |
| `src/pages/linux/prometheus-10-版本发布及其-api-稳定性承诺.mdx` | Prometheus 1.0 版本发布及其 API 稳定性承诺 | 监控与可观测性 | [prometheus, api-stability, sre, cncf, monitoring] | observability |  | 高 |  |
| `src/pages/linux/prometheus-20-命令行与规则格式变更.mdx` | Prometheus 2.0 命令行与规则格式变更 | 监控与警报 | [Prometheus, 告警, 规则, 迁移, 命令行] | observability |  | 高 |  |
| `src/pages/linux/prometheus-20-存储层革新与早期实践.mdx` | Prometheus 2.0 存储层革新与早期实践 | 监控与可观测性 | [Prometheus, 存储, TSDB, 性能优化, 监控, Kubernetes] | observability |  | 高 |  |
| `src/pages/linux/prometheus-30-beta-新特性概览与实践指南.mdx` | Prometheus 3.0 Beta 新特性概览与实践指南 | 监控与可观测性 | [prometheus, monitoring, observability, otel, histograms, remote-write, sre, release-notes] | observability |  | 高 |  |
| `src/pages/linux/prometheus-30发布与升级要点.mdx` | Prometheus 3.0发布与升级要点 | prometheus | [prometheus, monitoring, upgrade, cloud-native] | observability |  | 高 |  |
| `src/pages/linux/prometheus-340-tls-抓取导致的空指针崩溃-sigsegv.mdx` | Prometheus 3.4.0 TLS 抓取导致的空指针崩溃 (SIGSEGV) | 故障与诊断 | [Prometheus, TLS, Crash, SRE, Upgrade, Go, NilPointer] | observability |  | 高 |  |
| `src/pages/linux/prometheus-agent-mode高效的云原生指标转发.mdx` | Prometheus Agent Mode：高效的云原生指标转发 | 可观测性与监控 | [prometheus, agent-mode, remote-write, metrics, cloud-native, sre] | observability |  | 高 |  |
| `src/pages/linux/prometheus-conformance-program-兼容性测试首轮结果.mdx` | Prometheus Conformance Program 兼容性测试首轮结果 | Prometheus 监控 | [prometheus, monitoring, conformance, compatibility, SRE] | observability |  | 高 |  |
| `src/pages/runbooks/prometheus-kubernetes-服务发现配置重载失效.mdx` | Prometheus Kubernetes 服务发现配置重载失效 | 故障排除 | [prometheus, kubernetes, alertmanager, 服务发现, 配置重载] | observability |  | 高 |  |
| `src/pages/linux/prometheus-metric-builder-utf8-支持含-utf-8-字符的标签名在-group-by-查询中未被引号转义.mdx` | Prometheus Metric Builder UTF8 支持：含 UTF-8 字符的标签名在 Group By 查询中未被引号转义 | PromQL | [Prometheus, Grafana, PromQL, Metric-Builder, UTF-8, Reliability] | observability |  | 高 |  |
| `src/pages/linux/prometheus-remote-write-合规性测试概述.mdx` | Prometheus Remote Write 合规性测试概述 | 协议与标准 | [prometheus, remote-write, conformance, observability, CNCF] | observability |  | 高 |  |
| `src/pages/linux/prometheus-stale-series-compaction-threshold-实验性功能崩溃问题.mdx` | Prometheus stale_series_compaction_threshold 实验性功能崩溃问题 | Prometheus | [prometheus, stale-series-compaction, crash-loop, experimental-feature, configuration-bug] | observability |  | 高 |  |
| `src/pages/linux/prometheus-string-labels-优化.mdx` | Prometheus String Labels 优化 | 监控与可观测性 | [prometheus, 性能优化, 内存, label] | observability |  | 高 |  |
| `src/pages/linux/prometheus-tsdb-wal-重放缺陷序列删除后的数据丢失.mdx` | Prometheus TSDB WAL 重放缺陷：序列删除后的数据丢失 | Prometheus | [prometheus, tsdb, wal, replay, race-condition, data-loss, bugfix] | observability |  | 高 |  |
| `src/pages/linux/prometheus-ui-补全异常向量选择器后的错误标签建议.mdx` | Prometheus UI 补全异常：向量选择器后的错误标签建议 | Prometheus | [Prometheus, UI, PromQL, 前端, Bug] | observability |  | 高 |  |
| `src/pages/linux/prometheus-ui-配置显示不一致问题分析.mdx` | Prometheus UI 配置显示不一致问题分析 | 告警管理 | [prometheus, alerting-rules, ui, configuration-verification, sre-troubleshooting] | observability |  | 高 |  |
| `src/pages/linux/prometheus-ux-研究工作组.mdx` | Prometheus UX 研究工作组 | 社区与协作 | [Prometheus, UX, 用户研究, 社区, 可靠性] | observability |  | 高 |  |
| `src/pages/linux/prometheus-修饰符详解.mdx` | Prometheus ‘@’ 修饰符详解 | 监控与可观测性 | [prometheus, promql, monitoring, sre, data-analysis] | observability |  | 高 |  |
| `src/pages/linux/prometheus-一致性计划.mdx` | Prometheus 一致性计划 | 监控与可观测性 | [prometheus, monitoring, interoperability, cloud-native, compliance] | observability |  | 高 |  |
| `src/pages/architectures/prometheus-中的非缓存-i-o-uncached-i-o.mdx` | Prometheus 中的非缓存 I/O (Uncached I/O) | 系统优化 | [Prometheus, 直接I/O, 页面缓存, 内存优化, Linux, TSDB] | observability |  | 高 |  |
| `src/pages/linux/prometheus-加入-cncf云原生监控的里程碑.mdx` | Prometheus 加入 CNCF：云原生监控的里程碑 | 监控与可观测性 | [prometheus, cncf, governance, monitoring, cloud-native] | observability |  | 高 |  |
| `src/pages/runbooks/prometheus-原生复合类型存储的现代化演进.mdx` | Prometheus 原生复合类型存储的现代化演进 | SRE实践 | [Prometheus, TSDB, 存储模型, 可靠性, 数据模型, 原生直方图, OpenMetrics] | observability |  | 高 |  |
| `src/pages/linux/prometheus-在-cncf-毕业成熟度里程碑.mdx` | Prometheus 在 CNCF 毕业：成熟度里程碑 | 可观测性 | [prometheus, cncf, monitoring, maturity, adoption] | observability |  | 高 |  |
| `src/pages/linux/prometheus-在云原生大会的实践与方法论.mdx` | Prometheus 在云原生大会的实践与方法论 | 监控与可观测性 | [prometheus, kubernetes, monitoring, RED-method, cloud-native] | observability |  | 高 |  |
| `src/pages/linux/prometheus-增量查询缓存与时间对比功能.mdx` | Prometheus 增量查询缓存与时间对比功能 | 可观测性工具 | [prometheus, grafana, query-cache, performance, time-comparison] | observability |  | 高 |  |
| `src/pages/linux/prometheus-子查询-subquery.mdx` | Prometheus 子查询 (Subquery) | Prometheus | [prometheus, promql, query, recording-rules, performance] | observability |  | 高 |  |
| `src/pages/linux/prometheus-实践异常检测.mdx` | Prometheus 实践异常检测 | Prometheus | [anomaly-detection, prometheus, promql, alerting, reliability] | observability |  | 高 |  |
| `src/pages/linux/prometheus-对-openmetrics-计数器元数据识别问题的处理.mdx` | Prometheus 对 OpenMetrics 计数器元数据识别问题的处理 | 可观测性 | [prometheus, openmetrics, scrape, metrics-format, compatibility] | observability |  | 高 |  |
| `src/pages/linux/prometheus-对-opentelemetry-的支持与整合.mdx` | Prometheus 对 OpenTelemetry 的支持与整合 | 可观测性 | [OpenTelemetry, Prometheus, OTLP, 指标, 可观测性] | observability |  | 高 |  |
| `src/pages/linux/prometheus-生态系统早期采用与演进.mdx` | Prometheus 生态系统早期采用与演进 | 监控与可观测性 | [Prometheus, 监控生态系统, 早期采用, 容器监控, 云原生] | observability |  | 高 |  |
| `src/pages/linux/prometheus-的一年公开发展历程与-sre-实践启示.mdx` | Prometheus 的一年公开发展历程与 SRE 实践启示 | 监控与可观测性 | [Prometheus, 监控, 开源, SRE, 社区驱动] | observability |  | 高 |  |
| `src/pages/linux/prometheus-目标重标签可视化工具.mdx` | Prometheus 目标重标签可视化工具 | 监控与可观测性 | [prometheus, relabeling, monitoring, debugging, service-discovery] | observability |  | 高 |  |
| `src/pages/linux/prometheus-高级服务发现与-relabeling.mdx` | Prometheus 高级服务发现与 Relabeling | 监控与可观测性 | [Prometheus, 服务发现, Relabeling, SRE实践, 监控] | observability |  | 高 |  |
| `src/pages/linux/prometheus在justwatch的监控实践.mdx` | Prometheus在JustWatch的监控实践 | 可观测性 | [Prometheus, 监控, 微服务, Kubernetes, Go, SRE] | observability |  | 高 |  |
| `src/pages/linux/promql-自动补全处理-utf-8-转义字符不一致问题.mdx` | PromQL 自动补全处理 UTF-8 转义字符不一致问题 | 可观测性与查询 | [prometheus, promql, ui, bug, reliability, query-builder] | observability |  | 高 |  |
| `src/pages/linux/promql实验性-info-函数.mdx` | PromQL实验性 info() 函数 | 可观测性 | [prometheus, promql, sre, opentelemetry, observability] | observability |  | 高 |  |
| `src/pages/linux/promql注释处理对告警规则匹配的影响.mdx` | PromQL注释处理对告警规则匹配的影响 | 告警与监控 | [grafana, promql, alerting-rules, rule-matching, bug-fix] | observability |  | 高 |  |
| `src/pages/linux/promql解析器中持续时间字面量的括号在往返序列化时丢失.mdx` | PromQL解析器中持续时间字面量的括号在往返序列化时丢失 | Prometheus/PromQL | [Prometheus, PromQL, Parser, DurationExpression, Round-trip] | observability |  | 高 |  |
| `src/pages/linux/pull-模式监控的可扩展性探讨.mdx` | Pull 模式监控的可扩展性探讨 | 监控与可观测性 | [pull-based-monitoring, prometheus, scalability, push-vs-pull, monitoring-architecture, sre] | observability |  | 高 |  |
| `src/pages/linux/scalefastr的prometheus实践与云原生监控演进.mdx` | Scalefastr的Prometheus实践与云原生监控演进 | Prometheus实践 | [Prometheus, SRE, 监控, Kubernetes, 云原生, Grafana, 可观测性] | observability |  | 高 |  |
| `src/pages/linux/showmax基于-prometheus-的监控转型实践.mdx` | ShowMax：基于 Prometheus 的监控转型实践 | 监控与可观测性 | [case-study, migration, prometheus, grafana, monitoring, devops] | observability |  | 高 |  |
| `src/pages/linux/shuttlecloud-从分散监控到-prometheus-的-sre-实践.mdx` | ShuttleCloud: 从分散监控到 Prometheus 的 SRE 实践 | 可观测性 | [监控, 告警, Prometheus, 可观测性, SRE, 案例研究, 初创公司] | observability |  | 高 |  |
| `src/pages/linux/tempo-span-过滤器的正则表达式匹配问题.mdx` | Tempo Span 过滤器的正则表达式匹配问题 | 可观测性 | [grafana-tempo, traceql, span-filters, regex, bug] | observability |  | 高 |  |
| `src/pages/linux/tempo-与-sql-表达式即时指标查询的兼容性问题.mdx` | Tempo 与 SQL 表达式：即时指标查询的兼容性问题 | 可观测性工具 | [grafana, sql, tempo, tracing, metrics, expressions, bug] | observability |  | 高 |  |
| `src/pages/linux/tempo-流式传输头部冲突导致no-org-id错误.mdx` | Tempo: 流式传输头部冲突导致'no org id'错误 | SRE 工程与实践 | [tempo, gRPC, multi-tenancy, header, bug, observability, reliability] | observability |  | 高 |  |
| `src/pages/linux/tempo嵌套-span-frames-架构不一致问题.mdx` | Tempo：嵌套 Span Frames 架构不一致问题 | 分布式追踪与日志 | ["tempo", "tracing", "dataframe", "schema", "bug"] | observability |  | 高 |  |
| `src/pages/linux/timecomparison-high-cardinality-grafana.mdx` | TimeComparison: High Cardinality (Grafana) | 可观测性与监控 | [grafana, time-series, high-cardinality, monitoring, sre-tools] | observability |  | 高 |  |
| `src/pages/linux/traceql-注释解析失败问题.mdx` | TraceQL 注释解析失败问题 | 可观测性 | [traceql, observability, query-language, debugging, grafana] | observability |  | 高 |  |
| `src/pages/linux/yaceprometheus-社区的官方-cloudwatch-exporter.mdx` | YACE：Prometheus 社区的官方 CloudWatch Exporter | 生态与集成 | [yace, cloudwatch, prometheus, aws, exporter, monitoring] | observability |  | 高 |  |
| `src/pages/linux/与weaveworks的技术访谈基于prometheus构建云原生监控体系.mdx` | 与Weaveworks的技术访谈：基于Prometheus构建云原生监控体系 | Prometheus | [prometheus, kubernetes, monitoring, weaveworks, cortex, cloud-native, sre] | observability |  | 高 |  |
| `src/pages/linux/从传统时序数据库迁移至-prometheuscompose-的实践.mdx` | 从传统时序数据库迁移至 Prometheus：Compose 的实践 | 监控与可观测性 | [prometheus, migration, monitoring, sre-practices, time-series-databases] | observability |  | 高 |  |
| `src/pages/linux/从碎片化到统一life360的prometheus监控实践.mdx` | 从碎片化到统一：Life360的Prometheus监控实践 | 监控与可观测性 | [prometheus, monitoring, migration, mysql, cassandra, case-study] | observability |  | 高 |  |
| `src/pages/linux/何时使用-varbit-编码.mdx` | 何时使用 Varbit 编码？ | Prometheus 存储 | [prometheus, tsdb, storage, encoding, performance] | observability |  | 中 |  |
| `src/pages/linux/使用-grafana-assistant-集成加速数据库性能问题排查.mdx` | 使用 Grafana Assistant 集成加速数据库性能问题排查 | 监控与告警 | [database-observability, ai-assistant, grafana-cloud, performance-troubleshooting, sre-tools] | observability |  | 高 |  |
| `src/pages/runbooks/使用-prometheus-重构监控iadvize-的实践案例.mdx` | 使用 Prometheus 重构监控：iAdvize 的实践案例 | SRE实践案例 | [prometheus, monitoring, microservices, grafana, consul, case-study] | observability |  | 高 |  |
| `src/pages/linux/修复grafana注解标签并发写入的唯一约束冲突.mdx` | 修复Grafana注解标签并发写入的唯一约束冲突 | 数据库与存储 | [annotations, concurrency, database, grafana, bug-fix] | observability |  | 高 |  |
| `src/pages/linux/修复wal重放中已删除系列重复记录的处理.mdx` | 修复WAL重放中已删除系列重复记录的处理 | TSDB | [prometheus, tsdb, WAL, replay, bugfix, SRE] | observability |  | 中 |  |
| `src/pages/architectures/分析与解决prometheus-testremotewrite-reshardingwithoutdeadlock-不稳定测试.mdx` | 分析与解决：Prometheus TestRemoteWrite_ReshardingWithoutDeadlock 不稳定测试 | 测试与质量保证 | [test-stability, flaky-test, prometheus, remote-write, resharding, deadlock-detection] | observability |  | 高 |  |
| `src/pages/linux/利用-ai-工具增强-prometheus-文档可访问性与维护.mdx` | 利用 AI 工具增强 Prometheus 文档可访问性与维护 | 可观测性 | [Prometheus, 文档, AI, 知识管理, 可观测性] | observability |  | 高 |  |
| `src/pages/kubernetes/功能标志feature-flags.mdx` | 功能标志（Feature Flags） | 渐进式交付 | [feature-flags, progressive-delivery, change-management, prometheus, experimentation] | observability |  | 中 |  |
| `src/pages/linux/动画工作室监控系统现代化从混合栈迁移到prometheus.mdx` | 动画工作室监控系统现代化：从混合栈迁移到Prometheus | 可观测性与监控 | [Prometheus, 迁移, 案例研究, 动画制作, 可靠性工程, 告警] | observability |  | 高 |  |
| `src/pages/linux/可观测性工具链中的前端状态同步陷阱以grafana仪表盘adhoc变量为例.mdx` | 可观测性工具链中的前端状态同步陷阱：以Grafana仪表盘adhoc变量为例 | 仪表盘与数据可视化 | [grafana, 前端状态管理, 数据模型不一致, adhoc-variables, 可观测性工具链] | observability |  | 高 |  |
| `src/pages/linux/告警接收器表单属性名冲突问题分析.mdx` | 告警接收器表单属性名冲突问题分析 | Observability & Alerting | [alerting, configuration, grafana, reliability] | observability |  | 高 |  |
| `src/pages/linux/告警管理因-409-conflict-导致无法通过-ui-编辑通知策略.mdx` | 告警管理：因 409 Conflict 导致无法通过 UI 编辑通知策略 | Alerting & Notification | [grafana, alerting, notification-policy, bug, concurrency] | observability |  | 高 |  |
| `src/pages/linux/告警联系点重试机制失效.mdx` | 告警联系点重试机制失效 | 告警与通知 | [Grafana, 告警, 重试, 故障, 可靠性] | observability |  | 高 |  |
| `src/pages/linux/告警规则-api-删除操作的幂等性优化.mdx` | 告警规则 API 删除操作的幂等性优化 | 监控与告警 | [幂等性, 告警规则, API, 可用性, 错误处理, Terraform, Grafana] | observability |  | 高 |  |
| `src/pages/linux/告警规则编辑的告警状态转换警告.mdx` | 告警规则编辑的告警状态转换警告 | Alerting | [Grafana, Alerting, Best-Practice, Change-Management] | observability |  | 高 |  |
| `src/pages/linux/告警recording-rules-忽略查询评估偏移.mdx` | 告警：Recording Rules 忽略查询评估偏移 | alerting | [alerting, recording-rules, prometheus, observability] | observability |  | 高 |  |
| `src/pages/linux/基于prometheus的金融平台监控实践europace案例.mdx` | 基于Prometheus的金融平台监控实践：Europace案例 | 监控与可观测性 | [case-study, prometheus, grafana, alertmanager, monitoring-migration, devops] | observability |  | 高 |  |
| `src/pages/linux/大型活动基础设施的快速监控实践dreamhack案例.mdx` | 大型活动基础设施的快速监控实践：DreamHack案例 | 可观测性实践 | [Prometheus, SNMP, 监控, 告警, 网络监控, 大规模活动] | observability |  | 高 |  |
| `src/pages/linux/定制grafana-cloud中awsazure和google-cloud的预配置视图.mdx` | 定制Grafana Cloud中AWS、Azure和Google Cloud的预配置视图 | 云可观测性 | [Grafana-Cloud, 云服务, AWS, Azure, GCP, 可观测性, 仪表板定制, SRE] | observability |  | 高 |  |
| `src/pages/linux/实现自定义服务发现.mdx` | 实现自定义服务发现 | 可观测性 | [prometheus, service-discovery, sre, file-sd] | observability |  | 中 |  |
| `src/pages/linux/将cloudwatch指标流式传输到vpc中的opentelemetry收集器.mdx` | 将CloudWatch指标流式传输到VPC中的OpenTelemetry收集器 | 云可观测性 | [cloudwatch, opentelemetry, lambda, metrics-streaming, vpc, push-based-monitoring] | observability |  | 高 |  |
| `src/pages/linux/开发混沌测试每日报告系统以提升可观测性.mdx` | 开发混沌测试每日报告系统以提升可观测性 | 混沌工程 | [Chaos Mesh, 混沌工程, 可观测性, 自动化报告, SLO, Kubernetes] | observability |  | 高 |  |
| `src/pages/linux/支持通过-consul-sd-发现的-fqdn-目标的定期-dns-重新解析.mdx` | 支持通过 Consul SD 发现的 FQDN 目标的定期 DNS 重新解析 | 服务发现与动态配置 | [prometheus, consul, service-discovery, dns, fqdn, reliability] | observability |  | 中 |  |
| `src/pages/linux/文件权限管理与sre实践从grafana仓库权限告警说起.mdx` | 文件权限管理与SRE实践：从Grafana仓库权限告警说起 | 安全与配置管理 | [security, git, file-permissions, configuration-management, grafana] | observability |  | 中 | 关键词误伤嫌疑，需人工确认 |
| `src/pages/linux/移动设备可观测性仪表板变量的可靠交互.mdx` | 移动设备可观测性：仪表板变量的可靠交互 | 可观测性与仪表板 | [grafana, 移动设备, 仪表板变量, 可观测性] | observability |  | 高 |  |
| `src/pages/linux/解决-grafana-database-is-locked-错误.mdx` | 解决 Grafana 'database is locked' 错误 | databases | [grafana, database, sqlite, troubleshooting, reliability] | observability |  | 高 |  |
| `src/pages/linux/解决-grafana-text-panel-html-按钮在升级后失效问题.mdx` | 解决 Grafana Text Panel HTML 按钮在升级后失效问题 | 仪表盘与可视化 | [grafana, dashboard, html, panel, troubleshooting] | observability |  | 高 |  |
| `src/pages/runbooks/解决grafana-folder-kind注册错误.mdx` | 解决Grafana 'Folder' kind注册错误 | 故障排除 | [grafana, docker, kubernetes-api, dashboard, database, troubleshooting] | observability |  | 高 |  |
| `src/pages/linux/计算机视觉与生成式ai赋能的工作场所安全自动化监控.mdx` | 计算机视觉与生成式AI赋能的工作场所安全自动化监控 | 监控与告警 | [sre, computer-vision, generative-ai, aws, monitoring, incident-response] | observability |  | 中 | 关键词误伤嫌疑，需人工确认 |
| `src/pages/linux/诊断与处理-opentelemetry-http-中间件中的-superfluous-responsewriteheader-call-错误.mdx` | 诊断与处理 OpenTelemetry HTTP 中间件中的 'superfluous response.WriteHeader call' 错误 | 可观测性 | [prometheus, opentelemetry, http, go, middleware, logging, error, debugging] | observability |  | 高 |  |
| `src/pages/linux/身份管理平台的可观测性实践forgerock的prometheus之旅.mdx` | 身份管理平台的可观测性实践：ForgeRock的Prometheus之旅 | 监控与可观测性 | [prometheus, grafana, kubernetes, 可观测性, 身份管理, 可靠性工程] | observability |  | 高 |  |
| `src/pages/docker/配置文件中的尾随空格问题-grafana-docker.mdx` | 配置文件中的尾随空格问题 (Grafana Docker) | 配置管理 | [grafana, docker, configuration, ci-cd, devops] | observability |  | 高 |  |
| `src/pages/linux/采用-prometheus-operator-实现开发者驱动的监控.mdx` | 采用 Prometheus Operator 实现开发者驱动的监控 | Prometheus 与监控 | [Prometheus, Prometheus-Operator, Kubernetes, 可观测性, SLI/SLO, 开发者体验] | observability |  | 高 |  |
| `src/pages/linux/非开发人员如何参与-prometheus-贡献.mdx` | 非开发人员如何参与 Prometheus 贡献 | 社区参与与生态 | [社区贡献， Prometheus， 开源， 可观测性， UX] | observability |  | 高 |  |

### kubernetes

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/linux/containerd-1729-升级导致-cni-链式调用中接口可见性问题.mdx` | Containerd 1.7.29+ 升级导致 CNI 链式调用中接口可见性问题 | 容器网络与运行时 | [containerd, cni, sriov, bond, multus, 网络命名空间, regression] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/containerd-220-创建容器失败绝对符号链接路径安全检查.mdx` | Containerd 2.2.0 创建容器失败：绝对符号链接路径安全检查 | 容器运行时 | [containerd, go, symlinks, container-creation, security, regression] | kubernetes |  | 高 |  |
| `src/pages/runbooks/containerd-hyper-v-容器创建失败json-文档无效回归问题.mdx` | containerd Hyper-V 容器创建失败：JSON 文档无效回归问题 | 故障分析 | [containerd, Windows, Hyper-V, 回归测试, 容器创建失败, 故障分析] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/containerd-tar-提取中的-toctou-竞态条件修复.mdx` | containerd tar 提取中的 TOCTOU 竞态条件修复 | 容器安全 | [security, TOCTOU, race-condition, containerd, container-runtime] | kubernetes |  | 高 |  |
| `src/pages/linux/containerd-关闭时-boltdb-的显式关闭.mdx` | containerd 关闭时 BoltDB 的显式关闭 | 插件与扩展 | [containerd, BoltDB, Graceful Shutdown, SRE] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/containerd-在快照已存在时跳过层内容下载的问题.mdx` | containerd 在快照已存在时跳过层内容下载的问题 | 容器运行时 | [containerd, image-pull, snapshot, unpack, layered-storage] | kubernetes |  | 高 |  |
| `src/pages/linux/containerd-镜像仓库配置路径问题.mdx` | containerd 镜像仓库配置路径问题 | container-runtime | [containerd, crictl, registry, configuration, debugging] | kubernetes |  | 高 |  |
| `src/pages/linux/containerd-镜像标签大小限制导致-buildpacks-镜像无法启动.mdx` | Containerd 镜像标签大小限制导致 Buildpacks 镜像无法启动 | containerd | [containerd, buildpacks, OCI, image-labels, troubleshooting, reliability] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/containerd-shim-runc-v2-运行时配置传递缺陷问题.mdx` | containerd-shim-runc-v2 运行时配置传递缺陷问题 | 容器运行时 | [containerd, containerd-shim-runc-v2, runc, crun, CRI, runtime, configuration] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/containerd快照层残留问题.mdx` | Containerd快照层残留问题 | 容器运行时与编排 | [docker, containerd, snapshotter, overlayfs, storage-cleanup, disk-space] | kubernetes |  | 高 |  |
| `src/pages/linux/containerd镜像卷挂载失败erofs快照器兼容性问题.mdx` | containerd镜像卷挂载失败：erofs快照器兼容性问题 | SRE故障排查与调试 | [containerd, erofs, image-volume, snapshotter, kubernetes, pod, mount, debugging] | kubernetes |  | 高 |  |
| `src/pages/linux/go工作区go-work与containerd的genproto依赖冲突.mdx` | Go工作区（go work）与containerd的genproto依赖冲突 | 构建与依赖 | [go, containerd, 依赖管理, 构建问题, genproto, go.work] | kubernetes |  | 高 |  |
| `src/pages/linux/nri插件环境变量操作被静默忽略的问题-containerd-230-nri-v0120.mdx` | NRI插件环境变量操作被静默忽略的问题 (containerd 2.3.0, NRI v0.12.0) | containerd-issues | [containerd, nri, environment-variables, csi, bug] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/overlayfs-更新与-sre-应用.mdx` | OverlayFS 更新与 SRE 应用 | 存储与文件系统 | [overlayfs, union-filesystem, linux-kernel, composefs, storage] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/修复-containerd-传输插件中可选的-erofs-差异设置.mdx` | 修复 Containerd 传输插件中可选的 EROFS 差异设置 | 容器运行时 | [containerd, erofs, snapshotter, differ, container-runtime, reliability] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/修复-containerd-使用-ghcr-作为镜像仓库镜像时的认证-scope-错误.mdx` | 修复 Containerd 使用 GHCR 作为镜像仓库镜像时的认证 Scope 错误 | 容器运行时 | [containerd, container-registry, GHCR, mirror, authentication, bug] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/修复-containerd-固定镜像标签未应用的问题.mdx` | 修复 containerd 固定镜像标签未应用的问题 | 容器运行时 | [containerd, pinned-image, label, bug-fix, image-management] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/修复沙盒任务api在非runc运行时下的端点问题.mdx` | 修复沙盒任务API在非Runc运行时下的端点问题 | 容器运行时 | [containerd, container-runtime, sandbox, api-design, sre-reliability] | kubernetes |  | 高 |  |
| `src/pages/runbooks/处理shim无响应时的context-deadline-exceeded错误.mdx` | 处理Shim无响应时的Context Deadline Exceeded错误 | SRE实践 | [containerd, shim, ttrpc, 错误处理, 可靠性, 错误传播] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/容器运行时依赖升级与-go-版本兼容性以-containerd-为例.mdx` | 容器运行时依赖升级与 Go 版本兼容性：以 containerd 为例 | 容器与编排 | [containerd, go, dependency-management, compatibility, sre-practices] | kubernetes |  | 高 |  |
| `src/pages/linux/容器运行时快照泄漏containerd的overlayfs孤立快照问题.mdx` | 容器运行时快照泄漏：containerd的overlayfs孤立快照问题 | 容器运行时与存储 | [containerd, overlayfs, snapshot, storage-leak, SRE-troubleshooting] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/容器运行时性能退化containerd-shim-cpu时间加速增长问题.mdx` | 容器运行时性能退化：containerd-shim CPU时间加速增长问题 | 容器运行时 | [containerd, kubernetes, performance-degradation, cpu-leak, sre, observability] | kubernetes |  | 高 |  |
| `src/pages/kubernetes/诊断与解决-containerd-erofs-快照器-no-such-device-错误.mdx` | 诊断与解决 containerd erofs 快照器 'no such device' 错误 | 存储与文件系统 | ["containerd", "erofs", "overlay", "snapshotter", "kernel", "storage"] | kubernetes |  | 高 |  |

### linux

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/linux/apparmor-配置文件堆叠下的信号与ptrace规则修复.mdx` | AppArmor 配置文件堆叠下的信号与Ptrace规则修复 | 容器运行时安全 | [apparmor, containerd, security, profiling, csi, exec, kubernetes] | linux |  | 高 |  |
| `src/pages/linux/bpf循环验证与标量演化.mdx` | BPF循环验证与标量演化 | SRE知识库 | [BPF, 循环验证, 静态分析, 内核安全, 可观测性] | linux |  | 高 |  |
| `src/pages/linux/cgroup-v1-cpu-shares-到-v2-cpu-weight-的新转换公式.mdx` | cgroup v1 CPU Shares 到 v2 CPU Weight 的新转换公式 | SRE核心概念 | ["cgroup", "resource-management", "kubernetes", "cpu", "scheduling", "oci-runtime"] | linux |  | 高 |  |
| `src/pages/kubernetes/cgroup-命名空间的版本兼容性.mdx` | cgroup 命名空间的版本兼容性 | 容器运行时与编排 | [containerd, cgroups, testing, compatibility, linux] | linux |  | 高 |  |
| `src/pages/kubernetes/kubernetes-selinux-卷标签变更与升级指南.mdx` | Kubernetes SELinux 卷标签变更与升级指南 | 存储与卷 | [Kubernetes, SELinux, SELinuxMount, 存储, 安全, 升级, 可靠性] | linux |  | 高 |  |
| `src/pages/linux/linux内核中的多尺寸透明大页自动创建.mdx` | Linux内核中的多尺寸透明大页自动创建 | 操作系统内核 | [内存管理, 性能优化, Linux内核, 大页] | linux |  | 高 |  |
| `src/pages/runbooks/lwnnet-2026年6月第2周内核技术要点与sre实践关联.mdx` | LWN.net 2026年6月第2周：内核技术要点与SRE实践关联 | SRE实践 | [Linux内核, 系统调用, BPF, 安全, 性能, 文件系统事件] | linux |  | 高 |  |

### docker

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/kubernetes/docker-gordon容器工作流的-ai-代理.mdx` | Docker Gordon：容器工作流的 AI 代理 | 容器化与编排 | [docker, ai, agent, container, sre, devops, automation, debugging] | docker |  | 高 |  |
| `src/pages/incidents/缓解docker引擎中的cve-2026-31431copy-fail漏洞.mdx` | 缓解Docker引擎中的CVE-2026-31431（“Copy Fail”）漏洞 | 漏洞缓解 | [CVE-2026-31431, Docker, 安全漏洞, 内核安全, 容器安全] | docker |  | 高 |  |
| `src/pages/kubernetes/通过-docker-hardened-images-和-aikido-集成优化漏洞扫描.mdx` | 通过 Docker Hardened Images 和 Aikido 集成优化漏洞扫描 | 容器安全 | [docker, hardened-images, vulnerability-scanning, vex, sre, container-security, sbom] | docker |  | 高 |  |

### 存疑

#### etcd

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/linux/etcd-370-beta0-版本发布要点.mdx` | etcd 3.7.0-beta.0 版本发布要点 | 基础设施与组件 | ["etcd", "kubernetes", "分布式存储", "版本发布", "升级"] | 存疑 | etcd | 中 |  |
| `src/pages/linux/etcd-grpcproxy-watcher-丢失事件的可靠性缺陷.mdx` | etcd grpcproxy Watcher 丢失事件的可靠性缺陷 | SRE/数据库与存储 | [etcd, grpcproxy, reliability, watch, distributed-systems] | 存疑 | etcd | 中 |  |
| `src/pages/linux/etcd-leader切换期间-lease-keepalive-返回-not-a-primary-lessor-错误.mdx` | etcd Leader切换期间 lease keepalive 返回 'not a primary lessor' 错误 | 分布式系统故障 | [etcd, gRPC, 错误处理, leader-election, lease, 可靠性] | 存疑 | etcd | 中 |  |
| `src/pages/linux/etcd-learner-节点加入时的-raft-日志索引不匹配-panic.mdx` | etcd Learner 节点加入时的 Raft 日志索引不匹配 Panic | SRE | [etcd, raft, cluster-management, panic, learner, member-recovery] | 存疑 | etcd | 中 |  |
| `src/pages/linux/etcd-learner成员接收快照后被意外移除的问题分析.mdx` | etcd Learner成员接收快照后被意外移除的问题分析 | etcd-集群管理 | [etcd, cluster-management, bug-analysis, learner-members, raft] | 存疑 | etcd | 中 |  |
| `src/pages/linux/etcd-learner成员无法碎片整理导致存储膨胀.mdx` | ETCD Learner成员无法碎片整理导致存储膨胀 | 分布式系统故障 | [etcd, defragmentation, learner, storage, reliability] | 存疑 | etcd | 中 |  |
| `src/pages/linux/etcd-maintenancestatus-权限回归问题-cve-2026-33413-修复后.mdx` | etcd Maintenance.Status 权限回归问题 (CVE-2026-33413 修复后) | 故障与问题处理 | [etcd, 权限, RBAC, 可观测性, 健康检查] | 存疑 | etcd | 中 |  |
| `src/pages/kubernetes/etcd-memberupdate-操作导致-learner-成员状态丢失.mdx` | etcd MemberUpdate 操作导致 learner 成员状态丢失 | etcd | [etcd, reliability, configuration-management, bug, learner] | 存疑 | etcd | 中 |  |
| `src/pages/runbooks/etcd-panic-page-xxx-already-freed-数据不一致问题.mdx` | etcd Panic: 'page xxx already freed' 数据不一致问题 | 故障分析 | [etcd, bbolt, 数据一致性, panic, 故障恢复, SRE] | 存疑 | etcd | 中 |  |
| `src/pages/kubernetes/etcd-v37-客户端连接阻塞行为变更.mdx` | Etcd v3.7 客户端连接阻塞行为变更 | etcd | [etcd, SRE, clientv3, DialTimeout, gRPC, high-availability] | 存疑 | etcd | 中 |  |
| `src/pages/linux/etcd-websocket-认证令牌失效.mdx` | etcd WebSocket 认证令牌失效 | SRE | [etcd, websocket, authentication, grpc, kubernetes, observability] | 存疑 | etcd | 中 |  |
| `src/pages/kubernetes/etcd-健壮性测试中的线性化验证内存溢出问题.mdx` | etcd 健壮性测试中的线性化验证内存溢出问题 | etcd | [etcd, robustness-testing, linearization, oom, memory-management] | 存疑 | etcd | 中 |  |
| `src/pages/runbooks/etcd-内存管理事件复用与高密度工作负载下的性能回归.mdx` | etcd 内存管理：事件复用与高密度工作负载下的性能回归 | SRE实践 | [etcd, 内存管理, 性能回归, kubernetes, 容量规划] | 存疑 | etcd | 中 |  |
| `src/pages/linux/etcd-客户端与服务器版本不兼容导致事务操作静默失败.mdx` | etcd 客户端与服务器版本不兼容导致事务操作静默失败 | 分布式系统 | [etcd, 版本兼容性, 事务, 静默失败, 数据完整性] | 存疑 | etcd | 中 |  |
| `src/pages/linux/etcd-快照同步失败问题分析.mdx` | etcd 快照同步失败问题分析 | etcd-cluster | ["etcd", "snapshot", "cluster-sync", "sre-troubleshooting"] | 存疑 | etcd | 中 |  |
| `src/pages/kubernetes/etcd-认证模式下的成员提升请求转发失败.mdx` | etcd 认证模式下的成员提升请求转发失败 | etcd | [etcd, 认证, 集群管理, SRE故障, 转发机制] | 存疑 | etcd | 中 |  |
| `src/pages/linux/etcd事务中范围请求的revision参数引发数据不一致.mdx` | etcd事务中范围请求的revision参数引发数据不一致 | 分布式系统与共识协议 | [etcd, 数据一致性, MVCC, 事务, 分布式系统, SRE] | 存疑 | etcd | 中 |  |
| `src/pages/linux/etcd启动校验错误consistent-index-与-snapshot-index-不一致.mdx` | etcd启动校验错误：consistent_index 与 snapshot_index 不一致 | data-consistency | [etcd, data-consistency, troubleshooting, crash-recovery] | 存疑 | etcd | 中 |  |
| `src/pages/linux/事务处理中的死锁防护与资源释放.mdx` | 事务处理中的死锁防护与资源释放 | 故障诊断与恢复 | [deadlock, panic, etcd, 事务, 资源泄漏, 并发] | 存疑 | etcd | 中 |  |
| `src/pages/linux/使用-etcd-实现自定义服务发现.mdx` | 使用 etcd 实现自定义服务发现 | 服务发现与目标管理 | [etcd, Prometheus, 服务发现, 文件服务发现, 自定义集成] | 存疑 | etcd | 中 |  |
| `src/pages/kubernetes/避免在升级至-etcd-v36-时产生僵尸集群成员.mdx` | 避免在升级至 etcd v3.6 时产生僵尸集群成员 | etcd | [etcd, upgrade, zombie-members, v2store, v3store, data-consistency] | 存疑 | etcd | 中 |  |

#### terraform-iac

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/linux/hcp-packer-强制配置器-enforced-provisioners.mdx` | HCP Packer 强制配置器 (Enforced Provisioners) | Infrastructure as Code (IaC) 和 镜像管理 | [packer, image-governance, compliance, security, golden-image, infrastructure-standardization] | 存疑 | terraform-iac | 中 |  |
| `src/pages/linux/hcp-terraform-与-infragraph统一混合多云基础设施可见性.mdx` | HCP Terraform 与 Infragraph：统一混合多云基础设施可见性 | 可观测性与可见性 | [infragraph, terraform, 可见性, 知识图谱, 多云, 平台工程, sre] | 存疑 | terraform-iac | 中 |  |
| `src/pages/linux/hcp-terraform-项目级-run-tasks扩展治理与一致性.mdx` | HCP Terraform 项目级 Run Tasks：扩展治理与一致性 | 基础设施即代码 | [terraform, HCP, 治理, 一致性, run-tasks, projects] | 存疑 | terraform-iac | 中 |  |
| `src/pages/linux/terraform-115-新特性动态模块源弃用管理与可靠性增强.mdx` | Terraform 1.15 新特性：动态模块源、弃用管理与可靠性增强 | IaC | [terraform, iac, reliability, module-management, best-practices] | 存疑 | terraform-iac | 中 |  |
| `src/pages/runbooks/terraform-enterprise-20-核心特性与演进.mdx` | Terraform Enterprise 2.0 核心特性与演进 | SRE 工具与平台 | [terraform, terraform-enterprise, infrastructure-as-code, orchestration, idp, security, ops-visibility, stacks] | 存疑 | terraform-iac | 中 |  |
| `src/pages/linux/terraform-hcp-企业版关键功能更新成本可见性治理与安全增强.mdx` | Terraform HCP 企业版关键功能更新：成本可见性、治理与安全增强 | Terraform | [成本优化, 治理, 安全, 可观测性, HCP Terraform, Terraform Enterprise, 项目] | 存疑 | terraform-iac | 中 |  |
| `src/pages/linux/terraform-mcp-serverai赋能的基础设施即代码助手.mdx` | Terraform MCP Server：AI赋能的基础设施即代码助手 | SRE工具 | [IaC, Terraform, AI, Automation, MCP, HCP-Terraform, Terraform-Enterprise] | 存疑 | terraform-iac | 中 |  |

#### chaos-mesh

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/linux/chaos-mesh-20迈向混沌工程生态.mdx` | Chaos Mesh 2.0：迈向混沌工程生态 | Chaos Engineering | [chaos-engineering, chaos-mesh, fault-injection, resilience-testing, workflow] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/chaos-mesh-与混沌即服务caas演进.mdx` | Chaos Mesh 与混沌即服务（CaaS）演进 | 混沌工程 | [混沌工程, chaos-mesh, SRE, 可观测性, Kubernetes, 故障注入] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/chaos-mesh-助力-apache-apisix-提升系统稳定性.mdx` | Chaos Mesh 助力 Apache APISIX 提升系统稳定性 | 混沌工程 | [Chaos Mesh, Apache APISIX, 混沌工程, API网关, 系统稳定性, 故障注入] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/runbooks/chaos-mesh-实践问答.mdx` | Chaos Mesh 实践问答 | SRE实践 | [混沌工程, Kubernetes, 可靠性工程, SRE实践, 故障注入] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/chaos-mesh-简介与-hacktoberfest-参与指南.mdx` | Chaos Mesh 简介与 Hacktoberfest 参与指南 | Chaos Engineering | [chaos-engineering, kubernetes, open-source, sre, resilience-testing] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/chaos-mesh与混沌工程实践.mdx` | Chaos Mesh与混沌工程实践 | 混沌工程 | [ChaosMesh, 混沌工程, 故障注入, CNCF] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/chaos-meshkubernetes上的混沌工程平台.mdx` | Chaos Mesh：Kubernetes上的混沌工程平台 | 混沌工程 | [chaos-engineering, kubernetes, cncf, site-reliability-engineering, chaos-mesh] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/chaos-mesh云原生混沌工程实践与常见问题解答.mdx` | Chaos Mesh：云原生混沌工程实践与常见问题解答 | 混沌工程 | [混沌工程, Chaos Mesh, Kubernetes, 故障注入, 可靠性工程] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/kubernetes混沌工程实践chaos-mesh原理与控制平面开发.mdx` | Kubernetes混沌工程实践：Chaos Mesh原理与控制平面开发 | 混沌工程 | [chaos-engineering, kubernetes, chaos-mesh, sre, reliability, resilience-testing] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/在-kubesphere-上部署与使用-chaos-mesh.mdx` | 在 KubeSphere 上部署与使用 Chaos Mesh | 混沌工程 | [chaos-engineering, kubesphere, kubernetes, resilience-testing] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/在物理机器上运行混沌实验chaosd实践指南.mdx` | 在物理机器上运行混沌实验：chaosd实践指南 | 混沌工程 | [chaosd, chaos-mesh, 混沌工程, 物理机, 故障注入, 可靠性测试] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/在运行时模拟-i-o-故障.mdx` | 在运行时模拟 I/O 故障 | 混沌工程与故障注入 | [混沌工程, ChaosFS, ptrace, I/O故障, 故障注入, Chaos Mesh] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/庆祝-chaos-mesh-一周年回顾与展望.mdx` | 庆祝 Chaos Mesh 一周年：回顾与展望 | 混沌工程 | [混沌工程, 故障注入, CNCF, 可观测性, SRE实践] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/开源贡献与lfx-mentorship项目实践.mdx` | 开源贡献与LFX Mentorship项目实践 | 社区与职业发展 | [lfx-mentorship, chaos-mesh, aws-chaos, 开源贡献, 社区参与] | 存疑 | chaos-mesh | 中 |  |
| `src/pages/linux/混沌工程与devops结合实践游戏服务可靠性提升.mdx` | 混沌工程与DevOps结合实践：游戏服务可靠性提升 | 混沌工程 | [混沌工程, DevOps, 故障注入, 微服务, Chaos Mesh, Kubernetes, SRE, 可靠性] | 存疑 | chaos-mesh | 中 |  |

#### kubernetes-platform

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/kubernetes/cluster-api-v112-原地更新与链式升级.mdx` | Cluster API v1.12: 原地更新与链式升级 | 容器编排 | [cluster-api, kubernetes, lifecycle-management, upgrade, reliability] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/consul-20-新特性提升服务网格的灵活性控制与可扩展性.mdx` | Consul 2.0 新特性：提升服务网格的灵活性、控制与可扩展性 | SRE 知识库 | [consul, service-mesh, kubernetes, mtls, scaling] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/cri镜像拉取超时修复空闲转活跃计时器重置.mdx` | CRI镜像拉取超时修复：空闲转活跃计时器重置 | 故障修复 | [containerd, CRI, 超时, 故障修复, 计时器管理] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/csi卷重建的全局挂载回退机制.mdx` | CSI卷重建的全局挂载回退机制 | 存储与卷管理 | [CSI, 卷管理, 全局挂载, 卷重建, kubelet, 存储可靠性] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/kubernetes/gateway-api-v15将实验性功能升级为稳定版.mdx` | Gateway API v1.5：将实验性功能升级为稳定版 | API 与流量管理 | [gateway-api, kubernetes, sre, networking, traffic-management, standardization] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/runbooks/git-sync-权限问题仪表板创建者无法访问自己创建的仪表板.mdx` | Git-sync 权限问题：仪表板创建者无法访问自己创建的仪表板 | 问题排查 | [git-sync, permissions, grafana, dashboard, 403-error, kubernetes] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/kubernetes/gvisor-gofer-根文件系统绑定挂载在符号链接路径下的失败.mdx` | gVisor gofer 根文件系统绑定挂载在符号链接路径下的失败 | 容器运行时 | [gvisor, containerd, symlink, rootfs, gofer, sandbox] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/hashicorp-vault-secrets-operator-vso-kubernetes原生秘密管理指南.mdx` | HashiCorp Vault Secrets Operator (VSO) Kubernetes原生秘密管理指南 | secrets-management | [vault, kubernetes, secrets-management, vso, operator, sre, etcd, csi, automation] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/linux/headlamp-kubernetes-web-ui-的演进与-sre-实践.mdx` | Headlamp: Kubernetes Web UI 的演进与 SRE 实践 | 可观测性与工具 | [Headlamp, Kubernetes, UI, 可观测性, 多集群, 插件, 可观测性, Kubernetes管理, SRE工具] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/ingress-nginx-迁移至-gateway-api五个关键意外行为.mdx` | Ingress-NGINX 迁移至 Gateway API：五个关键意外行为 | 网络与负载均衡 | [ingress, nginx, gateway-api, migration, kubernetes, networking] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/kubernetes/ingress2gateway-1-0-migration-guide.mdx` | ingress2gateway-1-0-migration-guide | Kubernetes | [ingress2gateway, gateway-api, migration, ingress-nginx, kubernetes-networking, sre-tooling] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/runbooks/kubelet-配置-drop-in-目录功能-ga.mdx` | Kubelet 配置 Drop-in 目录功能 GA | SRE 实践 | [Kubernetes, Configuration-Management, Kubelet, SRE, Best-Practices] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/incidents/kubernetes-135-kuberc-凭证插件策略与允许列表.mdx` | Kubernetes 1.35 kuberc 凭证插件策略与允许列表 | 安全与访问控制 | [Kubernetes, kubectl, kuberc, 安全, exec-plugin, kubeconfig] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/runbooks/kubernetes-api-治理.mdx` | Kubernetes API 治理 | SRE实践 | [kubernetes, api-governance, sig-architecture, reliability, stability] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-checkpoint-restore-集成原理与用例.mdx` | Kubernetes Checkpoint/Restore 集成：原理与用例 | 容器与编排 | [Kubernetes, CRIU, Checkpoint, Restore, SRE, Reliability, Resource-Optimization] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-mixed-version-proxy-mvp-beta-增强集群升级可靠性.mdx` | Kubernetes Mixed Version Proxy (MVP) Beta: 增强集群升级可靠性 | 集群管理 | [Kubernetes, API Server, High Availability, Upgrade, Proxy, SRE] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/linux/kubernetes-pod-内多容器重启阻塞问题.mdx` | Kubernetes Pod 内多容器重启阻塞问题 | 故障模式 | [kubernetes, pod, container-restart, liveness-probe, bug, lifecycle] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/linux/kubernetes-pod-内存压力测试使用-chaos-mesh-的-stresschaos.mdx` | Kubernetes Pod 内存压力测试：使用 Chaos Mesh 的 StressChaos | 故障注入 | [chaos-engineering, kubernetes, memory-stress-testing, stresschaos, cgroup] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-service-externalips-的弃用与移除.mdx` | Kubernetes Service ExternalIPs 的弃用与移除 | 服务与网络 | [kubernetes, service, security, deprecation, networking, migration] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-v135-工作负载感知调度.mdx` | Kubernetes v1.35 工作负载感知调度 | Scheduling | [kubernetes, scheduling, workload, gang-scheduling, ai, ml, sre] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/runbooks/kubernetes-v135-基于-watch-的-ccm-路由协调机制.mdx` | Kubernetes v1.35: 基于 Watch 的 CCM 路由协调机制 | SRE实践 | [Kubernetes, CCM, Reliability, Performance] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/docker/kubernetes-v136-haru-发布概览与sre实践指南.mdx` | Kubernetes v1.36 (Haru) 发布概览与SRE实践指南 | 平台与基础设施 | [kubernetes, release, sre, reliability, security, observability, dra, storage] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-v136-dra更新详解.mdx` | Kubernetes v1.36 DRA更新详解 | DRA | [Kubernetes, DRA, Dynamic-Resource-Allocation, 动态资源分配, GPU, 调度] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-v136-pod-level-resource-managers-alpha.mdx` | Kubernetes v1.36 Pod-Level Resource Managers (Alpha) | workload-management | [kubernetes, sre, performance, resources, alpha] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/docker/kubernetes-v136-版本关键变更与特性前瞻.mdx` | Kubernetes v1.36 版本关键变更与特性前瞻 | 平台与基础设施 | [kubernetes, upgrade, deprecation, security, DRA, SELinux, serviceaccount] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/linux/kubernetes-v136-压力停滞信息-psi-指标正式发布-ga.mdx` | Kubernetes v1.36: 压力停滞信息 (PSI) 指标正式发布 (GA) | 可观测性与监控 | [psi, kubernetes, monitoring, sre, observability, node-health, cgroups, cadvisor] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-v136-工作负载感知调度workload-aware-scheduling进阶.mdx` | Kubernetes v1.36: 工作负载感知调度（Workload-Aware Scheduling）进阶 | workload-scheduling | [kubernetes, scheduling, ai-ml, batch, gang-scheduling, podgroup, topology, preemption, dra] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/runbooks/kubernetes-v136pod级资源原地垂直扩展-beta.mdx` | Kubernetes v1.36：Pod级资源原地垂直扩展 (Beta) | SRE最佳实践 | [Kubernetes, 容器, 可靠性, 自动扩展, 资源管理, 云原生] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-v136基于-qos-类别的分层内存保护.mdx` | Kubernetes v1.36：基于 QoS 类别的分层内存保护 | 容器与编排 | [kubernetes, cgroup-v2, memory-qos, sre, reliability] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/linux/kubernetes-webhook-连接缓存与负载均衡优化.mdx` | Kubernetes Webhook 连接缓存与负载均衡优化 | 可靠性工程 | [kubernetes, webhook, load-balancing, reliability, slo] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-卷组快照功能达到-ga-状态.mdx` | Kubernetes 卷组快照功能达到 GA 状态 | storage | [kubernetes, storage, snapshot, csi, data-protection] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-声明式验证-ga.mdx` | Kubernetes 声明式验证 (GA) | Kubernetes | [kubernetes, api, validation, sre, sre-implementation, technical-debt] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-扩展容忍操作符数字比较.mdx` | Kubernetes 扩展容忍操作符（数字比较） | 调度与编排 | [kubernetes, scheduling, taints, tolerations, SLA, alpha-feature] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-服务端分片列表与监视server-side-sharded-list-and-watch.mdx` | Kubernetes 服务端分片列表与监视（Server-Side Sharded List and Watch） | 集群扩展与性能优化 | [kubernetes, sharding, watch, performance, scalability, alpha-feature] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-用户命名空间-user-namespaces-ga.mdx` | Kubernetes 用户命名空间 (User Namespaces) GA | 容器安全 | [kubernetes, security, user-namespaces, rootless, sre, pod-security] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes-结构化-z-pages-调试接口增强.mdx` | Kubernetes 结构化 z-pages 调试接口增强 | Kubernetes | [kubernetes, debugging, observability, sre, control-plane, api] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/runbooks/kubernetes-镜像推广器的现代化重写.mdx` | Kubernetes 镜像推广器的现代化重写 | SRE实践 | [Kubernetes, kpromo, 可靠性, 重写, GitOps, 安全供应链] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/kubernetes细粒度supplementalgroups控制ga.mdx` | Kubernetes细粒度supplementalGroups控制（GA） | 容器安全 | [kubernetes, security, pod-security, supplemental-groups, linux, sre, cri] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/docker/litholens-平台基于机器学习的自动化岩心录井云架构实践.mdx` | LITHOLENS™ 平台：基于机器学习的自动化岩心录井云架构实践 | 云原生架构 | [机器学习, ML, EKS, Kubernetes, 计算机视觉, 云架构, SRE, 成本优化, 自动化, 地质工程] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/kubernetes/nri-插件在-runpodsandbox-钩子失败时导致的资源泄漏.mdx` | NRI 插件在 RunPodSandbox 钩子失败时导致的资源泄漏 | 容器运行时 | [containerd, NRI, resource-leak, sandbox, shim] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/kubernetes/podsandbox-taskexit-事件的空值检查.mdx` | Podsandbox TaskExit 事件的空值检查 | 容器运行时 | [containerd, pod-sandbox, oom, nil-pointer, panic, stability] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/kubernetes/sandbox-服务字段转发修复与事件主题规范.mdx` | Sandbox 服务字段转发修复与事件主题规范 | 容器运行时 | [containerd, sandbox, gRPC, event-system, bugfix, reliability] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/kubernetes/sandbox控制器服务的字段转发与事件主题修复.mdx` | Sandbox控制器服务的字段转发与事件主题修复 | 容器运行时与编排 | [sandbox, grpc, bug-fix, containerd, event-driven] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/runbooks/sre视角下的孟买从达巴瓦拉到云原生基础设施.mdx` | SRE视角下的孟买：从达巴瓦拉到云原生基础设施 | SRE文化与实践 | [sre, reliability, culture, kubernetes, cloud-native, observability] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/kubernetes/不可删除的准入策略kubernetes-v136-静态清单准入控制.mdx` | 不可删除的准入策略：Kubernetes v1.36 静态清单准入控制 | 集群安全与治理 | [Kubernetes, 准入控制, ValidatingAdmissionPolicy, CEL, 集群引导, 安全策略] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/从-kubernetes-dashboard-到-headlamp理解与迁移指南.mdx` | 从 Kubernetes Dashboard 到 Headlamp：理解与迁移指南 | Kubernetes 工具与生态 | [kubernetes, dashboard, headlamp, migration, sre, multi-cluster, gitops] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/docker/使用-amazon-eks-与-vcluster-优化-kubernetes-测试环境配置.mdx` | 使用 Amazon EKS 与 vCluster 优化 Kubernetes 测试环境配置 | 环境与配置管理 | [SRE, Amazon EKS, vCluster, 环境配置, 测试环境, 成本优化, 平台工程] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/使用-clientcmd-统一-kubernetes-api-访问.mdx` | 使用 clientcmd 统一 Kubernetes API 访问 | Kubernetes 客户端开发 | [kubernetes, kubectl, client-go, clientcmd, cli, kubeconfig, SRE, 可观测性] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/修复-criu-检查点操作因-io-uring-使用而失败.mdx` | 修复 CRIU 检查点操作因 io_uring 使用而失败 | 容器运行时与编排 | [containerd, CRIU, checkpoint-restore, io_uring, container-migration, Linux-kernel] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/修复容器退出事件丢失问题.mdx` | 修复容器退出事件丢失问题 | containerd | [containerd, 事件处理, CRI, 容器退出, 可靠性, 事件丢失, 状态同步] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/修复容器退出事件丢失问题-container-exit-event-loss.mdx` | 修复容器退出事件丢失问题 (Container Exit Event Loss) | 容器与运行时 | [containerd, container, reliability, event-handling, restart] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/修复混合快照器环境下的镜像解包失败.mdx` | 修复混合快照器环境下的镜像解包失败 | 故障排查与修复 | [containerd, CRI, snapshotters, image-pull, unpacking, reliability] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/可变持久卷节点亲和性kubernetes-v135.mdx` | 可变持久卷节点亲和性（Kubernetes v1.35） | SRE 核心概念 | [kubernetes, persistent-volume, node-affinity, storage, sre] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/可变挂起job的pod资源-v136-beta.mdx` | 可变挂起Job的Pod资源 (v1.36 Beta) | Kubernetes 核心特性 | [kubernetes, job, suspend, resources, batch, scheduling] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/处理windows平台上的文件共享冲突.mdx` | 处理Windows平台上的文件共享冲突 | 故障处理 | [windows, file-locking, race-condition, retry-pattern, containerd] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/incidents/多kubernetes集群密钥管理与同步.mdx` | 多Kubernetes集群密钥管理与同步 | 机密管理 | [external-secrets-operator, kubernetes-secrets, secret-management, multi-cluster, aws-eks, bitwarden-secrets-manager, sre-practices] | 存疑 | kubernetes-platform | 中 |  |
| `src/pages/kubernetes/容器沙盒镜像引用格式错误导致-pod-无法启动.mdx` | 容器沙盒镜像引用格式错误导致 Pod 无法启动 | 容器运行时 | [containerd, cri, sandbox, pod, kubernetes, reliability, bug] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/kubernetes/容器运行时任务状态查询的健壮性修复.mdx` | 容器运行时任务状态查询的健壮性修复 | 容器运行时与编排 | [containerd, 任务管理, 错误处理, 可靠性] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/容器运行时镜像导入与cri插件可见性问题.mdx` | 容器运行时镜像导入与CRI插件可见性问题 | SRE技术知识库 | [containerd, CRI, ctr, crictl, 镜像管理] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/并行解包下的父层查找修复元数据层.mdx` | 并行解包下的父层查找修复（元数据层） | 可靠性与故障处理 | [containerd, 镜像, 快照器, 元数据, 并发] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/镜像拉取超时误报的规避.mdx` | 镜像拉取超时误报的规避 | 容器运行时与镜像管理 | [containerd, CRI, 镜像拉取, 可靠性, 超时] | 存疑 | kubernetes-platform | 低 |  |
| `src/pages/linux/集成测试中的竞态条件修复等待-finalizer-完成.mdx` | 集成测试中的竞态条件修复：等待 Finalizer 完成 | 测试与CI | [finalizer, kubernetes, testing, race-condition, ci-cd, grafana] | 存疑 | kubernetes-platform | 低 |  |

#### security

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/incidents/ai时代的零信任防御自动化攻击的sre安全框架.mdx` | AI时代的零信任：防御自动化攻击的SRE安全框架 | 安全与合规 | [zero-trust, security, automation, secrets-management, sre, vault, vault-radar] | 存疑 | security | 中 |  |
| `src/pages/linux/api数据源uid不匹配的安全处理.mdx` | API数据源UID不匹配的安全处理 | grafana/grafana | [API安全, 错误处理, 数据源管理, 防御性编程, 向后兼容] | 存疑 | security | 中 |  |
| `src/pages/incidents/arch用户仓库aur供应链攻击事件分析与响应.mdx` | Arch用户仓库(AUR)供应链攻击事件分析与响应 | security | [security, incident-response, supply-chain, arch-linux] | 存疑 | security | 低 |  |
| `src/pages/docker/aws-organizations-单组织与多组织架构选择指南.mdx` | AWS Organizations: 单组织与多组织架构选择指南 | multi-account-strategy | [aws-organizations, multi-account, governance, cloud-strategy, security, compliance] | 存疑 | security | 低 |  |
| `src/pages/linux/azure-hub-and-spoke-网络模型与-hcp-vault-dedicated-的集成.mdx` | Azure Hub-and-Spoke 网络模型与 HCP Vault Dedicated 的集成 | Cloud Infrastructure & Networking | [azure, hcp-vault, networking, security, hub-and-spoke, hvn, private-link] | 存疑 | security | 低 |  |
| `src/pages/docker/cilium-ci-cd-依赖安全实践.mdx` | Cilium CI/CD 依赖安全实践 | CI/CD 安全 | [依赖安全, 供应链安全, GitHub Actions, CI/CD, Go Modules, Renovate, 静态分析] | 存疑 | security | 中 |  |
| `src/pages/linux/cve-2025-30204-golang-jwt-jwt-库拒绝服务漏洞.mdx` | CVE-2025-30204: golang-jwt/jwt 库拒绝服务漏洞 | 依赖管理 | [CVE, 依赖安全, JWT, Go, Grafana, 拒绝服务] | 存疑 | security | 中 |  |
| `src/pages/linux/go堆中非法指针导致程序崩溃32位架构.mdx` | Go堆中非法指针导致程序崩溃（32位架构） | 应用故障分析 | [Go, 垃圾回收, 内存安全, 32位架构, SRE, 故障分析] | 存疑 | security | 低 |  |
| `src/pages/linux/hashicorp-vault-中的-scim标准化身份配置.mdx` | HashiCorp Vault 中的 SCIM：标准化身份配置 | 平台与集成 | [SCIM, Vault, 身份管理, IAM, 企业安全] | 存疑 | security | 低 |  |
| `src/pages/docker/homebrew-600-发布与关键更新.mdx` | Homebrew 6.0.0 发布与关键更新 | Software Packaging | [homebrew, package-management, macos, linux, supply-chain-security] | 存疑 | security | 低 |  |
| `src/pages/kubernetes/ingress-nginx-即将退役迁移指南与安全影响.mdx` | Ingress NGINX 即将退役：迁移指南与安全影响 | Kubernetes 网络 | [ingress-nginx, kubernetes, gateway-api, security, migration, networking] | 存疑 | security | 中 |  |
| `src/pages/incidents/linux发行版安全更新周报.mdx` | Linux发行版安全更新周报 | 安全与合规 | [security, patch-management, vulnerability-management, compliance, linux-distributions] | 存疑 | security | 中 |  |
| `src/pages/incidents/linux发行版安全更新跟踪2026-06-11.mdx` | Linux发行版安全更新跟踪（2026-06-11） | 事件响应与维护 | [security-update, patch-management, linux-distro, vulnerability, operational-risk] | 存疑 | security | 中 |  |
| `src/pages/incidents/spiffe-与非人类身份安全.mdx` | SPIFFE 与非人类身份安全 | 身份与访问管理 | [SPIFFE, SPIRE, 零信任, 身份, 非人类身份, 工作负载, AI代理] | 存疑 | security | 中 |  |
| `src/pages/incidents/云原生身份与访问管理-iam.mdx` | 云原生身份与访问管理 (IAM) | 安全与合规 | [IAM, 安全, 零信任, SPIFFE, 身份验证, 授权, 云原生] | 存疑 | security | 低 |  |
| `src/pages/linux/使用-chaos-mesh-的限制授权功能保护租户命名空间.mdx` | 使用 Chaos Mesh 的限制授权功能保护租户命名空间 | 混沌工程 | [Chaos Mesh, 多租户, 安全, 命名空间, RBAC, 准入控制器] | 存疑 | security | 低 |  |
| `src/pages/incidents/使用可信发布消除长期凭证.mdx` | 使用可信发布消除长期凭证 | 身份与访问管理 | [supply-chain-security, authentication, credential-management, OIDC, pip, npm, package-registry] | 存疑 | security | 低 |  |
| `src/pages/incidents/勒索软件命名与供应链安全.mdx` | 勒索软件命名与供应链安全 | 安全 | [supply-chain-security, ransomware, incident-response, best-practice] | 存疑 | security | 中 |  |
| `src/pages/linux/多发行版安全更新管理.mdx` | 多发行版安全更新管理 | 系统维护与更新 | [security, patching, linux, almaLinux, debian, fedora, redHat, suse, ubuntu, sre-practice] | 存疑 | security | 中 |  |
| `src/pages/incidents/容器加固镜像最小化攻击面与供应链安全.mdx` | 容器加固镜像：最小化攻击面与供应链安全 | 安全与合规 | [容器安全, 镜像, SBOM, SLSA, DevSecOps] | 存疑 | security | 中 |  |
| `src/pages/linux/无法通过符号链接指定设备容器化环境中的安全隐患.mdx` | 无法通过符号链接指定设备：容器化环境中的安全隐患 | 容器运行时与设备管理 | [containerd, 设备管理, udev, 符号链接, 安全, 容器运行时] | 存疑 | security | 中 |  |
| `src/pages/linux/联系点设置数据脱敏的大小写不敏感逻辑.mdx` | 联系点设置数据脱敏的大小写不敏感逻辑 | Alerting & Incident Response | [grafana, alerting, data-redaction, case-insensitivity, contact-points, security] | 存疑 | security | 低 |  |
| `src/pages/incidents/软件供应链安全.mdx` | 软件供应链安全 | 安全 | [supply-chain-security, sbom, slsa, container-security, incident-response, reliability] | 存疑 | security | 中 |  |
| `src/pages/incidents/软件供应链安全最佳实践.mdx` | 软件供应链安全最佳实践 | 安全 | [container-security, SBOM, SLSA, supply-chain-security, vulnerability-management] | 存疑 | security | 中 |  |
| `src/pages/docker/通过访问控制加固开源项目-ci-cd-安全.mdx` | 通过访问控制加固开源项目 CI/CD 安全 | CI/CD安全与供应链 | ["CI/CD", "供应链安全", "GitHub Actions", "访问控制", "Cilium"] | 存疑 | security | 中 |  |

#### ai

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/incidents/agentic-ai时代的基础设施访问控制.mdx` | Agentic AI时代的基础设施访问控制 | 安全与访问控制 | [agentic-ai, zero-trust, jit-access, boundary, vault, iam, session-recording] | 存疑 | ai | 低 |  |
| `src/pages/architectures/ai治理框架原则与sre最佳实践.mdx` | AI治理：框架、原则与SRE最佳实践 | 治理与流程 | [ai-governance, reliability-engineering, risk-management, compliance, agentic-ai, sdlc, observability] | 存疑 | ai | 低 |  |
| `src/pages/incidents/hashicorp-vault-中的-ai-代理原生支持.mdx` | HashiCorp Vault 中的 AI 代理原生支持 | 身份与访问管理 | [ai-agents, vault, iam, security, ephemeral-authorization] | 存疑 | ai | 中 |  |
| `src/pages/architectures/k6-20发布ai辅助测试与扩展更新.mdx` | k6 2.0发布：AI辅助测试与扩展更新 | 性能测试与可靠性 | [k6, 性能测试, AI, 测试自动化, 可靠性工程, 浏览器测试, 扩展] | 存疑 | ai | 低 |  |
| `src/pages/linux/从实验到规模化构建ai运营模式.mdx` | 从实验到规模化：构建AI运营模式 | AI与SRE | [AI, 运营模式, 自动化, 治理, 混合云, SRE实践] | 存疑 | ai | 低 |  |
| `src/pages/architectures/优化生成式ai视频推理异步帧生成流水线.mdx` | 优化生成式AI视频推理：异步帧生成流水线 | 性能与优化 | [GPU优化, 推理性能, 生成式AI, EC2 G7e, 异步处理, 成本优化] | 存疑 | ai | 中 |  |
| `src/pages/architectures/使用-aws-无服务器方案与-agentic-ai-实现现代-kyc.mdx` | 使用 AWS 无服务器方案与 Agentic AI 实现现代 KYC | 金融行业解决方案 | [KYC, 无服务器, 事件驱动, Agentic AI, AWS Lambda, Amazon MSK, Amazon Bedrock, 金融服务, 合规, 可靠性] | 存疑 | ai | 中 |  |
| `src/pages/runbooks/使用-doczyai-在-aws-上自动化合同智能分析.mdx` | 使用 Doczy.ai™ 在 AWS 上自动化合同智能分析 | SRE架构与设计 | [AWS, AI, 文档处理, SRE, 可靠性, 自动化, 医疗健康] | 存疑 | ai | 中 |  |
| `src/pages/architectures/利用-k0smos-平台实现地理分布式-ai-运营.mdx` | 利用 k0smos 平台实现地理分布式 AI 运营 | AI Infrastructure | [geo-distributed, ai-infra, multi-cluster, kubernetes, gpu, edge, site-reliability] | 存疑 | ai | 中 |  |

#### linux-distro

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/linux/almalinux-ci-中-kernel-modules-extra-安装失败的分析与解决.mdx` | AlmaLinux CI 中 `kernel-modules-extra` 安装失败的分析与解决 | 系统管理 | [AlmaLinux, dnf, kernel-modules, CI, provisioner, 软件包管理, 系统管理] | 存疑 | linux-distro | 中 |  |
| `src/pages/runbooks/ubuntu-mate-项目的未来与延续性.mdx` | Ubuntu MATE 项目的未来与延续性 | SRE文化与可持续性 | [ubuntu-mate, linux-distribution, project-sustainability, release-management] | 存疑 | linux-distro | 中 |  |

#### other

| 文件 | 标题 | 当前 category | tags | 建议领域 | 存疑细分 | 置信度 | 备注 |
|---|---|---|---|---|---|---|---|
| `src/pages/linux/ai-gateway-working-group-与-kubernetes-中-ai-工作负载的网络标准化.mdx` | AI Gateway Working Group 与 Kubernetes 中 AI 工作负载的网络标准化 | networking | [ai-gateway, kubernetes, networking, gateway-api, ai-workloads, sre] | 存疑 | other | 低 |  |
| `src/pages/architectures/ai-代理安全面向开发与运维团队的实践指南.mdx` | AI 代理安全：面向开发与运维团队的实践指南 | AI/ML 运维 | [ai-agents, security, sandboxing, runtime-monitoring, least-privilege, mcp] | 存疑 | other | 低 |  |
| `src/pages/incidents/ai-代码补全工具的安全漏洞分类难题.mdx` | AI 代码补全工具的安全漏洞分类难题 | 安全与合规 | [ai-security, code-generation, vulnerability-disclosure, sre-practice, security-vulnerability] | 存疑 | other | 低 |  |
| `src/pages/kubernetes/ai编码代理灾难案例rm-rf-事件.mdx` | AI编码代理灾难案例：rm -rf ~/事件 | 容器与沙箱安全 | [AI代理安全, Docker沙箱, rm -rf, 执行隔离, 事件响应] | 存疑 | other | 低 |  |
| `src/pages/docker/aws上的网络弹性恢复针对勒索软件和破坏性事件的参考方案.mdx` | AWS上的网络弹性恢复：针对勒索软件和破坏性事件的参考方案 | AWS Architecture | [cyber-resilience, ransomware-recovery, aws-backup, incident-response, disaster-recovery, aws-organization, isolation] | 存疑 | other | 低 |  |
| `src/pages/linux/bugfixadd-lock-to-protect-task-delete-and-task-kill.mdx` | bugfix:add lock to protect task delete and task kill | 可靠性与容错 | [并发, 竞态条件, 锁, 任务生命周期, 容器运行时] | 存疑 | other | 低 |  |
| `src/pages/docker/buildroot-202605-版本发布更新.mdx` | Buildroot 2026.05 版本发布更新 | 构建与部署工具 | [buildroot, embedded-linux, cross-compilation, xfs, arm-neoverse] | 存疑 | other | 低 |  |
| `src/pages/linux/canvas背景图片显示不全问题.mdx` | Canvas背景图片显示不全问题 | issue跟踪 | [grafana, canvas, visualization, bug, frontend, usability] | 存疑 | other | 低 |  |
| `src/pages/linux/combobox-组件点击目标不一致问题.mdx` | Combobox 组件点击目标不一致问题 | 前端可观测性 | [grafana, ui-component, ux-bug, frontend-reliability, incident-response] | 存疑 | other | 低 |  |
| `src/pages/runbooks/dapr-118-可验证执行能力介绍.mdx` | Dapr 1.18 可验证执行能力介绍 | SRE实践与治理 | [dapr, verifiable-execution, workflow, attestation, sre] | 存疑 | other | 低 |  |
| `src/pages/linux/dashboard-annotations-加载期间无法切换开关的问题.mdx` | Dashboard Annotations: 加载期间无法切换开关的问题 | 仪表板与可视化 | [Grafana, Dashboard, Annotation, UX, Bug, Performance] | 存疑 | other | 低 |  |
| `src/pages/linux/dashboardnewlayouts-滚动容器变更引发的可访问性与截图问题.mdx` | dashboardNewLayouts 滚动容器变更引发的可访问性与截图问题 | SRE 问题与故障排除 | [前端问题, 可访问性, 滚动问题, Grafana, 截图, 移动端] | 存疑 | other | 低 |  |
| `src/pages/linux/datasources-return-400-when-payload-uid-does-not-match-url-uid-in-put-api-datasources-uid-uid.mdx` | Datasources: return 400 when payload UID does not match URL UID in PUT /api/datasources/uid/:uid | api-design-and-error-handling | [api, validation, error-handling, grafana, datasources] | 存疑 | other | 低 |  |
| `src/pages/linux/explore界面时间选择器的响应式布局问题.mdx` | Explore界面时间选择器的响应式布局问题 | UI与前端 | [grafana, explore, ui, responsive-layout, time-picker] | 存疑 | other | 低 |  |
| `src/pages/linux/gcx-cli在终端中为用户和代理提供可观察性.mdx` | gcx CLI：在终端中为用户和代理提供可观察性 | 可观察性工具 | [CLI, AIOps, Grafana-Cloud, OpenTelemetry, SLO, Error-Budget, Observability-as-Code, Agent] | 存疑 | other | 低 |  |
| `src/pages/linux/generic-oauth-组织映射问题与解决.mdx` | Generic OAuth 组织映射问题与解决 | 身份认证与授权 | [auth0, grafana, oauth, organization-mapping, sso] | 存疑 | other | 低 |  |
| `src/pages/linux/geomap-路径图层分组数据连接问题.mdx` | Geomap 路径图层分组数据连接问题 | 可观测性 | [grafana, geomap, visualization, observability, bug, front-end] | 存疑 | other | 低 |  |
| `src/pages/linux/git-sync-pure-git-与-gerrit-集成中的误报成功问题.mdx` | Git Sync (Pure Git) 与 Gerrit 集成中的误报成功问题 | Git 同步与版本控制 | [gerrit, grafana, git-sync, pure-git, configuration-as-code, false-positive, api] | 存疑 | other | 低 |  |
| `src/pages/linux/git-sync-push-协议错误与-side-band-通道误解析.mdx` | Git Sync Push 协议错误与 Side-Band 通道误解析 | Git Sync & Provisioning | [git-sync, provisioning, nanogit, git-protocol, error-handling, reliability] | 存疑 | other | 低 |  |
| `src/pages/linux/git-sync-权限编辑角色无法保存已配置仪表板.mdx` | Git Sync 权限：编辑角色无法保存已配置仪表板 | Git Sync | [权限, Git Sync, Dashboard Provisioning, RBAC, 错误排查] | 存疑 | other | 低 |  |
| `src/pages/linux/go-语言空指针解引用静态分析发现的常见模式与修复.mdx` | Go 语言空指针解引用：静态分析发现的常见模式与修复 | 代码可靠性与静态分析 | [Go, 空指针, panic, 静态分析, 可靠性, Grafana] | 存疑 | other | 低 |  |
| `src/pages/linux/ibm-vault-20-增强ui-改进与使用情况报告.mdx` | IBM Vault 2.0 增强：UI 改进与使用情况报告 | 密钥管理与安全 | [vault, secrets-management, observability, usability, ibm-vault] | 存疑 | other | 低 |  |
| `src/pages/docker/image-rendering-callback-url-configuration-issue.mdx` | Image Rendering Callback URL Configuration Issue | 配置管理 | [grafana, image-rendering, configuration, bug] | 存疑 | other | 低 |  |
| `src/pages/runbooks/jwt认证中的org-mapping问题分析与规避.mdx` | JWT认证中的org_mapping问题分析与规避 | SRE实践 | [grafana, jwt, authentication, organizations, configuration-bug] | 存疑 | other | 低 |  |
| `src/pages/incidents/macos-27-beta-更新导致-asahi-linux-分区不可见事件分析.mdx` | macOS 27 Beta 更新导致 Asahi Linux 分区不可见事件分析 | 事件响应与故障管理 | [事件分析, 变更管理, 多系统引导, 可靠性, Apple Silicon] | 存疑 | other | 低 |  |
| `src/pages/linux/mixed-datasource-面板时间范围同步问题与修复.mdx` | Mixed datasource 面板时间范围同步问题与修复 | 可观测性工具 | [grafana, dashboard, mixed-datasource, time-range, rxjs, reactive-programming] | 存疑 | other | 低 |  |
| `src/pages/linux/node-graph-数据链接重复显示问题.mdx` | Node Graph 数据链接重复显示问题 | 可视化与可观测性 | [grafana, node-graph, visualization, data-links, bug, reliability] | 存疑 | other | 低 |  |
| `src/pages/linux/node-graph-时间范围切换后的陈旧边渲染问题.mdx` | Node Graph 时间范围切换后的陈旧边渲染问题 | Grafana | [grafana, frontend, node-graph, state-management, bug, observability] | 存疑 | other | 低 |  |
| `src/pages/linux/node-graph-edge-arrowhead-missing-when-edges-id-field-contains-whitespace.mdx` | Node Graph: Edge arrowhead missing when edge's ID field contains whitespace | 可视化与可观测性 | [grafana, nodegraph, visualization, bug, edge-arrowhead] | 存疑 | other | 低 |  |
| `src/pages/kubernetes/oci容器进程数限制pid-limit行为变更.mdx` | OCI容器进程数限制（PID Limit）行为变更 | 容器运行时 | [containerd, runc, OCI, PID-limit, security, configuration] | 存疑 | other | 低 |  |
| `src/pages/linux/openapi-数据契约不一致性.mdx` | OpenAPI 数据契约不一致性 | API 可靠性 | [openapi, data-contract, grafana, api-reliability] | 存疑 | other | 低 |  |
| `src/pages/docker/pacific-平台在-catena-x-数据空间上构建多租户主权的-pcf-交换.mdx` | PACIFIC 平台：在 Catena-X 数据空间上构建多租户、主权的 PCF 交换 | 平台架构与工程 | ["SRE", "AWS", "多租户", "数据主权", "Catena-X", "ECS", "Fargate", "IAM", "Cognito", "Sustainability"] | 存疑 | other | 低 |  |
| `src/pages/linux/panel-candlestick-bars-random-width-change.mdx` | Panel: Candlestick bars random width change | 可观测性 | [grafana, panel, visualization, bug, candlestick] | 存疑 | other | 低 |  |
| `src/pages/linux/portal-嵌套渲染顺序修复与-ui-可靠性.mdx` | Portal 嵌套渲染顺序修复与 UI 可靠性 | 组件与UI可靠性 | [react, portal, z-index, frontend-reliability, ui] | 存疑 | other | 低 |  |
| `src/pages/linux/postgresql-数据源恢复-explain-查询结果返回.mdx` | PostgreSQL 数据源：恢复 EXPLAIN 查询结果返回 | 数据源 | [postgresql, query-optimization, grafana, regression-fix] | 存疑 | other | 低 |  |
| `src/pages/architectures/sagemaker-hyperpod-推理操作符简化安装指南.mdx` | SageMaker HyperPod 推理操作符简化安装指南 | sagemaker-hyperpod | [sagemaker, hyperpod, eks-addon, kubernetes, inference, sre, ai-infrastructure] | 存疑 | other | 低 |  |
| `src/pages/architectures/snowflake-on-aws的well-architected框架联合评估指南.mdx` | Snowflake on AWS的Well-Architected框架联合评估指南 | 可靠性架构 | [SRE, Well-Architected, Snowflake, AWS, 云架构, 评估框架] | 存疑 | other | 低 |  |
| `src/pages/linux/sre知识构建系统文件句柄耗尽问题与处理.mdx` | SRE知识：构建系统文件句柄耗尽问题与处理 | 构建与部署 | [构建, 可靠性, 系统限制, 快速失败, 错误处理] | 存疑 | other | 低 |  |
| `src/pages/linux/tableng组件滚动条闪烁问题.mdx` | TableNG组件滚动条闪烁问题 | 前端性能 | [UI渲染, 性能优化, Grafana, 前端调试, 可靠性] | 存疑 | other | 低 |  |
| `src/pages/linux/tls证书自动续期后的热重载问题.mdx` | TLS证书自动续期后的热重载问题 | 运维与可靠性 | [TLS, 证书管理, 热重载, Grafana, 运维, 可靠性] | 存疑 | other | 低 |  |
| `src/pages/linux/uid一致性校验与错误处理api防错实践.mdx` | UID一致性校验与错误处理：API防错实践 | API设计与错误处理 | [api-design, error-handling, uid, grafana, data-consistency, defensive-programming] | 存疑 | other | 低 |  |
| `src/pages/linux/vault-enterprise-20-ldap-密钥管理.mdx` | Vault Enterprise 2.0 LDAP 密钥管理 | Secrets Management | [vault, ldap, secrets-management, rotation, identity, sre] | 存疑 | other | 低 |  |
| `src/pages/linux/云原生为ai生产化提供的工程基础.mdx` | 云原生为AI生产化提供的工程基础 | 可观测性与基础设施 | [云原生， AI， Kubernetes， 生产环境， 平台工程， 可靠性] | 存疑 | other | 低 |  |
| `src/pages/runbooks/代码中的复制粘贴错误分析与预防.mdx` | 代码中的复制粘贴错误分析与预防 | SRE实践 | [代码质量, 静态分析, 可观测性, 事件响应] | 存疑 | other | 低 |  |
| `src/pages/linux/仪表板保存状态与url参数不一致问题.mdx` | 仪表板保存状态与URL参数不一致问题 | SRE-仪表板与变量管理 | [grafana, dashboard, configuration-management, state-synchronization, observability, reliability] | 存疑 | other | 低 |  |
| `src/pages/linux/仪表板时间比较设置的-schema-与持久化.mdx` | 仪表板时间比较设置的 Schema 与持久化 | 监控与告警 | [grafana, dashboard, configuration, persistence, time-comparison] | 存疑 | other | 低 |  |
| `src/pages/runbooks/仪表板配置持久化问题分析.mdx` | 仪表板配置持久化问题分析 | SRE工具与平台 | [Grafana, Dashboard, Serialization, StateManagement, Configuration] | 存疑 | other | 低 |  |
| `src/pages/linux/仪表板面板在移动设备上位置异常.mdx` | 仪表板面板在移动设备上位置异常 | 可观测性工具 | [Grafana, 移动端, 布局, 响应式设计, 缺陷] | 存疑 | other | 低 |  |
| `src/pages/linux/仪表板从解码对象gvk填充storedversion.mdx` | 仪表板：从解码对象GVK填充storedVersion | API设计与管理 | [grafana, dashboard, storage, api-versioning, reliability] | 存疑 | other | 低 |  |
| `src/pages/linux/使用-amazon-aurora-与-quicksight-构建云-erp-实时分析系统.mdx` | 使用 Amazon Aurora 与 QuickSight 构建云 ERP 实时分析系统 | 可观测性与数据分析 | [实时分析, ERP, 数据流, Aurora, QuickSight, 嵌入式分析, 高可用性, 企业架构] | 存疑 | other | 低 |  |
| `src/pages/kubernetes/使用-kind-本地实验-gateway-api-指南.mdx` | 使用 kind 本地实验 Gateway API 指南 | Kubernetes与云原生 | [gateway-api, kind, 本地开发, 流量管理, 网络] | 存疑 | other | 低 |  |
| `src/pages/runbooks/使用-virtbench-对-kubevirt-进行性能基准测试.mdx` | 使用 virtbench 对 KubeVirt 进行性能基准测试 | SRE 工具与实践 | [KubeVirt, SRE, 基准测试, 性能分析, 云原生虚拟化, 可靠性] | 存疑 | other | 低 |  |
| `src/pages/architectures/使用amazon-bedrock-data-automation和aws-healthlake实现医疗记录数字化自动化.mdx` | 使用Amazon Bedrock Data Automation和AWS HealthLake实现医疗记录数字化自动化 | 医疗保健与合规 | [AWS, FHIR, 无服务器, 自动化, 医疗保健] | 存疑 | other | 低 |  |
| `src/pages/kubernetes/使用amazon-fsx-for-netapp-ontap构建高可用oracle数据库.mdx` | 使用Amazon FSx for NetApp ONTAP构建高可用Oracle数据库 | 存储与数据管理 | [oracle, aws-fsx, high-availability, iscsi, auto-scaling, aws-backup, lambda] | 存疑 | other | 低 |  |
| `src/pages/architectures/使用标签化存储模式构建多租户配置系统.mdx` | 使用标签化存储模式构建多租户配置系统 | 系统设计 | [multi-tenant, configuration-management, dynamodb, parameter-store, eventbridge, grpc, strategy-pattern, tenant-isolation] | 存疑 | other | 低 |  |
| `src/pages/architectures/修复不稳定的测试testbroadcastandhandlemessages案例分析.mdx` | 修复不稳定的测试：TestBroadcastAndHandleMessages案例分析 | 测试与质量保证 | [测试稳定性, 超时, Go测试, 告警, CI/CD] | 存疑 | other | 低 |  |
| `src/pages/linux/修复极小数据范围的y轴刻度缩放问题.mdx` | 修复极小数据范围的Y轴刻度缩放问题 | 可视化与监控 | [grafana, monitoring, visualization, time-series, SRE] | 存疑 | other | 低 |  |
| `src/pages/incidents/修正未修复-kubernetes-cve-记录sre-应对指南.mdx` | 修正未修复 Kubernetes CVE 记录：SRE 应对指南 | 安全与漏洞管理 | [kubernetes, CVE, security, vulnerability-management, architecture, rbac, mitigation] | 存疑 | other | 低 |  |
| `src/pages/runbooks/利用-aws-和-amazon-connect-实现医疗服务联系中心的云迁移与-sre-实践.mdx` | 利用 AWS 和 Amazon Connect 实现医疗服务联系中心的云迁移与 SRE 实践 | SRE实践案例 | [Amazon-Connect, AWS, 云迁移, 医疗保健, HIPAA, 微服务, 架构设计, 客户体验] | 存疑 | other | 低 |  |
| `src/pages/linux/前端下拉搜索功能缺失的故障分析与sre实践.mdx` | 前端下拉搜索功能缺失的故障分析与SRE实践 | 前端工程实践 | [前端, UI, 故障排查, Grafana, 可靠性, 用户体验] | 存疑 | other | 低 |  |
| `src/pages/kubernetes/在-kubernetes-上运行-ai-agentagent-sandbox.mdx` | 在 Kubernetes 上运行 AI Agent：Agent Sandbox | Kubernetes & 容器编排 | [kubernetes, ai, agent, sandbox, sig-apps, stateful-workloads] | 存疑 | other | 低 |  |
| `src/pages/incidents/在-kubernetes-中安全进行生产调试.mdx` | 在 Kubernetes 中安全进行生产调试 | 安全与合规 | [kubernetes, rbac, security, debugging, access-control, credentials] | 存疑 | other | 低 |  |
| `src/pages/incidents/在amazon-cognito之上构建可扩展的用户搜索层.mdx` | 在Amazon Cognito之上构建可扩展的用户搜索层 | 认证与访问管理 | [cognito, opensearch, dynamodb, lambda, serverless, architecture, search] | 存疑 | other | 低 |  |
| `src/pages/linux/在aws上构建有状态服务的混合多租户架构.mdx` | 在AWS上构建有状态服务的混合多租户架构 | multi-tenant-architecture | [multi-tenant, architecture, isolation, scalability, aws, ecs, alb, route53, privatelink] | 存疑 | other | 低 |  |
| `src/pages/incidents/处理未修复的kubernetes-cve记录修正与管理.mdx` | 处理未修复的Kubernetes CVE：记录修正与管理 | 安全与合规 | [kubernetes, security, CVE, vulnerability-management, rbac, networking] | 存疑 | other | 低 |  |
| `src/pages/incidents/失控的自动化ai代理在开源项目中的事故分析.mdx` | 失控的自动化：AI代理在开源项目中的事故分析 | 事件与事故 | [自动化, 权限控制, 事件响应, 可信模型, 开源治理] | 存疑 | other | 低 |  |
| `src/pages/linux/库面板标题同步失效问题.mdx` | 库面板标题同步失效问题 | 可视化与监控 | [grafana, library-panel, bug, sre] | 存疑 | other | 低 |  |
| `src/pages/linux/插件目录名称排序修复.mdx` | 插件目录名称排序修复 | 系统组件 | [grafana, plugin, ui, sorting, 数据清洗] | 存疑 | other | 低 |  |
| `src/pages/linux/文档链接健康度管理与修复.mdx` | 文档链接健康度管理与修复 | 文档与知识管理 | [文档质量, 内部链接, 锚点, 贡献者指南, 代码库维护] | 存疑 | other | 低 |  |
| `src/pages/linux/无法使用-paneleditnext-更新库面板-library-panels.mdx` | 无法使用 PanelEditNext 更新库面板 (Library Panels) | 监控与可视化工具 | [grafana, library-panels, panel-editing, bug] | 存疑 | other | 低 |  |
| `src/pages/linux/架构积压工作与技术路线图优先级排序-trp.mdx` | 架构积压工作与技术路线图优先级排序 (TRP) | 流程与决策 | [技术决策, 优先级排序, 架构管理, 利益相关者对齐, 云采用框架] | 存疑 | other | 低 |  |
| `src/pages/linux/查询构建器界面元素对齐缺陷.mdx` | 查询构建器界面元素对齐缺陷 | 可观测性与监控工具 | [grafana, ui-ux, frontend, css, flexbox, layout] | 存疑 | other | 低 |  |
| `src/pages/linux/热图工具提示的差一错误针对数值型x轴数据.mdx` | 热图工具提示的差一错误（针对数值型X轴数据） | 可视化与监控 | [grafana, heatmap, visualization, bug-fix] | 存疑 | other | 低 |  |
| `src/pages/linux/缓解windows环境中的凭证暴露.mdx` | 缓解Windows环境中的凭证暴露 | 远程访问与零信任 | [boundary, vault, windows, rdp, zero-trust, secrets-management, active-directory] | 存疑 | other | 低 |  |
| `src/pages/kubernetes/自治ai代理的隔离需求从容器到微虚拟机.mdx` | 自治AI代理的隔离需求：从容器到微虚拟机 | 容器与运行时安全 | [容器, 微虚拟机, AI代理, Docker Sandboxes, 隔离, 代码安全, 开发者工具] | 存疑 | other | 低 |  |
| `src/pages/linux/节点图边字段值的多行显示限制.mdx` | 节点图边字段值的多行显示限制 | 可观测性 | [Grafana, NodeGraph, 可视化, 服务拓扑] | 存疑 | other | 低 |  |
| `src/pages/linux/虚拟化列表项高度估算错误导致内容截断.mdx` | 虚拟化列表项高度估算错误导致内容截断 | 前端性能 | [grafana, combobox, 虚拟化列表, 性能问题, 浮点数精度] | 存疑 | other | 低 |  |
| `src/pages/runbooks/面板间数据源刷新失效.mdx` | 面板间数据源刷新失效 | 故障排查 | [grafana, dashboard, panel, datasource, refresh, caching] | 存疑 | other | 低 |  |

## 统计

| 建议领域 | 篇数 | 高置信度 |
|---|---:|---:|
| observability | 264 | 255 |
| kubernetes | 23 | 23 |
| linux | 7 | 7 |
| docker | 3 | 3 |
| 存疑 | 219 | 0 |
| **合计** | **516** | **288** |

### 存疑细分分布

| 存疑细分 | 篇数 |
|---|---:|
| etcd | 21 |
| terraform-iac | 7 |
| chaos-mesh | 15 |
| kubernetes-platform | 62 |
| security | 25 |
| ai | 9 |
| linux-distro | 2 |
| other | 78 |
| **合计** | **219** |
