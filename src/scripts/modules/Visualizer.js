// ===== VISUALIZER CLASS =====
// Manages audio visualization with canvas

export class Visualizer {
    constructor() {
        this.canvas = document.getElementById("audio-visualizer");
        this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
        this.isActive = false;
        this.bars = [];

        if (this.ctx) {
            this.startAnimationLoop();
        }
    }

    trigger() {
        if (!this.ctx) return;

        // Generate random bars for visual effect
        const numBars = 32;
        this.bars = [];
        for (let i = 0; i < numBars; i++) {
            this.bars.push(Math.random() * 0.8 + 0.2);
        }

        this.isActive = true;

        // Fade out after 500ms
        setTimeout(() => {
            this.isActive = false;
        }, 500);
    }

    startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.draw();
        };
        animate();
    }

    draw() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.isActive) return;

        const barWidth = (this.canvas.width / this.bars.length) * 0.8;
        const gap = (this.canvas.width / this.bars.length) * 0.2;

        this.bars.forEach((height, i) => {
            const barHeight = height * this.canvas.height * 0.8;
            const x = i * (barWidth + gap);
            const y = this.canvas.height - barHeight;

            // Create gradient
            const gradient = this.ctx.createLinearGradient(0, y, 0, this.canvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, y, barWidth, barHeight);

            // Decay the bar
            this.bars[i] *= 0.95;
        });
    }
}
