# Seeing the Rule: report (round 4)

The lesson is `lesson/index.html`. It is one self-contained file: one `LESSON` data block, one engine, and a `MODEL` section that computes every number shown. It makes no network calls, uses no libraries or web fonts, and stores nothing about the learner.

It teaches one idea, from a growing figure to its rule, in **12 screens**. Every test passes in both engines:

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 2,874 | 0 |
| WebKit 26.6 (Safari's engine) | 2,374 | 0 |

The source of truth, in order of precedence:
1. `HANDOFF-ROUND-4.md`;
2. `HANDOFF-ROUND-3.md`;
3. `ROUND-2-AMENDMENT.md`, with Marc's two answers in `docs/Round-2-Amendment-Answers.md`;
4. `docs/Round-2-Decisions.md` and `docs/Round-2-Wording.md`;
5. the original spec.

**Step IDs** keep their round 1 numbers. Both halves of round 1 Screen 3 keep the "3" prefix: 3T1–3T3 on the table screen, and 3A1–3B on the rule screen. The exit ticket is ID 15 and the self-check ID 16.

---

## 1. What is built, screen by screen

| Screen | ID | Title | What the learner does |
|---|---|---|---|
| 1 | 2 | What stays and what grows? | Figures 1–3 in the two colours. Types the fixed tiles (2) and what each figure adds (3). Drags or taps a group of 3 onto Figure 3 to make Figure 4, then types its total (14). |
| 2 | 3 (3T1–3T3) | The skip-count table | Marc's row comparison, built one row at a time. Fills in the skip count by 3 (types 3 and 6; 9 and 12 fill in). Types the 10th skip-count number (30). Types how many more each figure has (2; the rest fill in). Why?: "Each figure adds 3 tiles, so the tiles grow like the skip count by 3…" |
| 3 | 3 (3A1–3B) | Figure 0, and the rule | Opens with the completed table, read-only, captioned "From the last screen". Slides back to Figure 0, types its tiles ("The same 2 as in the table"), and types the rule; sliding then checks any figure. After a second miss on 3B, a follow-up item: 4 fixed tiles plus groups of 2. |
| 4 | 4 | Why does Figure 1 have 5 tiles if the constant is 2? | Chooses one of three explanations. |
| 5 | 5 | Which figure has 23 tiles? | Types 7. |
| 6 | 6 | Does one check prove it? | Types 5n at Figure 1, then chooses Yes, Maybe or No; **Maybe and No are both right**, each with its own confirmation. Types 5n at Figures 0 and 10 next to their pictures; the real counts appear after Check. Types 3n + 2 at Figures 0, 1 and 10. Chooses why 3n + 2 can be trusted. |
| 7 | 7 | Shared edges | Drags sticks onto Figure 4's edges; a stick on an existing edge is rejected. Types 13, then Figure 10's total. Answering 40 starts Marc's move in six steps; a 7 on its first step goes straight to the shared edge. After a second miss on 7B, a follow-up item with a row of triangles. |
| 8 | 8 | Are these two rules the same? | Types both rules at n = 1, 2 and 3 ("Right. The same values for all three figures."); on narrow phones each rule sits above its row of boxes. Slides to Figure 0 and types 1. The Why? is unchanged; it explains the simplification as reading, with Nina's first square drawn neutral. **There is no longer a simplification step.** |
| 9 | 9 | Forward and backward | Types Figure 40's sticks (121), then the figure that uses 100 sticks (33). |
| 10 | 10 | Three students, three rules | Builds each student's rule for Figure 1. Arun's 4 is orange; Nina's 4 is neutral and labelled "first square". Marks each rule correct or incorrect. Writes an explanation and compares it with the model. |
| 11 | 15 | Exit ticket | A new pattern: 5 fixed tiles plus groups of 4. Four numbered questions: (1) complete the table; (2) write the rule, and (2b) choose what the constant counts; (3) the tiles in Figure 25; (4) the figure with 65 tiles. One submission, then each wrong item shows its response. |
| 12 | 16 | What you showed on your own | Four lines, ticked only from the exit ticket's single submission. Line 2, "Wrote the rule and identified what the constant counts", needs both 2 and 2b. |

**Parts:**
- Part 1: Tiles. See the structure (Screens 1–6)
- Part 2: Sticks. Two ways to see one rule (Screens 7–9)
- Part 3: Evaluate and repair (Screen 10)
- Part 4: Exit ticket (Screens 11 and 12)

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
   - At phone widths both "Skip count by …" labels break after "by", leaving the number alone on the second line (see 4.1).
6. **Number spacing.** "2b." had no space before its question; the number now carries a small gap.
7. **"Not yet. Try again."** is still in the engine as a last resort, but no step uses it now. Its only use was the 8B·f case that round 3 cut.
8. **Round 4: what counts as a chain.** Only a chain of equalities, with two or more "=", may break after "=". A single equation stays whole, as round 3 required.
9. **Round 4: the margin.** HANDOFF-ROUND-4 asks to "leave some margin". I set it at **16 px**: at 360 and 390 px, every unbreakable piece, and every table at its narrowest, must leave 16 px spare in its container. That roughly covers a font 5–8% wider than the ones here.

### Still standing from earlier rounds

- **The two colours:** orange for the constant, blue for each coefficient group, nothing else in colour.
- **The follow-up items:** they appear only after the Answer card, and must be answered.
- **The checker accepts only straight-line rules.** Anything else counts as a wrong answer and gets the step's hint.
- **Why? timing:** it appears with a screen's last step.
- **Back** shows earlier screens read-only.

---

## 3. Built, then removed

| When | Removed |
|---|---|
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

### Round 5 stopped: the new title doesn't fit the header on one line

HANDOFF-ROUND-5 renames the lesson "Growing Patterns: Finding the Rule". It asks that the header still fit on one line at 360 and 390 px with the 16 px margin, and if not, to stop and report rather than shorten the title.

The header holds the title and the progress text ("Screen 12 of 12" at its longest) side by side. Measured in Chromium and WebKit, which agree:

| Width | Room | Title alone | Progress | Both on one line | Spare |
|---|---|---|---|---|---|
| 360 px | 328 px | 241 px | 100 px | 353 px | **−25 px**: the title wraps to two lines |
| 390 px | 358 px | 241 px | 100 px | 353 px | **5 px**: one line, but short of the 16 px margin |

The title change itself is made: the browser tab and the header both read the new title, and "Seeing the Rule" no longer appears in the file. Nothing else has changed. There is no new test run or handback yet, because the file isn't ready to deploy.

Options, none of which shortens the title:
1. **Recommended, layout only:** on phones narrower than 420 px, put "Screen k of 12" on its own line under the title. The title alone then has 87 px spare at 360 px and 117 px at 390 px. The header gets about 20 px taller on phones; desktop is unchanged.
2. **Smaller header text on phones** (14 px → 12 px). This fits with about 25 px spare at 360 px, but 12 px is small to read.
3. **Shorten the progress text** to "12 / 12". That's a change to approved interface text.
4. **Let the title wrap to two lines** on narrow phones, as it does now at 360 px. That goes against the handoff's "one line".

Earlier rounds left nothing else open.

---

## 5. Test results

`node tests/lesson.test.js` runs in Chromium, and `--webkit` runs it in WebKit (see `README.md`).

| Section | Chromium | WebKit | What it covers |
|---|---|---|---|
| Source-of-truth text | 10 | 10 | Strings used by the tests exist in the source of truth |
| Answer checker | 6 | 6 | Equivalence; rejection of n × n, powers and n in a denominator; unparseable input; numbers with units |
| Computed numbers | 6 | 6 | 12 screens; tiles, skip counts, follow-up and exit patterns, sticks (Figure 10 = 31, Figure 40 = 121), triangles, builds |
| Data block text | 3 | 3 | Every response, hint, Why?, title and option is word for word in the source of truth (a non-breaking space counts as a space); every prompt is approved; parts 1–4 keep their spec names |
| Correct path | 6 × 250 | 4 × 250 | All 12 screens. Chromium: 390 px tap, 390 px touch drag, 360 px tap, desktop mouse, and both dark modes. WebKit: 390 px, 360 px, desktop and phone dark. Each screen: progress, Next gating, responses, Why?, no overflow, 44 px targets, no "null" or "undefined", the no-wrap rule, and on phones the 16 px margin, with the Why? open |
| Predicted wrong answers | 2 × 285 | 2 × 285 | Every predicted error and one unpredicted answer per hint on every screen, at 390 px and at 360 px, with every response and the Why? open. Includes 6A2: "Yes" twice, the Answer card naming Maybe and No, then "No" accepted with its text |
| Screen 7, two extra runs | 113 + 107 | 113 + 107 | Marc's move with a 7, and every hint; the 7B triangles follow-up |
| Exit ticket, four runs | 4 × 130 | 4 × 130 | Every other exit response, item 2b, the self-check ticks, and the 16 px margin with the responses showing |
| Navigation, keyboard | 39 | 39 | Back and Next across the split; placing a piece and checking an answer by keyboard |
| **Total** | **2,874 passed, 0 failed** | **2,374 passed, 0 failed** | |

**The margin check** measures every unbreakable expression against the column of text it sits in, every nowrap formula, rule card and caption against its container, and every table at its narrowest possible layout. Each must leave 16 px spare, and the page must never scroll sideways. It would have caught the original problem: at 360 px the old 287 px chain left only 9 px.

**Screenshots** are in `test-results/screenshots/`:
- all 12 screens at 390 × 844 and 1280 × 800, before and after the correct path, with each screen's Why? open in the "done" shots (including Screen 8's);
- each screen after its wrong answers;
- WebKit captures in `webkit/`.

**WebKit setup:** WebKit is installed with Playwright's own installer in a separate folder, with its system libraries from apt. Touch drags run in Chromium only.

**Not tested:**
- Safari on a real iPhone or Mac.
- Firefox.
- Screen readers.
- Widths below 360 px. The page doesn't scroll sideways at 320 px, but the margin isn't guaranteed there.

---

## 6. Questions for Marc

None. Before reviewers see the lesson, the one remaining step is a check on a real iPhone and a narrow Android phone.
