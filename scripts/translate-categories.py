#!/usr/bin/env python3
"""
Translate Chinese category values in English MDX pages to English.
"""

import os
import re
from pathlib import Path

PAGES_DIR = Path("/Users/pineapple/Desktop/workspace/Projects/my-GitHub/wiki/src/pages/en")

CATEGORY_MAP = {
    "平台与基础设施": "Platform & Infrastructure",
    "构建与部署工具": "Build & Deployment Tools",
    "监控与可观测性": "Monitoring & Observability",
    "安全与合规": "Security & Compliance",
    "网络与服务网格": "Networking & Service Mesh",
    "存储与数据管理": "Storage & Data Management",
    "容器与编排": "Containers & Orchestration",
    "配置与管理": "Configuration & Management",
    "故障排查": "Troubleshooting",
    "最佳实践": "Best Practices",
    "架构与设计": "Architecture & Design",
    "性能优化": "Performance Optimization",
    "CI/CD": "CI/CD",
    "日志与调试": "Logging & Debugging",
    "自动化": "Automation",
    "云原生": "Cloud Native",
    "DevOps": "DevOps",
    "SRE": "SRE",
    "Kubernetes": "Kubernetes",
    "Docker": "Docker",
    "Linux": "Linux",
    "AWS": "AWS",
    "Azure": "Azure",
    "GCP": "GCP",
    "Grafana": "Grafana",
    "Prometheus": "Prometheus",
    "监控": "Monitoring",
    "部署": "Deployment",
    "安全": "Security",
    "网络": "Networking",
    "存储": "Storage",
    "配置": "Configuration",
    "工具": "Tools",
    "实践": "Practice",
    "案例": "Case Study",
    "指南": "Guide",
    "教程": "Tutorial",
    "参考": "Reference",
    "概述": "Overview",
    "总结": "Summary",
    "分析": "Analysis",
    "对比": "Comparison",
    "选择": "Selection",
    "入门": "Getting Started",
    "进阶": "Advanced",
    "基础": "Fundamentals",
    "核心概念": "Core Concepts",
    "常见问题": "FAQ",
    "故障排除": "Troubleshooting",
    "性能": "Performance",
    "优化": "Optimization",
    "管理": "Management",
    "运维": "Operations",
    "架构": "Architecture",
    "设计": "Design",
    "模式": "Patterns",
    "策略": "Strategy",
    "方案": "Solution",
    "技术": "Technology",
    "方案": "Solution",
    "实现": "Implementation",
    "原理": "Principles",
    "详解": "Deep Dive",
    "实战": "In Practice",
    "原理与实践": "Principles & Practice",
    "架构设计": "Architecture Design",
    "系统设计": "System Design",
    "高可用": "High Availability",
    "容错": "Fault Tolerance",
    "弹性": "Resilience",
    "可扩展性": "Scalability",
    "可观测性": "Observability",
    "可靠性": "Reliability",
    "可用性": "Availability",
    "一致性": "Consistency",
    "分区": "Partitioning",
    "复制": "Replication",
    "分片": "Sharding",
    "缓存": "Caching",
    "负载均衡": "Load Balancing",
    "服务发现": "Service Discovery",
    "配置管理": "Configuration Management",
    "密钥管理": "Secret Management",
    "证书管理": "Certificate Management",
    "权限管理": "Permission Management",
    "用户管理": "User Management",
    "资源管理": "Resource Management",
    "成本管理": "Cost Management",
    "容量规划": "Capacity Planning",
    "变更管理": "Change Management",
    "事件管理": "Incident Management",
    "问题管理": "Problem Management",
    "发布管理": "Release Management",
    "风险管理": "Risk Management",
    "合规管理": "Compliance Management",
    "审计": "Audit",
    "监控告警": "Monitoring & Alerting",
    "日志分析": "Log Analysis",
    "指标收集": "Metric Collection",
    "追踪": "Tracing",
    "链路追踪": "Distributed Tracing",
    "健康检查": "Health Check",
    "就绪检查": "Readiness Check",
    "存活检查": "Liveness Check",
    "探针": "Probes",
    "自动伸缩": "Auto Scaling",
    "水平伸缩": "Horizontal Scaling",
    "垂直伸缩": "Vertical Scaling",
    "滚动更新": "Rolling Update",
    "蓝绿部署": "Blue-Green Deployment",
    "金丝雀发布": "Canary Release",
    "灰度发布": "Grayscale Release",
    "回滚": "Rollback",
    "备份": "Backup",
    "恢复": "Recovery",
    "灾难恢复": "Disaster Recovery",
    "高可用集群": "HA Cluster",
    "主从复制": "Master-Slave Replication",
    "多活": "Active-Active",
    "冷备": "Cold Standby",
    "热备": "Hot Standby",
    "温备": "Warm Standby",
}

def translate_category(category: str) -> str:
    """Translate a Chinese category to English."""
    if not category:
        return category

    # Try exact match first
    if category in CATEGORY_MAP:
        return CATEGORY_MAP[category]

    # Try partial match
    for zh, en in CATEGORY_MAP.items():
        if zh in category:
            category = category.replace(zh, en)

    return category

def process_file(filepath: Path) -> bool:
    """Process a single MDX file and translate its category."""
    try:
        content = filepath.read_text(encoding="utf-8")
    except Exception:
        return False

    # Check if file has Chinese category
    match = re.search(r'^category:\s*["\']?(.+?)["\']?\s*$', content, re.MULTILINE)
    if not match:
        return False

    category = match.group(1).strip()

    # Check if category contains Chinese
    if not re.search(r'[一-鿿]', category):
        return False

    # Translate
    new_category = translate_category(category)

    # Replace in content
    new_content = content.replace(
        f'category: "{category}"',
        f'category: "{new_category}"'
    ).replace(
        f"category: '{category}'",
        f"category: '{new_category}'"
    ).replace(
        f"category: {category}",
        f'category: "{new_category}"'
    )

    if new_content != content:
        filepath.write_text(new_content, encoding="utf-8")
        return True

    return False

def main():
    print("=== Translating English page categories ===\n")

    translated = 0
    skipped = 0

    for mdx_file in sorted(PAGES_DIR.rglob("*.mdx")):
        if process_file(mdx_file):
            rel_path = mdx_file.relative_to(PAGES_DIR)
            print(f"  Translated: {rel_path}")
            translated += 1
        else:
            skipped += 1

    print(f"\nTranslated: {translated} files")
    print(f"Skipped: {skipped} files")

if __name__ == "__main__":
    main()
