# Handback to the master thread: round 6

**From:** Claude Code, working in `christopherfi-dev/algebra-patterns`, branch `master`
**Date:** 31 October 2026
**Full report:** `REPORT.md` in the repo. This handback is the short version.

## Status

- **Done:** everything in `HANDOFF-ROUND-6.md`, sections 1 to 4.
- **The lesson:** now **13 screens**, "Screen k of 13". The new Screen 3, "Skip count for any figure", sits between the table screen and the rule screen. Every later screen moves down one.
- **Not deployed.**
- **Commits, in order:**
  1. `fa887b3`: round 6 package, unchanged;
  2. `c4b2992`: section 1, Figures 1–4 above the table;
  3. `b662191`: section 2, 3T2 and 3T3;
  4. `baa8bd7`: section 3, the new Screen 3 (3S1, 3S2);
  5. `01a9e96`: section 4, 3R and 3B's hint;
  6. `2a41766`: tests, screenshots, and "13 screens" in `README.md`;
  7. this report and handback.

## The file to deploy

| | |
|---|---|
| File | `lesson/index.html` |
| Commit | `01a9e9669146e32137342bacf6c4a4bba0b978d1` |
| SHA-256 | `7c3ee3f7f1c951bd6c8a586e9f671f798bad25e982e8c4b30378a6cf4897800c` |

`01a9e96` is the last commit that changes the lesson. The commits after it don't touch it, so the file is identical at the tip of `master`.

## Test results

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 3,340 | 0 |
| WebKit 26.6 (Safari's engine) | 2,757 | 0 |

Everything on the handoff's test list is covered, in both engines:

- **The figures:** Figures 1–4 appear above the table on Screens 2, 3 and 4. Each has 2 tiles in the constant colour and n groups of 3 in the coefficient colour. At 360 and 390 px they take at most two rows, each with 16 px spare. Without my 85% scaling (see the decisions below), this check fails.
- **3T2:** the new confirmation, with no "3n" in it.
- **3T3:** four boxes, all typed; nothing fills in. An empty box gets no response. Also checked: a 3 in one box, the new hint, the Answer card, and the right answer.
- **3S1 and 3S2:** every response, both Answer cards, the Why?, and the options in order with 3n third.
- **3R:** its responses and Answer card, and that it comes before 3A1.
- **3B:** the new hint.
- **"Screen k of 13"** on every screen, with every later screen one along.
- **The full suite was rerun:** every correct path and predicted wrong answer, the 16 px margin check at 360 and 390 px, and the no-"null"/"undefined" check.
- **Screenshots:** all 13 screens at 390 × 844 and 1280 × 800, in `test-results/screenshots/`. WebKit captures are in `webkit/`.
- **Not tested:** Safari on a real iPhone or Mac, Firefox, screen readers, and widths below 360 px.

## What changed, keyed by step ID

| Step | Change |
|---|---|
| Screens 2, 3, 4 | Figures 1–4 above the table, in the two colours. On Screens 3 and 4 the completed table is read-only beneath them. Screen 4 keeps "From the last screen". |
| 3T2 | Confirmation: "Right: 10 × 3 = 30." |
| 3T3 | All four values typed; nothing fills in. "Right. Every figure has exactly 2 more." A 3 in any box gets the existing "3 is what each figure adds…". Hint: "Subtract in each column: 5 − 3, 8 − 6, 11 − 9, 14 − 12." |
| 3S1 (new) | Typed. 15 is right; 17 and 8 get their responses; anything else gets the hint. |
| 3S2 (new) | Choice: 3 + n, 3 − n, 3n, 3 ÷ n. 3n is right and third; each wrong option says what it gives at Figure 5. The new Why? follows. |
| 3R (new) | First step on Screen 4. 2 is right; 3 gets its response; anything else gets the hint. |
| 3B | Hint: "Start with the skip count for figure n, then add how many more every figure has." 3B·f keeps its own hint. |

The new order:

| Learner screen | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Round 1 ID | 2 | 3 (3T) | 3 (3S) | 3 (3R, 3A, 3B) | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15 | 16 |

Parts: Part 1 is Screens 1–7, Part 2 is 8–10, Part 3 is 11, and Part 4 is 12 and 13.

## Decisions I made that Marc may want to check

| Where | As built |
|---|---|
| Screens 2–4, figures | **On phones (below 420 px) the four figures are drawn at 85%.** At full size they took three rows at 360 px, and the handoff allows two. At 85% they take two rows with 17 px spare at 360 px and 47 px at 390 px. On wider screens and desktop they're full size, and other figures in the lesson are unchanged. Layout only. |
| 3T3 | "Any 3" means a 3 in any one of the four boxes, even if the other boxes are right. |
| Screen 3 | Every number in its text is computed from the rule, as the handoff asks. "five" is written as a word. The changed text on Screens 2 and 4 (3T2, 3T3, 3R) is written out, like the other responses there. The tests check all of it word for word. |
| Screen 3 table | No caption: the handoff gives "From the last screen" only for Screen 4. On Screen 4 the caption is still true, because Screen 3 shows the table too. |
| "Lines up in meaning" | The figures are captioned Figure 1 to Figure 4, matching the table's "Figure n" row. They don't sit over their columns: on phones they wrap, and on desktop they're wider than the table. |

## Anything not done

Nothing.

## Open questions

None.

## Suggestions for the next handoff

- **Play Screens 2–4 on a phone.** Part 1 is now 7 screens. One thing to watch: 3R's answer, 2, is in the "How many more" row just above it, which is where its hint points. That's as written. It works as a recap of 3T3, if that was the intent.
- **Deploy by the hash** above, and check it matches.
- **Real devices:** Safari on an iPhone and a 360 px Android phone are still untested.
- **Still open from round 5:** the file table in `README.md` lists rounds 4 and 3 as the latest handoffs. I updated only its screen count this round. Say if you want rounds 5 and 6 added.
