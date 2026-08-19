# ANIMA.interact

> working base for the anima interactive piece — the 06.06 dreamworld
> materialised as a browser-hosted 3d liminal space.
> art & ai module vehicle (IU000325)

## run it — for the assessor

**hosted, nothing to install:**
https://bobbyj0nes.github.io/ANIMA.interact/ — the landing routes you
into the night.

**or locally** — requirements: node 18+ and npm, nothing else.

```
npm install
npm run dev        # → http://localhost:5199
```

open **http://localhost:5199** — the landing routes you into the piece.

**walking the night** (`/term.html`, or `/term.html?fresh` for a first
night with nothing remembered):

- **wasd** walk · **drag the mouse** look · **shift** run · **space**
  is the only button (finishes a typing line, turns a chapter page,
  lowers a card)
- the margin at the foot of the frame types the author's own sentences
  as they become true — they are the night's only instructions
- choices are conduct — where you stand, what you face, how long you
  stay; declining anything never blocks the night
- the night plays gate → cloakroom → willow → strawberry field →
  the show → the boat → the fold, and begins again, remembering
- stuck anywhere: `GUIDE.md` (or `/guide.html`) — part one walks every
  stage; part two documents the navigation design

**the other assets, same server:**

- `/guide.html` — the walker's guide (also `GUIDE.md`, `export/GUIDE.pdf`)
- `/term.html?lab` — process view: free roam, `,` / `.` cycle all
  twelve scenes (canon + element studies), no director
- `e` in the piece — toggle the environment source: **model**
  (oscillators) vs **recorded** (the 06.06.26 writing session's own
  EEG, replayed); keys `1–6` switch typographic registers
- `/board.html` — the 98-block visual-language reference board
- `/field.html` — the field study (the material, pre-night)
- `/circuit.html` — circuit v0, the first walk (superseded, kept as record)
- `source/06.06.26.txt` + `source/JOURNAL.md` — the writing the night
  is built from · `PROCESS.md` — method + evidence · `shots/` —
  verification frames · `versions/the-night_v1/` — the frozen prior form

production build, if wanted: `npm run build` → `dist/`, serve statically.
this file is the living log, newest sections toward the end — the v2
sections and the settled submission shape are the current state;
everything above them is kept as record.

## source material

- `../writing_session_001/` — the writing, photographed on the macbook
  (6 DNG) + the biosignal poster (IMG_0876.PNG)
- `98 - Journal/06.06.26.txt` — the text itself. the level design is in here.
- `../EEG/data/open_*.csv` — the session's raw trace (74 min, 00:24–01:42 BST)
- the white lady (`she_dream` / 18.05.26) is **not** in this piece — another
  night, another register

## settled ground — bobby

- browser-hosted 3d liminal space
- scenes: `the-castle-on-the-hill` · `fate-at-the-gate` · `the-cloakroom (/)`
  · `the-mage-under-the-willow` · `the-streetlamp-in-the-strawberry-field`
  · `the-theatre`
- conclusion: the interactor dives into the water (the subconscious) and the
  dream folds back to its start
- structured but diffused — skeleton fixed, surface re-rendered per visit

> accuracy note (fable): `the-castle-on-the-hill` is where the writing
> *starts* ("I met her at the castle on the hill") but it was built as horizon,
> not as a walkable scene — it stands as the silhouette far north of the gate.
> in the report and any claims: describe it as horizon; the walkable canon is
> gate · cloakroom · willow · streetlamp · theatre (+ boat · crossing · unshaped).
  (the otter's reminisces, the moss)
- nuance in the figures' responses — likely fine-tuned character llms;
  hallucination as part of the dream-scape
- prose throughout, taking form in various ways

> _fable margin note:_ the hallucination policy is bobby's own line (18.05.26):
> likeness drifts, **sentiment and archetype locked**. the trailers can be the
> loading screen. the first line of the text is the world's one prohibition.

## aesthetic direction — ideation (open, not settled)

bobby's references: *touch* by supernova191919 (`inspo/touch_supernova/` —
"a simulated system becomes a metaphor for existential meaning"), old
free-world games (pokémon, zelda), **stray** (biggest), intranet girl.
not walkable poetry — "an experience and an architect of a form of
reflection through this medium." whimsical + fable-ey + a computationally
linked form of mysticism.

