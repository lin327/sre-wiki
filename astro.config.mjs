// @ts-check
import { defineConfig } from 'astro/config';
import { readFile, writeFile } from 'node:fs/promises';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import wikilinks from './src/lib/remark-wikilinks.mjs';
import { loadDiscoveryRoutes, isDiscoverable, prepareSearchHtml } from './src/lib/discovery-policy.mjs';

const discoveryRoutes = loadDiscoveryRoutes(new URL('./src/pages/', import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://pineapple-user.site',

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
    sitemap({ filter: (url) => isDiscoverable(url, discoveryRoutes) }),
    {
      name: 'canonical-discovery',
      hooks: {
        'astro:build:done': async ({ dir, logger }) => {
          for (const route of discoveryRoutes) {
            const file = new URL(route === '/' ? 'index.html' : `${route.slice(1)}/index.html`, dir);
            const html = await readFile(file, 'utf8');
            await writeFile(file, prepareSearchHtml(html, discoveryRoutes));
          }
          logger.info(`已标记 ${discoveryRoutes.size} 个精选或明确页面供 Pagefind 收录。`);
        },
      },
    },
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
