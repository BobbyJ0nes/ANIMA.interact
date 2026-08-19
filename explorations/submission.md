# submission — angles, form, the AI link

> submission fork · 19.08.26 · grounded in the actual brief:
> `01-Projects/ART_AI/IU000325 - Creative Making Art and Artificial Intelligence.docx.pdf`
> (quotes below are verbatim from it). EC date: **not in the brief, not in
> the vault — unconfirmed.** original deadline was 9 june 2pm, AA 16 june
> 2pm; EC runs on its own granted date. everything sequences off that number.

## what the brief actually demands

- **holistic portfolio, 100%** — "the evidence is considered together…
  All components of the assessment must be submitted to pass the unit."
- **creative project**: "a creative tool or artwork utilising AI/ML tools
  to produce an artistic outcome with a critical approach" · "developed
  iteratively, with the process documented throughout the term and
  included in the final submission and exported to a PDF or MD document"
  · "The project documentation is not expected to be a polished document.
  You're encouraged to include bullet points, hand notes, sketches,
  photos/screenshots of work-in-progress" · "The project development
  documentation will be an integral part of the grade."
- **critical report**: "1500-2000 words… based on the template provided
  on Moodle" — **or** "a video or sound recording covering the contents
  requested in the template." harvard refs, in-text citations.
- **AI guidance**: "Please do NOT use AI tools to produce major pieces of
  writing" · "Any code fragments where you used AI need to have clear
  descriptions of how you used it, in a code comment above relevant
  section" · both project and report need "clear and specific AI
  disclaimers."
- **submission method**: moodle upload ≤1GB (PDF/MD/DOCX/ZIP/TXT) — "It
  should include a link to your project repository including
  documentation and project report, published on a git platform."
- **LOs**: LO1 produce complex creative AI arts practice (Realisation) ·
  LO2 use common approaches (Knowledge) · LO3 recognise critical issues
  (Enquiry).
- **ethics**: mind "datasets that may involve sensitive or personal
  information" — participants need consent procedures (n/a: the only
  body in the data is his own).

two structural facts people miss: **the repo link is mandatory**
(ANIMA.interact is not a git repo yet), and **turnitin checks the
report** (another reason the prose is his hand only).

## 1 · form — ranked

1. **hosted URL + captured walk video + git repo, submitted as one MD/PDF
   with links** ← the recommendation. the brief's own shape (moodle file
   + repo link) forces the repo anyway; the hosted URL is the artwork;
   the video is the insurance — "browsers break; a captured walk cannot."
   markers will realistically spend 10 minutes: the video guarantees
   those minutes land.
2. **itch.io page as the public face** — same build, plus devlog = extra
   process evidence, plus the "external hands" proof. cheap once hosting
   exists. do it if EC-far, skip if EC-near.
3. **video walkthrough + repo only** (no live URL) — fallback if hosting
   fights back. loses the "it's real, walk it" force.
4. **live demo** — only if a crit/presentation session is part of the EC
   arrangement; never as the primary artifact.

concretely: vite build → github repo (public) → github pages or netlify;
`shots/` and board included; 10–14 min capture (OBS, one take per scene,
model + recorded env both shown) uploaded unlisted + in the zip if ≤1GB.

## 2 · the AI link — framings ranked

they nest rather than compete; rank = what leads the report.

1. **representation-without-capture** (the spine). the EEG drives the
   world as *state, never content* — weather, not portrait. the piece
   refuses the anadol move (data → spectacle) and the naive-BCI move
   (brain → picture of a brain): the subconscious is never rendered, only
   *let into the room*. evidence: env.js's honesty labels (MODEL /
   RECORDED), session01.json shipping derived per-second features while
   the raw body stays local (privacy-by-architecture — ethics criterion
   served structurally), the crossing kept at the data's own answer
   (~50.5min) against the poster's ~28 — refusing to force the data into
   a conscious shape, which is *his own stated rule* (solipsist.txt).
   citable lineage: lucier's Music for Solo Performer (1965, alpha waves
   as material), calm technology (weiser/seely brown), jung via the red
   book, anadol as counter-example.
2. **agents-as-medium** (the method chapter). the piece was fabricated by
   a fleet of model instances working under authored constraints —
   verbatim-only prose, likeness-drifts/sentiment-locked, english-is-rare,
   honesty taxonomy, "agents reference only" in TD. the critical position:
   authorship relocates from making to *terms of entry* — a consent
   architecture for machine contribution (direct bridge to his Network
   Thinking essay thesis). evidence: scenes/CONTRACT.md (a literal
   constitution), six fork build reports, the process trail in README +
   shots. this is also the honest AI-disclaimer story told as practice.
