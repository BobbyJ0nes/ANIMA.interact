// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// circuit.js — the order of the dream, the cuts between scenes, the leap, the fold.
// dreams don't travel: every transition is a cut to black. the black can speak.

import * as THREE from 'three';
import { gate } from './scenes/gate.js';
import { cloakroom } from './scenes/cloakroom.js';
import { willow } from './scenes/willow.js';
import { streetlamp } from './scenes/streetlamp.js';
import { theatre } from './scenes/theatre.js';
import { boat } from './scenes/boat.js';

const ORDER = [gate, cloakroom, willow, streetlamp, theatre, boat];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function dispose(root) {
  root.traverse((o) => {
    o.geometry?.dispose();
    if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
    else o.material?.dispose();
  });
}

export function createCircuit(scene, ctx) {
  const { ui, player, camera } = ctx;
  let idx = 0;
  let visits = 1;
  let current = null;
  let elapsed = 0;
  let transitioning = true; // boot holds the world until begin()

  function load(i) {
    idx = i;
    if (current) {
      scene.remove(current.api.group);
      dispose(current.api.group);
    }
    const def = ORDER[i];
    const api = def.build(ctx);
    scene.add(api.group);
    scene.fog = new THREE.FogExp2(def.fog, def.density ?? 0.045);
    scene.background = new THREE.Color(def.fog);
    player.place(api.spawn.pos, api.spawn.yaw ?? 0, def.eye ?? 1.65);
    player.enabled = def.walk !== false;
    ui.hint(def.walk === false ? '( look )' : 'click to look · wasd to walk');
    elapsed = 0;
    current = { def, api };
  }

  function announce() {
    ui.scene(current.def.prose, current.def.id, visits);
  }

  // the dive: rock, no splash, the leap of faith
  async function leapFall() {
    player.enabled = false;
    ui.line(`I toss a rock below`, 2400);
    await wait(1500);
    ui.line(`There's never a splash`, 2600);
    await wait(1600);
    const y0 = camera.position.y;
    const t0 = performance.now();
    await new Promise((res) => {
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / 2300);
        camera.position.y = y0 - 14 * k * k;
        if (k >= 1) res();
        else requestAnimationFrame(step);
      };
      step();
    });
    await ui.black(`I take a leap of faith anyways`, { minMs: 3200 });
  }

  async function advance() {
    if (transitioning) return;
    transitioning = true;
    const def = current.def;
    if (def.leap) {
      await leapFall();
    } else {
      const inter = def.interstitial;
      await ui.black(inter?.html ?? '', {
        holdForKey: inter?.holdForKey ?? false,
        minMs: inter?.minMs ?? 1400,
      });
    }
    const next = (idx + 1) % ORDER.length;
    if (next === 0) visits++; // the fold — gone and gone again
    load(next);
    await ui.clear();
    announce();
    transitioning = false;
  }

  const circuit = {
    get visits() { return visits; },
    get sceneId() { return current?.def.id; },
    async begin() {
      load(0);
      await ui.clear();
      announce();
      transitioning = false;
    },
    next: advance,
    async goto(i) {
      if (transitioning) return;
      transitioning = true;
      await ui.black('', { minMs: 600 });
      load(((i % ORDER.length) + ORDER.length) % ORDER.length);
      await ui.clear();
      announce();
      transitioning = false;
    },
    update(dt) {
      if (!current) return;
      elapsed += dt;
      current.api.update?.(elapsed, dt);
      if (!transitioning && current.api.checkExit?.(player.pos, elapsed)) advance();
    },
  };

  // dev conveniences — not part of the dream
  addEventListener('keydown', (e) => {
    if (e.code === 'KeyN') advance();
  });

  return circuit;
}
