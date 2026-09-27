import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from '@mdx-js/mdx';
import { parseFrontmatter } from '@astrojs/markdown-remark';

const EXECUTABLE_NODES = new Set([
  'mdxjsEsm',
  'mdxFlowExpression',
  'mdxTextExpression',
  'mdxJsxFlowElement',
  'mdxJsxTextElement',
]);

// These existing pages intentionally use hand-maintained Astro/React components.
// Keep this list exact; generated and newly promoted pages are not trusted by default.
export const SAFE_MDX_ALLOWLIST = new Set([
  'src/pages/architectures/index.mdx',
  'src/pages/comparisons/index.mdx',
  'src/pages/docker/index.mdx',
  'src/pages/incidents/index.mdx',
  'src/pages/kubernetes/index.mdx',
  'src/pages/mermaid/index.mdx',
  'src/pages/runbooks/index.mdx',
  'src/pages/en/linux/process-model.mdx',
  'src/pages/en/runbooks/crashloopbackoff.mdx',
  'src/pages/en/runbooks/imagepullbackoff.mdx',
  'src/pages/en/runbooks/oomkilled.mdx',
  'src/pages/linux/process-model.mdx',
  'src/pages/kubernetes/pod-lifecycle.mdx',
  'src/pages/kubernetes/service-mesh.mdx',
  'src/pages/runbooks/crashloopbackoff.mdx',
  'src/pages/runbooks/imagepullbackoff.mdx',
  'src/pages/runbooks/oomkilled.mdx',
]);

export function isSafeMdxAllowlisted(filePath) {
  return SAFE_MDX_ALLOWLIST.has(filePath.replaceAll('\\', '/'));
}

/** Parse without evaluating and report MDX nodes that can execute code/components. */
export async function findExecutableMdxNodes(filePath, rawSource) {
  const allowlisted = isSafeMdxAllowlisted(filePath);
  const { content } = parseFrontmatter(rawSource);
  const found = [];
  await compile({ path: filePath, value: content }, {
    remarkPlugins: [() => (tree) => {
      function visit(node) {
        if (EXECUTABLE_NODES.has(node.type)) {
          found.push({ type: node.type, line: node.position?.start.line ?? 1 });
        }
        for (const child of node.children ?? []) visit(child);
      }
      visit(tree);
    }],
  });
  return allowlisted ? [] : found;
}

function listChangedPages(base, head) {
  const output = base && !/^0+$/.test(base)
    ? execFileSync('git', ['diff', '--name-only', '-z', base, head, '--', 'src/pages'], { encoding: 'utf8' })
    : execFileSync('git', ['ls-files', '-z', '--', 'src/pages'], { encoding: 'utf8' });
  return output.split('\0').filter((file) => file.endsWith('.mdx') && existsSync(file));
}

async function main() {
  const { values } = parseArgs({
    options: {
      base: { type: 'string' },
      head: { type: 'string' },
    },
  });
  if (!values.base || !values.head) {
    throw new Error('Usage: node scripts/check-safe-mdx.mjs --base <sha> --head <sha>');
  }

  const files = listChangedPages(values.base, values.head);
  let failures = 0;
  for (const file of files) {
    try {
      const nodes = await findExecutableMdxNodes(file, readFileSync(file, 'utf8'));
      for (const node of nodes) {
        failures += 1;
        console.error(`${file}:${node.line}: rejected executable MDX node ${node.type}`);
      }
    } catch (error) {
      failures += 1;
      console.error(`${file}: could not safely parse MDX: ${error.message}`);
    }
  }

  const allowlisted = files.filter(isSafeMdxAllowlisted).length;
  if (failures) {
    console.error(`Rejected ${failures} unsafe MDX node(s) across ${files.length} changed page(s).`);
    process.exitCode = 1;
    return;
  }
  console.log(`Validated ${files.length} changed MDX page(s); ${allowlisted} trusted component page(s) used the explicit allowlist.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
