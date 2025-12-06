// ===== DOM ELEMENTS =====
const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheck = document.querySelector(".keys-check input");

// Recording controls
const recordBtn = document.getElementById("record-btn");
const stopBtn = document.getElementById("stop-btn");
const playBtn = document.getElementById("play-btn");
const recordingStatus = document.getElementById("recording-status");

// Instrument selector
const instrumentSelect = document.getElementById("instrument-select");

// Metronome controls
const metronomeToggle = document.getElementById("metronome-toggle");
const bpmInput = document.getElementById("bpm-input");
const metronomeIndicator = document.getElementById("metronome-indicator");

// Audio visualizer
const visualizerCanvas = document.getElementById("audio-visualizer");
const visualizerCtx = visualizerCanvas ? visualizerCanvas.getContext("2d") : null;

// ===== STATE =====
let mappedKeys = [];
let audioCache = {};
let currentVolume = 0.5;
let currentInstrument = "piano";

// Recording state
const recording = {
  isRecording: false,
  isPaused: false,
  startTime: null,
  notes: [],
  isPlaying: false
};

// Metronome state
let metronomeInterval = null;
let metronomeBPM = 120;

// Visualizer state
let visualizerActive = false;
let visualizerBars = [];

// ===== AUDIO PRELOADING =====
const preloadAudio = () => {
  pianoKeys.forEach((key) => {
    const keyName = key.dataset.key;
    const audio = new Audio(`src/tunes/${keyName}.wav`);
    audio.volume = currentVolume;
    audioCache[keyName] = audio;
  });

  // Preload metronome click sound (using existing audio)
  audioCache['metronome'] = new Audio(`src/tunes/a.wav`);
  audioCache['metronome'].volume = 0.3;
};

// ===== PITCH SHIFTING FOR EXTENDED KEYS =====
const getPitchShiftedKey = (note) => {
  // Map extended notes to existing audio files with pitch adjustment
  const baseNotes = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';'];

  if (baseNotes.includes(note)) {
    return { key: note, pitchShift: 0 };
  }

  // For extended keys, use base notes with pitch shift
  const extendedMapping = {
    'z': { key: 'a', pitchShift: -12 },
    'x': { key: 'w', pitchShift: -12 },
    'c': { key: 's', pitchShift: -12 },
    'v': { key: 'e', pitchShift: -12 },
    'b': { key: 'd', pitchShift: -12 },
    'n': { key: 'f', pitchShift: -12 },
    'm': { key: 't', pitchShift: -12 },
    ',': { key: 'g', pitchShift: -12 }
  };

  return extendedMapping[note] || { key: note, pitchShift: 0 };
};

// ===== AUDIO VISUALIZER =====
const triggerVisualizer = () => {
  if (!visualizerCtx) return;

  // Add random bars for visual effect
  const numBars = 32;
  visualizerBars = [];
  for (let i = 0; i < numBars; i++) {
    visualizerBars.push(Math.random() * 0.8 + 0.2);
  }

  visualizerActive = true;

  // Fade out after 500ms
  setTimeout(() => {
    visualizerActive = false;
  }, 500);
};

