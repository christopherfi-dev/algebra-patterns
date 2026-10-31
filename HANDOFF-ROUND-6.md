# Handoff: round 6, from the table to the rule

Marc played the deployed lesson on his phone and found that the step from the table to the rule is a jump. The lesson tells the learner "3n" instead of letting them build it, fills in "2 more" for them instead of letting them see it in every figure, and shows the table without the figures it comes from. Round 6 rebuilds learner Screens 2 and 3 to follow Marc's recorded move 1 (`docs/Marc-Teaching-Moves.md`) step by step, and adds one screen between them.

All learner-facing text below is Marc's: he approved these changes, and sending this file approves the wording.

This file takes precedence over everything before it (see `CLAUDE.md`). Step IDs are the round 1 IDs you already use; new steps get the new IDs given here.

## Setup

Unzip into the repository root. It replaces `CLAUDE.md` and adds this file. Commit it unchanged, then commit after each numbered section.

## The new order

The lesson becomes **13 screens** ("Screen k of 13"). Screens 1 to 4 below are all in Part 1, and every later screen moves down one number.

| Learner screen | Title | Steps | Move 1 step |
|---|---|---|---|
| 2 | The skip-count table | 3T1, 3T2, 3T3 | 1 to 5 |
| 3 | Skip count for any figure (new) | 3S1, 3S2 | 4 |
| 4 | Figure 0, and the rule | 3R (new), 3A1, 3A2, 3B, 3B·f | 5 to 7 |

## 1. The figures stay on screen

On learner Screens 2, 3 and 4, show Figures 1, 2, 3 and 4 of the tile pattern above the table, in the lesson's two colours: the 2 fixed tiles in the constant colour and each group of 3 in the coefficient colour. Each figure lines up in meaning with its column in the table. On Screens 3 and 4 the completed table is shown read-only beneath the figures; on Screen 4 keep its caption "From the last screen". Figures may wrap onto two rows on phones; the 16 px margin rule still applies.

## 2. Screen 2, "The skip-count table"

- **3T1** (fill in the skip-count row): unchanged.
- **3T2** ("What is the 10th number in the skip-count row?"): change only the confirmation to: **"Right: 10 × 3 = 30."** Remove "So the skip-count row is 3n." The learner builds 3n on the next screen.
- **3T3** ("How many more tiles does each figure have than the skip count?"): the learner types **all four** values. Nothing fills in.
  - **Correct (2, 2, 2, 2):** "Right. Every figure has exactly 2 more."
  - **Any 3:** keep the existing response: "3 is what each figure adds. Compare the two rows: 5 and 3, then 8 and 6."
  - **Hint:** "Subtract in each column: 5 − 3, 8 − 6, 11 − 9, 14 − 12."
- **Why?:** unchanged.

## 3. Screen 3 (new), "Skip count for any figure"

**3S1.** "If the tiles were just the skip count by 3, how many would Figure 5 have?" (typed)

| Answer | Response |
|---|---|
| 15 (correct) | Right: 5 × 3 = 15. |
| 17 | That's Figure 5's real tiles. The skip count alone is 3, 6, 9, 12, … |
| 8 | That's 3 + 5. Skip counting by 3 five times is 3 × 5. |
| Hint | Skip count by 3, five times. |

**3S2.** "Which gives the skip count for any figure number n?" (choice; keep the correct option out of first position)

| Option | Response |
|---|---|
| 3 + n | 3 + n gives 8 at Figure 5, not 15. |
| 3 − n | 3 − n gives −2 at Figure 5, not 15. |
| 3n (correct) | Right: 3n. Figure 5 is 3 × 5 = 15. |
| 3 ÷ n | 3 ÷ n gives 0.6 at Figure 5, not 15. |

**Why?:** "In a skip count by 3, the figure number tells you how many 3s there are. Figure 5 is five 3s: 3 × 5 = 15. Call the figure number n, and the skip count is 3 × n, written 3n."

Code computes every number in these responses from the rule.

## 4. Screen 4, "Figure 0, and the rule"

**3R** (new, first step). "But the tiles aren't 3, 6, 9, 12. How many more does every figure have than the skip count?" (typed)

| Answer | Response |
|---|---|
| 2 (correct) | Right. So every figure is 3n, plus 2 more. |
| 3 | 3 is what each figure adds. Look at the "How many more" row. |
| Hint | Look at the "How many more" row in the table. |

Then the existing steps, in this order:

- **3A1** (slide to Figure 0) and **3A2** (how many tiles): unchanged, including the confirmation "Figure 0 has no groups, only the 2 fixed tiles. The same 2 as in the table."
- **3B** (type the rule): unchanged, except its hint becomes: **"Start with the skip count for figure n, then add how many more every figure has."** The 3B·f follow-up keeps its own hint.
- **Why?:** unchanged.

## Testing

Proportionate, as in `CLAUDE.md`:

- **The figures:** Figures 1 to 4 appear on Screens 2, 3 and 4, in both colours.
- **3T2's** new confirmation, with no "3n" in it.
- **3T3:** all four boxes must be typed; nothing fills in. Check the correct response, the "3" response and the hint.
- **3S1 and 3S2:** every response, and 3n not in first position.
- **3R:** its responses, and that it comes before 3A1.
- **3B's** new hint.
- **"Screen k of 13,"** and every later screen shifted by one.
- Rerun the full suite in Chromium and WebKit, including the 16 px margin check at 360 and 390 px.
- Screenshot all 13 screens at phone and desktop size.

## Report

Write `handback/round-6.md` in the usual shape, with the new commit hash and the SHA-256 of `lesson/index.html` for deployment. Don't deploy.
