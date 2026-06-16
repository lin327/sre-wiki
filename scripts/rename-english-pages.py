#!/usr/bin/env python3
"""
Rename English MDX pages from Chinese filenames to English slugs.
Uses the page's own frontmatter title to generate the new filename.
Also updates wikilinks across all English pages.
"""

import os
import re
import sys
from pathlib import Path
from unicodedata import normalize

PAGES_DIR = Path("/Users/pineapple/Desktop/workspace/Projects/my-GitHub/wiki/src/pages/en")

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    # Remove file extension if present
    text = text.replace(".mdx", "").replace(".md", "")
    # Convert to lowercase
    text = text.lower()
    # Replace common separators with hyphens
    text = re.sub(r'[\s_]+', '-', text)
    # Remove any non-alphanumeric, non-hyphen characters
    text = re.sub(r'[^a-z0-9-]', '', text)
    # Collapse multiple hyphens
    text = re.sub(r'-+', '-', text)
    # Strip leading/trailing hyphens
    text = text.strip('-')
    return text

def extract_title(content: str) -> str:
    """Extract title from MDX frontmatter."""
    match = re.search(r'^title:\s*["\']?(.+?)["\']?\s*$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    # Try h1
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return ""

def has_chinese(text: str) -> bool:
    """Check if text contains Chinese characters."""
    return bool(re.search(r'[一-鿿]', text))

def build_rename_map() -> dict[str, str]:
    """Build mapping of old filename -> new filename."""
    rename_map = {}

    for mdx_file in sorted(PAGES_DIR.rglob("*.mdx")):
        old_name = mdx_file.name
        if not has_chinese(old_name):
            continue

        # Read file to get title
        try:
            content = mdx_file.read_text(encoding="utf-8")
        except Exception:
            continue

        title = extract_title(content)
        if not title:
            # Use filename as fallback, removing Chinese chars
            title = old_name.replace(".mdx", "")

        # Generate slug from title
        new_name = slugify(title) + ".mdx"

        if not new_name or new_name == ".mdx":
            print(f"  SKIP (empty slug): {old_name}")
            continue

        if new_name == old_name:
            continue

        # Check for collisions
        rel_path = mdx_file.relative_to(PAGES_DIR)
        new_path = mdx_file.parent / new_name

        if new_path.exists() and new_path != mdx_file:
            # Add a numeric suffix to avoid collision
            base = new_name.replace(".mdx", "")
            counter = 2
            while new_path.exists():
                new_name = f"{base}-{counter}.mdx"
                new_path = mdx_file.parent / new_name
                counter += 1

        rename_map[str(rel_path)] = str(rel_path.parent / new_name)

    return rename_map

def apply_renames(rename_map: dict[str, str]) -> None:
    """Apply file renames."""
    for old_rel, new_rel in rename_map.items():
        old_path = PAGES_DIR / old_rel
        new_path = PAGES_DIR / new_rel

        if not old_path.exists():
            print(f"  WARN: {old_path} not found")
            continue

        # Create parent directory if needed
        new_path.parent.mkdir(parents=True, exist_ok=True)

        old_path.rename(new_path)
        print(f"  {old_rel} -> {new_rel}")

def update_wikilinks(rename_map: dict[str, str]) -> None:
    """Update wikilinks in all English MDX pages."""
    # Build a mapping from old slug to new slug for wikilinks
    slug_map = {}
    for old_rel, new_rel in rename_map.items():
        old_slug = old_rel.replace(".mdx", "")
        new_slug = new_rel.replace(".mdx", "")
        # Get just the filename part without directory
        old_basename = Path(old_rel).stem
        new_basename = Path(new_rel).stem
        slug_map[old_basename] = new_basename
        slug_map[old_slug] = new_slug

    updated_files = 0
    updated_links = 0

    for mdx_file in PAGES_DIR.rglob("*.mdx"):
        try:
            content = mdx_file.read_text(encoding="utf-8")
        except Exception:
            continue

        new_content = content
        for old_slug, new_slug in slug_map.items():
            if old_slug == new_slug:
                continue
            # Update wikilinks: [[old-slug]] and [[old-slug|label]]
            old_pattern = f"[[{old_slug}]]"
            new_replacement = f"[[{new_slug}]]"
            if old_pattern in new_content:
                new_content = new_content.replace(old_pattern, new_replacement)
                updated_links += 1

            # With label
            old_pattern_pipe = f"[[{old_slug}|"
            if old_pattern_pipe in new_content:
                new_content = new_content.replace(old_pattern_pipe, f"[[{new_slug}|")
                updated_links += 1

        if new_content != content:
            mdx_file.write_text(new_content, encoding="utf-8")
            updated_files += 1

    print(f"\nUpdated {updated_links} wikilinks in {updated_files} files")

def main():
    print("=== Renaming English pages with Chinese filenames ===\n")

    # Step 1: Build rename map
    print("Building rename map...")
    rename_map = build_rename_map()
    print(f"Found {len(rename_map)} files to rename\n")

    if not rename_map:
        print("Nothing to rename!")
        return

    # Step 2: Show preview
    print("Preview of changes:")
    for old_rel, new_rel in sorted(rename_map.items())[:10]:
        print(f"  {old_rel} -> {new_rel}")
    if len(rename_map) > 10:
        print(f"  ... and {len(rename_map) - 10} more")

    # Step 3: Apply renames
    print(f"\nRenaming {len(rename_map)} files...")
    apply_renames(rename_map)

    # Step 4: Update wikilinks
    print("\nUpdating wikilinks...")
    update_wikilinks(rename_map)

    print("\nDone!")

if __name__ == "__main__":
    main()
