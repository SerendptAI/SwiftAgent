---
project: swift-agents-howto-create-widget
title: How to create widget
aspect: "16:9"
resolution: 1920x1080
duration_seconds: 170
narration: none
blueprint: cursor-ui-demo (static-stage state tour)
structure: host + seven act sub-compositions
---

# How to create widget — storyboard

The complete path, registration to a live widget. Seven acts, each its own
sub-composition under `compositions/`, cut between rather than panned across.
The cursor is the only actor; the UI answers it.

Every label, placeholder and message is the **real** string from the component
that renders it — `signup/page.tsx`, `login/page.tsx`, `company-setup/*`,
`overview/widget-card.tsx`, `settings/api-keys/page.tsx`.

A persistent step chip (`01/07 … 07/07`) sits top-left for the whole run.
Seven full-screen chapter cards would have spent fifteen seconds saying
nothing; the chip tells the viewer where they are without costing a beat.

---

## Title card · 0:00–0:04

Amber logo tile, **HOW TO CREATE WIDGET**, and the promise the rest of the
video keeps: `FROM REGISTRATION TO LIVE — THE WHOLE PATH`.

## Act 1 — Register your company · 0:04–0:32 (`act-register`)

The registration form, then the approval wait.

- Whole form once, for orientation.
- Company Name → `Chowdeck`; Company Email → `ops@chowdeck.com`.
- The description textarea, then the customer-size select opened on its real
  five options, picking `10,001 – 100,000`. The select gets its own pan — it
  opens 310px below its field and would otherwise be sliced by the stage clip.
- `REGISTER` pressed; the offset shadow compresses and springs back.
- **Thank you for registering! / We'll reach out soon!**

> Registration is an application, not instant access. Same beat, same reason as
> `../swift-agents-howto-register`.

## Act 2 — Log in · 0:32–0:52 (`act-login`)

- `WELCOME BACK` / **Log in to your account**; email typed, `SIGN IN` pressed.
- **Check your email** — six boxes fill one digit at a time; the sixth submits.
- `No code? Check your spam or junk folder` — the question support actually gets.
- The dashboard shell resolves. **You're in.**

## Act 3 — Set up your company · 0:52–1:28 (`act-setup`)

The onboarding wizard, which sits between logging in and having a widget.

- **Let's set up your company** — website typed, `ANALYZE MY SITE` pressed, the
  button going to `Analyzing your website…`.
- **Company Information**, already prefilled by that scrape, under the wizard's
  own step rail and progress bar. A chip names why the fields are full:
  `PREFILLED FROM YOUR WEBSITE — CHECK IT OVER`.
- **Company Identity** — what you do, the problem you solve, brand tone,
  support emails.
- The hand-off modal: *We'd love to get to know your organization better*,
  `USUALLY TAKES 5 MINUTES`, `START QUESTIONER`.

Only steps 1 and 2 of the rail's five are reachable today; the rail still shows
all five, because that is what the wizard renders.

## Act 4 — Unlock with a plan · 1:28–1:44 (`act-plan`)

**The step this video exists to add.** The widget card renders with the snippet
blurred, the Copy button dimmed, and a lock over the panel reading
*Subscribe to a plan to unlock your widget code*.

- Cursor presses `UPGRADE`; the label goes to `Opening checkout…`.
- The lock lifts, the blur clears, Copy comes back to full strength.

Checkout is the payment provider's screen, not ours, so it is named and skipped
rather than reconstructed. No prices appear anywhere — plans and pricing come
from the backend and are not in this repo to read.

## Act 5 — Copy your snippet · 1:44–2:14 (`act-snippet`)

- The card whole: mode pill, `WIDGET SNIPPET` panel, masked id, Copy.
- The mode dropdown on its two real options, `Widget Mode` / `Button Mode`.
- `Reveal` — the bullets resolve into the company id a character at a time, and
  the control flips to `Hide`.
- `Copy` → `Copied!`

## Act 6 — Generate an API key · 2:14–2:28 (`act-key`)

The snippet ships with `YOUR_API_KEY` as a literal placeholder, and a widget
pasted with it never authenticates. This is the step people skip.

- `Key Label` holds its real default, `Widget Key`; the green `Generate` is
  pressed.
- The one-time reveal drops in above and pushes the row down — the app's own
  reflow — carrying the real warning: *Copy this key now — you won't be able to
  see it again.*

## Act 7 — Paste it into your site · 2:28–2:50 (`act-install`)

- The copied tag pastes into `index.html` above `</body>`, flashing amber.
- `YOUR_API_KEY` highlights, then swaps for the redacted key.
- The page resolves and the chat launcher fades up bottom-right, where the
  widget actually mounts.

---

## Notes for review

Nothing is captured from a live session. The dashboard needs an authenticated
company on an active plan; `Generate` writes a real, non-reversible API key; and
submitting the registration form writes a record to a staging endpoint that is
rate-limited to 5/hour per IP. Every screen is rebuilt in HTML from the
component that renders it.

The company id is synthetic and the generated key is redacted — this video's own
Act 5 unmasks that id on screen, so a real one would ship a live credential to
everyone who opens the help drawer.
