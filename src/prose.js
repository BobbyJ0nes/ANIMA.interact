// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// prose.js — the dream's voice. three surfaces: scene prose, the black cut, the margin marker.
// all display text is verbatim from 06.06.26.txt — typos preserved, they're artifacts.

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function createUI() {
  const prose = document.getElementById('prose');
  const inter = document.getElementById('interstitial');
  const marker = document.getElementById('marker');
  const hint = document.getElementById('hint');
  let proseTimer = null;

  function showProse(html, ms = 12000) {
    clearTimeout(proseTimer);
    prose.innerHTML = html;
    prose.classList.add('show');
    if (ms) proseTimer = setTimeout(() => prose.classList.remove('show'), ms);
  }

  return {
    scene(html, id, visits) {
      marker.textContent = visits > 1 ? `${id} · gone and gone again · ${visits}` : id;
      showProse(html);
    },
    line(html, ms = 7000) { showProse(html, ms); },

    // fade to full black (with optional text), resolve once fully dark + any hold done.
    async black(html = '', { holdForKey = false, minMs = 2400 } = {}) {
      prose.classList.remove('show');
      inter.innerHTML = html;
      inter.classList.add('show');
      await wait(1000); // fade-in complete
      const t0 = performance.now();
      if (holdForKey) {
        await new Promise((res) => {
          const h = () => {
            removeEventListener('keydown', h);
            removeEventListener('mousedown', h);
            res();
          };
          addEventListener('keydown', h);
          addEventListener('mousedown', h);
        });
      }
      const rest = minMs - (performance.now() - t0);
      if (rest > 0) await wait(rest);
    },

    // lift the black
    async clear() {
      inter.classList.remove('show');
      await wait(1000);
      inter.innerHTML = '';
    },

    hint(text = '') { hint.textContent = text; },
  };
}
