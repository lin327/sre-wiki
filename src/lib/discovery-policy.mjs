import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { fromHtml } from 'hast-util-from-html';

function normalizeRoute(url) {
  try {
    const pathname = new URL(url, 'https://discovery.invalid').pathname;
    return pathname.split('/').map((part) => encodeURIComponent(decodeURIComponent(part)))
      .join('/').replace(/\/+$/, '') || '/';
  } catch {
    return null;
  }
}

/** Read only the supplied pages tree; drafts elsewhere never become routes. */
export function loadDiscoveryRoutes(pagesDir) {
  const root = typeof pagesDir === 'string' ? pagesDir : fileURLToPath(pagesDir);
  const routes = new Set(['/', '/about', '/privacy']);
  function scan(directory, segments = []) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        scan(path, [...segments, entry.name]);
      } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
        const { frontmatter } = parseFrontmatter(readFileSync(path, 'utf8'));
        if (frontmatter.canonical !== true) continue;
        const name = entry.name.replace(/\.mdx?$/, '');
        const parts = name === 'index' ? segments : [...segments, name];
        routes.add(normalizeRoute('/' + parts.map(encodeURIComponent).join('/')));
      }
    }
  }
  scan(root);
  return routes;
}

/** Match exact route paths, including full sitemap URLs and encoded paths. */
export function isDiscoverable(url, routes) {
  const route = normalizeRoute(url);
  return route !== null && routes.has(route);
}

/** Mark generated HTML without reserializing or changing its visible content. */
export function prepareSearchHtml(html, routes) {
  const insertions = [];
  let hasMain = false;
  function mark(node, attribute) {
    const start = node.position?.start.offset;
    const opening = start === undefined ? null : html.slice(start).match(/^<(?:[^>"']|"[^"]*"|'[^']*')*>/);
    if (!opening) throw new Error('Cannot locate search marker opening tag');
    insertions.push({ offset: start + opening[0].length - 1, text: ` ${attribute}` });
  }
  function visit(node) {
    if (node.type === 'element') {
      if (node.tagName === 'main') {
        hasMain = true;
        if (!('dataPagefindBody' in node.properties)) mark(node, 'data-pagefind-body');
      }
      const href = node.properties.href;
      if (node.tagName === 'a' && typeof href === 'string' && /^\/(?![\\/])/.test(href)
        && !isDiscoverable(href, routes) && !('dataPagefindIgnore' in node.properties)) {
        mark(node, 'data-pagefind-ignore="all"');
      }
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(fromHtml(html));
  if (!hasMain) throw new Error('Discoverable page is missing a <main> element');
  for (const { offset, text } of insertions.sort((a, b) => b.offset - a.offset)) {
    html = html.slice(0, offset) + text + html.slice(offset);
  }
  return html;
}
