# Project Rules

## Scope Rules
1. Keep this repo as a lightweight, static, client-only portfolio game.
2. Prefer targeted edits over broad refactors unless explicitly requested.
3. Preserve existing player experience (movement, collisions, dialogue popups) by default.

## Code Rules
1. Use ES modules and existing code style in `src/`.
2. Keep Kaboom initialized in `src/kaboomCtx.js` with `global: false`.
3. Keep imports relative and compatible with Vite.
4. Avoid adding heavy dependencies unless necessary.

## Gameplay/Data Rules
1. Any named interaction object must map to a key in `dialogueData`.
2. Maintain `scaleFactor` consistency between map world and player scaling unless intentionally rebalanced.
3. If `spawnpoints.player` is absent, keep at least one point-like object or ensure center-spawn remains valid.
4. If using HTML in dialogue strings, keep it minimal and trusted.

## Asset Rules
1. Store runtime assets in `public/`.
2. Keep map data and image pairs synchronized (`port-map.json` <-> `port-map.png`).
3. Do not commit temporary exports or unused large assets without purpose notes.

## Quality Rules
1. Run `npm run build` after meaningful changes.
2. Smoke-check interactions in `npm run dev` for:
   - keyboard movement
   - mouse movement
   - collision-triggered dialogue
   - camera follow behavior
3. Document known caveats when they are not fixed in the same change.

## Git Rules
1. Never discard user changes without explicit request.
2. Avoid destructive git commands.
3. Commit messages (if asked) should describe behavior change, not just file edits.
