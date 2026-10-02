import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';

// Remove baked-in backgrounds and unmatte soft edges without changing opaque logo colors.
const sources = [
  ['light', '../docs/logo/Logo_3DEngelen 9-16.png'],
  ['dark', '../docs/logo/Logo 3DEngelen_Dark9-16.png'],
];
const crops = [
  ['icon', { left: 180, top: 340, width: 590, height: 780 }, 240],
  ['wordmark', { left: 65, top: 1140, width: 820, height: 170 }, 480],
  ['artwork', { left: 60, top: 325, width: 825, height: 1000 }, 825],
];

await mkdir(new URL('../src/assets/logo/', import.meta.url), {
  recursive: true,
});

for (const [theme, relativePath] of sources) {
  const source = fileURLToPath(new URL(relativePath, import.meta.url));
  const { data, info } = await sharp(source)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  const background = theme === 'light' ? [255, 255, 255] : [1, 2, 7];
  for (let pixel = 0; pixel < info.width * info.height; pixel++) {
    const rgb = [...data.subarray(pixel * 3, pixel * 3 + 3)];
    const distance = Math.max(
      ...rgb.map((channel, index) => Math.abs(channel - background[index])),
    );
    const alpha =
      theme === 'light'
        ? Math.min(1, Math.max(0, (distance - 8) / 72))
        : Math.min(1, Math.max(0, (distance - 5) / 40));
    for (let channel = 0; channel < 3; channel++) {
      rgba[pixel * 4 + channel] = alpha
        ? Math.max(
            0,
            Math.min(
              255,
              (rgb[channel] - background[channel] * (1 - alpha)) / alpha,
            ),
          )
        : 0;
    }
    rgba[pixel * 4 + 3] = Math.round(alpha * 255);
  }
  for (const [kind, crop, width] of crops) {
    await sharp(rgba, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .extract(crop)
      .resize({ width })
      .webp({ lossless: true })
      .toFile(
        fileURLToPath(
          new URL(`../src/assets/logo/${theme}-${kind}.webp`, import.meta.url),
        ),
      );
  }
}
