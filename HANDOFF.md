# Handoff: build "Seeing the Rule", round 1

## What this is

An interactive math lesson for Marc's application to Brilliant (Math Learning Designer). It turns his own Grade 7 MYP pattern lessons into the kind of lesson Brilliant builds: one idea per screen, learners act on visual pieces, every response written in advance, no teacher and no AI. Reviewers at Brilliant will play it on a computer or a phone, so it has to look finished and work on both.

## Read first, in this order

1. `CLAUDE.md`: the fixed rules.
2. `docs/Seeing-the-Rule-Interactive-Lesson-Plan.md`: the spec. Sixteen screens in seven parts. Build every screen exactly as written.
3. `docs/Marc-Teaching-Moves.md`: why the screens work the way they do.
4. `reference/Hollow_House_offline.html`: an earlier activity Marc built with Claude Code. Use its structure as the model: all content in one data block, one engine that reads it. Don't copy its look, theme or lockout.

## Setup

1. Unzip this package into the repository root and commit it unchanged as the first commit.
2. Build the lesson as `lesson/index.html`: one self-contained file, with all CSS, JavaScript and SVG inline.
3. Add a short `README.md` saying what the lesson is and how to open it.
4. Commit at each milestone below with a clear message.

## Milestones

1. **Engine and data.** Every screen's content goes in one data block, following the spec's notes for the build: prompt, figure, input type, correct answer or answer rule, predicted wrong answers with their responses, the general hint, the second-miss demonstration, and the Why? text. Build Screens 1 and 2 first and test them before going on.
2. **Figures.** Draw every figure with inline SVG, computed from n:
   - **Tiles (Screens 2 to 6):** 2 fixed tiles plus n groups of 3. The fixed tiles stay in the same place in every figure, and each group reads as one unit. Choose the layout and report it.
   - **Sticks (Screens 7 to 10):** a straight row of n squares made of equal sticks, neighbours sharing an edge.
   - **Squares (Screens 11 and 12):** n × n tiles, with each new figure's L-shaped border shown as a unit.
   - **Ball and shrinking border (Screens 13 and 14):** a ball on a ramp, d = t²; then a 3 × 3 square with two strips of 3 × h and a corner of h × h that shrink as h moves toward 0.
3. **Interactions:** typing, tapping, dragging, sliding and building, as each step specifies.
   - A stick dropped on an edge that already exists is rejected, with the spec's message.
   - Every drag also works by tapping the piece, then tapping where it goes.
4. **Answer checking** (method below).
5. **Feedback flow:** Check, the four outcomes, Why?, and the second miss, as the spec's "How every screen works" section describes.
6. **Exit ticket and self-check:** Screens 15 and 16.
7. **Testing and report.**

## Answer checking

- **Numbers:** compare as numbers, so "6.5" and "6.50" both match. Accept spaces, and ignore units typed after the number ("13 sticks").
- **Rules typed by the learner** (such as 3n + 2), parsed as linear expressions in n:
  - Strip a leading "T =", "S =" or "P =". Accept × and *, implicit multiplication (3n, 3(n − 1)), brackets, the minus sign "−" and the hyphen "-".
  - **Equivalent to the correct rule:** the learner's expression and the correct one give the same value at n = 0, 1, 2, 3, 7 and 1.5.
  - **Simplified:** exactly one n term and at most one number. The spec's "correct so far" response on Screen 8 is for an answer that is equivalent but not simplified.
  - **Predicted errors:** recognize each one by value, not by spelling. If the learner's expression gives the same values as a predicted wrong expression at the test points, show that error's response. So "3 + 3n" and "3n + 3" trigger the same response.
- **Choices, taps and drags:** exact match.
- **Anything unparseable:** "Type a rule using n, such as 2n + 5." It doesn't count as a miss.

## Defaults where the spec leaves a detail open

Build these and list each one in the report so Marc can change it:

- **Second miss** on screens without their own demonstration: show the correct answer with the Why? text, and the learner types the answer to continue.
- **The two colours:** pick two that are distinct for colour-blind learners and readable in light and dark mode.
- **Progress:** a simple bar showing the current screen of 16.
- **Navigation:** forward only, with a "Back" button that lets the learner look at, but not redo, earlier screens.
- **Self-check (Screen 16):** an item is ticked when the learner reached the correct answer on its screen without the second-miss demonstration.

## Testing

- Use Playwright (the CLI is enough).
- Screenshot every screen at 390 × 844 and at 1280 × 800, into `test-results/screenshots/`.
- Scripted runs: the correct path through all 16 screens, plus every predicted wrong answer on every screen, confirming each produces its exact response text from the spec.
- Test drags with touch emulation at phone size.
- Confirm every computed number matches the spec, including Figure 40 = 121 sticks, Figure 10 = 31 sticks, and the shrinking-border speeds 7, 6.5, 6.1, 6.01.
- Check that no text overflows its box at phone size.

## Optional

Anthropic's frontend-design plugin may be used for visual polish. The rules in `CLAUDE.md` override it: the two colours keep their meaning, and no learner-facing text changes.

## Report

Write `REPORT.md` and commit it last. It must cover:

1. what was built, screen by screen;
2. every default chosen from the list above, and every other decision the spec didn't make;
3. every place the build differs from the spec, and why;
4. anything in the spec that was contradictory or didn't fit, with no silent fixes;
5. test results, with any failures listed;
6. questions for Marc.
