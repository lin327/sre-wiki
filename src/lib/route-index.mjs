import { readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PAGE_EXTENSIONS = new Set(['.astro', '.md', '.mdx']);

function routeFromSegments(segments) {
  const encoded = segments.filter(Boolean).map((segment) => encodeURIComponent(segment));
  return encoded.length ? `/${encoded.join('/')}` : '/';
}

export function createRouteIndex(routes) {
  const routeFiles = new Map();
  const bySlug = new Map();

  for (const entry of routes) {
    const route = entry.route.replace(/\/+$/, '') || '/';
    const files = routeFiles.get(route) ?? [];
    files.push(entry.file ?? route);
    routeFiles.set(route, files);

    if (entry.slug) {
      const matches = bySlug.get(entry.slug) ?? [];
      if (!matches.includes(route)) matches.push(route);
      bySlug.set(entry.slug, matches);
    }
  }

  return { routeFiles, bySlug };
}

/** Index static Astro routes; dynamic routes cannot be resolved from a wikilink. */
export function loadWikiRouteIndex(pagesDirectory) {
  const root = typeof pagesDirectory === 'string' ? pagesDirectory : fileURLToPath(pagesDirectory);
  const routes = [];

  function scan(directory, segments = []) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.')) scan(path, [...segments, entry.name]);
        continue;
      }
      if (!entry.isFile() || !PAGE_EXTENSIONS.has(extname(entry.name))) continue;

      const name = entry.name.slice(0, -extname(entry.name).length);
      const routeSegments = name === 'index' ? segments : [...segments, name];
      if (routeSegments.some((segment) => /^\[.*\]$/.test(segment))) continue;
      routes.push({
        route: routeFromSegments(routeSegments),
        slug: name === 'index' ? segments.at(-1) : name,
        file: path,
      });
    }
  }

  scan(root);
  return createRouteIndex(routes);
}

/** Resolve `[[category/slug]]` exactly or a unique legacy `[[slug]]`. */
export function resolveWikilink(target, routeIndex) {
  const value = target.trim();
  if (!value || value.startsWith('/') || value.includes('\\') || /[?#\x00-\x1f]/.test(value)) {
    return { ok: false, reason: 'invalid target' };
  }

  const parts = value.split('/');
  if (parts.some((part) => !part || part === '.' || part === '..')) {
    return { ok: false, reason: 'invalid target' };
  }

  if (parts.length === 2) {
    const route = routeFromSegments(parts);
    if (!routeIndex.routeFiles.has(route)) return { ok: false, reason: 'missing route' };
    if (routeIndex.routeFiles.get(route).length > 1) return { ok: false, reason: 'ambiguous route' };
    return { ok: true, route, href: route };
  }

  if (parts.length !== 1) return { ok: false, reason: 'use category/slug syntax' };
  const matches = routeIndex.bySlug.get(value) ?? [];
  if (matches.length === 0) return { ok: false, reason: 'missing route' };
  if (matches.length > 1) return { ok: false, reason: 'ambiguous slug' };
  const [route] = matches;
  if (routeIndex.routeFiles.get(route)?.length > 1) return { ok: false, reason: 'ambiguous route' };
  return { ok: true, route, href: route };
}
