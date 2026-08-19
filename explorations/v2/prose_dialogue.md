# v2 — prose & dialogue presentation system
*fork exploration · 19.08.26 · layer: how the writing gets big, immersive, navigable*

---

## the finding that decides everything

read 06.06.26.txt again looking only at FORM. the entry already
differentiates its voices typographically:

| form in the entry | example | what it is |
|---|---|---|
| plain paragraph | "Fate greets me at the gate. It's been some time…" | narration — the dreamer's voice |
| "double quotes" | "Why was I here again?" / "We're all here and gone and gone again…" | spoken dialogue — beings' voices |
| 'single quotes' | '1 visitors pass to Tomorrow' · 'jack of all trades, with an Ace up your sleeve' | typed / written artefacts — documents the dream issues |
| \* asterisks \* | \* applause ensues \* · \*\* Curtains close \*\* | stage directions — the dream's own machinery |
| ——— / — | section breaks | the folds between beats |

so v2 does not need an invented dialogue-box grammar. **the night displays
text the way the journal writes it.** four text registers, each with its own
surface, each traceable to the entry's own typography. this is
nothing-from-nowhere at the level of form, not just content.

mapping to surfaces:

- plain paragraphs → **interlude pages** (between stages) + **margin voice** (in-moment, stays as is)
- "spoken" lines → **the reading band** + being condensation pulse (two-layer speech, below)
- 'typed artefacts' → **cards** (the theatre menu generalized: pass, menu, tickets)
- \* directions \* → margin voice (already proven: '\* applause ensues \*')
- ——— breaks → the transitions themselves (already: world dissolves to letters)

one honesty rule falls out of this and should be enforced everywhere:

> **voices type, objects appear.** anything that is a voice-in-time (margin,
> speech, pages) types itself character by character — the writing writing
> itself. anything that is an already-issued document (the pass, the menu)
> appears whole — you don't watch a menu being written, you are handed it.
> the menu already obeys this. keep it law.

---

## 1 · the three reading surfaces, evaluated

### a. interlude pages (full-screen, between stages) — ADOPT, the big one

the transition already dissolves the world into drifting letters. extend it:
at full cover the drifting letters dim and settle into background, and the
stage's paragraph from 06.06.26 typesets itself in a centered measure
(~54 chars, ragged right). Space turns the page; the world recondenses as
the next place. the entry's paragraphs become chapter cards — the act
structure of the night made visible, and provenance made structural: the
reader SEES that the world is a written thing, between every place.

- why it works here: reading gets protected time (no competition with
  terrain), the story's connective tissue ("I'm in a hurry now because I
  don't want to miss the trailers") finally lands, and the page is literally
  made of the world's letters — same buffers, same notation. not a modal
  popup; the same field, resting.
