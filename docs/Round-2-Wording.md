# Round 2: Wording (approved)

**Approved by Marc on 30 October 2026.** Learner-facing text for round 2, keyed by the round 1 step IDs. Everything follows the answers in `Round-2-Decisions.md`.

Screen 1 is cut (Q1), so its prompts and hints are gone. Step IDs stay as in round 1 so they match the data block; Claude Code renumbers the screens for the learner ("Screen k of 15").

---

## A. Prompts

All 33 remaining prompts in the round 1 handback are approved as written, except one:

| Step | Now | Change to |
|---|---|---|
| 14A | What is the average speed for h = 0.5? (distance at 3.5 s: 12.25 m) | What is the average speed when h = 0.5? The ball is at 12.25 m at 3.5 seconds. |

---

## B. Hints for unpredicted wrong answers (24)

Each points to the first step without giving the answer. These replace "Not yet. Try again.", which stays only as a last resort.

| Step | Correct | Hint |
|---|---|---|
| 2A | 2 | Count only the tiles in the first colour in one figure. Then check another figure. |
| 2B | 3 | Count the tiles in Figure 1 and in Figure 2. How many more does Figure 2 have? |
| 2C2 | 14 | Count the groups of 3 in Figure 4, then add the fixed tiles. |
| 3A2 | 2 | Look at the picture at Figure 0. Which tiles are still there? |
| 6A1 | 5 | Replace n with 1 in the student's rule, then multiply. |
| 6B | 0 and 50 | Use the student's rule, 5n, not the picture. Replace n with 0, then with 10. |
| 7A2 | 13 | Count every stick in Figure 4 once. |
| 7B | 31 | Start from Figure 1, then count how many sticks each new square adds. |
| 7·1 | 8 | Use the student's claim: 4 sticks for each square, and Figure 2 has 2 squares. |
| 7·4 | 3 and 3 | Compare Figure 1 and Figure 2: how many sticks were added? Then compare Figure 2 and Figure 3. |
| 7·5 | 10 | Figure 1 is 1 + 3. Figure 2 is 1 + two 3s. Follow the same pattern. |
| 7·6 | 31 | Figure 10 is 1 plus how many 3s? |
| 8A | 4, 7, 10 | In 3n + 1, multiply n by 3 first, then add 1. |
| 8C2 | 1 | At Figure 0 there are no squares. Which stick is still there? |
| 9A | 121 | Replace n with 40 in 3n + 1. Multiply first, then add. |
| 10B2 | 2 | Count the squares in your build. |
| 10B3 | 2 | Figure n has n squares. |
| 10D | Mina ✓, Arun ✗, Nina ✓ | Build that rule for Figure 1 again. Does it make one square? |
| 11A | 16 | Figure 4 is a square 4 tiles wide and 4 tiles tall. |
| 11B2 | 9 | Look at the borders so far: 3, 5, 7. How much bigger is each one than the last? |
| 11C | No | Look at the borders: 3, 5, 7, 9. Is the same amount added each time? |
| 13A | 7 | How far does the ball roll between 3 s and 4 s? Then divide by the time it took. |
| 14A | 6.5 | Find the distance rolled in the extra time: 12.25 − 9. Then divide by h. |
| 14B2 | 6 | Look at the averages as h gets smaller: 6.5, 6.1, 6.01. What number are they getting closer to? |

---

## C. Confirmations for correct answers (9)

| Step | Correct | Confirmation |
|---|---|---|
| 4A | Figure 1 has one group of 3 plus the 2 fixed tiles… | Right. Figure 1 is the constant plus one group: 2 + 3 = 5. |
| 6A1 | 5 | Right: 5 × 1 = 5. The rule matches Figure 1. |
| 6D | It works for three figures, and every figure adds… | Right. Three checks, and a structure that adds the same group every time. |
| 7·1 | 8 | Right: 2 squares × 4 sticks = 8, if the claim were true. |
| 7·4 | 3 and 3 | Right. Each new square adds only 3 sticks. |
| 10B2 | 2 | Right: two squares. |
| 10D | Mina ✓, Arun ✗, Nina ✓ | Right. Mina's and Nina's rules build Figure 1. Arun's builds Figure 2. |
| 11A | 16 | Right: 4 × 4 = 16. |
| 11C | No | Right. The borders grow: 3, 5, 7, 9. |

