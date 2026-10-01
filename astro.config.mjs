import { defineConfig } from 'astro/config';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const projects = fileURLToPath(new URL('./projects/', import.meta.url));
const prepare = fileURLToPath(
  new URL('./scripts/prepare-projects.mjs', import.meta.url),
);

const site = process.env.SITE_URL || 'https://3dengelen.github.io';
const base = process.env.BASE_PATH ?? '/3DEngelen-portfolio/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  vite: {
    plugins: [
      {
        name: 'refresh-project-images',
        apply: 'serve',
        configureServer(server) {
          server.watcher.add(projects);
          let timer;
          server.watcher.on('all', (_event, file) => {
            if (!file.startsWith(projects)) return;
            clearTimeout(timer);
            timer = setTimeout(async () => {
              try {
                await execFileAsync(process.execPath, [prepare]);
                server.ws.send({ type: 'full-reload' });
              } catch (error) {
                console.error('Could not prepare project images:', error);
              }
            }, 200);
          });
        },
      },
    ],
  },
});
