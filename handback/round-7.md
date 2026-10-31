# Handback to the master thread: round 7

**From:** Claude Code, working in `christopherfi-dev/algebra-patterns`, branch `master`
**Date:** 31 October 2026
**Full report:** `REPORT.md` in the repo. The audit is in `audit/gradual-release-audit.md`. This handback is the short version.

## Status

- **Done:** all seven sections of `HANDOFF-ROUND-7.md`, and the method audit it asks for.
- **The lesson:** now **15 screens**, "Screen k of 15". New: Screen 9, "The rule for the sticks", and Screen 13, "Which rule fits?" (new Part 4, "Practise"). The exit ticket and self-check are Part 5.
- **Two gaps in the handoff, both answered by Marc** (details below): when 4T1's hint shows, and how 5M handles going past 23.
- **Not deployed.**
- **Commits, in order:**
  1. `20518f2`: round 7 package, unchanged;
  2. `4d79ea0`: section 1, four explanations on the required path;
  3. `34db983`: section 2, 3T0;
  4. `e4a9b0b`: section 3, 4T1 and 4T2;
  5. `fe3b31f`: section 4, 5M;
  6. `3c46476`: sections 5 and 6, one commit because they share the move of 8C1 and 8C2;
  7. `5f23c07`: section 7, the practice screen;
  8. `af8d67b`: tests and screenshots;
  9. this report, the audit and the handback.

## The file to deploy

| | |
|---|---|
| File | `lesson/index.html` |
| Commit | `5f23c07bba64e40dd474774393bd45dbbfa6cb77` |
| SHA-256 | `25f890396d98714b144efd11b21564ed74e31e388cd0d09ce518d6234260af96` |

`5f23c07` is the last commit that changes the lesson. The file is identical at the tip of `master`.

## Test results

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 4,321 | 0 |
| WebKit 26.6 (Safari's engine) | 3,585 | 0 |

Everything on the handoff's test list is covered, in both engines:

- **New steps:** every correct answer, predicted wrong answer and hint, with each Answer card, on 3T0, 4T1, 4T2, 5M, 7R1–7R5, 10P1 and 10P2.
- **Changed lines:** the four from section 1, the new 8C2 and 5A confirmations, and Screen 10's new intro.
- **The move:** 8C1 and 8C2 are on Screen 9, and Screen 10 has only 8A.
- **5M:** the total goes 2, 5, … 23 by tap, mouse and touch drag. There's no response and no 5A before 23, and it can't finish anywhere else.
- **Structure:** "Screen k of 15", Part 4 "Practise", and the exit ticket in Part 5.
- **The full suite was rerun,** including the 16 px margin at 360 and 390 px.
- **Screenshots:** all 15 screens at 390 × 844 and 1280 × 800, in `test-results/screenshots/`; WebKit captures in `webkit/`.
- **Not tested:** Safari on a real iPhone or Mac, Firefox, screen readers, and widths below 360 px.

## What changed, keyed by step ID

| Step | Change |
|---|---|
| 2B, 3S2, 3A2 | The four section 1 lines: the coefficient named, n introduced, 3n explained, the constant named. |
| 3T0 (new) | Count the tiles into the table, all four typed. |
| 4T1, 4T2 (new) | Tap the constant's tiles, then the coefficient's, in Figure 1. |
| 5M (new), 5A | Build up to 23 from the 2 fixed tiles; 5A's new confirmation. |
| Screen 9: 7R1–7R5 (new), 8C1, 8C2 | The sticks table built row by row, Figure 0, and the rule S = 3n + 1. 8C1 and 8C2 moved here with their IDs; 8C2's confirmation is new. |
| Screen 10: 8A | New intro; the only step now. |
| Screen 13: 10P1, 10P2 (new) | Choose a rule, then write one, for two new patterns. Every number is computed from the patterns. |

| Learner screen | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ID | 2 | 3 (3T) | 3 (3S) | 3 (3R, 3A, 3B) | 4 | 5 | 6 | 7 | 7R | 8 | 9 | 10 | 10P | 15 | 16 |

## Decided with Marc this round

| Step | Question | Marc's answer |
|---|---|---|
| 4T1, 4T2 | Every selection on 4T1 already has its own response, so its hint could never show. | Show the hint when Check is pressed with nothing tapped. |
| 5M | The handoff didn't say how to take a group away. Building it showed a learner can never pass 23, because groups of 3 from 2 always land on it. | Stop at 23. Leave out the "more than 23" response and any way to take a group away. |

## Decisions I made that Marc may want to check

| Where | As built |
|---|---|
| 4T1, 4T2 | **Each step draws its own Figure 1 at double size, so every tile is a 44 px target.** The screen's original small Figure 1 stays at the top, so Screen 5 shows Figure 1 three times. Tapping a tile selects it, and tapping again deselects it. After a second miss, the Answer card marks the right tiles instead of showing text. |
| Screen 9 | On phones, the stick figures are drawn at 70%, as on the 8C1 slider, so they take two rows. |
| Drop targets | The browser's tap highlight stuck on the finished 5M figure as a blue wash, so it's turned off on drop targets. The dashed outline remains the tap feedback. |

## The method audit: findings for Marc, by step ID

I walked all 15 screens as a learner who is right first time and never opens Why?. Hints, wrong-answer responses, Answer cards and Why? don't count as explaining first. Nothing has been fixed, and no learner text is proposed.

| Step | What's missing |
|---|---|
| 3S2 | That 3n means 3 × n is said only in its confirmation, after the choice. |
| 3B, 7R5 | What a rule is, and what T and S stand for, are never said. Both rules are written before the identifying steps (4T1, 4T2) and before choosing a rule (10P1), the reverse of the principle's order. |
| 3B·f | After a second miss on 3B, the learner gets a new pattern with less support than 3B had. |
| 7B | Figure 10's sticks are asked before the structure (Figure 1 as 1 + 3) is explained. Marc's move runs only after an answer of 40: try first, then taught. |
| 7B·f | After a second miss on 7B: triangles, whose shared sides are explained only in wrong-answer responses. |
| 8A | Bracket notation, and "inside the bracket first", appear only in its wrong-answer response. |
| 10E | The first written explanation, done alone, with no supported practice of explaining before it. |

**Thin passes:**
- **9B and exit item 4:** solving for the figure. The method appears on the required path once, in 5A's confirmation.
- **"The coefficient multiplies n":** only implied on the required path.

Every exit item was practised with support beforehand. Writing a rule, for example, was practised three times: 3B, 7R5 and 10P2.

## Open questions

The seven audit findings above. Each needs Marc's decision, and new wording where he wants a change.

## Suggestions for the next handoff

- **Take the audit findings in order of how early they come.** 3S2 and 3B come first and shape everything after them.
- **For 3B·f and 7B·f,** decide what a learner who misses twice should get. The principle points to more support, not a new and harder example.
- **For 7B,** say whether Marc's move 4 should stay as a response to an answer of 40, or whether the structure should be shown first.
- **Real devices:** Safari on an iPhone, and a 360 px Android phone. Screen 5's tap targets and 5M's drag are the new things to try by hand.
- **Still open from round 5:** the file table in `README.md` lists rounds 4 and 3 as the latest handoffs. I updated only its screen count, to 15.
