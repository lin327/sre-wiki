import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unified } from 'unified';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import { loadWikiRouteIndex, resolveWikilink } from '../src/lib/route-index.mjs';
import { parseWikilinks } from '../src/lib/remark-wikilinks.mjs';

const pagesDirectory = fileURLToPath(new URL('../src/pages/', import.meta.url));
const docsDirectory = fileURLToPath(new URL('../docs/', import.meta.url));
const reportPath = join(docsDirectory, 'broken-links-report.md');
const routeIndex = loadWikiRouteIndex(pagesDirectory);
const routeByFile = new Map();
const nginxRedirectAliases = new Map([
  ['/SLI', '/sli'],
  ['/SLO', '/slo'],
]);

for (const [route, files] of routeIndex.routeFiles) {
  for (const file of files) routeByFile.set(file, route);
}

const processor = unified().use(remarkParse).use(remarkMdx);
const brokenLinks = new Map();
const resolvedRoutes = new Map();
const redirectedAliases = new Map();
const placeholderRoutes = new Set();
const totals = { files: 0, references: 0, resolved: 0, redirected: 0, unresolved: 0 };
const parseErrors = [];

function fallbackHref(target) {
  return `/${target.split('/').map(encodeURIComponent).join('/')}`;
}

function compareText(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

async function scanDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((a, b) => compareText(a.name, b.name));

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await scanDirectory(path);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;

    totals.files += 1;
    const source = await readFile(path, 'utf8');
    const pageRoute = routeByFile.get(path) ?? `/${relative(pagesDirectory, path).replace(/\\/g, '/')}`;
    if (/^canonical:\s*false\s*$/m.test(source) && /\n内容待补充。?\s*$/.test(source)) {
      placeholderRoutes.add(pageRoute);
    }
    let tree;
    try {
      tree = processor.parse(source);
    } catch (error) {
      parseErrors.push(`${relative(pagesDirectory, path)}: ${error.message}`);
      continue;
    }

    visit(tree, 'text', (node) => {
      for (const link of parseWikilinks(node.value)) {
        totals.references += 1;
        const result = resolveWikilink(link.target, routeIndex);
        if (result.ok) {
          totals.resolved += 1;
          const resolvedRow = resolvedRoutes.get(result.href) ?? { count: 0, pages: new Set() };
          resolvedRow.count += 1;
          resolvedRow.pages.add(pageRoute);
          resolvedRoutes.set(result.href, resolvedRow);
          continue;
        }

        const href = fallbackHref(link.target);
        const redirectTarget = nginxRedirectAliases.get(href);
        if (redirectTarget && routeIndex.routeFiles.has(redirectTarget)) {
          totals.redirected += 1;
          const aliasRow = redirectedAliases.get(href) ?? { target: redirectTarget, count: 0, pages: new Set() };
          aliasRow.count += 1;
          aliasRow.pages.add(pageRoute);
          redirectedAliases.set(href, aliasRow);
          continue;
        }

        totals.unresolved += 1;
        const key = `${href}\u0000${result.reason}`;
        const row = brokenLinks.get(key) ?? {
          href,
          reason: result.reason,
          count: 0,
          targets: new Set(),
          pages: new Set(),
        };
        row.count += 1;
        row.targets.add(link.target);
        row.pages.add(pageRoute);
        brokenLinks.set(key, row);
      }
    });
  }
}

function code(value) {
  return `\`${value.replaceAll('`', '\\`')}\``;
}

await scanDirectory(pagesDirectory);

if (parseErrors.length) {
  throw new Error(`无法解析 ${parseErrors.length} 个 MDX 文件：\n${parseErrors.join('\n')}`);
}

const sortedRows = [...brokenLinks.values()].sort((a, b) => b.count - a.count || compareText(a.href, b.href));
const missingRows = sortedRows.filter((row) => row.reason === 'missing route');
const otherRows = sortedRows.filter((row) => row.reason !== 'missing route');
const topTwenty = missingRows.slice(0, 20);
const lines = [
  '# 站内坏链报告',
  '',
  '> 由 `node scripts/report-broken-links.mjs` 生成。扫描 `src/pages/**/*.mdx` 的 MDX AST 文本节点，并复用 `src/lib/route-index.mjs` 的 wikilink 解析规则；代码块中的示例不计入。',
  '',
  '## 扫描摘要',
  '',
  `- 扫描 MDX 页面：${totals.files}`,
  `- Wikilink 引用：${totals.references}`,
  `- 由路由表直接解析：${totals.resolved}`,
  `- 由 Nginx 大小写别名处理：${totals.redirected}`,
  `- 未解析引用：${totals.unresolved}`,
  `- 缺失 URL：${missingRows.length} 个（${missingRows.reduce((sum, row) => sum + row.count, 0)} 次引用）`,
  `- 歧义或格式问题：${otherRows.length} 个 URL（${otherRows.reduce((sum, row) => sum + row.count, 0)} 次引用）`,
];

if (placeholderRoutes.size) {
  lines.push('', '## 待补充占位页面', '');
  for (const route of [...placeholderRoutes].sort(compareText)) {
    const resolved = resolvedRoutes.get(route);
    lines.push(`- ${code(route)} — ${resolved?.count ?? 0} 次引用，${resolved?.pages.size ?? 0} 个引用页面`);
  }
}

if (redirectedAliases.size) {
  lines.push('', '## Nginx 大小写兼容别名', '');
  for (const [alias, row] of [...redirectedAliases].sort(([a], [b]) => compareText(a, b))) {
    lines.push(`- ${code(alias)} → ${code(row.target)} — ${row.count} 次引用，${row.pages.size} 个引用页面`);
  }
}

lines.push('', '## 当前优先处理的 20 个缺失 URL', '');
for (const row of topTwenty) lines.push(`- ${code(row.href)} — ${row.count} 次`);

lines.push('', '## 缺失 URL 明细（按引用次数降序）', '');

for (const row of missingRows) {
  const targets = [...row.targets].sort(compareText).map(code).join(', ');
  const pages = [...row.pages].sort(compareText).map(code).join(', ');
  lines.push(`### ${code(row.href)} — ${row.count} 次`, '', `- Wikilink target：${targets}`, `- 引用页面（${row.pages.size}）：${pages}`, '');
}

if (otherRows.length) {
  lines.push('## 需要人工消歧或修正的引用', '');
  for (const row of otherRows) {
    const targets = [...row.targets].sort(compareText).map(code).join(', ');
    const pages = [...row.pages].sort(compareText).map(code).join(', ');
    lines.push(`### ${code(row.href)} — ${row.count} 次（${row.reason}）`, '', `- Wikilink target：${targets}`, `- 引用页面（${row.pages.size}）：${pages}`, '');
  }
}

await mkdir(docsDirectory, { recursive: true });
await writeFile(reportPath, `${lines.join('\n').trimEnd()}\n`);
console.log(`坏链报告已写入 ${relative(process.cwd(), reportPath)}：扫描 ${totals.files} 页，发现 ${missingRows.length} 个缺失 URL、${otherRows.length} 个其他未解析 URL。`);
