---
project: swift-agents-howto-login
title: How to log in
aspect: "16:9"
resolution: 1920x1080
duration_seconds: 47
narration: none
blueprint: cursor-ui-demo (static-stage state tour)
---

# How to log in — storyboard

Locked frame throughout. The cursor is the only actor; the UI answers it.
Captions sit in a fixed lower band. All copy below is the **real** string from
`messages/en.json` → `login.*` or the actual component.

---

## Scene 0 — Title card · 0:00–0:03 (3.0s)

- `--paper` field. Amber logo tile (`#F2B035`) scales up from 0.9, settles.
- **HOW TO LOG IN** — Greed Narrow, uppercase, centred under the tile.
- DM Mono sub-label: `SWIFT AGENTS`
- Hard cut out.

## Scene 1 — Orientation · 0:03–0:08 (5.0s)

The one full-page beat. The real login screen assembles centred: logo,
`WELCOME BACK`, `Log in to your account`, the `COMPANY EMAIL` field.

> **Caption:** `THE LOGIN PAGE`

Purpose is recognition — the viewer should match this to what's on their own
screen. After this, we never show the whole page again.

## Scene 2 — Step 1, your email · 0:08–0:18 (10.0s)

- UI scales up so the email field fills the middle third. Field is now large.
- Cursor enters from lower-right, travels to the field, clicks.
- Types `ada@chowdeck.com` at 45ms/char, caret blinking.
- **Real behaviour:** the `SIGN IN` button only exists once the field is
  non-empty (`email.length > 0`), so it springs in as typing finishes.
- Cursor travels to `SIGN IN`, clicks. Button compresses 0.88 for 90ms.

> **Caption:** `STEP 1 — ENTER YOUR COMPANY EMAIL`

## Scene 3 — Step 2, the code is sent · 0:18–0:26 (8.0s)

- State swap: the email field is replaced by six empty code boxes, springing in
  left-to-right, 60ms apart. Cursor rests off to the side, still.

> **Caption:** `STEP 2 — WE EMAIL YOU A 6-DIGIT CODE`

## Scene 4 — Check your spam · 0:26–0:34 (8.0s)

The support beat. This is the single most common question on this flow, so it
gets its own scene rather than a passing line.

- The app's real spam notice fades up beneath the boxes:
  *"We've emailed you a code. Can't find it? Check your spam or junk folder."*
- An amber `--focus` ring draws around it. Nothing else moves for 3s.

> **Caption:** `CAN'T SEE IT? CHECK SPAM`

## Scene 5 — Step 3, enter the code · 0:34–0:42 (8.0s)

- Cursor clicks the first box. Digits land one per box, 180ms apart: `4 8 2 9 1 5`.
- Real behaviour: the form auto-submits on the sixth digit — no button press.
- `Signing in...` replaces the helper text.

> **Caption:** `STEP 3 — TYPE THE CODE`

## Scene 6 — You're in · 0:42–0:47 (5.0s)

- Boxes collapse into a single amber check mark.
- **YOU'RE IN** — Greed Narrow.
- Logo tile returns bottom-centre as the brand end beat.

> **Caption:** *(none — the display line carries it)*

---

## Open question for review

**Scene 6 does not show the real dashboard.** Landing on it would need a
captured logged-in session, which I don't have and can't fake responsibly — a
reconstructed dashboard would be my invention, not your product. The scene ends
on the confirmed-login state instead. If you want the true dashboard landing,
I need a capture from an authenticated session.
