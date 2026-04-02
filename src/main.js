import { dialogueData, scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import {
  displayDialogue,
  openExperienceModal,
  openProjectsModal,
  setupBackgroundMusic,
  setCamScale,
  setupGuidePanelToggle,
} from "./utils";

const MAP_TEXTURE_PATH = "./port-map.png";
const MAP_DATA_PATH = "./port-map.json";
const MAP_SCALE_FACTOR = scaleFactor / 1.5;
const PLAYER_SCALE_FACTOR = ((scaleFactor * 1.5) / 4) * 2;
const BASE_SCALE_FACTOR = 4;
const CAMERA_VERTICAL_OFFSET = -25 * MAP_SCALE_FACTOR;
const PLAYER_SPRITE_PATH = "./walk.png";
const PLAYER_RUN_SPRITE_PATH = "./run.png";
const PLAYER_JUMP_SPRITE_PATH = "./jump.png";
const PLAYER_SPRITE_SLICE_X = 9;
const PLAYER_RUN_SPRITE_SLICE_X = 8;
const PLAYER_JUMP_SPRITE_SLICE_X = 5;
const PLAYER_SPRITE_SLICE_Y = 4;
const PLAYER_FRAMES_PER_DIRECTION = 9;
const PLAYER_RUN_FRAMES_PER_DIRECTION = 8;
const PLAYER_JUMP_FRAMES_PER_DIRECTION = 5;
const PLAYER_DOWN_ROW = 2;
const PLAYER_LEFT_ROW = 1;
const PLAYER_RIGHT_ROW = 3;
const PLAYER_UP_ROW = 0;
const PLAYER_RUN_SPEED_MULTIPLIER = 1.6;
const PLAYER_JUMP_ANIM_SPEED = 14;
const PLAYER_JUMP_DURATION =
  PLAYER_JUMP_FRAMES_PER_DIRECTION / PLAYER_JUMP_ANIM_SPEED;
const PLAYER_JUMP_HEIGHT = 14 * MAP_SCALE_FACTOR;
const CHECKPOINT_ORDER = ["welcome", "about", "skills", "projects", "experience"];

setupGuidePanelToggle();
setupBackgroundMusic({
  src: "/music/loop_background.mp3",
});

function getWalkFrame(row, col = 0) {
  return row * PLAYER_FRAMES_PER_DIRECTION + col;
}

function getRunFrame(row, col = 0) {
  return row * PLAYER_RUN_FRAMES_PER_DIRECTION + col;
}

function getJumpFrame(row, col = 0) {
  return row * PLAYER_JUMP_FRAMES_PER_DIRECTION + col;
}

k.loadSprite("player-character", PLAYER_SPRITE_PATH, {
  sliceX: PLAYER_SPRITE_SLICE_X,
  sliceY: PLAYER_SPRITE_SLICE_Y,
  anims: {
    "idle-down": getWalkFrame(PLAYER_DOWN_ROW),
    "walk-down": {
      from: getWalkFrame(PLAYER_DOWN_ROW),
      to: getWalkFrame(PLAYER_DOWN_ROW, PLAYER_FRAMES_PER_DIRECTION - 1),
      loop: true,
      speed: 10,
    },
    "idle-left": getWalkFrame(PLAYER_LEFT_ROW),
    "walk-left": {
      from: getWalkFrame(PLAYER_LEFT_ROW),
      to: getWalkFrame(PLAYER_LEFT_ROW, PLAYER_FRAMES_PER_DIRECTION - 1),
      loop: true,
      speed: 10,
    },
    "idle-right": getWalkFrame(PLAYER_RIGHT_ROW),
    "walk-right": {
      from: getWalkFrame(PLAYER_RIGHT_ROW),
      to: getWalkFrame(PLAYER_RIGHT_ROW, PLAYER_FRAMES_PER_DIRECTION - 1),
      loop: true,
      speed: 10,
    },
    "idle-up": getWalkFrame(PLAYER_UP_ROW),
    "walk-up": {
      from: getWalkFrame(PLAYER_UP_ROW),
      to: getWalkFrame(PLAYER_UP_ROW, PLAYER_FRAMES_PER_DIRECTION - 1),
      loop: true,
      speed: 10,
    },
  },
});
k.loadSprite("player-run", PLAYER_RUN_SPRITE_PATH, {
  sliceX: PLAYER_RUN_SPRITE_SLICE_X,
  sliceY: PLAYER_SPRITE_SLICE_Y,
  anims: {
    "idle-down": getRunFrame(PLAYER_DOWN_ROW),
    "run-down": {
      from: getRunFrame(PLAYER_DOWN_ROW),
      to: getRunFrame(PLAYER_DOWN_ROW, PLAYER_RUN_FRAMES_PER_DIRECTION - 1),
      loop: true,
      speed: 12,
    },
    "idle-left": getRunFrame(PLAYER_LEFT_ROW),
    "run-left": {
      from: getRunFrame(PLAYER_LEFT_ROW),
      to: getRunFrame(PLAYER_LEFT_ROW, PLAYER_RUN_FRAMES_PER_DIRECTION - 1),
      loop: true,
      speed: 12,
    },
    "idle-right": getRunFrame(PLAYER_RIGHT_ROW),
    "run-right": {
      from: getRunFrame(PLAYER_RIGHT_ROW),
      to: getRunFrame(PLAYER_RIGHT_ROW, PLAYER_RUN_FRAMES_PER_DIRECTION - 1),
      loop: true,
      speed: 12,
    },
    "idle-up": getRunFrame(PLAYER_UP_ROW),
    "run-up": {
      from: getRunFrame(PLAYER_UP_ROW),
      to: getRunFrame(PLAYER_UP_ROW, PLAYER_RUN_FRAMES_PER_DIRECTION - 1),
      loop: true,
      speed: 12,
    },
  },
});
k.loadSprite("player-jump", PLAYER_JUMP_SPRITE_PATH, {
  sliceX: PLAYER_JUMP_SPRITE_SLICE_X,
  sliceY: PLAYER_SPRITE_SLICE_Y,
  anims: {
    "jump-down": {
      from: getJumpFrame(PLAYER_DOWN_ROW),
      to: getJumpFrame(PLAYER_DOWN_ROW, PLAYER_JUMP_FRAMES_PER_DIRECTION - 1),
      speed: PLAYER_JUMP_ANIM_SPEED,
    },
    "jump-left": {
      from: getJumpFrame(PLAYER_LEFT_ROW),
      to: getJumpFrame(PLAYER_LEFT_ROW, PLAYER_JUMP_FRAMES_PER_DIRECTION - 1),
      speed: PLAYER_JUMP_ANIM_SPEED,
    },
    "jump-right": {
      from: getJumpFrame(PLAYER_RIGHT_ROW),
      to: getJumpFrame(PLAYER_RIGHT_ROW, PLAYER_JUMP_FRAMES_PER_DIRECTION - 1),
      speed: PLAYER_JUMP_ANIM_SPEED,
    },
    "jump-up": {
      from: getJumpFrame(PLAYER_UP_ROW),
      to: getJumpFrame(PLAYER_UP_ROW, PLAYER_JUMP_FRAMES_PER_DIRECTION - 1),
      speed: PLAYER_JUMP_ANIM_SPEED,
    },
  },
});

k.loadSprite("map", MAP_TEXTURE_PATH);

k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", async () => {
  const mapData = await (await fetch(MAP_DATA_PATH)).json();
  const layers = mapData.layers;

  const map = k.add([k.sprite("map"), k.pos(0), k.scale(MAP_SCALE_FACTOR)]);

  const player = k.make([
    k.sprite("player-character", { anim: "idle-down" }),
    k.area({
      shape: new k.Rect(k.vec2(0, 6), 20, 20),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(),
    k.scale(PLAYER_SCALE_FACTOR),
    {
      speed: 250 * (MAP_SCALE_FACTOR / BASE_SCALE_FACTOR),
      direction: "down",
      isInDialogue: false,
      isJumpAnimating: false,
      jumpOffsetY: 0,
      spriteName: "player-character",
    },
    "player",
  ]);

  function getIsRunning() {
    return k.isKeyDown("shift");
  }

  function getMoveSpeed(isRunning) {
    return isRunning ? player.speed * PLAYER_RUN_SPEED_MULTIPLIER : player.speed;
  }

  function setMovementAnimation(direction, isRunning) {
    player.direction = direction;
    if (player.isJumpAnimating) {
      return;
    }

    const targetSprite = isRunning ? "player-run" : "player-character";
    const targetAnimPrefix = isRunning ? "run" : "walk";
    const targetAnim = `${targetAnimPrefix}-${direction}`;

    if (player.spriteName !== targetSprite) {
      player.use(k.sprite(targetSprite));
      player.spriteName = targetSprite;
    }
    if (player.curAnim() !== targetAnim) {
      player.play(targetAnim);
    }
  }

  function openDialogue(text, options = undefined) {
    if (player.isInDialogue || !text) return;
    player.isInDialogue = true;
    displayDialogue(
      text,
      () => (player.isInDialogue = false),
      options
    );
  }

  const activeCheckpointCollisions = new Set();

  // Opens either standard dialogue or the dedicated HTML modal for projects.
  function openCheckpointContent(checkpointKey) {
    if (checkpointKey === "projects") {
      openDialogue(
        `${dialogueData[checkpointKey]}\n\nClick "View More" to open the projects panel.`,
        {
          secondaryActionLabel: "View More",
          onSecondaryAction: () => {
            openProjectsModal(() => {
              player.isInDialogue = false;
            });
          },
        }
      );
      return;
    }

    if (checkpointKey === "experience") {
      openDialogue(`${dialogueData[checkpointKey]}\n\nClick "View More" for full details.`, {
        secondaryActionLabel: "View More",
        onSecondaryAction: () => {
          openExperienceModal(() => {
            player.isInDialogue = false;
          });
        },
      });
      return;
    }

    openDialogue(dialogueData[checkpointKey]);
  }

  // Resolves checkpoint names from map object names or fallback room order.
  function resolveCheckpointKey(interactZone, index) {
    const mapName = interactZone.name?.trim().toLowerCase();
    if (mapName && dialogueData[mapName]) {
      return mapName;
    }
    return CHECKPOINT_ORDER[index] ?? CHECKPOINT_ORDER[0];
  }

  // Adds a red place-marker icon above each checkpoint to make interactions obvious.
  function addCheckpointBling(interactZone, index) {
    const centerX = interactZone.x + interactZone.width / 2;
    const centerY = interactZone.y + interactZone.height / 2;
    const phase = index * 0.75;

    const markerHead = map.add([
      k.circle(6.5),
      k.pos(centerX, centerY - 18),
      k.anchor("center"),
      k.color(235, 64, 52),
      k.opacity(0.95),
      k.z(8),
    ]);

    const markerInner = map.add([
      k.circle(2.3),
      k.pos(centerX, centerY - 18),
      k.anchor("center"),
      k.color(255, 255, 255),
      k.opacity(0.95),
      k.z(9),
    ]);

    const markerTip = map.add([
      k.polygon([k.vec2(0, 0), k.vec2(4.2, -8), k.vec2(-4.2, -8)]),
      k.pos(centerX, centerY - 8.6),
      k.anchor("center"),
      k.color(235, 64, 52),
      k.opacity(0.95),
      k.z(7),
    ]);

    const halo = map.add([
      k.circle(10),
      k.pos(centerX, centerY - 18),
      k.anchor("center"),
      k.color(255, 110, 90),
      k.opacity(0.22),
      k.z(6),
    ]);

    k.onUpdate(() => {
      const pulse = (Math.sin((k.time() + phase) * (Math.PI / 0.8)) + 1) / 2;
      const bobY = pulse * 2.2;

      markerHead.pos = k.vec2(centerX, centerY - 18 - bobY);
      markerInner.pos = markerHead.pos;
      markerTip.pos = k.vec2(centerX, centerY - 8.6 - bobY);

      halo.pos = markerHead.pos;
      halo.scale = k.vec2(0.88 + pulse * 0.26);
      halo.opacity = 0.12 + pulse * 0.2;
    });
  }

  function registerCheckpointCollision(tag, checkpointKey) {
    player.onCollide(tag, () => {
      if (activeCheckpointCollisions.has(tag)) return;
      activeCheckpointCollisions.add(tag);
      openCheckpointContent(checkpointKey);
    });

    player.onCollideEnd(tag, () => {
      activeCheckpointCollisions.delete(tag);
    });
  }

  const objectLayers = layers.filter((layer) => Array.isArray(layer.objects));
  let playerSpawn = null;

  const legacySpawnLayer = objectLayers.find(
    (layer) => layer.name === "spawnpoints"
  );
  if (legacySpawnLayer) {
    const playerEntity = legacySpawnLayer.objects.find(
      (entity) => entity.name === "player"
    );
    if (playerEntity) {
      playerSpawn = k.vec2(playerEntity.x, playerEntity.y);
    }
  }

  if (!playerSpawn) {
    for (const layer of objectLayers) {
      const pointLikeObject = layer.objects.find(
        (obj) => obj.point || (obj.width === 0 && obj.height === 0)
      );
      if (pointLikeObject) {
        playerSpawn = k.vec2(pointLikeObject.x, pointLikeObject.y);
        break;
      }
    }
  }

  if (!playerSpawn) {
    playerSpawn = k.vec2(
      (mapData.width * mapData.tilewidth) / 2,
      (mapData.height * mapData.tileheight) / 2
    );
  }

  let interactCheckpointIndex = 0;

  for (const layer of layers) {
    if (layer.name === "boundaries" || layer.name === "Collisions") {
      for (const boundary of layer.objects) {
        if (!boundary.width || !boundary.height) continue;

        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          ...(boundary.name ? [boundary.name] : []),
        ]);

      }

      continue;
    }

    if (layer.name === "Interact") {
      for (const interactZone of layer.objects) {
        if (!interactZone.width || !interactZone.height) continue;

        const checkpointKey = resolveCheckpointKey(
          interactZone,
          interactCheckpointIndex
        );
        const interactionTag = `checkpoint-${checkpointKey}-${interactCheckpointIndex}`;

        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), interactZone.width, interactZone.height),
          }),
          k.pos(interactZone.x, interactZone.y),
          interactionTag,
        ]);

        registerCheckpointCollision(interactionTag, checkpointKey);
        addCheckpointBling(interactZone, interactCheckpointIndex);

        interactCheckpointIndex++;
      }
    }
  }

  player.pos = k.vec2(
    (map.pos.x + playerSpawn.x) * MAP_SCALE_FACTOR,
    (map.pos.y + playerSpawn.y) * MAP_SCALE_FACTOR
  );
  k.add(player);

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.camPos(
      player.worldPos().x,
      player.worldPos().y - player.jumpOffsetY + CAMERA_VERTICAL_OFFSET
    );
  });

  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;

    const worldMousePos = k.toWorld(k.mousePos());
    const isRunning = getIsRunning();
    player.moveTo(worldMousePos, getMoveSpeed(isRunning));

    const mouseAngle = player.pos.angle(worldMousePos);

    const lowerBound = 50;
    const upperBound = 125;

    if (
      mouseAngle > lowerBound &&
      mouseAngle < upperBound &&
      player.curAnim() !== "walk-up"
    ) {
      setMovementAnimation("up", isRunning);
      return;
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.curAnim() !== "walk-down"
    ) {
      setMovementAnimation("down", isRunning);
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      setMovementAnimation("right", isRunning);
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      setMovementAnimation("left", isRunning);
      return;
    }
  });

  function stopAnims() {
    if (player.isJumpAnimating) return;

    if (player.spriteName !== "player-character") {
      player.use(k.sprite("player-character"));
      player.spriteName = "player-character";
    }

    if (player.direction === "down") {
      player.play("idle-down");
      return;
    }
    if (player.direction === "up") {
      player.play("idle-up");
      return;
    }
    if (player.direction === "left") {
      player.play("idle-left");
      return;
    }

    player.play("idle-right");
  }

  function resumeMovementAfterJump() {
    const isRunning = getIsRunning();

    if (isMoveRightPressed()) {
      setMovementAnimation("right", isRunning);
      return;
    }

    if (isMoveLeftPressed()) {
      setMovementAnimation("left", isRunning);
      return;
    }

    if (isMoveUpPressed()) {
      setMovementAnimation("up", isRunning);
      return;
    }

    if (isMoveDownPressed()) {
      setMovementAnimation("down", isRunning);
      return;
    }

    stopAnims();
  }

  k.onMouseRelease(stopAnims);

  function isMoveRightPressed() {
    return k.isKeyDown("right") || k.isKeyDown("d");
  }

  function isMoveLeftPressed() {
    return k.isKeyDown("left") || k.isKeyDown("a");
  }

  function isMoveUpPressed() {
    return k.isKeyDown("up") || k.isKeyDown("w");
  }

  function isMoveDownPressed() {
    return k.isKeyDown("down") || k.isKeyDown("s");
  }

  k.onKeyPress("space", () => {
    if (player.isInDialogue || player.isJumpAnimating) return;

    player.isJumpAnimating = true;

    if (player.spriteName !== "player-jump") {
      player.use(k.sprite("player-jump"));
      player.spriteName = "player-jump";
    }

    player.play(`jump-${player.direction}`);
    let elapsedJumpTime = 0;

    const jumpArcUpdateEvent = k.onUpdate(() => {
      elapsedJumpTime += k.dt();
      const progress = Math.min(elapsedJumpTime / PLAYER_JUMP_DURATION, 1);
      const nextJumpOffsetY = -Math.sin(progress * Math.PI) * PLAYER_JUMP_HEIGHT;
      const offsetDelta = nextJumpOffsetY - player.jumpOffsetY;

      player.jumpOffsetY = nextJumpOffsetY;
      player.pos.y += offsetDelta;

      if (progress >= 1) {
        if (player.jumpOffsetY !== 0) {
          player.pos.y -= player.jumpOffsetY;
          player.jumpOffsetY = 0;
        }
        jumpArcUpdateEvent.cancel();
      }
    });

    k.wait(PLAYER_JUMP_DURATION, () => {
      player.isJumpAnimating = false;
      resumeMovementAfterJump();
    });
  });

  k.onKeyRelease(() => {
    const isDirectionKeyDown =
      isMoveRightPressed() ||
      isMoveLeftPressed() ||
      isMoveUpPressed() ||
      isMoveDownPressed();

    if (!isDirectionKeyDown) {
      stopAnims();
    }
  });
  k.onKeyDown(() => {
    const keyMap = [
      isMoveRightPressed(),
      isMoveLeftPressed(),
      isMoveUpPressed(),
      isMoveDownPressed(),
    ];

    let nbOfKeyPressed = 0;
    for (const isPressed of keyMap) {
      if (isPressed) {
        nbOfKeyPressed++;
      }
    }

    if (nbOfKeyPressed > 1) return;

    if (player.isInDialogue) return;
    const isRunning = getIsRunning();
    const moveSpeed = getMoveSpeed(isRunning);

    if (keyMap[0]) {
      setMovementAnimation("right", isRunning);
      player.move(moveSpeed, 0);
      return;
    }

    if (keyMap[1]) {
      setMovementAnimation("left", isRunning);
      player.move(-moveSpeed, 0);
      return;
    }

    if (keyMap[2]) {
      setMovementAnimation("up", isRunning);
      player.move(0, -moveSpeed);
      return;
    }

    if (keyMap[3]) {
      setMovementAnimation("down", isRunning);
      player.move(0, moveSpeed);
    }
  });
});

k.go("main");
