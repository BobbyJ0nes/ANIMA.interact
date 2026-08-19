// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-cloakroom (/) — veil register, slash-voiced ground.
// "' Follow the glowing mushrooms to the cloakroom where you can store
//   your memories for the journey.'"        (98 - Journal/06.06.26.txt:33)
// " A reminder that all dreams are FINAL and cannot be returned after
//   issue.'"                                (98 - Journal/06.06.26.txt:35)
// coats = the stored memories. depth decides how many hang;
// the crossing sends one wind through all of them at once.
//
// v2 — the closet of identities. read whole (98 - Journal/17.08.26.txt:24):
// "My true self is beneath the many constructed identities I lay in my
//  closet that I must wear. Each jacket slightly larger than the next for
//  when I inevitably out grow it. This delusion and strain as part of the
//  process, a necessary evil."
// so the aisle grows: every coat hangs a little larger than the last, and
// the far end is the ones he has not outgrown into yet. standing still in
// front of one, facing it, is trying it on — for a second the coat's own
// letters leave the hanger and wrap the frame of your looking, then let go.
// walking the aisle straight through is its own conduct, recorded ONLY if
// the aisle was plainly walked (conduct is not intention — sol, 19.08).
// CROSS-ENTRY, FLAGGED for bobby's veto: TRIED_LINE is the jacket sentence
// itself, the one line of 17.08.26 this scene displays. set it to null and
// the try-on runs silent, mechanics unchanged. the heavier sentences of
// that paragraph are form only — never displayed.

import { h2i, vnoise, dream, markDream, choose, facing, liminal, narrate } from '../engine.js';
import { makeNarrator } from './lib/narrator.js';

// the notice, laid along the aisle underfoot
const narrator = makeNarrator(
  'Follow the glowing mushrooms to the cloakroom where you can store your ' +
  'memories for the journey. A reminder that all dreams are FINAL and ' +
  'cannot be returned after issue.',
  [{ x: 0, z: 44 }, { x: 0, z: -38 }]
);

// 17.08.26.txt:24 — bobby-typed, cited, flagged. null = silent fallback.
const TRIED_LINE =
  'each jacket slightly larger than the next for when i inevitably out grow it.';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// the mushroom trail, wandering in from the spawn
const MZ0 = 41, MSTEP = 5.4;
const MUSH = [];
for (let i = 0; i < 15; i++) {
  const z = MZ0 - i * MSTEP;
  MUSH.push({ x: Math.sin(z * 0.35) * 1.2, z });
}
// the pull — gate.js's leading-element grammar, generalized: the crest
// travels down the aisle at reading pace. the way in and the way through
// pulse alike, so following is always the same act.
const litAt = (t, i) => Math.sin(t * 2.2 - i * 0.85) > 0.55;

const MS = { w: 0, i: 0 }; // scratch — ground() runs ~30k times a frame
function nearMush(wx, wz) {
  if (Math.abs(wx) > 3.6) return false;
  const i = Math.round((MZ0 - wz) / MSTEP);
  if (i < 0 || i >= MUSH.length) return false;
  const m = MUSH[i];
  const d = Math.hypot(wx - m.x, wz - m.z);
  if (d >= 1.1) return false;
  MS.w = (1.1 - d) / 1.1; MS.i = i;
  return true;
}

function zEnvelope(z) {
  return clamp01((30 - z) / 8) * clamp01((z + 48) / 8);
}

function heightRaw(x, z) {
  let h = 0.4 + vnoise(x * 0.05, z * 0.05) * 0.7;
  const e = zEnvelope(z);
  if (e > 0) {
    const dl = x - 5.5, dr = x + 5.5;
    h += e * 11 * (Math.exp(-(dl * dl) / 2.2) + Math.exp(-(dr * dr) / 2.2));
  }
  const dz = z + 47;
  h += 11 * Math.exp(-(dz * dz) / 6) * clamp01((8 - Math.abs(x)) / 3);
  return h;
}

// ---------------------------------------------------------------- the coats

const Z0 = 21, Z1 = -33;
const COAT_CH = ['/', '\\', '(', ')', '|'];
let SLOTS = null, ORDER = null, RANK = null, FIXED = null, YOURS = null;