the seed image is his own (`she_dream` / 18.05.26): *"the space where the
lost woman occupies shifts from figure to space, white numbers and symbols
appear in her place."* → **3d glowing ascii beings, voice formed out of
arranged characters.** pretext for metric-true settles. prior art in-vault:
the `rose` ascii field (+ `soleil d'hiver` variant), `seventeen`,
`EEG_RedBook_Folio.html` (gold-leaf register).

candidate rules (fable, for veto):
- **hue + rhythm locked per being (sentiment), glyph arrangement drifts (likeness)**
- speech = the being lends its body-characters to the line; scatter on silence
- resolution as honesty: scripted settles crisp · recorded shimmers ·
  model never fully settles
- english is rare (stray rule) — most glyphs never resolve; leaning resolves

## circuit v0 — built + walked

- `npm i` then `npm run dev` → http://localhost:5199 · vite, plain js
  (this v0 walk used three.js; the shipped piece at `/term.html` does not —
  its renderer is the termfield engine, no 3d library)
- the walk: fate-at-the-gate → (the pass · any key) → the-cloakroom →
  the-mage-under-the-willow → the-streetlamp-in-the-strawberry-field →
  (00:68 · trailers) → the-theatre → (the leap) → the-boat →
  ** curtains close ** → the fold
- **the fold works** — back at the gate, the margin reads
  `gone and gone again · 2`
- all display prose is verbatim from `06.06.26.txt` — typos preserved,
  they're artifacts
- placeholder geometry is doing spec work: likenesses stay unresolved
  on purpose. fate is a pale column; the otters are three capsules,
  the left one 15cm too far and facing away
- the lamp runs his full tired cycle (26s); the ride only arrives after
  he has been tired once. waiting is the mechanic
- one scene = one module in `src/scenes/` — depth accretes per scene
  without touching the circuit
- `shots/` — the walk, frame by frame (process record)
- dev handles: `window.anima.next()` / `.goto(i)` / key `N` — not part
  of the dream

> _fable margin note:_ the trailers hold before the theatre is sized for
> prose now, but it is the natural loading screen if the figures become
> local models later. the visit counter phrased through fate's own line
> is an editorial choice — veto freely.

## field_01 — the field takes form (study)

the world-material candidate: a navigable night of ~28k coloured glyphs
(one instanced draw, everything in the shader). run the dev server →
`/field.html`. wasd to fly · space rise · shift sink.

- the ambient field is made of **the writing's own letters**, cycling
  identity slowly; night population: indigo · teal · moss · ink ·
  dusty rose · rare gold flecks; the night's temperature slowly turns
- **forms condense out of the field** — nearest drifting glyphs are
  recruited, fly in arcs, rise bottom-up; released, they scatter back
  to their drift. nothing appears from nowhere; everything is always
  the field (the she_dream move, both directions)
