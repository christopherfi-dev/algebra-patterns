# Seeing the Rule: round 1 report

The lesson is `lesson/index.html`: one self-contained file (about 107 KB) with every screen in one `LESSON` data block and one engine that reads it. It makes no network calls, uses no libraries or web fonts, and stores nothing about the learner. All 16 screens are built. The Playwright suite runs 1,772 checks and none fail (section 5).

Two things need Marc's decision before this goes to reviewers:

- **Text the spec doesn't supply.** 35 question prompts and a few interface strings had to be written (section 2.2). The spec describes the learner's actions but doesn't give the words on screen.
- **Hints and confirmations the spec doesn't write.** 25 steps have no "unpredicted" hint, so they show a neutral placeholder (section 4.2). 9 steps have no correct-answer confirmation, so they show a tick (section 4.8).

Everything else follows the spec as written, or is a default listed below for Marc to change.

---

## 1. What was built, screen by screen

Each screen shows its part name and title, then its steps one at a time: a step appears only when the one before it is done. **Check** gives one of the four outcomes from the spec. **Why?** opens the screen's Why? text inline.

| # | Screen | What the learner does |
|---|---|---|
| 1 | Retrieval: is 103 in the pattern? | Sees "7, 11, 15, 19, …" (computed from 4n + 3). Types the rule; on a second miss, Marc's row-comparison table builds row by row (n, Pattern, "Normal" row (4n), How far off). Types which term is 103. |
| 2 | What stays and what grows? | Figures 1–3 in the two colours. Types the fixed tiles (2) and what each figure adds (3). Drags (or taps) one group of 3 onto Figure 3 to make Figure 4, then types its total (14). |
| 3 | Figure 0, and the rule | Slides the figure number from 4 back to 0, types Figure 0's tiles (2), then types the rule. For 5 + 3n and 5n, the screen moves the picture to n = 1 or n = 2 and shows the test ("n = 1: 8, not 5"). After the correct rule, sliding shows "T = 3 × n + 2 = …" for any figure. Why? includes the computed row table. |
| 4 | Why does Figure 1 have 5 tiles if the constant is 2? | Chooses one of the three explanations. |
| 5 | Which figure has 23 tiles? | Types the figure number (7). Why? also draws Figure 7. |
| 6 | Does one check prove it? | Types 5n at Figure 1, then chooses Yes or Maybe. Types 5n at Figures 0 and 10, next to pictures of both; the real counts (2 and 32) appear beside them after Check. Types 3n + 2 at Figures 0, 1 and 10. Chooses why 3n + 2 can be trusted. |
| 7 | Shared edges | Figures 1–3 in sticks. Drags sticks onto Figure 4's edges; a stick dropped on an existing edge gets "That edge is already there." Types 13, then Figure 10's total. Answering 40 starts Marc's move as six sub-steps: predict Figure 2 (8); count (sticks light up one by one to 7, "Why?", the shared edge flashes); predict Figure 3 (11 → count to 10, "So it didn't add 4 new ones. Why not?", shared edges flash; 10 → "Right."); type 3 and 3; see Figures 1–3 as 1 + 3s and type 10; type 31. |
| 8 | Are these two rules the same? | Types both rules at n = 1, 2, 3 in a 2 × 3 table. The distributive-property card appears, and the learner types 4 + 3(n − 1) simplified. Every wrong rule gets a substitution test against the original. Slides to Figure 0 (3n + 1 in the two colours) and types 1. Why? draws Figure 3 grouped both ways. |
| 9 | Forward and backward | Types Figure 40's sticks (121), then the figure that uses 100 sticks (33). |
| 10 | Three students, three rules | Three rule cards in colour. Builds each rule for Figure 1 from constant-colour sticks and coefficient-colour groups of 3: Mina makes one square ("That's Figure 1."); Arun makes two, then the learner types 2 and Figure 2; Nina gets 3 × (1 − 1) = 0 groups ("That's Figure 1."). Marks each rule correct or incorrect. Writes an explanation, presses Compare, sees the model beside it, and can tick "Mine says the same thing." |
| 11 | Square figures | Figures 1–3 as squares. Types Figure 4's tiles (16); answering 12 brings up a dashed 4 × 4 outline. Drags the L-shaped border three times to grow the square from 1 × 1 to 4 × 4; the borders appear as 3, 5, 7. Types the next border (9). Answers "Is there a common difference?" |
| 12 | Can a line fit? | The points 1, 4, 9, 16, a line T = an + b and two dials (sliders) for a and b. Check rings the points the line passes through. After three Checks, or "I can't do it", the border row reappears (3, 5, 7) with the rises +3, +5, +7 drawn on the graph. |
| 13 | A square that grows smoothly | A ball rolls down a ramp in real time with d = t² (tick marks at 0–4 s), above the computed t/d table. Types the average speed from 3 to 4 s; on 7, the 7-tile border of a 4 × 4 square lights up beside it. |
| 14 | Shrink the border | A 3 × 3 square with two 3 × h strips and an h × h corner, plus the table (7, ?, then blanks). Types the speed for h = 0.5 (6.5). Slides h toward 0: the corner all but vanishes, and 6.1 and 6.01 fill in at h = 0.1 and 0.01. Types the speed at exactly 3 s (6). |
| 15 | The garden (independent evidence) | Seven items. Items 1–5 are typed, 6–7 are chosen. Submit once: no hints and no Why?. Afterwards each item is ticked or shows its response. |
| 16 | Self-check | The eight items from the spec, each ticked or unticked by what the learner actually did. |

