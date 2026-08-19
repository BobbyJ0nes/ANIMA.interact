# scene contract — termfield_02

a scene is one file in `src/term/scenes/<id>.js`, default-exporting one
object. the engine (`src/term/engine.js`) discovers it automatically via
glob — no registration anywhere. reference implementation: `gate.js`.

## shape

```js
import { h2i, vnoise } from '../engine.js'; // shared hash + value noise

export default {
  id: 'streetlamp',            // url: /term.html?scene=streetlamp
  title: 'the streetlamp in the strawberry field',
  register: 'rose',            // default style register (user can override live)

  notation: {                  // OPTIONAL — the scene's own character voice
    ramp: [' ','.','·',...],   // depth ramp, index 0 MUST be ' ' — replaces default
    writing: 'abc...',         // ambient/water/letter-land alphabet — replaces default
    extra: ['│','☂'],          // EVERY char your beings/ground emit must be listed
  },                           // somewhere in ramp/writing/extra or it renders '·'

  world: {
    far: 300,                  // optional, march distance
    waterLevel: 0,             // optional
    islandR: 95,               // optional; null disables the island sink.
                               // default 95: beyond it the land sinks into the
                               // sea of writing — every scene is an island in
                               // the text (engine adds this; don't re-implement)
    center: { x: 0, z: 0 },    // optional island centre
    height(x, z, env) {},      // REQUIRED. world height. called ~30k/frame —
                               // keep it cheap (vnoise + a few gaussians)
    ground(wx, wz, hS, g, t, env, cam) {},
                               // OPTIONAL per-surface-sample hook. mutate g:
                               // g.band (0-9 palette band), g.lum (0..1),
                               // g.letter=true + g.letterSeed=int for a letter
                               // cell. runs before fog; keep it branchy-cheap.
    water(wx, wz, w, t, env, cam) {},
                               // OPTIONAL per-water-sample voice (19.08).
                               // mutate w: w.lum, w.seed (letter index),
                               // w.band, w.blank=true to withhold the letter
                               // (ramp renders instead). wakes/glades/currents
                               // live here — see lib/wake.js
    face(wx, wz, wy, g, t, env) {},
                               // OPTIONAL per-fill-row hook for vertical
                               // faces (19.08): rows well below the surface
                               // sample get a second voice — cliff strata,
                               // wall texture. costs per-row; opt in only
                               // where faces matter
    shoreGrad: true,           // island scenes get the shore condensation
                               // gradient by default (land dissolves into
                               // letters at the waterline); false disables
  },

  spawn: { x: 0, z: 26, yaw: 0 },

  sky: {},                     // {} = engine stars+moon · { none:true } = no sky
                               // { stars: 0.5 } scales count · { moon:false }
                               // { moon: { az, el, r, phase 0..1, halo, waver } }
                               // NOTE (19.08): star counts also run the
                               // depletion arc — every scene visited, more
                               // stars have moved out. the sky band is
                               // narrow: nothing renders above tan-el ≈0.30.
                               // the moon renders in the SCENE's ramp — a
                               // custom ramp restyles the moon (a feature)

  beings(t, cam, env) {},      // called EVERY FRAME. return [{x,y,z,ch,band,lift}].
                               // cache your static points in module scope
                               // (see gate.js STATIC pattern). lift brightens
                               // (+1/+2) or dims (-1) vs fog step.
                               // spacing rule of thumb: points every ~0.1-0.13
                               // world units read as solid strokes; wider reads
                               // as dotted dream-matter (a choice, make it).

  line: { text, x, z, y, radius, axis: 'x'|'z' },
                               // OPTIONAL proximity-typeset line (verbatim
                               // from the writing — typos preserved). the
                               // legacy x-offset is GONE (19.08); letters
                               // center on the anchor along `axis`.
                               // DOCTRINE (19.08): signs type, beings
                               // condense — a notice/menu/rule uses `line`;
                               // a speaking BEING uses engine condense():
                               //   import { condense } from '../engine.js'
                               //   pts.push(...condense(text, x, y, z,
                               //     reveal01, t, seed)) — letters fly in
                               // from the night and the sky dims while
                               // they're aloft. shared helpers may live in
                               // scenes/lib/ (not auto-discovered)

  envHook(env, t) {},          // OPTIONAL per-frame reaction to env channels

  async init({ h2i, vnoise, env }) {}, // OPTIONAL async setup (fetch data etc.)
                               // awaited once before the scene first renders
};
```

## the env layer (env.js)

`env.ch` = `{ drift, depth, focus, tension, spark (0..1), slope (-1..1),
crossing (0..1 envelope) }`. two sources, toggled with `e`: MODEL
(oscillator algorithm) and RECORDED (the 06.06 writing session's own EEG,
replayed 6× compressed from `/eeg/session01.json`; `env.sessionSec` = where
in the 74 min the replay is). the engine already couples env globally
(wind←tension, fog←depth, twinkle←spark, water-stream←drift). scenes add
their OWN mapping on top — one or two channels, legible, not everything.

## palette bands (all registers share semantics)

