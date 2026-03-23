"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  pulseSpeed: number;
  pulseOffset: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;

    const colors = [
      "rgba(124, 58, 237,", // violet
      "rgba(168, 85, 247,", // purple
      "rgba(192, 132, 252,", // lavender
      "rgba(232, 121, 249,", // pink
      "rgba(59, 130, 246,", // blue
    ];

    const particles: Particle[] = [];

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: 0,
      vy: 0,
      active: false,
      lastX: window.innerWidth / 2,
      lastY: window.innerHeight / 2,
      lastT: performance.now(),
      lastMoveT: performance.now(),
    };

    const MAX_PARTICLES = 240; // performance cap

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      particles.length = 0;

      const count = Math.max(
        80,
        Math.min(MAX_PARTICLES, Math.floor((canvas.width * canvas.height) / 22000))
      );

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          size: Math.random() * 1.9 + 0.5,
          opacity: Math.random() * 0.55 + 0.12,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulseSpeed: Math.random() * 0.03 + 0.004,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(8, now - pointer.lastT);

      const dx = e.clientX - pointer.lastX;
      const dy = e.clientY - pointer.lastY;

      pointer.vx = dx / dt;
      pointer.vy = dy / dt;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      pointer.lastMoveT = now;
      pointer.lastX = e.clientX;
      pointer.lastY = e.clientY;
      pointer.lastT = now;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    const draw = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const fadeAlpha = isDark ? 0.18 : 0.28;

      // Fade frame for smooth trails (theme-aware background fade)
      ctx.fillStyle = isDark
        ? `rgba(8, 8, 15, ${fadeAlpha})`
        : `rgba(15, 15, 26, ${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Auto-disable cursor attraction after a moment of inactivity.
      if (pointer.active && performance.now() - pointer.lastMoveT > 900) {
        pointer.active = false;
      }

      const cursorRadius = prefersReducedMotion ? 0 : 210;
      const cursorRadius2 = cursorRadius * cursorRadius;
      const cursorStrength = prefersReducedMotion ? 0 : 0.08;

      const connectDistance = 105;
      const connectDistance2 = connectDistance * connectDistance;

      // Spatial hash for particle connections
      const cellSize = connectDistance;
      const grid = new Map<string, number[]>();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);
        const key = `${cx},${cy}`;
        const list = grid.get(key);
        if (list) list.push(i);
        else grid.set(key, [i]);
      }

      // Cursor lines (angravity-like)
      if (pointer.active && !prefersReducedMotion) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < cursorRadius2) {
            const dist = Math.sqrt(d2) + 0.001;
            const t = 1 - dist / cursorRadius;
            const alpha = t * t * 0.18;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      // Particle connections (nearby)
      let linesDrawn = 0;
      const MAX_LINES = 260; // cap for perf

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);

        for (let gx = -1; gx <= 1; gx++) {
          for (let gy = -1; gy <= 1; gy++) {
            const key = `${cx + gx},${cy + gy}`;
            const bucket = grid.get(key);
            if (!bucket) continue;

            for (const j of bucket) {
              if (j <= i) continue;
              if (linesDrawn >= MAX_LINES) break;

              const p2 = particles[j];
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < connectDistance2) {
                const dist = Math.sqrt(d2);
                const t = 1 - dist / connectDistance;
                const alpha = t * t * 0.16;

                ctx.beginPath();
                ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                linesDrawn++;
              }
            }
            if (linesDrawn >= MAX_LINES) break;
          }
          if (linesDrawn >= MAX_LINES) break;
        }
        if (linesDrawn >= MAX_LINES) break;
      }

      // Update + draw particles
      const time = performance.now() * 0.001;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion && pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < cursorRadius2 && d2 > 0.0001) {
            const dist = Math.sqrt(d2);
            const nx = dx / dist;
            const ny = dy / dist;
            const t = 1 - dist / cursorRadius;
            const force = t * t * cursorStrength;

            // Attract toward cursor (with pointer velocity influence)
            p.vx += nx * force + pointer.vx * t * 0.18;
            p.vy += ny * force + pointer.vy * t * 0.18;
          }
        }

        // Gentle drift damping
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap-around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulse =
          Math.sin(time * (1 / p.pulseSpeed) + p.pulseOffset) * 0.3 + 0.7;
        const alpha = p.opacity * pulse;

        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 3.2
        );
        gradient.addColorStop(0, `${p.color}${alpha})`);
        gradient.addColorStop(1, `${p.color}0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();
      }
    };

    resize();

    const animate = () => {
      draw();
      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-screen pointer-events-none"
      style={{ zIndex: 0, opacity: 0.8 }}
    />
  );
}
