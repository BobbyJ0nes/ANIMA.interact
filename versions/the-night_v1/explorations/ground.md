# ground — the grammar of land (exploration · 19.08)

> ground fork, divergence phase. the land is typeset; this asks what the
> land can *say*. anchor line, verbatim, unbuilt until now:
> "The moss on the stones to my right whisper of the silent night."

## the model — six registers of ground

the engine currently gives ground three registers per surface sample:
**pigment** (band 0–9), **weight** (lum → ramp char), **voice** (ramp vs
letter cell). three more complete the grammar:

- **relief** — ground that grew upward into beings: tufts, reeds,
  flowers, mushrooms. the wind currently only modulates luminance;
  flora *moves* with the same gust field, making the wind visible.
  light and blades answering one formula is the rhyme.
- **memory** — wear. where the dreamer walks, the land records it:
  session trails (bounded), and named paths that deepen per visit via
  `dream.visited`. the dream remembers underfoot.
- **strata** — text as geology. layers of letters by height: terraces
  in plan work today; true cliff-face strata need one engine hook
  (below). old letters buried deeper — the alphabet as sediment.

## per-scene ground voices (proposals, writing-justified)

| scene | ground voice | source in the writing |
|---|---|---|
| gate | **whispering moss stones** beside the path; path wears deeper per visit | "The moss on the stones to my right whisper of the silent night." — the moss belongs at the approach |
| streetlamp | berries as low flora-beings (not just flecks); road dust kicked as the ride passes | "strawberry field" · the road |
| cloakroom | slash-floor polished down the aisle centre (traffic wear), rougher under the coats | the corridor's use |
| willow | fallen-letter mulch ring (exists) + root-flare strata at the trunk | the tree's age |
| theatre | rake carpet by row parity; stage boards with plank seams (letter-strata, horizontal) | the house / the boards |
| boat | **cliff-face strata** — the 23-meter face as layered lines of old writing (needs engine hook) | the ledge as a cut through the dream's sediment |
| crossing | none — data-grain only. the honesty scene stays unornamented | — |

## ranked proposals

1. **whisper moss → gate scene.** stones + moss band + murmur: within
   ~11 units, moss cells rarely (gate ≈3%) resolve into single letters
   drawn from the moss sentence itself, each surfacing ~1.5s, never
   contiguous. english-rare budget: ~10–14 letter-cells at any moment,
   scattered — words never assemble; *leaning resolves* (the rule,
   literally). the full line only via the engine `line` at radius 8.
2. **flora kit + visible wind.** one helper builds tuft/reed/flower
   point-sets; per-frame sway = the engine's exact gust formula ×
   amplitude × height-fraction (tension raises amplitude, as the engine
   already does for luminance). env: `spark` → dew glints on tips;
   `drift` → bloom density in flower zones. proposed as a shared
   `scenes/lib/flora.js` — needs a one-line CONTRACT amendment
   (scenes may import from `scenes/lib/`).
3. **worn trails.** session trail: ring buffer of ≤512 quantized
   stamps (0.75u cells, numeric-keyed Set, one lookup per land
   sample — measured cheap). persistent wear: never store raw trails
   in `dream`; store only per-named-path scalars (e.g. wear level
   0–1 derived from `dream.visited[scene]`). cap everything; the
   dream remembers *that* you walked, not every step.
4. **letter strata.** terraces (stepped height, per-step alphabet
   slice — a–e in the lowest layer) work with today's engine. cliff
   *faces* cannot: `ground()` speaks once per surface sample and the
   engine fills the whole column with that voice.

## engine sketches (proposed only — not applied)

```js
// 1. per-row face hook — cliff strata, waterfall streaks, wall texture
//    in the fill loop, when scene.world.face exists:
//    for (let r = ...) {
//      const worldY = cam.y - ((r - horizon) * tc) / PROJ; // invert projection
//      scene.world.face(wx, wz, worldY, gRow);             // may set char/band
//    }
//    cost: one callback per painted cell instead of per sample — gate it
//    behind a scene flag; budget ~+1.5ms at 192 cols.

// 2. cam in ground()/envHook — whisper proximity currently uses a
//    one-frame-stale cam captured in beings(). harmless, but
//    ground(wx, wz, hS, g, t, env, cam) is the honest signature.

// 3. scenes/lib/ — shared flora/typeset helpers importable by scenes;
//    CONTRACT gains: "scenes may import ../lib/*.js; lib files are
//    engine-frozen (no engine imports beyond h2i/vnoise)".
```

## costs measured in the demo

- stones inside `height()` (7 gaussians, bounding-boxed): ~2ms worst
  case at 192 cols — acceptable for a study, inline into a lookup
  grid if promoted.
- trail Set lookup per land sample: unmeasurable against march cost.
- flora ~1,000 points/frame: same order as willow's strands. fine.

## the demo — `/term.html?scene=x_ground`

six zones, one island: **the moss stones** (NE, whisper + line) ·
**the tuft meadow** (W, wind made visible, dew with spark) · **the
flower field** (S, bloom breathes with drift) · **the reed lagoon**
(SE, stiff sway at the waterline) · **the letter terraces** (N,
alphabet as sediment) · **the worn trail** (spawn→moss→terraces,
deepens per visit; your session steps mark the land, capped).