0 water · 1 low ground · 2 mid · 3 high · 4 peak/pale/iron · 5 accent
(path/berry/madder) · 6 warm (lamp/gold) · 7 near-white (fate/speech) ·
8 far silhouette · 9 sky

## v2 engine api (19.08 — the excavated night)

frozen surface; scenes import from `../engine.js`:

- `speak(lines)` — the reading band. `lines` = string | {text, at:{x,z,radius?}, hold?}
  | array of either. types at 30cps into up to 5 cleared rows above the
  margin row; one typed voice at a time (narrate yields to it). while a
  line types, `speakingAt()` returns its `at` — the speaking being's scene
  code reads it and pulses its own condensation (that is how the reader
  knows the speaker; never a name-tag). walking out of `at.radius*1.2`
  scatter-fades the line; scenes may re-offer by calling speak again after
  resetting their cue on radius exit. Space completes the typing.
- `narrate(text)` — unchanged: the ambient margin voice, one line.
- `cardShow(lines, key?)` / `cardHide()` / `cardActive()` — handed objects
  arrive whole ("voices type, objects appear"): bordered, instant, centered.
  Space lowers it and fires `signals[key + 'Closed']`.
- `facing(x, z, cone=0.35)` — is the camera facing that world point.
  choices are conduct: position, facing, stillness, timing. never menus.
- `choose(k, v)` — record this night's conduct in `dream.chosen`. echoes
  read ONLY `dream.echo` (last night's conduct, swapped at the fold) —
  night one stays pure canon; the second night greets who you were.
- `liminal()` — the authored dial 0..1 (stage-indexed, fold-deepened,
  0 in lab). engine already drives fog/letterland/stars/ramp/margin-cps
  with it; scenes may add ONE legible coupling of their own, gains only.
- `scenes/lib/hand.js` — `makeHand({x, z, y?, radius?, cone?, dwell?,
  seed?, onVerdict})` — the faded hand (17.08.26): the night's shared
  choice grammar. call `hand.update(t, cam)` in beings() and concat its
  points. verdict fires once: 'taken' | 'declined' | 'unwitnessed'.
  HONESTY (sol consult 19.08): conduct is not intention — only a
  witnessed taking or refusal is recorded. call choose() for 'taken' and
  'declined' ONLY; 'unwitnessed' keeps NO interpretation (the hand leaves
  an '…', the mark of what the system cannot honestly resolve). declining
  NEVER blocks progress — the formed thing arrives anyway; echoes do the
  remembering. every registered verdict must be materially acknowledged
  in the moment (the hand's own body already does this — firms warm /
  closes and lowers / thins to '…').
- chapter pages are the director's business (night.js) — scenes never
  page. `?lab` never pages.
- RENDER FACT (19.08, found in the v2 wave): for ground LETTER cells,
  `g.lum` only gates visibility (0.18–0.8) and picks ramp glyphs —
  it does not brighten. a traveling "pull" crest must be a BAND lift
  (e.g. 5 → 6 on the lit index), not a lum add. margin/narrate lines
  render whole rows cleared; a `narrate()` queued while speak()/page
  holds the band now freezes rather than expiring (engine guarantees
  it). `/` and `\` joined CORE_ALWAYS (the hand's fingers) — listing
  them in extras is harmless but no longer required.

## being autonomy (v2 checklist — every being answers four questions)

- **idle**: what is its life when no one watches? env-coupled,
  camera-indifferent (the lamp's tired cycle is the reference).
- **notice**: how does its body admit you before any words?
- **engage**: what conduct gates the encounter — stillness, facing,
  timing? (never a hitbox-touch, never a prompt.)
- **remember**: what does it keep across revisits and folds?
  (read dream.visited / dream.echo / dream.folds.)
implement as per-scene closures; no shared Being class.

## the rules that are not negotiable

- **the interactor is a visitor, not the dreamer** (locked 19.08) —
  figures may misrecognize them; the piece never claims the visitor's
  interiority; the recorded night is his, walked as a guest
- **the visitor is mute everywhere** (locked 19.08) — the tongue was
  paid at the gate; no affordance ever lets the visitor speak, type,
  or answer. figures speak; the visitor leans, waits, walks
- prose in `line`/typeset text is VERBATIM from the writing, typos kept
- english is rare: most cells never resolve into readable words
- nothing appears from nowhere: forms belong to the field's matter
- likeness stays unresolved (columns, strands — not figurines);
  sentiment lives in hue + rhythm
- honesty: recorded data is labeled RECORDED, algorithms MODEL — never
  imply a live body that isn't there

## verification (each scene, before reporting done)

dev server runs at http://localhost:5199. playwright is available via
`NODE_PATH="$(npm root -g)" node <script>` (point NODE_PATH at your
global npm modules so playwright resolves).
load `http://localhost:5199/term.html?scene=<id>`, wait ~1.2s, screenshot;
use `window.term.cam(x,z,yaw,pitch)` for 2-3 vantages; check console errors
are `[]`; save shots as `shots/scene_<id>_N.png`. iterate until it looks
intentional, not just error-free.

## what a scene file may NOT do

- edit engine.js, env.js, main.js, term.html, other scenes, README,
  memory, or the board
- exceed ~350 lines (a scene is a poem, not an app)
- add dependencies
