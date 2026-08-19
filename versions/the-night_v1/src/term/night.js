// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// night.js — the director. the dream plays in the writing's order:
// gate → (mushrooms) → cloakroom → (the road) → willow → streetlamp →
// the wait → the ride stops, once, for you → the theatre, seated →
// the leap → the boat → drifting off → ** curtains close ** → the fold.
// transitions are the writing's own transports; between places the world
// dissolves into the letters it was always made of.

import { dream, markDream, signals, narrate } from './engine.js';

const STAGES = [
  {
    scene: 'gate',
    arrive: { x: 0, z: 18, yaw: 0 },
    lines: (d) => (d.folds ? ['why was i here again?'] : []),
    // the pass paid, the mushrooms followed to the meadow's west edge
    until: (cam) => dream.pass && signals.trailEnd,
    style: 'veil',
  },
  {
    scene: 'cloakroom',
    arrive: { x: 0, z: 40, yaw: 0 },
    lines: ['a reminder that all dreams are FINAL and cannot be returned after issue.'],
    // through the coats, past the counter, out the far mouth
    until: (cam) => cam.z < -42,
    style: 'veil',
  },
  {
    scene: 'willow',
    arrive: { x: 26, z: 8, yaw: -Math.PI / 2 },
    lines: ['a mouse scurries across the green grass.'],
    // the road passes the mage's office; walk it west
    until: (cam) => cam.x < -24,
    style: 'veil',
  },
  {
    scene: 'streetlamp',
    arrive: { x: 20, z: -17, yaw: -Math.PI / 2 },
    lines: [
      'i waited some time at the street-lamp in the strawberry field.',
      'the lamp stood still for most of my wait.',
    ],
    // wait with him until he has been tired once; board the ride that stops
    until: () => !!signals.boarded,
    style: 'streak',
    dur: 1.8,
  },
  {
    scene: 'theatre',
    arrive: { x: 0, z: 6, yaw: 0 },
    lines: ["i'm in a hurry now because i don't want to miss the trailers."],
    onArrive(api) { api.setMoveLock('seated', { yaw: 0 }); },
    // the show, the menu, leaving early, the walk to the stage, the leap
    until: () => !!signals.leapt,
    style: 'fall',
    dur: 1.6,
  },
  {
    scene: 'boat',
    arrive: { x: 4, z: -33, yaw: 0.9 },
    lines: ['i wake up in a small wooden boat with two ores behind the first blue panel on stage.'],
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
    // onArrive fires on the first update after the scene is live
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
      idx = 0;
    } else {
      idx += 1;
    }
    markDream('stage', idx);
    const n = STAGES[idx];
    entering = true;
    api.transition(n.scene, n.arrive, { style: s.style, dur: s.dur });
  },
  stageIdx() { return idx; },
};
