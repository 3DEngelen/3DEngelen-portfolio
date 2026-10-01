import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const script = fileURLToPath(
  new URL('./prepare-projects.mjs', import.meta.url),
);
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><rect width="100" height="50" fill="red"/></svg>';

async function fixture(t, slug = 'sample-project') {
  const root = await mkdtemp(join(tmpdir(), '3dengelen-project-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const project = join(root, 'projects', slug);
  await mkdir(join(project, 'pictures'), { recursive: true });
  await writeFile(join(project, 'pictures', '01-image.svg'), svg);
  await writeFile(
    join(project, 'project.md'),
    '---\nhero: pictures/01-image.svg\ngallery:\n  01-image.svg:\n    alt: A red rectangle on a white background\n---\nExample\n',
  );
  return { root, project };
}

function prepare(root) {
  return execFileSync(process.execPath, [script], {
    env: { ...process.env, PROJECT_ROOT: root },
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

test('generates manifest and optimized image derivatives', async (t) => {
  const { root } = await fixture(t);
  assert.match(prepare(root), /Prepared 1 project/);
  const manifest = JSON.parse(
    await readFile(join(root, 'src/generated/projects.json'), 'utf8'),
  );
  assert.equal(manifest['sample-project'].gallery.length, 1);
  assert.equal(manifest['sample-project'].hero.width, 100);
  assert.equal(
    manifest['sample-project'].hero.alt,
    'A red rectangle on a white background',
  );
  assert.ok(
    (await readFile(join(root, 'public/generated/sample-project/card-01.webp')))
      .length > 0,
  );
});

test('rejects missing hero images with a file-specific error', async (t) => {
  const { root, project } = await fixture(t);
  await writeFile(
    join(project, 'project.md'),
    '---\nhero: pictures/missing.jpg\n---\nExample\n',
  );
  assert.throws(
    () => prepare(root),
    /sample-project: missing image: pictures\/missing.jpg/,
  );
});

test('rejects gallery references to absent pictures', async (t) => {
  const { root, project } = await fixture(t);
  await writeFile(
    join(project, 'project.md'),
    '---\nhero: pictures/01-image.svg\ngallery:\n  missing.jpg:\n    caption: Missing\n---\nExample\n',
  );
  assert.throws(
    () => prepare(root),
    /sample-project: gallery references missing image: missing.jpg/,
  );
});

test('rejects invalid directory slugs', async (t) => {
  const { root } = await fixture(t, 'Bad_Slug');
  assert.throws(() => prepare(root), /Bad_Slug: invalid folder slug/);
});
