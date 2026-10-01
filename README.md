# 3DEngelen

A static portfolio for finished maker projects. The included **Demo / Fixture Study** is fictional example content, not a real project or test result.

## Develop

Use Node 22 or newer. Run `npm ci`, then `npm run dev` and open the forwarded port 4321. In GitHub Codespaces, create a codespace on this repository; the devcontainer installs dependencies and forwards the preview port automatically.

Run `npm run check` to validate project content and Astro types, `npm run format:check` to check formatting, and `npm run build` to generate the site in `dist/`. `npm run preview` serves the production build. Image derivatives are generated in `public/generated/` and are not committed.

## Add a project

Create `projects/<project-slug>/project.md` and `projects/<project-slug>/pictures/`. Use lowercase letters, digits, and hyphens for the folder name; it becomes the URL. Do not put a slug in frontmatter. Add publication-ready JPG, PNG, WebP, AVIF, or SVG images to `pictures/`, named `01-...`, `02-...` etc. for a predictable alphabetical gallery. The hero must reference one of these images.

```md
---
title: "Project title"
description: "One sentence suitable for a card and search preview."
completed: "2026-01"
hero: "pictures/01-hero.jpg"
tags: ["Fabrication", "Design"]
category: "Optional category"
resources:
  - type: "model"
    label: "Model files"
    url: "https://example.com/model"
gallery:
  01-hero.jpg:
    caption: "Optional image caption"
    order: 1
seo:
  title: "Optional browser title"
  description: "Optional social description"
  image: "pictures/02-preview.jpg"
---

## Goal

What did you set out to make?

## Result

What was completed?

## Takeaway

What would another maker find useful?
```

Only the title, description, completion month (`YYYY-MM`), and hero are required. Headings in the body are suggestions, not a schema. Tags are trimmed, deduplicated, and lowercased for browsing; categories and resources are optional. Resource `type` is a free-form label (start with `model` or `material`). Gallery captions and order are optional; otherwise pictures sort by filename. `seo.image` must also be in `pictures/`. `npm run check` rejects invalid metadata, missing referenced images, and unsupported image files. Publish only complete standalone work; keep originals and working files outside this repository.

## Deployment

The Pages workflow checks pull requests and deploys only pushes to `main`. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. The default URL is `https://3dengelen.github.io/3DEngelen-portfolio/`. To move to a custom domain later, set the `SITE_URL` repository variable to its origin and `BASE_PATH` to `/` (and configure the domain in Pages settings). No Google Drive integration or credentials are needed.
