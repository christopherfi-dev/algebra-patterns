# Handoff: round 8, the audit's fixes

Round 8 answers your gradual-release audit. Most of it is wording and order. Nothing new is taught, and the exit ticket doesn't change.

All learner-facing text below is Marc's: he approved these changes, and sending this file approves the wording.

This file takes precedence over everything before it (see `CLAUDE.md`). Step IDs are the ones you already use.

## Setup

Unzip into the repository root. It replaces `CLAUDE.md` and adds this file. Commit it unchanged, then commit after each numbered section.

## Answers to the audit's findings

| Step | Decision |
|---|---|
| 3S2 | Section 2: the option is written "3 × n". |
| 3B, 7R5 | Section 1, the definitions; section 3, the reorder so the parts are identified before the rule is written. |
| 3B·f, 7B·f | Section 4: both removed. |
| 7B | **Keep as built**, before the sticks rule. Learners have built Figure 4 and been told each new square adds 3, so they can reason to Figure 10. Marc's move 4 runs when they answer 40. |
| 8A | Section 5: one worked substitution first. |
| 10E | Section 6: a sentence frame. |
| 9B (thin) | Section 7: the method stated first. |
| 4A | Section 3: removed. The tapping steps now carry its point. |

## The new order: 16 screens

| Learner screen | ID | Title |
|---|---|---|
| 1 | 2 | What stays and what grows? |
| 2 | 3 (3T) | The skip-count table |
| 3 | 3 (3S) | Skip count for any figure |
| 4 | 3 (3R, 3A) | **Figure 0** (new title) |
| 5 | 4 (4T1, 4T2) | Why does Figure 1 have 5 tiles if the constant is 2? |
| 6 | 3 (3B) | **The rule** (new screen) |
| 7 | 5 | Which figure has 23 tiles? |
| 8 | 6 | Does one check prove it? |
| 9 | 7 | Shared edges |
| 10 | 7R | The rule for the sticks |
| 11 | 8 | Are these two rules the same? |
| 12 | 9 | Forward and backward |
| 13 | 10 | Three students, three rules |
| 14 | 10P | Which rule fits? |
| 15 | 15 | Exit ticket |
| 16 | 16 | What you showed on your own |

Parts are unchanged: Screens 1 to 8 are Part 1, 9 to 12 Part 2, 13 Part 3, 14 Part 4, and 15 and 16 Part 5. "Screen k of 16."

---

## 1. Define the rule and its letters

- **Before 3B,** a new line above "Type the rule.": **"A rule gives the total for any figure. T is the total number of tiles and n is the figure number. The coefficient multiplies n; the constant is added."**
- **Before 7R5,** a new line above "Type the rule.": **"S is the total number of sticks."**

## 2. 3S2: write the option as 3 × n

- In 3S2's options, "3n" becomes **"3 × n"**. Keep the order and the other three options.
- Its correct confirmation becomes: **"Right: 3 × n, written 3n: three times the figure number. Figure 5 is 3 × 5 = 15."**
- The line before the question ("Let n stand for the figure number. For Figure 5, n = 5.") stays.

## 3. Reorder: Figure 0, then the parts, then the rule

Split today's Screen 4, "Figure 0, and the rule", in two, with Screen 5 between them.

**Screen 4, "Figure 0":** the figures and the table captioned "From the last screen", as now. Steps 3R, 3A1 and 3A2, unchanged.
- **New Why?:** "Every figure has 2 more tiles than the skip count by 3. At Figure 0 there are no groups, so only those 2 fixed tiles are left. That's the constant."

**Screen 5, "Why does Figure 1 have 5 tiles if the constant is 2?":**
- **Remove** the small Figure 1 at the top of the screen. 4T1 and 4T2 keep their own large Figure 1.
- **Remove 4A,** the three-sentence choice, and its responses.
- 4T1 and 4T2 stay as they are. The Why? stays and now appears after 4T2.

**Screen 6, "The rule" (new):**
- **Shows:** Figures 1 to 4 and the completed table (Figure n, Tiles, Skip count by 3, How many more), captioned **"Your table"**.
- **Then:** the section 1 definition line, then 3B, unchanged except section 4's answer card.
- **Why?:** the existing Why? from today's Screen 4, with its table, unchanged.

## 4. Remove both follow-up items, and show the reasoning on 3B's answer card

- **Remove 3B·f and 7B·f** completely, with their responses and tests.
- **3B's answer card** after a second miss becomes: **"The skip count is 3n, and every figure has 2 more: T = 3n + 2."** The learner still types the rule to continue.

## 5. 8A: one worked substitution first

Above 8A's table, a new line: **"For n = 2: 4 + 3(2 − 1) = 4 + 3 × 1 = 7."**

In the table, the box for S = 4 + 3(n − 1) at n = 2 is filled with 7 and can't be edited. The learner types the other five. Responses unchanged.

## 6. 10E: a sentence frame

Above 10E's text box, show the frame: **"Arun's 4 is already ___. Then he adds ___ for every square, so ___."**

The learner writes in the box, then sees the model answer as now. Nothing is scored.

## 7. 9B: state the method first

Above 9B ("Which figure uses exactly 100 sticks?"), a new line: **"To go backwards, take away the constant, then divide by the coefficient."**

---

## Testing

Proportionate, as in `CLAUDE.md`:

- Check the new lines in sections 1, 5, 6 and 7, and 3S2's option and confirmation.
- Check the reorder: Screens 4, 5 and 6 in that order, with their titles; Screen 4's new Why?; Screen 6's table caption.
- Check that Screen 5 has no small Figure 1 and no 4A.
- Check that 3B·f and 7B·f are gone, and 3B's new answer card.
- Check that 8A's prefilled box can't be edited and isn't counted as a learner answer.
- Check "Screen k of 16."
- Rerun the full suite in Chromium and WebKit, with the 16 px margin at 360 and 390 px.
- Screenshot all 16 screens at phone and desktop size.

## After building

Rerun your gradual-release audit on all 16 screens, the same way: correct first time, never opening Why?. Report anything that still fails, by step ID. Describe what's missing; don't fix it.

## Report

Write `handback/round-8.md` in the usual shape, with the audit result, the new commit hash and the SHA-256 of `lesson/index.html`. Don't deploy.
