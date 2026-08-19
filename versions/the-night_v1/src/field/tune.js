// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// tune.js — the material-lock instrument. press T. his eye drives, the numbers follow.
// every change persists to localStorage; "copy" hands the locked values back for baking.

export const DEFAULTS = {
  density: 28000, ambFloor: 0.27, ambAmp: 0.18, ambScale: 1,
  drift: 1, cycle: 1, formBright: 1, formScale: 1, formAlpha: 1,
  palette: 'night',
};
const KEY = 'anima.field.tune';

export function loadSaved() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return { ...DEFAULTS }; }
}

const ROWS = [
  ['density', 'field density', 1000, 60000, 500],
  ['ambFloor', 'ambient glow', 0.02, 0.6, 0.01],
  ['ambAmp', 'ambient shimmer', 0, 0.4, 0.01],
  ['ambScale', 'ambient glyph size', 0.4, 2.2, 0.02],
  ['drift', 'drift speed', 0, 3, 0.05],
  ['cycle', 'character cycling', 0, 3, 0.05],
  ['formBright', 'form brightness', 0.15, 2, 0.01],
  ['formScale', 'form glyph size', 0.4, 2.2, 0.02],
  ['formAlpha', 'form opacity', 0.2, 1, 0.01],
];

export function createTune({ field, summonNames, summon, setPaused }) {
  const s = loadSaved();

  function apply() {
    field.density = s.density;
    const u = field.uniforms;
    u.uAmbFloor.value = s.ambFloor;
    u.uAmbAmp.value = s.ambAmp;
    u.uAmbScale.value = s.ambScale;
    u.uFormBright.value = s.formBright;
    u.uFormScale.value = s.formScale;
    u.uFormAlpha.value = s.formAlpha;
    u.uDrift.value = s.drift;
    u.uCycle.value = s.cycle;
    if (field.palette !== s.palette) field.setPalette(s.palette);
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(s)); }
  apply();

  const el = document.createElement('div');
  el.id = 'tune';
  document.body.appendChild(el);

  const title = document.createElement('div');
  title.className = 'tune-title';
  title.textContent = 'material lock · esc frees the mouse';
  el.appendChild(title);

  const valEls = {};
  for (const [k, label, min, max, step] of ROWS) {
    const row = document.createElement('div');
    row.className = 'tune-row';
    const lab = document.createElement('span');
    lab.textContent = label;
    const val = document.createElement('span');
    val.className = 'tune-val';
    valEls[k] = val;
    const input = document.createElement('input');
    Object.assign(input, { type: 'range', min, max, step, value: s[k] });
    input.addEventListener('input', () => {
      s[k] = parseFloat(input.value);
      valEls[k].textContent = fmt(s[k]);
      apply(); save();
    });
    val.textContent = fmt(s[k]);
    row.append(lab, val, input);
    el.appendChild(row);
  }

  // palette register
  const palRow = document.createElement('div');
  palRow.className = 'tune-btns';
  for (const p of ['night', 'folio', 'rose']) {
    const b = document.createElement('button');
    b.textContent = p;
    b.addEventListener('click', () => {
      s.palette = p; apply(); save(); markPal();
    });
    palRow.appendChild(b);
  }
  const markPal = () => [...palRow.children].forEach((b) => b.classList.toggle('on', b.textContent === s.palette));
  markPal();
  el.appendChild(palRow);

  // summon a form to judge against
  const sumRow = document.createElement('div');
  sumRow.className = 'tune-btns';
  for (const name of summonNames()) {
    const b = document.createElement('button');
    b.textContent = name.replace(', from the shop', ' ·shop');
    b.addEventListener('click', () => summon(name));
    sumRow.appendChild(b);
  }
  el.appendChild(sumRow);

  // copy out the lock
  const out = document.createElement('pre');
  out.className = 'tune-out';
  const actions = document.createElement('div');
  actions.className = 'tune-btns';
  const copy = document.createElement('button');
  copy.textContent = 'copy the lock';
  copy.addEventListener('click', async () => {
    const json = JSON.stringify(s, null, 2);
    out.textContent = json;
    try { await navigator.clipboard.writeText(json); copy.textContent = 'copied ✓'; }
    catch { copy.textContent = 'select below'; }
    setTimeout(() => (copy.textContent = 'copy the lock'), 2200);
  });
  const reset = document.createElement('button');
  reset.textContent = 'reset';
  reset.addEventListener('click', () => {
    Object.assign(s, DEFAULTS);
    apply(); save();
    for (const [k] of ROWS) {
      const input = el.querySelectorAll('input[type=range]')[ROWS.findIndex((r) => r[0] === k)];
      input.value = s[k];
      valEls[k].textContent = fmt(s[k]);
    }
    markPal();
  });
  actions.append(copy, reset);
  el.append(actions, out);

  let open = false;
  const setOpen = (v) => {
    open = v;
    el.style.display = open ? 'block' : 'none';
    setPaused(open); // the cycle waits while the eye works
  };
  addEventListener('keydown', (e) => {
    if (e.code === 'KeyT') setOpen(!open);
  });
  if (new URLSearchParams(location.search).has('tune')) setOpen(true);

  return { settings: s, setOpen };
}

const fmt = (v) => (v >= 100 ? Math.round(v).toLocaleString() : v.toFixed(2));
