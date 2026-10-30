# Seeing the Rule: report (round 2, with the amendment)

The lesson is `lesson/index.html`. It is one self-contained file: one `LESSON` data block, one engine, and a `MODEL` section that computes every number shown. It makes no network calls, uses no libraries or web fonts, and stores nothing about the learner.

Round 2 applied Marc's decisions and wording and fixed the review's defects. The amendment then narrowed the lesson to one idea, from a growing figure to its rule, in **11 screens**. The Playwright suite passes in both engines:

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 2,201 | 0 |
| WebKit 26.6 (Safari's engine) | 1,761 | 0 |

The source of truth, in order of precedence:
1. `ROUND-2-AMENDMENT.md`, with Marc's two answers about it recorded word for word in `docs/Round-2-Amendment-Answers.md`;
2. `docs/Round-2-Decisions.md` and `docs/Round-2-Wording.md`;
3. the original spec.

**Step IDs** keep their round 1 numbers, so they match the data block and the round 2 files. Learner screen 1 is round 1 Screen 2, and so on. The exit ticket keeps ID 15 and the self-check ID 16.

---

## 1. What is built, screen by screen

| Screen | ID | Title | What the learner does |
|---|---|---|---|
| 1 | 2 | What stays and what grows? | Figures 1–3 in the two colours. Types the fixed tiles (2) and what each figure adds (3). Drags or taps a group of 3 onto Figure 3 to build Figure 4, then types its total (14). |
| 2 | 3 | Figure 0, and the rule | **New (amendment):** Marc's row comparison, a table at the top built one row at a time. **3T1:** types the first two skip-count values (3, 6), and the rest fill in. **3T2:** the 10th skip-count number (30). **3T3:** how many more each figure has (2), and the rest fill in. Then, as before: slides back to Figure 0, types its tiles, and types the rule. Sliding then checks any figure. After a second miss on 3B, a follow-up item with 4 fixed tiles plus groups of 2. |
| 3 | 4 | Why does Figure 1 have 5 tiles if the constant is 2? | Chooses one of three explanations. |
| 4 | 5 | Which figure has 23 tiles? | Types 7. |
| 5 | 6 | Does one check prove it? | Types 5n at Figure 1, then chooses Yes, Maybe or **No** (new). Types 5n at Figures 0 and 10 next to their pictures; the real counts appear after Check. Types 3n + 2 at Figures 0, 1 and 10. Chooses why 3n + 2 can be trusted. |
| 6 | 7 | Shared edges | Drags sticks onto Figure 4's edges; a stick dropped on an existing edge is rejected. Types 13, then Figure 10's total. Answering 40 starts Marc's move in six steps. Answering **7 on its first step** (new) gets its own response and goes straight to the shared edge. After a second miss on 7B, a follow-up item with a row of triangles. |
| 7 | 8 | Are these two rules the same? | Types both rules at n = 1, 2, 3. Simplifies 4 + 3(n − 1), and every wrong rule is tested by substitution. After a second miss on 8B, a follow-up: simplify 5 + 2(n − 1). Slides to Figure 0 and types 1. The Why? draws Figure 3 grouped both ways, with Nina's first square **neutral and labelled** (new). |
| 8 | 9 | Forward and backward | Types Figure 40's sticks (121), then the figure that uses 100 sticks (33). |
| 9 | 10 | Three students, three rules | Builds each student's rule for Figure 1 from sticks and groups of 3. Nina's 4 is **neutral, labelled "first square"** (new), on her rule card and in her build. Marks each rule correct or incorrect. Writes an explanation and compares it with the model. |
| 10 | 15 | Exit ticket | **New (amendment).** Figures 1–3 of a new pattern: 5 fixed tiles plus groups of 4. Four typed items: complete the table, write the rule, find the tiles in Figure 25, find the figure with 65 tiles. One submission; afterwards each wrong item shows its response. |
| 11 | 16 | What you showed on your own | **New (amendment).** Four lines, one per exit item, ticked only if that item was fully right on the single submission. |

Parts are renumbered 1 to 4 (Marc's answer 1), with each name as written:
- Part 1: Tiles. See the structure
- Part 2: Sticks. Two ways to see one rule
- Part 3: Evaluate and repair
- Part 4: Exit ticket

Progress reads "Screen k of 11".

### Round 2 changes on the remaining screens

- **Defects fixed:**
  - No "null" text. Every insertion goes through one helper that skips null and undefined.
  - No rule or expression breaks across lines. Each one is kept as a single unit, together with any punctuation right after it.
  - The checker accepts only straight-line rules. n × n, n in a denominator and powers of n are rejected before values are compared, even when such a rule matches at all six test points.
- **Text:**
  - Screen 1 is cut.
  - Every hint (Wording B) and confirmation (Wording C) for round 1 Screens 2–10 is inserted.
  - The three follow-up items (Wording D) are in.
- **Behaviour:** Why? and the second-miss Answer card stay as built (Q5, Q6).

---

## 2. Decisions the source of truth left open (as built)

### From round 1, still standing

- **The two colours.** Orange is the constant and blue the coefficient, defined once as `--constant` and `--coefficient`. They stay distinct for colour-blind learners and readable in light and dark mode. The rest of the interface uses no hue.
- **Progress bar and Back.** Back shows earlier screens read-only, with Why? still openable.
- **My small figure additions on the remaining screens.**
- **Interface wording:** "Not yet. Try again.", "Type a number.", "Answer", "Compare", "Mine says the same thing.". Decisions Q15–Q18 accepted all of these. The amendment's "still stands" list doesn't name them, but they only touch the remaining screens, so I treated them as standing.

### New in round 2

1. **Non-straight-line rules count as a wrong answer.** They get the step's hint and count as a miss. They aren't treated as unreadable, because they do parse.
2. **When a follow-up item appears (Q3).**
   - It appears only after the Answer card, once the learner has typed the shown answer, and it must be answered before going on.
   - A second miss inside a follow-up shows its own Answer card, and nothing follows that.
   - On 7B, a learner who reaches the answer through Marc's 40 move never sees the Answer card, so gets no follow-up.
3. **Follow-up test lines.**
   - The 3B follow-up tests 6 + 2n at n = 1: "n = 1: 8, but Figure 1 has 6", from the Wording D sentence.
   - The 8B follow-up tests every wrong answer at the first n where it breaks: "Test at n = 2: 12, but the original gives 7." The wording gives no test sentences for it, so this uses 8B's own sentence pattern.
4. **A 7 on Screen 7's first move step (Q8).** It shows the response, then Figure 2 with its shared edge flashing, and skips the counting step. It counts as a predicted error.
5. **Nina's 4 (Q2).**
   - It's ink, the neutral stick colour, with "first square" hung underneath, so her rule keeps its normal spacing.
   - Arun's 4 stays orange, because under his rule the value at Figure 0 is 4 (see 4.1).
6. **Screen 3's table.**
   - It sits at the top of the screen, and each step adds its row.
   - A row's remaining cells fill in, computed, when its typed cells are right.
   - The second miss on 3T1 shows "3, 6".
7. **Exit ticket.**
   - Item 1 shows "Each figure adds 4 tiles." and "Count by 4: 4, 8, 12, …" separately, so either or both can appear. It's ticked only if all five blanks are right.
   - Predicted errors are matched by value, so 4n + 9 gets the 9 + 4n response.
   - A non-straight-line rule gets the "anything else" response.
   - An unreadable answer is flagged in place and nothing is submitted. An empty box gets focus.
8. **Marc's two answers about the amendment** came by paste. I recorded them word for word in `docs/Round-2-Amendment-Answers.md`, so the decision can be traced and the tests can check the labels.

### Fixes found while testing round 2

None of these was asked for; each was a real defect the tests turned up.

- **Focus moving mid-typing.** When a step appeared, the lesson moved focus to its first box 40 ms later. If the learner had already started typing elsewhere, keystrokes went into the wrong box. It showed up as a 1-in-7 test failure; it could happen on a slow phone. Focus now moves only if the learner isn't already in a field. The test then passed 12 times out of 12.
- **Safari overflow.** WebKit let an expression, or the punctuation after it, hang about 3 px past the edge of the text. Expressions are now inline-blocks with their trailing punctuation inside.
- **Nina's rule spacing.** The "first square" label had spread her rule apart. It now hangs under the 4.

---

## 3. Built in round 2, then removed by the amendment

| Round 1 screen | Removed |
|---|---|
| 11 Square figures | Larger squares with an ink outline round each L-shaped border (the legibility fix); the 4-by-4 fill build after "12" (Q9); hints 11A, 11B2, 11C; confirmations 11A, 11C |
| 12 Can a line fit? | Check counting only after a slider moves; "Your line passes through k of the 4 points." and "Move a slider first." (Q10); "T = n" rule display |
| 13 A square that grows smoothly | The new intro (Q14); hint 13A |
| 14 Shrink the border | "h is the extra time after 3 seconds." and the two-row table (Q4); the new 14A prompt; hints 14A, 14B2 |
| 15 The garden | The title "The garden" and new intro (Q13, Q14); all seven garden items |
| 16 Self-check | The seven-line self-check from the garden ticket (Q12), replaced by the amendment's four lines |
| Code | The square, graph, ramp and shrinking-border figures; their steps and styles; the rule-display function (no remaining screen builds a rule from numbers); "I can't do it" |

---

## 4. Conflicts and things to decide

1. **Arun's 4 is orange.** Q2 says orange only ever means the value at Figure 0. Under Arun's rule, S = 4 + 3n, the value at Figure 0 is 4, so it's his constant and stays orange. His build therefore shows a whole orange square. Is that right, or should his 4 also be neutral?
2. **The 8B follow-up has no "not combined" line.** "5 + 2n − 2" is equivalent but not simplified, and has no response in the source of truth. It shows "Not yet. Try again." and doesn't count as a miss. This is the only place that fallback still appears.
3. **The follow-up items have no test sentences.** I used 8B's pattern (2.3).
4. **Screen 3 is now the longest screen.** It has six steps, plus the follow-up after a second miss on 3B. It fits at phone width, but it's long.
5. **What the exit ticket doesn't check.** It checks the table, the rule, forward and backward. Screens 5, 6 (with its move), 7 and 9 teach testing, shared edges, equivalence and repair, and nothing assesses them now. The amendment chose this; I note it only so it's a known trade-off.

---

## 5. Test results

`node tests/lesson.test.js` runs in Chromium, and `--webkit` runs it in WebKit (instructions in `README.md`).

| Section | Chromium | WebKit | What it covers |
|---|---|---|---|
| Source-of-truth text | 9 | 9 | Strings used by the tests exist in the spec, the round 2 files or the amendment |
| Answer checker | 7 | 7 | Equivalence; rejection of n × n, powers and n in a denominator, including a rule that matches at all six test points; unparseable input; numbers with units |
| Computed numbers | 6 | 6 | Tiles, skip counts, follow-up and exit patterns (9, 13, 17, 21, 25; Figure 25 = 105; 65 at Figure 15), sticks (Figure 10 = 31, Figure 40 = 121), triangles (3, 5, 7, 21), builds |
| Data block text | 3 | 3 | Every response, hint, Why?, title and option is word for word in the source of truth; every prompt is approved; parts are numbered 1–4 with their spec names |
| Correct path | 5 × 220 | 3 × 220 | All 11 screens. Chromium: phone tap, phone touch drag, desktop mouse, and both dark modes. WebKit: phone tap, desktop mouse, phone dark. Each screen: progress, Next gating, responses, Why?, no overflow, 44 px targets, no "null" or "undefined", no wrapped expression |
| Predicted wrong answers | 329 | 329 | Every predicted error and one unpredicted answer per hint on every screen, the follow-ups on 3B and 8B, and the all-wrong exit ticket with 0 ticks |
| Screen 7: 40, then 7 | 107 | 107 | Q8 and every hint in the move |
| Screen 7: follow-up | 99 | 99 | Triangles, every response |
| Exit ticket, four runs | 4 × 124 | 4 × 124 | Every other exit response (one submission per run), and the ticks it earns (item 1 needs all five blanks) |
| Navigation, keyboard | 45 | 45 | Back and Next; placing a piece and checking an answer by keyboard |
| **Total** | **2,201 passed, 0 failed** | **1,761 passed, 0 failed** | |

**Setting up WebKit.** WebKit was installed with Playwright's own installer (the same version as the pre-installed Chromium) into a separate folder, and its system libraries came from apt. Touch drags use a Chrome-only protocol, so in WebKit pieces are placed by tap and by mouse drag. WebKit's `innerText` drops the space before an expression that starts a new line, so the tests read `textContent`. On screen, the text is correct.

**Screenshots** are in `test-results/screenshots/`:
- `phone-NN-start/done.png` and `desktop-NN-start/done.png`: all 11 screens at 390 × 844 and 1280 × 800;
- `phone-wrong-NN.png`: each screen after its wrong answers;
- `webkit/`: the same screens rendered by WebKit.

**Not tested:**
- Safari on a real iPhone or Mac. WebKit on Linux is the same engine but not the same build.
- Firefox.
- Screen readers.

---

## 6. Questions for Marc

1. Should Arun's 4 stay orange (4.1)?
2. Do you want a "correct so far" line for "5 + 2n − 2" in the 8B follow-up (4.2)?
3. Do you want specific test sentences for the follow-up items, or is 8B's pattern fine (4.3)?
4. Is Screen 3's length all right, or should the table steps become their own screen (4.4)?
