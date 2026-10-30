# Handback to the master thread: round 2 (with the amendment)

**From:** Claude Code, working in `christopherfi-dev/algebra-patterns`, branch `master`
**Date:** 30 October 2026
**Full report:** `REPORT.md` in the repo. This handback is the short version, for planning the next round.

## Status

- **Done:** all of round 2 and all of `ROUND-2-AMENDMENT.md`. The amendment arrived mid-round, so it was applied as part of round 2.
- **The lesson:** 11 screens, "Screen k of 11", with parts renumbered 1–4 (Marc's answer). Round 1 Screens 2–10, then the new exit ticket and the self-check.
- **Marc's two answers** about the amendment (part numbering; the Screen 3 Why? row names) are recorded word for word in `docs/Round-2-Amendment-Answers.md`.
- **Not deployed.**
- **Commits, in order:**
  1. round 2 package, unchanged;
  2. the five defects;
  3. cut Screen 1, titles and intros;
  4. behaviour (Q2–Q12);
  5. wording;
  6. fixes found in testing, and the round 2 tests;
  7. amendment package, unchanged;
  8. amendment applied;
  9. tests and screenshots;
  10. this report.

**Step IDs** keep their round 1 numbers. Learner screen k is round 1 screen k + 1 for screens 1–9. The exit ticket keeps ID 15 and the self-check ID 16. New IDs: **3T1, 3T2, 3T3** (Screen 3's table steps) and **3B·f, 7B·f, 8B·f** (the follow-up items).

## Test results

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 2,201 | 0 |
| WebKit 26.6 (Safari's engine) | 1,761 | 0 |

- **Covered:**
  - every correct path and every predicted wrong answer;
  - one unpredicted answer per hint;
  - the three follow-ups, each appearing only after a second miss on its step;
  - Screen 6's "No" and Screen 7's 7;
  - the linear-only checker, including a non-linear rule that matches at all six test points;
  - no "null" or "undefined" text, no wrapped expressions, nothing overflowing at 390 px, and 44 px targets;
  - Screen 3's three table steps;
  - every exit-ticket response, across five runs (it allows one submission per run);
  - the self-check at 0 and at 4 ticks.
- **Screenshots:** all 11 screens at 390 × 844 and 1280 × 800, in `test-results/screenshots/`, with WebKit captures in `webkit/`.
- **WebKit setup:** installed with Playwright's own installer into a separate folder, with its system libraries from apt. Touch drags run only in Chromium, because they use a Chrome-only protocol.
- **Not tested:** Safari on a real iPhone or Mac, Firefox, screen readers.

## Fixed beyond the brief

These were found by the tests, and each was a real defect:

- **Focus moving mid-typing.** A new step could move focus while the learner was typing in another box, sending keystrokes into the wrong box. Fixed.
- **Safari overflow.** WebKit let an expression, or the punctuation after it, hang about 3 px past the line. Expressions are now single unbreakable units, punctuation included.
- **Nina's rule spacing.** The "first square" label spread her rule apart. It now hangs under the 4.

## Removed by the amendment, after being built in round 2

- **Screen 11:** the square legibility fix (outlined L-borders), the 4-by-4 fill build (Q9), hints 11A, 11B2 and 11C, and confirmations 11A and 11C.
- **Screen 12:** counted Checks, with "Your line passes through k of the 4 points." and "Move a slider first." (Q10); also the "T = n" display. No remaining screen builds a rule from numbers, so the display function went too.
- **Screen 13:** the new intro (Q14) and hint 13A.
- **Screen 14:** the h line and two-row table (Q4), the new 14A prompt, and hints 14A and 14B2.
- **Screen 15:** the garden ticket, its new title and intro, and its seven items.
- **Screen 16:** the garden-based seven-line self-check (Q12).
- **Code:** the square, graph, ramp and shrinking-border figures, with their steps and styles.

## Anything not done

Nothing in the brief or the amendment is left undone.

## Decisions I made that Marc may want to check

| Where | As built |
|---|---|
| Any rule step | A non-straight-line rule (n × n, a power of n, n in a denominator) gets the step's hint and counts as a miss. |
| 3B·f, 7B·f, 8B·f | A follow-up appears only after the Answer card, once the shown answer is typed. On 7B, reaching the answer through Marc's 40 move gives no follow-up. |
| 8B·f | Every wrong answer is tested at the first n where it breaks, in 8B's sentence pattern: "Test at n = 2: 12, but the original gives 7." |
| 7·1 | A 7 shows its response and then Figure 2's shared edge flashing; the counting step is skipped. |
| 3T1, 3T3 | The table sits at the top of Screen 3. Each row's remaining cells fill in, computed, once its typed cells are right. |
| Exit item 1 | Either or both row responses can show. The self-check line is ticked only if all five blanks are right. |
| Exit items 2–4 | Predicted errors are matched by value (4n + 9 gets the 9 + 4n response). A non-straight-line rule gets the "anything else" response. |
| Q15–Q18 | The colours, progress and Back, my small figure additions, and the interface wording are kept on the remaining screens. The amendment's "still stands" list doesn't name them. |

## Conflicts and open questions, keyed by step ID

1. **10B1 (Arun's build), and Q2.** Q2 says orange only ever means the value at Figure 0. Under Arun's rule, S = 4 + 3n, that value is 4, so his 4 stays orange and his build shows a whole orange square. Is that right, or should his 4 be neutral too?
2. **8B·f.** "5 + 2n − 2" (equivalent, not combined) has no text in the source of truth. It shows "Not yet. Try again." and doesn't count as a miss. This is the only place that fallback remains. Should there be a "correct so far" line?
3. **3B·f, 7B·f, 8B·f.** Wording D gives no test sentences for the follow-ups beyond 3B·f's "8, but Figure 1 has 6". Is 8B's pattern acceptable for 8B·f?
4. **Screen 3 (IDs 3T1–3B).** It now has six steps, plus 3B·f after a second miss on 3B. It fits on a phone but is the longest screen. Keep it, or move the table steps to their own screen?
5. **What the exit ticket assesses.** It checks the table, the rule, forward and backward. Screens 5–7 and 9 (testing, shared edges, equivalence, repair) are taught but no longer assessed. This was chosen by the amendment; I'm noting it as a known trade-off.

## Suggestions for the next handoff

- **Answer the five points above by step ID.** "Keep" is a fine answer.
- **Write any new text directly** (a "correct so far" line, test sentences), so it can go straight into the data block.
- **If more screens are cut or added,** say which step IDs move, and whether the parts need renumbering.
- **For a real-device check,** play the lesson in Safari on an iPhone. Nothing has been tested on a real phone yet.
