import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);

for (const theme of ['light', 'dark']) {
  test(`${theme} logo derivatives have transparent backgrounds and bounded dimensions`, async () => {
    for (const [kind, width] of [
      ['icon', 240],
      ['wordmark', 480],
      ['artwork', 825],
    ]) {
      const path = fileURLToPath(
        new URL(`src/assets/logo/${theme}-${kind}.webp`, root),
      );
      const metadata = await sharp(path).metadata();
      assert.equal(metadata.width, width);
      assert.equal(metadata.hasAlpha, true);
      const { data, info } = await sharp(path)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      assert.equal(data[3], 0, `${kind}: top-left background is transparent`);
      assert.equal(
        data[(info.width * info.height - 1) * 4 + 3],
        0,
        `${kind}: bottom-right background is transparent`,
      );
      let opaque = 0;
      let transparent = 0;
      let translucent = 0;
      for (let offset = 3; offset < data.length; offset += 4) {
        if (data[offset] === 255) opaque++;
        else if (data[offset] === 0) transparent++;
        else translucent++;
      }
      assert.ok(opaque > 0, `${kind}: foreground remains visible`);
      const minimumTransparentFraction =
        theme === 'dark' && kind === 'icon' ? 0.25 : 0.5;
      assert.ok(
        transparent > info.width * info.height * minimumTransparentFraction,
        `${kind}: background is removed rather than made faintly opaque`,
      );
      assert.ok(translucent > 0, `${kind}: soft edges remain`);
    }
  });

  test(`${theme} artwork preserves opaque foreground colors`, async () => {
    const sourceName =
      theme === 'light'
        ? 'Logo_3DEngelen 9-16.png'
        : 'Logo 3DEngelen_Dark9-16.png';
    const source = await sharp(
      fileURLToPath(new URL(`docs/logo/${sourceName}`, root)),
    )
      .removeAlpha()
      .raw()
      .toBuffer();
    const artwork = await sharp(
      fileURLToPath(new URL(`src/assets/logo/${theme}-artwork.webp`, root)),
    )
      .ensureAlpha()
      .raw()
      .toBuffer();
    let preserved = 0;
    for (let y = 0; y < 1000; y++) {
      for (let x = 0; x < 825; x++) {
        const offset = (y * 825 + x) * 4;
        if (artwork[offset + 3] !== 255) continue;
        const sourceOffset = ((y + 325) * 941 + x + 60) * 3;
        assert.deepEqual(
          artwork.subarray(offset, offset + 3),
          source.subarray(sourceOffset, sourceOffset + 3),
        );
        preserved++;
      }
    }
    assert.ok(preserved > 1000, 'Substantial logo detail stays opaque');
  });
}
