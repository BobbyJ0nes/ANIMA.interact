/* ai-use: written by Claude (Fable 5) under direction, 19.08.26 — build fix only.
   Without this file Vite builds only index.html (the abandoned three.js circuit v0)
   and THE NIGHT never reaches dist/. Multi-page inputs so the piece and the studies
   all ship; the deploy should point visitors at term.html (the piece). */
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        term: resolve(__dirname, 'term.html'),    // THE NIGHT — the piece
        board: resolve(__dirname, 'board.html'),  // reference board
        field: resolve(__dirname, 'field.html'),  // study
        scene: resolve(__dirname, 'scene.html'),  // study
        circuit: resolve(__dirname, 'circuit.html'), // v0 circuit (superseded; kept as record)
        index: resolve(__dirname, 'index.html'),  // landing — routes to term.html
      },
    },
  },
})
