import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const project = `---
title: 'Workshop organizer'
description: 'A compact organizer made for a shared workshop. It keeps common tools close at hand.'
hero: 'pictures/01-organizer.svg'
featured: true
tags: ['Workshop', 'Storage']
printers: ['Example Printer XL']
materials:
  - name: PETG
    brand: Example Filament
    grade: Black
resources:
  - type: model
    label: Source files
    url: 'https://example.com/model'
gallery:
  01-organizer.svg:
    alt: A black workshop organizer holding hex keys
    caption: Installed beside a workbench
  02-detail.svg:
    alt: The organizer mounted beside hand tools
---

## Notes

The second sentence remains available on the project page.
`;
const picture =
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="black"/></svg>';
const minimalProject = `---
title: 'Simple hook'
description: 'A finished hook for a small workshop.'
hero: 'pictures/01-hook.svg'
gallery:
  01-hook.svg:
    alt: A simple hook fixed beside a workbench
---
`;

test('builds a minimal project page and concise listing card', async (t) => {
  const site = await mkdtemp(join(tmpdir(), '3dengelen-site-'));
  t.after(() => rm(site, { recursive: true, force: true }));

  for (const name of [
    'astro.config.mjs',
    'package.json',
    'tsconfig.json',
    'src',
    'scripts',
  ]) {
    await cp(join(root, name), join(site, name), { recursive: true });
  }
  await symlink(join(root, 'node_modules'), join(site, 'node_modules'));

  const pictures = join(site, 'projects/workshop-organizer/pictures');
  await mkdir(pictures, { recursive: true });
  await writeFile(join(pictures, '01-organizer.svg'), picture);
  await writeFile(join(pictures, '02-detail.svg'), picture);
  await writeFile(
    join(site, 'projects/workshop-organizer/project.md'),
    project,
  );
  const minimalPictures = join(site, 'projects/simple-hook/pictures');
  await mkdir(minimalPictures, { recursive: true });
  await writeFile(join(minimalPictures, '01-hook.svg'), picture);
  await writeFile(
    join(site, 'projects/simple-hook/project.md'),
    minimalProject,
  );

  execFileSync('npm', ['run', 'build'], {
    cwd: site,
    env: { ...process.env, SITE_URL: 'https://example.com', BASE_PATH: '/' },
    stdio: 'pipe',
  });

  const detail = await readFile(
    join(site, 'dist/projects/workshop-organizer/index.html'),
    'utf8',
  );
  const listing = await readFile(
    join(site, 'dist/projects/index.html'),
    'utf8',
  );
  const home = await readFile(join(site, 'dist/index.html'), 'utf8');
  const about = await readFile(join(site, 'dist/about/index.html'), 'utf8');
  const minimal = await readFile(
    join(site, 'dist/projects/simple-hook/index.html'),
    'utf8',
  );

  assert.match(detail, /Workshop organizer/);
  assert.match(detail, /A compact organizer made for a shared workshop/);
  assert.match(detail, /The second sentence remains available/);
  assert.match(detail, /Example Printer XL/);
  assert.match(detail, /Example Filament/);
  assert.match(detail, /Source files/);
  assert.equal(
    detail.match(/alt="A black workshop organizer holding hex keys"/g)?.length,
    2,
  );
  assert.match(detail, /alt="The organizer mounted beside hand tools"/);
  assert.match(
    detail,
    /name="description" content="A compact organizer made for a shared workshop\."/,
  );
  assert.match(
    detail,
    /property="og:description" content="A compact organizer made for a shared workshop\."/,
  );
  assert.match(detail, /property="og:image"/);
  assert.match(
    detail,
    /https:\/\/example\.com\/projects\/workshop-organizer\//,
  );
  assert.match(listing, /A compact organizer made for a shared workshop\./);
  assert.doesNotMatch(listing, /The second sentence remains available/);
  assert.match(listing, /Workshop/);
  assert.match(listing, /data-filter="workshop"/);
  assert.match(listing, /data-tags=/);
  assert.match(listing, /alt="A black workshop organizer holding hex keys"/);
  assert.match(home, /Workshop organizer/);
  assert.match(home, /href="#listing-title"/);
  assert.match(about, /Creality K1C/);
  assert.match(about, /Creality K2 Pro with CFS/);
  assert.match(about, /Bambu Lab A1 mini/);
  assert.match(about, /Polymaker, Bambu Lab, Creality, Landu, and Flashforge/);
  assert.match(about, /href="mailto:3DEngelen@gmail\.com"/);
  assert.doesNotMatch(about, /PLACEHOLDER/);
  const featuredSection = home
    .split('<section class="carousel-section')[1]
    ?.split('</section>')[0];
  assert.match(featuredSection, /Workshop organizer/);
  assert.doesNotMatch(featuredSection, /Simple hook/);
  assert.match(minimal, /Simple hook/);
  assert.match(minimal, /alt="A simple hook fixed beside a workbench"/);
  assert.doesNotMatch(minimal, /A CLOSER LOOK/);
  assert.doesNotMatch(minimal, /Completed/);
  await assert.rejects(
    readFile(join(site, 'dist/projects/demo-fixture-study/index.html')),
  );

  await writeFile(
    join(site, 'projects/workshop-organizer/project.md'),
    project.replace(
      'A compact organizer made for a shared workshop. It keeps common tools close at hand.',
      Array.from({ length: 11 }, (_, index) => `Sentence ${index + 1}.`).join(
        ' ',
      ),
    ),
  );
  assert.throws(
    () =>
      execFileSync('npm', ['run', 'check'], {
        cwd: site,
        env: process.env,
        stdio: 'pipe',
      }),
    (error) =>
      error.stderr
        .toString()
        .includes('Description must be between one and ten sentences.'),
  );

  await rm(join(site, 'projects'), { recursive: true, force: true });
  execFileSync('npm', ['run', 'check'], {
    cwd: site,
    env: { ...process.env, SITE_URL: 'https://example.com', BASE_PATH: '/' },
    stdio: 'pipe',
  });
  execFileSync('npm', ['run', 'build'], {
    cwd: site,
    env: { ...process.env, SITE_URL: 'https://example.com', BASE_PATH: '/' },
    stdio: 'pipe',
  });
  const emptyHome = await readFile(join(site, 'dist/index.html'), 'utf8');
  const emptyListing = await readFile(
    join(site, 'dist/projects/index.html'),
    'utf8',
  );
  assert.match(emptyListing, /No completed projects have been published yet/);
  assert.doesNotMatch(emptyHome, /aria-label="Scroll projects (left|right)"/);
  await assert.rejects(
    readFile(join(site, 'dist/projects/workshop-organizer/index.html')),
  );
});
