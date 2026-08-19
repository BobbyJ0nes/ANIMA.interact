# convergence — v2, "the excavated night"

19.08.26. five parallel fable forks explored the layers of bobby's note
(story-mode navigation; bigger navigable prose; characters with form/depth/
autonomy; illusion of choice, inevitability of encounters; progressive
liminal states; legible flow; interface without clutter; less abstract,
more dimensional — "for example Fate"). their full docs sit beside this
file: prose_dialogue.md, characters.md, choice_inevitability.md,
flow_interface.md, wildcards_submission.md. this file is the adjudication
and the build spec. v1 is frozen at versions/the-night_v1.

## the finding that names the version

the dream entry (06.06.26) already contains the depth v1 lacked. the Fate
exchange has six beats in the writing; v1 staged three. the card ("jack of
all trades, with an Ace up your sleeve"), the mute refusal ("my eyes told
it anyways"), her scold — all unplayed verbatim text. and the recent
journal is load-bearing: 17.08.26 contains the choice mechanic already
written ("Every time a faded hand extends itself to me, for some reason I
decline and wait patiently for a formed one to pull me by my arm") and the
cloakroom's meaning (jackets each slightly larger, for when he outgrows
them). **depth is excavation, not invention.** v2 widens the corpus, never
the authorship.

## laws (carried from v1, plus three new)

1. all display prose is bobby's writing, verbatim incl. typos.
2. nothing from nowhere — every element names its root in the vault.
3. the visitor is mute everywhere. choices are never the visitor speaking.
4. signs type, beings condense. **new: voices type, objects appear** —
   speech and pages type character-by-character; handed objects (pass,
   menu, card) arrive whole.
5. one typed voice on screen at a time. no second band, ever. no fourth
   voice: everything is margin, world-matter, or an earned screen() moment.
6. honesty labels: LIVE / RECORDED / MODEL / SIMULATED.
7. **new: choices are never branches — they are who you were while the
   same thing happened.** three species only: false forks, refusable
   offers, timed inevitabilities. refusal always advances the night.
8. **new: corpus widening** — display lines may come from any typed entry
   in `98 - Journal/` with a citation (file:line) in the owning scene's
   header comment. excluded entirely: she_dream.txt (bobby's exclusion),
   prayer-addressed lines, any '--- prompt' / model-mediated text.
   every cross-entry line ships flagged in the readme for bobby's veto.

## the adopted systems (build wave 1)

### s1 — chapter pages (the transition becomes the writing)
root: the entry's six paragraphs; f1 #1 + f5 #2 + f4's threshold name,
merged. during a stage transition's out-phase, the letter-storm agrees on
one centered row: the destination's name in the writing's own words
(`the gate` · `the cloakroom` · `under the Willow` · `the strawberry
field` · `the show` · `the small wooden boat`), letterspaced, cleared
band. at full veil the name holds as heading and the stage's verbatim
paragraph typesets beneath (measure ~54, ~34cps, '▄' cursor). Space
completes the typing; Space again turns the page — the world condenses
out of the paragraph's letters. 45s safety auto-advance. `?lab` never
pages. provenance becomes the story's structure: you always know where
you are and why — because the writing is telling you.

### s2 — the reading band + two-layer speech
root: the entry's quoted dialogue + condense doctrine; f1 #2 under f4's
one-voice law. `speak([{text, at}])` grows the margin band to up to 5
whitespace-cleared rows (~30cps). while a line types, the speaking
being's condensation pulses at `at` — you know the speaker by whose
letters are in the air. margin narrate() suppressed while speak() holds
the band; queue, never coexist. walking out of radius scatter-fades and
re-offers on return.

### s3 — the faded hand (choice grammar)
root: 17.08.26, found independently by three forks. at each decision a
dim hand condenses (band 2, letters barely settling); the formed
alternative arrives regardless. taking it or declining is read from
conduct — position, facing (new engine `facing(x,z,cone)`), stillness,
timing — never from a prompt. the night absorbs refusal and advances;
`dream.chosen` remembers who you were. the theatre menu is the one
deliberate exception: the night's only cursor (A/D + Space), which always
serves "reminisces in a Martini glass" — a cursor that exists in order
not to matter.

### s4 — chosen → echo (consequences travel)
root: f3's schema + f5's audit. `dream.chosen` (this night's conduct,
~9 keys) swaps into `dream.echo` at the fold; echoes read only `echo`,
so night one is pure canon and the second night greets your conduct
(Fate scold-first; the tried-on coat pauses its sway; the rowed-all-night
sea gets its line). plus travelers within one night: the unregistered
black cat (refused at the willow, joins the lamp wait, slips into the
theatre), the `…` that condenses wherever your speech would go (the
tongue's cost, visible), Fate's inkless pen paying off when the card
lands.

### s5 — the liminal dial
root: f3; f4's slim-dom folded in. `liminal() = stage/5 * 0.7 +
0.1*min(folds,3)`, authored (MODEL — the arc is narrative time; env is
body time; they multiply, never impersonate). gains only: fog ×1.35 cap,
letterland +0.25, star depletion becomes the dial's arc (boat floor
0.08), rampCeil −1 above 0.6 (solids withdraw), margin cps 26→18 with
settle-jitter (the voice gets sleepy; the words stay verbatim),
transition durs ×1.5. rejected: register drift, i→you person shift
(verbatim lock). dream mode slims the dom: hint → six words; corner
marker drops the scene id (the world, not the software, says where).

### s6 — the excavated beings
root: f2's autonomy grammar — every being answers four questions:
idle (env-coupled, camera-indifferent life), notice (the body admits you
before any words), engage (gated by conduct: stillness, facing, timing),
remember (fold- and revisit-state). codified in CONTRACT.md; implemented
as per-scene closures (no engine Being class — over-architecture).
wave 1 builds: **Fate's full six-beat exchange** (idle: writing with no
pen, letters failing to settle; notice: the column's held breath; the
faded hand extended — declining real, absorbed; payment; the card; the
eyes-told refusal as letters that try to condense and fail; her scold
flaring the fog; fold-memory greetings for folds 1/2/3), **otter
gaze-witness** (hold your seated yaw on him ~3s → his sourced inner
life), **coats size-gradient + try-on**, **cats' registration queue**,
**lamp company/pace conduct**, **the leap refusal** (first step off the
ledge refuses you — feet dangle, held breath; the floating stairs
complete it from their end), **she + the boat question** (facing her >4s:
"i wander who sent you to find me and what i'm supposed to see. am i
supposed to see?").

## held for bobby (not built until his word)

- the three cross-entry margin lines under f3's cited budget, and f4's
  fold-pair from 16.07.26 — flagged; silent fallbacks ship.
- the identities line (17.08.26, heavy), theatre Fate-glimpse (cut —
  likeness risk), ghost bridge (stretch), the misfit i (f5 #5),
  murmuration near-word, false dawn (standing holds).
- repo + hosting + captured video: PARKED, his accounts.

## rejected (and why, once)

map/compass; act numerals; portraits or name-tags; numbered dialogue
options; a second band; world-pause during text; HTML chrome; register
drift and person-shift (verbatim lock); engine Being class; score of any
kind. the night must feel like the book noticing you, not software.

## build ownership (wave 1)

- engine.js + night.js + lib/hand.js + CONTRACT.md — fable (this
  session). primitives: trans page phase, speak(), cardShow(), facing(),
  Space capture hierarchy (page → card → speak → world), liminal(),
  chosen/echo state + fold swap, slim-dom dream mode.
- gate.js (Fate + hand's first appearance) — opus instance A.
- cloakroom.js + willow.js (coats, cats, travelers seeded) — opus B.
- streetlamp.js + theatre.js (conduct, cursor, otter, rerun, leap
  refusal) — opus C.
- boat.js (rowing refused, she + question, echo lines, breathing swell
  RECORDED label) — opus D.
- playthrough.js extension + full verification — fable, after merge.

each opus owns its files exclusively; engine API is frozen before they
launch; scene headers cite every sourced line (file:line).

## the sol consult (gpt-5.6 over the pi harness, 19.08 — bobby's ask)

full memo pair in `BASAIRA/.pi_tmp/ideation-agents/gpt56sol-anima-v2-*`.
sol's read: v2's danger is opacity, not abstraction — inevitability only
lands if the visitor first feels *received*. adjudication:

- **adopted — conduct is not intention**: a verdict is recorded only when
  clearly witnessed; the unmet offer resolves to 'unwitnessed', the night
  keeps no interpretation, and the '…' is its mark (the system admitting
  what it cannot honestly resolve). built into lib/hand.js + CONTRACT.
- **adopted — never gate character depth behind invisible conduct**:
  Fate's six beats play for everyone who reaches her; conduct shades
  timing, fog, memory — never whether depth exists.
- **adopted — Space two-state legibility**: held-Space guarded, a beat
  required between complete and turn, the resting pen marks "done",
  safety advance 45→28s.
- **adopted — speak grace**: a step out of radius isn't a walk-out;
  only staying gone (1.2s) scatters the line.
- **adopted — page as causal residue**: condensing in after a page, the
  storm's letters are mostly the page's own words — the place is legibly
  made of what was just read.
- **adopted — menu gets an immediate perceivable consequence** (how the
  same drink arrives), the lamp wait gets accumulating visible beats,
  cross-entry lines are checked in their surrounding paragraph, honesty
  covers inference (weather is never a diagnosis, memory never motive).
- **tempered, not cut — the liminal dial**: sol argued to cut the global
  scalar; progressive liminality is bobby's explicit ask, so the dial
  stays but its global gains are halved (fog ×1.18, letterland +0.12,
  solids withdraw only past 0.75, margin floor 20cps, jitter halved) and
  the felt escalation moves into each scene's own authored deepening —
  exactly one legible liminal coupling per scene, gains only.

## the submission line (from f5, kept whole in its doc)

v2's story-mode completes the critical claim: the faded-hand grammar
renders life inside predictive systems — decline everything; it arrives
anyway — as felt form, sourced verbatim from the author's journal,
evidencing the learning outcomes in mechanics rather than wall text. the
constraint system stays the method; the corpus widens but no agent prose
ever displays. the EEG deepens honestly: a recorded night setting the
weather of a written one, breathing, labeled — never a picture of a mind.