// the coat you left last time — warmer hook, a touch brighter than the rest
function yourCoat() {
  const px = -2.8, pz = 19.4;
  const pts = [{ x: px, y: 3.42, z: pz, ch: '·', band: 6, lift: 1 }];
  pts.push({ x: px - 0.14, y: 3.14, z: pz, ch: '(', band: 7, lift: 1 });
  pts.push({ x: px + 0.14, y: 3.14, z: pz, ch: ')', band: 7, lift: 1 });
  for (let y = 3.02, r = 0; y >= 1.7; y -= 0.11, r++) {
    const sp = 0.1 + Math.min(0.06, r * 0.008);
    pts.push({ x: px - sp, y, z: pz, ch: '/', band: 7, lift: 0 });
    pts.push({ x: px + sp, y, z: pz, ch: '\\', band: 7, lift: 0 });
  }
  return pts;
}

function build() {
  SLOTS = [];
  for (const side of [-1, 1]) {
    for (let z = Z0; z >= Z1; z -= 1.8) {
      const k = SLOTS.length;
      const px = side * 2.8 + (h2i(k, 11) - 0.5) * 0.3;
      const pz = z + (h2i(k, 12) - 0.5) * 0.6;
      const tone = h2i(k, 13);
      const band = tone > 0.93 ? 7 : tone > 0.72 ? 5 : 4;
      const lift = tone > 0.93 ? 1 : 0;
      // "Each jacket slightly larger than the next for when I inevitably out
      // grow it." — the same rail all the way down; the cloth grows on it.
      const u = clamp01((Z0 - z) / (Z0 - Z1));
      const gw = 1 + u * 1.15;   // shoulders, and more cloth to hang
      const gh = 1 + u * 0.32;   // and hem, dropping toward the floor
      const pts = [];
      pts.push({ x: px, y: 3.42, z: pz, ch: '·', band: 8, lift: 0, bx: px, hang: 0 });
      const sh = 0.14 * gw;
      pts.push({ x: px - sh, y: 3.14, z: pz, ch: '(', band, lift, bx: px - sh, hang: 0.1 });
      pts.push({ x: px + sh, y: 3.14, z: pz, ch: ')', band, lift, bx: px + sh, hang: 0.1 });
      const hem = 3.3 - (1.45 + h2i(k, 14) * 0.5) * gh;
      let r = 0;
      for (let y = 3.02; y >= hem; y -= 0.11, r++) {
        const sp = (0.1 + Math.min(0.06, r * 0.008)) * gw;
        const hang = 3.3 - y;
        pts.push({ x: px - sp, y, z: pz, ch: '/', band, lift, bx: px - sp, hang });
        pts.push({ x: px + sp, y, z: pz, ch: '\\', band, lift, bx: px + sp, hang });
        // a larger coat is more cloth, never a sparser one
        if (gw > 1.5) {
          const sm = sp * 0.44;
          pts.push({ x: px - sm, y, z: pz, ch: '/', band, lift, bx: px - sm, hang });
          pts.push({ x: px + sm, y, z: pz, ch: '\\', band, lift, bx: px + sm, hang });
        }
        if (r % 3 === 1) pts.push({ x: px, y, z: pz, ch: '|', band, lift: lift - 1, bx: px, hang });
      }
      SLOTS.push({ pts, ph: h2i(k, 15) * 0.8, cx: px, cz: pz, band, hold: undefined });
    }
  }
  ORDER = SLOTS.map((_, i) => i).sort((a, b) => h2i(a, 21) - h2i(b, 21));
  RANK = [];
  ORDER.forEach((s, i) => { RANK[s] = i; });

  FIXED = [];
  // the rails the memories hang from
  for (const side of [-1, 1])
    for (let z = -34; z <= 21.6; z += 0.14)
      FIXED.push({ x: side * 2.8, y: 3.3, z, ch: '═', band: 8, lift: 0 });
  // the counter at the far end — no one behind it
  for (let x = -2; x <= 2.01; x += 0.13) {
    for (let y = 0.12; y <= 1.02; y += 0.13)
      FIXED.push({ x, y, z: -40, ch: '▓', band: 3, lift: 0 });
    FIXED.push({ x, y: 1.12, z: -40, ch: '═', band: 4, lift: 0 });
  }
}

