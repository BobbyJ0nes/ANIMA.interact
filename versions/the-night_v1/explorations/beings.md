# beings — the choreography of creatures made of type

> beings fork, 19.08.26. demo: `/term.html?scene=x_beings` ·
> shots `shots/x_beings_*` · everything here is scene-implementable today
> unless marked ENGINE.

## first principles

1. **cell-quantized motion is the truth of the medium.** sub-cell motion
   renders as shimmer; whole-cell motion renders as intent. a being that
   *glides* looks like a particle; a being that *hops cells* looks like it
   decided to. field_01 learned this in the sky (letters hop, nothing
   slides) — it is doubly true for bodies.
2. **character-swap is the medium's muscle.** where flesh would flex, type
   substitutes: `·` swelling to `:` is a breath; `,` behind `·` is a tail;
   `@` dimming to `0` is an eye closing. no geometry changes — the *name*
   of the cell changes. this is the deepest move available and costs
   nothing.
3. **stillness is a choreography.** the mage does not move; his glint
   tracks you. the cat freezes; its eye stays lit. a world where most
   things move a little makes total stillness the loudest gesture.
4. **speech is matter, not overlay.** the writing's own rule ("she
   glows... white numbers and symbols appear in her place") — words and
   bodies are the same substance. so lines must arrive *from* the world
   and return *to* it.

## the vocabulary — named moves

### idle (life at rest)
- **breath-swap** — one chest cell cycles `·`→`:`→`·` on a ~4s sine.
  subliminal at distance, unmistakable at arm's length. (demo: the mouse,
  paused.)
- **ember-pulse** — a single warm cell's lift flickers (the gecko's cigar,
  the hanker-chief). already canon; name it and reuse it.
- **shoulder-shift** — one body cell offsets by ±1 cell once per ~10s,
  then returns. weight moving on feet. cheap, eerie, good for otters.
- **weight-settle** — a column's cells re-jitter y once, together, like a
  coat disturbed. right for the cloakroom when the interactor walks past
  (the wake of a body among memories).

### gaits (life in transit)
- **scurry** — burst-of-three hops then rest (cycle ~0.9s), tail cell
  latching one hop late (follow-through), body bobbing per hop. reads as
  small, hurried, harmless. (demo: the mouse. keep his 47s clock.)
- **prowl** — continuous slow glide, low posture, with hash-gated freezes
  of 2–3s during which only the eye-cell stays lifted. reads as watched.
  (demo: the cat. RECOMMEND replacing the willow cats' teleport-hop with
  prowl when the visitor holds the pass — approach should be *visible*.)
- **hop-clock** — teleport reposition on a fixed period (current willow
  cats). keep for *unwatched* cats: things move when you don't look.
  prowl when watched, hop-clock when not — a cat rule that is also a
  dream rule.
- **limp** — scurry with an uneven duty cycle (hop-hop-long-rest). in
  reserve for any wounded or old figure; fate "growing old" could carry a
  half-limp drift if she ever walks.
- **procession** — constant velocity, trailing cells fading behind (the
  ride). never accelerates, never stops. canon; name it.
- **drift-dance** — per-point sinuous phase up a strand (she). canon.

### group (life in numbers)
- **murmuration** — N single-letter birds around a moving attractor,
  per-bird phase/radius wobble (no boids math needed at N≤30). the flock
  IS letters; and in the demo the word "gone" rides *inside* the flock at
  all times — four birds permanently carry g/o/n/e, unreadable in the
  wheel. once per ~40s, for ~1.2s, formation aligns them and the word is
  *almost* legible at distance, dim, sky-band.
  **english-rare budget argument:** the read is doubt, not text — the
  same key as the theatre's lapis card ("is it moving or not"). one
  sub-second near-word per minute, at fog distance, keeps the rule's
  spirit: the world almost-resolves precisely often enough to keep you
  reading it.

