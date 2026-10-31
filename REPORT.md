# Seeing the Rule: report (round 3)

The lesson is `lesson/index.html`. It is one self-contained file: one `LESSON` data block, one engine, and a `MODEL` section that computes every number shown. It makes no network calls, uses no libraries or web fonts, and stores nothing about the learner.

It teaches one idea, from a growing figure to its rule, in **12 screens**. Every test passes in both engines:

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 2,261 | 0 |
| WebKit 26.6 (Safari's engine) | 1,785 | 0 |

The source of truth, in order of precedence:
1. `HANDOFF-ROUND-3.md`;
2. `ROUND-2-AMENDMENT.md`, with Marc's two answers in `docs/Round-2-Amendment-Answers.md`;
3. `docs/Round-2-Decisions.md` and `docs/Round-2-Wording.md`;
4. the original spec.

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
| 6 | 6 | Does one check prove it? | Types 5n at Figure 1, then chooses Yes, Maybe or No. Types 5n at Figures 0 and 10 next to their pictures; the real counts appear after Check. Types 3n + 2 at Figures 0, 1 and 10. Chooses why 3n + 2 can be trusted. |
| 7 | 7 | Shared edges | Drags sticks onto Figure 4's edges; a stick on an existing edge is rejected. Types 13, then Figure 10's total. Answering 40 starts Marc's move in six steps; a 7 on its first step goes straight to the shared edge. After a second miss on 7B, a follow-up item with a row of triangles. |
| 8 | 8 | Are these two rules the same? | Types both rules at n = 1, 2 and 3 ("Right. The same values for all three figures."). Slides to Figure 0 and types 1. The Why? is unchanged; it explains the simplification as reading, with Nina's first square drawn neutral. **There is no longer a simplification step.** |
| 9 | 9 | Forward and backward | Types Figure 40's sticks (121), then the figure that uses 100 sticks (33). |
| 10 | 10 | Three students, three rules | Builds each student's rule for Figure 1. Arun's 4 is orange; Nina's 4 is neutral and labelled "first square". Marks each rule correct or incorrect. Writes an explanation and compares it with the model. |
| 11 | 15 | Exit ticket | A new pattern: 5 fixed tiles plus groups of 4. Four numbered questions: (1) complete the table; (2) write the rule, and (2b) choose what the constant counts; (3) the tiles in Figure 25; (4) the figure with 65 tiles. One submission, then each wrong item shows its response. |
| 12 | 16 | What you showed on your own | Four lines, ticked only from the exit ticket's single submission. Line 2, "Wrote the rule and identified what the constant counts", needs both 2 and 2b. |

**Parts:**
- Part 1: Tiles. See the structure (Screens 1–6)
- Part 2: Sticks. Two ways to see one rule (Screens 7–9)
- Part 3: Evaluate and repair (Screen 10)
- Part 4: Exit ticket (Screens 11 and 12)

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

1. **"Skip count by 3" and "Skip count by 4" at phone widths.** The labels wrap after "by", leaving the number alone on the second line. A non-breaking space between "by" and the number would keep "by 3" together. It looks identical, but it is a character change to approved text, so I haven't made it. Should I?
2. **8B·f's test-sentence pattern** ("Test at n = …, but the original gives …") was used only by 8B·f. With 8B·f cut, it applies nowhere else. 3B·f keeps the wording's own test line ("n = 1: 8, but Figure 1 has 6"), and 7B·f has none.

Nothing else is open.

---

## 5. Test results

`node tests/lesson.test.js` runs in Chromium, and `--webkit` runs it in WebKit (see `README.md`).

| Section | Chromium | WebKit | What it covers |
|---|---|---|---|
| Source-of-truth text | 10 | 10 | Strings used by the tests exist in the source of truth |
| Answer checker | 6 | 6 | Equivalence; rejection of n × n, powers and n in a denominator; unparseable input; numbers with units |
| Computed numbers | 6 | 6 | 12 screens; tiles and skip counts; the follow-up and exit patterns (Figure 25 = 105; 65 at Figure 15); sticks (Figure 10 = 31, Figure 40 = 121); triangles; builds |
| Data block text | 3 | 3 | Every response, hint, Why?, title and option is word for word in the source of truth; every prompt is approved; parts 1–4 keep their spec names |
| Correct path | 5 × 238 | 3 × 238 | All 12 screens. Chromium: phone tap, phone touch drag, desktop mouse, and both dark modes. WebKit: phone tap, desktop mouse, phone dark. Each screen: progress ("Screen k of 12"), Next gating, responses, Why?, no overflow, 44 px targets, no "null" or "undefined", and the widened no-wrap rule |
| Predicted wrong answers | 271 | 271 | Every predicted error and one unpredicted answer per hint on every screen; the 3B follow-up; the all-wrong exit ticket, with 0 ticks |
| Screen 7, two extra runs | 113 + 107 | 113 + 107 | Marc's move with a 7, and every hint; the 7B triangles follow-up |
| Exit ticket, four runs | 4 × 129 | 4 × 129 | Every other exit response, item 2b's two wrong responses, and the self-check ticks. Line 2 is unticked when 2 is right but 2b is wrong, and when 2b is right but 2 is wrong |
| Navigation, keyboard | 39 | 39 | Back and Next across the split; placing a piece and checking an answer by keyboard |
| **Total** | **2,261 passed, 0 failed** | **1,785 passed, 0 failed** | |

**The widened no-wrap check** looks at every text node on screen. Any expression with "=" and n, or a bracketed expression in n, must sit on one line. I confirmed the check can catch a real break: it flags an expression forced to wrap, and passes the same text through the lesson's renderer.

**Table widths** were measured at 360, 375, 390 and 1280 px in both engines. No label takes more than two lines, and neither table needs sideways scrolling.

**Screenshots** are in `test-results/screenshots/`:
- all 12 screens at 390 × 844 and 1280 × 800, before and after the correct path;
- each screen after its wrong answers (`phone-wrong-NN.png`);
- WebKit captures in `webkit/`.

**WebKit setup:** WebKit is installed with Playwright's own installer in a separate folder, with its system libraries from apt. Touch drags use a Chrome-only protocol, so they run in Chromium only.

**Not tested:**
- Safari on a real iPhone or Mac.
- Firefox.
- Screen readers.

---

## 6. Questions for Marc

1. May I add a non-breaking space in "Skip count by 3" and "Skip count by 4", so the number never sits alone on a line (4.1)?
