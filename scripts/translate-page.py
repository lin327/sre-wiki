#!/usr/bin/env python3
"""
Translate a single Chinese page to English.
Usage: python3 translate-page.py <input_path> <output_path>
"""

import sys
import re

def translate_content(content):
    """Translate Chinese content to English while preserving structure."""

    # Common SRE/DevOps term translations
    translations = {
        # Core concepts
        '概述': 'Overview',
        '核心概念': 'Core Concepts',
        '实践': 'Practice',
        'SRE 要点': 'SRE Key Points',
        '最佳实践': 'Best Practices',
        '常见反模式': 'Common Anti-patterns',
        '相关指标': 'Related Indicators',
        '总结': 'Summary',
        '参考': 'References',

        # Technical terms
        '容器': 'Container',
        '镜像': 'Image',
        '网络': 'Network',
        '存储': 'Storage',
        '安全': 'Security',
        '监控': 'Monitoring',
        '日志': 'Logging',
        '部署': 'Deployment',
        '配置': 'Configuration',
        '故障': 'Failure',
        '排查': 'Troubleshooting',
        '性能': 'Performance',
        '优化': 'Optimization',
        '集群': 'Cluster',
        '节点': 'Node',
        '服务': 'Service',
        '命名空间': 'Namespace',
        '标签': 'Label',
        '注解': 'Annotation',
        '选择器': 'Selector',
        '控制器': 'Controller',
        '调度': 'Scheduling',
        '资源': 'Resource',
        '限制': 'Limit',
        '请求': 'Request',
        '配额': 'Quota',
        '持久卷': 'Persistent Volume',
        '声明': 'Claim',
        '配置映射': 'ConfigMap',
        '密钥': 'Secret',
        '服务账户': 'Service Account',
        '角色': 'Role',
        '集群角色': 'ClusterRole',
        '绑定': 'Binding',
        '入口': 'Ingress',
        '服务网格': 'Service Mesh',
        ' sidecar': 'Sidecar',
        '初始化容器': 'Init Container',
        '就绪探针': 'Readiness Probe',
        '存活探针': 'Liveness Probe',
        '启动探针': 'Startup Probe',
        '水平自动扩缩': 'Horizontal Pod Autoscaler',
        '垂直自动扩缩': 'Vertical Pod Autoscaler',
        '滚动更新': 'Rolling Update',
        '蓝绿部署': 'Blue-Green Deployment',
        '金丝雀发布': 'Canary Release',
        '回滚': 'Rollback',
        '版本': 'Version',
        '发布': 'Release',
        '更新': 'Update',
        '升级': 'Upgrade',
        '迁移': 'Migration',
        '备份': 'Backup',
        '恢复': 'Recovery',
        '高可用': 'High Availability',
        '故障转移': 'Failover',
        '负载均衡': 'Load Balancing',
        '代理': 'Proxy',
        '网关': 'Gateway',
        '入口': 'Ingress',
        '出口': 'Egress',
        '防火墙': 'Firewall',
        '网络策略': 'Network Policy',
        '证书': 'Certificate',
        '密钥': 'Secret',
        '认证': 'Authentication',
        '授权': 'Authorization',
        '审计': 'Audit',
        '合规': 'Compliance',
        '漏洞': 'Vulnerability',
        '补丁': 'Patch',
        'CVE': 'CVE',
        '镜像扫描': 'Image Scanning',
        '运行时安全': 'Runtime Security',
        '网络隔离': 'Network Isolation',
        '加密': 'Encryption',
        '密钥管理': 'Key Management',
    }

    # Split content into frontmatter and body
    parts = content.split('---', 2)
    if len(parts) >= 3:
        frontmatter = parts[1]
        body = parts[2]
    else:
        frontmatter = ''
        body = content

    # Translate frontmatter title if it contains Chinese
    def translate_title(match):
        title = match.group(1)
        # Check if title has Chinese characters
        if any('一' <= c <= '鿿' for c in title):
            # Apply word-by-word translation
            result = title
            for zh, en in translations.items():
                result = result.replace(zh, en)
            # If still has Chinese, keep original with [EN] prefix
            if any('一' <= c <= '鿿' for c in result):
                return f'title: "[EN] {title}"'
            return f'title: "{result}"'
        return match.group(0)

    frontmatter = re.sub(r'title:\s*["\']([^"\']+)["\']', translate_title, frontmatter)

    # Translate section headers
    def translate_header(match):
        prefix = match.group(1)
        header = match.group(2)
        # Apply translations
        result = header
        for zh, en in translations.items():
            result = result.replace(zh, en)
        return f'{prefix}{result}'

    body = re.sub(r'^(#{1,6}\s+)(.+)$', translate_header, body, flags=re.MULTILINE)

    # Reconstruct content
    if frontmatter:
        translated = f'---{frontmatter}---{body}'
    else:
        translated = body

    return translated

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 translate-page.py <input_path> <output_path>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    translated = translate_content(content)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(translated)

    print(f"Translated: {input_path} -> {output_path}")

if __name__ == '__main__':
    main()
