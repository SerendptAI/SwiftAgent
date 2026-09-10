---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Personalising the widget is choosing which agents may answer, giving the one that needs it a sandbox login, and writing the prompts customers see first."
angle: step-by-step task walkthrough
audience: a customer whose widget is live and who wants to change what it does
destination: in-app help drawer (DevelopmentResourcesDrawer)
aspect: "16:9"
length_seconds: 86
narration: none
captions: on-screen, caption-led
language: en
---

## Scope

The widget settings drawer — `ChatbotSettingsSidebar` in
`overview/widget-card.tsx`, with its sections from
`overview/chatbot-settings-sections.tsx` and `stroll-config-fields.tsx`.

Fifth in the series. Two sub-compositions: `act-open` establishes where the
drawer lives, `act-panel` is the drawer itself, scrolled through.

## Intent

A how-to tutorial, **not** a promo. The drawer is long and mostly collapsed, so
the question it answers is: which of these do I actually have to fill in?

The answer: the agents you want, a sandbox login if you picked 047, and your
suggested questions. Payment Sandbox and API Integration stay shut, because
most companies never open them.

## What to show

1. The `SETTINGS` button on the widget card, and the drawer sliding in over its
   scrim — the app's own `translate-x` transition
2. `Route to Human`, named early because it is the one switch that turns the AI
   **off** entirely
3. `Select Agents` — all four with their real descriptions, 047 carrying its
   `Users must be logged in` badge, and 626 ticked on camera
4. `Sandbox` — the four `StrollConfigFields` that Agent 047 needs
5. `Suggested Questions` — the toggle, and one suggestion typed
6. `Save & Close`, and the `Settings saved.` toast

## Notes

- **The drawer is shown head-on, not at its real 448px width.** Act 1 
  establishes that it is a right-hand drawer; from there the panel is the whole
  frame, because all of its instruction is text and the real proportion is
  unreadable at drawer-playback size. `frame.md` — legibility governs framing.
- **047 and 007 arrive ticked.** That is the component's own default
  (`useState(() => new Set(["047", "007"]))`), not a choice made for the video.
  626 is the one ticked on camera: crypto is the branch most companies leave
  off, so it shows the checkbox actually responding.
- **The sandbox credentials are obviously fake.** They are a login the video
  asks you to create *for* Agent 047, so showing anything resembling a real one
  would be teaching the wrong habit.
- **Payment Sandbox and API Integration stay collapsed**, as they render by
  default. Opening them is a different tutorial.
- **The layout audit is marked, not satisfied, on the panel column.** It is
  ~3000px of drawer scrolled through an 812px stage by a transform, and the
  audit measures neither the transform nor the stage's clip, so it reads
  off-stage copy as colliding with the caption band. Snapshots are the gate for
  this one, and they are clean.
- Blueprint: `cursor-ui-demo`, static-stage state-tour variant.
