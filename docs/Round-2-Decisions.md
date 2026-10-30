# Round 2: Decisions (answered)

**Marc approved every recommendation below on 30 October 2026.** For Q2 he chose option (b).

Every open question from Claude Code's round 1 handback (sections D to G) and from the 12 questions in its full REPORT.md, plus four from the review. Each has what's built now and my recommendation. The wording (35 prompts, 25 hints, 9 confirmations) comes after these, because several depend on your answers here.

---

## Part 1. From the review

**Q1. Cut Screen 1 and open on the tiles?**
- **Now:** the lesson opens with "Retrieval: is 103 in the pattern?" and "Type the explicit rule." A reviewer's first screen is symbolic, not interactive.
- **Recommendation:** cut it. The lesson becomes 15 screens and opens on the coloured tiles. The stage it assumes goes in your examples statement, and your row comparison stays in Screen 3's Why?.
- **Marc's answer:** yes.

**Q2. How should Nina's 4 be coloured?**
- **Now:** in 4 + 3(n − 1), the 4 is orange, the constant colour. But that 4 is the first square's total, and the constant (the value at Figure 0) is 1. Screen 4 teaches exactly that difference.
- **Options:** (a) keep it orange and explain it in Screen 10's Why?; (b) show the 4 in a neutral colour, labelled "first square," so orange only ever means the value at Figure 0; (c) another treatment you choose.
- **Recommendation:** (b). It's your colour rule, so it's your call.
- **Marc's answer:** (b).

**Q3. Add a follow-up item after a second miss, at three key steps only?**
- **Now:** after two misses the answer is shown and the learner types it. That moves them on but doesn't show the mistake is repaired.
- **Recommendation:** yes, at three steps only: the tile rule (3B), Figure 10 sticks (7B) and the simplification (8B). After the answer is shown, one new item with different numbers. Everywhere else stays as it is.
- **Marc's answer:** yes.

**Q4. Keep the calculus in the main path, with two fixes?**
- **Now:** Screen 14 never says what h is, and it shows the border shrinking but not why border ÷ h settles on 6 while the border itself goes to 0.
- **Recommendation:** keep it in the main path. It's your only evidence above algebra. Add the line "h is the extra time after 3 seconds," and show two rows side by side as h shrinks:

| h (s) | 1 | 0.5 | 0.1 | 0.01 |
|---|---|---|---|---|
| Distance in the extra time (m) | 7 | 3.25 | 0.61 | 0.0601 |
| Average speed = distance ÷ h (m/s) | 7 | 6.5 | 6.1 | 6.01 |

- **Marc's answer:** yes.

---

## Part 2. Claude Code's section E: how screens behave

**Q5. Why? appears only on a screen's last step.**
- **Now:** Why? appears after the first Check on the last step, so it can't give away later answers. A second-miss demonstration on an earlier step doesn't open it.
- **Recommendation:** keep both. On an earlier step the Why? text would still give away the answers that come after it.
- **Marc's answer:** yes.

**Q6. The second miss on screens with no demonstration of their own.**
- **Now:** an "Answer" card shows the answer and the learner types it to continue.
- **Recommendation:** keep, plus Q3.
- **Marc's answer:** yes.

**Q7. Add "No" on Screen 6.**
- **Now:** only "Yes" and "Maybe" are offered, so a learner who knows 3n + 2 has no right choice.
- **Recommendation:** add "No," with the response: "It might be wrong, but one figure can't tell you. Try another one."
- **Marc's answer:** yes.

**Q8. Screen 7: a learner predicts 7 for Figure 2.**
- **Now:** not handled. Any Figure 3 prediction other than 10 is treated like 11.
- **Recommendation:** for 7: "7 is the real count. If every square had its own 4 sticks, Figure 2 would have 8. Why only 7?" Then go straight to the shared edge. Keep the Figure 3 handling as built.
- **Marc's answer:** yes.

**Q9. Screen 11: make "Build it: a 4-by-4 square" a real build.**
- **Now:** a dashed 4 × 4 outline.
- **Recommendation:** a real build, following your principle that students touch the parts.
- **Marc's answer:** yes.

