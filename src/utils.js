export function displayDialogue(text, onDisplayEnd, options = {}) {
  const dialogueUI = document.getElementById("textbox-container");
  const dialogue = document.getElementById("dialogue");
  const gameCanvas = document.getElementById("game");
  const secondaryActionBtn = document.getElementById("view-more");
  const secondaryActionLabel = options.secondaryActionLabel;
  const onSecondaryAction = options.onSecondaryAction;

  dialogueUI.style.display = "block";
  let index = 0;
  let currentText = "";
  const intervalRef = setInterval(() => {
    if (index < text.length) {
      currentText += text[index];
      dialogue.innerHTML = currentText;
      index++;
      return;
    }

    clearInterval(intervalRef);
  }, 1);

  const closeBtn = document.getElementById("close");

  function closeDialogue({ shouldNotifyEnd = true, focusGameCanvas = true } = {}) {
    dialogueUI.style.display = "none";
    dialogue.innerHTML = "";
    clearInterval(intervalRef);
    closeBtn.removeEventListener("click", onCloseBtnClick);
    secondaryActionBtn?.removeEventListener("click", onSecondaryActionBtnClick);
    removeEventListener("keypress", onEnterKeyPress);
    if (secondaryActionBtn) {
      secondaryActionBtn.style.display = "none";
    }
    if (shouldNotifyEnd) {
      onDisplayEnd?.();
    }
    closeBtn.blur();
    secondaryActionBtn?.blur();
    if (focusGameCanvas) {
      gameCanvas?.focus();
    }
  }

  function onCloseBtnClick() {
    closeDialogue();
  }

  function onSecondaryActionBtnClick() {
    closeDialogue({ shouldNotifyEnd: false, focusGameCanvas: false });
    onSecondaryAction?.();
  }

  closeBtn.addEventListener("click", onCloseBtnClick);
  if (secondaryActionBtn && secondaryActionLabel && onSecondaryAction) {
    secondaryActionBtn.textContent = secondaryActionLabel;
    secondaryActionBtn.style.display = "inline-block";
    secondaryActionBtn.addEventListener("click", onSecondaryActionBtnClick);
  } else if (secondaryActionBtn) {
    secondaryActionBtn.style.display = "none";
  }

  function onEnterKeyPress(key) {
    if (key.code === "Enter") {
      closeBtn.click();
    }
  }

  addEventListener("keypress", onEnterKeyPress);
}

export function setupGuidePanelToggle() {
  const panel = document.querySelector(".guide-panel");
  const toggleButton = document.getElementById("guide-toggle");
  const guideBody = document.getElementById("guide-body");

  if (!panel || !toggleButton || !guideBody) {
    return;
  }

  if (toggleButton.dataset.toggleBound === "true") {
    return;
  }

  function setGuideCollapsed(isCollapsed) {
    panel.classList.toggle("is-collapsed", isCollapsed);
    toggleButton.textContent = isCollapsed ? "Show" : "Hide";
    toggleButton.setAttribute("aria-expanded", String(!isCollapsed));
  }

  setGuideCollapsed(false);

  toggleButton.addEventListener("click", () => {
    const isCollapsed = panel.classList.contains("is-collapsed");
    setGuideCollapsed(!isCollapsed);
  });

  toggleButton.dataset.toggleBound = "true";
}