const drawVisualizer = () => {
  if (!visualizerCtx) return;

  requestAnimationFrame(drawVisualizer);

  // Clear canvas
  visualizerCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  visualizerCtx.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

  if (!visualizerActive) return;

  const barWidth = (visualizerCanvas.width / visualizerBars.length) * 0.8;
  const gap = (visualizerCanvas.width / visualizerBars.length) * 0.2;

  visualizerBars.forEach((height, i) => {
    const barHeight = height * visualizerCanvas.height * 0.8;
    const x = i * (barWidth + gap);
    const y = visualizerCanvas.height - barHeight;

    // Create gradient
    const gradient = visualizerCtx.createLinearGradient(0, y, 0, visualizerCanvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');

    visualizerCtx.fillStyle = gradient;
    visualizerCtx.fillRect(x, y, barWidth, barHeight);

    // Decay the bar
    visualizerBars[i] *= 0.95;
  });
};

// ===== PLAY TUNE FUNCTION =====
const playTune = (key) => {
  const { key: baseKey, pitchShift } = getPitchShiftedKey(key);
  const audio = audioCache[baseKey];

  if (!audio) {
    console.error(`Áudio não encontrado para a tecla: ${key}`);
    return;
  }

  // Clone audio for simultaneous playback
  const audioClone = audio.cloneNode();
  audioClone.volume = currentVolume;

  // Apply pitch shift if needed
  if (pitchShift !== 0) {
    audioClone.preservesPitch = false;
    audioClone.playbackRate = Math.pow(2, pitchShift / 12);
  }

  // Apply instrument effects via playback rate and volume
  switch (currentInstrument) {
    case 'organ':
      audioClone.volume = currentVolume * 1.2;
      break;
    case 'synth':
      audioClone.volume = currentVolume * 0.9;
      audioClone.playbackRate *= 1.1;
      break;
  }

  audioClone.play().catch(error => {
    console.error('Erro ao tocar áudio:', error);
  });

  // Trigger visualizer
  triggerVisualizer();

  // Visual feedback
  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  if (clickedKey) {
    clickedKey.classList.add("active");
    setTimeout(() => {
      clickedKey.classList.remove("active");
    }, 150);
  }

  // Record if recording
  if (recording.isRecording) {
    const timestamp = Date.now() - recording.startTime;
    recording.notes.push({ key, timestamp });
  }
};

// ===== RECORDING SYSTEM =====
const startRecording = () => {
  recording.isRecording = true;
  recording.startTime = Date.now();
  recording.notes = [];

  recordBtn.classList.add("recording");
  recordBtn.disabled = true;
  stopBtn.disabled = false;
  playBtn.disabled = true;

  recordingStatus.textContent = "● Gravando...";
  recordingStatus.style.color = "#ef4444";
};

const stopRecording = () => {
  recording.isRecording = false;

  recordBtn.classList.remove("recording");
  recordBtn.disabled = false;
  stopBtn.disabled = true;
  playBtn.disabled = recording.notes.length === 0;

  const duration = ((Date.now() - recording.startTime) / 1000).toFixed(1);
  recordingStatus.textContent = `Gravado: ${recording.notes.length} notas (${duration}s)`;
  recordingStatus.style.color = "#10b981";
};

const playRecording = async () => {
  if (recording.notes.length === 0 || recording.isPlaying) return;

  recording.isPlaying = true;
  recordBtn.disabled = true;
  stopBtn.disabled = true;
  playBtn.disabled = true;

  recordingStatus.textContent = "▶ Reproduzindo...";
  recordingStatus.style.color = "#667eea";

  // Play first note immediately
  if (recording.notes.length > 0) {
    playTune(recording.notes[0].key);
  }

  // Play remaining notes with delays
  for (let i = 1; i < recording.notes.length; i++) {
    const delay = recording.notes[i].timestamp - recording.notes[i - 1].timestamp;
    await new Promise(resolve => setTimeout(resolve, delay));
    if (!recording.isPlaying) break;
    playTune(recording.notes[i].key);
  }

  recording.isPlaying = false;
  recordBtn.disabled = false;
  stopBtn.disabled = true;
  playBtn.disabled = false;

  const duration = ((recording.notes[recording.notes.length - 1]?.timestamp || 0) / 1000).toFixed(1);
  recordingStatus.textContent = `Gravado: ${recording.notes.length} notas (${duration}s)`;
  recordingStatus.style.color = "#10b981";
};

// ===== METRONOME =====
const startMetronome = () => {
  if (metronomeInterval) return;

  const interval = (60 / metronomeBPM) * 1000;

  metronomeInterval = setInterval(() => {
    // Play click sound
    const click = audioCache['metronome'].cloneNode();
    click.volume = 0.3;
    click.playbackRate = 2.0;
    click.play().catch(() => { });

    // Visual indicator
    metronomeIndicator.classList.add('beat');
    setTimeout(() => {
      metronomeIndicator.classList.remove('beat');
    }, 100);
  }, interval);
};

const stopMetronome = () => {
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
    metronomeIndicator.classList.remove('beat');
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
  if (mappedKeys.includes(e.key)) {
    e.preventDefault();
    playTune(e.key);
  }
});

// ===== VOLUME CONTROL =====
const handleVolume = (e) => {
  currentVolume = parseFloat(e.target.value);

  Object.values(audioCache).forEach(audio => {
    audio.volume = currentVolume;
  });

  volumeSlider.setAttribute('aria-valuenow', currentVolume.toFixed(2));
};

volumeSlider.addEventListener("input", handleVolume);

// ===== SHOW/HIDE KEYS TOGGLE =====
const showHideKeys = () => {
  pianoKeys.forEach((key) => key.classList.toggle("hide"));

  const isChecked = keysCheck.checked;
  keysCheck.setAttribute('aria-checked', isChecked);
};

keysCheck.addEventListener("click", showHideKeys);

// ===== RECORDING CONTROLS =====
if (recordBtn) recordBtn.addEventListener("click", startRecording);
if (stopBtn) stopBtn.addEventListener("click", stopRecording);
if (playBtn) playBtn.addEventListener("click", playRecording);

// ===== INSTRUMENT SELECTOR =====
if (instrumentSelect) {
  instrumentSelect.addEventListener("change", (e) => {
    currentInstrument = e.target.value;
    console.log(`🎺 Instrumento alterado para: ${currentInstrument}`);
  });
}

// ===== METRONOME CONTROLS =====
if (metronomeToggle) {
  metronomeToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      startMetronome();
    } else {
      stopMetronome();
    }
  });
}

if (bpmInput) {
  bpmInput.addEventListener("change", (e) => {
    metronomeBPM = parseInt(e.target.value) || 120;
    if (metronomeToggle.checked) {
      stopMetronome();
      startMetronome();
    }
  });
}

// ===== INITIALIZATION =====
window.addEventListener('DOMContentLoaded', () => {
  preloadAudio();

  // Start visualizer animation loop
  if (visualizerCtx) {
    drawVisualizer();
  }


  console.log('🎹 Piano Virtual carregado com sucesso!');
  console.log('✨ Recursos avançados ativados:');
  console.log('   🎙️ Sistema de gravação');
  console.log('   🎺 Seletor de instrumentos (Piano/Órgão/Synth)');
  console.log('   ⏱️ Metrônomo integrado');
  console.log('   📊 Visualizador de áudio');
  console.log('   🎹 25 teclas (2 oitavas)');
});