**Structure.** `LESSON` holds every screen's prompt, figure, input type, correct answer or answer rule, predicted wrong answers and their responses, general hint, second-miss demonstration and Why? text. A `MODEL` section above it computes every count, border, speed and table value; no number on screen is typed in by hand. The engine (answer checking, figures, drag and tap, steps, navigation) reads both. It follows Hollow House's one-data-block, one-engine structure, but not its look, theme or lockout.

---

## 2. Defaults chosen, and other decisions the spec didn't make

### 2.1 The five defaults from the handoff

1. **Second miss on screens without their own demonstration.** An "Answer" card shows the correct answer together with that step's own confirmation text, and the learner still types or chooses the answer to continue. On a screen's **last** step the Why? text also opens. On earlier steps it doesn't, because each screen has one Why? covering every step: Screen 2's Why? gives Step C's 14, and Screen 1's gives Step B's 25 (see 4.3). Once the learner answers correctly, the card is removed, because the confirmation then says the same thing.
2. **The two colours.**
   - Constant: orange, `#b45309` in light mode and `#f59e4b` in dark mode.
   - Coefficient: blue, `#1d6fb8` in light mode and `#6cb6f5` in dark mode.

   Both are defined once, as `--constant` and `--coefficient`, and used only for the constant and the coefficient groups. That covers tiles, sticks, coloured rule text and the swatch in Screen 2's prompt. Against the page, contrast is 4.6–5.2 : 1 in light mode and 7.7–8.7 : 1 in dark mode, so they also work as text colours. Their colour difference stays large (ΔE ≥ 88) under protanopia, deuteranopia and tritanopia simulation. To keep that meaning, the rest of the interface uses no hue at all: buttons, feedback, highlights, the line on Screen 12 and the lit border on Screen 13 are all ink or grey. Feedback in particular has no green or red.
3. **Progress.** A thin bar under the header, plus "Screen 3 of 16" at the top right.
4. **Navigation.** Back and Next sit in a bar at the bottom. Next is enabled once the current screen is done. Back shows earlier screens exactly as the learner left them: answers are visible, inputs are disabled, and Why? can still be opened. Next then steps forward again to the current screen.
5. **Self-check.** An item is ticked when its screen was completed with no second-miss demonstration on **any** step of that screen. Mapping: fixed and growing part → Screen 2; constant at figure 0 → 3; first total vs constant → 4; solved for a figure number → 5; tested more than one figure → 6; two rules equivalent → 8; no common difference → 11; speed at an instant → 14.

### 2.2 Text the spec doesn't give, written for the build

The spec describes the learner's action ("Learner types how many tiles each new figure adds") but rarely the words on screen. Each prompt below turns the spec's description into a short question, keeping the spec's words wherever possible. All of them are in the data block, so Marc can rewrite any of them.

