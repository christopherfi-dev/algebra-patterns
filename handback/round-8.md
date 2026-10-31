# Handback to the master thread: round 8

**From:** Claude Code, working in `christopherfi-dev/algebra-patterns`, branch `master`
**Date:** 31 October 2026
**Full report:** `REPORT.md` in the repo. The audit is in `audit/gradual-release-audit.md`. This handback is the short version.

## Status

- **Done:** all seven sections of `HANDOFF-ROUND-8.md`, and the audit rerun.
- **The lesson:** now **16 screens**, "Screen k of 16". New: Screen 6, "The rule". Screen 4 is now "Figure 0".
- **One conflict, answered by Marc:** 3B needed its slider on the new screen (details below).
- **Not deployed.**
- **Commits, in order:**
  1. `987b997`: round 8 package, unchanged;
  2. `85661cd`: section 1, the rule and its letters defined;
  3. `b27afd0`: section 2, 3S2's "3 × n";
  4. `8489b62`: section 3, the reorder;
  5. `2719c60`: section 4, follow-ups removed, 3B's Answer card;
  6. `8238baa`: section 5, 8A's worked substitution;
  7. `c1ba6e5`: section 6, 10E's sentence frame;
  8. `56e2330`: section 7, 9B's method line;
  9. `34680cd`: tests and screenshots;
  10. this report, the audit and the handback.

## The file to deploy

| | |
|---|---|
| File | `lesson/index.html` |
| Commit | `56e23308a8f7018558ec62131e10aff87fbf6382` |
| SHA-256 | `5b44b1c3eba10919e3233369db5678b85ed4848813a133ca22d5b07e2d1be8b6` |

`56e2330` is the last commit that changes the lesson. The file is identical at the tip of `master`.

## Test results

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 4,498 | 0 |
| WebKit 26.6 (Safari's engine) | 3,711 | 0 |

Everything on the handoff's test list is covered, in both engines:

- **The new lines:** sections 1, 5, 6 and 7. 3S2's option "3 × n" and its confirmation.
- **The reorder:** Screens 4, 5 and 6 in that order, with their titles. Screen 4's new Why? and Screen 6's caption "Your table".
- **Screen 5:** no small Figure 1 and no 4A.
- **Follow-ups:** 3B·f and 7B·f are gone, and 3B's new Answer card shows.
- **8A:** the 7 box can't be edited and isn't one of the learner's answers; they type five. Its responses are unchanged.
- **3B's slider:** wrong rules move it to Figures 1 and 2, and once the rule is right, sliding shows "T = 3 × 10 + 2 = 32".
- **"Screen k of 16."**
- **The full suite was rerun,** including the 16 px margin at 360 and 390 px.
- **Screenshots:** all 16 screens at 390 × 844 and 1280 × 800, in `test-results/screenshots/`; WebKit captures in `webkit/`.
- **Not tested:** Safari on a real iPhone or Mac, Firefox, screen readers, and widths below 360 px.

## What changed, keyed by step ID

| Step | Change |
|---|---|
| 3B | A definition line above it: "A rule gives the total for any figure. T is …". Now on its own screen, "The rule" (Screen 6), with the table captioned "Your table" and its own slider. Its Answer card reads "The skip count is 3n, and every figure has 2 more: T = 3n + 2." |
| 7R5 | "S is the total number of sticks." above it. |
| 3S2 | The right option is "3 × n"; the confirmation says "written 3n". |
| 3R, 3A1, 3A2 | Now Screen 4, "Figure 0", with a new Why?. |
| 4T1, 4T2 | Screen 5 has no small Figure 1 and no 4A; the Why? follows 4T2. |
| 3B·f, 7B·f, 4A | Removed. |
| 8A | The worked substitution for n = 2 first; that box is filled in with 7. |
| 9B | The method stated first. |
| 10E | A sentence frame above the text box. |

| Learner screen | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ID | 2 | 3 (3T) | 3 (3S) | 3 (3R, 3A) | 4 | 3 (3B) | 5 | 6 | 7 | 7R | 8 | 9 | 10 | 10P | 15 | 16 |

## Decided with Marc this round

| Step | Question | Marc's answer |
|---|---|---|
| 3B | The handoff moved 3B to its own screen "unchanged", but 3B relied on the Figure 0 slider, which stays on Screen 4. Its confirmation says "Right. Slide to check any figure.", and its wrong rules move that slider. | Give 3B its own slider on "The rule". No text changed. |

## Decisions I made that Marc may want to check

| Where | As built |
|---|---|
| New lines | 3B's, 7R5's, 8A's and 9B's lines sit above the prompt, like the line before 3S2. 10E's frame sits between its question and the text box, so the question comes first. |
| 8A | The filled-in 7 is a disabled box, so it looks like the others; before the learner answers, it's dashed and the others are solid. |
| 3B's Answer card | It shows only the new sentence, in place of the answer and its confirmation. |

## The audit, rerun on 16 screens

**Every step passes except 7B, which Marc kept as built.** The same check still flags it: Figure 10's sticks are asked before Figure 1 is shown as 1 + 3. It's listed for completeness, not as a new finding.

All of round 7's findings are answered, including both thin passes.

**One note for Marc, not counted as a failure:** the principle lists choosing the right rule as practice before writing one.
- Round 8 moved identifying the parts (4T1, 4T2) before 3B.
- Choosing a rule (10P1) still comes after both supported rules (3B and 7R5), on Screen 14.
- Each of those rules has its own scaffolding: for 3B, 3R's "every figure is 3n, plus 2 more" and the definition line; for 7R5, the table and 8C2.

If that order is intended, nothing needs doing.

## Open questions

None. The note above needs only a yes or no.

## Suggestions for the next handoff

- **Confirm the order of choosing and writing a rule** (the note above): either "as built", or move a choose-the-rule step before 3B.
- **Real devices:** Safari on an iPhone and a 360 px Android phone, especially Screen 5's tap targets, 5M's drag, and the new slider on Screen 6.
- **Still open from round 5:** the file table in `README.md` lists rounds 4 and 3 as the latest handoffs. I updated only its screen count, to 16.
