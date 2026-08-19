# water — the element, explored

> divergence fork · 19.08.26 · demo: `/term.html?scene=x_sea` · shots: `shots/x_sea_*`

## thesis

water is the text before it condenses. land = ramp (form held), water =
letters (raw material), and every shore is the condensation gradient made
visible. depth is dissolution: the deeper the floor, the further letters
decay toward `·` and dark — the un-differentiated. the dive at the piece's
end is not a transition INTO something; it is walking down the gradient
the whole world has been displaying at its edges.

the writing's own water lines carry the axes:
- "The ripples on the water shines, and the light dances on the top." — reflection + sparkle
- "dancing in the distance ... in the waves" — the far water holds figures
- "two streams away from his favourite fishing spot" — streams, crossable
- "recommended pairing: Mirage 73, served next to the rock-pool" — a still pool
- "I say hi to the ghosts as they cross the bridge" — bridges, crossings
- "23 meters and 19 feet" / "There's never a splash" — depth, and refusal

## the axes (each area differs by picking differently)

| axis | range |
|---|---|
| cycle | how fast letters change identity (frozen → churning) |
| flow | direction + speed of the letter-current |
| legibility | letters ↔ punctuation ↔ `·` ↔ blank (dissolution) |
| stillness | mirror (no time term) ↔ chop (env.tension) |
| depth | floor height below the line; walkable descent |
| reflection | moonglade / lamp-glow / stage-gold broken on the surface |
| reaction | wake (the walker churns letters) ↔ refusal (never a splash) |
| weather | rain of characters joining the sea |
| tide | shorelines breathe with env.depth |

## per-scene variation table (proposal — each area slightly different)

| scene | its water | why |
|---|---|---|
| gate | **whisper marsh** at the south edge: slow cycle (t×0.12), half the cells blank, dim ink | the first water seen; the dream hasn't committed. "whisper of the silent night" |
| cloakroom | none — memories are dry-stored | interior; the veil fog is its almost-water |
| willow | ring-sea unchanged; after a crossing wave, strand-tips drip 2–3 letter-drops | the tree sheds; smallest possible water |
| streetlamp | **two streams** crossing the meadow as thin letter-brooks, flow ← drift | verbatim: "two streams away from his favourite fishing spot" |
| theatre | **the rock-pool** near the stage: frozen seed (no time term), reflects stage-gold flicker | verbatim: "served next to the rock-pool"; a martini-glass of held memory |
| boat | the manuscript sea — and it REFUSES: no wake, no glade, no reaction ever | "I toss a rock below / There's never a splash" — refusal is its character |
| crossing | digit-sea; current direction flips with slope sign | the 1/f tilt tips the sea |
| all islands | tide: shorelines submerge as env.depth rises | the body's depth moves the waterline |

## the demo — x_sea, five bays and the deep (night register)

walk west→east; border ridges with fords at z≈−4; the deep waits south.

```
whisper bay │ mirror bay │ the two streams │ wake shallows │ rain reach
  x<−60     │  −60..−30  │  −30..14 (bridge│   14..48      │   48..100
            │  moonglade │   + ghosts)     │  (walk it)    │  (letters fall)
────────────┴────────────┴─────────────────┴───────────────┴────────────
                     the deep (z>30): dissolution basin, walkable descent
```

- **whisper bay** — sparse, slow, dim. half the sea is blank.
- **mirror bay** — frozen letters; the **moonglade** dances on it (broken
  path of pale light under the moon's azimuth, shimmer ← spark). the line
  lives here, verbatim: "The ripples on the water shines, and the light
  dances on the top."
- **the two streams** — fast letter-current flowing along z, teal, legible;
  a plank bridge crosses both; three pale **ghosts** cross it at their own
  speeds (some friendly, some grumpy).
- **wake shallows** — calm until walked: a 3-second trail where your steps
  churn the letters bright (the sea acknowledges the dreamer — everywhere
  except the boat's sea, which never will).
- **rain reach** — letters fall from the night and the sea receives each
  with a small `+` flash; rate ← tension.
- **the deep** — the floor drops to −5; letters decay to `·` to dark as
  you walk DOWN between dunes of failing text. the dive, walkable.
- **tide** — the whole archipelago's shoreline breathes with env.depth
  (clearest on `e` → recorded).

## ranked proposals for convergence

1. **shore condensation gradient everywhere** (needs ENGINE CHANGE — see
   sketch A). the thesis at every scene's edge, one rule, huge coherence.
2. **per-scene water hook** (same engine change) — unlocks the whole
   table above: rock-pool, whisper marsh, digit-current flip, boat's
   refusal, without shelf-water workarounds.
3. **the wake** (no engine change; scene-local pattern proven in x_sea) —
   adopt in gate/streetlamp ring-seas via shelf-water or after sketch A;
   explicitly NOT in boat.
4. **tide ← env.depth** (no engine change; height(x,z,env) already works).
5. **two streams in streetlamp + rock-pool in theatre** (no engine change;
   both verbatim-grounded, ~20 lines each).
6. **moonglade** on mirror-still waters (no engine change on shelf seas).
7. **rain joining the sea** in crossing during high-tension replay
   passages — RECORDED weather, honesty-consistent.

### sketch A — the water hook (engine, ~10 lines)

mirror of the existing gSample pattern, in renderTerrain's water branch:

```js
// engine.js, water branch, after default lum/chIdx:
if (scene.world.water) {
  wSample.lum = lum; wSample.seed = wi; wSample.band = 0; wSample.depth = WL - hh;
  scene.world.water(wx, wz, wSample, t, env);
  lum = wSample.lum; band = wSample.band;
  chIdx = wSample.blank ? -2 : writIdx[wSample.seed % writIdx.length];
}
// and let chIdx === -2 fall through to the ramp path with low lum
```

also worth folding in at convergence: call `ground()` for shore samples
with `h - WL` passed, so the gradient needs no per-scene duplication.

### noted while building (out of my lane)

the engine `line` legacy x-offset (−1.2) still needs compensation
(x_sea sets `x: anchor + 1.2`); the axis-lock to world-x is already on
the parent's wart list.
