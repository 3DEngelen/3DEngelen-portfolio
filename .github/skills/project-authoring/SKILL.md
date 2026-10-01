---
name: project-authoring
description: Create a new finished 3DEngelen project from supplied notes and approved pictures.
---

Create only a new `projects/<slug>/project.md` and `pictures/` folder. Do not change existing projects unless explicitly asked. Ask for missing facts rather than inventing build details, results, or personal information. Use only approved publication-ready pictures; never retrieve originals from Google Drive.

Use the README project template: title, concise description, quoted `YYYY-MM` completion month, hero path in `pictures/`, optional tags/category/resources. Keep Markdown headings flexible while covering goal, result, and useful takeaway where the supplied notes support them. Name pictures in intended display order (`01-...`, `02-...`); optional `gallery` entries can add captions or override order. Do not include drafts, progress updates, or printer settings as structured fields. Run `npm run check` and `npm run build` before handing over the draft for human review.
