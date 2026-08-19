# td, enough to play — a field guide

> written 18.08.26, for bobby's hands. the rule this time, learned from
> DIALEK: **you drive, agents reference.** i answer questions and hand you
> maps; the mouse is yours. no network gets built for you until you can
> read one.

## step zero — done 18.08

TD **2025.33070** installed (in-place upgrade over 2023), POPs included.
first launch asks for the derivative sign-in — free non-commercial
license, 1280×1280 output cap, fine for learning. installer kept at
`Downloads/TouchDesigner.2025.33070.exe` if a reinstall is ever needed.

## the mental model — six families, one paradigm

everything in td is a live dataflow graph. the network IS the program;
every wire carries data every frame; any parameter can reference any
other via python. nothing compiles — it cooks.

- **TOP** — textures. GPU images, live. your fragment-shader world.
- **CHOP** — channels. numbers over time: audio, LFOs, mouse, midi,
  animation curves. *uniforms with a heartbeat.* the connective tissue
  of everything reactive.
- **SOP** — geometry, CPU. your BufferGeometry. old, reliable, slower.
- **POP** — points, GPU. new 2025. SOPs' successor for anything
  numerous: particles, clouds, instancing data. **your home turf.**
- **DAT** — tables, text, scripts. the vault-shaped one.
- **MAT / COMP** — materials, and containers: Geometry, Camera, Light
  live as COMPs. COMPs nest — networks inside networks, your modules.

the render loop, spelled once: `Geo COMP (holds SOPs/POPs + a MAT) +
Camera COMP + Light COMP → Render TOP`. that four-node square is 3d in
td. everything else decorates it.

## ui survival — the actual barrier, front-loaded

- **double-click empty space** (or Tab) → operator create dialog.
  families across the top. start typing the name.
- **p** — parameter window for the selected node. this is where you live.
- **the little dot, bottom-right of a node** — viewer active. on = the
  node shows its own output. **display flag** (right edge) = what the
  network background renders.
- drag node-edge to node-edge to wire. drop a CHOP **onto a parameter**
  → choose *export* — that's a signal driving a value. undo works.
- **middle-click a node** — info. **b** — bypass. **h** — home the view.
- scroll = zoom, middle-drag = pan. **enter a COMP** by double-clicking
  it; **u** climbs back out.
- save constantly; td crashes like a diva. `ctrl+s`, versioned.

## the sessions — one question each

your shape: 20–45 min, one question, make-then-reflect, 5-block note
(spark → mechanic → friction → artifact → next move). save each as
`td/sessions/sNN_name.toe` + a dated note beside it. break something on
purpose every session and watch what the network does.

- **s01 · first render** (30m) — build the four-node square with a
  Torus SOP. orbit it in the Geo viewer. *question: what is a render
  network?* break: delete the light.
- **s02 · signals move things** (30m) — LFO CHOP exported to the torus
  rotate. then an Audio File In CHOP → Analyze → exported to scale.
  *question: what is a CHOP export, really?* break: export the same
  channel to five parameters.
- **s03 · your own dream arrives** (30m) — drag `td/scene_gate.glb`
  into the network. relight it moody — one cold light, one warm.
  *question: how do my assets come in, and what do they arrive as?*
  (notice the lamp scene's `LAMP_rig` animation channels.)
- **s04 · POPs first contact** (45m) — Sphere POP → Noise POP →
  render as points. then feed `scene_gate.glb` geometry through
  SOP-to-POP and noise *that*. *question: what is a point, and what
  does the GPU let a million of them do?* break: crank the count until
  the frame rate kneels. find the number.
- **s05 · the field, native** (60m) — the big one. scatter points over
  the gate mesh (POP density), Geo COMP **instancing page** on: instance
  translate from the points, a small rectangle per instance, additive
  Constant MAT. then a Text TOP glyph grid as the instance texture.
  *question: can my material live here?* — you'll know by looking.
- **s06 · it breathes** (30m) — Audio Device In → Audio Spectrum →
  drive s05's noise amplitude and point scale. the field moves with the
  room's sound. *question: what does realtime buy that the browser made
  expensive?*
- **s07 · play becomes artifact** (20m) — Movie File Out TOP; record
  40 seconds of s06. it lands in the devlog / process doc. *question:
  what's the loop from play to keepable thing?*

after s07 you can read a network, which changes what we can do together.

## the shelf — few, chosen

- **derivative's POPs announcement + docs** — the horse's mouth
- **the interactive & immersive HQ** — free POPs intro video + their
  blog; the most current POPs teaching anywhere
- **bileam tschepe (elekktronaut, youtube)** — organic, typographic,
  gentle-paced; your aesthetic's neighborhood in td
- **matthew ragan** — the fundamentals, taught properly; when a concept
  feels wobbly, he's the foundation pour
- **paketa12 (youtube)** — older, terse, particle sorcery; watch when
  you want to see what mastery looks like

skip everything else until s07. tutorials are a vice in td-land.

## where the agents fit — later, and on your terms

`touchdesigner-mcp` is wired and dormant (`System/touchdesigner-mcp/`,
Web Server DAT on :9980 activates it). the sequencing rule: **agents
touch td only after s05.** the DIALEK fossil record says what happens
otherwise — twelve built versions, one real session. this tool is the
one you asked to *understand*. after s05, an agent pair-building beside
you accelerates; before it, it amputates.

> _fable margin note:_ scene_01 in the browser is generic because it was
> a pipeline test with no material idea — the field study has an idea,
> the walk doesn't yet. td play is where its idea gets found. keep the
> walk as plumbing; judge nothing by it.