- risk: pacing. mitigations: pages only at stage boundaries (5 per night),
  paragraph-length only (the entry's own paragraphs are short), first Space
  completes the typing, second turns the page. never auto-advance (a page is
  an invitation), but a 45s safety-auto for headless/idle.
- lineage: kentucky route zero's interludes; VN type-skip grammar. terminal-native
  throughout.

### b. the reading band (lower-third, in-place encounters) — ADOPT

the margin voice grown up, for dialogue. a whitespace-cleared band
(rows ROWS-8..ROWS-3, the margin's proven clearing rule) where a being's
"spoken" line types at 30cps with its quote marks verbatim.

speaker identity WITHOUT labels — the doctrine already solves it:
**two-layer speech.** while a line types in the band, the being's
condensation pulses — its letters aloft over its head (condense() with
reveal driven by the band's type-head). the speaker is whoever's letters
are in the air. the sky dims while speech is aloft (existing speechGlow).
identity from space, not from name-tags. the band is "the page remembering
what was said"; the condensation is the saying.

- the band never coexists with the margin: while a speak() is live, narrate()
  queues but does not render. one voice at a time. no clutter.
- walking away mid-line is allowed (you can always walk in a dream): band
  scatter-fades, letters fly home, the exchange re-offers on return
  (night's `until` gates still hold progress).
- the world never pauses behind text. wind, stars, env keep breathing.
  a paused world would break "everything is the field."

### c. prose you walk through — KEEP as texture, don't promote

narrator paths, moss whisper, line beings: they are the ambient truth of the
place and already good. walking-prose reads at 2-3 words per stride — too
slow to carry story. use it for lists and rules pinned to world objects
(signs type: the pass conditions could stand as five stones on the gate
path, each typing its rule as you pass — flag for the gate/Fate fork).

---

## 2 · navigability grammar (one key: Space)

Space is already the buoy-hop. give it a capture hierarchy — readable
things capture it, else it stays the hop:

```
Space pressed:
  page open?     line mid-type → complete instantly
                 else → turn page (advance stage transition)
  card open?     → lower the card (menu precedent, exists)
  speak live?    line mid-type → complete instantly
                 else → next line / close band
  else           → buoy hop (existing)
```

- **advance**: Space (also Enter as alias).
- **skip**: first press completes typing — standard VN grammar, respects
  the reader who reads faster than 34cps. never skips PAST unread text.
- **reread**: artefact cards re-open on approach (the pass card near the
  gate, always). pages replay each fold (the fold is a reread — the night
  is a book you reopen). margin lines are thought, spoken once per visit.
- **walk-away**: always permitted; nothing story-critical is lost because
  stage `until` conditions re-offer encounters.

## 3 · choice presentation (the mute visitor's verbs)

the entry gives the grammar: *"I couldn't actually say it without my tongue,
but my eyes told it anyways."* — the visitor answers by LOOKING and by
STANDING. choices are never the visitor speaking.

**stance-split condensation.** a choice = two short texts condensing at
±x positions ahead (the two futures hanging in the air). facing one inside
a ~0.35rad cone for ~1.2s = the eyes telling it: the faced text condenses
fully (its letters settle), the other's letters fly home. then the world
answers — usually the same way regardless (she scolds either way; the pass
is issued anyways). the choice is real as an act, empty as a fork:
illusion of choice, inevitability of encounter, made typographic.

- no numbered options, ever. numbered lists are the pass's voice (an
  artefact register), not the visitor's verb.
- engine gives scenes one helper: `facing(x, z, cone)` → 0..1. dwell logic
  stays scene-side (it's story, not engine).
- existing precedents already in this grammar: approaching the grip = giving
  the tongue; Space on the menu = declining to keep reading it; standing
  still by the boat = choosing to drift. v2 makes the pattern visible.

## 4 · engine api sketch

```js
// --- the reading band -------------------------------------------------
// speak([{text, at?, hold?}], opts) — at: {x,y,z} condensation anchor
//   opts: { advance: 'space'|'auto', onDone, id }
// state: speakCur { lines, i, t0, shown, fade }
// render: renderSpeak(t) after renderMargin (margin suppressed while live)
//   band rows ROWS-8..ROWS-3, whitespace-cleared (margin's clearing rule:
//   charBuf=0, depthBuf=0.05 full row), text at col 6, slot 7*N_STEPS+0,
//   30cps; quote marks verbatim from the entry.
// beings-side: scene reads speakReveal(id) 0..1 to drive condense() pulse.

// --- interlude pages --------------------------------------------------
// director stages gain { page: '<verbatim paragraph>' }
// trans machine grows a phase: out → page → switching → in
//   during 'page': veilOverlay held at cover 0.92, letters dimmed one step;
//   paragraph typeset centered, measure min(54, COLS-12), 34cps,
//   type-head cursor '▄' blinking (the diamond-tipped pencil);
//   Space: complete → turn. 45s safety auto-advance. ?lab never pages.

// --- artefact cards ---------------------------------------------------
// cardShow(lines, {border:'═║', onDone}) / cardDown()
//   generalizes theatre's screen() menu (theatre migrates, ~20 lines saved);
//   instant-on (objects appear), centered, body band 7 step 0, border 6.
//   Space lowers. depth 0.1.

// --- choice helper ----------------------------------------------------
// facing(x, z, cone=0.35) → 0..1  (angular closeness of gaze to point)
```

render order: `renderTerrain → renderSky → renderBeings → renderScreen →
renderMargin → renderSpeak → renderCard → veilOverlay(+page)`.
key capture in the existing keydown listener, before the buoy branch.
setScene clears speakCur + card (marginQ already cleared — same reasoning:
a new place gets a fresh voice).

## 5 · pacing constants (reading, not glancing)

| surface | cps | hold | fade | notes |
|---|---|---|---|---|
| margin (ambient) | 26 | 1.7 + len×0.02 | 0.9s scatter | unchanged — proven |
| reading band | 30 | until Space (or 2.2 + len×0.025 auto) | 0.7s scatter | dialogue is quicker than thought |
| interlude page | 34 | until Space | recondense | never timed-out except 45s safety |
| artefact card | ∞ (whole) | until Space | instant | objects appear, voices type |

## 6 · what NOT to do

- no portraits, no name-tags, no choice numbers, no HTML overlay, no
  bottom-screen "textbox" chrome. the band is cleared whitespace, not a box.
- no pausing the world for text. ever.
- no auto-scrolling long text: anything longer than a paragraph is either
  paged (Space each) or an artefact (handed whole).
- no new alphabets: everything renders in the scene's notation; missing
  glyphs go through `notation.extra` per scene (the '73' lesson).

## spun-off roots (for the other forks, one line each)

- *"Perhaps it's me who's trailing?"* → the trailers before the show could
  page fragments of OTHER entries (13.08.26: "Time ahead and time between
  the moments melt.") — corpus-mining hook, belongs to characters/wildcard forks.
- *"all bags must be stored under your eyes"* → the reading band sits at
  the bottom of the screen: under your eyes. the position is already in the rules.
- *"have you got a pen?"* → the type-head cursor '▄' is her pen, blinking
  wherever the writing is currently writing itself.
