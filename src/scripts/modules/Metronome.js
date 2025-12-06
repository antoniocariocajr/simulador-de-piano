// ===== METRONOME CLASS =====
// Manages metronome functionality with BPM control

export class Metronome {
    constructor() {
        this.interval = null;
        this.bpm = 120;
        this.clickSound = new Audio('src/tunes/a.wav');
        this.clickSound.volume = 0.3;

        this.toggle = document.getElementById("metronome-toggle");
        this.bpmInput = document.getElementById("bpm-input");
        this.indicator = document.getElementById("metronome-indicator");

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.toggle) {
            this.toggle.addEventListener("change", (e) => {
                if (e.target.checked) {
                    this.start();
                } else {
                    this.stop();
                }
            });
        }

        if (this.bpmInput) {
            this.bpmInput.addEventListener("change", (e) => {
                this.bpm = parseInt(e.target.value) || 120;
                if (this.toggle.checked) {
                    this.stop();
                    this.start();
                }
            });
        }
    }

    start() {
        if (this.interval) return;

        const intervalMs = (60 / this.bpm) * 1000;

        this.interval = setInterval(() => {
            this.playClick();
            this.flashIndicator();
        }, intervalMs);

        console.log(`⏱️ Metrônomo iniciado: ${this.bpm} BPM`);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.indicator.classList.remove('beat');
            console.log('⏱️ Metrônomo parado');
        }
    }

    playClick() {
        const click = this.clickSound.cloneNode();
        click.volume = 0.3;
        click.playbackRate = 2.0;
        click.play().catch(() => { });
    }

    flashIndicator() {
        this.indicator.classList.add('beat');
        setTimeout(() => {
            this.indicator.classList.remove('beat');
        }, 100);
    }
}
