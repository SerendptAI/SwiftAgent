---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Creating a widget is the whole path from registering a company to a snippet running on your own page — and the plan is the step that blocks people."
angle: step-by-step task walkthrough
audience: brand-new Swift Agents customers, from before they have an account
destination: in-app help drawer (DevelopmentResourcesDrawer)
aspect: "16:9"
length_seconds: 170
narration: none
captions: on-screen, caption-led
language: en
---

## Scope

The complete journey, registration → live widget, as one video. The two earlier
tutorials stay as focused quick references; this one subsumes them so a new
customer can follow a single clip end to end, which is what it was asked for.

Seven acts, one sub-composition each under `compositions/`, wired from
`index.html`. A ~3 minute single file would have been unreadable, and the acts
are far easier to verify one at a time.

## Intent

A how-to tutorial, **not** a promo. Third in the series after
`../swift-agents-howto-login` and `../swift-agents-howto-register`, and it obeys
the same rules: clarity beats energy, no hook, no punchline, no jokes.

Show-it-as-is: feature Swift Agents' own screens as the video's assets.

## The thing this video has to correct

There is no "create a widget" wizard in the product, and the tutorial title
promises one. The widget is provisioned with the company — the dashboard hands
you a **snippet**, and "creating" it means everything that has to be true before
that snippet works: an approved company, a completed setup, an active plan, an
API key, and the tag on your page. A viewer hunting for a Create button is the
confusion this video exists to end, so Act 5 names the snippet as the thing
itself — and Act 4 shows the plan wall, which is what actually stops people.

## What to show

1. `/signup` — the registration form, then the approval-pending state
2. `/login` — company email, then the six-digit code
3. `/onboarding` — the website scrape, Company Information, Company Identity,
   and the questionnaire hand-off (`company-setup/setup-wizard.tsx`)
4. `/dashboard` — the widget card **locked**, and the `UPGRADE` path out of it
5. The widget card unlocked — mode dropdown, `Reveal`, `Copy`
6. `/dashboard/settings/api-keys` — `Key Label`, `Generate`, the one-time reveal
7. The snippet pasted into a real page before `</body>`, then the widget live

## Customizations

- **Oversized cursor** — house style, carried from the two earlier tutorials. At
  drawer playback size a real-size pointer is invisible.
- **Seven locked stages, not one.** The earlier videos tour a single form. This
  one crosses the marketing site, the dashboard, settings and the customer's own
  page, so each act gets its own stage and the cuts between them are the act
  boundaries.
- **A persistent step chip** rather than chapter cards. Seven full-screen breaks
  would spend fifteen seconds saying nothing.
- **A shared stylesheet**, `assets/tutorial.css`, linked from every act. The
  compiler scopes each file's own `<style>` to that file's composition id, so a
  `<style>` block could not hold shared primitives; a `<link>` is hoisted and
  stays global.
- **Design spec inherited**, not re-derived — `frame.md` is copied from
  `../swift-agents-howto-register` with one added token (see below).

## Notes

- **The company id on screen is synthetic.** `4f9a2c71-3e88-4d10-b6c2-0e5b7a91d3f4`
  is not a real company. The id is the only real secret in the snippet — the api
  key in it is the literal placeholder `YOUR_API_KEY` — and this video's whole
  step 2 is *unmasking* that id, so a real one would ship a live credential to
  every viewer of the help drawer.
- **No prices anywhere.** Plans and their prices come from the backend `/plans`
  endpoint and are not in this repo to read. Act 4 therefore shows the real
  locked state and the real `UPGRADE` control, then names checkout and skips to
  the unlock, rather than reconstructing a pricing table out of guesses.
- **The API key shown is redacted, not invented.** The real key format is issued
  by the backend and is not in this repo; rather than guess a shape that would
  drift from the product, the one-time reveal block shows the real chrome (label
  field, `Generate`, the "you won't be able to see it again" warning) with the
  key itself as a redacted block.
- **Screens are reconstructed in HTML** from the real components, not captured.
  The dashboard needs an authenticated company on an active plan, and generating
  an API key is a real, irreversible write. Copy comes from `widget-card.tsx`
  and `settings/api-keys/page.tsx` so the video cannot drift from the UI.
- `frame.md` adds `--go: #00B37E` — the API Keys screen's green, which the two
  earlier tutorials never had to render. It is the product's real colour for
  that button; nothing else here departs from the inherited palette.
- Blueprint: `cursor-ui-demo`, static-stage state-tour variant — locked frame,
  click-triggered state changes.
