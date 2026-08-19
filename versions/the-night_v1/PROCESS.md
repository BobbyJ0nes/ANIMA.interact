# PROCESS — anima.interact

> the iterative process record for the ANIMA interactive piece,
> assembled 19.08.26 for IU000325 (Creative Making: Art & AI).
> everything referenced here exists in this repository; nothing is
> reconstructed from memory. exportable as-is to PDF.

## what this piece is

the 06.06.26 dream-writing (a 74.5-minute night session, EEG-recorded)
materialised as a browser-hosted world typeset entirely in characters:
a software renderer with no meshes, no lights, no pixels — the third
dimension is an act of typesetting, re-performed every frame. seven
canon scenes + four element studies + one data-twin scene, all driven
by an environment layer that replays the writing session's own
biosignals, honesty-labeled.

## timeline

- **17.08 — circuit v0.** vite + three.js skeleton of the dream's
  scenes, prose verbatim (typos preserved as artifacts). walked same
  day. `shots/v0_*`
- **17.08 — field_01.** the material found: ~28k coloured glyphs, the
  ambient field made of the writing's own letters, forms condensing
  out of it. `shots/field01_*`
- **18.08 — form-shop.** blender driven over its MCP socket by the
  agent; metaball figures → GLB → surface-sampled condensation
  targets. regenerative scene scripts in `shop/`.
- **18.08 — the verdict.** the polygon walk judged "generic af" — the
  pipeline worked, the material idea didn't live there. pivot.
- **18.08 — termfield_01.** "forget 3d in the standard context": the
  page renders the night. heightfield column-march typeset into a
  character lattice; a z-buffer of characters. `shots/term01_*`
- **18.08 — the style system.** six registers (night · folio ·
  phosphor · rose · page · veil), live-switchable; then tightening,
  the star catalog + typographic moon, wind, water-text.
- **18.08–19.08 — the split.** engine / env / scenes architecture;
  six scenes built by six parallel agent instances against a frozen
  contract (`src/term/scenes/CONTRACT.md`), each verifying itself
  headless. the EEG pipeline: raw 256Hz → per-second band powers →
  normalized channels + 1/f slope (`public/eeg/session01.json`).
- **19.08 — divergence.** seven exploration forks (water, sky,
  ground, beings, concepts, submission, eeg-subconscious) branched
  and returned: `explorations/*.md`, five walkable studies, and the
  synthesis in `explorations/CONVERGENCE.md`.
- **19.08 — verdicts + adoption.** four authored verdicts locked
  (visitation; the mute visitor; both crossings shown; `unshaped`
  joins canon), then the full adopt wave: speech-as-condensation,
  whispering moss, wakes, shore gradients, the depletion arc, moon
  phases, cliff strata.

## method — agents as medium, under authored constraint

the piece was fabricated by claude (fable 5) agent instances — in
conversation, in parallel forks, and in exploration fleets — but the
authorship structure is a constraint system written and enforced by
the author:

- **verbatim prose only.** every displayed line is from the author's
  own writing, typos preserved. agents never write display prose.
- **likeness drifts; sentiment, archetype, and actions locked** (the
  author's 18.05.26 rule). figures are presences, never portraits.
- **the honesty taxonomy.** LIVE / RECORDED / MODEL / SIMULATED —
  every data claim labeled; recorded biosignals presented as state,
  never content; a detected result never forced to agree with a
  prior artifact (the two crossings stand in the world, disagreeing).
- **signs type, beings condense.** mechanical speech for notices;
  condensation for voices — nothing appears from nowhere.
- **the visitor is a guest, and mute.** locked by verdict 19.08.
- **verification discipline.** every scene and every change verified
  headless (console-clean + screenshot review) before it counts as
  done. the shots in `shots/` are those verifications.
- **provenance discipline.** the author's typed words outrank agent
  interpretation; decisions are recorded (README settled-ground,
  CONTRACT non-negotiables) at the moment they land.

parallel agent work was orchestrated as: frozen contract → one file
per agent → self-verification → parent integration sweep → authored
verdicts → adoption. the fork reports quoted throughout the README
are the primary process documents of those phases.

## evidence index

- `README.md` — the living log: settled ground, studies, verdicts
- `src/term/scenes/CONTRACT.md` — the constitution agents build under
- `explorations/` — seven divergence documents + CONVERGENCE.md
- `shots/` — ~60 verification and process images, phase-prefixed
  (v0_, field01_, term01_, scene_, sweep_, x_*)
- `public/eeg/session01.json` + `session01_latent.json` — the
  processed session (methods in file meta; first 120s trimmed as
  strap settling; surrogate test: real joint structure 57.4% vs
  shuffled 18.6%)
- `board.html` — the 98-block reference board (visual language map)
- source headers — every source file carries an ai-use declaration

## ai-use statement

all code in `src/` and `shop/` was written by claude (fable 5) agent
instances working with bilaal auleear, who directed each step,
authored the constraint system above, made every design verdict, and
verified results in-session. all displayed prose is his writing,
verbatim. the critical report accompanying this piece is written by
him alone. per-file declarations: see the header of any source file.

## current state + unresolved

twelve scenes sweep console-clean. unresolved at time of writing:
the EC deadline date (governs submission sequencing); the scope
freeze (character-LLM figures argued as horizon vs built); repo
hosting + captured walk video (queued). see `explorations/
submission.md` for the submission plan this document serves.
