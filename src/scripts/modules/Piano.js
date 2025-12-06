// ===== PIANO CLASS =====
// Manages piano keys, audio playback, and instrument effects

export class Piano {
    constructor() {
        this.keys = document.querySelectorAll(".piano-keys .key");
        this.audioCache = {};
        this.mappedKeys = [];
        this.currentVolume = 0.5;
        this.currentInstrument = "piano";

        this.preloadAudio();
        this.setupEventListeners();
    }

    preloadAudio() {
        this.keys.forEach((key) => {
            const keyName = key.dataset.key;
            const audio = new Audio(`src/tunes/${keyName}.wav`);
            audio.volume = this.currentVolume;
            this.audioCache[keyName] = audio;
            this.mappedKeys.push(keyName);
        });

        console.log('🎹 Áudios pré-carregados:', this.mappedKeys.length, 'teclas');
    }

    getPitchShiftedKey(note) {
        const baseNotes = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';'];

        if (baseNotes.includes(note)) {
            return { key: note, pitchShift: 0 };
        }

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
    }

    playNote(key, onPlayCallback = null) {
        const { key: baseKey, pitchShift } = this.getPitchShiftedKey(key);
        const audio = this.audioCache[baseKey];

        if (!audio) {
            console.error(`Áudio não encontrado para a tecla: ${key}`);
            return;
        }

        const audioClone = audio.cloneNode();
        audioClone.volume = this.currentVolume;

        // Apply pitch shift
        if (pitchShift !== 0) {
            audioClone.preservesPitch = false;
            audioClone.playbackRate = Math.pow(2, pitchShift / 12);
        }

        // Apply instrument effects
        this.applyInstrumentEffect(audioClone);

        audioClone.play().catch(error => {
            console.error('Erro ao tocar áudio:', error);
        });

        // Visual feedback
        this.addVisualFeedback(key);

        // Trigger callback (for visualizer, recorder, etc)
        if (onPlayCallback) {
            onPlayCallback(key);
        }
    }

    applyInstrumentEffect(audioClone) {
        switch (this.currentInstrument) {
            case 'organ':
                audioClone.volume = this.currentVolume * 1.2;
                break;
            case 'synth':
                audioClone.volume = this.currentVolume * 0.9;
                audioClone.playbackRate *= 1.1;
                break;
        }
    }

    addVisualFeedback(key) {
        const clickedKey = document.querySelector(`[data-key="${key}"]`);
        if (clickedKey) {
            clickedKey.classList.add("active");
            setTimeout(() => {
                clickedKey.classList.remove("active");
            }, 150);
        }
    }

    setupEventListeners() {
        // Click events on keys
        this.keys.forEach((key) => {
            key.addEventListener("click", () => this.playNote(key.dataset.key));

            // Keyboard navigation (Enter/Space)
            key.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.playNote(key.dataset.key);
                }
            });
        });

        // Keyboard events
        document.addEventListener("keydown", (e) => {
            if (this.mappedKeys.includes(e.key)) {
                e.preventDefault();
                this.playNote(e.key);
            }
        });
    }

    setVolume(volume) {
        this.currentVolume = parseFloat(volume);
        Object.values(this.audioCache).forEach(audio => {
            audio.volume = this.currentVolume;
        });
    }

    setInstrument(instrument) {
        this.currentInstrument = instrument;
        console.log(`🎺 Instrumento alterado para: ${instrument}`);
    }

    getMappedKeys() {
        return this.mappedKeys;
    }
}
