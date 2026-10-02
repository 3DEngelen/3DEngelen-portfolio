# 3DEngelen

A static portfolio for finished maker projects. The fictional **Demo / Fixture Study** is kept under `scripts/fixtures/` for testing and is not published.

## Develop

Use Node 22 or newer. Run `npm ci`, then `npm run dev` and open the forwarded port 4321. In GitHub Codespaces, create a codespace on this repository; the devcontainer installs dependencies and forwards the preview port automatically.

Run `npm run check` to validate project content and Astro types, `npm run format:check` to check formatting, and `npm run build` to generate the site in `dist/`. `npm run preview` serves the production build. Image derivatives are generated in `public/generated/` and are not committed.

Run `npm test` for focused project-image validation tests. The optional APM manifest pins the upstream `context-authoring` skill for work on agent/skill definitions; it is not required for site development or builds. If using APM, run `apm install --frozen --target copilot` to install from `apm.lock.yaml` after reviewing the upstream package. The source is [JanDeDobbeleer/agentic](https://github.com/JanDeDobbeleer/agentic/tree/main/skills/context-authoring) (MIT); the other considered upstream skills were not installed because their cross-project editing or Markdown rules do not fit this site.

### GitHub CLI in Codespaces

The devcontainer installs GitHub CLI (`gh`). Codespaces supplies GitHub authentication for the repository; opening the same Codespace from another computer does not require copying a token or relying on that computer's browser cookies. Git commits are local; pushes and PR creation require GitHub access.

Use **Terminal → Run Task → GitHub: verify Codespaces authentication** to check the authenticated account and repository access. The tasks in [`.vscode/tasks.json`](.vscode/tasks.json) also support pushing the current branch, creating a PR using commit messages, and viewing the current PR. Commit and push the intended changes before running the PR task.

An agent's separate command runner may lack the token even when the integrated terminal is authenticated. In that case, the agent should execute `gh` and pushes using VS Code tasks, which use the working terminal environment. See [the agent CLI workflow](docs/agents/issue-tracker.md#codespaces-cli-authentication).

After merging changes to the devcontainer configuration, rebuild an existing Codespace with **Codespaces: Rebuild Container** to install the configured CLI feature. New Codespaces pick it up automatically. Keep tokens in the Codespaces environment rather than files or Git; if the authentication task fails, check the Codespace's repository permissions before attempting GitHub operations.

## Add a project

Create `projects/<project-slug>/project.md` and `projects/<project-slug>/pictures/`. Use lowercase letters, digits, and hyphens for the folder name; it becomes the stable URL. Do not put a slug in frontmatter or edit a central project list. Publish completed builds, experiments, or prototypes only. Add selected, reasonably compressed JPG, PNG, WebP, AVIF, or SVG exports to `pictures/`, named `01-...`, `02-...` etc. for a predictable gallery. Keep raw originals and working files outside the repository. The hero must reference one of these images.

```md
---
title: 'Project title'
description: 'One to ten sentences describing the finished work. Only the first sentence appears in project cards and social previews.'
hero: 'pictures/01-hero.jpg'
featured: true
tags: ['Fabrication', 'Workshop']
printers: ['Printer model']
materials:
  - name: 'PETG'
    brand: 'Optional brand'
    grade: 'Optional grade'
resources:
  - type: 'model'
    label: 'Model files'
    url: 'https://example.com/model'
gallery:
  01-hero.jpg:
    alt: 'A descriptive account of what the photo shows'
    caption: 'Optional image caption'
    order: 1
---

Optional Markdown notes can follow the description. No headings or completion date are required.
```

Only title, a one-to-ten-sentence description, a hero image, and descriptive `alt` text for every project picture are required. Add one `gallery` entry per picture; its visible caption and order are optional. Completion month (`YYYY-MM`), featured status, printer models, materials, flat tags, resource links, and additional Markdown notes are optional. Tags are trimmed, deduplicated, and lowercased for browsing. Material entries can include a brand and grade. Resource `type` is a free-form label and each resource needs a label and URL. Gallery order defaults to filename order. Social/search metadata uses the title, first description sentence, canonical URL, and hero image by default; optional SEO overrides are supported. `npm run check` rejects invalid metadata, descriptions outside the sentence limit, missing alt text or image references, and unsupported image files.

## Brand assets

The shared header uses the printer symbol and complete 3DEngelen wordmark.
The homepage also displays the larger artwork, reduced to 160px on small
screens. Its heading uses slightly expanded letter spacing at widths up to 600px to
keep both the solid and outlined text readable. "Shared in" and "detail." always
appear on separate lines at those widths. The outlined text paints a
background-colored fill after its stroke to hide overlapping font contours
on mobile without changing the typeface. Theme-specific transparent assets follow the system color scheme
unless the existing theme toggle has selected a light or dark override.

Original logo uploads are preserved in [`docs/logo/`](docs/logo/). Run
`npm run prepare:logos` to regenerate the cropped, transparent, lossless WebP
derivatives in [`src/assets/logo/`](src/assets/logo/). Background keying and
edge unmatting retain opaque foreground colors and remove the baked-in
white/near-black backgrounds. These derivatives are committed, so normal site
builds do not need to reprocess the source logos.

## Deployment

The Pages workflow checks pull requests and deploys only pushes to `main`. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. The default URL is `https://3dengelen.github.io/3DEngelen-portfolio/`. To move to a custom domain later, set the `SITE_URL` repository variable to its origin and `BASE_PATH` to `/` (and configure the domain in Pages settings). No Google Drive integration or credentials are needed.
