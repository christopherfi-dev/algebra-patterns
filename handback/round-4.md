# Handback to the master thread: round 4

**From:** Claude Code, working in `christopherfi-dev/algebra-patterns`, branch `master`
**Date:** 31 October 2026
**Full report:** `REPORT.md` in the repo. This handback is the short version.

## Status

- **Done:** all four fixes in `HANDOFF-ROUND-4.md`, plus the additions Marc approved after reading my feedback on the handoff (listed below).
- **The lesson:** still 12 screens, "Screen k of 12". No new content.
- **Not deployed.**
- **Commits, in order:**
  1. round 4 package, unchanged;
  2. fix 1, 6A2;
  3. fix 2, equation chains and Screen 8's table;
  4. fix 3, non-breaking spaces;
  5. tests and screenshots, with the width changes the margin needed;
  6. this report.
- **Fix 4** (the teaching-moves sentence) is documentation only and arrived in the package commit.

## Test results

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 2,874 | 0 |
| WebKit 26.6 (Safari's engine) | 2,374 | 0 |

- **6A2:** "Maybe" and "No" are both accepted with their texts. "Yes" is still wrong, and after it twice the Answer card names both right answers.
- **The margin check** (new, fix 2):
  - Runs at 360 and 390 px in both engines, with every Why? and every response open, on the correct path, both wrong-answer runs and the exit-ticket runs.
  - Every unbreakable expression, formula, rule card, caption, and every table at its narrowest, must leave **16 px** spare. The page must never scroll sideways.
  - It would have caught the original fault: at 360 px the old chain left only 9 px.
- **Non-breaking spaces** are checked in every "Skip count by 3/4" label.
- **New runs at 360 px:** the correct path and the wrong answers, in both engines.
- **Screenshots:** all 12 screens at phone and desktop size, with each screen's Why? open in the "done" shots (Screen 8's included), in `test-results/screenshots/`. WebKit captures are in `webkit/`.
- **Not tested:** Safari on a real iPhone or Mac, Firefox, screen readers, and widths below 360 px. At 320 px nothing scrolls sideways, but the margin isn't guaranteed.

## What changed, keyed by step ID

| Where | Change |
|---|---|
| 6A2 | "No" is right, with "Right, it's wrong, and the next step shows where. But Figure 1 alone couldn't tell you that. Always try another one." "Maybe" is unchanged, "Yes" is still wrong, and the order is unchanged. The second-miss card lists both right options. |
| Screen 8 Why?, and the rule-screen slider readout (3A1) | A chain with two or more "=" may break after each "=", and each piece stays whole. The longest piece of Screen 8's chain is now 115 px; it was one 287 px unit. A single equation never breaks. |
| 8A (my addition) | Below 420 px, each rule sits above its row of three boxes. |
| 3T1, rule-screen table, Screen 3 Why? table, 15 item 1 | A non-breaking space in "Skip count by 3" and "Skip count by 4". |
| 3T1, 3T3, 15 item 1 (my addition) | Input boxes are 44 px (the touch minimum), so both typed tables leave 16 px spare at 360 px. |
| All responses (my addition) | The text column fills its response box, with no visible change. This makes the margin measurable. |

## The additions Marc approved

1. **A chain is two or more "=".** "T = 3n + 2" stays whole, as round 3 required.
2. **Screen 8's two-rule table stacks on narrow phones.** It had 18 px spare at 360 px here.
3. **The non-breaking space goes in all four places** "Skip count by 3/4" appears, not just the two named.
4. **The second-miss card names both right answers** on 6A2.
5. **The margin is 16 px.** That roughly covers a font 5–8% wider than the ones here.

Making the 16 px margin hold also needed the 44 px input boxes. Those are a width change only, within fix 2's "nothing runs past its container".

## Anything not done

Nothing.

## Open questions

None. Round 4 answered round 3's one question.

## Suggestions for the next handoff

- **Check on real devices before reviewers do:** Safari on an iPhone, and a 360 px Android phone. The margin covers fonts somewhat wider than these test machines' fonts, but only a real device confirms it.
- **If new content arrives,** give its learner-facing text in full, as in rounds 2–4. Every string still has to be found word for word in the source of truth.
