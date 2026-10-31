# Handback to the master thread: round 3

**From:** Claude Code, working in `christopherfi-dev/algebra-patterns`, branch `master`
**Date:** 31 October 2026
**Full report:** `REPORT.md` in the repo. This handback is the short version.

## Status

- **Done:** everything in `HANDOFF-ROUND-3.md`, including the optional polish.
- **The lesson:** 12 screens, "Screen k of 12". One idea: from a growing figure to its rule.
- **Not deployed.**
- **Commits, in order:**
  1. round 3 package, unchanged;
  2. section 2, no expression wraps anywhere;
  3. section 3, Screen 3 split;
  4. section 4, the formal simplification cut;
  5. section 5, exit item 2b;
  6. section 6, table polish;
  7. tests and screenshots;
  8. this report.
- **Section 1** (Marc's answers) needed no code change: Arun's 4 stays orange, and the round 2 decisions are approved as built.

**Step IDs** keep their round 1 numbers. Both halves of round 1 Screen 3 keep the prefix 3: the table screen has 3T1–3T3, and the rule screen has 3A1, 3A2, 3B and 3B·f. The exit ticket is 15 and the self-check is 16.

| Learner screen | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Round 1 ID | 2 | 3 (table) | 3 (rule) | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15 | 16 |

## Test results

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 2,261 | 0 |
| WebKit 26.6 (Safari's engine) | 1,785 | 0 |

- **New checks:**
  - **No-wrap rule, widened:** every on-screen text with "=" and n, or a bracketed expression in n, must sit on one line, in both engines. I confirmed it catches a real break.
  - **Screen 8's row label** "S = 4 + 3(n − 1)" is one unit on one line.
  - **The split:** the table screen, the completed table carried read-only onto the rule screen, and "Screen k of 12".
  - **8A's new response.**
  - **Item 2b and both wrong responses.**
  - **Self-check line 2:** unticked when 2 is right but 2b wrong, and when 2b is right but 2 wrong; ticked when both are right.
- **Removed:** the tests for 8B and 8B·f.
- **Screenshots:** all 12 screens at 390 × 844 and 1280 × 800 in `test-results/screenshots/`, with WebKit captures in `webkit/`.
- **Not tested:** Safari on a real iPhone or Mac, Firefox, screen readers.

## What changed

| Where | Change |
|---|---|
| Screen 8 row label, and every table header, label, caption and option | Expressions are unbreakable units, and the words around them wrap. On phones, Screen 8's input boxes are 50 px so "S = 4 + 3(n − 1)" fits whole at 390 px. |
| 3T1–3T3 | Now their own screen, "The skip-count table", with the new Why?. |
| 3A1–3B | "Figure 0, and the rule" opens with the completed table, read-only, captioned "From the last screen". |
| 8A | New confirmation: "Right. The same values for all three figures." |
| 8B, 8B·f | Cut, with the reminder card, responses, hint, tests, and the code only they used. |
| 15 (2b) | "What does the constant in the rule count?" is added to question 2. The correct option is second; a wrong choice shows its response. |
| 16, line 2 | "Wrote the rule and identified what the constant counts". Ticked only if 2 and 2b are both right. |
| Exit table, Screen 2 table | **Widths only.** "Skip count by 4" now takes at most two lines from 360 px up (one on desktop). Screen 2's value columns are all one width. Both tables fit a 360 px phone. |
| Exit ticket | "2b." had no space before its question; the number now has a small gap. |

## Removed this round

Step 8B and its follow-up 8B·f, and everything that served them:
- the distributive-property card;
- the four predicted errors and their substitution tests;
- the "correct so far" response;
- the hint;
- the simplified-form checker.

## Anything not done

Nothing.

## Decisions I made that Marc may want to check

| Where | As built |
|---|---|
| 3A1–3B | The carried table is computed, not copied from the learner. It can't differ: the table screen can only be left with every cell right. |
| 15 (2b) | The correct option isn't marked after a wrong choice, because its responses don't refer to it (unlike the old garden item 6). |
| Screen 2 table | With equal-width value columns, "Skip count by 3" and "How many more" take two lines at phone widths; they took one at 390 px before. |
| Engine | "Not yet. Try again." stays as a last resort, but no step uses it now. |

## Open questions, keyed by step ID

1. **3T1 and 15 (item 1), the labels "Skip count by 3" and "Skip count by 4".** At phone widths they wrap after "by", leaving the number alone on the second line. A non-breaking space would keep "by 3" together and looks identical. It's still a character change to approved text, so I haven't made it. Approve it?
2. **For information only:** 8B·f's test-sentence pattern no longer applies anywhere. 3B·f keeps the wording's own test line, and 7B·f has none. Nothing to decide unless you want test lines on 7B·f.

## Suggestions for the next handoff

- **One open question:** answer item 1 above with yes or no.
- **Real-device check:** play the lesson in Safari on an iPhone, and on one narrow Android phone (360 px), before reviewers see it. Nothing has been tested on a real phone.
- **If any screen moves again,** say which step IDs move. The IDs still follow round 1's numbering, which now differs from the learner's screen numbers (see the table above).
