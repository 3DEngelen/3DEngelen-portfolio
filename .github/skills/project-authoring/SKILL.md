---
name: project-authoring
description: Create a new finished 3DEngelen project from supplied notes and approved pictures.
---

Create only a new `projects/<slug>/project.md` and `pictures/` folder. Do not change existing projects unless explicitly asked. Ask for missing facts rather than inventing build details, results, or personal information. Use only owner-approved, publication-ready, reasonably compressed picture exports; never retrieve originals from Google Drive. Keep originals and working files outside the repository.

Use the README project template. Require a non-empty title, a one-to-ten-sentence description, and a hero path in `pictures/`; completion month is optional. Printers, materials (with optional brand and grade), flexible labeled resource links, flat tags, featured status, additional gallery metadata, and Markdown notes are optional. Do not add category metadata or require section headings. Name pictures in intended display order (`01-...`, `02-...`). Draft descriptive `gallery.<filename>.alt` text separately from optional visible captions using only supplied images; ask the owner when the image meaning is unclear. Publish completed projects only, including finished experiments and prototypes. Do not include drafts, progress updates, or printer settings as structured fields. Run `npm run check` and `npm run build` before handing over the draft for human review.
