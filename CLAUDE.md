# Seeing the Rule: project rules

An interactive math lesson in one self-contained HTML file.

## Source of truth

- The spec is `docs/Seeing-the-Rule-Interactive-Lesson-Plan.md`.
- Marc's approved changes are in `HANDOFF-ROUND-4.md`, `HANDOFF-ROUND-3.md`, `ROUND-2-AMENDMENT.md`, `docs/Round-2-Decisions.md` and `docs/Round-2-Wording.md`.
- Order of precedence: `HANDOFF-ROUND-4.md` first, then `HANDOFF-ROUND-3.md`, then `ROUND-2-AMENDMENT.md`, then the two round 2 files, then the spec. Everything a later file doesn't change still comes from the earlier ones.

## Who decides

- Marc decides every change. Build what the spec says.
- Learner-facing text, numbers, answers, predicted errors, responses, Why? explanations and screen order come from the source of truth above. Do not reword, add or remove any of them.
- If something in the source of truth is contradictory, impossible to build as written, or doesn't fit on a phone screen, stop and list it in `REPORT.md`. Don't fix it silently.
- `docs/Marc-Teaching-Moves.md` explains why screens work the way they do. Read it; don't build from it.

## Fixed rules

- **No AI and no network.** No model calls, no API calls, no CDNs, no external libraries, no fonts loaded from the web, no analytics. The file works offline.
- **Nothing about the learner is stored or sent.** No accounts, no localStorage, no cookies.
- **Code computes every number shown:** tile counts, stick counts, borders, speeds, table values. Nothing is typed into the page by hand.
- **The two colours.** The constant is always one colour and each group of the coefficient is always a second colour, on every screen that uses them. Define them once as CSS variables (`--constant`, `--coefficient`) and never reuse either colour for anything else.
- **Phones and computers.** Every target at least 44 px. Every drag has a tap alternative. Nothing depends on hover.
- **Answers that can't be guessed stay typed.** Where the spec says "types," the learner types.

## Before reporting

- Test with Playwright. The Playwright CLI is fine; the MCP is optional.
- Screenshot every screen at phone size (390 × 844) and desktop size (1280 × 800).
- Run every correct path and every predicted wrong answer, and confirm each gives the response the source of truth gives it.
- Check that no rendered text anywhere reads "null" or "undefined".

## After each round

- Write `handback/round-N.md`, a short, self-contained report for Marc to give to the master thread. Cover: status (commits, test results, what wasn't tested), and what Marc and the master thread need to decide or write next, keyed by step ID. End with suggestions for the next handoff. `REPORT.md` stays the full report.
- Send it to Marc as a file he can download.

## Don't

- Don't deploy. Marc deploys.
- Don't add features, screens, sounds, scores, points or timers the source of truth doesn't have.
- Don't write new tests for every way a learner might phrase an answer. Test the paths and errors the source of truth names, and the specific fixes each round asks for.
