# frame.md — Swift Agents how-to tutorials

Derived from live captures of `/en/login` and `/en/signup`, not from a preset.
These videos play inside the product's own help drawer, so they must read as the
product. Every value below came out of `capture/extracted/tokens.json` or
`design-styles.json`.

## Palette

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0A0A0A` | Text, cursor, offset shadows, title-card field |
| `--paper` | `#FFFFFF` | Stage background, card surfaces |
| `--amber` | `#F2B035` | Logo tile. The brand's one warm accent — used sparingly |
| `--action` | `#006BE5` | Primary buttons (REGISTER). Never for text |
| `--field` | `#F3F4F6` | Input fill |
| `--muted` | `#6E6E6E` | Placeholder text, secondary labels. The app uses
  `#9F9F9F`, which measures 2.65:1 on white and fails the 3:1 floor at video
  scale; darkened here because legibility outranks an exact colour match. |
| `--rule` | `#E5E5E5` | Borders, hairlines |
| `--focus` | `#F2B035` | Step highlight ring — amber, so it never reads as an error |

Never introduce a colour outside this table. Red (`#E7000B`) exists in the app
but means failure; these tutorials show only happy paths.

## Typography

- **Display** — Greed Narrow Medium, uppercase, tight tracking. Title cards and
  step numbers only.
- **Label / caption** — DM Mono 500, uppercase, `0.1em` tracking. All instruction
  captions. This is the app's own label voice.
- **UI body** — Stolzl / Instrument Sans. Only inside reconstructed UI, so the
  screens match the real thing.

Caption minimum **28px at 1920×1080**. The whole legibility risk in this brief is
text shrinking inside the drawer; nothing instructional goes below that.

## Layout

- 1920×1080, 16:9. Safe margin 96px.
- **Locked stage.** The camera never moves (`cursor-ui-demo` static-stage
  variant). Every change is an element transform on the UI itself.
- Reconstructed UI sits centred on `--paper`, carrying the app's real
  `shadow-[-4px_4px_0px_0px_#000000]` offset shadow.
- Captions live in a fixed lower band, same position every scene, so the eye
  never hunts for them.

## Motion

- Ease `power2.out`, 0.4s for UI state changes; 0.6s for cursor travel.
- **Cursor** — oversized macOS pointer, ~2.4× real size, `--ink` with a white
  rim so it reads on both fills. Enters from off-stage, travels to a target,
  clicks (scale 0.88, 90ms), then holds still while the UI answers.
- **One action per beat.** The cursor never moves while text is typing.
- Typing: 45ms per character, monospace caret.
- No idle drift, no ambient float. Motion here is instructional; if nothing is
  being taught, nothing moves.

## Caption timing

A step caption holds for its whole beat — never fades before the action it
describes completes. Minimum 2.4s on screen regardless of length.
