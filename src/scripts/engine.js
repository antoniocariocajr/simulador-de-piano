// ===== PIANO VIRTUAL - MAIN ENGINE =====
// Orchestrates all modules and manages UI controls

import { Piano } from './modules/Piano.js';
import { Recorder } from './modules/Recorder.js';
import { Metronome } from './modules/Metronome.js';
import { Visualizer } from './modules/Visualizer.js';

class PianoApp {
  constructor() {
    // Initialize modules
    this.piano = new Piano();
    this.recorder = new Recorder(this.piano);
    this.metronome = new Metronome();
    this.visualizer = new Visualizer();

    // UI Controls
    this.volumeSlider = document.querySelector(".volume-slider input");
    this.keysToggle = document.querySelector(".keys-check input");
    this.instrumentSelect = document.getElementById("instrument-select");

    this.setupUIControls();
    this.setupPianoCallbacks();

    console.log('🎹 Piano Virtual inicializado com sucesso!');
    this.logFeatures();
  }

  setupPianoCallbacks() {
    // Override piano's playNote to trigger other modules
    const originalPlayNote = this.piano.playNote.bind(this.piano);

    this.piano.playNote = (key) => {
      // Play the note
      originalPlayNote(key);

      // Trigger visualizer
      this.visualizer.trigger();

      // Record if recording
      this.recorder.recordNote(key);
    };
  }

  setupUIControls() {
    // Volume control
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener("input", (e) => {
        this.piano.setVolume(e.target.value);
        this.volumeSlider.setAttribute('aria-valuenow', parseFloat(e.target.value).toFixed(2));
      });
    }

    // Show/Hide keys toggle
    if (this.keysToggle) {
      this.keysToggle.addEventListener("click", () => {
        document.querySelectorAll(".piano-keys .key").forEach(key => {
          key.classList.toggle("hide");
        });
        this.keysToggle.setAttribute('aria-checked', this.keysToggle.checked);
      });
    }

    // Instrument selector
    if (this.instrumentSelect) {
      this.instrumentSelect.addEventListener("change", (e) => {
        this.piano.setInstrument(e.target.value);
      });
    }
  }

  logFeatures() {
    console.log('✨ Recursos ativados:');
    console.log('   🎹 Piano com 25 teclas (2 oitavas)');
    console.log('   🎺 3 Instrumentos (Piano/Órgão/Synth)');
    console.log('   🎙️ Sistema de gravação e reprodução');
    console.log('   ⏱️ Metrônomo (40-240 BPM)');
    console.log('   📊 Visualizador de áudio em tempo real');
    console.log('   ♿ Totalmente acessível (WCAG)');
  }
}

// Initialize app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new PianoApp();
});