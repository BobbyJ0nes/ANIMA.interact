// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// player.js — first-person walk. flat dream ground, soft clamp at the world's edge.

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export function createPlayer(camera, dom) {
  const controls = new PointerLockControls(camera, dom);
  const keys = {};
  addEventListener('keydown', (e) => (keys[e.code] = true));
  addEventListener('keyup', (e) => (keys[e.code] = false));
  dom.addEventListener('click', () => {
    if (player.enabled) controls.lock();
  });

  const v = new THREE.Vector3();

  const player = {
    controls,
    enabled: true,
    eye: 1.65,
    get pos() { return camera.position; },
    place(pos, yaw = 0, eye = 1.65) {
      player.eye = eye;
      camera.position.set(pos.x, eye, pos.z);
      camera.rotation.set(0, yaw, 0);
    },
    moved() {
      return keys.KeyW || keys.KeyA || keys.KeyS || keys.KeyD;
    },
    update(dt) {
      if (!player.enabled || !controls.isLocked) return;
      v.set((keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0), 0, (keys.KeyS ? 1 : 0) - (keys.KeyW ? 1 : 0));
      if (v.lengthSq() > 0) {
        v.normalize().multiplyScalar(3.2 * dt);
        controls.moveRight(v.x);
        controls.moveForward(-v.z);
      }
      const p = camera.position;
      const r = Math.hypot(p.x, p.z);
      if (r > 48) { p.x *= 48 / r; p.z *= 48 / r; }
      p.y = player.eye;
    },
  };
  return player;
}