| Step | Prompt shown |
|---|---|
| 1A, 1B | Type the explicit rule. · Which term is 103? |
| 2A–2C | How many tiles of the first colour ■ are in every figure? · How many tiles does each new figure add? · Drag one group of 3 to build Figure 4. · How many tiles does Figure 4 have? |
| 3A, 3B | Slide the figure number back to 0. · How many tiles does Figure 0 have? · Type the rule. |
| 6A–6D | What does T = 5n give for Figure 1? · What does T = 5n give for Figure 0 and Figure 10? · What does T = 3n + 2 give for Figures 0, 1 and 10? · Why can we trust 3n + 2 for every figure? |
| 7A, 7B | Drag sticks to build Figure 4. · How many sticks does Figure 4 have? · How many sticks does Figure 10 have? |
| 8A–8C | Type the value of each rule for n = 1, 2 and 3. · Simplify 4 + 3(n − 1). · Slide to Figure 0. · How many sticks are left? |
| 9A, 9B | How many sticks are in Figure 40? · Which figure uses exactly 100 sticks? |
| 10A–10D | Build Mina's / Arun's / Nina's rule for Figure 1. · How many squares did you build? · Which figure is that? · Mark each rule correct or incorrect. |
| 11A, 11B | How many tiles are in Figure 4? · Drag the L-shaped border that turns each square into the next. · How many tiles are in the next border? |
| 13A | What is the ball's average speed from 3 to 4 seconds? |
| 14A, 14B | What is the average speed for h = 0.5? (distance at 3.5 s: 12.25 m) · Slide h toward 0. · What is the speed at exactly 3 seconds? |

These prompts are the spec's own words, used unchanged: Is the rule correct? · every Screen 7 sub-step · In your own words, why is Arun's rule one figure ahead? · Is there a common difference? · Make the line pass through every point. · I can't do it · all exit-ticket items.

Screens 4 and 5 have no prompt: their titles are the question.

**Interface words:**
- Check, Why?, Back, Next, Submit, Screen k of 16.
- Answer (the label on the second-miss card).
- Compare (Screen 10E), Mine says the same thing. (Screen 10E).
- "· 2 tiles" / "· 32 tiles" (the real counts on Screen 6B).
- Small labels and formulas, all computed: field prefixes such as T =, S =, P =, n = and Figure; m/s; the n-column headers on Screen 8; the substituted rules on Screen 10 (S = 3 × 1 + 1 and so on); 3 × h and h × h on Screen 14; "3 × 3 → 4 × 4" under Screen 13's square; "0 s … 4 s" on the ramp; "h = 0.37" under Screen 14's figure.

Three messages also had to be written:
- **"Not yet. Try again."** The response for an unpredicted error on a step with no written hint (see 4.2).
- **"Type a number."** For a number box holding something unreadable. It doesn't count as a miss, the same as the handoff's "Type a rule using n, such as 2n + 5."
- **Tick only.** A tick mark, with no text, for a correct answer that has no written confirmation (see 4.8).

### 2.3 How each figure is drawn

- **Tiles (Screens 2–6).** The 2 fixed tiles are a short column on the left, in the constant colour. Each group of 3 is its own column to the right, in the coefficient colour, on a faint tinted backing so it reads as one unit. The fixed tiles never move, and Figure n grows to the right by one column per figure. All figures on a screen share one scale. The slider figures (Screens 3 and 8) are sized for Figure 10, so the scale doesn't change while sliding.
- **Sticks (Screens 7–10).** Equal sticks with rounded ends, drawn slightly short so each stick reads as a separate piece and shared edges are visibly single. Screen 7's figures are neutral ink.
  - In two colours: Screen 7's step "Figure 1 is 1 + 3" (one constant stick, then groups of 3); Screen 8's slider (3n + 1); Screen 8's Why? (Figure 3 grouped as 4 + 3(n − 1) and as 3n + 1); and Screen 10's builds.
  - Colouring Screen 7's step is my addition (see 3).
- **Squares (Screens 11–13).** n × n tiles. Each L-shaped border is shaded alternately (light, darker, light…) so every border reads as one unit, the same way in the figures, the dragged piece and the border row. On Screen 13 the newest border "lights up" in ink.
- **Ball and shrinking border (Screens 13–14).**
  - The ramp is a wedge; the ball's position along it is proportional to d = t², so it visibly speeds up. It rolls once, in real time, over 4 s; with reduced motion it simply sits at 4 s.
  - The 3 × 3 square uses true proportions: at h = 0.01 the strips are under a pixel wide, so "the corner square shrinks almost to nothing".
  - The h slider is logarithmic from 1 to 0.01 and snaps to 1, 0.5, 0.1 and 0.01, so the table values are hit exactly.