### speech (life addressing you)
- **condense-in / scatter-out** — THE move; below.
- **distance-typing** — the engine's `line` mechanism (letters count in
  with proximity). after building both, the difference is legible:
  typing reads as *signage* (the pass, the counter's terms, 00:68 — the
  dream's bureaucracy). condensation reads as *voice*.
  **PROPOSED RULE: signs type, beings condense.**

## speech as condensation — design

### scene-level (implemented, x_beings.js, ~40 lines)
each letter owns: a home in the night (hashed offset, 3.5–7.5 units out,
2–6 up — where the sky's letters live), a slot in the line, a reveal
scalar r∈[0,1], a delay (0–0.8s, hash — NOT left-to-right; coalescing,
not typing), a rate (±30%). per frame:
```
r += (speaking && t-speakT > delay ? dt/1.25 : -dt/0.8) * rate
e = smoothstep(r)
pos = lerp(home, slot, e) + up * 0.9·sin(πe)·(1−0.4e)   // the arc
band = e>0.72 ? 7 : 9 ; lift = e>0.72 ? 1 : −1          // sky → voice
```
silence reverses every letter down its own arc. flight ~2s full line.
verified: mid-flight r spread 0.36–0.89, settle to 1.0, zero errors.

### ENGINE-level (sketch — true provenance)
the sky's letters are *screen-space* cells; a being's line is
*world-space*. true recruitment crosses that boundary — the being borrows
from the picture plane itself, which is the she_dream move exactly.
sketch: engine keeps the last frame's sky-cell list (col,row,char);
`engine.speak({text, anchor, hold})` claims the N nearest sky cells,
suppresses them in renderSky, and animates screen-cell → projected slot
in *cell hops* (2–3 cells per step, quantized — terminal-true) before
handing them to world space. release returns them to the sky registry.
adds one queue + ~60 lines to the engine; scenes get voice for free and
letter-land/sky density visibly *dips* while a being speaks — the world
literally lends its matter to the voice. worth doing at the next engine
pass; the scene-level version is honest enough until then.

## per-figure recommendations (the seven scenes)

| figure | keep | add |
|---|---|---|
| fate (gate) | pen-hand, pale column | her two lines should CONDENSE (voice), the pass keeps typing (sign). breath-swap on her head cell. |
| coats (cloakroom) | depth-count, crossing-wind | weight-settle on the coat nearest the interactor as they pass |
| mage (willow) | stillness + tracking glint | nothing. his register is refusal. |
| cats (willow) | hop-clock unwatched | prowl toward pass-holder (visible approach) |
| lamp (streetlamp) | tired cycle (the best idle in the piece) | bulb breath-swap `@`→`0` at sag bottom — the eye closing |
| mouse (streetlamp) | 47s scurry, watch, oak meetings | breath-swap at the oak pause; optional "so long my friend" condensation on close pass (demo-proven) |
| otters (theatre) | displacement spec, glint | shoulder-shift idles; middle otter's line condenses when curtains open wide (focus high) |
| she (boat) | drift-dance, recession | NO speech ever — "her actions write to me directly". if anything: the sea's letters near her drift toward alignment and never arrive. |
| ride (streetlamp) | procession | nothing. it must stay indifferent. |

## ranked proposals

1. **signs type, beings condense** — promote condensation to the voice
   mechanism for fate + the middle otter (scene-level, ~40 lines each,
   demo-proven). the piece gains a felt distinction between bureaucracy
   and being. smallest cost, largest meaning.
2. **watched/unwatched cat rule** — prowl vs hop-clock switching on
   visibility + pass. makes the dream's logic (things move differently
   when observed) mechanical, in one scene, quietly.
3. **engine `speak()` with sky provenance** — the she_dream move made
   literal: the sky dims to lend the voice its letters. next engine pass,
   ~60 lines, unlocks every future figure incl. the character-LLM lane
   (a model's streamed tokens condensing one by one is the SAME api).

margin note: proposal 3 is the bridge to the AI lane — an LLM's token
stream maps 1:1 onto condensation order (tokens arrive staggered, settle
into the line, scatter on the next turn). the choreography built here is
already the shape of model speech.