// ------------------------------------------------------------- the try-on
// trying it on: for one second the coat's letters leave the hanger and
// condense around the frame of your looking, then release. cells sit just
// in front of the camera at the edge of the field — cloth crowding the
// eye, not a figure; likeness stays unresolved.

function tryOnWrap(cam, u, band) {
  const pts = [];
  if (u < 0 || u > 1) return pts;
  const sy = Math.sin(cam.yaw), cy = Math.cos(cam.yaw);
  // it closes from the middle of your looking out to the frame's edge, holds
  // there a beat, then passes beyond it — worn, and let go. one dial does it:
  // the cloth's distance from the eye.
  const f = u < 0.55 ? 3.4 - 1.8 * (u / 0.55)
    : u < 0.75 ? 1.6 : 1.6 - 1.05 * ((u - 0.75) / 0.25);
  const j = (1 - u) * 0.28;                        // it settles as it arrives
  let seed = 0;
  for (const k of [1, 0.92]) {                     // the rim, and a fold behind
    const SW = 1.16 * k, TY = 0.52 * k, BY = -0.74 * k;
    for (let e = 0; e < 4; e++) {
      const N = e < 2 ? 40 : 70;
      for (let i = 0; i <= N; i++, seed++) {
        const a = i / N;
        if (u < h2i(seed, 77) * 0.18) continue;    // they arrive unevenly
        if (k < 1 && h2i(seed, 80) < 0.45) continue;
        let sd, dy;
        if (e < 2) { sd = e ? SW : -SW; dy = BY + a * (TY - BY); }
        // spaced by angle, not by span: the rim's dashes stay even
        else { sd = (SW * Math.tan(1.256 * a - 0.628)) / 0.7255; dy = e === 2 ? TY : BY; }
        sd += (h2i(seed, 78) - 0.5) * j;
        pts.push({
          x: cam.x + sy * f + cy * sd,
          y: cam.y + dy + (h2i(seed, 79) - 0.5) * j * 0.6,
          z: cam.z - cy * f + sy * sd,
          ch: COAT_CH[seed % COAT_CH.length],
          band, lift: u > 0.82 ? 1 : 2,
        });
      }
    }
  }
  return pts;
}

let lastT = 0, lastX = 1e9, lastZ = 1e9;
let stillT = 0, nearIdx = -1;
let tryT = -1, triedIdx = -1, passAckT = -1, aisleIn = false;

