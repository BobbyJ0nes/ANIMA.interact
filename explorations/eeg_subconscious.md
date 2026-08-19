# modelling the subconscious in the eeg — into the environment

> eeg-subconscious fork · 19.08.26
> the question: *how would we model the subconscious representation in
> the EEG data into the environment?*
> the constraint, his own (solipsist.txt): "One thing I want to avoid
> with this project is to force the subconscious data into a specific
> shape, doing so would impart the conscious into the work."
> the framing, his own: "an honest map of how far a cheap consumer
> sensor can reach."

## 1 · what the current env layer actually is

The env layer (env.js) ships five channels named `drift, depth, focus,
tension, spark`, built from alpha/delta+theta/beta-ratio/beta/gamma band
powers. Be honest about what that is: **naming a band is a conscious
act.** "Alpha = drift" is an interpretive move imported from sleep-lab
vocabulary — a specific shape forced onto the data, exactly the thing
solipsist.txt forbids for the *subconscious* representation.

That doesn't make it wrong — it makes it a different thing. The named
channels are **state-weather**: a legible, defensible mapping from
physiology to atmosphere (tension makes the wind, depth thickens the
fog). Weather is honest because it claims little. Where the named frame
*would* violate the constraint is the moment it's presented as "the
subconscious driving the dream" — a claim the vocabulary can't carry.

So: keep the named channels as weather. Represent the subconscious, if
at all, by a route that withholds names.

## 2 · the spectrum, ranked by honesty

**(a) unnamed latent axes — built, recommended.** Decompose the signal
into its own principal directions and let those drive environment axes
*without semantic naming*; fix the assignment by hash so neither Bobby
nor the code editorializes which axis becomes what. The data speaks in
its own basis. Run tonight on session01: **three unnamed axes carry
96.8% of the variance (57.4 / 29.0 / 10.4%)**. Pipeline:
`public/eeg/session01_latent.json`; demo scene `?scene=x_latent`.
Honesty: high — the only conscious impositions left are the choice of
spectral features upstream and the choice to make land at all. Cost:
already paid.

**(b) state-sequence grammar.** Cluster the latent space into a handful
of recurring states (microstate-fashion), give them *glyph* names — not
words — and let the world's weather be the sequence: dwell, return,
transition. The subconscious as **syntax**: motifs that recur without
being named. Honesty: high if the glyphs stay arbitrary. Feasibility:
one evening (k-means on the latent axes is 40 lines). Best use: the
world re-dressing itself per state, the "structured but diffused" rule
made physiological.

**(c) trajectory geometry — the deepest cut.** Stop rendering *values*
at all. Render **dynamics**: velocity, curvature, dwell-time of the
latent trajectory drive *how the world changes* — how fast the ambient
letters cycle, how far forms drift from likeness, how restless the
recruitment is — and never *what it shows*. The subconscious as the
hand that stirs, never the image stirred. This is the most faithful to
solipsist.txt (no shape at all is claimed, only energy). A first taste
is live in `x_latent`: latent speed decides how much the ground stirs
locally. Honesty: highest. Legibility to a visitor: lowest — pair it
with (a) or it reads as nothing.

**(d) the surrogate discipline — run before believing anything.** For
every mapping adopted, run the identical pipeline on a surrogate that
destroys the structure being claimed. Done tonight for (a):
independent circular shifts (each channel keeps its exact
autocorrelation; cross-channel alignment is destroyed), 8 draws:
**surrogate PC1 = 18.6% mean (19.1% max) vs real 57.4%.** The joint
structure is genuinely joint — roughly 3× what coincidence with the
same rhythms would give. Loud caveat alongside it: all six inputs come
from the same four-electrode mean, `focus` is a ratio of two other
inputs and `slope` a fit over all of them, so part of PC1 is shared
construction and shared sensor gain, not necessarily shared cortex.
That sentence belongs in the critical report — it *is* the "honest map
of how far a cheap consumer sensor can reach."

**(e) the live door.** muse-js over Web Bluetooth would put tonight's
body where the recorded night now sits. The architecture is ready (a
third env source next to MODEL/RECORDED, labeled LIVE). What changes
is ethical, not technical: a live body makes the piece a biofeedback
loop — the visitor learns to steer it, and honesty then requires
*telling* them the world is listening. Recorded replay makes no such
loop and needs no such consent. Ship recorded; open live only as a
performed, disclosed mode.

## 3 · state, never content

The line that must hold in the piece and the report: the EEG
contributes **state, not content**. No mapping in this family can
recover imagery, figures, or meaning from four dry electrodes — and the
piece must never stage an implication that Fate or the lady *came from*
the signal. The writing is the content. The body's trace is the
weather, the syntax, the hand that stirs. (This is also why `crossing`
and `x_latent` render the session as *ground* — something the dream
stands on — rather than as figures.)

## 4 · crossing vs x_latent — the pair is the argument

- `crossing` — **the named map.** Five labeled lanes, a marked event, a
  cursor. The conscious analysis of the night, walkable. Register:
  night, full sightlines — you can survey it.
- `x_latent` — **the unshaped ground.** The same 74 minutes through
  unnamed axes and a hash-fixed mixture; no lanes, labels, landmarks,
  or cursor; latent speed stirs the ground. Register: veil — fog denies
  overview; you can only *be on* the land, never map it.

Keep both. The pair *performs* the solipsist.txt tension — analysis vs
the refusal of analysis — which is stronger than resolving it. Shots:
`shots/x_latent_1..3.png`.

## 5 · recommendation

1. Named channels stay, demoted in language: they are *weather*, never
   "the subconscious."
2. The subconscious representation = **(a) + (c)**: unnamed latent axes
   as slow environment drivers, trajectory dynamics as the stirring
   hand. Both are now built or seeded.
3. Adopt (d) as standing discipline: no biosignal claim ships without
   its surrogate number beside it.
4. (b) is the best next build if the piece wants *discrete* moods —
   glyph-named states re-dressing scenes.
5. LIVE stays a door, disclosed if ever opened.

**Only Bobby can decide:** whether the piece claims *any* subconscious
representation at all, or stays at weather (the modest reading is
defensible and maybe truer); whether x_latent's refusal-of-names
becomes the crossing's sibling in the final circuit or remains a study;
and where the surrogate caveat appears in the critical report.

---

*artifacts: `public/eeg/session01_latent.json` (unnamed axes + velocity,
RECORDED) · `src/term/scenes/x_latent.js` (?scene=x_latent, veil) ·
`shots/x_latent_1..3.png` · pipeline script in session scratchpad
(`eeg_latent.js` — PCA via power iteration, surrogate test inline).*
