/**
 * MDX component map for Astro's MDX integration.
 *
 * This module exports a components object that overrides default HTML elements
 * and provides named components for use in MDX files.
 *
 * Usage in MDX:
 *   import Admonition from '../../components/mdx/Admonition.astro';
 *   import Mermaid from '../../components/react/Mermaid';
 *   <Admonition type="warning">...</Admonition>
 *   <Mermaid code={`graph TD\n  A-->B`} />
 *
 * The `pre` override is applied globally -- all fenced code blocks
 * automatically get a copy button without explicit imports.
 */

import CodeBlock from "./CodeBlock.astro";

export default {
  pre: CodeBlock,
};
