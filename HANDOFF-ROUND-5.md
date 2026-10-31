# Handoff: round 5, the lesson's title

One change. Marc has renamed the lesson from the working title "Seeing the Rule" to:

**Growing Patterns: Finding the Rule**

This is learner-facing text approved by Marc. This file takes precedence over everything before it (see `CLAUDE.md`).

## Setup

Unzip into the repository root. It replaces `CLAUDE.md` and adds this file. Commit it unchanged.

## The change

1. In `lesson/index.html`, replace "Seeing the Rule" with "Growing Patterns: Finding the Rule" in both places: the page's `<title>` and the lesson title in the data block, which the header shows on every screen.
2. Update `README.md` to the new title.
3. Change nothing else. The file name, the screens, the step IDs and every other piece of text stay as they are. Leave the old title in earlier docs, handoffs and reports, because those are records.

## Testing

- Add a check that the header and the browser tab both read "Growing Patterns: Finding the Rule" and that "Seeing the Rule" appears nowhere in `lesson/index.html`.
- Confirm the header still fits on one line at 360 px and 390 px with the 16 px margin, since the new title is longer. If it doesn't fit, stop and report it; don't shorten the title.
- Rerun the full suite in Chromium and WebKit.

## Report

- Write `handback/round-5.md` in the usual shape.
- Include the new commit hash and the SHA-256 of `lesson/index.html`, because Marc will deploy that exact file.
- Don't deploy.
