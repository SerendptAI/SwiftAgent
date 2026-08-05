---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Logging in to Swift Agents takes one email and one six-digit code."
angle: step-by-step task walkthrough
audience: new Swift Agents customers who are already approved
destination: in-app help drawer (DevelopmentResourcesDrawer)
aspect: "16:9"
length_seconds: 45
narration: none
captions: on-screen, caption-led
language: en
---

## Intent

A how-to tutorial, **not** a promo. It plays in the dashboard's Development
Resources drawer, where someone opens it because they are stuck. Clarity beats
energy: no hook, no punchline, no jokes.

Show-it-as-is: feature Swift Agents' own screens as the video's assets.

## What to show

`http://localhost:3000/en/login` — the OTP login flow, in order:

1. Company email field
2. Sign in pressed
3. Six-digit code screen
4. The check-spam warning (the single most common support question on this flow)
5. Code entered
6. Dashboard lands

## Customizations

- **Oversized cursor** — a house-style enlarged pointer performs every click and
  keystroke. At drawer playback size a real-size cursor is invisible and the
  viewer loses track of where the action is.
- **Publish to a stable link** — the drawer has no video source today; the
  published URL is what gets wired into `VIDEOS` in
  `src/components/dashboard/overview/development-resources-drawer.tsx`.
- **Design spec derived from the app**, not a shipped preset. Help videos should
  look like the product they explain.

## Notes

- **Legibility governs framing.** Silent + drawer-sized playback means all
  instruction lives in text. Scale to the active field each step; full-page
  framing only for the single orientation beat.
- **Screens are reconstructed in HTML** from the real components, not captured
  post-submit. Capturing the OTP state would require submitting a real email to
  the staging API and sending a live OTP message on every take. Copy comes from
  `messages/en.json` (`login.*`) so the video cannot drift from the UI.
- Blueprint: `cursor-ui-demo`, static-stage state-tour variant — locked frame,
  click-triggered state changes.
