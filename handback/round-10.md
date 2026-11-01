# Handback to the master thread: round 10

**From:** Claude Code, working in `christopherfi-dev/algebra-patterns`, branch `master`
**Date:** 1 November 2026
**Full report:** `REPORT.md` in the repo. The audit is in `audit/gradual-release-audit.md`. This handback is the short version.

## Status

- **Done:** all four sections of `HANDOFF-ROUND-10.md`, and the audit rerun on all 16 screens with the two new audit rules.
- **The lesson:** still 16 screens.
- **One question, answered by Marc before building:** the README table gains an `audit/` row.
- **Not deployed.**
- **Commits, in order:**
  1. `dcc763d`: round 10 package, unchanged (its `CLAUDE.md` and `docs/Marc-Teaching-Moves.md` are section 3, so section 3 needed no build commit);
  2. `ec33717`: section 1, Screen 8's 6C and Why?;
  3. `c38cdb8`: section 2, 7S2's "4" response;
  4. `3eca1e0`: section 4, the README's file table;
  5. `28bc10c`: tests and screenshots;
  6. this report, the audit and the handback.

## The file to deploy

| | |
|---|---|
| File | `lesson/index.html` |
| Commit | `c38cdb81b75fd5db3e2fbd69b36e79313fa4bdfd` |
| SHA-256 | `ed18abb9b650d5187c41aaacededb7d2cdadcaf205e1fc8b0ceeb0a9be2fa221` |

`c38cdb8` is the last commit that changes the lesson. The file is identical at the tip of `master`.

## Test results

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 4,800 | 0 |
| WebKit 26.6 (Safari's engine) | 3,977 | 0 |

- **6C:** the new prompt, boxes labelled Figure 0, Figure 1 and Figure 3, the correct answers 2, 5 and 11, the new confirmation, and the slip response. The screen's Why? reads with its one new sentence.
- **7S2:** the new "4" response.
- **The full suite was rerun,** including the 16 px margin at 360 and 390 px.
- **Screenshots:** all 16 screens at 390 × 844 and 1280 × 800, in `test-results/screenshots/`; WebKit captures in `webkit/`.
- **One change to the test's text check.** The handoff approves one sentence in place of another inside Screen 8's Why?, so the whole paragraph isn't word for word in any one file. The check now accepts that paragraph because putting the old sentence back gives approved text, and the handoff quotes both sentences. Only that one swap is allowed.
- **Not tested:** Safari on a real iPhone or Mac, Firefox, screen readers, and widths below 360 px.

## What changed, keyed by step ID

| Step | Change |
|---|---|
| 6C | Tests 3n + 2 at Figures 0, 1 and 3 (2, 5 and 11): "It matches all three counts: 2 tiles at Figure 0, 5 at Figure 1, and the 11 you counted at Figure 3." |
| Screen 8 Why? | The Figure 10 sentence is now "A figure further along, like Figure 3, checks the coefficient: 5n was off by 4 there, and a wrong coefficient drifts further off with every figure." |
| 7S2 | The "4" response: "You took 3 off. Count the sticks that are left." |
| README | The file table lists the handoffs, rounds 10 to 3, with their precedence, plus the `audit/` folder. Nothing else changed. |

## The audit, rerun on all 16 screens

**Every step passes. Nothing is open.**

- **The two new audit rules settle the round 8 note.** 3B and 7R5 are guided rule-building. Choosing a rule (10P1) comes before the first rule written on one's own (10P2) and before the exit ticket.
- **6C passes on counts the learner has:** Figure 0 from Screen 4, Figure 1 on Screen 8, and Figure 3 counted in 6B2.
- **Every exit item was practised with support beforehand.** Item 3, a far figure, is now practised at Figure 10 (7B) and Figure 40 (9A).

## Open questions

None.

## Suggestions for the next handoff

- **Real devices before reviewers:** Safari on an iPhone, and a 360 px Android phone. These have never been tested on a real device, and the touch interactions are the riskiest part:
  - the tile taps on Screen 5;
  - 5M's drag on Screen 7;
  - 3B's slider on Screen 6;
  - 7S2's stick taps on Screen 9.
- **If the lesson is now content-complete,** a final play-through on one phone, from Screen 1 to the self-check, would be the last check before deploying.