3. **hallucination-as-dream-fabric** (the horizon, argued not built).
   character LLMs whose drift is bounded (sentiment/archetype locked,
   likeness free) — the dream's native epistemology. evidence today: the
   Eros fine-tune strand — **specified and never trained** (dataset
   extracted, notebooks drafted, zero executions, no weights anywhere in
   the vault; corrected 19.08 — an earlier phrasing here read as if a run
   had been observed). the honest formulation: *a membrane I designed and
   chose not to fill yet* — why it stays empty is itself the critical
   position. plus the ascii-voice seed (fate's line typesetting by
   proximity). frame as designed-and-argued next stage; the report gains
   a "limits and next" section from it.

## 3 · element → criteria map

| brief requirement | existing material |
|---|---|
| AI/ML tools producing artistic work (LO1/LO2) | agent-fleet fabrication (documented), EEG signal pipeline (fft → env), whisper + gpt-4o vision in the ANIMA ingest system, eros qlora attempt, hyper3d/blender-mcp form-shop |
| critical approach (LO3) | honesty taxonomy LIVE/RECORDED/MODEL/SIMULATED; representation-without-capture stance; the design rules as ethics-in-form |
| iterative process, documented, PDF/MD | README (circuit v0 → field_01 → termfield_01 → styles → _02 scenes), 40+ shots incl. text-frames, board.html, td/GUIDE, fork reports — needs assembly into one exportable PROCESS.md |
| "not expected to be polished… hand notes, sketches, photos" | writing_session_001 DNGs, biosignal poster, journal fragments — *include them*; the vault IS this evidence |
| AI disclaimer, per-code-section comments | not yet present in files — cheap scripted pass (header comment per file stating the fabrication method + this session's role) |
| theoretical engagement + harvard refs | board's canon (lucier, hido, jung/red book, herndon, mccarthy, anadol-as-anti-model) — needs formalizing into a reference list |
| repo link | **missing — git init + push is mandatory work** |
| ethics (personal data) | own-body-only EEG; features-not-raw published; state it explicitly in report |

## 4 · report — outline only (his hand writes it)

moodle template governs; fetch it before drafting. working skeleton
(~1800w):

1. **the piece** (~250w) — what ANIMA.interact is, one walk described,
   URL/video pointers. cites: shots.
2. **the material question** (~350w) — can a subconscious be represented
   without being captured? jung, the red book, solipsist.txt's own rule.
3. **method: terms of entry for machines** (~450w) — constraint system,
   agent fleet, contract; authorship as consent architecture. cites:
   CONTRACT.md, fork reports, network-thinking essay.
4. **the body as weather** (~350w) — EEG pipeline honestly labeled;
   lucier → calm tech lineage; anadol counter-example; the crossing
   discrepancy held open as method.
5. **ethics + limits** (~250w) — own-data privacy architecture; eros's
   empty membrane; what character-LLMs would need before entering.
6. **reflection against examples** (~150w) + references.

**disclaimer shape** (bullets, adapted per artifact):
- all display prose verbatim from the author's journals; no AI-written
  prose anywhere in the piece or report
- all code agent-fabricated (claude code / fable 5) under the author's
  direction and constraint system; per-file header comments state this;
  session transcripts retained
- AI used for: research, code, asset generation, build tooling; NOT for:
  the report, the journal texts, design verdicts
- biosignal data: author's own; raw stays local; derived features only
  in the repo

## 5 · gaps — ranked by risk

1. **EC date unknown** — everything sequences off it. not a decision, a
   fetch: email/portal today. (0.5h)
2. **no git repo / no hosting** — mandatory link. init, push, pages
   deploy. (1.5–2h)
3. **no captured walk** — the de-risk artifact. OBS, 7 scenes, both env
   sources. (2–3h incl. trims)
4. **process doc not assembled** — README + shots + board + fork reports
   → PROCESS.md → PDF. (3–4h)
5. **report not drafted** — his hand, template needed from moodle.
   (6–10h across days)
6. **AI-use code comments + disclaimers absent** — scripted header pass +
   disclaimer blocks. (1.5h)
7. **references not formalized** — harvard list from the board's canon.
   (2h)
8. **character-LLM figure absent** — *submittable without it*: LO1/LO2
   already evidenced by fabrication method + signal pipeline + eros
   strand; the report argues the figure as designed next stage. build one
   only in EC-far. (6–12h)

## 6 · timeline sketches

**EC-near (≤1 week):** day 1: EC confirm + repo/hosting + disclaimer pass
(4h). day 2: capture + process-doc assembly (6h). days 3–5: report
drafting + refs, one hour of walk-polish only if the report finishes
early (8–10h). total ≈ 20h. no new features. freeze the piece as-is.

**EC-far (2–4 weeks):** week 1 = the EC-near list unhurried + itch page.
week 2: one character-LLM figure (fate, api-prompted, sentiment-locked)
+ TD s01–s05 sessions feeding the process doc + material-lock verdicts
baked. report drafted alongside, not last. total ≈ 35–40h.

## the one decision first

**freeze scope now: submit the piece as the constraint-system artwork it
already is — character-LLMs argued, not built — unless the EC date, once
fetched, gives 2+ clear weeks.** everything else (form, framing, hours)
follows mechanically from that call plus the date.
