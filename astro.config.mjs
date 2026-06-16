// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import wikilinks from './src/lib/remark-wikilinks.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://wiki.tentative.me',

  server: {
    host: '0.0.0.0',
  },

  i18n: {
    defaultLocale: "zh",
    locales: ["zh", "en"],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    react(),
    mdx({
      mdxComponents: {
        pre: './src/components/mdx/CodeBlock.astro',
      },
    }),
    sitemap(),
  ],

  markdown: {
    processor: unified({
      remarkPlugins: [wikilinks],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  }
});
