# Handoff: "Seeing the Rule", round 4

Four small fixes, found by an independent review of round 3 and confirmed in the browser. No new content and no other changes.

All learner-facing text below is Marc's: he approved these fixes, and sending this file approves the wording.

This file takes precedence over everything before it (see `CLAUDE.md`). Step IDs are the round 1 IDs you already use.

## Setup

1. Unzip into the repository root. It replaces `CLAUDE.md` and `docs/Marc-Teaching-Moves.md`, and adds this file. Commit it unchanged.
2. Commit after each numbered fix.

---

## 1. Step 6A2: accept "No"

"Is the rule correct?" currently accepts only "Maybe." But by Screen 6 the learner has already found T = 3n + 2, so a learner who answers "No" is right: 5n is wrong. Treat **both "Maybe" and "No" as correct**, each with its own confirmation:

| Option | Result | Text |
|---|---|---|
| Yes | wrong (unchanged) | It works for Figure 1, but one figure isn't enough. Try another one. |
| Maybe | correct (unchanged) | Maybe. Always try another one. |
| No | **correct** | Right, it's wrong, and the next step shows where. But Figure 1 alone couldn't tell you that. Always try another one. |

Both correct answers lead to Step 6B as now. Keep the option order.

## 2. Screen 8's Why?: the equation chain overflows

The line "4 + 3(n − 1) = 4 + 3n − 3 = 3n + 1." is forced onto one line. Measured in a separate environment, it runs past its paragraph by 5 px at 390 px, 35 px at 360 px (where the whole page scrolls sideways), and 75 px at 320 px. Your tests passed because fonts differ between environments, and real phones differ more.

- **Fix:** each expression in a chain stays whole, but the chain may break after an "=" sign. Apply this to every chain of equalities in the lesson, not just this one.
- **Test:** open every Why? panel and every response on every screen, at 360 px and 390 px, and confirm nothing runs past its container and the page never scrolls sideways. Leave some margin rather than fitting exactly, because real phones use different fonts.

## 3. "Skip count by 3" and "Skip count by 4"

Approved: use a non-breaking space in "by 3" and "by 4" (steps 3T1 and 15 item 1), so the number never sits alone on the next line.

## 4. The teaching-moves file

The replaced `docs/Marc-Teaching-Moves.md` corrects one sentence in move 3. It now reads: "For a straight-line rule, and a pattern that adds the same amount every time, if it works for three figures it is correct. Two figures already settle it; the third catches slips." No code change; this is documentation only.

---

## Testing

- Add checks for:
  - both "Maybe" and "No" accepted on 6A2, with their texts, and "Yes" still wrong;
  - the widened no-overflow check from fix 2, with every Why? panel and response open, at 360 px and 390 px;
  - the non-breaking spaces.
- Rerun the full suite in Chromium and WebKit.
- Screenshot all 12 screens at phone size, with Screen 8's Why? open.

## Report

Update `REPORT.md` and write `handback/round-4.md` in the usual shape. Don't deploy.
