---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Setting up your account is teaching the agents who you are — most of it is prefilled from your website, and the rest is the part only you know."
angle: step-by-step task walkthrough
audience: a customer who has just logged in for the first time and landed in the setup wizard
destination: in-app help drawer (DevelopmentResourcesDrawer)
aspect: "16:9"
length_seconds: 86
narration: none
captions: on-screen, caption-led
language: en
---

## Scope

`/onboarding` — the setup wizard, arrival to the questionnaire hand-off. Four
acts, one sub-composition each under `compositions/`, wired from `index.html`.

Fourth in the series after `../swift-agents-howto-login`,
`../swift-agents-howto-register` and `../swift-agents-howto-create-widget`, and
it obeys the same rules: clarity beats energy, no hook, no punchline, no jokes.

Show-it-as-is: feature Swift Agents' own screens as the video's assets.

## Intent

A how-to tutorial, **not** a promo. It answers the question someone has while
staring at a five-step rail: how much of this do I have to type, and how long
will it take?

The answer the video gives is the reassuring one, and it is true: paste a
website and most of it fills itself; what is left is the handful of things a
scrape cannot know — your tone, your support emails, your documents.

## What to show

`src/components/dashboard/company-setup/*`, in the order the wizard runs them:

1. `WebsiteIntroStep` — *Let's set up your company*, the URL, `ANALYZE MY SITE`,
   and the `Skip, I'll fill it manually` escape hatch
2. `CompanyInfoStep` — the scraped logo and eight prefilled fields, with the
   `Industry` select opened on its real options and corrected
3. `CompanyIdentityStep` — description, the problem you solve, `Brand tone`
   opened on its four real options, primary language, support emails
4. `CompletionStep` → `QuestionnaireChat` — the hand-off modal, then the first
   two real questions the agents ask

## Customizations

- **Oversized cursor**, **step chip**, **shared `assets/tutorial.css`**, and the
  locked-stage-per-act structure — all carried from
  `../swift-agents-howto-create-widget` so the two dashboard tutorials read as
  one series.
- **Design spec inherited**, not re-derived — `frame.md` is copied across.

## Notes

- **Only two of the rail's five steps are reachable today.**
  `setup-wizard.tsx` advertises `Company Information`, `Company Identity`,
  `Knowledge Sources`, `Answer Boundaries` and `Voice & Conversation`, but
  `handleNext` jumps to the completion screen after step 1. The video shows all
  five in the rail, because that is what the wizard renders, and walks only the
  two that run.
- **The scraped industry is corrected on camera.** It is a guess, and
  `QuestionnaireChat` branches on the company type — crypto gets the whitepaper
  and tokenomics question set, everything else the generic one — so it is the
  field most worth checking.
- **The escape hatch is given its own beat.** A scrape that finds nothing is not
  a dead end, but `Skip, I'll fill it manually` is small grey text under a
  primary button and nobody reads it.
- **Screens are reconstructed in HTML** from the real components, not captured.
  The wizard needs an authenticated user mid-onboarding, and every Next writes
  to the company record. Field labels, select options and questionnaire copy
  come from `company-setup/select-options.ts`, `company-info-step.tsx`,
  `company-identity-step.tsx` and `questionnaire-chat.tsx` so the video cannot
  drift from the UI.
- **The rail's inactive steps are darkened** from the app's `#b4b4b4`, which
  measures 2.07:1 on white. `--muted` instead, the trade `frame.md` already
  documents for the app's placeholder gray.
- Blueprint: `cursor-ui-demo`, static-stage state-tour variant.
