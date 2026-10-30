# Seeing the Rule

An interactive math lesson built from Marc's Grade 7 MYP visual-pattern lessons. In 16 screens the learner reads linear rules from tile and stick pictures, tests and repairs rules, sees why a growing square can't have a straight-line rule, and finds a ball's speed at one instant from a shrinking square border. Every screen works on its own visual pieces, and every response is written in advance. There is no teacher and no AI.

## Open it

Open `lesson/index.html` in any modern browser: double-click it, or drag it into a browser window. It is one self-contained file, with all CSS, JavaScript and SVG inline. It needs no server and no network, and it stores nothing about the learner. It works on phones and computers, in light and dark mode.

## What's here

| Path | What it is |
|---|---|
| `lesson/index.html` | The lesson. All content is in one `LESSON` data block; one engine below it reads the data. |
| `docs/Seeing-the-Rule-Interactive-Lesson-Plan.md` | The spec: the single source of truth for every screen. |
| `docs/Marc-Teaching-Moves.md` | Why the screens work the way they do. |
| `reference/Hollow_House_offline.html` | An earlier activity, used as the model for the structure. |
| `tests/lesson.test.js` | Playwright tests: every correct path and predicted wrong answer, at phone and desktop size. |
| `test-results/screenshots/` | Screenshots of every screen, at 390 × 844 and 1280 × 800. |
| `REPORT.md` | What was built, every decision the spec left open, and questions for Marc. |
| `CLAUDE.md`, `HANDOFF.md` | The project rules and the round 1 build brief. |

## Run the tests

The tests use the `playwright` package with Chromium.

```sh
node tests/lesson.test.js
```

The run writes screenshots to `test-results/screenshots/` and a summary to `test-results/results.json`, and exits non-zero if any check fails.