### 2.4 Other decisions

- **Why? timing.** Why? appears after the first Check on a screen's **last** step if the answer was correct or a predicted error, or when the second-miss demonstration opens it. It doesn't appear after an unpredicted first miss (see 4.4).
  - Screen 10: it appears after the learner compares explanations (Step E has no Check).
  - Screen 12: it appears when the border row comes back.
  - Screen 7: it is hidden while Marc's 40 move runs, even if a "30" answer had already revealed it, and comes back when the move ends.
- **Answer checking**, as the handoff describes:
  - Numbers are compared as numbers. Units after a number are ignored, and so are a leading "n =", "Figure" or "term". A comma decimal ("6,5") also counts.
  - Rules are parsed (stripping T =, S =, P =; accepting ×, *, implicit multiplication, brackets, − and -) and compared by value at n = 0, 1, 2, 3, 7 and 1.5.
  - Predicted errors are recognized the same way, so 7 + 4n and 4n + 7, 3n + 3 and 3 + 3n, and 7n − 7 and 7(n − 1) each get one response.
  - A rule with no n in it, such as "31", counts as unparseable: "Type a rule using n…".
- **Screen 8B "Correct so far".** Shown for an answer that is equivalent and has no brackets left but isn't combined ("4 + 3n − 3"). Retyping the original "4 + 3(n − 1)" is also equivalent and unsimplified, but "correct so far" would be wrong there, so it gets the general hint instead. "Correct so far" doesn't count as a miss.
- **Screen 8B tests for unpredicted errors.** "Every wrong answer is tested against the original by substitution", but the spec only writes the test for the four predicted errors. An unpredicted wrong rule gets the general hint plus a test in the spec's own format, at the first n (1, 2, 3, …) where it breaks: "Test at n = 2: 6, but the original gives 7."
- **Screen 8A slips.** A wrong value in the 4 + 3(n − 1) row gets the bracket response. A wrong value only in the 3n + 1 row gets the general response.
- **Option order.** The correct option is never first: Screen 4 is wrong, right, wrong; Screen 6 is Yes, Maybe and wrong, right; Screen 11 is Yes, No; exit ticket item 7 is wrong, right.
- **Screen 10 building.** The tray holds a constant-colour stick and a coefficient-colour group of 3 (top, side, bottom). The build draws them in a fixed layout: constant sticks first, then one square per group. Pieces can go in either order, and the build finishes on its own when it matches the rule at n = 1. A piece is disabled once the rule needs no more of it, so Nina's group piece is disabled from the start, with "3 × (1 − 1) = 0" next to it.
- **Screen 10E.** Compare is enabled once the learner has written something. The text stays in the page only, is never stored or sent, and the tick isn't used anywhere.
- **Screen 12 dials.** Two sliders, with integer a from 0 to 10 and b from −15 to 10, starting at a = 1, b = 0 (shown as "T = 1n + 0"). No setting passes through more than two points; the tests check every setting.
- **Screen 15.**
  - Submit is one-shot.
  - If any item is empty, Submit moves focus to it and nothing else happens.
  - An unreadable rule or number is flagged in place and the ticket isn't submitted.
  - Item 5 must be equivalent to 24 + 6n **and** contain (n − 1).
  - After submission, a wrong item 6 also marks 6, 10, 14, 18, because its response says "Only that one…".
- **Accessibility.**
  - Every target is at least 44 px; the tests measure every control on every screen, including drag pieces and drop targets.
  - Pieces and drop targets are buttons, so drag-and-drop also works from the keyboard (Enter on the piece, then Enter on the target).
  - Feedback is announced (`aria-live`).
  - Reduced motion skips the animations.
  - Light and dark mode follow the device setting.
- **System fonts only.** Nothing is loaded from the web.

---

## 3. Where the build differs from the spec

