# Handback to the master thread: round 1

**From:** Claude Code, working in `christopherfi-dev/algebra-patterns`, branch `master`
**Build state:** commit `04b4b35` · 30 October 2026
**Full report:** `REPORT.md` in the repo. This handback is the short version, for planning round 2.

## Status

- **Built:** all 16 screens, in `lesson/index.html`. It is one self-contained file (about 107 KB) with every screen in one `LESSON` data block, read by one engine. It works offline and stores nothing about the learner.
- **Tested:** 1,772 Playwright checks, all passing, in Chromium:
  - phone (390 × 844) and desktop (1280 × 800), in light and dark mode;
  - with taps, touch drags, mouse drags and the keyboard;
  - every correct path, and every predicted wrong answer against its exact spec text;
  - every computed number, including Figure 40 = 121, Figure 10 = 31 and the speeds 7, 6.5, 6.1, 6.01;
  - no overflow at phone size, and 44 px targets everywhere.
- **Not tested:** Safari, Firefox, real phones, screen readers.
- **Screenshots:** in `test-results/screenshots/`: every screen at both sizes, plus every screen after its predicted wrong answers.
- **Commits:** handoff package unchanged → milestone 1 (Screens 1–2) → milestones 2–6 (one commit: they share one file) → milestone 7 (tests, screenshots, README) → `REPORT.md`.
- **Not deployed.**

**Step IDs** below match the `data-step` attributes and the data block. Each is the screen number plus the spec's step letter. A digit splits a spec step into its parts: 2C1 is the drag and 2C2 is the typed total. 7·1 to 7·6 are the six numbered steps of Screen 7's 40 move.

---

## What round 2 needs

The spec describes what the learner does but not the words on screen, so most of round 2 is text. Everything below is in the data block, so new wording can be dropped in without engine changes.

### A. Prompts I wrote (35): approve or replace

| Step | Prompt now | Your wording |
|---|---|---|
| 1A | Type the explicit rule. | |
| 1B | Which term is 103? | |
| 2A | How many tiles of the first colour ■ are in every figure? (■ is the constant-colour swatch) | |
| 2B | How many tiles does each new figure add? | |
| 2C1 | Drag one group of 3 to build Figure 4. | |
| 2C2 | How many tiles does Figure 4 have? | |
| 3A1 | Slide the figure number back to 0. | |
| 3A2 | How many tiles does Figure 0 have? | |
| 3B | Type the rule. | |
| 6A1 | What does T = 5n give for Figure 1? | |
| 6B | What does T = 5n give for Figure 0 and Figure 10? | |
| 6C | What does T = 3n + 2 give for Figures 0, 1 and 10? | |
| 6D | Why can we trust 3n + 2 for every figure? | |
| 7A1 | Drag sticks to build Figure 4. | |
| 7A2 | How many sticks does Figure 4 have? | |
| 7B | How many sticks does Figure 10 have? | |
| 8A | Type the value of each rule for n = 1, 2 and 3. | |
| 8B | Simplify 4 + 3(n − 1). | |
| 8C1 | Slide to Figure 0. | |
| 8C2 | How many sticks are left? | |
| 9A | How many sticks are in Figure 40? | |
| 9B | Which figure uses exactly 100 sticks? | |
| 10A | Build Mina's rule for Figure 1. | |
| 10B1 | Build Arun's rule for Figure 1. | |
| 10B2 | How many squares did you build? | |
| 10B3 | Which figure is that? | |
| 10C | Build Nina's rule for Figure 1. | |
| 10D | Mark each rule correct or incorrect. | |
| 11A | How many tiles are in Figure 4? | |
| 11B1 | Drag the L-shaped border that turns each square into the next. | |
| 11B2 | How many tiles are in the next border? | |
| 13A | What is the ball's average speed from 3 to 4 seconds? | |
| 14A | What is the average speed for h = 0.5? (distance at 3.5 s: 12.25 m) | |
| 14B1 | Slide h toward 0. | |
| 14B2 | What is the speed at exactly 3 seconds? | |

Screens 4 and 5 use their titles as the question. Every other prompt is the spec's own words.

### B. Steps with no hint for an unpredicted wrong answer (25)

The spec says an unpredicted error gets "a hint toward the first step, without the answer". These steps have none written, so they show **"Not yet. Try again."**

