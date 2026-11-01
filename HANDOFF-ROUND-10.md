# Handoff: round 10, one fix on Screen 8 and your three questions

Small. One teaching gap on Screen 8 that round 9 created, one changed response on Screen 9, and two documents. The lesson stays at 16 screens.

All learner-facing text below is Marc's: he approved these changes, and sending this file approves the wording.

This file takes precedence over everything before it (see `CLAUDE.md`).

## Setup

Unzip into the repository root. It replaces `CLAUDE.md` and `docs/Marc-Teaching-Moves.md`, and adds this file. Commit it unchanged, then commit after each numbered section.

---

## 1. Screen 8 (ID 6): test 3n + 2 against counts the learner has

Round 9 replaced the old 6B, whose pictures showed Figure 0 with 2 tiles and Figure 10 with 32. 6C still tests 3n + 2 at Figures 0, 1 and 10 and confirms "It works for all three". But the learner never sees that Figure 10 has 32 tiles, so the check has nothing to compare against.

Change 6C to Figures 0, 1 and 3. The learner already has those counts: 2 at Figure 0 (Screen 4), 5 at Figure 1 (on this screen) and 11 at Figure 3 (counted in 6B2).

- **Prompt:** "What does T = 3n + 2 give for Figures 0, 1 and 3?" Correct: 2, 5 and 11, each computed from the rule.
- **Correct confirmation:** **"It matches all three counts: 2 tiles at Figure 0, 5 at Figure 1, and the 11 you counted at Figure 3."**
- **The slip response** stays: "Substitute again: 3 × n, then add 2."
- **In the screen's Why?,** replace only this sentence: "A figure far away, like Figure 10, checks the coefficient, because a wrong coefficient drifts further off with every figure."
  With: **"A figure further along, like Figure 3, checks the coefficient: 5n was off by 4 there, and a wrong coefficient drifts further off with every figure."**

Everything else on Screen 8 stays.

## 2. Screen 9 (ID 7), 7S2: the "4" response

The answer box appears only after the three sticks are off, so the current "4" response ("Take off the 3 added sticks first.") doesn't fit. Change it to: **"You took 3 off. Count the sticks that are left."**

## 3. Your open question: choosing a rule after the guided rules

**Yes, intended.** Writing the rule at 3B and 7R5 is guided rule-building, "we do". Choosing a rule (10P1) comes before writing one on one's own: 10P2 and the exit ticket.

The replaced `docs/Marc-Teaching-Moves.md` now says so in the principle: "Only then do they write a rule **on their own**. Building a rule step by step with the lesson's support is part of 'we do', not writing on their own."

`CLAUDE.md`'s method section adds two audit rules:

- a step counts as prepared if what the required path has taught gives the learner a valid way to reach it, not necessarily the method the lesson uses later;
- guided rule-building is "we do".

Apply both when you rerun the audit, so this stops being raised.

## 4. README

Update the file table in `README.md` so it lists the current handoffs and precedence. `HANDOFF-ROUND-10.md` comes first. Change nothing else in the README.

---

## Testing

- **6C:** the new prompt, its correct answers (2, 5, 11), the new confirmation, the slip response, and the new Why? sentence.
- **7S2:** the new "4" response.
- Rerun the full suite in Chromium and WebKit, with the 16 px margin at 360 and 390 px.
- Rerun the gradual-release audit on all 16 screens with the two new audit rules, and report anything that still fails.

## Report

Write `handback/round-10.md` in the usual shape, with the new commit hash and the SHA-256 of `lesson/index.html`. Don't deploy.
