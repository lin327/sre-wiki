import { posix } from 'node:path';
import { createHash } from 'node:crypto';
import { compile } from '@mdx-js/mdx';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { validateFrontmatter } from './content-metadata.mjs';
import remarkWikilinks from './remark-wikilinks.mjs';
import schema from './frontmatter.schema.json' with { type: 'json' };
import legacyBaseline from './legacy-canonical-baseline.json' with { type: 'json' };

const CATEGORIES = new Set([
  'linux', 'docker', 'kubernetes', 'runbooks', 'architectures', 'incidents', 'comparisons',
]);

function expectedLayout(filePath) {
  return posix.relative(posix.dirname(filePath), 'src/layouts/BaseLayout.astro');
}

function articleLocation(filePath) {
  const parts = filePath.split('/');
  if (parts[2] === 'en') parts.splice(2, 1);
  if (parts.length !== 4 || parts[0] !== 'src' || parts[1] !== 'pages'
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
  const frozenSeed = article && !isNew && frontmatter.canonical === true
    && legacyBaseline.files[path] === createHash('sha256').update(rawSource).digest('hex');
  if (frozenSeed) {
    warnings.push(`${path}: frozen legacy canonical seed needs metadata/review migration; any edit requires the full gate`);
  }
  const strictArticle = article && (isNew || (frontmatter.canonical === true && !frozenSeed));
  if (strictArticle) {
    if (frontmatter.canonical !== true) {
      errors.push('new published articles must be reviewed and set canonical: true');
    }
    if (frontmatter.category !== undefined && frontmatter.category !== article.category) {
      errors.push(`frontmatter.category must match the ${article.category} directory`);
    }
    const { layout, ...metadata } = frontmatter;
    try {
      validateFrontmatter(metadata, article.slug);
    } catch (error) {
      errors.push(error.message);
    }
    if (frontmatter.canonical === true) {
      const bodyRule = schema.$defs.canonicalBody;
      if ([...content.replace(/\s/g, '')].length < bodyRule.minLength) {
        errors.push(`canonical body must contain at least ${bodyRule.minLength} non-whitespace characters`);
      }
      if (!new RegExp(bodyRule.pattern).test(content)) {
        errors.push('canonical body must not contain 内容待补充');
      }
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
    if (strictArticle) errors.push(message);
    else warnings.push(message);
  }

  return { errors, warnings };
}

/** Inbox metadata uses the same schema but never grants publication approval. */
export function validateDraftPage(filePath, rawSource) {
  const errors = [];
  try {
    const { frontmatter } = parseFrontmatter(rawSource);
    if (frontmatter.canonical !== false) errors.push('inbox drafts must set canonical: false');
    if (legacyBaseline.inboxIndexes?.[filePath] === createHash('sha256').update(rawSource).digest('hex')) {
      return { errors, warnings: [`${filePath}: frozen historical inbox index is reference material, not a schema-compliant draft`] };
    }
    validateFrontmatter(frontmatter, posix.basename(filePath, '.mdx'));
  } catch (error) {
    errors.push(error.message);
  }
  return { errors, warnings: [] };
}
