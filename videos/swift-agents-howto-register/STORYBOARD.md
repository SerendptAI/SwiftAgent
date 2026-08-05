---
project: swift-agents-howto-register
title: How to register an account
aspect: "16:9"
resolution: 1920x1080
duration_seconds: 47
narration: none
blueprint: cursor-ui-demo (static-stage state tour)
---

# How to register an account — storyboard

Locked frame throughout. The cursor is the only actor; the UI answers it.
All field labels, placeholders and options below are the **real** strings from
`src/app/[locale]/signup/page.tsx`.

---

## Scene 0 — Title card · 0:00–0:03 (3.0s)

- `--paper` field. Amber logo tile scales up, settles.
- **HOW TO REGISTER** — Greed Narrow, uppercase.
- DM Mono sub-label: `SWIFT AGENTS`

## Scene 1 — Orientation · 0:03–0:08 (5.0s)

The one full-page beat. The real registration screen assembles: the Greed Narrow
`SWIFT AGENTS REGISTRATION FORM` heading, four fields, the blue `REGISTER`
button with its black offset shadow.

> **Caption:** `THE REGISTRATION FORM`

## Scene 2 — Step 1, who you are · 0:08–0:18 (10.0s)

- UI scales so **Company Name** and **Company Email** fill the frame.
- Cursor clicks Company Name, types `Chowdeck`.
- Cursor drops to Company Email, types `ops@chowdeck.com`.
- Each field's placeholder (`COMPANY LEGAL NAME`, `COMPANY@EMAIL.COM`) is visible
  before typing starts, so the viewer can match it to their own screen.

> **Caption:** `STEP 1 — COMPANY NAME AND EMAIL`

## Scene 3 — Step 2, what you do · 0:18–0:27 (9.0s)

- Scale down to the **What does your company do** textarea.
- Types: `Food delivery across Nigeria. We handle order, rider and refund
  questions at high volume.`

> **Caption:** `STEP 2 — DESCRIBE WHAT YOU DO`
> **Sub-caption:** `THIS IS HOW WE JUDGE FIT`

Written to a real Nigerian delivery company because Chowdeck is already a
customer in your case studies — it reads as true rather than as lorem.

## Scene 4 — Step 3, your volume · 0:27–0:35 (8.0s)

- Scale to the **Estimated/customer size** select.
- Cursor clicks; the dropdown opens showing the real five options:
  `1 – 100` · `101 – 1,000` · `1,001 – 10,000` · `10,001 – 100,000` · `100,000+`
- Cursor picks `10,001 – 100,000`; the select closes on it.

> **Caption:** `STEP 3 — PICK YOUR CUSTOMER VOLUME`

## Scene 5 — Submit · 0:35–0:40 (5.0s)

- Pull back so the whole form and the blue `REGISTER` button are in frame.
- Cursor travels down, presses. The offset shadow compresses to zero and springs
  back — the app's real button behaviour.

> **Caption:** `STEP 4 — REGISTER`

## Scene 6 — Now you wait · 0:40–0:47 (7.0s)

The expectation-setting beat, and the reason this video exists. Registration is
an **application**, not instant access — users who don't know that file support
tickets.

- State swap to the real success screen: **Thank you for registering!** in Greed
  Narrow, `we'll reach out soon!` in DM Mono uppercase beneath, with the app's
  own `Thankyou.svg`.

> **Caption:** `WE REVIEW EVERY APPLICATION — YOU'LL HEAR FROM US`

---

## Note for review

The form is never actually submitted. The success state is reconstructed from
the real component, because a live submit writes a registration record to the
staging backend and the endpoint is rate-limited to 5/hour per IP — one bad take
and the next four are throttled.
