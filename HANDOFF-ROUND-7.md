# Handoff: round 7, practice and hands-on steps

A learner walk-through against Marc's method (the first principle in `docs/Marc-Teaching-Moves.md`, now binding in `CLAUDE.md`) found that the lesson teaches every part of a rule, but has the learner write a rule with support only once, on one pattern, before the exit ticket asks for one alone. Round 7 adds the missing supported practice, turns three reading steps into hands-on ones, and puts four explanations on the required path.

All learner-facing text below is Marc's: he approved these changes, and sending this file approves the wording.

This file takes precedence over everything before it (see `CLAUDE.md`). Step IDs are the ones you already use; new steps get the IDs given here.

## Setup

Unzip into the repository root. It replaces `CLAUDE.md` and `docs/Marc-Teaching-Moves.md`, and adds this file. Commit it unchanged, then commit after each numbered section.

## The new order: 15 screens

| Learner screen | ID | Title | Part |
|---|---|---|---|
| 1 | 2 | What stays and what grows? | 1 |
| 2 | 3 (3T) | The skip-count table | 1 |
| 3 | 3 (3S) | Skip count for any figure | 1 |
| 4 | 3 (3R, 3A, 3B) | Figure 0, and the rule | 1 |
| 5 | 4 | Why does Figure 1 have 5 tiles if the constant is 2? | 1 |
| 6 | 5 | Which figure has 23 tiles? | 1 |
| 7 | 6 | Does one check prove it? | 1 |
| 8 | 7 | Shared edges | 2 |
| 9 | 7R (new) | The rule for the sticks | 2 |
| 10 | 8 | Are these two rules the same? | 2 |
| 11 | 9 | Forward and backward | 2 |
| 12 | 10 | Three students, three rules | 3 |
| 13 | 10P (new) | Which rule fits? | 4 (new) |
| 14 | 15 | Exit ticket | 5 |
| 15 | 16 | What you showed on your own | 5 |

Part 4 is new, titled **"Practise"**. The exit ticket and self-check move to Part 5, keeping their name "Exit ticket". "Screen k of 15."

---

## 1. Four explanations on the required path

| Step | Change |
|---|---|
| 2B (Screen 1) | Confirmation becomes: "Each figure adds one group of 3 in the second colour. That 3 is the coefficient." |
| Before 3S2 (Screen 3) | A new line above the question: "Let n stand for the figure number. For Figure 5, n = 5." |
| 3S2, correct (Screen 3) | "Right: 3n means 3 × n, three times the figure number. Figure 5 is 3 × 5 = 15." |
| 3A2 (Screen 4) | Confirmation becomes: "Figure 0 has no groups, only the 2 fixed tiles. The same 2 as in the table. That 2 is the constant: what's there at Figure 0." |

## 2. Screen 2: the learner counts the tiles into the table

New first step **3T0**, before 3T1. The table starts with the Figure n row filled in and the Tiles row empty.

- **Prompt:** "Count the tiles in each figure and fill in the Tiles row."
- The learner types all four values. Nothing fills in.

| Answer | Response |
|---|---|
| 5, 8, 11, 14 (correct) | Right: 5, 8, 11, 14. |
| 3, 6, 9, 12 | Those are only the groups of 3. Count every tile, both colours. |
| 2, 2, 2, 2 | Those are only the fixed tiles. Count every tile, both colours. |
| Hint | Count every tile in Figure 1, both colours. |

3T1, 3T2 and 3T3 follow unchanged.

## 3. Screen 5: tap the constant and the group

Two new steps, **4T1** and **4T2**, before the existing choice (4A). The learner taps tiles in Figure 1 to select them, then presses Check.

**4T1. "Tap the tiles the constant counts in Figure 1."**

| Selection | Response |
|---|---|
| The 2 fixed tiles (correct) | Right: the 2 fixed tiles. |
| Any tile from the group | Those tiles are a group, which each figure adds. The constant is what's there at Figure 0. |
| Only one fixed tile | There's one more fixed tile. |
| Hint | Which tiles are in every figure, even Figure 0? |

