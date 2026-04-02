# AGENTS

## Mission
Ship safe, minimal, testable updates to this Kaboom portfolio without breaking map interaction flow.

## Project Facts
- Entry: `src/main.js`
- Dialogue source: `src/constants.js`
- UI behavior: `src/utils.js` + `index.html`
- Active map assets: `public/port-map.json`, `public/port-map.png`
- Build command: `npm run build`

## Collaboration Protocol
1. Check repo state first: `git status --short`.
2. Do not revert unrelated local changes.
3. Keep edits focused to requested scope.
4. Prefer small patches and explicit file ownership when multiple agents work in parallel.
5. Run `npm run build` before final handoff when code/assets changed.

## File Ownership Guidance
- Gameplay/input/camera: `src/main.js`
- Dialogue content: `src/constants.js`
- Dialogue rendering/camera scale utility: `src/utils.js`
- Page-level UI/CSS shell: `index.html`
- Map collision/spawn/layout: `public/port-map.json` (+ matching `public/port-map.png`)

## Safety Rules For Changes
- Never edit `node_modules/` or generated `dist/` as source-of-truth.
- When adding named interaction objects in map JSON, add matching dialogue keys.
- Preserve relative asset paths used by Vite build/runtime.
- If replacing map files, keep layer contracts compatible:
  - recommended `Collisions`
  - recommended `Interact`
  - optional legacy `spawnpoints` (object `player`) or ensure fallback point exists

## Handoff Format
When finishing work, include:
1. What changed (files + behavior impact).
2. Build/test status (`npm run build` result).
3. Any follow-up risks or TODOs.
