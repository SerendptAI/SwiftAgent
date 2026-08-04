---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Registering means telling Swift Agents about your company, then waiting for approval."
angle: step-by-step task walkthrough
audience: prospective Swift Agents customers who have not registered yet
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

`http://localhost:3000/en/signup` — the company registration form, in order:

1. Company Name
2. Company Email
3. What does your company do
4. Estimated / average customer size (a select, not a text field)
5. Register pressed
6. "Thank you for registering — we'll reach out soon" approval-pending state

The video must set the expectation that registration is an **application**, not
instant access. The approval wait is the thing users get confused about.

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
  post-submit. Submitting the real form writes a registration record to the
  staging API and the endpoint is rate-limited to 5 requests/hour per IP. Copy
  and the customer-size options come from
  `src/app/[locale]/signup/page.tsx` so the video cannot drift from the UI.
- Blueprint: `cursor-ui-demo`, static-stage state-tour variant — locked frame,
  click-triggered state changes.
- Shares `frame.md` with `../swift-agents-howto-login`; derive once, copy.