export default {
  id: 'cloakroom',
  title: 'the cloakroom (/)',
  register: 'veil',
  notation: {
    // the cloakroom is the slash — the ground itself speaks in it
    ramp: [' ', '.', '·', ':', '/', '(', ')', '|', '\\', '#', '@'],
    extra: ['(', ')', '/', '\\', '|', '·', ':', '═', '▓', 'N', 'L'],
  },
  world: {
    far: 240,
    waterLevel: 0,
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g, t) {
      // the trail's own light travels with the pulse above it
      if (nearMush(wx, wz)) {
        g.band = 6;
        g.lum += MS.w * (0.45 + (litAt(t, MS.i) ? 0.2 : 0));
        return;
      }
      narrator.apply(wx, wz, g);
    },
  },
  spawn: { x: 0, z: 44, yaw: 0 },
  sky: { stars: 0.5, moon: false },
  beings(t, cam, env) {
    if (!SLOTS) build();
    const dt = Math.min(0.1, Math.max(0, t - lastT));
    lastT = t;
    const moved = Math.hypot(cam.x - lastX, cam.z - lastZ);
    lastX = cam.x; lastZ = cam.z;

    // stepping into the aisle stores the jacket — the journey's deposit
    if (dream.jacket === 'none' && cam.z < 24 && Math.abs(cam.x) < 5) markDream('jacket', 'stored');
    // memories accumulate as you go under
    const n = 8 + Math.floor(env.ch.depth * (SLOTS.length - 8));
    const L = liminal();
    // the crossing sends one wind through the stored memories. deeper in the
    // night they sway slower and heavier — the one liminal coupling, gains
    // only: at L=0 this is exactly the walk you already knew.
    const sway = (0.025 + env.ch.crossing * 0.32) * (1 + 0.55 * L);
    const rate = 1.35 / (1 + 0.6 * L);

    // --- conduct. which coat are you standing in front of, and for how long
    let cand = -1, bestD = 99;
    if (Math.abs(cam.x) < 3.2) {
      for (let i = 0; i < SLOTS.length; i++) {
        if (RANK[i] >= n) continue;                 // it isn't hanging tonight
        const s = SLOTS[i];
        if (Math.abs(cam.z - s.cz) > 1.5) continue;
        const d = Math.hypot(cam.x - s.cx, cam.z - s.cz);
        if (d < bestD && d < 3.4) { bestD = d; cand = i; }
      }
    }
    if (cand !== nearIdx) { nearIdx = cand; stillT = 0; }
    const faced = cand >= 0 && facing(SLOTS[cand].cx, SLOTS[cand].cz, 0.55);
    if (moved < 0.012 && faced) stillT += dt; else stillT = 0;
    if (tryT < 0 && stillT > 2) {
      // stillness in front of one coat, facing it: you are trying it on
      tryT = t; triedIdx = cand;
      choose('coat', 'tried');
      markDream('coatWorn', cand);        // which one — for the night after
      if (TRIED_LINE) narrate(TRIED_LINE);
    }
    // walking it through. only a plainly walked aisle is a walking-past: if
    // the visitor never entered it the night keeps no interpretation, and a
    // try-on afterwards supersedes it — the deliberate act is the one meant.
    if (cam.z < 20.5 && cam.z > -20 && Math.abs(cam.x) < 4.2) aisleIn = true;
    if (aisleIn && tryT < 0 && cam.z < -34 && Math.abs(cam.x) < 4.2 &&
        dream.chosen.coat !== 'passed') {
      choose('coat', 'passed');
      passAckT = t;                       // the way through brightens once
    }

    // --- the coats
    const worn = dream.echo.coat === 'tried' ? dream.coatWorn : undefined;
    const remembers = typeof worn === 'number' && worn >= 0 && worn < SLOTS.length;
    const wrap = tryT > 0 ? (t - tryT) / 1.5 : 9;
    const out = [];
    for (let oi = 0; oi <= n; oi++) {
      let si;
      if (oi < n) si = ORDER[oi];
      else if (remembers && RANK[worn] >= n) si = worn;  // it is always there
      else break;
      const s = SLOTS[si];
      let off = Math.sin(t * rate + s.ph) * sway;
      // last night you stood in front of this one. it stops swaying as you
      // pass — it remembers the shape of you.
      if (remembers && si === worn && Math.abs(cam.z - s.cz) < 7) {
        if (s.hold === undefined) s.hold = off;
        off = s.hold;
      } else if (s.hold !== undefined) s.hold = undefined;
      const bare = wrap < 1 && si === triedIdx;   // its letters are on you
      for (let j = 0; j < s.pts.length; j++) {
        const p = s.pts[j];
        p.x = p.bx + off * p.hang * 0.42;
        if (bare && h2i(j * 3 + si, 61) < 0.6) continue;
        out.push(p);
      }
    }
    if (wrap < 1) out.push(...tryOnWrap(cam, wrap, SLOTS[triedIdx]?.band ?? 5));

    // the glowing mushrooms — the pulse travels toward the counter: this way
    const ack = passAckT > 0 && t - passAckT < 1.6 ? 1 : 0;
    for (let i = 0; i < MUSH.length; i++) {
      const m = MUSH[i];
      const on = litAt(t, i);
      out.push({ x: m.x, y: 0.52, z: m.z, ch: '·', band: 6, lift: (on ? 2 : 1) + ack });
      out.push({ x: m.x, y: 0.28, z: m.z, ch: ':', band: 6, lift: (on ? 1 : 0) + ack });
    }
    out.push(...FIXED);
    // on a return visit, the coat you stored hangs by the entrance
    if ((dream.visited.cloakroom || 0) > 1) {
      if (!YOURS) YOURS = yourCoat();
      out.push(...YOURS);
    }
    return out;
  },
  line: {
    text: 'all dreams are FINAL and cannot be returned after issue.',
    x: 0, z: -40, y: 2.7, radius: 13, // engine's legacy x-offset removed 19.08
  },
};
