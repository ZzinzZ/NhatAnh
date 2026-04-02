# 2D Game Portfolio Skill Guide

## Purpose
This repository is a small interactive portfolio built as a 2D room using Kaboom.js and Vite.  
The player explores the room, collides with named map boundaries, and opens dialogue text rendered in HTML.

## Stack
- Runtime: browser
- Bundler: Vite (`npm run dev`, `npm run build`, `npm run preview`)
- Game engine: Kaboom (`src/kaboomCtx.js`)
- Core files:
  - `src/main.js`: scene setup, map loading, player controls, collisions, camera
  - `src/constants.js`: dialogue content + scale factor
  - `src/utils.js`: dialogue rendering + camera scale
  - `public/port-map.json` + `public/port-map.png`: active map and collision/interact metadata
  - `index.html`: UI textbox + canvas container + base styles

## How The Game Works
1. `src/main.js` loads `spritesheet.png` and `port-map.png`.
2. Scene `"main"` fetches `public/port-map.json`.
3. Objects in `Collisions` (or legacy `boundaries`) become static colliders.
4. Objects in `Interact` (or named legacy boundaries) trigger dialogue.
5. Spawn is resolved from legacy `spawnpoints`, then point-like objects, then map center fallback.
6. Camera follows player and rescales on window resize.

## Common Change Playbooks

### Edit dialogue text
Update `dialogueData` in `src/constants.js`.  
If using links, HTML is allowed because text is injected with `innerHTML`.

### Add a new interactable object
1. Add object in Tiled map `boundaries` layer.
2. Set object `name` (for example `"awards"`).
3. Add matching key in `dialogueData.awards`.
4. Export map JSON to `public/map.json`.

### Move player spawn
Edit `spawnpoints` object named `"player"` in map JSON/Tiled.

### Replace map
Keep code expectations aligned:
- texture file path `./port-map.png`
- data file path `./port-map.json`
- recommended layers: `Collisions` and `Interact`
- optional: `spawnpoints` layer with object `player` (fallbacks exist)

## Validation Checklist
Run after changes:
1. `npm run build`
2. `npm run dev` and verify:
   - keyboard + mouse movement works
   - dialogue opens/closes correctly
   - camera follows player
   - no missing asset paths

## Current Notes
- `public/port-map.json` and `public/port-map.png` are now active runtime assets.
- `resume/sampleResume.pdf` is present but currently zero bytes.
- Build currently reports `monogram.ttf` as unresolved at build time; it remains runtime-resolved.
