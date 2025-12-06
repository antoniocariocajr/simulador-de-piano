// ===== DOM ELEMENTS =====
const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheck = document.querySelector(".keys-check input");

// ===== STATE =====
let mappedKeys = [];
let audioCache = {};
let currentVolume = 0.5;

// ===== AUDIO PRELOADING =====
// Preload all audio files for better performance
const preloadAudio = () => {
  pianoKeys.forEach((key) => {
    const keyName = key.dataset.key;
    const audio = new Audio(`src/tunes/${keyName}.wav`);
    audio.volume = currentVolume;
    audioCache[keyName] = audio;
  });
};

// ===== PLAY TUNE FUNCTION =====
const playTune = (key) => {
  const audio = audioCache[key];

  if (!audio) {
    console.error(`Áudio não encontrado para a tecla: ${key}`);
    return;
  }

  // Reset audio to start if already playing
  audio.currentTime = 0;
  audio.volume = currentVolume;

  audio.play().catch(error => {
    console.error('Erro ao tocar áudio:', error);
  });

  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  if (clickedKey) {
    clickedKey.classList.add("active");
    setTimeout(() => {
      clickedKey.classList.remove("active");
    }, 150);
  }
};

// ===== EVENT LISTENERS FOR PIANO KEYS =====
pianoKeys.forEach((key) => {
  // Click event
  key.addEventListener("click", () => playTune(key.dataset.key));

  // Keyboard navigation support (Enter/Space on focused key)
  key.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playTune(key.dataset.key);
    }
  });

  mappedKeys.push(key.dataset.key);
});

// ===== KEYBOARD EVENT LISTENER =====
document.addEventListener("keydown", (e) => {
  // Prevent default for piano keys to avoid scrolling with space
  if (mappedKeys.includes(e.key)) {
    e.preventDefault();
    playTune(e.key);
  }
});

// ===== VOLUME CONTROL =====
const handleVolume = (e) => {
  currentVolume = parseFloat(e.target.value);

  // Update all cached audio volumes
  Object.values(audioCache).forEach(audio => {
    audio.volume = currentVolume;
  });

  // Update ARIA attribute
  volumeSlider.setAttribute('aria-valuenow', currentVolume.toFixed(2));
};

volumeSlider.addEventListener("input", handleVolume);

// ===== SHOW/HIDE KEYS TOGGLE =====
const showHideKeys = () => {
  pianoKeys.forEach((key) => key.classList.toggle("hide"));

  // Update ARIA attribute
  const isChecked = keysCheck.checked;
  keysCheck.setAttribute('aria-checked', isChecked);
};

keysCheck.addEventListener("click", showHideKeys);

// ===== INITIALIZATION =====
// Preload all audio files when page loads
window.addEventListener('DOMContentLoaded', () => {
  preloadAudio();
  console.log('🎹 Piano Virtual carregado com sucesso!');
});