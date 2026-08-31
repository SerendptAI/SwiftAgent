---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Your widget already exists as a snippet — you need a plan to see it, a key to pair with it, and a paste into your page."
angle: step-by-step task walkthrough
audience: a customer already in the dashboard who has not installed the widget
destination: in-app help drawer (DevelopmentResourcesDrawer)
aspect: "16:9"
length_seconds: 86
narration: none
captions: on-screen, caption-led
language: en
---

## Scope

Dashboard → live widget. Four acts, one sub-composition each under
`compositions/`, wired from `index.html`.

Deliberately **not** the whole signup journey. This drawer only opens inside the
authenticated dashboard, so anyone watching has already registered, logged in
and completed onboarding; those steps also each have their own card in the same
list (`How to register account`, `How to login`, `Set up your account`). What is
kept is the plan wall, because that one *is* reachable from the dashboard and is
what actually stops people.

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

1. `/dashboard` — the widget card **locked**, and the `UPGRADE` path out of it
2. The widget card unlocked — mode dropdown, `Reveal`, `Copy`
3. `/dashboard/settings/api-keys` — `Key Label`, `Generate`, the one-time reveal
4. The snippet pasted into a real page before `</body>`, then the widget live

## Customizations

- **Oversized cursor** — house style, carried from the two earlier tutorials. At
  drawer playback size a real-size pointer is invisible.
- **Four locked stages, not one.** The earlier videos tour a single form. This
  one crosses the dashboard, settings and the customer's own page, so each act
  gets its own stage and the cuts between them are the act boundaries.
- **A persistent step chip** rather than chapter cards.
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
