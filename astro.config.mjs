import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://mihirmohite.in',
  trailingSlash: 'never',
  integrations: [mdx()],
  build: {
    format: 'directory',
  },
});
