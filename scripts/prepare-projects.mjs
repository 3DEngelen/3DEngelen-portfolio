import { readdir, readFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import matter from 'gray-matter';
import sharp from 'sharp';

const root =
  process.env.PROJECT_ROOT ?? new URL('../', import.meta.url).pathname;
const source = join(root, 'projects');
const output = join(root, 'public/generated');
const manifestPath = join(root, 'src/generated/projects.json');
const supported = /\.(?:jpe?g|png|webp|avif|svg)$/i;
const manifest = {};

function fail(slug, detail) {
  throw new Error(`${slug}: ${detail}`);
}

const folders = (await readdir(source, { withFileTypes: true })).filter(
  (entry) => entry.isDirectory(),
);
await rm(output, { recursive: true, force: true });
for (const folder of folders) {
  const slug = folder.name;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    fail(slug, 'invalid folder slug');
  const file = join(source, slug, 'project.md');
  let data;
  try {
    data = matter(await readFile(file, 'utf8')).data;
  } catch {
    fail(slug, 'missing or invalid project.md');
  }
  const pictureDir = join(source, slug, 'pictures');
  const entries = await readdir(pictureDir, { withFileTypes: true }).catch(() =>
    fail(slug, 'missing pictures/'),
  );
  const filenames = entries
    .map((entry) => {
      if (!entry.isFile() || !supported.test(entry.name))
        fail(slug, `unsupported picture: ${entry.name}`);
      return entry.name;
    })
    .sort();
  if (!filenames.length)
    fail(slug, 'pictures/ must contain at least one image');
  const pictureName = (reference) => {
    if (typeof reference !== 'string' || !/^pictures\/[^/]+$/.test(reference))
      fail(slug, `invalid picture reference: ${reference}`);
    const name = reference.slice('pictures/'.length);
    if (!filenames.includes(name)) fail(slug, `missing image: ${reference}`);
    return name;
  };
  const hero = pictureName(data.hero);
  const preview = data.seo?.image ? pictureName(data.seo.image) : hero;
  for (const name of Object.keys(data.gallery ?? {})) {
    if (!filenames.includes(name))
      fail(slug, `gallery references missing image: ${name}`);
  }
  const sorted = filenames.sort(
    (a, b) =>
      (data.gallery?.[a]?.order ?? Infinity) -
        (data.gallery?.[b]?.order ?? Infinity) || a.localeCompare(b),
  );
  const imageDir = join(output, slug);
  await mkdir(imageDir, { recursive: true });
  const previews = {};
  for (const [index, name] of sorted.entries()) {
    const input = join(pictureDir, name);
    const id = String(index + 1).padStart(2, '0');
    const galleryFile = `gallery-${id}.webp`;
    const cardFile = `card-${id}.webp`;
    try {
      const gallery = await sharp(input)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(join(imageDir, galleryFile));
      const card = await sharp(input)
        .rotate()
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(join(imageDir, cardFile));
      previews[name] = {
        gallery: {
          src: `generated/${slug}/${galleryFile}`,
          width: gallery.width,
          height: gallery.height,
          alt:
            data.gallery?.[name]?.alt ||
            `${data.title ?? slug}, image ${index + 1}`,
          ...(data.gallery?.[name]?.caption
            ? { caption: data.gallery[name].caption }
            : {}),
        },
        card: {
          src: `generated/${slug}/${cardFile}`,
          width: card.width,
          height: card.height,
        },
      };
    } catch (error) {
      fail(slug, `cannot process pictures/${name}: ${error.message}`);
    }
  }
  manifest[slug] = {
    hero: previews[hero].gallery,
    card: previews[hero].card,
    gallery: sorted.map((name) => previews[name].gallery),
    previews: Object.fromEntries(
      sorted.map((name) => [name, previews[name].gallery]),
    ),
  };
}
await mkdir(join(root, 'src/generated'), { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Prepared ${folders.length} project(s).`);
