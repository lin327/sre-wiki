// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import wikilinks from './src/lib/remark-wikilinks.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    mdx({
      mdxComponents: {
        pre: './src/components/mdx/CodeBlock.astro',
      },
    }),
  ],

  markdown: {
    processor: unified({
      remarkPlugins: [wikilinks],
    }),
  },

  vite: {
    plugins: [tailwindcss()]
  }
});