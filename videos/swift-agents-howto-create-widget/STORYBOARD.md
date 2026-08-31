---
project: swift-agents-howto-create-widget
title: How to create widget
aspect: "16:9"
resolution: 1920x1080
duration_seconds: 86
narration: none
blueprint: cursor-ui-demo (static-stage state tour)
structure: host + four act sub-compositions
---

# How to create widget — storyboard

Dashboard to a live widget. Four acts, each its own sub-composition under
`compositions/`, cut between rather than panned across. The cursor is the only
actor; the UI answers it.

**Scope note.** This drawer only opens inside the authenticated dashboard, so
its viewer has already registered, logged in and finished onboarding. Teaching
those steps here would be teaching things they have provably done — and each
already has, or will have, its own card. The video starts where the viewer is.

Every label, placeholder and message is the **real** string from the component
that renders it — `overview/widget-card.tsx` and
`settings/api-keys/page.tsx`.

A persistent step chip (`01/04 … 04/04`) sits top-left for the whole run.
Full-screen chapter cards would have spent seconds saying nothing; the chip
tells the viewer where they are without costing a beat.

---

## Title card · 0:00–0:04

Amber logo tile, **HOW TO CREATE WIDGET**, and the promise the rest of the
video keeps: `FROM YOUR DASHBOARD TO LIVE ON YOUR SITE`.

## Act 1 — Unlock with a plan · 0:04–0:20 (`act-plan`)

**The first thing that stops people.** The widget card renders with the snippet
blurred, the Copy button dimmed, and a lock over the panel reading
*Subscribe to a plan to unlock your widget code*.

- Cursor presses `UPGRADE`; the label goes to `Opening checkout…`.
- The lock lifts, the blur clears, and Copy goes from its grey disabled fill
  to the live blue.

Checkout is the payment provider's screen, not ours, so it is named and skipped
rather than reconstructed. No prices appear anywhere — plans and pricing come
from the backend and are not in this repo to read.

## Act 2 — Copy your snippet · 0:20–0:50 (`act-snippet`)

- The card whole: mode pill, `WIDGET SNIPPET` panel, masked id, Copy.
- The mode dropdown on its two real options, `Widget Mode` / `Button Mode`.
- `Reveal` — the bullets resolve into the company id a character at a time, and
  the control flips to `Hide`.
- `Copy` → `Copied!`

## Act 3 — Generate an API key · 0:50–1:04 (`act-key`)

The snippet ships with `YOUR_API_KEY` as a literal placeholder, and a widget
pasted with it never authenticates. This is the step people skip.

- `Key Label` holds its real default, `Widget Key`; the green `Generate` is
  pressed.
- The one-time reveal drops in above and pushes the row down — the app's own
  reflow — carrying the real warning: *Copy this key now — you won't be able to
  see it again.*

## Act 4 — Paste it into your site · 1:04–1:26 (`act-install`)

- The copied tag pastes into `index.html` above `</body>`, flashing amber.
- `YOUR_API_KEY` highlights, then swaps for the redacted key.
- The page resolves and the chat launcher fades up bottom-right, where the
  widget actually mounts.

---

## Notes for review

Nothing is captured from a live session. The dashboard needs an authenticated
company on an active plan, and `Generate` writes a real, non-reversible API key.
Every screen is rebuilt in HTML from the component that renders it.

The company id is synthetic and the generated key is redacted — this video's own
Act 2 unmasks that id on screen, so a real one would ship a live credential to
everyone who opens the help drawer.

The app disables the Copy button with `opacity-50`, which at video scale washes
its white label to 2.14:1. Act 1 renders the disabled state as a grey fill
instead: legibility outranks an exact colour match, the same trade `frame.md`
already documents for the app's placeholder gray.
