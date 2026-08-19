# the sky — exploration notes (sky fork · 19.08)

> the sky is a character. the writing is explicit: *"The metaphorical sun
> drifts accross the sky and the moon follows him. She looks slightly sad
> today. Someone told me the Wolf's don't cry to her anymore, she must be
> lonely these days. She can't even talk to the stars anymore, they've
> all moved out now."* — the moon has a mood, a history, and a social
> life in ruin. the sky work below treats her accordingly.
> demo: `/term.html?scene=x_sky` · shots: `shots/x_sky_*`

## design language — the sky obeys the field's own grammar

1. **condensation, celestial.** stars condense into constellations, hold,
   and scatter — the she_dream move at astronomical distance. nothing
   appears from nowhere: a constellation is always assembled from stars
   already in the sky; rain is always shed from a cloud; a shooting star
   is a star *leaving* (see 6).
2. **cell-quantized motion.** clouds hop cells, rain falls in steps,
   streaks advance in quanta. the sky never glides; it re-typesets.
3. **mood without a face.** the moon's sadness must never be drawn
   (likeness stays unresolved). her vocabulary is: **elevation** (sad =
   low), **phase** (waning = turning away), **halo** (mourned), **size**
   (lonely = larger, nearer the earth), **waver** (her light unsteady),
   **following** (her azimuth leans toward the sun's warmth when it
   passes — she follows him). all attitude, no anatomy.
4. **english is rare — the letter-constellation ruling.** stars may form
   ONE lowercase letter, at most one such constellation in the sky at a
   time, on a long cycle, assembled from existing stars over ~10s and
   dispersed again. never a word. justification: the moon "can't even
   talk to the stars anymore" — so the stars once talked; a rare single
   letter is the residue of that speech, and it is *rarer* than the
   ambient ground-letters already are. verdict: allowed, constrained.
5. **honesty.** every sky behavior that reads env is driven by whatever
   the env label says (MODEL/RECORDED) — the sky never fakes a body.
6. **the depletion thesis.** "they've all moved out now" is not just the
   boat's sky — it can be structural: each shooting star is a departure,
   and the catalog thins as the circuit progresses toward the boat.

## renderer ergonomics (hard-won, matters for every sky feature)

the projection (PROJ = ROWS·1.05) exaggerates verticals: anything above
tan-elevation ≈ 0.3 is off-screen at neutral pitch, and the pitch clamp
(±0.55) cannot rescue it. engine stars already respect el ≤ 0.64 only
because they render near the horizon-relative band. **rule: sky
furniture lives at tan-el 0.05–0.30, or far enough that its world-y
projects into that band.** overhead skies do not exist in this renderer
— the sky is a THEATRE ON THE HORIZON, which suits the piece: every
scene's sky hangs like a backdrop in one compass direction.

## per-scene sky table (each differs slightly)

| scene | moon | stars | weather / special |
|---|---|---|---|
| gate | composed: gibbous, el .34, r3 | 0.7 | **the Pen** constellation (Fate lost hers) condensing on a long cycle in her sky |
| cloakroom | none (interior slit) | 0.5 through the corridor slit | one star exactly over the aisle axis (proposal) |
| willow | full "office-hours" moon, high el .42, r2.5, paren-cratered (kept) | 1.0 | aurora is HOME here (phosphor): the talking lights over the canopy, spark-driven |
| streetlamp | waning crescent, dim, high — she cedes the scene to the lamp | 0.6 | slow comma-cumulus that briefly veil her; when veiled, his cone reads warmer |
| theatre | **THE sad moon** — the passage happens here: low el .26, waning, halo, slight waver; brightens during crossing envelope | 0.55 | none (the bowl is its own sky) |
| boat | lonely: full, faint, r4, el .22 (built) | 0.08 (built) | never letter-rain (the sea already is the text); false-dawn breath on a very long cycle — the fold approaching |
| crossing | el tracks env.sessionSec — she crosses the valley during the replay: the night passing | 0.7 | shooting stars gated by recorded gamma — departures from the body's own sparks |

