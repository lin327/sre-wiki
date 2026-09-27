import { visit } from 'unist-util-visit';
import { resolveWikilink } from './route-index.mjs';

const WIKILINK_RE = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

export function parseWikilinks(text) {
  const links = [];
  for (const match of text.matchAll(WIKILINK_RE)) {
    links.push({
      raw: match[0],
      target: match[1].trim(),
      label: match[2]?.trim(),
      index: match.index,
    });
  }
  return links;
}

/** Resolve wikilinks against static page routes, retaining a safe legacy fallback. */
export default function remarkWikilinks({ routeIndex, onUnresolved } = {}) {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null || !node.value.includes('[[')) return;

      const links = parseWikilinks(node.value);
      if (links.length === 0) return;
      const children = [];
      let lastIndex = 0;

      for (const link of links) {
        if (link.index > lastIndex) {
          children.push({ type: 'text', value: node.value.slice(lastIndex, link.index) });
        }

        const resolution = routeIndex ? resolveWikilink(link.target, routeIndex) : null;
        if (routeIndex && !resolution.ok) {
          onUnresolved?.({ ...link, reason: resolution.reason, line: node.position?.start.line ?? 1 });
        }
        const fallback = `/${link.target.split('/').map(encodeURIComponent).join('/')}`;
        children.push({
          type: 'link',
          url: resolution?.ok ? resolution.href : fallback,
          children: [{ type: 'text', value: link.label || link.target }],
        });
        lastIndex = link.index + link.raw.length;
      }

      if (lastIndex < node.value.length) children.push({ type: 'text', value: node.value.slice(lastIndex) });
      parent.children.splice(index, 1, ...children);
      return index + children.length;
    });
  };
}
