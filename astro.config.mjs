import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://3dengelen.github.io';
const base = process.env.BASE_PATH ?? '/3DEngelen-portfolio/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
});
