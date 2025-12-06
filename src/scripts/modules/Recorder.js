// ===== RECORDER CLASS =====
// Manages recording and playback of piano sequences

export class Recorder {
    constructor(piano) {
        this.piano = piano;
        this.isRecording = false;
        this.isPlaying = false;
        this.startTime = null;
        this.notes = [];

        this.recordBtn = document.getElementById("record-btn");
        this.stopBtn = document.getElementById("stop-btn");
        this.playBtn = document.getElementById("play-btn");
        this.statusText = document.getElementById("recording-status");

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.recordBtn) {
            this.recordBtn.addEventListener("click", () => this.startRecording());
        }
        if (this.stopBtn) {
            this.stopBtn.addEventListener("click", () => this.stopRecording());
        }
        if (this.playBtn) {
            this.playBtn.addEventListener("click", () => this.playRecording());
        }
    }

    startRecording() {
        this.isRecording = true;
        this.startTime = Date.now();
        this.notes = [];

        this.recordBtn.classList.add("recording");
        this.recordBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.playBtn.disabled = true;

        this.statusText.textContent = "● Gravando...";
        this.statusText.style.color = "#ef4444";

        console.log('🎙️ Gravação iniciada');
    }

    stopRecording() {
        this.isRecording = false;

        this.recordBtn.classList.remove("recording");
        this.recordBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.playBtn.disabled = this.notes.length === 0;

        const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);
        this.statusText.textContent = `Gravado: ${this.notes.length} notas (${duration}s)`;
        this.statusText.style.color = "#10b981";

        console.log('🎙️ Gravação parada:', this.notes.length, 'notas');
    }

    async playRecording() {
        if (this.notes.length === 0 || this.isPlaying) return;

        this.isPlaying = true;
        this.recordBtn.disabled = true;
        this.stopBtn.disabled = true;
        this.playBtn.disabled = true;

        this.statusText.textContent = "▶ Reproduzindo...";
        this.statusText.style.color = "#667eea";

        // Play first note immediately
        if (this.notes.length > 0) {
            this.piano.playNote(this.notes[0].key);
        }

        // Play remaining notes with delays
        for (let i = 1; i < this.notes.length; i++) {
            const delay = this.notes[i].timestamp - this.notes[i - 1].timestamp;
            await new Promise(resolve => setTimeout(resolve, delay));
            if (!this.isPlaying) break;
            this.piano.playNote(this.notes[i].key);
        }

        this.isPlaying = false;
        this.recordBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.playBtn.disabled = false;

        const duration = ((this.notes[this.notes.length - 1]?.timestamp || 0) / 1000).toFixed(1);
        this.statusText.textContent = `Gravado: ${this.notes.length} notas (${duration}s)`;
        this.statusText.style.color = "#10b981";

        console.log('▶ Reprodução concluída');
    }

    recordNote(key) {
        if (!this.isRecording) return;

        const timestamp = Date.now() - this.startTime;
        this.notes.push({ key, timestamp });
    }
}
