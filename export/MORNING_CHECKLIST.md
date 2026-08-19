# ANIMA — the morning, mechanised (Shape 1)

> Everything agent-side is DONE: the build ships `term.html` (verified — production
> smoke test, zero errors, screenshot at `shots/dist_smoke_term.png`), `.gitignore`
> holds (271 files, no inspo/node_modules), the repo is initialised and committed
> (`cafebb6`), source text ships as `source/06.06.26.txt`, PROCESS.pdf + README_LOG.pdf
> are in `export/`, and the two accuracy traps (castle-as-horizon, Eros
> never-trained) are corrected in the record. What remains needs your hands.

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

## Parked (your word only)
- **v2 ("the excavated night")**: runs on a branch or not at all; v1 is what
  ships unless v2 is fully green by T-90. Recommendation: park it.
- `writing_session_001/` photos (113MB DNG): not in the repo; add 2–3 exported
  JPGs to `shots/` if you want the hand-notes evidence visible. Optional.