1. **Added prompts and interface text** (2.2). These were needed to build the screens at all.
2. **Placeholder hints and tick-only confirmations** (4.2 and 4.8). These fill gaps in the spec rather than replace any of its text.
3. **Why? timing on screens with several steps** (4.3, 4.4). The Why? text appears with the last step, not the first Check.
4. **The second-miss default** doesn't open the Why? text on non-final steps (2.1).
5. **Small visual additions:**
   - Screens 5 and 9 show their rule (T = 3n + 2, S = 3n + 1) as a reminder.
   - Screens 4 and 6 show Figure 1.
   - Screen 5's Why? draws Figure 7.
   - Screen 8's Why? draws the two groupings.
   - Screen 7's "Figure 1 is 1 + 3" step colours the sticks as 1 + 3s.

   None of these changes any text.
6. **Screen 11, "Build it: a 4-by-4 square."** The response is shown as written, with a dashed 4 × 4 outline to count. It is not an interactive build (4.10).
7. **Screen 14's "(distance at 3.5 s: 12.25 m)"** is shown word for word, in parentheses after the question, with the numbers computed.
8. **Screen 15 items 6 and 7 are choices**, not typed (4.5).

The tests confirm that no spec text was reworded. Every response, hint, Why?, title, intro, option, exit item and self-check item in the data block (147 strings) appears word for word in the spec.

---

## 4. Contradictions and things that didn't fit

Every point below is built in the way described in sections 2 and 3, and none is fixed silently.

1. **Most steps have no question text.** The spec describes what the learner does, not the words on screen, so I wrote 35 prompts (2.2).
2. **Unpredicted errors need "a hint toward the first step", but 25 steps have none written.** Those steps show "Not yet. Try again.":
   - 1B, 2A, 2B, 2C (total), 3A (Figure 0 count);
   - 6A (5n at Figure 1), 6B, 7A (13), 7B, 7·1, 7·4, 7·5, 7·6;
   - 8A (slip in the 3n + 1 row only), 8C, 9A;
   - 10B (squares), 10B (figure), 10D (other than Arun marked correct);
   - 11A, 11B (next border), 11C (Yes), 13A, 14A, 14B (speed at 3 s).
3. **One Why? per screen vs "appears after the first Check".** On screens with several steps, the Why? text gives away later answers: Screen 1's gives 25, Screen 2's gives 14, Screen 6's gives 2, 5 and 32. So it waits for the last step.
4. **"Why? appears only after the first Check, right or wrong" vs the outcome table.** The table shows Why? after correct and predicted outcomes only. An unpredicted miss must get "a hint toward the first step, without the answer", and the Why? text contains the answer, so I followed the table.
5. **Screen 15 says "typed answers only", but item 6 is a choice of three patterns and item 7 a choice of explanations.** Both are built as choices. The spec also gives no Why? text for the exit ticket, so nothing appears after Submit except each wrong item's response.
6. **"At most two short sentences before the learner acts."** Screen 13's intro is three sentences and Screen 15's is four. Both are shown as written.
7. **Screen 6, "Is the rule correct?"** The spec gives responses for Yes and Maybe only, so only those two options are offered. There is no "No".
8. **Correct answers with no confirmation:** 4, 6A (5n at Figure 1), 6D, 7·1, 7·4, 10B (squares), 10D, 11A and 11C. The outcome table promises "a short confirmation naming what was right"; these show a tick only.
9. **Screen 7, the 40 move.**
   - Step 1 expects 8. A learner who types 7, the true count, gets "Not yet. Try again."
   - Step 3 specifies only 11 and 10, so any other prediction is handled like 11.
   - Inside the move, the second-miss default applies to each sub-step.
10. **Screen 11, "Build it: a 4-by-4 square."** The spec has no build interaction for this, so a dashed 4 × 4 outline appears instead.
11. **Screen 12, "after three tries".** A try isn't defined. I count a press of Check, which rings the points hit and shows no text.
12. **Screen titles that read as designer labels:** "Retrieval: is 103 in the pattern?" and "The garden (independent evidence)". Both are shown as written.
13. **Self-check items are lowercase fragments.** They are shown with a capital first letter by CSS only; the text is unchanged.
14. **Screen 2 says "the first colour".** A learner can't know which colour is "first", so the prompt shows the constant-colour swatch beside the words.
15. **"4 + 3n − 3 (not combined)" on Screen 8.** Read literally, "equivalent but not simplified" would also catch a learner retyping the original. That case is excluded (2.4).