**Q10. Screen 12: what a Check does.**
- **Now:** a Check rings the points the line hits and says nothing. Three Checks unlock Next even if the sliders never move.
- **Recommendation:** a Check counts as a try only if a slider moved since the last one, and it says "Your line passes through 2 of the 4 points" (with the real number).
- **Marc's answer:** yes.

**Q11. Screen 15: the two choice items, Why? after submission, and one submission.**
- **Now:** items 6 and 7 are choices, although my spec said "typed answers only." No Why? appears after submission, because the spec wrote none. Submit works once.
- **Recommendation:** keep the two choices; my spec was wrong. The response shown for each wrong item after submission is enough; no Why? needed. Keep one submission, so the exit ticket stays independent evidence. The summary after Submit is the self-check in Q12.
- **Marc's answer:** yes.

**Q12. The self-check.**
- **Now:** items are ticked from the guided screens, so all eight stay ticked even when every exit answer is wrong.
- **Recommendation:** tick items only from the exit ticket's first submission, and replace the list with one line per exit item, titled "What you showed on your own":
  1. Wrote a rule from a situation
  2. Found the value at n = 0
  3. Used a rule to find a total
  4. Found where a shifted rule goes wrong
  5. Wrote an equivalent rule using (n − 1)
  6. Recognized which pattern has a constant difference
  7. Explained why a rule works for every n
- **Marc's answer:** yes.

**Q13. Titles.**
- **Now:** "Retrieval: is 103 in the pattern?" and "The garden (independent evidence)."
- **Recommendation:** drop "Retrieval:" (moot if Q1 is yes) and "(independent evidence)." Those were my labels, not learner text.
- **Marc's answer:** yes.

**Q14. Intros over two sentences.**
- **Recommendation:**
  - Screen 13: "Figures come in whole numbers, but time doesn't. A ball rolls d = t² metres in t seconds."
  - Screen 15: "A garden starts with 24 plants before any new beds are built, and each new bed adds exactly 6 plants. Let n be the number of new beds and P the total number of plants."
- **Marc's answer:** yes.

---

## Part 3. Claude Code's defaults and additions (sections D, F and G)

**Q15. The colours.**
- **Now:** orange for the constant, blue for the coefficient, both checked for colour-blind learners and readable in light and dark mode. No other colour in the interface.
- **Recommendation:** keep.
- **Marc's answer:** yes.

**Q16. Progress bar and Back.**
- **Now:** a thin bar with "Screen k of 16"; Back shows earlier screens read-only, with Why? still openable.
- **Recommendation:** keep both.
- **Marc's answer:** yes.

**Q17. Its five additions beyond the spec.**
- **Now:** Screens 5 and 9 show the rule as a reminder; Screens 4 and 6 show Figure 1; Screen 5's Why? draws Figure 7; Screen 8's Why? draws Figure 3 grouped both ways; Screen 7 colours the sticks when Figure 1 becomes 1 + 3.
- **Recommendation:** keep all five. Screen 8's drawing follows your answer to Q2.
- **Marc's answer:** yes.

**Q18. Interface wording.**
- **Now:** "Not yet. Try again." · "Type a number." · "Answer" · "Compare" · "Mine says the same thing." · "Check · Why? · Back · Next · Submit."
- **Recommendation:** keep all of it. "Not yet. Try again." becomes a last resort, once the 25 hints are written.
- **Marc's answer:** yes.

---

## Part 4. Fixes needing no decision

These go into round 2 as they stand:

- remove the "null" text on Screens 4 and 5
- stop math expressions from wrapping onto two lines on phones
- make Screen 11's figures larger, with the border clearly visible
- display "T = n," not "T = 1n + 0"
- the checker accepts only straight-line rules
- rerun the existing test suite, add checks for these fixes, and run it once in WebKit (Safari's engine). No new tests for every way a student might phrase an answer.

## Part 5. Wording

All learner-facing wording for round 2 is in `Round-2-Wording.md`, approved by Marc.
