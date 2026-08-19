// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// lib/hand.js — the faded hand. the night's choice grammar, transcribed from
// his own sentence (98 - Journal/17.08.26.txt): "Every time a faded hand
// extends itself to me, for some reason I decline and wait patiently for a
// formed one to pull me by my arm."
// a dim hand condenses at a decision; taking it or declining is read from
// conduct — nearness, facing, stillness — never from a prompt. declining
// never blocks the night: the formed hand arrives anyway.
// HONESTY RULE (19.08, sol consult): conduct is not intention. a verdict is
// recorded only when it was clearly witnessed — the offer fully formed and
// the visitor plainly met it (faced it, near, a beat). a hand that was never
// truly encountered resolves to 'unwitnessed': the night advances, keeps NO
// interpretation, and leaves only an '…' — the mark of what the system
// cannot honestly resolve. scenes call choose() for 'taken'/'declined' ONLY.

import { h2i, facing } from '../../engine.js';

// relative cells of a small reaching hand — palm, thumb, three fingers
const SHAPE = [
  { dx: 0.0, dy: 0.0, ch: '▒' },
  { dx: -0.14, dy: -0.12, ch: '░' },
  { dx: -0.26, dy: 0.06, ch: '░' },
  { dx: 0.1, dy: 0.2, ch: '/' },
  { dx: 0.2, dy: 0.34, ch: '/' },
  { dx: -0.04, dy: 0.24, ch: '\\' },
  { dx: 0.3, dy: 0.14, ch: '·' },
];

// makeHand({ x, z, y, radius, cone, dwell, seed, onVerdict })
// call update(t, cam) every frame from beings(); concat its points.
// states: waiting → offered (near; it holds, barely settling) →
//   taken     — faced up close, held a beat: it firms warm, then goes
//   declined  — witnessed, then deliberately left: it closes and lowers,
//               the refusal visibly received
//   unwitnessed — seen by the system, never truly met by the visitor:
//               it thins away; an '…' lingers, settling into no verdict
// onVerdict fires once with 'taken' | 'declined' | 'unwitnessed'.
export function makeHand(opts) {
  const o = {
    y: 2.1, radius: 8, cone: 0.45, dwell: 1.4, seed: 41,
    onVerdict: null, ...opts,
  };
  let state = 'waiting';
  let seenT = 0, faceT = 0, witT = 0, verdictT = 0, lastT = 0;

  function verdict(v, t) {
    state = v;
    verdictT = t;
    if (o.onVerdict) { try { o.onVerdict(v); } catch {} }
    o.onVerdict = null;
  }

  return {
    get state() { return state; },
    update(t, cam) {
      const dt = Math.min(0.1, Math.max(0, t - lastT));
      lastT = t;
      const d = Math.hypot(cam.x - o.x, cam.z - o.z);
      if (state === 'waiting' && d < o.radius) { state = 'offered'; seenT = t; }
      if (state === 'offered') {
        const faced = facing(o.x, o.z, o.cone);
        // witnessing: the visitor plainly met the offer — near and facing
        if (d < o.radius * 0.9 && faced) witT += dt;
        // taking: close, facing, staying with it a moment
        if (d < o.radius * 0.45 && faced) faceT += dt;
        else faceT = Math.max(0, faceT - dt * 2);
        if (faceT > o.dwell) verdict('taken', t);
        else if (d > o.radius * 1.25 && t - seenT > 1) {
          // leaving: only a witnessed offer can be refused. an unmet one
          // resolves to nothing — the night keeps no interpretation.
          verdict(witT > 0.4 ? 'declined' : 'unwitnessed', t);
        }
      }
      const pts = [];
      if (state === 'waiting') return pts;
      const gone = state === 'taken' ? 1.6 : state === 'declined' ? 2.4 : state === 'unwitnessed' ? 2.0 : Infinity;
      const age = state === 'offered' ? 0 : t - verdictT;
      // the unresolved mark outlives the hand — a trace, not a verdict
      if (state === 'unwitnessed' && age < 6.5) {
        pts.push({ x: o.x, y: o.y + 0.1, z: o.z, ch: '…', band: 2, lift: age < 2 ? 0 : -1 });
      }
      if (age > gone) return pts;
      const reach = Math.sin(t * 0.7 + o.seed) * 0.08; // it breathes, slightly
      for (let i = 0; i < SHAPE.length; i++) {
        const s = SHAPE[i];
        // faded: letters barely settle — cells flicker out and return
        if (state === 'offered' && h2i(Math.floor(t * 7) + i * 5, o.seed) < 0.3) continue;
        // declined: the hand closes and lowers — the refusal received
        const curl = state === 'declined' ? Math.min(1, age / 1.2) : 0;
        const sink = state === 'declined' ? age * 0.4 : 0;
        // unwitnessed: it simply thins where it stood
        if (state === 'unwitnessed' && h2i(i * 11, o.seed + 3) < age / gone) continue;
        pts.push({
          x: o.x + s.dx * (1 - curl * 0.6) + reach,
          y: o.y + s.dy * (1 - curl * 0.5) - sink,
          z: o.z,
          ch: curl > 0.7 && s.ch !== '▒' ? '·' : s.ch,
          band: state === 'taken' ? 6 : 2, // warm when it firms; dim before
          lift: state === 'taken' ? 1 : 0,
        });
      }
      return pts;
    },
  };
}
