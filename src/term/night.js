// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// night.js — the director. the dream plays in the writing's order:
// gate → (mushrooms) → cloakroom → (the road) → willow → streetlamp →
// the wait → the ride stops, once, for you → the theatre, seated →
// the leap → the boat → drifting off → ** curtains close ** → the fold.
// v2: between places the world dissolves into a chapter page — the stage's
// verbatim paragraph from 06.06.26, Space to turn. provenance is the
// story's own structure: the writing tells you where you are and why.
// at the fold, the night's conduct (dream.chosen) becomes its echo.

import { dream, markDream, signals, narrate } from './engine.js';

// the six paragraphs — verbatim from 98 - Journal/06.06.26.txt, incl. typos.
// each names its place in the writing's own words.
const STAGES = [
  {
    scene: 'gate',
    name: 'the gate',
    page: 'Fate greets me at the gate. It’s been some time since we last met - she’s growing old.\nHer cold glare doesn’t cut me anymore.',
    arrive: { x: 0, z: 18, yaw: 0 },
    lines: (d) => (d.folds ? ['why was i here again?'] : []),
    // the pass paid, the mushrooms followed to the meadow's west edge
    until: (cam) => dream.pass && signals.trailEnd,
    style: 'veil',
  },
  {
    scene: 'cloakroom',
    name: 'the cloakroom',
    page: '‘ Follow the glowing mushrooms to the cloakroom where you can store your memories for the journey.\n\n A reminder that all dreams are FINAL and cannot be returned after issue.’',
    arrive: { x: 0, z: 40, yaw: 0 },
    lines: [],
    // through the coats, past the counter, out the far mouth
    until: (cam) => cam.z < -42,
    style: 'veil',
  },
  {
    scene: 'willow',
    name: 'under the Willow',
    page: 'A mouse scurries across the green grass. I heard it’s soft footsteps and short-breaths in the brush as I walked by. He has his midnight meeting on the 12th day of the cycle at the old Oak tree, so long my friend. He was wearing his finest little Tuxedo. The sleeves ran too long and the bow-tie was crooked. He was in a rush and his pocket-watch was late.',
    arrive: { x: 26, z: 8, yaw: -Math.PI / 2 },
    lines: [],
    // the road passes the mage's office; walk it west
    until: (cam) => cam.x < -24,
    style: 'veil',
  },
  {
    scene: 'streetlamp',
    name: 'the strawberry field',
    page: 'I waited some time at the street-lamp in the strawberry field. The lamp stood still for most of my wait. I could sense him getting tired when he would start to blink slowly and lean to the side slightly. His warm orange glow would fade to a softer hue before he stands up straight again.',
    arrive: { x: 20, z: -17, yaw: -Math.PI / 2 },
    lines: [],
    // wait with him until he has been tired once; board the ride that stops
    until: () => !!signals.boarded,
    style: 'streak',
    dur: 1.8,
  },
  {
    scene: 'theatre',
    name: 'the show',
    page: 'I’m in a hurry now because I don’t want to miss the trailers. People always call them boring or think that they’re skippable, but they get me excited - I know it’s not long before the show begins. I never found out why they’re called trailer but always precede the dream. Perhaps it’s me who’s trailing?',
    arrive: { x: 0, z: 6, yaw: 0 },
    lines: [],
    onArrive(api) { api.setMoveLock('seated', { yaw: 0 }); },
    // the show, the menu, leaving early, the walk to the stage, the leap
    until: () => !!signals.leapt,
    style: 'fall',
    dur: 1.6,
  },
  {
    scene: 'boat',
    name: 'the small wooden boat',
    page: 'I wake up in a small wooden boat with two ores behind the first blue panel on stage.',
    arrive: { x: 4, z: -33, yaw: 0.9 },
    lines: [],
    // stillness beside the boat; drifting off folds the dream
    until: () => !!signals.folded,
    style: 'veil',
    dur: 2.6,
  },
];

let idx = 0;
let entering = false;

export const nightDirector = {
  begin(api) {
    idx = Math.max(0, Math.min(STAGES.length - 1, dream.stage || 0));
    const s = STAGES[idx];
    entering = true;
    api.enterStage(s.scene, s.arrive);
    // the cold open takes no page — the night begins as it continues.
    // a return mid-night is greeted with the writing's own question.
    if (idx > 0) narrate('why was i here again?');
  },
  update(cam, t, env, api) {
    const s = STAGES[idx];
    if (api.sceneId() !== s.scene) return; // scene still loading
    if (entering) {
      entering = false;
      s.onArrive?.(api);
      const ls = typeof s.lines === 'function' ? s.lines(dream) : s.lines || [];
      ls.forEach(narrate);
    }
    if (!s.until(cam, t, env)) return;
    // stage complete — fold or advance
    if (idx === STAGES.length - 1) {
      markDream('folds', (dream.folds || 0) + 1);
      markDream('pass', false);      // each visit pays again
      markDream('jacket', 'none');   // memories re-stored every visit
      // the fold: this night's conduct becomes the next night's echo
      markDream('echo', { ...(dream.chosen || {}) });
      markDream('chosen', {});
      idx = 0;
    } else {
      idx += 1;
    }
    markDream('stage', idx);
    const n = STAGES[idx];
    entering = true;
    api.transition(n.scene, n.arrive, {
      style: s.style, dur: s.dur,
      page: { name: n.name, text: n.page },
    });
  },
  stageIdx() { return idx; },
  // every char the chapter pages need, merged into every scene's notation
  pageChars() {
    const set = new Set();
    for (const s of STAGES) for (const ch of s.name + s.page) if (ch !== ' ' && ch !== '\n') set.add(ch);
    return [...set];
  },
};
