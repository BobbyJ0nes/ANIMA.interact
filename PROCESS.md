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

## the deeper enquiry

the piece did not begin with the build weeks. the night is one
manifestation of a longer enquiry — the ANIMA figures, Fate as a
recurring character, dreams as a subconscious space, the refusal to
force that space into a conscious shape — and the journal noticed all
of it before any code existed. rather than paraphrase, the record lets
the journal speak: **`source/JOURNAL.md`** holds the related passages
verbatim (censored to only what this work draws on), each linked to
where it lives in the piece. the set-aside directions are decisions in
this document's timeline, not dead ends: the three.js circuit judged
generic (the pivot that found the medium), the form-shop and
touchdesigner lanes parked as reference, Eros specified and never
trained, character-LLM figures argued as horizon, she_dream excluded,
the named EEG channels demoted so the unnamed latent could carry the
question.

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
- **19.08 — the night (v1).** the museum-not-dream verdict answered:
  a director sequences the writing's order (gate → cloakroom → willow
  → streetlamp → theatre → boat → the fold), transitions dissolve the
  world into its own letters, and the margin voice types the writing
  at the moment each sentence becomes true. full narrated headless
  playthrough green. frozen as `versions/the-night_v1/`.
- **19.08 — v2, the excavated night.** the author's story-mode note
  (navigable prose, characters with form/depth/autonomy, illusion of
  choice / inevitability of encounters, progressive liminality, less
  abstraction) ran as a structured wave: five parallel fable forks →
  `explorations/v2/` + `CONVERGENCE_v2.md`; a cross-model consult
  (gpt-5.6 over the pi harness, memo pair in `BASAIRA/.pi_tmp/`)
  whose critique changed the build — *conduct is not intention*, the
  unwitnessed state; the engine layer (chapter pages, the reading
  band, the faded hand, chosen→echo, the tempered liminal dial); four
  opus 5 instances, one per scene-domain, against the frozen
  contract; then full-night verification (zero errors, honest echo).

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
- **conduct is not intention** (19.08, adopted from the cross-model
  consult). the night reads position, facing, stillness, timing — but
  records a verdict only when clearly witnessed; an unmet offer keeps
  no interpretation and leaves only an '…'. the system refuses to
  manufacture psychology from telemetry — which is the piece's
  argument about predictive systems, enforced on itself.
- **verification discipline.** every scene and every change verified
  headless (console-clean + screenshot review) before it counts as
  done. the shots in `shots/` are those verifications.
- **provenance discipline.** the author's typed words outrank agent
  interpretation; decisions are recorded (README settled-ground,
  CONTRACT non-negotiables) at the moment they land.

parallel agent work was orchestrated as: frozen contract → one file
per agent → self-verification → parent integration sweep → authored
verdicts → adoption. the fork reports quoted throughout the README
are the primary process documents of those phases. from v2 onward the
loop also includes a second model family as critic: a design spec is
sent to gpt-5.6 ("sol") over the author's pi harness before building,
and the adjudicated critique is recorded beside the fork documents
(`explorations/v2/CONVERGENCE_v2.md`, `.pi_tmp/ideation-agents/`).

## evidence index

- `README.md` — the living log: settled ground, studies, verdicts
- `GUIDE.md` (also `/guide.html`, `export/GUIDE.pdf`) — the walker's
  guide: how to walk the night + the navigation premises, logic, and
  reasoning as an eleven-rule constraint record
- `src/term/scenes/CONTRACT.md` — the constitution agents build under
- `explorations/` — seven divergence documents + CONVERGENCE.md
- `explorations/v2/` — five v2 fork documents + CONVERGENCE_v2.md
  (with the sol-consult adjudication)
- `source/JOURNAL.md` — the journal where it touches this night:
  censored verbatim excerpts, each linked to its place in the piece
- `versions/the-night_v1/` — the frozen v1 build + VERSION.md
- `BASAIRA/.pi_tmp/ideation-agents/gpt56sol-anima-v2-consult-*` — the
  cross-model consult, turn and response, verbatim
- `shots/` — ~60 verification and process images, phase-prefixed
  (v0_, field01_, term01_, scene_, sweep_, x_*)
- `public/eeg/session01.json` + `session01_latent.json` — the
  processed session (methods in file meta; first 120s trimmed as
  strap settling; surrogate test: real joint structure 57.4% vs
  shuffled 18.6%)
- `board.html` — the 98-block reference board (visual language map)
- source headers — every source file carries an ai-use declaration

## the AI/ML in this work — approaches used, and refused

for the marker assembling LO2: the piece's AI/ML is deliberate in what
it uses and what it declines.

- **agentic LLM fabrication as medium.** the code was written by claude
  (fable 5) instances — in conversation, parallel forks, and a
  scene-per-agent build wave (opus 5) — under the authored constraint
  system above; a second model family (gpt-5.6, "sol") served as
  design critic, its adjudicated critique recorded. the disclosure
  granularity is per-file rather than per-section because fabrication
  was whole-file: the header IS the section comment for everything
  beneath it.
- **biosignal processing.** the writing session's EEG: per-second
  Hann-windowed FFT band powers, robust normalisation, a PCA latent
  (three components, surrogate-tested against shuffled data) — standard
  signal techniques implemented fresh for this piece, no library code
  copied; parameters in the data files' meta. the recorded replay
  drives ambient weather only, honesty-labeled.
- **machine learning refused, kept as limits.** Eros (a QLoRA voice
  fine-tune) is specified and deliberately untrained; character-LLM
  figures are argued as horizon, not built. the runtime contains no
  live inference — a stated position, not an omission.
- **privacy by architecture.** the conduct memory (`dream.chosen` /
  `echo`) lives in the visitor's own browser localStorage and is never
  transmitted anywhere; the raw journal and raw EEG stay local — only
  derived features and cited excerpts ship.

## ai-use statement

all code in `src/` and `shop/` was written by claude (fable 5) agent
instances working with bilaal auleear, who directed each step,
authored the constraint system above, made every design verdict, and
verified results in-session. all displayed prose is his writing,
verbatim. the critical report accompanying this piece is written by
him alone. per-file declarations: see the header of any source file.

## current state

the submitted piece is **v2, "the excavated night"** — consolidated
deadline morning on the author's word ("as is"). verification at
freeze: full-night headless playthrough gate → fold, zero console
errors, honest conduct-echo confirmed; twelve scenes sweep clean in
lab; production build + smoke green. v1 is preserved whole at
`versions/the-night_v1/`. scope frozen: constraint-system artwork
now, character-LLM figures argued as horizon in the report. five
display lines from journal entries beyond 06.06.26 are in the piece
under the corpus-widening law — cited file:line in scene headers,
each behind a removable constant (the README carries the register).
the critical report is the author's alone. see `explorations/
submission.md` for the submission plan this document serves.
