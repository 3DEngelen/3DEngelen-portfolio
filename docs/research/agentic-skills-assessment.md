# Upstream Agentic Skills Assessment

Reviewed 2026-10-01 against the current `JanDeDobbeleer/agentic` repository and this portfolio's installed
skills. This is an adoption assessment, not an instruction to install or copy upstream files.

## Recommendation

- **Keep `context-authoring`.** It is already pinned in [apm.yml](../../apm.yml) and
  [apm.lock.yaml](../../apm.lock.yaml) to commit `92c98248ee5b0763daa4ce54f85488289fbb0940`. Its guidance for
  choosing a skill versus an agent, keeping one responsibility per primitive, and avoiding duplicated context fits
  this repo's small portfolio-specific skill set.
- **Do not add the upstream `code-changes` workflow wholesale.** It mandates an analysis approval stop, phase artifacts,
  model-tier routing, delegation/supervision, and a verify/deliver orchestration. Those are broad process rules, not
  Astro or TypeScript coding guidance, and would duplicate the current coding instructions. Keep using the local
  [`implement`](../../.agents/skills/implement/SKILL.md), [`tdd`](../../.agents/skills/tdd/SKILL.md), and
  [`code-review`](../../.agents/skills/code-review/SKILL.md) workflows. If PR review-comment handling becomes a
  recurring need, evaluate that upstream reference separately.
- **Adapt, do not install, `writing-clearly-and-concisely`.** Its focus on active, specific, concise prose suits project
  descriptions, captions, README content, and technical explanations. The local
  [project-authoring skill](../../.github/skills/project-authoring/SKILL.md) already provides the critical domain rule:
  don't invent build facts or personal information. A future portfolio-writing skill should add only that short style
  guidance and preserve evidence-based claims, rather than importing its extensive style reference collection.
- **Skip the upstream `markdown` skill as a project-wide rule.** It forbids H1 headings and requires front matter,
  120-character lines, and `markdownlint-cli2` after each Markdown edit. The local README uses an H1, ordinary docs
  need not have front matter, and the repo currently uses Prettier rather than Markdownlint. Its general advice on
  fenced code blocks, accessible image alt text, and readable structure can be applied when useful without adopting
  those incompatible mandates.
- **Skip `conventional-commit` for now.** Imperative, scoped commit subjects are reasonable if the project later adopts
  a commit convention, but the upstream workflow also stages and commits changes and expects a commitlint config.
  Neither is needed to improve the portfolio's authoring, coding, or review skills.
- **Skip the upstream `session-retrospective` agent in this VS Code workflow.** Its supported session sources are
  Claude Code Desktop and GitHub Copilot CLI. It explicitly says Copilot Chat in VS Code has no supported session
  enumeration path.

## Local Fit

The portfolio already separates content work from software work: its
[project-authoring](../../.github/skills/project-authoring/SKILL.md) and
[project-validation](../../.github/skills/project-validation/SKILL.md) skills enforce project facts, metadata, image
references, and site checks. The root [README](../../README.md) documents `npm run check`, `npm test`, formatting, and
the production build. Upstream skills should complement those rules, not replace them.

The upstream README describes APM as its distribution mechanism and advertises Markdown and prose linting in upstream
CI. This repo pins one upstream skill by commit, not the complete package; notably, the upstream root
[APM manifest](https://github.com/JanDeDobbeleer/agentic/blob/main/apm.yml) also declares a `skill-creator` dependency,
which is not part of this repo's one-skill dependency declaration.

## Licensing

The upstream repository is MIT licensed. Preserve its copyright and license notice when redistributing copied
material. The writing skill's own README attributes its content to another MIT-licensed source, so preserve that
attribution too if copying its files. This assessment summarizes the material and does not copy skill text.

## Sources

- [Upstream repository and catalog](https://github.com/JanDeDobbeleer/agentic)
- [`context-authoring` at the pinned commit](https://github.com/JanDeDobbeleer/agentic/tree/92c98248ee5b0763daa4ce54f85488289fbb0940/skills/context-authoring)
- [`code-changes`](https://github.com/JanDeDobbeleer/agentic/blob/main/skills/code-changes/SKILL.md)
- [`markdown`](https://github.com/JanDeDobbeleer/agentic/blob/main/skills/markdown/SKILL.md)
- [`writing-clearly-and-concisely`](https://github.com/JanDeDobbeleer/agentic/tree/main/skills/writing-clearly-and-concisely)
- [`conventional-commit`](https://github.com/JanDeDobbeleer/agentic/blob/main/skills/conventional-commit/SKILL.md)
- [`session-retrospective` agent](https://github.com/JanDeDobbeleer/agentic/blob/main/agents/session-retrospective.agent.md)
- [Upstream MIT license](https://github.com/JanDeDobbeleer/agentic/blob/main/LICENSE)