export function setupBackgroundMusic(options = {}) {
  const audioToggleButton = document.getElementById("audio-toggle");
  const audioSrc = options.src || "/music/loop_background.mp3";
  const storageKey = "portfolio-bg-music-muted";
  const gameCanvas = document.getElementById("game");

  if (!audioToggleButton || audioToggleButton.dataset.audioBound === "true") {
    return;
  }

  const bgAudio = new Audio(audioSrc);
  bgAudio.loop = true;
  bgAudio.volume = 0.2;
  bgAudio.preload = "auto";

  let isMuted = localStorage.getItem(storageKey) === "true";
  let hasTriedAutoplay = false;

  function updateAudioToggleUI() {
    audioToggleButton.textContent = isMuted ? "🔇" : "🔊";
    audioToggleButton.setAttribute("aria-pressed", String(!isMuted));
    audioToggleButton.title = isMuted
      ? "Music off (press M to turn on)"
      : "Music on (press M to turn off)";
  }

  async function playAudioIfAllowed() {
    if (isMuted) return;

    try {
      await bgAudio.play();
    } catch {
      // Browser blocked autoplay until first user interaction.
    }
  }

  async function setMuted(nextMuted) {
    isMuted = nextMuted;
    localStorage.setItem(storageKey, String(isMuted));

    if (isMuted) {
      bgAudio.pause();
      bgAudio.currentTime = 0;
    } else {
      await playAudioIfAllowed();
    }

    updateAudioToggleUI();
  }

  function toggleMuted() {
    setMuted(!isMuted);
    gameCanvas?.focus();
  }

  function tryAutoplayOnce() {
    if (hasTriedAutoplay || isMuted) return;
    hasTriedAutoplay = true;
    playAudioIfAllowed();
  }

  updateAudioToggleUI();
  audioToggleButton.addEventListener("click", toggleMuted);
  addEventListener("keydown", (event) => {
    if (event.code === "KeyM") {
      toggleMuted();
    }
  });

  addEventListener(
    "pointerdown",
    () => {
      tryAutoplayOnce();
    },
    { once: true }
  );

  playAudioIfAllowed();
  audioToggleButton.dataset.audioBound = "true";
}

function setupProjectImageFallbacks() {
  const projectImages = document.querySelectorAll(".project-image");

  for (const image of projectImages) {
    if (image.dataset.fallbackBound === "true") {
      continue;
    }

    const fallbackSrc = image.dataset.fallbackImage || "/project-fallback.svg";

    function applyFallback() {
      if (image.dataset.fallbackApplied === "true") {
        return;
      }

      image.dataset.fallbackApplied = "true";
      image.classList.add("is-fallback");
      image.src = fallbackSrc;
    }

    image.addEventListener("error", applyFallback);
    image.addEventListener("load", () => {
      if (image.dataset.fallbackApplied !== "true") {
        image.classList.remove("is-fallback");
      }
    });

    image.dataset.fallbackBound = "true";

    if (!image.getAttribute("src")) {
      applyFallback();
    }
  }
}

// Opens the portfolio projects modal and registers one-off close handlers.
export function openProjectsModal(onModalClose) {
  const modal = document.getElementById("projects-modal");
  const panel = modal?.querySelector(".projects-panel");
  const closeBtn = document.getElementById("projects-close");
  const gameCanvas = document.getElementById("game");

  if (!modal || !closeBtn || !panel) {
    onModalClose?.();
    return;
  }

  setupProjectImageFallbacks();
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    closeBtn.removeEventListener("click", onCloseButtonClick);
    modal.removeEventListener("click", onOverlayClick);
    removeEventListener("keydown", onEscapeKeyDown);
    gameCanvas?.focus();
    onModalClose?.();
  }

  function onCloseButtonClick() {
    closeModal();
  }

  function onOverlayClick(event) {
    if (!panel.contains(event.target)) {
      closeModal();
    }
  }

  function onEscapeKeyDown(event) {
    if (event.code === "Escape") {
      closeModal();
    }
  }

  closeBtn.addEventListener("click", onCloseButtonClick);
  modal.addEventListener("click", onOverlayClick);
  addEventListener("keydown", onEscapeKeyDown);
}

// Opens the professional experience modal and registers one-off close handlers.
export function openExperienceModal(onModalClose) {
  const modal = document.getElementById("experience-modal");
  const panel = modal?.querySelector(".experience-panel");
  const closeBtn = document.getElementById("experience-close");
  const gameCanvas = document.getElementById("game");

  if (!modal || !closeBtn || !panel) {
    onModalClose?.();
    return;
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    closeBtn.removeEventListener("click", onCloseButtonClick);
    modal.removeEventListener("click", onOverlayClick);
    removeEventListener("keydown", onEscapeKeyDown);
    gameCanvas?.focus();
    onModalClose?.();
  }

  function onCloseButtonClick() {
    closeModal();
  }

  function onOverlayClick(event) {
    if (!panel.contains(event.target)) {
      closeModal();
    }
  }

  function onEscapeKeyDown(event) {
    if (event.code === "Escape") {
      closeModal();
    }
  }

  closeBtn.addEventListener("click", onCloseButtonClick);
  modal.addEventListener("click", onOverlayClick);
  addEventListener("keydown", onEscapeKeyDown);
}

export function setCamScale(k) {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.camScale(k.vec2(1));
  } else {
    k.camScale(k.vec2(1.5));
  }
}
