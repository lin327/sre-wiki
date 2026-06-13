/**
 * MDX component map for Astro's MDX integration.
 *
 * This module exports a components object that overrides default HTML elements
 * and provides named components for use in MDX files.
 *
 * Usage in MDX:
 *   import Admonition from '../../components/mdx/Admonition.astro';
 *   import Callout from '../../components/mdx/Callout.astro';
 *   import Badge from '../../components/mdx/Badge.astro';
 *   import Card from '../../components/mdx/Card.astro';
 *
 *   <Admonition type="warning">...</Admonition>
 *   <Callout variant="success">Quick note here.</Callout>
 *   <Badge type="docker" />
 *   <Card title="Guide" description="..." href="/docs" />
 *
 * The `pre` override is applied globally -- all fenced code blocks
 * automatically get a copy button without explicit imports.
 */

import CodeBlock from "./CodeBlock.astro";
import Mermaid from "../react/Mermaid.tsx";

export default {
  pre: CodeBlock,
  Mermaid,
};
