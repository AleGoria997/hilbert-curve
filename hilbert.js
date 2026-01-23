/**
 * Generator Krzywej Hilberta
 * Implementacja rekurencyjnego algorytmu generowania krzywej Hilberta
 */

class HilbertCurve {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.points = [];
        this.animationId = null;
    }

    /**
     * Konwertuje indeks d na współrzędne (x, y) na krzywej Hilberta
     * @param {number} n - poziom iteracji
     * @param {number} d - indeks na krzywej (0 do 4^n - 1)
     * @returns {object} - współrzędne {x, y}
     */
    d2xy(n, d) {
        let x = 0, y = 0;
        let s = 1;
        let rx, ry, t = d;

        for (s = 1; s < n; s *= 2) {
            rx = 1 & (t / 2);
            ry = 1 & (t ^ rx);
            
            // Obróć punkt
            if (ry === 0) {
                if (rx === 1) {
                    x = s - 1 - x;
                    y = s - 1 - y;
                }
                // Zamień x i y
                [x, y] = [y, x];
            }

            x += s * rx;
            y += s * ry;
            t = Math.floor(t / 4);
        }

        return { x, y };
    }

    /**
     * Generuje wszystkie punkty krzywej Hilberta dla danej iteracji
     * @param {number} order - poziom iteracji (1-8)
     * @returns {Array} - tablica punktów {x, y}
     */
    generatePoints(order) {
        const n = Math.pow(2, order);
        const totalPoints = n * n;
        const points = [];

        for (let i = 0; i < totalPoints; i++) {
            const point = this.d2xy(n, i);
            points.push(point);
        }

        return points;
    }

    /**
     * Rysuje krzywą natychmiastowo
     * @param {Array} points - tablica punktów
     * @param {string} color - kolor linii
     * @param {number} lineWidth - grubość linii
     * @param {number} padding - margines wewnętrzny
     */
    drawInstant(points, color, lineWidth, padding = 20) {
        const ctx = this.ctx;
        const width = this.canvas.width - 2 * padding;
        const height = this.canvas.height - 2 * padding;
        
        // Znajdź zakres punktów
        const maxCoord = Math.max(...points.map(p => Math.max(p.x, p.y)));
        const scale = Math.min(width, height) / maxCoord;

        // Wyczyść canvas
        ctx.fillStyle = 'rgba(10, 10, 26, 1)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Rysuj krzywą
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const startX = padding + points[0].x * scale;
        const startY = padding + points[0].y * scale;
        ctx.moveTo(startX, startY);

        for (let i = 1; i < points.length; i++) {
            const x = padding + points[i].x * scale;
            const y = padding + points[i].y * scale;
            ctx.lineTo(x, y);
        }

        ctx.stroke();

        // Dodaj efekt glow
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    /**
     * Rysuje krzywą z animacją
     * @param {Array} points - tablica punktów
     * @param {string} color - kolor linii
     * @param {number} lineWidth - grubość linii
     * @param {number} padding - margines wewnętrzny
     * @param {Function} onComplete - callback po zakończeniu
     */
    drawAnimated(points, color, lineWidth, padding = 20, onComplete) {
        const ctx = this.ctx;
        const width = this.canvas.width - 2 * padding;
        const height = this.canvas.height - 2 * padding;
        
        const maxCoord = Math.max(...points.map(p => Math.max(p.x, p.y)));
        const scale = Math.min(width, height) / maxCoord;

        // Oblicz prędkość animacji na podstawie liczby punktów
        const totalPoints = points.length;
        const pointsPerFrame = Math.max(1, Math.ceil(totalPoints / 500)); // ~500 klatek max

        let currentIndex = 0;

        const animate = () => {
            // Wyczyść canvas
            ctx.fillStyle = 'rgba(10, 10, 26, 1)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Rysuj dotychczasową krzywą
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const startX = padding + points[0].x * scale;
            const startY = padding + points[0].y * scale;
            ctx.moveTo(startX, startY);

            const endIndex = Math.min(currentIndex + pointsPerFrame, totalPoints);

            for (let i = 1; i < endIndex; i++) {
                const x = padding + points[i].x * scale;
                const y = padding + points[i].y * scale;
                ctx.lineTo(x, y);
            }

            ctx.stroke();

            // Efekt świecenia na końcu
            if (endIndex > 1) {
                const lastPoint = points[endIndex - 1];
                const lastX = padding + lastPoint.x * scale;
                const lastY = padding + lastPoint.y * scale;
                
                ctx.beginPath();
                ctx.arc(lastX, lastY, lineWidth * 3, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.shadowColor = color;
                ctx.shadowBlur = 20;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            currentIndex = endIndex;

            if (currentIndex < totalPoints) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                // Finalny render z glow
                this.drawInstant(points, color, lineWidth, padding);
                if (onComplete) onComplete();
            }
        };

        // Zatrzymaj poprzednią animację
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        animate();
    }

    /**
     * Oblicza długość krzywej
     * @param {Array} points - tablica punktów
     * @returns {number} - długość krzywej w jednostkach
     */
    calculateLength(points) {
        let length = 0;
        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i - 1].x;
            const dy = points[i].y - points[i - 1].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }

    /**
     * Zatrzymuje bieżącą animację
     */
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hilbertCanvas');
    const iterationsSlider = document.getElementById('iterations');
    const iterationValue = document.getElementById('iteration-value');
    const lineColorInput = document.getElementById('lineColor');
    const lineWidthSlider = document.getElementById('lineWidth');
    const lineWidthValue = document.getElementById('lineWidth-value');
    const animatedCheckbox = document.getElementById('animated');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');

    // Statystyki
    const statIteration = document.getElementById('stat-iteration');
    const statPoints = document.getElementById('stat-points');
    const statLength = document.getElementById('stat-length');

    // Ustaw rozmiar canvas
    const size = Math.min(800, window.innerWidth - 80);
    canvas.width = size;
    canvas.height = size;

    const hilbert = new HilbertCurve(canvas);

    // Aktualizuj wartości sliderów
    iterationsSlider.addEventListener('input', (e) => {
        iterationValue.textContent = e.target.value;
    });

    lineWidthSlider.addEventListener('input', (e) => {
        lineWidthValue.textContent = e.target.value;
    });

    // Funkcja generująca krzywą
    function generateCurve() {
        const order = parseInt(iterationsSlider.value);
        const color = lineColorInput.value;
        const lineWidth = parseFloat(lineWidthSlider.value);
        const animated = animatedCheckbox.checked;

        // Pokaż loading dla wysokich iteracji
        if (order >= 7) {
            loading.classList.remove('hidden');
        }

        // Użyj setTimeout aby UI się zaktualizował
        setTimeout(() => {
            const points = hilbert.generatePoints(order);
            const length = hilbert.calculateLength(points);

            // Aktualizuj statystyki
            statIteration.textContent = order;
            statPoints.textContent = points.length.toLocaleString();
            statLength.textContent = length.toFixed(2);

            loading.classList.add('hidden');

            if (animated && points.length <= 65536) { // Limit animacji do 4^8
                hilbert.drawAnimated(points, color, lineWidth, 30, () => {
                    // Animacja zakończona
                });
            } else {
                hilbert.drawInstant(points, color, lineWidth, 30);
            }
        }, 50);
    }

    // Event listeners
    generateBtn.addEventListener('click', generateCurve);

    // Generuj początkową krzywą
    generateCurve();

    // Responsywność
    window.addEventListener('resize', () => {
        const newSize = Math.min(800, window.innerWidth - 80);
        canvas.width = newSize;
        canvas.height = newSize;
        generateCurve();
    });

    // Skróty klawiszowe
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            generateCurve();
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newVal = Math.min(8, parseInt(iterationsSlider.value) + 1);
            iterationsSlider.value = newVal;
            iterationValue.textContent = newVal;
            generateCurve();
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newVal = Math.max(1, parseInt(iterationsSlider.value) - 1);
            iterationsSlider.value = newVal;
            iterationValue.textContent = newVal;
            generateCurve();
        }
    });
});