**4T2. "Now tap the tiles the coefficient counts."**

| Selection | Response |
|---|---|
| The 3 group tiles (correct) | Right: one group of 3. Figure 1 is 2 + 3 = 5. |
| Any fixed tile | The fixed tiles are the constant. The coefficient counts the tiles in each group. |
| Hint | Which tiles does each new figure add? |

4A follows unchanged.

## 4. Screen 6: build up to 23 before solving

New first step **5M**, before the existing step A.

- **Prompt:** "Start from the 2 fixed tiles. Add groups of 3 until there are 23 tiles."
- The figure starts as the 2 fixed tiles. The learner adds a group of 3 (tap or drag) or takes one away. A running total, computed, shows under the figure.
- **At 23:** "23 tiles." The step is done.
- **Past 23:** "That's more than 23. Take a group away." (Show the real total in place of "more than 23" if that's simpler: "That's 26, more than 23. Take a group away.")

Step A follows, with its confirmation changed to: **"Right: 7 groups of 3 on top of the 2 fixed tiles. That's 3n + 2 = 23, so 3n = 21 and n = 7."**

## 5. New Screen 9 (ID 7R), "The rule for the sticks"

The sticks become the learner's second supported practice of Marc's method, with less help than the tiles: no 3n choice this time.

**Shows:** stick Figures 1 to 4, uncoloured as on Screen 8, above a table with Figure n (1 to 4) filled in and empty rows for Sticks, Skip count by 3 and How many more. Build the rows up one at a time, as on Screen 2.

**7R1. "Fill in the Sticks row: count the sticks in each figure."** All four typed.

| Answer | Response |
|---|---|
| 4, 7, 10, 13 (correct) | Right: 4, 7, 10, 13. |
| 4, 8, 12, 16 | That gives every square its own 4 sticks. Neighbouring squares share one. |
| Hint | Count each stick once, including the ones two squares share. |

**7R2. "How many more sticks does each new figure add?"**

| Answer | Response |
|---|---|
| 3 (correct) | Right. Each new square adds 3 sticks. That 3 is the coefficient. |
| 4 | Each new square shares a stick with the square before, so it adds only 3. |
| Hint | Compare Figure 1 and Figure 2: 4 and 7. |

**7R3. "Fill in the skip-count row: count by 3."** The learner types the first two; the rest fill in, as in 3T1.

| Answer | Response |
|---|---|
| 3, 6 (correct) | Right: 3, 6, 9, 12. |
| 4, 7 | Those are the sticks. Skip count by 3 on its own: 3, 6, … |
| Hint | Count by 3, the number each figure adds. |

**7R4. "How many more sticks does each figure have than the skip count?"** All four typed.

| Answer | Response |
|---|---|
| 1, 1, 1, 1 (correct) | Right. Every figure has exactly 1 more. |
| Any 3 | 3 is what each figure adds. Compare the two rows: 4 and 3, then 7 and 6. |
| Hint | Subtract in each column: 4 − 3, 7 − 6, 10 − 9, 13 − 12. |

**Then move 8C1 and 8C2 here from Screen 10**, unchanged except for 8C2's confirmation:

- **8C1:** "Slide to Figure 0." (existing slider, with its existing colouring)
- **8C2:** "How many sticks are left?" Its confirmation becomes: **"One lone stick. That's the constant: what's there at Figure 0."** Its existing "4" response stays.

**7R5. "Type the rule."** (prefix S =)

| Answer | Response |
|---|---|
| 3n + 1 (correct, any equivalent straight-line form) | Right: S = 3n + 1. |
| 4 + 3n | Test it at Figure 1: it gives 7, but Figure 1 has 4 sticks. 4 is Figure 1's total; the constant is what's there at Figure 0. |
| 3n | Every figure has 1 more than the skip count. |
| 4n | Each figure adds 3, not 4. |
| Hint | Start with the skip count for figure n, then add how many more every figure has. |

**Why?:** "Each new square adds 3 sticks, so the sticks grow like the skip count by 3: the coefficient is 3. Every figure has 1 more stick than the skip count: the starting stick, there even at Figure 0. That 1 is the constant. So S = 3n + 1."

## 6. Screen 10 (ID 8), "Are these two rules the same?"

- **The intro becomes:** "Your rule for the sticks is S = 3n + 1. Another student wrote S = 4 + 3(n − 1). Are these two rules the same?"
- **Steps:** only Step A (the values at n = 1, 2 and 3), unchanged. 8C1 and 8C2 have moved to Screen 9.
- **Why?:** unchanged.

## 7. New Screen 13 (ID 10P), "Which rule fits?"

Part 4, "Practise". Two new tile patterns, each drawn in the lesson's two colours as Figures 1, 2 and 3, with a table of Figure n and Tiles beneath.

**10P1.** Pattern: 1 fixed tile plus a group of 5 for each figure (6, 11, 16 tiles). **"Which rule fits this pattern?"** (choice; keep the correct option out of first position)

| Option | Response |
|---|---|
| T = 6 + 5n | 6 is Figure 1's total. The constant is what's there at Figure 0. |
| T = 5n + 1 (correct) | Right: 5 is the coefficient, what each figure adds. 1 is the constant, what's there at Figure 0. |
| T = 6n | Each figure adds 5, not 6. 6n gives 12 at Figure 2, but Figure 2 has 11. |
| T = n + 5 | n + 5 gives 6 at Figure 1, but only 7 at Figure 2. Figure 2 has 11. Each figure adds 5. |

**10P2.** Pattern: 6 fixed tiles plus a group of 2 for each figure (8, 10, 12 tiles). **"Write the rule for this pattern."** (prefix T =)

| Answer | Response |
|---|---|
| 2n + 6 (correct, any equivalent straight-line form) | Right: T = 2n + 6. 2 is the coefficient and 6 is the constant. |
| 8 + 2n | Test it at Figure 1: it gives 10, but Figure 1 has 8. 8 is Figure 1's total; the constant is what's there at Figure 0. |
| 2n | Every figure also has the 6 fixed tiles. |
| 8n | Each figure adds 2, not 8. |
| Hint | Find what each figure adds, then what's there at Figure 0. |

**Why?:** "Every rule here has two parts: what each figure adds, the coefficient, which multiplies n; and what's there at Figure 0, the constant. Figure 1's total always includes one group, so it is never the constant."

Code computes every number in these responses from the patterns.

---

## Testing

Proportionate, as in `CLAUDE.md`:

- Check every new step's correct answer, every predicted wrong answer and every hint: 3T0, 4T1, 4T2, 5M, 7R1 to 7R5, 10P1 and 10P2.
- Check the four changed lines in section 1, the new 8C2 and 5A confirmations, and Screen 10's new intro.
- Check that 8C1 and 8C2 are on Screen 9 and not Screen 10.
- Check that 5M can't be finished at any total other than 23.
- Check "Screen k of 15", the new Part 4 "Practise", and that the exit ticket and self-check are in Part 5.
- Rerun the full suite in Chromium and WebKit, including the 16 px margin check at 360 and 390 px.
- Screenshot all 15 screens at phone and desktop size.

## After building: the method audit (a report)

Once the build passes, walk all 15 screens as a learner against the first principle in `docs/Marc-Teaching-Moves.md`. For every step, ask three questions:

1. Was what it needs explained earlier, on the required path?
2. Was it practised with support, on more than one example, before being asked alone?
3. If it's done alone, was it practised first?

Report every step that fails, by step ID, in `audit/gradual-release-audit.md`. Describe what's missing; don't fix it and don't write learner text.

## Report

Write `handback/round-7.md` in the usual shape, including the audit's findings, the new commit hash and the SHA-256 of `lesson/index.html`. Don't deploy.
