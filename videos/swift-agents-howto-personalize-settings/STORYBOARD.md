---
project: swift-agents-howto-personalize-settings
title: Personalize settings
aspect: "16:9"
resolution: 1920x1080
duration_seconds: 86
narration: none
blueprint: cursor-ui-demo (static-stage state tour)
structure: host + two act sub-compositions
---

# Personalize settings — storyboard

The widget settings drawer. Two sub-compositions: `act-open` (where it lives)
and `act-panel` (what is in it, scrolled through). The cursor is the only
actor; the UI answers it.

Every label, description and toggle caption is the **real** string from
`overview/widget-card.tsx`, `overview/chatbot-settings-sections.tsx` or
`stroll-config-fields.tsx`.

---

## Title card · 0:00–0:04

**PERSONALIZE SETTINGS** / `CHOOSING WHAT YOUR WIDGET CAN DO`.

## Act 1 — Open settings · 0:04–0:18 (`act-open`)

- The widget card, with `SETTINGS` beside the mode pill.
- Cursor presses it; the scrim fades up and the drawer slides in from the right.
- The drawer lands on `Route to Human`, which is the first thing in it.

> Named up front because it is the one switch that turns the AI off entirely —
> every chat goes to a human and a ticket is opened instead.

## Act 2 — Choose your agents · 0:18–0:42 (`act-panel`)

- `Select Agents` — *Which agents are allowed to work in this chatbot*.
- All four with their real descriptions: 047 (dashboard features), 007 (site
  content), 626 (crypto transactions), 001 (bank records).
- 047 and 007 arrive ticked — the component's own default. Cursor ticks **626**.
- 047 carries its real badge: `Users must be logged in`.

## Act 3 — Give Agent 047 a sandbox · 0:42–1:00 (`act-panel`)

- `Sandbox` — *Please create a sandbox account and share the login details for
  Agent 047*.
- The four real fields: `Login URL`, `Dashboard URL`, `Email/Username`,
  `Password`.
- `Payment Sandbox` and `API Integration` sit below, collapsed, as they render.

> 047 walks your dashboard on a user's behalf, which is why it is the one agent
> that needs credentials — and why they must belong to a test account.

## Act 4 — Suggestions, then save · 1:00–1:26 (`act-panel`)

- `Suggested Questions` — *Here you can set the most frequently asked questions
  from your customers that the bot will recommend.*
- `Show suggestions in the widget` is on, the app's default.
- `Where is my order?` typed into Suggestion 1. The field caps at 27 characters.
- `Save & Close`, then the `Settings saved.` toast.

---

## Note for review

Nothing is captured from a live session: the drawer needs an authenticated
company on an active plan, and Save writes to the company record, the stroll
config and the integrations endpoint at once. Every screen is rebuilt in HTML
from the component that renders it.

The panel column is scrolled by a transform and clipped by the stage, and the
layout audit measures neither — so its off-stage copy reads as colliding with
the caption band. Those elements carry `data-layout-allow-overlap` /
`data-layout-allow-occlusion`; the snapshots are what actually verify this act.
