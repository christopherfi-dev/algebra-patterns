# Growing Patterns: Finding the Rule: report (round 8)

The lesson is `lesson/index.html`. It is one self-contained file: one `LESSON` data block, one engine, and a `MODEL` section that computes every number shown. It makes no network calls, uses no libraries or web fonts, and stores nothing about the learner.

It teaches one idea, from a growing figure to its rule, in **16 screens**. Every test passes in both engines:

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 4,498 | 0 |
| WebKit 26.6 (Safari's engine) | 3,711 | 0 |

The source of truth, in order of precedence:
1. `HANDOFF-ROUND-8.md`;
2. `HANDOFF-ROUND-7.md`;
3. `HANDOFF-ROUND-6.md`;
4. `HANDOFF-ROUND-5.md`;
5. `HANDOFF-ROUND-4.md`;
6. `HANDOFF-ROUND-3.md`;
7. `ROUND-2-AMENDMENT.md`, with Marc's two answers in `docs/Round-2-Amendment-Answers.md`;
8. `docs/Round-2-Decisions.md` and `docs/Round-2-Wording.md`;
9. the original spec.

Since round 7, `CLAUDE.md` makes Marc's teaching method binding: gradual release (I do, we do, you do), as the first principle in `docs/Marc-Teaching-Moves.md`. Steps that break it are reported by step ID in `audit/gradual-release-audit.md`, not fixed.

**Step IDs** keep their round 1 numbers. Round 1 Screen 3 is now four learner screens, all with the "3" prefix: 3T0–3T3 on the table screen, 3S1 and 3S2 on the skip-count screen (round 6), 3R, 3A1 and 3A2 on "Figure 0", and 3B on "The rule" (round 8), which comes after Screen 5. Round 7's new screens use the IDs its handoff gives: 7R1–7R5 for the sticks rule and 10P1, 10P2 for the practice screen. 8C1 and 8C2 moved to the sticks rule screen and keep their IDs. The exit ticket is ID 15 and the self-check ID 16.

| Learner screen | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ID | 2 | 3 (3T) | 3 (3S) | 3 (3R, 3A) | 4 | 3 (3B) | 5 | 6 | 7 | 7R | 8 | 9 | 10 | 10P | 15 | 16 |

---

## 1. What is built, screen by screen

| Screen | ID | Title | What the learner does |
|---|---|---|---|
| 1 | 2 | What stays and what grows? | Figures 1–3 in the two colours. Types the fixed tiles (2) and what each figure adds (3, "That 3 is the coefficient."). Drags or taps a group of 3 onto Figure 3 to make Figure 4, then types its total (14). |
| 2 | 3 (3T0–3T3) | The skip-count table | Figures 1–4 above the table, in the two colours. Marc's row comparison, built one row at a time. Counts the tiles into the table, all four typed (5, 8, 11, 14; 3T0, new in round 7). Fills in the skip count by 3 (types 3 and 6; 9 and 12 fill in). Types the 10th skip-count number (30). Types all four "How many more" values (2, 2, 2, 2). |
| 3 | 3 (3S1, 3S2) | Skip count for any figure | Figures 1–4 above the completed table, read-only. Types Figure 5's tiles if they were just the skip count (15). Reads "Let n stand for the figure number. For Figure 5, n = 5.", then chooses 3 × n from 3 + n, 3 − n, 3 × n and 3 ÷ n: "Right: 3 × n, written 3n: three times the figure number…" (round 8). |
| 4 | 3 (3R, 3A1, 3A2) | Figure 0 | Figures 1–4 above the completed table, captioned "From the last screen". Types how many more every figure has than the skip count (2). Slides back to Figure 0 and types its tiles: "…That 2 is the constant: what's there at Figure 0." New Why? (round 8). |
| 5 | 4 (4T1, 4T2) | Why does Figure 1 have 5 tiles if the constant is 2? | Taps the tiles the constant counts in Figure 1, then the tiles the coefficient counts, each in its own large Figure 1. No small figure at the top and no 4A since round 8; the Why? follows 4T2. |
| 6 | 3 (3B) | The rule | **New in round 8.** Figures 1–4 above the completed table, captioned "Your table". Reads "A rule gives the total for any figure. T is the total number of tiles and n is the figure number. The coefficient multiplies n; the constant is added." Types the rule, with its own slider: wrong rules move it to the figure they test, and once right, sliding checks any figure. After a second miss, the Answer card shows the reasoning. |
| 7 | 5 (5M, 5A) | Which figure has 23 tiles? | Starting from the 2 fixed tiles, adds groups of 3 by drag or tap until there are 23, with the total shown. Then types 7. |
| 8 | 6 | Does one check prove it? | Types 5n at Figure 1, then chooses Yes, Maybe or No; **Maybe and No are both right**. Types 5n at Figures 0 and 10, then 3n + 2 at Figures 0, 1 and 10. Chooses why 3n + 2 can be trusted. |
| 9 | 7 | Shared edges | Drags sticks onto Figure 4's edges. Types 13, then Figure 10's total. Answering 40 starts Marc's move in six steps. |
| 10 | 7R (7R1–7R5, 8C1, 8C2) | The rule for the sticks | Stick Figures 1–4, uncoloured, above a table built row by row: the Sticks row (4, 7, 10, 13), what each figure adds (3, the coefficient), the skip count by 3, and "How many more" (1, 1, 1, 1). Slides to Figure 0 and types 1 ("That's the constant…"). Reads "S is the total number of sticks." (round 8) and types the rule, S = 3n + 1. |
| 11 | 8 | Are these two rules the same? | "Your rule for the sticks is S = 3n + 1. Another student wrote S = 4 + 3(n − 1)…" Reads the worked "For n = 2: 4 + 3(2 − 1) = 4 + 3 × 1 = 7." (round 8), then types the other five values; that box is filled in. |
| 12 | 9 | Forward and backward | Types Figure 40's sticks (121). Reads "To go backwards, take away the constant, then divide by the coefficient." (round 8), then types the figure that uses 100 sticks (33). |
| 13 | 10 | Three students, three rules | Builds each student's rule for Figure 1. Marks each rule correct or incorrect. Writes an explanation using the frame "Arun's 4 is already ___. …" (round 8) and compares it with the model. |
| 14 | 10P (10P1, 10P2) | Which rule fits? | Two new tile patterns, each with Figures 1–3 and a table. Chooses the rule for 1 fixed tile plus groups of 5 (T = 5n + 1), then writes the rule for 6 fixed tiles plus groups of 2 (T = 2n + 6). |
| 15 | 15 | Exit ticket | A new pattern: 5 fixed tiles plus groups of 4. (1) complete the table; (2) write the rule, and (2b) choose what the constant counts; (3) the tiles in Figure 25; (4) the figure with 65 tiles. One submission. |
| 16 | 16 | What you showed on your own | Four lines, ticked only from the exit ticket's single submission. |

**Parts:**
- Part 1: Tiles. See the structure (Screens 1–8)
- Part 2: Sticks. Two ways to see one rule (Screens 9–12)
- Part 3: Evaluate and repair (Screen 13)
- Part 4: Practise (Screen 14; new in round 7)
- Part 5: Exit ticket (Screens 15 and 16)

### What round 8 changed

Round 8 answers the round 7 audit. Most of it is wording and order; nothing new is taught, and the exit ticket doesn't change.

| Section | Change |
|---|---|
| 1 | **The rule and its letters defined:** a line before 3B ("A rule gives the total for any figure. T is …") and one before 7R5 ("S is the total number of sticks."). |
| 2 | **3S2:** the right option is written "3 × n"; its confirmation says "written 3n". |
| 3 | **Reorder:** "Figure 0" (3R, 3A1, 3A2, new Why?), then Screen 5 (4T1, 4T2; no small Figure 1, no 4A), then the new "The rule" (3B, the table captioned "Your table", the old Why?). The lesson is 16 screens. |
| 4 | **3B·f and 7B·f removed.** 3B's Answer card now reads "The skip count is 3n, and every figure has 2 more: T = 3n + 2." |
| 5 | **8A:** the worked substitution for n = 2 comes first, and that box is filled in with 7. |
| 6 | **10E:** a sentence frame above the text box. |
| 7 | **9B:** the method stated first. |

7B stays as built (Marc's decision). Marc answered one question this round: 3B keeps a slider of its own on "The rule" (section 4 below).

### What round 7 changed

A walk-through against Marc's method found the lesson taught every part of a rule but had the learner write a rule with support only once before the exit ticket. Round 7 adds supported practice, turns three reading steps into hands-on ones, and puts four explanations on the required path.

| Section | Change |
|---|---|
| 1 | **Four explanations on the required path:** 2B names the coefficient; a line above 3S2 introduces n; 3S2's confirmation says what 3n means; 3A2 names the constant. |
| 2 | **3T0:** the learner counts the tiles into the table, all four typed. |
| 3 | **4T1, 4T2:** tap the tiles the constant counts in Figure 1, then the tiles the coefficient counts. |
| 4 | **5M:** build up to 23 by adding groups of 3 to the 2 fixed tiles, before 5A. 5A's confirmation is new. |
| 5 | **New Screen 9, "The rule for the sticks":** the learner's second supported rule, with less help than the tiles. 8C1 and 8C2 move here; 8C2's confirmation names the constant. |
| 6 | **Screen 10:** new intro, and only step 8A. |
| 7 | **New Screen 13, "Which rule fits?", Part 4 "Practise":** choose a rule, then write one, on two new patterns. The exit ticket and self-check move to Part 5. The lesson is 15 screens. |

`CLAUDE.md` gains "Marc's teaching method", and `docs/Marc-Teaching-Moves.md` gains gradual release as its first principle. The audit the handoff asks for is in `audit/gradual-release-audit.md` (see section 6).

### What round 6 changed

Marc found the step from the table to the rule was a jump. Round 6 rebuilds learner Screens 2 and 3 to follow his move 1 step by step, and adds a screen between them.

| Section | Change |
|---|---|
| 1 | **Figures 1–4 stay on screen** above the table on Screens 2, 3 and 4, in the two colours: 2 fixed tiles in the constant colour and each group of 3 in the coefficient colour. On Screens 3 and 4 the completed table is read-only beneath them; Screen 4 keeps "From the last screen". Below 420 px these figures are drawn at 85% so they take two rows (my addition, decision 11). |
| 2 | **Screen 2.** 3T2's confirmation is "Right: 10 × 3 = 30." (no 3n yet). 3T3: the learner types all four values; nothing fills in. "Right. Every figure has exactly 2 more." A 3 in any box gets the existing "3 is what each figure adds…" response. New hint: "Subtract in each column: 5 − 3, 8 − 6, 11 − 9, 14 − 12." |
| 3 | **New Screen 3, "Skip count for any figure".** 3S1 (typed): Figure 5 as just the skip count, with responses for 15, 17 and 8, and a hint. 3S2 (choice): 3 + n, 3 − n, 3n, 3 ÷ n, with the right option third and each wrong option saying what it gives at Figure 5. New Why?. The lesson is 13 screens, and every later screen moves down one. |
| 4 | **Screen 4.** A new first step, 3R: how many more every figure has than the skip count (2, with a response for 3 and a hint). Then 3A1, 3A2 and 3B unchanged, except 3B's hint: "Start with the skip count for figure n, then add how many more every figure has." 3B·f keeps its own hint. |

`README.md` now says 13 screens.

### What round 5 changed

| Where | Change |
|---|---|
| Browser tab, header | **The new title, "Growing Patterns: Finding the Rule".** It is in the page `<title>` and in the data block's lesson title, which the header shows. "Seeing the Rule" no longer appears anywhere in `lesson/index.html`. `README.md` has the new title too. |
| Header, below 420 px (Marc's option 1, see section 4) | **"Screen k of 12" sits on its own line under the title.** The title stays on one line with room to spare, and the header is 66 px tall on phones instead of 43 px. From 420 px up, including desktop, the two still sit side by side. Layout only. |

The file name, the screens, the step IDs and every other piece of text are unchanged. Earlier docs, handoffs and reports keep the old title, because they are records.

### What round 4 changed

| Fix | Change |
|---|---|
| 1 | **6A2 accepts "No".** "No" is now right, with its confirmation: "Right, it's wrong, and the next step shows where. But Figure 1 alone couldn't tell you that. Always try another one." "Maybe" is unchanged and "Yes" is still wrong. If "Yes" is chosen twice, the Answer card lists both right options. |
| 2 | **Equation chains may break after "=".** A chain with two or more "=" may break after each "=", and each piece stays whole. Screen 8's Why? chain had been one 287 px unit; its longest piece is now 115 px. The same applies to the slider readout on the rule screen ("T = 3 × 10 + 2 = 32"). A single equation such as "T = 3n + 2" still never breaks. |
| 2 (my addition) | **Screen 8's two-rule table on narrow phones.** It had 18 px spare at 360 px here, so below 420 px each rule now sits above its row of three boxes. To meet the 16 px margin at 360 px, the boxes in the two typed tables (Screen 2's table and exit item 1) are now 44 px, the touch minimum. A response's text column now fills its box, with no visible change. Layout and widths only. |
| 3 | **Non-breaking spaces** in "Skip count by 3" and "Skip count by 4". As well as the two places named (3T1, exit item 1), they're in the two other places that label appears: the read-only table on the rule screen and Screen 3's Why? table. |
| 4 | `docs/Marc-Teaching-Moves.md` replaced (one sentence in move 3). Documentation only. |

### What round 3 changed

| Section | Change |
|---|---|
| 1 | Marc's answers: Arun's 4 stays orange; every round 2 decision is approved as built. No code change. |
| 2 | **Defect:** "S = 4 + 3(n − 1)" broke across two lines as a row label on Screen 8, because only body text was protected. Table headers, row labels, captions and field labels now go through the same renderer, so every expression is one unbreakable unit while the words around it wrap. On phones, Screen 8's input boxes are narrower (50 px) so the label fits whole at 390 px. |
| 3 | Round 1 Screen 3 is split into "The skip-count table" and "Figure 0, and the rule", which opens with the completed table read-only. The lesson is 12 screens. |
| 4 | Step 8B and the 8B·f follow-up are cut, with the reminder card, responses, hint and tests. Step 8A's confirmation is "Right. The same values for all three figures." |
| 5 | Exit item 2b is added to question 2, and self-check line 2 changes. |
| 6 | **Polish, widths only:** the exit ticket's "Skip count by 4" now takes at most two lines from 360 px up (one on desktop), and Screen 2's value columns are all one width. |

---

## 2. Decisions as built

Marc approved everything listed for him in round 2 ("approved as built", HANDOFF-ROUND-3 section 1). Choices new in round 3:

1. **The two halves of Screen 3 share the step-ID prefix 3.** The table screen has an internal key, `3t`, so the two can be told apart.
2. **The table on the rule screen is computed, not copied from the learner's answers.** The learner can only leave the table screen with every cell right, so the values are always the same.
3. **"From the last screen" is the table's caption,** shown above it in the muted label style.
4. **Item 2b is numbered "2b."** inside question 2.
   - The correct option is second.
   - A wrong choice shows its response, and the correct option isn't marked: its responses don't refer to it, unlike the old garden item 6.
   - Question 2's result needs both 2 and 2b.
5. **The table polish has a trade-off.**
   - Equal columns on the Screen 2 table leave less room for the labels. At phone widths "Skip count by 3" and "How many more" now take two lines; they took one at 390 px before.
   - At phone widths both "Skip count by …" labels broke after "by", leaving the number alone on the second line. Round 4 fixed this with a non-breaking space.
6. **Number spacing.** "2b." had no space before its question; the number now carries a small gap.
7. **"Not yet. Try again."** is still in the engine as a last resort, but no step uses it now. Its only use was the 8B·f case that round 3 cut.
8. **Round 4: what counts as a chain.** Only a chain of equalities, with two or more "=", may break after "=". A single equation stays whole, as round 3 required.
9. **Round 4: the margin.** HANDOFF-ROUND-4 asks to "leave some margin". I set it at **16 px**: at 360 and 390 px, every unbreakable piece, and every table at its narrowest, must leave 16 px spare in its container. That roughly covers a font 5–8% wider than the ones here.
10. **Round 5: where the header stacks.** Below 420 px, the same width at which Screen 8's two-rule table stacks. At 420 px the title and "Screen 12 of 12" fit side by side with 35 px spare.
11. **Round 6: the figures above the table are 85% size below 420 px.** At full size, Figures 1–3 need 318 px for one row, and the card has 298 px at 360 px, so the four figures took **three** rows there. The handoff allows two. At 85% they take two rows from 320 px up. Measured in both engines, the tighter row leaves 17 px spare at 360 px and 47 px at 390 px, so the 16 px margin holds; at 320 px it leaves 1 px. From 420 px up they're full size; on desktop they take one row. Only these figures change; every other figure in the lesson is as before.
12. **Round 6: "Any 3" on 3T3** means a 3 in any of the four boxes, even if the other boxes are right. An empty box gets no response; Check moves to it, as in every typed table.
13. **Round 6: computed text.** As the handoff asks, every number in Screen 3's text is computed from the rule: the group of 3, Figure 5, and what each wrong option gives at Figure 5, which the rule parser works out from the option's own text. The word "five" is the figure number in words. The changed text on Screens 2 and 4 (3T2, 3T3, 3R) is written out, like the other responses on those screens. The tests check all of it word for word against the handoff.
14. **Round 6: no caption on Screen 3's table.** The handoff gives "From the last screen" only for Screen 4, so Screen 3's table has no caption. Screen 4's caption is still true, because Screen 3 shows the table too.
15. **Round 6: "lines up in meaning".** Each figure is captioned Figure 1 to Figure 4, matching the table's "Figure n" row. The figures don't sit physically over their columns: on phones they wrap to two rows, and on desktop the row of figures is wider than the table.
16. **Round 7: tapping tiles (4T1, 4T2).** Each step draws its own Figure 1 at double size, so every tile is a 44 px target. The screen's original small Figure 1 stayed at the top in round 7; round 8 removed it. Tap a tile to select it and tap again to deselect; Enter or Space do the same by keyboard. A selected tile has a dark outline. After a second miss, the Answer card has no answer text; it marks the right tiles with a dashed outline instead.
17. **Round 7: Check with nothing tapped shows the hint (Marc's answer).** Every selection already has its own response on 4T1, so without this its hint could never appear. The same applies to 4T2.
18. **Round 7: 5M finishes at 23, with no way past it (Marc's answer).** Groups of 3 added to 2 always land on 23, so the handoff's "That's more than 23. Take a group away." can't happen. That response and any way to take a group away are left out. Groups are added by drag or tap (tap the piece, then the figure), as on Screen 1, and the running total under the figure uses the existing "N tiles" wording.
19. **Round 7: stick figures on Screen 9 are 70% size below 420 px,** the same scale as the 8C1 slider's sticks. At full size Figures 1–4 took three rows at 360 px; at 70% they take two, with 16 px spare.
20. **Round 7: moved steps keep their IDs.** 8C1 and 8C2 sit on Screen 9 and are still 8C1 and 8C2.
21. **Round 7: computed text.** As asked, every number in 10P1's options and responses and in 10P2's responses is computed from the two patterns. 3S2's new confirmation is computed like the rest of Screen 3 ("three" is the group in words). The other new text is written out, like the responses around it.
22. **Round 7: no tap highlight on drop targets.** After 5M's seven taps, the browser's own tap highlight stayed on the finished figure as a blue wash. Drop targets (Screen 1's too) no longer show it; the dashed outline when a piece is picked is the tap feedback.
23. **Round 8: 3B's slider.** "The rule" has its own tile figure and slider above "Type the rule.", so 3B's wrong rules still move it to the figure they test, and its confirmation, "Right. Slide to check any figure.", still works (Marc's answer). Both sliders now come from one shared piece of code.
24. **Round 8: 8A's filled-in box** is a disabled box showing 7, so it looks like the others. It isn't one of the learner's inputs, and the judge puts it back in its place before checking, so 8A's responses are unchanged.
25. **Round 8: where the new lines go.** The lines for 3B, 7R5, 8A and 9B sit above the step's prompt, like the line before 3S2. 10E's sentence frame sits between its question and the text box, so the question still comes first.
26. **Round 8: 3B's Answer card** shows only the new sentence, in place of the answer and its confirmation.

### Still standing from earlier rounds

- **The two colours:** orange for the constant, blue for each coefficient group, nothing else in colour.
- **The checker accepts only straight-line rules.** Anything else counts as a wrong answer and gets the step's hint.
- **Why? timing:** it appears with a screen's last step.
- **Back** shows earlier screens read-only.

---

## 3. Built, then removed

| When | Removed |
|---|---|
| Round 8 | Step 4A (the three-sentence choice) and its responses, and Screen 5's small Figure 1. The follow-up items 3B·f (4 fixed tiles plus groups of 2) and 7B·f (triangles), with their responses and tests, and the code only they used: the follow-up mechanism, the follow-up tile pattern, the triangle drawings. |
| Round 3 | Step 8B (simplify 4 + 3(n − 1)): the distributive-property card, the prompt, the four predicted errors and their substitution tests, the "correct so far" response and the hint. The 8B·f follow-up (5 + 2(n − 1)). The code only they used: the simplified check, the "correct so far" path, the substitution-test helper, the reminder card. |
| Round 2 amendment | Round 1 Screens 11–15 (squares, line fitting, the ball, the shrinking border, the garden exit ticket), with everything round 2 had built for them: the square legibility fix, the 4-by-4 build, the counted Checks on the line screen, the h line and two-row speed table, the new 14A prompt, and the hints and confirmations for those screens. |
| Round 2 | Screen 1 (Q1). |

**Fixes found in testing** (rounds 2 and 3, not asked for):
- **Focus moving mid-typing:** a new step could take focus while the learner was typing in another box.
- **Safari overflow:** WebKit let an expression, or the punctuation after it, hang about 3 px past the line.
- **Nina's rule spacing:** the "first square" label spread her rule apart.
- **The "2b." spacing** above.

---

## 4. Conflicts and things to decide

### Round 8: one conflict, asked and answered

HANDOFF-ROUND-8 moves 3B to the new "The rule" screen "unchanged", but 3B relied on the Figure 0 slider (3A1), which stays on Screen 4: its confirmation says "Right. Slide to check any figure.", and its two wrong rules move that slider to the figure they test. Marc chose to give 3B its own slider on "The rule" (decision 23). Nothing else in the handoff conflicted with earlier files.

### Round 7: two gaps in the handoff, asked and answered

- **4T1's hint could never appear,** because every possible selection already has its own response. Marc chose to show it when Check is pressed with nothing tapped (decision 17).
- **5M didn't say how to take a group away.** Marc first chose a "Take a group away" button. Building it showed that a learner can never get past 23: groups of 3 from 2 always land on it, and the step finishes there. So the "more than 23" response and the button would never be used. Marc chose to leave both out (decision 18).

Nothing else in `HANDOFF-ROUND-7.md` conflicted with earlier files or was impossible to build. The stick figures' fit at 360 px is solved by layout (decision 19). The audit's findings are in section 6.

Round 6: nothing in `HANDOFF-ROUND-6.md` conflicted with earlier files or was impossible to build. The one fit problem, the figures taking three rows at 360 px, is solved by layout (decision 11).

### Round 5: the header (resolved)

HANDOFF-ROUND-5 asks that the header still fit on one line at 360 and 390 px with the 16 px margin, and if not, to stop and report rather than shorten the title. With the title and the progress text side by side, it didn't fit, so I stopped. Measured in Chromium and WebKit, which agree:

| Width | Room | Title alone | Progress | Both on one line | Spare |
|---|---|---|---|---|---|
| 360 px | 328 px | 241 px | 100 px | 353 px | **−25 px**: the title wrapped to two lines |
| 390 px | 358 px | 241 px | 100 px | 353 px | **5 px**: one line, but short of the 16 px margin |

I offered four options, none of which shortened the title: (1) put the progress text on its own line on narrow phones; (2) smaller header text; (3) shorten the progress text to "12 / 12"; (4) let the title wrap. **Marc chose option 1.**

As built, the title is never shortened and always takes one line:

| Width | Layout | Title spare |
|---|---|---|
| 360 px | progress on its own line | 87 px |
| 390 px | progress on its own line | 117 px |
| 419 px | progress on its own line | 146 px |
| 420 px | side by side | 35 px |
| 1280 px | side by side | 375 px |

Nothing is open.

---

## 5. Test results

`node tests/lesson.test.js` runs in Chromium, and `--webkit` runs it in WebKit (see `README.md`).

| Section | Chromium | WebKit | What it covers |
|---|---|---|---|
| Source-of-truth text | 14 | 14 | Strings used by the tests exist in the source of truth |
| Title | 4 | 4 | The browser tab and the header read "Growing Patterns: Finding the Rule"; "Seeing the Rule" appears nowhere in `lesson/index.html` |
| Answer checker | 6 | 6 | Equivalence; rejection of n × n, powers and n in a denominator; unparseable input; numbers with units |
| Computed numbers | 6 | 6 | 16 screens; tiles, skip counts, practice and exit patterns, sticks (Figure 10 = 31, Figure 40 = 121) and their skip count, builds |
| Data block text | 3 | 3 | Every response, hint, Why?, title and option is word for word in the source of truth (a non-breaking space counts as a space); every prompt is approved; the parts are numbered 1 to 5, with their spec names and Part 4's name from HANDOFF-ROUND-7 |
| Correct path | 4 × 396 + 2 × 391 | 3 × 396 + 391 | All 16 screens. Chromium: 390 px tap, 390 px touch drag, 360 px tap, desktop mouse, and both dark modes. WebKit: 390 px, 360 px, desktop and phone dark. Each screen: progress, Next gating, responses, Why?, no overflow, 44 px targets, no "null" or "undefined", the no-wrap rule, the header (title and progress each on one line with 16 px spare), and on phones the 16 px margin, with the Why? open. Screens 2, 3, 4 and 6: Figures 1–4 above the table in both colours; Screen 10: the stick figures uncoloured. On phones, at most two rows of figures with 16 px spare on those five screens (so desktop runs have 5 checks fewer). Round 7's correct answers: 3T0 with nothing filled in; the new lines on 2B, 3S2 and 3A2; 4T1 and 4T2 with 44 px tiles; 5M's running total 2, 5, … 23 by tap, mouse and touch drag, not done before 23; 7R1–7R5 with 8C1 and 8C2 on Screen 9 and only 8A on Screen 10; 10P1 and 10P2 with their patterns, tables and options; Part 4 "Practise" and the exit ticket in Part 5. Round 8: the reorder (Screens 4, 5 and 6 with their titles, Screen 4's new Why?, "Your table"); no small Figure 1 and no 4A on Screen 5; the new lines on 3B, 7R5, 8A and 9B and 10E's frame; 3S2's "3 × n"; 3B's slider; 8A's filled-in box, disabled and not one of the five answers; no 3B·f or 7B·f |
| Predicted wrong answers | 2 × 417 | 2 × 417 | Every predicted error and one unpredicted answer per hint on every screen, at 390 px and at 360 px, with every response and the Why? open. Includes 6A2: "Yes" twice, the Answer card naming Maybe and No, then "No" accepted with its text. Round 6: 3T3 with an empty box, a 3 in one box, and the new hint; 3S1's 17, 8 and hint; all three wrong 3S2 options; 3R's 3 and hint; 3B's new hint. Round 7: every predicted error and hint on 3T0, 4T1 (including Check with nothing tapped), 4T2, 7R1–7R5, 8C2, 10P1 and 10P2; 5M by mouse; and each step's Answer card. Round 8: 3B's wrong rules move its slider to Figures 1 and 2, and its new Answer card |
| Screen 7, two extra runs | 164 + 143 | 164 + 143 | Marc's move with a 7, and every hint; a second miss on 7B with no follow-up item |
| Exit ticket, four runs | 4 × 228 | 4 × 228 | Every other exit response, item 2b, the self-check ticks, and the 16 px margin with the responses showing |
| Navigation, keyboard | 46 | 46 | Back and Next across the table screens; placing a piece and checking an answer by keyboard |
| **Total** | **4,498 passed, 0 failed** | **3,711 passed, 0 failed** | |

**The margin check** measures every unbreakable expression against the column of text it sits in, every nowrap formula, rule card and caption against its container, and every table at its narrowest possible layout. Each must leave 16 px spare, and the page must never scroll sideways. It would have caught the original problem: at 360 px the old 287 px chain left only 9 px.

The Screen 7 and exit-ticket runs play the earlier screens first, so their counts include the checks on the screens before them.

**The figures check** (round 6) runs on Screens 2, 3, 4 and 6 of every correct path, and its row check on Screen 10's sticks too (round 7). Each figure must have 2 tiles in the `--constant` colour and n groups of 3 in the `--coefficient` colour, and the figures must sit above the table. At 360 and 390 px they must take at most two rows, each leaving 16 px spare. I ran it without the 85% scaling, and it fails there: at 390 px the two rows leave only 10 px.

**The header check** (round 5) runs on every screen of every correct path, at 360, 390 and 1280 px. The title and "Screen k of 16" must each take one line and leave 16 px spare; where they share a row, both together must leave 16 px. I ran it on the header as it was before option 1, and it fails there: at 360 px the title and the progress text each took two lines, and at 390 px the shared row left 5 px.

**Screenshots** are in `test-results/screenshots/`:
- all 16 screens at 390 × 844 and 1280 × 800, before and after the correct path, with each screen's Why? open in the "done" shots (including Screen 11's);
- each screen after its wrong answers;
- WebKit captures in `webkit/`.

**WebKit setup:** WebKit is installed with Playwright's own installer in a separate folder, with its system libraries from apt. Touch drags run in Chromium only.

**Not tested:**
- Safari on a real iPhone or Mac.
- Firefox.
- Screen readers.
- Widths below 360 px. The page doesn't scroll sideways at 320 px, but the margin isn't guaranteed there.

---

## 6. Questions for Marc: the gradual-release audit

`audit/gradual-release-audit.md` reruns the audit on all 16 screens, the same way as round 7: correct first time, never opening Why?.

- **Every step passes except 7B,** which Marc kept as built in round 8. The same check still flags it: Figure 10's sticks are asked before Figure 1 is shown as 1 + 3.
- **Every round 7 finding is answered:** 3S2, 3B, 7R5, 3B·f, 7B·f, 8A, 10E, and both thin passes (9B, "multiplies n").
- **One note, not a failure:** the principle lists choosing the right rule as practice before writing one. Round 8 moved identifying the parts (4T1, 4T2) before 3B, but choosing a rule (10P1) still comes after both supported rules (3B, 7R5). Each of those has its own scaffolding. In case the order was meant to be different.

Before reviewers see the lesson, it still needs a check on a real iPhone and a narrow Android phone.
