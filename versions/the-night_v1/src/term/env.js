// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// env.js — the environment-state layer. the world's weather is a signal.
//
// two sources, honesty-labeled (the board's taxonomy):
//   MODEL    — coupled slow oscillators, deterministic in t. an algorithm
//              breathing, never claiming to be a body.
//   RECORDED — the 06.06 writing session's own biosignals (muse athena s,
//              74 min), preprocessed to /eeg/session01.json and replayed
//              on a loop, time-compressed. the night the writing was
//              written, driving the world the writing became.
// (LIVE — a muse streaming over web bluetooth — is the unopened door.)
//
// channels, all 0..1 unless noted:
//   drift    alpha-ish        — slow wandering attention
//   depth    delta+theta-ish  — how far under
//   focus    beta/alpha-ish   — surface grip
//   tension  beta-ish         — the body holding on
//   spark    gamma-ish        — small lightnings
//   slope    -1..1            — the 1/f tilt; the crossing lives here
//   crossing 0..1 envelope    — the regime change (~min 28 of the session)

export const env = {
  source: 'model',
  label: 'MODEL',
  recAvailable: false,
  timescale: 6, // recorded session replays 6x compressed (~12 min loop)
  t: 0,
  ch: { drift: 0.5, depth: 0.5, focus: 0.5, tension: 0.3, spark: 0.3, slope: 0, crossing: 0 },
};

let rec = null; // { dt, n, series: {drift:[],depth:[],focus:[],tension:[],spark:[],slope:[]}, events: [sec,...] }
const STORE = 'anima.term.env';

export async function initEnv() {
  try {
    const r = await fetch('/eeg/session01.json');
    if (r.ok) {
      rec = await r.json();
      env.recAvailable = !!(rec && rec.series && rec.n > 0);
    }
  } catch {}
  let saved = null;
  try { saved = localStorage.getItem(STORE); } catch {}
  if (saved === 'recorded' && env.recAvailable) setSource('recorded');
}

export function setSource(s) {
  if (s === 'recorded' && !env.recAvailable) s = 'model';
  env.source = s;
  env.label = s === 'recorded' ? 'RECORDED' : 'MODEL';
  try { localStorage.setItem(STORE, s); } catch {}
}

export function toggleSource() {
  setSource(env.source === 'model' ? 'recorded' : 'model');
}

function clamp01(v) { return Math.max(0, Math.min(1, v)); }

function modelStep(t) {
  const c = env.ch;
  c.drift = clamp01(0.45 + 0.3 * Math.sin(t * 0.023 + 1.7) + 0.12 * Math.sin(t * 0.101 + 0.4));
  c.depth = clamp01(0.5 + 0.3 * Math.sin(t * 0.011 + 4.0) + 0.1 * Math.sin(t * 0.043));
  c.focus = clamp01(0.5 + 0.35 * Math.sin(t * 0.019 + 5.5));
  c.tension = clamp01(0.25 + 0.18 * Math.sin(t * 0.037 + 2.2) + 0.18 * Math.pow(Math.max(0, Math.sin(t * 0.0171 + 0.8)), 3));
  c.spark = clamp01(0.32 + 0.25 * Math.sin(t * 0.31 + 0.9) * Math.sin(t * 0.077));
  c.slope = 0.6 * Math.sin(t * 0.007 + 3.1);
  // a rare wave passing through the model's night, every ~4 minutes
  const u = (t % 240) / 240;
  c.crossing = clamp01(1 - Math.abs(u - 0.58) / 0.045);
}

function lerp(a, b, u) { return a + (b - a) * u; }

function recordedStep(t) {
  const c = env.ch;
  const total = rec.n * rec.dt;
  const sec = (t * env.timescale) % total;
  const fi = sec / rec.dt;
  const i0 = Math.floor(fi) % rec.n;
  const i1 = (i0 + 1) % rec.n;
  const u = fi - Math.floor(fi);
  for (const k of ['drift', 'depth', 'focus', 'tension', 'spark', 'slope']) {
    const s = rec.series[k];
    if (s) c[k] = lerp(s[i0], s[i1], u);
  }
  c.crossing = 0;
  if (rec.events) {
    for (const ev of rec.events) {
      c.crossing = Math.max(c.crossing, clamp01(1 - Math.abs(sec - ev) / 45));
    }
  }
  env.sessionSec = sec; // where in the 74 minutes the replay currently is
}

export function updateEnv(t) {
  env.t = t;
  if (env.source === 'recorded' && rec) recordedStep(t);
  else modelStep(t);
}
