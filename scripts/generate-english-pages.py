#!/usr/bin/env python3
"""
Generate English stub pages for missing Chinese content.
Creates English versions with translated titles and a note about translation.
"""

import os
import re
from pathlib import Path

PAGES_DIR = Path("src/pages")
EN_DIR = PAGES_DIR / "en"

def get_chinese_pages():
    """Get all Chinese page paths (excluding en/ and special pages)."""
    pages = []
    for ext in ['*.md', '*.mdx']:
        for p in PAGES_DIR.rglob(ext):
            rel = p.relative_to(PAGES_DIR)
            # Skip English pages, index files, mermaid
            if str(rel).startswith('en/') or 'index.mdx' in str(rel) or 'mermaid' in str(rel):
                continue
            pages.append(rel)
    return sorted(pages)

def get_english_pages():
    """Get all English page paths."""
    pages = []
    for ext in ['*.md', '*.mdx']:
        for p in EN_DIR.rglob(ext):
            rel = p.relative_to(EN_DIR)
            pages.append(rel)
    return sorted(pages)

def extract_frontmatter(content):
    """Extract title and category from frontmatter."""
    title = ""
    category = ""
    if content.startswith('---'):
        end = content.find('---', 3)
        if end != -1:
            fm = content[3:end]
            # Extract title
            m = re.search(r'title:\s*["\']?([^"\'\n]+)', fm)
            if m:
                title = m.group(1).strip()
            # Extract category
            m = re.search(r'category:\s*["\']?([^"\'\n]+)', fm)
            if m:
                category = m.group(1).strip()
    return title, category

def translate_title(title):
    """Simple title translation mapping for common SRE terms."""
    translations = {
        'Linux': 'Linux',
        'Docker': 'Docker',
        'Kubernetes': 'Kubernetes',
        'K8s': 'K8s',
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
        '最佳实践': 'Best Practices',
        '指南': 'Guide',
        '教程': 'Tutorial',
        '原理': 'Principles',
        '架构': 'Architecture',
        '集群': 'Cluster',
        '节点': 'Node',
        '服务': 'Service',
        'Pod': 'Pod',
        '容器': 'Container',
        '镜像': 'Image',
        '命令': 'Command',
        '工具': 'Tools',
    }
    # If title is mostly English/ASCII, keep it
    ascii_ratio = sum(1 for c in title if ord(c) < 128) / max(len(title), 1)
    if ascii_ratio > 0.7:
        return title

    # Simple word-by-word translation attempt
    result = title
    for zh, en in translations.items():
        result = result.replace(zh, en)

    # If still mostly Chinese, add prefix
    if sum(1 for c in result if '一' <= c <= '鿿') > len(result) * 0.3:
        return f"[EN] {title}"
    return result

def generate_english_page(zh_path, en_path):
    """Generate an English stub page from a Chinese page."""
    zh_full = PAGES_DIR / zh_path
    en_full = EN_DIR / en_path

    # Read Chinese content
    with open(zh_full, 'r', encoding='utf-8') as f:
        content = f.read()

    title, category = extract_frontmatter(content)
    en_title = translate_title(title) if title else en_path.stem.replace('-', ' ').title()

    # Calculate relative path to layout
    # en_path is like "architectures/page.mdx" (relative to en/)
    # layout is at src/layouts/BaseLayout.astro
    # from src/pages/en/architectures/page.mdx -> need to go up 3 levels
    depth = len(en_path.parts) + 1  # +1 for the en/ directory itself
    layout_path = '/'.join(['..'] * depth) + '/layouts/BaseLayout.astro'

    # Generate English content
    en_content = f"""---
layout: {layout_path}
title: "{en_title}"
category: "{category}"
confidence: low
---

> **Note**: This page is a translation stub. The content below is from the Chinese version.
> Full English translation is pending.

{content.split('---', 2)[-1] if '---' in content else ''}
"""

    # Create directory if needed
    en_full.parent.mkdir(parents=True, exist_ok=True)

    # Write English page
    with open(en_full, 'w', encoding='utf-8') as f:
        f.write(en_content)

    return True

def main():
    zh_pages = get_chinese_pages()
    en_pages = get_english_pages()

    # Find missing pages
    en_set = set(str(p) for p in en_pages)
    missing = [p for p in zh_pages if str(p) not in en_set]

    print(f"Chinese pages: {len(zh_pages)}")
    print(f"English pages: {len(en_pages)}")
    print(f"Missing: {len(missing)}")

    # Generate missing pages
    created = 0
    for zh_path in missing:
        en_path = zh_path  # Same relative path
        if generate_english_page(zh_path, en_path):
            created += 1
            if created % 50 == 0:
                print(f"  Created {created} pages...")

    print(f"\nDone! Created {created} English stub pages.")

if __name__ == '__main__':
    main()
