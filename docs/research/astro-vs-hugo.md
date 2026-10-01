# Astro vs Hugo for 3DEngelen

Reviewed 2026-10-01 for the existing portfolio. Recommendation: keep Astro; do not migrate to Hugo for the next
phase.

## Why Astro fits this repository

- The site already uses Astro's build-time Markdown collection and a Zod schema in
  [`src/content.config.ts`](../../src/content.config.ts). That gives project metadata validation and generated TypeScript
  types, useful as fields change over years. Astro documents content collections as a fit for structured, mostly static
  content and recommends schemas for validation and type safety.
- Existing project pages, components, and GitHub Pages workflow work in Astro. Hugo also supports GitHub Pages, but a
  migration would rewrite `.astro` page/component templates, replace the collection API, and update Codespaces and
  Actions setup without removing the need to model and validate the project content.
- Hugo's page bundles are a natural match for Markdown plus local project images, and Hugo has built-in image
  transformations. Those are real advantages for a new Hugo site, but this repo already has an automated Sharp pipeline
  that checks project images and generates WebP card/gallery derivatives.
- This portfolio's expected 10-100 projects do not establish a scale requirement that would justify a framework change.

## Trade-offs

Hugo is a strong option when starting a content-first static site, especially if Go templates, a single Hugo binary, or
native page-bundle resources are preferred. Astro brings a Node/TypeScript toolchain, but Node is already required by
the site's validation and image tooling, and Codespaces/Actions already use it.

Both frameworks can generate a static site for GitHub Pages. Hugo's content bundles and image processing would not be a
drop-in replacement: projects would likely need an `index.md` bundle layout and rewritten templates. The existing
custom image manifest, captions, ordering, and validation would also need to be migrated or retained as separate logic.

## Sources

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro images](https://docs.astro.build/en/guides/images/)
- [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/)
- [Hugo page bundles](https://gohugo.io/content-management/page-bundles/)
- [Hugo image processing](https://gohugo.io/content-management/image-processing/)
- [Hugo GitHub Pages deployment](https://gohugo.io/host-and-deploy/host-on-github-pages/)