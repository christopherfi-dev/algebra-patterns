# Handoff: "Seeing the Rule", round 2

Round 1 built all 16 screens and passed its own tests. A review in the browser, by the master thread and by a second model, found defects the tests missed, and Marc has now decided every open question from your round 1 report. Round 2 applies his decisions and the approved wording, fixes the defects, and tests only what changed.

## Read first, in this order

1. `CLAUDE.md`: updated. The source of truth is now the spec plus the two round 2 files, and the round 2 files win where they differ from the spec.
2. `docs/Round-2-Decisions.md`: 18 questions, each with Marc's answer. He accepted every recommendation, and chose option (b) for Q2.
3. `docs/Round-2-Wording.md`: all learner-facing text for round 2, approved by Marc, keyed by your round 1 step IDs.
4. Your own `REPORT.md` and `handback/round-1.md`, for the step IDs and what was built.

## Setup

1. Unzip this package into the repository root. It replaces `CLAUDE.md` and adds `HANDOFF-ROUND-2.md` and the two files in `docs/`. Commit it unchanged as the first commit of round 2.
2. Keep working in `lesson/index.html`.
3. Commit after each group of work below.

## The work

### 1. Defects (Decisions, Part 4)

- **"null" on Screens 4 and 5.** Steps with no prompt insert the missing value as text. Make the element builder skip null and undefined children everywhere, not just on these two screens.
- **Math expressions wrapping on phones.** "S = 4 + 3(n − 1)" breaks across lines on Screen 8 and exit item 4. No rule or expression may break internally anywhere in the lesson.
- **Screen 11's figures.** Make the square figures large enough to read at 390 px wide, and give each L-shaped border a clearly visible treatment. Don't use either of the two colours for it; they keep their meanings.
- **How rules are displayed.** Display rules the way they're written by hand: a = 1 shows as "n," b = 0 is omitted, and a negative b shows with a minus sign. Screen 12 currently shows "T = 1n + 0."
- **The answer checker accepts only straight-line rules.** Reject any expression with n multiplied by n, n in a denominator, or any power of n, then compare by value as now. The lesson teaches that matching examples proves a straight-line rule but not any other kind, so the checker must follow the same logic.

### 2. Structure

- **Cut Screen 1 (Q1).** The lesson becomes 15 screens: "Screen k of 15." Screen 3's Why? keeps the row comparison table as it is.
- **Titles and intros (Q13, Q14):** as in Wording E.

### 3. Behaviour

- **Q5 and Q6:** keep Why? and the second-miss card as built.
- **Q7, Screen 6:** add "No" with its response from Wording E. Keep the correct option out of first position.
- **Q8, Screen 7:** a 7 on step 1 gets the response in Wording E and goes straight to the shared-edge step.
- **Q9, Screen 11:** replace the dashed outline with a real build: the learner fills in the 4-by-4 square by tapping or dragging.
- **Q10, Screen 12:** a Check counts as a try only if a slider moved since the last Check. A counted Check shows "Your line passes through k of the 4 points," with the real k. A Check with no movement shows "Move a slider first," and doesn't count.
- **Q11, Screen 15:** keep the two choice items and one submission. No Why? after submission; each wrong item shows its response.
- **Q12, Screen 16:** retitle it "What you showed on your own." Show one line per exit item, using the seven lines in Wording E, in exit-item order. A line is ticked only if that exit item was correct on the first and only submission. Nothing from the guided screens feeds it.
- **Q2, Nina's 4:** on Screen 10, and in Screen 8's Why? drawing, Nina's 4 is a neutral colour (not orange) and labelled "first square." Orange only ever means the value at Figure 0.
- **Q4, Screen 14:** add the line "h is the extra time after 3 seconds." Show the two rows from Wording E side by side as h shrinks, with every value computed.
- **Q3, follow-up items:** add the three items in Wording D. Each appears only after the "Answer" card on its step (3B, 7B, 8B), and the learner must answer it to continue. Draw the new tile pattern in the two colours. Draw the triangles as a row of equal sticks, neighbours sharing a stick. Test every wrong answer on the new simplification by substitution, the same way as 8B.

### 4. Text

Insert every line in `Round-2-Wording.md`: the one prompt change (A), the 24 hints (B), the 9 confirmations (C), the follow-up items (D) and the new text (E). Keep "Not yet. Try again." only as a last resort if any step is still left without a hint, and list any such step in the report.

## Testing

Keep it proportionate. Don't add tests for every way a learner might phrase an answer.

- Rerun the existing suite. Update the text check so learner-facing strings are matched against the spec and the two round 2 files together.
- Add checks for each change:
  - no rendered text anywhere reads "null" or "undefined";
  - no math expression wraps at 390 px;
  - Screen 12's Next stays locked after Checks with no slider movement;
  - Screen 16 shows 0 ticks when every exit answer is wrong and 7 when every one is right;
  - the checker rejects n × n and other non-linear input;
  - each follow-up item appears only after a second miss on its step;
  - Screen 6 offers "No" with its response;
  - Screen 7 handles a 7 on step 1.
- Run the full suite once in WebKit (Safari's engine) as well as Chromium. If WebKit can't be installed, say so in the report.
- Screenshot all 15 screens at phone size and desktop size.

## Report

- Update `REPORT.md`.
- Write `handback/round-2.md` in the same shape as round 1: status, test results (Chromium and WebKit), anything not done, any new conflicts between the spec and the round 2 files, and anything Marc still needs to decide, keyed by step ID.
- Don't deploy.