## what the demo proves (`x_sky.js` — six skies, one promenade)

walk east from spawn; waymark '║' pairs mark borders; the sky hangs NORTH.

1. **the composed night** — the Pen: 7 stars condense → hold → scatter
   (40s); every third cycle they form a single 'w' instead (the ruling
   in practice). `shots/x_sky_1_pen.png` — formed, held.
2. **the letter veils** — em-dash strata + comma cumulus, cell-hopping,
   cover breathing with env.depth. stars show between their cells.
3. **the rain of letters** — a cloud sheds letters that fall cell by
   cell and are absorbed: each landing briefly brightens the ground AND
   sets its letter-land cell to the fallen letter (the ground remembers
   what the sky said). `shots/x_sky_2_rain.png`.
4. **moving out** — shooting stars as departures; the engine's own star
   count is steered down (sky.stars is live-mutable per frame — proven);
   the moon sinks and swells as they go. the scene's line lives here.
5. **the false dawn** — a warm dome breathes at the horizon and always
   recedes (30s); during it the moon's azimuth leans toward the warmth:
   *she follows him*, without a sun ever being drawn.
   `shots/x_sky_3_dawn.png` — dome up, moon followed.
6. **the talking lights** — aurora strands ('│'/'░', teal/indigo
   alternating) waving with spark. phosphor is their home register;
   night-palette shown here. `shots/x_sky_4_aurora.png`.

mechanism note: everything above is BEINGS + live mutation of the
scene's own `sky` object — zero engine changes were needed for the demo.

## ranked proposals

1. **moon spec in the engine** (highest value / smallest diff): extend
   `sky.moon` to `{ az, el, r, phase, halo, waver }` and render
   terminator, halo ring, and lum-waver in `renderSky`. the per-scene
   table above then becomes data. sketch:
   ```js
   // in the moon disc loop, after l is computed:
   const lit = 0.25 + 0.75 * clamp01(0.5 + (dc / R2) * moon.phase * 2); // terminator
   l *= lit;
   if (moon.waver) l += (h2i(cc, rr + Math.floor(t * 2)) - 0.5) * 0.2 * moon.waver;
   // after the disc: halo ring at 1.6R, ch '·', step 4, skyline-guarded
   ```
2. **az-anchored scene sky hook**: `scene.skyHook(t, env, put)` with
   `put(az, el, ch, band, step)` wrapping the star projection + skyline
   + empty-cell guards. beings are world-anchored (translation parallax);
   far sky wants yaw-only parallax. constellations, clouds and aurora
   become first-class and per-scene without world-ring hacks.
   ```js
   // renderSky, after stars:
   if (scene.skyHook) scene.skyHook(t, env, (az, el, ch, band, step) => {
     const a = wrapA(az + drift - cam.yaw); /* project, guard, write */
   });
   ```
3. **the depletion arc** (structural storytelling, 3 lines): global star
   fraction falls as the dream is walked —
   ```js
   const seen = Object.keys(dream.visited).length;
   const starMul = 1 - 0.09 * seen; // 7 scenes → 0.37 by the boat
   ```
   each scene's shooting stars are the visible departures. the boat's
   0.08 stops being a local override and becomes the arc's end.
4. **clouds + letter-rain with the landing-absorb rule** (demo-proven)
   promoted to a shared helper scenes can import.
5. **false-dawn event** as the fold's precursor: the boat scene runs the
   dawn breath on a long cycle; on the actual fold (dive), the breath is
   the last thing seen before the gate's night returns.
6. **aurora** shipped only in phosphor scenes (willow) — its signature.

## register note

the registers already re-voice the sky for free (page prints the moon as
an ink stipple; folio would gild her). no per-register sky code needed —
band semantics carry it.
