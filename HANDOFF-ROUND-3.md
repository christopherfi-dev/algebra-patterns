# Handoff: "Seeing the Rule", round 3

Round 3 is small. Its aim is a shorter lesson with one idea per screen: from a growing figure to its rule. It answers your five round 2 questions, fixes one defect your tests missed, splits one long screen, cuts the formal simplification, and adds one explanation item to the exit ticket. Nothing new beyond that.

All learner-facing text below is Marc's: he approved these changes, and sending this file approves the wording.

This file takes precedence over everything before it (see `CLAUDE.md`). Step IDs are the round 1 IDs you already use.

## Setup

1. Unzip into the repository root. It replaces `CLAUDE.md` and adds this file. Commit it unchanged.
2. Commit after each numbered section below.

---

## 1. Answers to your round 2 questions

| # | Your question | Marc's answer |
|---|---|---|
| 1 | 10B1: is Arun's 4 orange? | Keep it orange. For Arun's rule, the value at Figure 0 really is 4, so the colour rule holds. It also shows his mistake: his orange 4 is a whole square where Figure 0 should be one stick. |
| 2 | 8B·f: "correct so far" line | No longer needed. 8B·f is cut (section 4). |
| 3 | Follow-up test sentences in 8B's pattern | Moot for 8B·f, which is cut. Keep the pattern anywhere else it applies. |
| 4 | Screen 3: split the table steps? | Yes. See section 3. |
| 5 | The exit ticket doesn't assess Screens 5 to 9 | Keep as is. The exit ticket checks the big idea only. |

Every decision you listed for Marc to check in round 2 is approved as built.

## 2. Defect: an expression still wraps on phones

On learner Screen 7 (round 1 Screen 8), the row label "S = 4 + 3(n − 1)" breaks onto two lines at 390 px. It's a table header, not a `.math` span, so the no-wrap rule and its test never covered it.

- **Fix:** every rule or expression is an unbreakable unit wherever it appears, including table headers, row labels, captions and choice options. Only the expression itself stays together; the words around it wrap normally. If a label then doesn't fit its column, widen the column or narrow the input boxes; don't change the text.
- **Test:** widen the check to every element whose text contains a rule or expression (any "=" with n, or any bracketed expression in n), not just `.math` spans, and confirm nothing overflows at 390 px. Run it in Chromium and WebKit.

## 3. Split round 1 Screen 3 into two screens

The lesson becomes **12 screens** ("Screen k of 12"). Both new screens stay in Part 1.

**First screen (new): the table.**
- **Title:** The skip-count table
- **Steps:** 3T1, 3T2 and 3T3, exactly as built now, with their prompts, responses and hints.
- **Why?:** "Each figure adds 3 tiles, so the tiles grow like the skip count by 3. Every figure has 2 more tiles than the skip count. Those 2 are the fixed tiles."

**Second screen: Figure 0, and the rule.**
- **Title:** Figure 0, and the rule (unchanged)
- **Shows first:** the completed table from the first screen, read-only, captioned "From the last screen", so both routes to the 2 meet on this screen.
- **Steps:** 3A1 (slide to Figure 0), 3A2 (how many tiles) and 3B (the rule), exactly as built now, including 3A2's confirmation "The same 2 as in the table" and the 3B·f follow-up.
- **Why?:** unchanged, with its table.

Every later screen moves down one number. Keep the step IDs.

## 4. Round 1 Screen 8: cut the formal simplification

Proving two rules equal by algebra is the job of Marc's next lesson (P2), so it comes out of this one.

- **Cut Step B** (simplify 4 + 3(n − 1)), with its reminder card, its predicted errors and their responses, its hint, its tests, and the **8B·f** follow-up.
- **Keep Step A** (values of both rules at n = 1, 2 and 3), with its existing slip response. Change only its correct response to: "Right. The same values for all three figures."
- **Keep Step C** (slide to Figure 0, one lone stick) and the screen's Why? unchanged. The Why? stays as reading for anyone curious, not as required work.

## 5. Exit ticket: add item 2b

Add a choice item directly after item 2, as part of item 2. The exit ticket stays at four numbered questions.

**2b. What does the constant in the rule count?**

| Option | Response after submission |
|---|---|
| The fixed tiles, there even at Figure 0 | (correct) |
| The tiles in Figure 1 | Figure 1 has 9 tiles. The constant is what's there at Figure 0. |
| The tiles added to each new figure | Each figure adds 4. The constant stays the same in every figure. |

Keep the correct option out of first position, as elsewhere.

**Self-check line 2** becomes "Wrote the rule and identified what the constant counts". It is ticked only if both item 2 and item 2b are correct on the single submission. The other three lines are unchanged.

## 6. Optional polish

Only if it changes no text:

- the exit ticket's "Skip count by 4" label runs over three lines
- the table on round 1 Screen 3 has uneven column widths.

Tidy both if a width change does it. Otherwise leave them and say so in the report.

---

## Testing

Proportionate, as in `CLAUDE.md`:

- Remove the tests for 8B and 8B·f.
- Add checks for:
  - the widened no-wrap rule (section 2);
  - the split: two screens, the table carried onto the rule screen, "Screen k of 12";
  - Step A's new response;
  - item 2b and its responses;
  - self-check line 2 ticked only when both 2 and 2b are right.
- Rerun the rest of the suite in Chromium and WebKit.
- Screenshot all 12 screens at phone size and desktop size.

## Report

Update `REPORT.md` and write `handback/round-3.md` in the usual shape. Don't deploy.
