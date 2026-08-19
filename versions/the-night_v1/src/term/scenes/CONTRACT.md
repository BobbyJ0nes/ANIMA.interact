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
`NODE_PATH="C:/Users/bilaa/AppData/Roaming/npm/node_modules" node <script>`.
load `http://localhost:5199/term.html?scene=<id>`, wait ~1.2s, screenshot;
use `window.term.cam(x,z,yaw,pitch)` for 2-3 vantages; check console errors
are `[]`; save shots as `shots/scene_<id>_N.png`. iterate until it looks
intentional, not just error-free.

## what a scene file may NOT do

- edit engine.js, env.js, main.js, term.html, other scenes, README,
  memory, or the board
- exceed ~350 lines (a scene is a poem, not an app)
- add dependencies