---

## 5. Test results

`node tests/lesson.test.js` uses Playwright with Chromium. **1,772 checks: 1,772 passed, 0 failed.**

| Section | Checks | What it covers |
|---|---|---|
| Spec text | 14 | Expected strings used by the tests exist in the spec or handoff (more are checked inside each section). |
| Answer checker | 8 | Equivalence at the six test points, unparseable input, simplified forms, the (n − 1) check, numbers with units. |
| Computed numbers | 12 | Tiles 2, 5, 8, 11, 14, Figure 7 = 23 and Figure 10 = 32; sticks 1, 4, 7, 10, 13, **Figure 10 = 31** and **Figure 40 = 121**; Figure 33 = 100 sticks; borders 3, 5, 7, 9; d = t² and 12.25 at 3.5 s; **speeds 7, 6.5, 6.1, 6.01**; 6 at t = 3; builds of 1, 2 and 1 squares; garden 24, 66, 18; at most two points on any line in Screen 12. |
| Data block text | 1 (147 strings) | Every response, hint, Why?, title, option and item in the data block is word for word in the spec. |
| Correct path ×5 | 258 each | All 16 screens at phone 390 × 844 (taps, touch drags, dark mode) and desktop 1280 × 800 (mouse drags, dark mode). Each screen: progress, Next gating, every response, Why? text, no overflow, and every target at least 44 px, measured at the start, before every drag or tap placement, and at the end. At the end: no console errors, no network requests, no storage. |
| Predicted wrong answers | 323 | Every predicted wrong answer on every screen, with its exact response text and test lines, plus unparseable input, unpredicted errors, second misses, the Screen 7 40 path (predicting 11), Screen 15's responses after submission, and Screen 16's ticks after second misses. |
| Screen 7: 40, then 10 | 82 | The other branch of Marc's move ("Right."). |
| Navigation | 30 | Back to view without redoing, and Next back to the current screen. |
| Keyboard | 12 | Placing a piece and checking an answer with the keyboard. |

Touch drags are tested with real touch events at phone size for every drag in the lesson (Screens 2, 7, 10, 11) and for the sliders (Screens 3, 8, 14).

Screenshots are in `test-results/screenshots/`:
- `phone-NN-start/done.png` and `desktop-NN-start/done.png`: every screen at both sizes, before and after the correct path.
- `phone-wrong-NN.png`: every screen after its predicted wrong answers, with the responses and demonstrations showing.

**Not tested:**
- Safari and Firefox (only Chromium is installed here). The slider styling has WebKit and Firefox rules, but nothing has been checked in those browsers.
- Real phones.
- Screen readers.

---

## 6. Questions for Marc

1. **Prompts.** Are the prompts in 2.2 right, or do you want your own wording? Should "Retrieval:" and "(independent evidence)" stay in the titles?
2. **Hints.** Would you write a hint for each of the 25 steps in 4.2, or is "Not yet. Try again." acceptable?
3. **Confirmations.** Do the 9 steps in 4.8 each need a short confirmation, or is a tick enough?
4. **Why? timing.** Is "with the last step" right for screens with several steps? Should the second-miss demonstration on an earlier step open the Why? text anyway?
5. **Screen 6.** Should "No" be an option on "Is the rule correct?" If so, what does it say?
6. **Screen 7's move.** What should happen if the learner predicts 7 for Figure 2, or something other than 10 or 11 for Figure 3?
7. **Screen 11's "Build it".** Do you want a real tile-by-tile 4 × 4 build there?
8. **Screen 12.** Is a try the right unit (one Check)? Should Check say anything, such as how many points the line hits?
9. **Exit ticket.** Are choices right for items 6 and 7? Should there be Why? text, or a summary, after Submit? Is one submission right?
10. **Self-check.** Is "no second miss anywhere on that screen" the rule you want? Screens 1, 7, 9, 10, 12 and 13 feed no item; is that intended?
11. **Colour.** Is it all right to colour Screen 7's "Figure 1 is 1 + 3" sticks as constant and groups?
12. **Placeholder wording.** "Answer", "Compare", "Mine says the same thing." and "Type a number." are mine. Keep them or replace them?
