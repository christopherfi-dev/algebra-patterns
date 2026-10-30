# Round 2 amendment

Marc has narrowed the lesson to one idea: from a growing figure to its rule. That is the first lesson of his pattern unit, the one he taught. Patterns without a constant difference, and the calculus, belong to later lessons, so they come out. The exit ticket now checks only that big idea, using the same kind of pattern with new numbers.

This file takes precedence over `docs/Round-2-Decisions.md`, `docs/Round-2-Wording.md` and the spec.

- **If round 2 is still running:** stop work on anything this file cuts, keep everything already done that it doesn't touch, and apply this file as part of round 2.
- **If round 2 is already finished:** apply this file as round 3.

All learner-facing text below is Marc's: he approved the exit ticket items and the Screen 3 change, and sending this file approves the wording.

---

## 1. Cut

Remove these screens completely, with their data, figures, interactions and tests:

| Round 1 screen | Content |
|---|---|
| 11 | Square figures |
| 12 | Can a line fit? |
| 13 | A square that grows smoothly (the ball) |
| 14 | Shrink the border |
| 15 | The garden exit ticket, replaced in section 3 |

This drops these round 2 items:

- **From Round-2-Decisions:** Q4 (Screen 14), Q9 (Screen 11's build), Q10 (Screen 12's Check), and Q14's Screen 13 intro.
- **From the Part 4 fixes:** the Screen 11 legibility fix.
- **From Round-2-Wording:** hints 11A, 11B2, 11C, 13A, 14A and 14B2; confirmations 11A and 11C; the 14A prompt change; and every Screen 11 to 15 line in section E.

**Everything else in round 2 stands:**

- the five defect fixes, including the "null" fix and the linear-only checker
- cutting Screen 1
- Q2, Q3, Q5 to Q8 and Q11
- every hint and confirmation for round 1 Screens 2 to 10
- the three follow-up items.

The rule-display fix ("T = n," not "T = 1n + 0") still applies anywhere rules are displayed.

## 2. Screen order

The lesson is now 11 screens: round 1 Screens 2 to 10, then the new exit ticket, then the self-check. Progress reads "Screen k of 11."

## 3. The new exit ticket

**Title:** Exit ticket

**Intro:** Figures 1, 2 and 3 of a new pattern. Answer on your own; you'll see your results when you submit.

**Figure:** a tile pattern in the lesson's two colours. 5 fixed tiles in the constant colour, plus one group of 4 in the coefficient colour for each figure. Show Figures 1, 2 and 3, with 9, 13 and 17 tiles.

**Rules, as before:** typed answers, no hints and no Why? before submission, one submission, and each wrong item shows its response afterwards.

| Item | Correct | Responses after submission |
|---|---|---|
| 1. Complete the table. Rows: Figure n (1 to 5); Tiles: 9, 13, 17, ?, ?; Skip count by 4: 4, 8, ?, ?, ? | Tiles 21, 25; skip count 12, 16, 20 | Any wrong tile count: "Each figure adds 4 tiles." Any wrong skip count: "Count by 4: 4, 8, 12, …" |
| 2. Write the rule. T = | 4n + 5 (any equivalent straight-line form) | **9 + 4n:** "9 is the total for Figure 1. The constant is the value at Figure 0." **9n:** "Only 4 tiles repeat in each figure." **4n:** "Each figure also has the 5 fixed tiles." **Anything else:** "How many tiles does each figure add, and how many are there at Figure 0?" |
| 3. How many tiles are in Figure 25? | 105 | **100:** "You counted the groups. Add the 5 fixed tiles." **225:** "Only 4 tiles repeat in each figure." **109:** "That's Figure 26." **Anything else:** "Replace n with 25 in T = 4n + 5." |
| 4. Which figure has 65 tiles? | 15 | **14:** "Start from the 5 fixed tiles, not Figure 1's 9." **16.25:** "Undo the + 5 first, then the × 4." **Anything else:** "Solve 4n + 5 = 65." |

## 4. The self-check

**Title:** What you showed on your own

One line per exit item, in order. A line is ticked only if that item was fully correct on the single submission; item 1 needs all five blanks right. Nothing from the lesson screens feeds it.

1. Completed the table
2. Wrote the rule for a new pattern
3. Found the total for any figure
4. Found the figure for a given total

## 5. Screen 3 gets Marc's row comparison as real steps

The exit ticket asks for a table, so the lesson must have the learner complete one. Add these steps to round 1 Screen 3, before the existing steps (slide to Figure 0, then type the rule). Build the table up one row at a time.

**Table shown:** Figure n: 1, 2, 3, 4. Tiles: 5, 8, 11, 14. Then a third row, "Skip count by 3," and a fourth, "How many more."

| Step | Prompt | Correct | Confirmation | Predicted error and response | Hint |
|---|---|---|---|---|---|
| 3T1 | Fill in the skip-count row: count by 3. (The learner types the first two; the rest fill in.) | 3, 6 | Right: 3, 6, 9, 12. | **5, 8:** "Those are the tiles. Skip count by 3 on its own: 3, 6, …" | Count by 3, the number each figure adds. |
| 3T2 | What is the 10th number in the skip-count row? | 30 | Right: 10 × 3 = 30. So the skip-count row is 3n. | **32:** "32 is Figure 10's tiles. The skip-count row is only the 3s." | The 1st is 1 × 3. The 2nd is 2 × 3. |
| 3T3 | How many more tiles does each figure have than the skip count? (The learner types the first; the rest fill in.) | 2 | Right: 2 more every time. | **3:** "3 is what each figure adds. Compare the two rows: 5 and 3, then 8 and 6." | Subtract: 5 − 3, then 8 − 6. |

Then the existing steps follow. Change only the confirmation on the Figure 0 count (round 1 step 3A2) to: "Figure 0 has no groups, only the 2 fixed tiles. The same 2 as in the table."

Screen 3's Why? stays as it is.

## 6. Testing

Keep it proportionate, as in `CLAUDE.md`.

- Remove the tests for the cut screens.
- Add checks for:
  - the new exit ticket's correct answers and every response above;
  - the self-check showing 0 ticks when all four exit items are wrong and 4 when all are right;
  - Screen 3's three new steps, with their responses;
  - "Screen k of 11."
- Rerun the rest of the suite, in Chromium and WebKit.
- Screenshot all 11 screens at phone size and desktop size.

## 7. Report

Cover this amendment in the round's handback: `handback/round-2.md` if round 2 was still running, otherwise `handback/round-3.md`. List anything already built for the cut screens that was removed.
