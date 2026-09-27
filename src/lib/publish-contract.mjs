import { posix } from 'node:path';
import { compile } from '@mdx-js/mdx';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { validateFrontmatter } from './content-metadata.mjs';
import remarkWikilinks from './remark-wikilinks.mjs';

const CATEGORIES = new Set([
  'linux', 'docker', 'kubernetes', 'runbooks', 'architectures', 'incidents', 'comparisons',
]);

function expectedLayout(filePath) {
  return posix.relative(posix.dirname(filePath), 'src/layouts/BaseLayout.astro');
}

function articleLocation(filePath) {
  const parts = filePath.split('/');
  if (parts.length !== 4 || parts[0] !== 'src' || parts[1] !== 'pages' || parts[2] === 'en'
    || !CATEGORIES.has(parts[2]) || parts[3] === 'index.mdx') return null;
  return { category: parts[2], slug: parts[3].replace(/\.mdx$/, '') };
}

/** Validate changed pages while leaving untouched legacy content on a migration baseline. */
export async function validatePublishPage(filePath, rawSource, { isNew = false, routeIndex } = {}) {
  const path = filePath.replaceAll('\\', '/').replace(/^\.\//, '');
  const errors = [];
  const warnings = [];
  let frontmatter;
  let content;

  try {
    ({ frontmatter, content } = parseFrontmatter(rawSource));
  } catch (error) {
    return { errors: [`could not parse frontmatter: ${error.message}`], warnings };
  }

  if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    return { errors: ['frontmatter must be an object'], warnings };
  }

  if (frontmatter.layout !== expectedLayout(path)) {
    errors.push(`layout must resolve to src/layouts/BaseLayout.astro (expected "${expectedLayout(path)}")`);
  }

  const article = articleLocation(path);
  if (isNew && article) {
    if (frontmatter.canonical !== true) {
      errors.push('new published articles must be reviewed and set canonical: true');
    }
    if (frontmatter.category !== article.category) {
      errors.push(`frontmatter.category must match the ${article.category} directory`);
    }
    const { layout, ...metadata } = frontmatter;
    try {
      validateFrontmatter(metadata, article.slug);
    } catch (error) {
      errors.push(error.message);
    }
  }

  const unresolved = [];
  try {
    await compile({ path, value: content }, {
      remarkPlugins: [[remarkWikilinks, {
        routeIndex,
        onUnresolved: (link) => unresolved.push(link),
      }]],
    });
  } catch (error) {
    errors.push(`could not parse MDX: ${error.message}`);
    return { errors, warnings };
  }

  for (const link of unresolved) {
    const message = `${path}:${link.line}: wikilink "${link.target}" ${link.reason}`;
    if (isNew && article) errors.push(message);
    else warnings.push(message);
  }

  return { errors, warnings };
}