- cycle: the white lady → the line ("we're all here and gone and gone
  again." typeset from the field's letters) → the rose → the streetlamp
  (its light-cone itself made of characters) → the willow → repeat,
  anchors drifting per cycle
- `shots/field01_*` — the five forms, captured
- dev: `window.field.cam(x,y,z, tx,ty,tz)`

> _fable margin note:_ dense cores still bloom white-hot (the rose's
> heart, the lady's torso) — feature or bug is bobby's call. legibility
> vs point-cloud-density is the live calibration axis.

## engine + venue — research (fable, for decision)

- **blender mcp is first-class now** — anthropic ships an official blender
  connector (claude for creative work); ahujasid/blender-mcp remains the
  open path. objects, materials, lighting, poly haven, hyper3d gen,
  arbitrary python. local install is **blender 3.6 → upgrade to current**
  before wiring the connector.
- **unity has an official mcp server** (unity 6.1+, ai assistant package,
  project settings → ai → unity mcp). real editor + timeline + audio, but:
  c# + editor learning under crunch, the glyph-field shader would need a
  full rebuild, webgl builds are heavy where three.js loads instantly.
- **godot**: community mcp servers (gdai, coding-solo, runtime bridge).
  lighter than unity, still an engine switch.
- **itch.io**: indie marketplace + free hosting where this genre lives
  (touch is there). html5 = zip with index.html, ≤500mb extracted,
  ≤200mb/file, relative paths; embed or click-fullscreen; devlogs; jams;
  html5 payments are donation/pwyw. browser build = zero-install
  strangers = the external-hands proof.
- **recommendation**: blender (upgraded, via mcp) as the **form-shop** —
  sculpted/blocked meshes exported as glb, surface-sampled into
  condensation targets (three.js MeshSurfaceSampler) — three.js stays the
  runtime; itch + own domain as venue. unity/godot only if the piece
  outgrows dream-walk verbs — a gate, not a closed door.

## the form-shop pipeline — proven

blender 5.2 (upgraded via winget) · blender-mcp addon installed + enabled ·
mcp server registered user-scope in claude code (`uvx blender-mcp`) —
**tools appear in new sessions**; this session drove the addon's socket
directly (`localhost:9876`, same channel mcp uses).

the test: modelled the lady as metaballs → mesh → decimate (544 verts) →
glb export → `public/forms/lady_v1.glb` → `loadShopForm()` in
`src/field/forms.js` (GLTFLoader + MeshSurfaceSampler) → the field
condenses into her as "the lady, from the shop", same anchor as the
procedural lady for likeness comparison. shot: `shots/field01_6_*`.

> _the loop from here:_ edit her in the open blender (she's live in the
> viewport) → re-export the glb → refresh the page. sculpt there,
> condense here.

second pass through the same wire: **fate** (hooded metaball
figure, leaning 4°, pen-hand extended — `fate_v1.glb`, 544 verts) and
**the gate** (posts, finials, nine bars, bead-arch — `gate_v1.glb`,
445 verts). `loadShopForm` now takes per-form height + colours and
recentres blender placement offsets. **`/field.html?shop`** = review
mode, shop forms only, short holds. shots: `field01_7..9_*`.

## scene_01 — the shop's scenes, walkable

**`/scene.html`** — first-person walk through real geometry from the shop:
the gate + fate at spawn under moonlight, the strawberry field a short
walk away (repositioned from its exported +80m to ≈(34,0,-6)). the lamp's
**blender-keyframed tired cycle plays live** (verified: −0.070 rad at
t=19s, wall-time mixer), with a warm light parented to the bulb so the
glow leans with him. the glyph field runs quiet underneath as dream-matter
(11k, low glow). shots: `shots/scene01_*`.

the shop is durable now: `shop/anima_shop.blend` (saved scene) +
`shop/*.py` (regenerative source, incl. `clean_scenes.py` for fresh
re-dressing). route map so far: `/` circuit skeleton · `/field.html`
the material (+`?shop` · `?tune`) · `/scene.html` the walk ·
`/term.html` **termfield_01, the page renders the night** ·
`/board.html` **the reference board** — 98 blocks, 12 channels
(are.na-style: the seed, glyph matter, dream logic, small-being,
tile kindness, illuminated register, light-in-darkness, computational
mysticism, soft web, anti-models, instruments, specimens). every block
carries a *take*; edit the BLOCKS array in `board.html` to grow it.
images live in `public/ref/`.

## termfield_01 — the page renders the night (study)

bobby's pivot: *forget 3d in the standard context* — track inputs and map
the dreamworld onto a plane of ascii. so: **`/term.html`** is a software
renderer with no three.js, no meshes, no pixels. the world is a height
function plus a few letter-clusters; every frame it is **typeset** into a
lattice of ~5k character cells (a z-buffer of characters decides what
sits in front). `src/term/main.js`, one file, ~400 lines.

- the land: column-marched heightfield (voxel-space lineage), shaded by
  the density ramp ` .·:;+*#@` — terrain never climbs into the block
  chars; those belong to beings. distance = fog toward bg + sparser type
- **the water is the writing** — where the land sinks under the level at
  the south edge, cells become the text's own letters, cycling identity.
  the sea at the edge of the world is literally the text. the dive-site.
- the sky (reworked after "sky looks shit"): a fixed **star
  catalog** at infinite distance — real parallax on turning, brightness
  hierarchy (dots mostly; letters rare), twinkle, the whole night
  rotating once per ~26 min — and a small **cratered typographic moon**
  (ramp-shaded disc, pale band). stars only render above each column's
  skyline
- ambient movement (same session): **wind** — interference gusts of
  luminance sweep the meadow and re-typeset it as they pass; the
  water-text **streams** along the shore; seven **fireflies** wander
  and blink over the field; grid tightened ~2× (per-register cells,
  e.g. night 8×14, phosphor 7×12 — `[ ]` still rescales)
- the lamp lights the text: its cone recolours the land's characters
  gold; the pole is a '│' strand with the '@' bulb; the 26s tired cycle
  runs (sag + lean + flicker)
- **fate's line typesets itself by proximity** — approach the gate and
  "we're all here and gone and gone again." resolves letter by letter
  into the night air, spacing breathing with distance. the ascii-voice
  seed, native to this renderer
- gate ('║','═' + bead-arch), fate (pale '▒' column, likeness
  unresolved), the hill + castle silhouette far north, the worn path,
  rose berry-flecks in the low field
- wasd walk (terrain-clamped, walks on water) · drag or arrows look ·
  shift run · space = dream buoyancy
- **a frame is text**: `window.term.text()` returns the whole view as a
  string — `shots/term01_frame.txt` is a saved frame. screenshots:
  `shots/term01_*`
- dev: `window.term.cam(x,z,yaw,pitch)` · `.state()` · `.style(name)` ·
  `.toggle('glow'|'scan'|'vig'|'letters')` · `.scale(n)`

**the style system** — six registers, live-switchable
(keys 1–6, persisted, `?style=name` deep-links), each a full re-voicing
of the same world: **night** (baseline + indigo horizon glow) ·
**folio** (gold land, lapis water, ember horizon, glow — the
illuminated register) · **phosphor** (one green, scanlines + bloom,
letters-dense — CRT honesty) · **rose** (green-black + dusty rose,
the rose-field heritage) · **page** (ink on parchment, letterLand 1.0,
distance = ink fading — the world as printed page; the sea of writing
reads as a manuscript pooling at the page's foot) · **veil** (pale
blue-greys, heavy fog, the lamp a warm whisper — the liminal fade).
independent treatments on any register: `g` glow (downscale bloom;
ink-bleed multiply on page) · `l` scanlines · `v` vignette · `k`
letter-land cycle (the ground remembering it is text) · `[` `]` grid
density. contact sheet: `shots/term01_style_*.png`.

> _fable margin note:_ the distinction this study defends: **ascii as
> material vs ascii as filter.** the standard route (render 3d, swap
> pixels for chars by luminance) is the anti-model wearing a costume.
> here nothing exists that isn't a character — donut.c's honesty at
> landscape scale. not yet in it: condensation (sky letters recruited
> into forms — next part), and the sibling reading of the pivot (the
> writing lying on a literal page whose surface rises into relief).

## termfield_02 — the split (parallel build)

the field became a world-system. `src/term/` is now: **engine.js** (the
typesetting renderer, scene-agnostic) · **env.js** (the environment-state
layer) · **scenes/** (one file per scene, auto-discovered; contract in
`scenes/CONTRACT.md`). run: `/term.html?scene=<id>` · keys `,` `.` cycle
scenes · `e` toggles the env source · everything else as before.

**the env layer** — the world's weather is a signal, honesty-labeled:
`MODEL` = coupled slow oscillators; `RECORDED` = the 06.06 writing
session's own EEG (muse athena s, raw 256Hz×4ch from `EEG/data/open_EEG.csv`,
first 120s trimmed as strap-settling) preprocessed to
`public/eeg/session01.json` — per-second band powers via hann+fft, five
channels (drift/depth/focus/tension/spark) + 1/f slope + a detected
regime-change ("crossing") at **~50.5 min** — nb: the biosignal poster
says ~min 28; the two analyses disagree and the data's own answer was
kept. the engine couples env globally (wind←tension, fog←depth,
twinkle←spark, water-stream←drift); each scene adds one or two mappings
of its own. LIVE muse streaming is the unopened door.

**the seven scenes** — six built in parallel by six fable forks, one
register + one notation + one env mapping each (their build reports are
the process doc):

- `gate` (night) — fate, the pass, the castle silhouette. the reference.
- `streetlamp` (rose) — his tired cycle now driven by the body: tension
  tires him faster; at the crossing he stands up straight mid-sag.
  the tuxedo mouse scurries every 47s. "My ride arrives at 00:68."
- `cloakroom` (veil, slash-voiced ramp) — corridor of hanging memories;
  depth hangs more coats; the crossing is one wind through all of them.
  "all dreams are FINAL and cannot be returned after issue."
- `willow` (phosphor, paren-voiced) — the tree breathes with drift,
  spark drops falling leaf-letters, black cats hop cell-clocks.
- `theatre` (folio) — the flamingos' layered cards, the lapis one
  swaying at the perceptual threshold (crossing resolves the doubt);
  otters (left one displaced, as written); the boat hidden backstage.
- `boat` (page) — the ledge, the stairs, the ink moon low and large,
  stars 0.08 ("they've all moved out now"); slope = the sea's agitation.
- `crossing` (night) — the session AS terrain: five channel-dunes along
  74 minutes of x; the detected crossing is a veil of light read from
  the data (absent if the data is absent); in RECORDED mode a cursor
  staff walks the valley where the replay is now. digits for a sea.

full-circuit sweep: 7 scenes × zero console errors, cycling + recorded
env verified. shots: `shots/scene_*` (builders' vantages) + sweeps.

**divergence** — seven exploration forks (water/sky/ground/
beings/concepts/submission/eeg-subconscious) branched and returned:
five walkable experiment scenes (`x_sea`, `x_sky`, `x_ground`,
`x_beings`, `x_latent` — in the `,`/`.` cycle), full docs in
`explorations/*.md`, synthesis + decision list in
`explorations/CONVERGENCE.md`. twelve scenes sweep clean. headline
findings: **signs type, beings condense** (speech flies in from the
sky); the depletion arc; whisper moss; the boat sea's refusal; 3
unnamed EEG components = 96.8% variance with a passed surrogate test
(`x_latent` = the unshaped ground vs `crossing` = the named map);
submission brief found + quoted (hosted URL + walk video + mandatory
repo; per-code AI-use comments required and currently absent).
engine warts collected from the builders (line axis is x-only, line x
offset is legacy-compensated, single-cell beings weave open at <5m) —
noted for the next engine pass, not silently fixed.

## the margin voice — on "story too fragmented / not intuitive"

bobby's second verdict: environments and vibe hold; the story doesn't
come through, and the night isn't intuitive. diagnosis: the narrator-
as-path is texture, not story (illegible murmur), and the night's verbs
are invisible. the fix: **the page gets its margin.** the writing types
itself along the bottom of the lattice — one line at a time, cued at
the exact moment each sentence becomes true. because the writing
narrates the visitor's own actions ("follow the glowing mushrooms…",
"i should get going", "…get up and walk"), the story ties itself AND
the story is the tutorial. no ui invented; a page has a margin.

engine: `narrate(text)` — queued, typed at 26 cps into a cleared
whitespace band, held, then scattered; queue drops on scene change (a
new place gets a fresh voice). ~20 cues wired: the fate exchange, the
pass and its instruction, the cloakroom reminder, the mouse's errand,
the wait ("i waited some time…" → "i could sense him getting tired…"
→ "my ride arrives at 00:68." → "only a couple minutes to late, i
should get going."), the full show script (curtains → applause →
storks → sip → flamingos → drink → drifting → jacket = the stand cue),
the gecko's apology, the ledge sequence ("i toss a rock below" →
"there's never a splash" → "i take a leap of faith anyways"), the
wake-up, and "i know i'm safe and i drift off once again." on the
stillness that folds the dream. boarding now holds the door aglow
while its line lands; the menu auto-lowers after 16 s; the mushroom
pulse travels trail-ward (this way); the sag-witness threshold eased
so the wait is one honest cycle (~36 s verified).

full narrated playthrough green, zero console errors, twice.

## the night — on "still not doing it for me" → "build it"

bobby's verdict on the museum: doesn't gel, doesn't hold the weight.
diagnosis (agreed): the piece had the dream's language but not its
FORM — no sequence, no narrator, one experience everywhere, nothing
happening to you. the reform: **the ride, not the museum.**

`/term.html` now plays THE NIGHT by default, in the writing's order,
one continuous dream (`?lab` keeps free roam + the scene picker + the
studies). `src/term/night.js` is the director; transitions dissolve
the world into its own letters and recondense the next place (veil ·
streak for the ride · fall for the leap):

gate (the pass paid, the opening paragraph laid letter-by-letter along
the path underfoot — the narrator is the ground) → follow the glowing
mushrooms west → cloakroom (the notice underfoot; the jacket stored) →
the road past the mage (the mouse's paragraph walks with you) →
streetlamp: **the wait is the mechanic again** — keep him company
through one full tired cycle and the ride comes and, once, STOPS,
door aglow; miss it and you wait with him again → boarding is the cut
→ theatre, SEATED: the curtain draws, the otters' introduction
condenses on the show's clock, `* applause ensues *`, then **the
menu fills the frame** — a gold-bordered card, the one earned
full-screen text in the piece (space puts it down) — the flamingos'
cards dance, the drink is strong, and leaving early is the only verb
→ the walk to the stage, the floating stairs, the leap → boat: the
sea, the she, the ledge — and STILLNESS beside the boat is the
drift-off → `** Curtains close **` → **THE FOLD**: back at the gate,
`gone and gone again · 2` hanging in the night, the pass to pay
again, memories to re-store, a few more stars gone.

verified: full headless playthrough, gate to fold, zero console
errors (the wait took a real 32 s); lab sweep still ALL CLEAN.
shots: `shots/night_01..11_*`.

## the adopt wave — on "go, full adopt list"

everything ranked in `explorations/CONVERGENCE.md` landed in one wave,
twelve scenes sweeping clean after: **engine** — per-scene `water()`
hook, shore condensation gradient at every island's edge, the
depletion arc (visited scenes drain the stars), the moon spec
({phase, halo, waver} — every scene now has its own moon-mood),
`condense()` (speech flies in from the night; the sky dims while
letters are aloft), the `face()` fill hook, line-axis option + the
legacy offset killed, `onWater()`. **scenes** — fate and the middle
otter now speak by condensation (signs type, beings condense); the
whispering moss stands at the gate's approach, murmuring single
letters of its own line; wakes ripple behind the walker on every
ring-sea (never the boat's — "There's never a splash"); the boat's
23-meter face renders as strata of buried letters. **paperwork** —
every source file carries an ai-use header (brief requirement);
`PROCESS.md` assembles the whole record. still parked for bobby:
repo + hosting + captured walk (need his accounts + a publish word).

## settled — bobby's verdicts on the convergence brief

- **visitation locked** (with misrecognition) — the interactor is a
  guest; figures may look past them, searching for someone else
- **the visitor is mute everywhere** — the tongue paid at the gate is
  now visible: pale cells arc from the visitor to fate's empty grip at
  the crossing of the gate; she holds it ever after. no exception at
  the mage's book
- **both crossings shown** — the crossing scene carries two witnesses:
  the data's pale veil at min ~52 and the poster's madder marks at
  min ~28, each wearing its minute in digits. the disagreement is the
  honesty
- **unshaped joins the circuit** (formerly x_latent) — the piece makes
  its subconscious question as the crossing/unshaped pair: the named map
  and the unshaped ground, performing the solipsist tension

## versioned — the-night_v1 (frozen)

the night as walked (`?fresh` entrance, margin voice, full
green playthrough) is snapshotted whole at `versions/the-night_v1/`
with a `VERSION.md`. v2 forks from it in place; the frozen copy is
the reference point for every verdict that follows.

## v2 — the excavated night (one structured wave)

bobby's note: story-mode navigation; dialogue and prose bigger,
immersive, navigable; characters with form, depth, autonomy; an
illusion of choice, an inevitability of encounters; progressive
liminal states; scenes that flow, a walker who knows where they are
and why — or is made to question it; slightly less abstract ("for
example Fate"); document, version, fork.

**the wave:** five parallel fable forks (prose/dialogue · characters ·
choice+liminality · flow/interface · wildcards+submission) →
`explorations/v2/*` converged in `CONVERGENCE_v2.md`. the naming find:
the dream entry already contains the missing depth — Fate's exchange
has six beats in the writing, v1 staged three; the recent journal
carries the choice mechanic already written (17.08.26's faded hand).
**depth is excavation, not invention.** then a cross-model consult —
gpt-5.6 ("sol") over the pi harness — whose critique changed the
build: *conduct is not intention* (verdicts only when witnessed; the
unmet offer keeps no interpretation, marked '…'), never gate character
depth behind invisible conduct, two legible Space states, the page as
causal residue. then the engine layer (fable) and four opus 5
instances, one per scene-domain, against the frozen contract.

**what the night now does:**

- **chapter pages** — between places the letter-storm settles into
  the destination's name and the stage's verbatim paragraph typesets;
  Space finishes, Space turns; the next place condenses visibly out
  of the words just read. provenance is the story's structure.
- **the reading band** — beings speak their quoted lines into a grown
  margin band while their own condensation pulses; the speaker is
  known by whose letters are in the air.
- **the faded hand** — the night's choice grammar, from his sentence:
  taking or declining is conduct, declining never blocks, and only a
  witnessed verdict is recorded.
- **chosen → echo** — this night's conduct swaps into echo at the
  fold; night one stays pure canon, the second night greets who you
  were (fate scold-first, the tried coat pausing its sway, the rowed
  sea's line).
- **the liminal dial, tempered** — authored deepening (fog, thinning
  solids, sleepier margin, emptier stars, longer dissolves), gains
  halved after the consult so legibility is never the sacrifice; each
  scene carries one authored deepening of its own.
- **the excavated beings** — Fate's full six-beat exchange (idle
  writing that fails to settle, the notice, the greeting, the payment
  and the card, the refusal that cannot be said, her scold); the
  otter's gaze-witnessed inner life; coats that grow down the aisle
  and wrap the frame when tried on; the cats' registration queue and
  the refused one that registers you; the lamp's accumulating wait
  (letter-moths, the deepening lean); the menu cursor that exists in
  order not to matter (the same drink, arriving differently); the
  rerun for those who won't stand; the leap that refuses you until
  the stairs complete it from their end; the boat question, facing
  her; the RECORDED sea breathing with the session's own rhythm.

**verified:** full v2 night headless, gate → fold, zero console
errors; the fold swapped an honest echo (a teleporting camera earned
only tongue/menu/leave/sea — everything unwitnessed stayed
unrecorded); twelve scenes sweep clean in lab.

## the widened corpus — cited register (settled)

v2 adopts corpus widening (convergence law 8): a display line may come
from any typed entry in the author's journal, cited file:line in the
owning scene's header, read in its surrounding paragraph before
adoption. excluded entirely: she_dream.txt, prayer-addressed lines,
model-mediated files. five lines beyond 06.06.26 are in the piece;
each sits behind a named constant — emptying it silences the line and
every mechanic stands. the register, for the record and for revision:

- gate: `XE_DECLINE` 17.08.26:14 (trimmed at the clause) ·
  `XE_FOLD2` 2026-04-10.md:31 · `XE_FOLD3` 20.07.26:15
- theatre: `LEDGE_DANGLE` — "i close my eyes as my feet dangle"
  (06.06.26:5, trimmed at the clause)
- cloakroom: `TRIED_LINE` 17.08.26:24
- boat: `ECHO_ROWED` 20.07.26:18 · the she-question (06.06.26:5)
  split at its own full stop into two margin lines
- interface: dream-mode hint reads `wasd walk · drag look · space`;
  the corner marker drops the scene id in the night
- the honesty label says `74 minutes` (the session's length; the
  replay file trims strap-settling to 72.5 — one string in boat.js
  if the label should name the file instead of the night)
- tunables, should the walk want them: page 34cps / 28s safety ·
  hand dwell 1.5s · the theatre margin queue backlogs at the ledge
  (the drift/jacket cues are the queue) · the tried-coat echo reads
  when a crossing sends wind through the coats

## settled — the submission shape

- **v2 ships as the piece** (bobby: "consolidate and
  get a submission ready as is"). fully green: full-night playthrough,
  twelve-scene lab sweep, production build + smoke — zero errors.
- **the walker's guide**: `GUIDE.md` (canonical) / `/guide.html` on the
  hosted site / `export/GUIDE.pdf` in the bundle — part one walks the
  night stage by stage; part two documents the navigation premises,
  logic, and reasoning (eleven rules, premise → mechanic → reason). the
  piece itself stays instruction-free; the guide is the out-of-world map.
- **scope frozen**: constraint-system artwork now; character-LLM
  figures argued as horizon in the report, not built.
- the widened-corpus register above stands as adopted; any line can
  be struck by emptying its constant, before or after submission.
- v1 preserved whole at `versions/the-night_v1/` (also in-repo).

## open (post-submission horizon)

- the critical report — the author's alone, no AI prose (in progress;
  skeleton in `explorations/submission.md`)
- hosting push + walk-video upload — the author's accounts
- model tier per figure (prompted base / shared voice-adapter /
  per-figure weights) — the report's horizon argument
- from the hold-list: murmuration near-word, false dawn, state-grammar
  weathers, the identities line, the ghost bridge, x_* labs in `?lab`

---

_provenance: settled-ground bullets are bobby's words (studio session);
margin notes are fable's readings. update this file as decisions land._
