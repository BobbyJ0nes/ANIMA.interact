# ANIMA — the morning, mechanised (Shape 1)

> Everything agent-side is DONE — **and the piece that ships is v2, "the
> excavated night"** (your word, deadline morning: "consolidate… as is";
> the old park-v2 recommendation below is superseded — v2 went fully green:
> full-night playthrough + 12-scene sweep + production build, zero errors).
> The repo is committed with v2 consolidated; `index.html` is now a landing
> that routes to `term.html` (v0 circuit preserved at `circuit.html`);
> PROCESS.pdf + README_LOG.pdf are regenerated from the v2 docs;
> `export/anima_dist_upload.zip` is the built site ready for Netlify
> drop / GitHub Pages; `export/walk_v2.webm` is a captured full-night walk
> (local only — nothing was published). Source text ships as
> `source/06.06.26.txt`; accuracy traps (castle-as-horizon, Eros
> never-trained) corrected in the record. What remains needs your hands.

## 0 · First login (10 min) — TWO errands, one Moodle visit
- [ ] Confirm the EC deadline/time for IU000325 (nothing in the vault confirms today 14:00).
- [ ] Download the **report template** (the brief: report "based on the template provided on Moodle").

## 1 · Publish (10 min of your attention, then walk away)
Decision first: the old ANIMA_VAULT repo **contains your journal database in its
history** — do not make that public. The clean path is a NEW repo of
`ANIMA.interact` alone (already a self-contained repo, committed):

```
# after creating an empty repo on GitHub (public, so the marker can open it):
cd C:\CCL_BBY\Cloud_city_VAULT\BASAIRA\01-Projects\ANIMA\ANIMA.interact
git remote add origin git@github.com:BobbyJ0nes/ANIMA-the-night.git
git push -u origin master
```

Hosting (optional but Shape 1): GitHub Pages from the repo → build locally
(`npm run build`), then either push `dist/` to a `gh-pages` branch or use
Netlify drop (drag the `dist/` folder — fastest). **Point people at `/term.html`.**
**T-90 RULE: if no live URL by 90 minutes before the deadline, stop — the brief
mandates the repo link, not a live site.**

## 2 · THE REPORT (2.5–3.5h — yours alone, start by T-4h)
1500–2000 words, Moodle template headings, **no AI-drafted prose** (the brief
forbids it; Turnitin reads it). The skeleton is yours already:
`explorations/submission.md` §4 — piece (~250w) · the question: can a
subconscious be represented without being captured? (~350w) · terms of entry
for machines (~450w) · the body as weather (~350w) · ethics + limits, Eros's
empty membrane (~250w) · reflection + references (~150w).
References: verify from `export/REFERENCES_WORKSHEET.md` — nothing unverified
enters. Two truth guards: castle = horizon, not scene; Eros = specified, never
trained.

## 3 · Bundle + upload (20 min)
- [ ] ZIP: `PROCESS.pdf` + `README_LOG.pdf` + the report (PDF) + repo URL inside
      the report AND in the Moodle text field. Optionally `shots/` (36MB — fits).
- [ ] AI disclaimers: already in all 35 source files; the report needs its own
      clear disclaimer section (the brief demands it twice).
- [ ] Upload, receipt, done.

## Settled since this was written
- **v2 ships** (your "consolidate… as is") — fully green, consolidated,
  committed. v1 stays whole at `versions/the-night_v1/` if you ever want it.
- **One revocable call made under the corpus-widening law**: five display
  lines from journal entries beyond 06.06.26 are live in the piece (register
  in README, each cited + behind a removable constant). NOTE: these journal
  fragments go public with the repo/site exactly as far as the piece itself
  displays them — strike any line by emptying its constant BEFORE pushing if
  you don't want it public.

## Still parked (your word only)
- `writing_session_001/` photos (113MB DNG): not in the repo; add 2–3 exported
  JPGs to `shots/` if you want the hand-notes evidence visible. Optional.
- The walk video: `export/walk_v2.webm` exists (agent-captured, local). Upload
  it, re-record your own walk over it, or skip — the brief's video slot is
  yours to fill.
