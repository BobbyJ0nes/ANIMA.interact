// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-theatre — three otter compères. the leftmost stands 15cm too far away,
// facing outward, watching memories. walking past the floating steps is the leap.

import * as THREE from 'three';
import { M, ground, box, cyl, glow } from './lib.js';

export const theatre = {
  id: 'the-theatre',
  fog: 0x0a0709,
  density: 0.05,
  leap: true, // exiting this scene is the dive
  prose: `The curtains draw. This time it's three little silver-suit wearing Otter's doing the introduction.`,

  build(ctx) {
    const g = new THREE.Group();
    g.add(ground(0x0b0808));
    g.add(new THREE.HemisphereLight(0x1c1214, 0x050304, 0.32));
    const stageLight = new THREE.PointLight(0xffc98a, 140, 26, 1.7);
    stageLight.position.set(0, 4.5, -14);
    g.add(stageLight);
    const house = new THREE.PointLight(0x8a7060, 18, 26, 1.8);
    house.position.set(0, 6, 6);
    g.add(house);

    // seats behind you
    const seatMat = M(0x0e0a0c);
    for (let row = 0; row < 5; row++) {
      for (let i = 0; i < 8; i++) {
        const seat = box(0.8, 0.75, 0.8, seatMat);
        seat.position.set(-5.25 + i * 1.5, 0.37, 4 + row * 2);
        g.add(seat);
        const back = box(0.8, 0.7, 0.12, seatMat);
        back.position.set(-5.25 + i * 1.5, 1.05, 4.4 + row * 2);
        g.add(back);
      }
    }

    // stage + proscenium + curtains
    const stage = box(14, 0.6, 8, M(0x141014));
    stage.position.set(0, 0.3, -16);
    g.add(stage);
    for (const x of [-6, 6]) {
      const col = box(1, 7, 1, M(0x1a1114));
      col.position.set(x, 3.5, -12.5);
      g.add(col);
    }
    const lintel = box(14, 1.2, 1, M(0x1a1114));
    lintel.position.set(0, 6.5, -12.5);
    g.add(lintel);
    const curtainMat = new THREE.MeshStandardMaterial({
      color: 0x4a1518, emissive: 0x2a0c0e, emissiveIntensity: 0.45, side: THREE.DoubleSide, roughness: 1,
    });
    for (const x of [-4.4, 4.4]) {
      const c = new THREE.Mesh(new THREE.PlaneGeometry(5, 6.2), curtainMat);
      c.position.set(x, 3.4, -12.2);
      c.rotation.y = x < 0 ? 0.25 : -0.25;
      g.add(c);
    }

    // the three otters
    const otterMat = M(0x2a2e38, { metalness: 0.5, roughness: 0.45 }); // silver suits, in this light
    const mkOtter = (x, ry = 0) => {
      const o = new THREE.Group();
      const bodyGeo = new THREE.CapsuleGeometry(0.26, 0.38, 6, 12);
      o.add(new THREE.Mesh(bodyGeo, otterMat));
      o.position.set(x, 1.25, -13.6);
      o.rotation.y = ry;
      g.add(o);
      return o;
    };
    mkOtter(1.25);
    const mid = mkOtter(0);
    const hank = box(0.08, 0.06, 0.02, new THREE.MeshStandardMaterial({
      color: 0x8a1420, emissive: 0x5a0c14, emissiveIntensity: 0.5,
    }));
    hank.position.set(-0.09, 0.12, 0.26);
    mid.add(hank);
    // the leftmost — 15 centimeters too far away, facing outwards slightly too much
    const left = mkOtter(-1.4, -0.55);
    const glintL = glow(0xfff2cc, 0.02, 1);
    glintL.position.set(-0.08, 0.28, 0.24);
    left.add(glintL);
    const glintR = glow(0xfff2cc, 0.02, 1);
    glintR.position.set(0.08, 0.28, 0.24);
    left.add(glintR);

    // the endless stairs, floating behind the stage
    const steps = [];
    for (let i = 0; i < 6; i++) {
      const s = box(1.2, 0.18, 0.6, M(0x100d10));
      s.position.set(0, 1.2 + i * 0.72, -19 - i * 1.0);
      s.userData.baseY = s.position.y;
      g.add(s);
      steps.push(s);
    }

    let spoke = false;
    return {
      group: g,
      spawn: { pos: new THREE.Vector3(0, 0, 10), yaw: 0 },
      update(t, dt) {
        // he watches the memories; the glint barely holds
        const k = 0.55 + Math.sin(t * 0.9) * 0.45;
        glintL.material.emissiveIntensity = k;
        glintR.material.emissiveIntensity = k;
        for (const [i, s] of steps.entries()) s.position.y = s.userData.baseY + Math.sin(t * 0.6 + i) * 0.06;
        // stage height underfoot
        const p = ctx.player.pos;
        const onStage = Math.abs(p.x) < 7 && p.z < -12 && p.z > -20;
        const target = onStage ? 2.25 : 1.65;
        ctx.player.eye += (target - ctx.player.eye) * Math.min(1, dt * 5);
        if (!spoke && t > 9) {
          spoke = true;
          ctx.ui.line(
            `" … and so it is with great pleasure that we introduce the cast of tonight's dream."<br><span style="font-size:13px;opacity:.75">- the middle Otter with a red hanker-chief folded into his breast pocket</span><br><span style="font-size:13px;opacity:.6">* applause ensues *</span>`,
            11000
          );
        }
      },
      checkExit(p) { return p.z < -19.8; },
    };
  },
};
