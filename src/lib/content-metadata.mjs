import { parseFrontmatter } from '@astrojs/markdown-remark';
import schema from './frontmatter.schema.json' with { type: 'json' };

const categories = schema.properties.category.enum;
const defaultType = (category) => ({
  runbooks: 'runbook', architectures: 'architecture', incidents: 'incident', comparisons: 'comparison',
})[category] ?? 'concept';

function isHttpUrl(value) {
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value) || /\s|[\x00-\x1f\x7f]/.test(value)) return false;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function dateString(value) {
  const text = typeof value?.toISOString === 'function' ? value.toISOString().slice(0, 10) : value;
  if (typeof text !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(text) || text.startsWith('0000-')) return '';
  const date = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(text) ? text : '';
}

/** Validate the keywords used by frontmatter.schema.json; no coercion for new drafts. */
export function validateFrontmatter(metadata, slug) {
  function check(value, rule, path) {
    const type = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
    if (type !== rule.type) throw new Error(`${path}: expected ${rule.type}`);
    if (rule.enum && !rule.enum.includes(value)) throw new Error(`${path}: invalid value`);
    if (type === 'object') {
      for (const field of rule.required ?? []) {
        if (!(field in value)) throw new Error(`${path}.${field}: required`);
      }
      for (const [field, entry] of Object.entries(value)) {
        if (!rule.properties[field]) throw new Error(`${path}.${field}: unknown field`);
        check(entry, rule.properties[field], `${path}.${field}`);
      }
    } else if (type === 'array') {
      value.forEach((entry, index) => check(entry, rule.items, `${path}[${index}]`));
    } else if (type === 'string') {
      if (rule.minLength && value.trim().length < rule.minLength) throw new Error(`${path}: empty`);
      if (rule.pattern && new RegExp(rule.pattern).exec(value)?.[0] !== value) throw new Error(`${path}: invalid format`);
      if (rule.format === 'date' && !dateString(value)) throw new Error(`${path}: invalid date`);
      if (rule.format === 'uri' && !isHttpUrl(value)) throw new Error(`${path}: expected HTTP(S) URL`);
    }
  }
  check(metadata, schema, 'frontmatter');
  check(slug, schema.$defs.slug, 'slug');
  return metadata;
}

/** Read legacy metadata without rewriting files or trusting historical category values. */
export function readContentMetadata(raw, category) {
  if (!categories.includes(category)) throw new Error(`Unknown category: ${category}`);
  const { frontmatter: data } = parseFrontmatter(raw);
  if (typeof data.title !== 'string' || !data.title.trim()) throw new Error('frontmatter.title: required');
  const updated = dateString(data.updated) || dateString(data.lastUpdated);
  const sources = (Array.isArray(data.sources) ? data.sources : []).flatMap((source) => {
    const url = typeof source === 'string' ? source : source?.url;
    if (typeof url !== 'string' || !isHttpUrl(url)) return [];
    return [{ url, title: typeof source?.title === 'string' && source.title.trim() ? source.title.trim() : url }];
  });
  return {
    title: data.title.trim(),
    description: typeof data.description === 'string' ? data.description : '',
    canonical: data.canonical === true,
    category,
    created: dateString(data.created) || updated,
    updated,
    sources,
    type: schema.properties.type.enum.includes(data.type) ? data.type : defaultType(category),
    confidence: schema.properties.confidence.enum.includes(data.confidence) ? data.confidence : 'low',
    tags: [...new Set((Array.isArray(data.tags) ? data.tags : [])
      .filter((tag) => typeof tag === 'string' && tag.trim()).map((tag) => tag.trim()))],
  };
}

export function getCategoryArticles(rawPages, category) {
  if (!categories.includes(category)) throw new Error(`Unknown category: ${category}`);
  return Object.entries(rawPages).flatMap(([path, raw]) => {
    const segments = path.split('/');
    const filename = segments.pop();
    if (segments.pop() !== category || filename === 'index.mdx' || !filename.endsWith('.mdx')) return [];
    return [{ ...readContentMetadata(raw, category), slug: filename.slice(0, -4) }];
  }).sort((a, b) => Number(b.canonical) - Number(a.canonical)
    || a.title.localeCompare(b.title) || a.slug.localeCompare(b.slug));
}