| Step | Question | Correct | Predicted errors already handled | Your hint |
|---|---|---|---|---|
| 1B | Which term is 103? | 25 | 26, 100 | |
| 2A | Tiles of the first colour in every figure | 2 | 5 | |
| 2B | Tiles each new figure adds | 3 | 5 | |
| 2C2 | Tiles in Figure 4 | 14 | 12, 20 | |
| 3A2 | Tiles in Figure 0 | 2 | 5, 0 | |
| 6A1 | T = 5n at Figure 1 | 5 | none | |
| 6B | T = 5n at Figures 0 and 10 | 0 and 50 | none (typing the real counts, 2 and 32, is the likely slip) | |
| 7A2 | Sticks in Figure 4 | 13 | none | |
| 7B | Sticks in Figure 10 | 31 | 30, 40 | |
| 7·1 | Figure 2 if each square has 4 sticks | 8 | none (7, the true count, gets the placeholder) | |
| 7·4 | Sticks added by the 2nd and 3rd squares | 3 and 3 | none | |
| 7·5 | Figure 3 is…? | 10 | none | |
| 7·6 | Sticks in Figure 10 | 31 | none | |
| 8A | Both rules at n = 1, 2, 3 | 4, 7, 10 twice | a slip in the 4 + 3(n − 1) row; a slip only in the 3n + 1 row is not handled | |
| 8C2 | Sticks left at Figure 0 | 1 | 4 | |
| 9A | Sticks in Figure 40 | 121 | none (160 is the likely slip) | |
| 10B2 | Squares in Arun's build | 2 | none | |
| 10B3 | Which figure that is | 2 | none | |
| 10D | Mark each rule | Mina ✓, Arun ✗, Nina ✓ | Arun marked correct; Mina or Nina marked incorrect is not handled | |
| 11A | Tiles in Figure 4 | 16 | 12 | |
| 11B2 | Tiles in the next border | 9 | 7 | |
| 11C | Is there a common difference? | No | "Yes" is not handled | |
| 13A | Average speed from 3 to 4 s | 7 | 16, 4 | |
| 14A | Average speed for h = 0.5 | 6.5 | 3.25 | |
| 14B2 | Speed at exactly 3 s | 6 | 6.01, 0 | |

### C. Correct answers with no confirmation (9)

The spec says a correct answer gets "a short confirmation naming what was right". These have none written, so they show **a tick only**.

| Step | Correct answer | Your confirmation |
|---|---|---|
| 4A | Figure 1 has one group of 3 plus the 2 fixed tiles… | |
| 6A1 | 5 (T = 5n at Figure 1) | |
| 6D | It works for three figures, and every figure adds exactly one more group of 3… | |
| 7·1 | 8 | |
| 7·4 | 3 and 3 | |
| 10B2 | 2 squares | |
| 10D | Mina correct, Arun incorrect, Nina correct | |
| 11A | 16 | |
| 11C | No | |

### D. Interface wording I wrote: keep or replace

| Where | Text now |
|---|---|
| Unpredicted error with no hint | Not yet. Try again. |
| Unreadable number (not a miss) | Type a number. |
| Label on the second-miss card | Answer |
| Screen 10E button | Compare |
| Screen 10E tick box | Mine says the same thing. |
| Real counts on Screen 6B, shown after Check | · 2 tiles / · 32 tiles |
| Buttons and progress | Check · Why? · Back · Next · Submit · Screen 3 of 16 |

### E. Decisions on how screens behave

Each item says what is built now.

1. **Why? timing.** Each screen has one Why?, and on screens with several steps it gives away later answers (Screen 1's gives 25, Screen 2's gives 14). So Why? appears after the first Check on a screen's **last** step: on a correct answer or predicted error, not an unpredicted one. Keep that?
2. **Second miss with no demonstration of its own.** An "Answer" card shows the answer and that step's confirmation, and the learner types it to continue. Why? opens only on the last step. Keep that?
3. **Screen 6, "Is the rule correct?"** Only Yes and Maybe are offered, because the spec gives responses for those two only. Add "No", and if so with what response?
4. **Screen 7's 40 move.** What should happen if the learner predicts 7 for Figure 2? Any Figure 3 prediction other than 10 is treated as 11 now.
5. **Screen 11, "Build it: a 4-by-4 square."** It shows a dashed 4 × 4 outline. Should it be a real build?
6. **Screen 12, "after three tries".** A try is one press of Check, which rings the points the line hits and says nothing. Should Check say anything?
7. **Screen 15.** Items 6 and 7 are choices, although the spec says "typed answers only". There is one submission, and no Why? text afterwards, because the spec writes none. Keep these?
8. **Self-check.** An item is ticked if its screen had no second miss on any step. Screens 1, 7, 9, 10, 12 and 13 feed no item. Intended?
9. **Titles.** "Retrieval: is 103 in the pattern?" and "The garden (independent evidence)" are shown as written. Drop "Retrieval:" and "(independent evidence)"?
10. **Intros.** Screen 13's intro is three sentences and Screen 15's is four, against the two-sentence limit. Shorten them?

### F. Defaults from the handoff, as built

- **Second miss:** see E2.
- **Colours:** orange for the constant (`#b45309` light, `#f59e4b` dark) and blue for the coefficient (`#1d6fb8` light, `#6cb6f5` dark). Both stay distinct for colour-blind learners and readable in both modes. The rest of the interface uses no hue.
- **Progress:** a thin bar, plus "Screen k of 16".
- **Back:** shows earlier screens read-only, with Why? still openable.
- **Self-check:** see E8.

### G. Additions beyond the spec's text

None of these changes any spec text:
- Screens 5 and 9 show their rule as a reminder.
- Screens 4 and 6 show Figure 1.
- Screen 5's Why? draws Figure 7.
- Screen 8's Why? draws Figure 3 grouped both ways.
- Screen 7's step "Figure 1 is 1 + 3" colours the sticks as constant and groups.

---

## Suggestions for the round 2 handoff

- **Key new text by step ID** (1A, 2C2, 7·4…), in tables A–D's shape. Each line then maps to one field in the data block.
- **For every typed step, give:** the on-screen question; the response to an unpredicted wrong answer; and a confirmation for the correct answer.
- **For every choice, give:** every option, and a response for each wrong one.
- **Answer section E item by item,** even when the answer is "keep".
- **Ask for a fresh handback at the end of round 2.** The rule is now in `CLAUDE.md`, so Claude Code writes `handback/round-2.md` automatically.
