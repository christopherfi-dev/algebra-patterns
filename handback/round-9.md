# Handback to the master thread: round 9

**From:** Claude Code, working in `christopherfi-dev/algebra-patterns`, branch `master`
**Date:** 1 November 2026
**Full report:** `REPORT.md` in the repo. The audit is in `audit/gradual-release-audit.md`. This handback is the short version.

## Status

- **Done:** all three sections of `HANDOFF-ROUND-9.md`, and the audit rerun on Screens 8, 9 and 10.
- **The lesson:** still 16 screens, "Screen k of 16".
- **No conflicts.** Nothing needed asking this round.
- **Not deployed.**
- **Commits, in order:**
  1. `68efb65`: round 9 package, unchanged;
  2. `043802e`: section 1, Screen 8;
  3. `e49e50f`: section 2, Screen 9;
  4. `9669271`: section 3, Screen 10;
  5. `207ae10`: tests and screenshots;
  6. this report, the audit and the handback.

## The file to deploy

| | |
|---|---|
| File | `lesson/index.html` |
| Commit | `9669271c4d79a77e6b47940781be4703406112db` |
| SHA-256 | `451d872e2c0f6431007cba9368c52ea8f63a0f10c9466b605176d3703684cb5f` |

`9669271` is the last commit that changes the lesson. The file is identical at the tip of `master`.

## Test results

| Engine | Checks | Failed |
|---|---|---|
| Chromium 153 | 4,776 | 0 |
| WebKit 26.6 (Safari's engine) | 3,957 | 0 |

Everything on the handoff's test list is covered, in both engines:

- **6A2:** the new "Yes" response.
- **6B1, 6B2, 6B3:** every response and hint. Figure 3 is shown in the two colours with no count, and "No" is right.
- **7A2:** the new confirmation.
- **7S1:** every response.
- **7S2:**
  - each stick is a target of at least 44 px;
  - the left stick stays, with its message;
  - the other three come off by tap and by keyboard (Enter and Space);
  - the box appears only after that, and every typed answer gets its response.
- **7R2** is gone, and Screen 10's table still builds Sticks, Skip count by 3, How many more.
- **The full suite was rerun,** including the 16 px margin at 360 and 390 px. The 40-sticks and second-miss runs now go through 7S1 and 7S2 before 7B.
- **Screenshots:** all 16 screens at 390 × 844 and 1280 × 800, in `test-results/screenshots/`; WebKit captures in `webkit/`.
- **One test timing allowance:** in Chromium's touch-drag run, the synthetic drags that build Figure 4 make Chromium ignore a tap made right after. That run waits 1.5 s before 7S2's first tap. On a real phone the learner's tap comes much later.
- **Not tested:** Safari on a real iPhone or Mac, Firefox, screen readers, and widths below 360 px.

## What changed, keyed by step ID

| Step | Change |
|---|---|
| 6A2 | The new "Yes" response. "Maybe" and "No" are unchanged. |
| 6B → 6B1, 6B2, 6B3 | On Figure 3, drawn without its count: what 5n gives (15), count the tiles (11), do they match (No). The old 6B and its picture boxes with hidden counts are gone. |
| 7A2 | Confirmation: "Right: 13 sticks." |
| 7S1 (new) | "How many sticks do we add to make the next figure?" 3, the coefficient. |
| 7S2 (new) | Tap the 3 sticks a square adds off Figure 1 (the left stick stays), then type what's left: 1. |
| 7R2 | Removed; 7S1 now asks it, one screen earlier. |

## Decisions I made that Marc may want to check

| Where | As built |
|---|---|
| 7S2 | **The box appears once the three sticks are off,** as the handoff says. A learner who types 4 has therefore already taken them off, so the "4" response, "Take off the 3 added sticks first.", reads as a reminder of what they just did, not an instruction. If you'd rather it read as an instruction, the box would have to appear from the start. |
| 7S2 | **Figure 1 is drawn at the scale of Screen 9's build.** A tapped stick disappears. Tapping the left stick shows its message, and the stick flashes as a stick dropped on a taken edge does. |
| Screen 8 | Figure 3 appears with 6B1, the first step that needs it. |

## The audit, rerun on Screens 8, 9 and 10

**Every step passes, including 7B,** which round 8 still flagged. What it needs now comes just before it, on the required path: each figure adds 3 (7S1), and 1 stick is there before any squares (7S2). The other 13 screens didn't change, so their round 8 result stands.

## Open questions

One, carried from round 8, which round 9 didn't address:
- Choosing a rule (10P1, Screen 14) still comes after both supported rules (3B, 7R5).
- The principle lists choosing before writing.
- It isn't counted as a failure, because each of those rules has its own scaffolding.

Is that order intended? Yes or no.

## Suggestions for the next handoff

- **Answer the open question** above.
- **Say whether 7S2's "4" response is fine as it reads** (decisions table).
- **Real devices:** Safari on an iPhone and a 360 px Android phone. The tap targets on Screens 5 and 9, 5M's drag, and the slider on Screen 6 are the things to try by hand.
- **Still open from round 5:** the file table in `README.md` lists rounds 4 and 3 as the latest handoffs.
