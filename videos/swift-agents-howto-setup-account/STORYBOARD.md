---
project: swift-agents-howto-setup-account
title: Set up your account
aspect: "16:9"
resolution: 1920x1080
duration_seconds: 86
narration: none
blueprint: cursor-ui-demo (static-stage state tour)
structure: host + four act sub-compositions
---

# Set up your account — storyboard

The onboarding wizard, arrival to the questionnaire. Four acts, each its own
sub-composition under `compositions/`, cut between rather than panned across.
The cursor is the only actor; the UI answers it.

Every label, option and question below is the **real** string from
`company-setup/select-options.ts`, `company-info-step.tsx`,
`company-identity-step.tsx` or `questionnaire-chat.tsx`.

A persistent step chip (`01/04 … 04/04`) sits top-left, matching
`../swift-agents-howto-create-widget`.

---

## Title card · 0:00–0:04

Amber logo tile, **SET UP YOUR ACCOUNT**, and what the wizard is actually for:
`TEACHING YOUR AGENTS WHO YOU ARE`.

## Act 1 — Start from your website · 0:04–0:20 (`act-website`)

- **Let's set up your company** / *Enter your website and we'll prefill your
  details for you*.
- `chowdeck.com` typed, `ANALYZE MY SITE` pressed, the button going to
  `Analyzing your website…`.
- An amber ring settles on `Skip, I'll fill it manually`.

> The escape hatch gets its own beat. A scrape that finds nothing is not a dead
> end, but that link is small grey text under a primary button.

## Act 2 — Company information · 0:20–0:42 (`act-info`)

- The wizard's five-step rail and progress bar, the scraped logo tile with
  *Pulled from chowdeck.com*, and eight prefilled fields.
- Cursor opens `Industry` on its real options — `Technology / SaaS`,
  `Finance & Banking`, `Retail & E-commerce`, `Logistics & Transportation`,
  `Professional Services` — and corrects the scrape's guess.
- `Next`.

> The industry is the field worth correcting on camera: the questionnaire
> branches on company type, so a wrong guess changes what gets asked later.
>
> The opened select clears the fields it covers rather than stacking two
> readable layers — one action per beat, as `frame.md` asks.

## Act 3 — Company identity · 0:42–1:04 (`act-identity`)

- What your company does, and the main problem you solve — both in sentence
  case, as the wizard renders them.
- `Brand tone` opened on its four real options: `Professional`, `Friendly`,
  `Playful`, `Authoritative`. `Friendly` picked.
- `Support Emails` typed.

> Tone is the one field a scrape cannot supply. How the agents should sound is
> a decision, not a fact about the company.

## Act 4 — Answer a few questions · 1:04–1:26 (`act-questions`)

- The hand-off modal: *We'd love to get to know your organization better*,
  `USUALLY TAKES 5 MINUTES`, `START QUESTIONER`.
- The questionnaire opens on its real first question, **What kind of company are
  you?**, with the real category chips. `E-commerce / Retail` picked.
- Then the real second question, **Do you have FAQs? Upload the document or type
  a few common questions and answers.** — with both inputs shown, because the
  upload is the faster path and the one people miss.

---

## Note for review

Nothing is captured from a live session: the wizard needs an authenticated user
mid-onboarding, and every `Next` writes to the company record. Every screen is
rebuilt in HTML from the component that renders it.

The rail shows all five steps because the wizard renders all five, but only
`Company Information` and `Company Identity` are reachable today —
`setup-wizard.tsx` jumps to the completion screen after step 1. The video walks
the two that run and does not pretend the other three exist yet.

The rail's inactive steps are darkened from the app's `#b4b4b4`, which measures
2.07:1 on white; `--muted` instead, the trade `frame.md` already documents for
the app's placeholder gray.
