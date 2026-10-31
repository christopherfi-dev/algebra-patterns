# Handback to the master thread: round 5

**From:** Claude Code, working in `christopherfi-dev/algebra-patterns`, branch `master`
**Date:** 31 October 2026
**Full report:** `REPORT.md` in the repo. This handback is the short version.

## Status

- **Done:** everything in `HANDOFF-ROUND-5.md`. The lesson is now "Growing Patterns: Finding the Rule".
- **One stop, now resolved:** with the new title, the header didn't fit on one line at 360 and 390 px with the 16 px margin. I stopped and reported it, as the handoff asked. Marc chose option 1: on narrow phones, the progress text goes on its own line. The title is not shortened.
- **The lesson:** still 12 screens, "Screen k of 12". No other change to text, screens or step IDs.
- **Not deployed.**
- **Commits, in order:**
  1. `710568a`: round 5 package, unchanged;
  2. `0132370`: the new title in the browser tab, the header and `README.md`, with the stop recorded in `REPORT.md`;
  3. `edb352b`: the header layout fix (option 1), the title and header tests, and new screenshots;
  4. this report and handback.

## The file to deploy

| | |
|---|---|
| File | `lesson/index.html` |
| Commit | `edb352b04b9f206d0d68b6776f3ce19a1c6734ac` |
| SHA-256 | `2ff9eaef7c8b8f29f9b98fb263c827cb62f70b83aa179fcc0ccf9544115ff2ad` |

`edb352b` is the last commit that changes the lesson. The report commit after it doesn't touch the lesson, so the file is identical at the tip of `master`.

## Test results

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 2,950 | 0 |
| WebKit 26.6 (Safari's engine) | 2,426 | 0 |

- **Title check (new):** the browser tab and the header both read "Growing Patterns: Finding the Rule", and "Seeing the Rule" appears nowhere in `lesson/index.html`. It passes in both engines.
- **Header check (new):**
  - It runs on every screen of every correct path, at 360, 390 and 1280 px, in both engines.
  - The title and "Screen k of 12" must each take one line with 16 px spare. Where they share a row, both together must leave 16 px.
  - I also ran it on the header as it was before the fix, and it fails there. At 360 px the title and the progress text each took two lines. At 390 px the shared row left only 5 px.
- **The full suite was rerun** in Chromium and WebKit: every correct path, every predicted wrong answer, the margin check, and the no-"null"/"undefined" check.
- **Screenshots:** all 12 screens at 390 × 844 and 1280 × 800, in `test-results/screenshots/`, with WebKit captures in `webkit/`.
- **Not tested:** Safari on a real iPhone or Mac, Firefox, screen readers, and widths below 360 px. At 320 px the title still fits on one line with 47 px spare, and nothing scrolls sideways.

## What changed

| Where | Change |
|---|---|
| Browser tab (`<title>`) | Now "Growing Patterns: Finding the Rule". |
| Header (the data block's lesson title) | Now "Growing Patterns: Finding the Rule". |
| Header, below 420 px | "Screen k of 12" sits on its own line under the title. The header is 66 px tall on phones instead of 43 px. From 420 px up, including desktop, the title and progress still sit side by side. Layout only. |
| `README.md` | The new title. |

The old title stays in the spec's file name, earlier handoffs, docs and handbacks, because they are records.

## The header as built

| Width | Layout | Title spare (16 px needed) |
|---|---|---|
| 360 px | progress on its own line | 87 px |
| 390 px | progress on its own line | 117 px |
| 420 px | side by side | 35 px (title and progress together) |
| 1280 px | side by side | 375 px (title and progress together) |

## Decisions I made that Marc may want to check

| Where | As built |
|---|---|
| Header | It stacks below 420 px. That's the same width at which Screen 8's two-rule table stacks (round 4). |

## Anything not done

Nothing.

## Open questions

None.

## Suggestions for the next handoff

- **Deploy by the hash.** Check that the deployed file's SHA-256 matches the one above.
- **Look at the header on a real phone.** It's now two lines on phones, so it takes 23 px more of the screen. In the screenshots it reads cleanly, but a real iPhone and a 360 px Android phone are still untested.
- **If the title or any header text changes again,** the header check will say whether it fits. It's already in the suite.
- **One stale line in `README.md`:** its file table still lists rounds 4 and 3 as the latest handoffs ("Round 4 is first in precedence"). The handoff said to change only the title there, so I left it. Say if you want `HANDOFF-ROUND-5.md` added.