---

## D. Follow-up items after a second miss (Q3)

Each appears only after the "Answer" card on that step. New numbers, the same idea, the same colours. The learner must answer it to continue.

**After 3B (the tile rule).** A new pattern: 4 fixed tiles in the first colour, plus n groups of 2 in the second colour. Figures 1, 2 and 3 have 6, 8 and 10 tiles.
- **Prompt:** Type the rule for this pattern.
- **Correct (2n + 4):** Right. 4 tiles at Figure 0, and each figure adds 2.
- **6 + 2n:** The screen tests it at n = 1: 8, but Figure 1 has 6. "6 is the total for Figure 1. The constant is the value at Figure 0."
- **Hint:** How many tiles does each figure add, and how many are there at Figure 0?

**After 7B (Figure 10 sticks).** A new shape: a row of triangles made of equal sticks, neighbours sharing a stick. Figures 1, 2 and 3 use 3, 5 and 7 sticks.
- **Prompt:** How many sticks does Figure 10 have?
- **Correct (21):** Right. 1 + ten 2s = 21.
- **30:** Neighbouring triangles share a stick. Each new triangle adds only 2.
- **20:** 2 for each triangle, but Figure 1 needs one more stick.
- **Hint:** Count how many sticks each new triangle adds.

**After 8B (the simplification).**
- **Prompt:** Simplify 5 + 2(n − 1).
- **Correct (2n + 3):** Right. 5 + 2n − 2 = 2n + 3.
- **2n + 4:** The 2 multiplies both terms in the bracket. You multiplied the n but not the 1.
- **2n + 7:** 2 × (−1) is −2, not +2.
- **7n − 7:** You added 5 + 2 before multiplying. Multiply 2(n − 1) first.
- **7n − 2:** 5 and 2n aren't like terms. Only the numbers 5 and −2 combine.
- **Hint:** Distribute first: 2 × n and 2 × (−1). Then combine the numbers.
- Every wrong answer is tested by substitution, as on 8B.

---

## E. New text from your decisions

| Where | Text |
|---|---|
| Screen 6, new "No" option (Q7) | It might be wrong, but one figure can't tell you. Try another one. |
| Screen 7, step 1, learner types 7 (Q8) | 7 is the real count. If every square had its own 4 sticks, Figure 2 would have 8. Why only 7? |
| Screen 10 and Screen 8's Why? drawing, Nina's 4 (Q2) | Neutral colour, labelled: first square |
| Screen 11, the build after "12" (Q9) | Fill in the 4-by-4 square. |
| Screen 12, Check after a slider moved (Q10) | Your line passes through 2 of the 4 points. (with the real number) |
| Screen 12, Check with no slider moved (Q10) | Move a slider first. |
| Screen 13 intro (Q14) | Figures come in whole numbers, but time doesn't. A ball rolls d = t² metres in t seconds. |
| Screen 14, new line before Step A (Q4) | h is the extra time after 3 seconds. |
| Screen 14, table rows (Q4) | Distance in the extra time (m): 7, 3.25, 0.61, 0.0601 / Average speed = distance ÷ h (m/s): 7, 6.5, 6.1, 6.01 |
| Screen 15 title (Q13) | The garden |
| Screen 15 intro (Q14) | A garden starts with 24 plants before any new beds are built, and each new bed adds exactly 6 plants. Let n be the number of new beds and P the total number of plants. |
| Screen 16 title (Q12) | What you showed on your own |
| Screen 16 items (Q12), one per exit item, ticked only from the first submission | Wrote a rule from a situation / Found the value at n = 0 / Used a rule to find a total / Found where a shifted rule goes wrong / Wrote an equivalent rule using (n − 1) / Recognized which pattern has a constant difference / Explained why a rule works for every n |
