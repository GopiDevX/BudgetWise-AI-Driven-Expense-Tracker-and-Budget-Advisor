import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const CanvasContainer = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.8; /* Increased opacity for dash visibility */
`;

// --- Simplex Noise (2D/3D) ---
class SimplexNoise {
    constructor() {
        this.grad3 = [
            [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
            [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
            [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
        ];
        this.p = [];
        for (let i = 0; i < 256; i++) {
            this.p[i] = Math.floor(Math.random() * 256);
        }
        this.perm = [];
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
        }
        this.permMod12 = [];
        for (let i = 0; i < 512; i++) {
            this.permMod12[i] = this.perm[i] % 12;
        }
    }
    dot(g, x, y, z) { return g[0] * x + g[1] * y + g[2] * z; }
    noise3D(xin, yin, zin) {
        let n0, n1, n2, n3;
        const F3 = 1.0 / 3.0;
        const s = (xin + yin + zin) * F3;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const k = Math.floor(zin + s);
        const G3 = 1.0 / 6.0;
        const t = (i + j + k) * G3;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        const z0 = zin - Z0;
        let i1, j1, k1, i2, j2, k2;
        if (x0 >= y0) {
            if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
            else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
            else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
        } else {
            if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
            else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
            else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        }
        const x1 = x0 - i1 + G3;
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2.0 * G3;
        const y2 = y0 - j2 + 2.0 * G3;
        const z2 = z0 - k2 + 2.0 * G3;
        const x3 = x0 - 1.0 + 3.0 * G3;
        const y3 = y0 - 1.0 + 3.0 * G3;
        const z3 = z0 - 1.0 + 3.0 * G3;
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else { t0 *= t0; n0 = t0 * t0 * this.dot(this.grad3[this.permMod12[i + this.perm[j + this.perm[k]]]], x0, y0, z0); }
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else { t1 *= t1; n1 = t1 * t1 * this.dot(this.grad3[this.permMod12[i + i1 + this.perm[j + j1 + this.perm[k + k1]]]], x1, y1, z1); }
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else { t2 *= t2; n2 = t2 * t2 * this.dot(this.grad3[this.permMod12[i + i2 + this.perm[j + j2 + this.perm[k + k2]]]], x2, y2, z2); }
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else { t3 *= t3; n3 = t3 * t3 * this.dot(this.grad3[this.permMod12[i + 1 + this.perm[j + 1 + this.perm[k + 1]]]], x3, y3, z3); }
        return 32.0 * (n0 + n1 + n2 + n3);
    }
}

const ParticleWaveBackground = () => {
    const canvasRef = useRef(null);
    const noise = useRef(new SimplexNoise());
    const animationRef = useRef(null);

    // Track mouse globally or relative to window
    const mouse = useRef({ x: -1000, y: -1000, active: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width, height;
        let particles = [];
        const particleCount = 1200; // High count for "crowd" feeling
        let time = 0;

        // Configuration
        const config = {
            baseSpeed: 1.5,        // Faster movement
            noiseScale: 0.0015,    // Larger waves
            timeSpeed: 0.0008,     // Slower evolution of the field
            dashLength: 12,        // Length of the dash
            interactionRadius: 250,// Area of effect for mouse
            repulsionStrength: 2.5 // Strength of mouse interaction
        };

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            mouse.current.active = true;
        };

        const handleMouseLeave = () => {
            mouse.current.active = false;
        };

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(randomX = false) {
                this.x = randomX ? Math.random() * width : Math.random() * width;
                this.y = Math.random() * height;
                this.life = Math.random() * 100;
                this.vx = 0;
                this.vy = 0;
                // Random offset for variance
                this.noiseOffsetX = Math.random() * 1000;
            }

            update() {
                // 1. Calculate Flow Field Vector
                // Using 3D noise (x, y, time) for smooth continuous change
                const n = noise.current.noise3D(
                    this.x * config.noiseScale,
                    this.y * config.noiseScale,
                    time * config.timeSpeed
                );
                // Map noise (-1 to 1) to angle (0 to 2PI)
                const angle = n * Math.PI * 2;

                let targetVx = Math.cos(angle) * config.baseSpeed;
                let targetVy = Math.sin(angle) * config.baseSpeed;

                // 2. Mouse Interaction (Repulsion/Attraction)
                // Similar to "parting the sea" or flock avoidance
                if (mouse.current.active) {
                    const dx = this.x - mouse.current.x;
                    const dy = this.y - mouse.current.y;
                    const distSq = dx * dx + dy * dy;
                    const radiusSq = config.interactionRadius * config.interactionRadius;

                    if (distSq < radiusSq) {
                        const dist = Math.sqrt(distSq);
                        // Normalized direction from mouse to particle
                        const dirX = dx / dist;
                        const dirY = dy / dist;

                        // Force strength (stronger when closer)
                        const force = (1 - dist / config.interactionRadius) * config.repulsionStrength;

                        // Add repulsion to target velocity
                        targetVx += dirX * force * 5;
                        targetVy += dirY * force * 5;
                    }
                }

                // 3. Apply Smooth Velocity Transition (Inertia)
                // This gives it the "heavy" fluid or flock feel
                this.vx += (targetVx - this.vx) * 0.1;
                this.vy += (targetVy - this.vy) * 0.1;

                this.x += this.vx;
                this.y += this.vy;

                // Wrap around screen
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;

                this.life++;
            }

            draw() {
                // Calculate angle from velocity vector for rotation
                // This aligns the "dash" with the direction of movement (like a bird or arrow)
                const angle = Math.atan2(this.vy, this.vx);
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

                // Dash length scales slightly with speed (motion blur effect)
                const currentDashLength = config.dashLength + (speed * 2);

                // Opacity fade based on distance from center
                const centerX = width / 2;
                const centerY = height / 2;
                const distToCenter = Math.sqrt((this.x - centerX) ** 2 + (this.y - centerY) ** 2);
                const maxDist = Math.max(width, height) / 2;
                let opacity = (distToCenter / maxDist);
                opacity = Math.max(0.15, Math.min(0.7, opacity)); // Keep min visibility

                // Color based on x position + time
                const hue = (this.x / width * 60) + 210 + (time * 0.5); // Blue/Cyan/Purple range

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(angle);

                ctx.beginPath();
                ctx.moveTo(-currentDashLength / 2, 0);
                ctx.lineTo(currentDashLength / 2, 0);

                ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${opacity})`;
                ctx.lineWidth = 1.6; // Slightly thicker for visibility
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.restore();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            time += 1;

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        // Initialize
        resize();
        animate();

        // Event Listeners
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        const handleVisibilityChange = () => {
            if (document.hidden) {
                cancelAnimationFrame(animationRef.current);
            } else {
                animate();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return <CanvasContainer ref={canvasRef} />;
};

export default ParticleWaveBackground;
