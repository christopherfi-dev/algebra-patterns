# Handoff: round 9, from Marc's play-through

Marc played the deployed round 8 lesson and found two places where the order or the support was wrong:

- **Screen 8:** a learner who answers "Yes" after one check gets a weak response, and the next check tells them the tile counts instead of having them count.
- **Screen 9:** asks for Figure 10's sticks before the reasoning that gets there, which is on Screen 10.

Round 9 fixes both, following his recorded moves 3 and 4 in `docs/Marc-Teaching-Moves.md`.

All learner-facing text below is Marc's: he approved these changes, and sending this file approves the wording.

This file takes precedence over everything before it (see `CLAUDE.md`). Step IDs are the ones you already use; new steps get the IDs given here. The lesson stays at 16 screens.

## Setup

Unzip into the repository root. It replaces `CLAUDE.md` and adds this file. Commit it unchanged, then commit after each numbered section.

---

## 1. Screen 8 (ID 6), "Does one check prove it?"

**6A2, the "Yes" response,** becomes: **"We've only checked Figure 1. One figure can't tell us for sure, so the answer is 'Maybe', or 'No' if you already know the rule. Let's check another figure."** "Maybe" and "No" stay correct, with their texts unchanged.

**Replace 6B** (5n at Figure 0 and Figure 10, with the counts shown) with three steps on **Figure 3**. Show Figure 3 of the tile pattern in the two colours: 2 fixed tiles plus 3 groups of 3, 11 tiles. Don't show its count; the learner counts.

**6B1. "What does T = 5n give for Figure 3?"** (prefix T =)

| Answer | Response |
|---|---|
| 15 (correct) | Right: 5 × 3 = 15. |
| 11 | That's how many tiles Figure 3 has. What does the rule T = 5n give? |
| 8 | 5n means 5 × n. |
| Hint | Replace n with 3 in 5n. |

**6B2. "Now count the tiles in Figure 3."**

| Answer | Response |
|---|---|
| 11 (correct) | Right: 11 tiles. |
| 15 | 15 is what the rule gives. Count the tiles in the picture. |
| 9 | Count every tile, both colours. |
| Hint | Count the fixed tiles, then each group of 3. |

**6B3. "Is that the same as what the rule gave?"** (choice: Yes / No)

| Option | Response |
|---|---|
| No (correct) | Right. 5n gives 15, but Figure 3 has 11 tiles. The rule is wrong. |
| Yes | The rule gave 15, but you counted 11. |

6C (3n + 2 at Figures 0, 1 and 10), 6D and the Why? stay unchanged.

## 2. Screen 9 (ID 7), "Shared edges": the reasoning before Figure 10

**7A2's confirmation** (Figure 4 = 13) becomes just **"Right: 13 sticks."** Its current text gives away the next step's answer.

Then two new steps, **7S1 and 7S2**, before 7B.

**7S1. "How many sticks do we add to make the next figure?"**

| Answer | Response |
|---|---|
| 3 (correct) | Right. Each new square adds 3 new sticks. That 3 is the coefficient. |
| 4 | The new square shares one stick with the square before. It adds only 3. |
| Hint | Count the sticks in Figure 1, then in Figure 2. |

**7S2. "Every figure adds 3 sticks, Figure 1 too. Tap those 3 sticks to take them off Figure 1. How many sticks are left?"**

- Show Figure 1, uncoloured as on this screen. The learner taps its top, right and bottom sticks; each one tapped is taken off. The left stick can't be taken off: tapping it shows **"That stick stays. It's the one every figure starts with."** When the three are off, the learner types how many sticks are left.
- Every tap also works by keyboard, as elsewhere.

| Answer | Response |
|---|---|
| 1 (correct) | Right: 1 stick. That's what's there before any squares are added. |
| 0 | Take off only the 3 sticks a square adds. One stick stays. |
| 4 | Take off the 3 added sticks first. |
| Hint | Figure 1 has 4 sticks. Take away the 3 a square adds. |

**7B** ("How many sticks does Figure 10 have?") follows, unchanged, including its confirmation "1 + 3 × 10 = 31." and Marc's 40-sticks route.

The screen's Why? stays unchanged.

## 3. Screen 10 (ID 7R), "The rule for the sticks"

**Remove 7R2** ("How many more sticks does each new figure add?") and its responses. The learner answered it one screen earlier, in 7S1. The table then builds Sticks, then Skip count by 3, then How many more. Everything else on the screen stays: 7R1, 7R3, 7R4, 8C1, 8C2 ("That's the constant"), the definition line and 7R5.

---

## Testing

Proportionate, as in `CLAUDE.md`:

- **6A2:** the new "Yes" response.
- **6B1, 6B2, 6B3:** every response and hint. Figure 3 is shown without its count. "No" is correct.
- **7A2:** the new confirmation.
- **7S1:** every response.
- **7S2:**
  - the three sticks come off by tap and by keyboard;
  - the left stick can't be taken off, and shows its message;
  - every typed answer gets its response.
- **7R2** is gone, and Screen 10's table still builds in order.
- Rerun the full suite in Chromium and WebKit, with the 16 px margin at 360 and 390 px.
- Rerun your gradual-release audit on Screens 8, 9 and 10.

## Report

Write `handback/round-9.md` in the usual shape, with the new commit hash and the SHA-256 of `lesson/index.html`. Don't deploy.
