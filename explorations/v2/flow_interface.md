# v2 · flow, orientation, interface
*fork: flow/orientation/interface · 19.08.26 · grounded in engine.js, night.js, gate/cloakroom/willow/streetlamp/boat, term.html, 06.06.26.txt*

bobby's ask, verbatim: "The scenes should flow between - and it should be more
obvious where you are and why you're here. Or at least get you quseitoning
that." · "add some other interface elements without cluttering and changing
the vibe."

## the organizing rule

the piece already has an interface doctrine, written into engine.js itself:
*"the story is told as you live it, and its sentences are the night's only
instructions"* — and *"signs type, beings condense"*. so v2 adds **no fourth
voice**. every element must be one of the three that exist:

1. **the margin** — the page's voice, typed at the bottom
2. **the world's matter** — beings, ground letters, condensation
3. **the screen's few earned flat moments** — menu card, curtains

discipline test for every candidate below: *which of the three voices is
this?* if the answer is "none — it's software," reject.

refinement of the one-voice rule: at most one **voice** (typed language
addressed to you) on screen at a time. the margin queue already serializes
itself; screen() props (menu) are furniture, not voice, so they may coexist
with a margin line. any future dialogue/choice band (other forks' domain)
must **borrow the margin's rows**, never open a second band.

---

## 1 · arrival legibility — the threshold name

### what the writing calls each place

| stage | the writing's own noun (06.06.26.txt) | card text |
|---|---|---|
| gate | "Fate greets me at the gate" | `the gate` |
| cloakroom | "to the cloakroom where you can store your memories" | `the cloakroom` |
| willow | "the Mage under the Willow" | `under the Willow` |
| streetlamp | "the street-lamp in the strawberry field" | `the strawberry field` |
| theatre | never named as a place — only "the show begins" | `the show` |
| boat | "I wake up in a small wooden boat" | `the small wooden boat` |

note the theatre: the writing refuses to name it as a place (trailers, stage,
row, audience — never a building). "the show" keeps that refusal.

### the device: the transition names its destination

rejected form: a floating title card (screen-space text that fades in over
the world). that is a fourth voice — software — and it would read as UI.

adopted form: **the threshold name lives inside the veil overlay.** the
transitions are already letter-storms (the world dissolving into the
writing-alphabet). mid-dissolve, one centered row of those letters stops
being random and agrees on the destination's name. the world dissolves into
letters; the letters briefly agree on a name; then they become the place.
that is the piece's metaphysics doing the orientation.

mechanics (engine.js, ~30 lines):

- `transition(nextId, spawn, opts)` gains `opts.name`; night.js stages gain
  `name:` fields (table above).
- in `veilOverlay(t)`, after painting veil noise, if `trans.name`:
  - `r0 = floor(ROWS * 0.38)` — eye-line, clear of margin and marker
  - letterspaced ×3 (`t  h  e   g  a  t  e`) so it reads large without
    breaking the grid — at veil's 10×18 cell this is genuinely big
  - cleared band `r0 ± 1` (charBuf=0, depth 0.05) — the same silence the
    curtains line earns in boat.js
  - name letters slot `7*N_STEPS+0` (speech-white) against veil noise at
    `9*N_STEPS+2..4` (dim sky) — the only intentional thing in the storm
  - type-in during `out` phase (~18 cps), hold through `switching`, scatter
    with the margin's h2i fade during `in`
- the fold (boat→gate) names its destination `the gate` again — repetition
  is the point ("here and gone and gone again").

two-beat arrival grammar, both existing voices: **threshold name** (where)
as you cross, then the stage's **margin sentence** (why) once the world has
condensed — night.js `lines` already does the second beat.

## 2 · why-am-i-here, per stage

each place keeps ONE device, mostly already built:

- **gate** — orient: the path underfoot carries the opening paragraph; fate
  ahead; the exchange gives the why (you need a pass). built.
- **cloakroom** — *productive disorientation*: identical coats, symmetric
  aisle, a counter with no one behind it. the only orientation is the
  mushroom trail running through. keep the sameness — it is the point.
- **willow** — orient: the road IS the mouse's sentence (see §3). the rule
  line gives the why-detour ("All black cats must be registered…"). built.
- **streetlamp** — orient by waiting: the why is the wait; the road narrator
  carries the paragraph; margin types it on arrival. built.
- **theatre** — orient by seatedness: moveLock + trailers line. built.
- **boat** — disorient then resolve: you wake somewhere you didn't walk to;
  the why resolves as the fold.

### the questioning device (the margin asks, verbatim only)

- **adopt — the boat, facing her**: the entry's own deepest question is
  currently unused: *"I wander why,. I wander who sent you to find me and
  what I'm supposed to see. Am I supposed to see?"* (06.06.26.txt, ¶2).
  cue: on the boat, when the camera faces her (the white dancer) for >4s,
  margin types: `i wander who sent you to find me and what i'm supposed to
  see. am i supposed to see?` — the why-question at the night's deepest
  point, in his own words, at the being the night keeps out of reach.
- **adopt (mild flag) — resume**: `why was i here again?` on any mid-night
  reopen (see §6). already the fold's refrain in night.js; extending it to
  resume keeps one question as the night's hinge.
- **flag for bobby — the fold pair, cross-entry**: 16.07.26.txt reads
  *"Where am I to go than right here, right now?"* followed by *"There are
  many places to visit."* — as the fold's two margin lines (boat→gate) this
  is exact. but it is the night's FIRST text from outside 06.06.26. his
  call; the mechanism is one `lines:` entry either way.

## 3 · flow between scenes — the pull

generalize the mushroom-pulse grammar (gate.js: a traveling
`sin(t*2.2 - i*0.85)` brightening, outward = *this way*) so every stage has
one **leading element**:

| leg | leading element | status |
|---|---|---|
| gate → cloakroom | mushroom pulse, west | built — the reference |
| cloakroom → willow | the trail continues down the aisle — but its mushrooms are static | **adopt: give them the same traveling pulse** toward the counter/exit. few lines in cloakroom.js FIXED → per-frame lift. |
| willow → streetlamp | the road is the sentence: the mouse's paragraph is typeset east→west, reading order = travel direction | **adopt: "the unread brightens"** — a slow luminance pulse traveling the narrator polyline at reading pace: `g.lum += pulse(sin(t*k − s*λ))` where s = arc-length, one knob in lib/narrator.js apply(). walking becomes reading; the pull is the next word. applies to all narrator roads (gate path, cloakroom aisle, streetlamp road). |
| streetlamp → theatre | the lamp's glow is the beacon; the ride does the leg (streak) | built |
| theatre → boat | the directed leap sequence | built |
| boat → gate | stillness; no nav — the fold takes you | built |

should the transition announce the destination? yes — that is the threshold
name (§1). no other announcement.

## 4 · interface inventory — the discipline pass

### exists

| element | verdict | why |
|---|---|---|
| margin voice | **keep** | the spine; the writing as timed narration |
| stage lines on arrive | **keep** | the "why" beat of arrival |
| menu card + curtains (screen()) | **keep** | the earned flat moments |
| fold marker "gone and gone again · N" | **keep** | in-world memory, not HUD |
| honesty label (env model/recorded) | **keep** | non-negotiable discipline |
| e env toggle | **keep** | process affordance, documented |
| hint line (DOM, bottom-right) | **slim in dream mode** | `wasd walk · drag look · shift run` only; style keys (1-6 g l v k [ ]) are lab affordances — show them in ?lab. fewer words on the glass; register-hopping mid-night undercuts the director's choices. |
| marker line (DOM, bottom-left) | **slim in dream mode** | drop the scene id + register in dream: `anima.interact · env model`. printing "cloakroom" in the corner is the software voice undercutting "the cloakroom" at the threshold. lab keeps the full readout. |

### candidates

| element | verdict | why |
|---|---|---|
| threshold name in the veil | **adopt** | §1 — where-you-are, inside an existing voice |
| cold-open / resume condensation | **adopt** | §5, §6 — the night begins as it continues |
| narrator "unread brightens" pulse | **adopt** | §3 — pull as light, not UI |
| cloakroom mushroom pulse | **adopt** | §3 — completes the one grammar |
| boat she-question cue | **adopt** | §2 — the entry's own question, placed |
| resume margin line | **adopt** | §6 |
| dialogue/choice band | **hold — other forks' domain** | constraint reserved here: it must reuse the margin's rows and pause the margin queue while open. one voice at a time. |
| act/chapter numerals between stages | **reject** | the night is one entry, not chapters; the threshold name already segments |
| persistent pass/jacket inventory glyph | **reject** | RPG chrome. state is already shown in-world: fate's held grip, your coat on revisit, the goggles, the emptied sky |
| compass / map | **reject** | the writing has no map; disorientation is material. names + pulls carry wayfinding |
| objective text ("follow the mushrooms") | **reject** | the margin already issues instructions when they become true — that IS the doctrine |
| second text band anywhere | **reject** | one voice at a time |

net effect: v2 **removes** words from the glass (slimmed DOM lines) and adds
only in-world light and in-veil letters. the clutter budget goes down.

## 5 · the first minute (cold open, beat by beat)

currently `director.begin()` hard-cuts into the gate. adopt: the night
should open the way it continues — **condensing out of letters**.

- **0:00** — black → synthetic `in`-phase transition (style veil, dur ~2.6,
  name `the gate`): the first thing anyone sees is the letter-storm agreeing
  on a name, then becoming the place. (~5 lines: begin() seeds
  `trans = {phase:'in', name:'the gate', …}` after enterStage.)
- **0:03** — spawned at z=18 facing the gate. visible: the worn path (band
  5) with the opening paragraph underfoot ahead; the gate frame; fate's pale
  column; the castle silhouette on the far hill; near-full moon; slimmed
  hint bottom-right (`wasd walk · drag look · shift run`); slimmed marker
  bottom-left. the hint line is the ONLY software voice, six words.
- **0:05** — first W steps: the path reads as you walk (narrator underfoot,
  now with the unread-brightens pulse pulling toward the gate).
- **~0:12** — within 12 of fate → margin types: `fate greets me at the
  gate…` — the first voice. you learn: the margin is the writing happening.
- **~0:20** — near her → LINE1/LINE2 condense from the sky. you learn:
  beings condense; nearing is asking.
- **0:30–0:50** — the exchange (dialogue fork's domain — the pen, the
  tongue, the refusal of the old cards).
- **crossing** — pass typesets over the gate; tongue arcs to her grip;
  margin: `i pass her the tip of my tongue to write my cards` → `'1 visitors
  pass to tomorrow'` → the mushroom instruction. you learn: crossing pays.
- **westward** — the mushrooms pulse; following them is the first act of
  obedience. trailEnd → veil out → `the cloakroom` in the storm.

everything taught by doing, nothing by tutorial. `?fresh` stays a
bobby/testing affordance; the public entrance is bare term.html (an empty
localStorage is virgin anyway).

## 6 · resume (reopening mid-night)

state: `dream.stage` persists; begin() already re-enters the stage at its
arrive point and re-types the stage lines. adopt three touches:

1. **re-condense**: same synthetic in-transition as the cold open, with the
   current stage's threshold name — you condense back into where you were;
   the name tells you where, the manner tells you it's a dream resuming.
2. **the return question**: when booting with `stage > 0` (or folds > 0),
   margin types `why was i here again?` before the stage lines. one line,
   stage-agnostic, already the night's refrain. (mild provenance note: the
   line lives in the gate exchange; as the dreamer's own question it already
   travels — night.js uses it on fold-return.)
3. **trust the world**: the real return-signals are already in-world — the
   held grip, your coat by the entrance, the depleted sky, `gone and gone
   again · N`. the margin line only opens the door; no "continue?" screen,
   no save-slot language, ever.

## build list (engine touches, smallest first)

1. term.html + hud(): dream-mode slim hint/marker — ~6 lines
2. cloakroom mushroom pulse — ~6 lines
3. narrator unread-brightens pulse — ~10 lines in lib/narrator.js
4. boat she-question cue — ~8 lines in boat.js
5. threshold name: `opts.name` + stage `name:` fields + veilOverlay band —
   ~30 lines engine.js, ~8 night.js
6. cold-open / resume synthetic in-transition + return question — ~12 lines
   night.js/engine.js

flag for bobby: the 16.07.26 fold pair (first cross-entry text). tunable for
his ear: threshold name row (0.38), spacing (×3), type speed (18 cps).
