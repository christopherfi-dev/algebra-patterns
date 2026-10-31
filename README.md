# Growing Patterns: Finding the Rule

An interactive math lesson built from Marc's Grade 7 MYP visual-pattern lessons: from a growing figure to its rule. In 12 screens the learner:
- reads a linear rule from tile and stick pictures, with the constant in one colour and each group of the coefficient in another;
- compares a pattern with its skip-count row to find the constant at Figure 0;
- tests rules on more than one figure, compares two rules figure by figure, and repairs a shifted rule;
- finishes with an exit ticket on a new pattern, and a self-check of what they showed on their own.

Every response is written in advance. There is no teacher and no AI.

## Open it

Open `lesson/index.html` in any modern browser: double-click it, or drag it into a browser window. It is one self-contained file, with all CSS, JavaScript and SVG inline. It needs no server and no network, and it stores nothing about the learner. It works on phones and computers, in light and dark mode.

## What's here

| Path | What it is |
|---|---|
| `lesson/index.html` | The lesson. All content is in one `LESSON` data block; one engine below it reads the data. |
| `docs/Seeing-the-Rule-Interactive-Lesson-Plan.md` | The original spec. |
| `docs/Round-2-Decisions.md`, `docs/Round-2-Wording.md` | Marc's round 2 decisions and approved wording. |
| `ROUND-2-AMENDMENT.md`, `docs/Round-2-Amendment-Answers.md` | Marc's narrowing of the lesson to one idea, and his answers to two questions about it. |
| `HANDOFF-ROUND-4.md`, `HANDOFF-ROUND-3.md` | Rounds 4 and 3: Marc's answers and the latest changes. Round 4 is first in precedence. |
| `docs/Marc-Teaching-Moves.md` | Why the screens work the way they do. |
| `tests/lesson.test.js` | Playwright tests: every correct path and every predicted wrong answer, at phone and desktop size. |
| `test-results/screenshots/` | Screenshots of every screen at 390 × 844 and 1280 × 800; WebKit captures in `webkit/`. |
| `REPORT.md` | What was built, every decision the source of truth left open, and questions for Marc. |
| `handback/` | A short report after each round, for the master thread. |
| `CLAUDE.md`, `HANDOFF.md`, `HANDOFF-ROUND-2.md` | The project rules and the earlier build briefs. |

## Run the tests

The tests use the `playwright` package.

```sh
node tests/lesson.test.js            # Chromium
PLAYWRIGHT_BROWSERS_PATH=<folder with Playwright's WebKit> node tests/lesson.test.js --webkit
```

Each run writes `test-results/results-<engine>.json` and exits non-zero if any check fails. The Chromium run also writes the screenshots.
