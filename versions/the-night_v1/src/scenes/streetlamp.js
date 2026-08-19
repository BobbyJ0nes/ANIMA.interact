// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-streetlamp-in-the-strawberry-field — the waiting room. the lamp is tired.
// nothing happens here except the lamp's cycle, and that's the point.
// the ride only arrives after he has been tired once, fully.

import * as THREE from 'three';
import { M, ground, box, cyl, glow } from './lib.js';

export const streetlamp = {
  id: 'the-streetlamp-in-the-strawberry-field',
  fog: 0x091120,
  density: 0.038,
  prose: `I waited some time at the street-lamp in the strawberry field. The lamp stood still for most of my wait. I could sense him getting tired when he would start to blink slowly and lean to the side slightly. His warm orange glow would fade to a softer hue before he stands up straight again.`,
  interstitial: {
    html: `I'm in a hurry now because I don't want to miss the trailers. People always call them boring or think that they're skippable, but they get me excited - I know it's not long before the show begins.`,
    minMs: 5200,
  },

  build(ctx) {
    const g = new THREE.Group();
    g.add(ground(0x0b100c));
    g.add(new THREE.HemisphereLight(0x1a2a44, 0x05070c, 0.28));

    // strawberries, barely visible until the lamp finds them
    for (let i = 0; i < 70; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 24;
      const b = new THREE.Mesh(
        new THREE.SphereGeometry(0.05 + Math.random() * 0.045, 8, 6),
        M(0x571623, { roughness: 0.85 })
      );
      b.position.set(Math.cos(a) * r, 0.05, -8 + Math.sin(a) * r);
      g.add(b);
    }

    // the lamp
    const lamp = new THREE.Group();
    const post = cyl(0.09, 0.11, 4.2, M(0x12151b), 10);
    post.position.y = 2.1;
    lamp.add(post);
    const head = box(0.5, 0.3, 0.5, M(0x14171d));
    head.position.y = 4.3;
    lamp.add(head);
    const bulb = glow(0xffa14d, 0.11, 3.2);
    bulb.position.y = 4.08;
    lamp.add(bulb);
    const light = new THREE.PointLight(0xffa14d, 85, 26, 1.6);
    light.position.y = 4.05;
    lamp.add(light);
    lamp.position.set(0, 0, -8);
    g.add(lamp);

    // his cycle: steady → slow blinks → lean → softer hue → stands up straight again
    function cycle(t) {
      const c = t % 26;
      let I = 1, lean = 0;
      if (c > 9 && c < 13) I = 1 - 0.75 * Math.max(0, Math.sin((c - 9) * Math.PI * 1.5)) ** 3;
      if (c >= 13 && c < 16) lean = ((c - 13) / 3) * 0.07;
      if (c >= 16 && c < 21) { lean = 0.07; I = 0.55; }
      if (c >= 21 && c < 24) { const k = (c - 21) / 3; lean = 0.07 * (1 - k); I = 0.55 + 0.45 * k; }
      return { I, lean };
    }

    let rideCalled = false;
    return {
      group: g,
      spawn: { pos: new THREE.Vector3(0, 0, 2), yaw: 0 },
      update(t) {
        const { I, lean } = cycle(t);
        lamp.rotation.z = lean;
        light.intensity = 85 * I;
        bulb.material.emissiveIntensity = 3.2 * I;
        if (!rideCalled && t > 27.5) {
          rideCalled = true;
          ctx.ui.line(`My ride arrives at 00:68. Only a couple minutes to late, I should get going.`, 10000);
          ctx.ui.hint('( walk on )');
        }
        this.ready = rideCalled;
      },
      checkExit(p, t) {
        if (!this.ready) return false;
        return Math.hypot(p.x, p.z + 8) > 12;
      },
    };
  },
};
