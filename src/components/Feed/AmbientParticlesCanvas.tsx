import React, { useRef, useEffect, useState } from 'react';
import { AmbientAtmosphereType } from '../../types';
import { ambientAtmosphere } from '../../utils/ambientAtmosphere';

interface AmbientParticlesCanvasProps {
  isLight?: boolean;
  atmosphereType?: AmbientAtmosphereType;
  isActive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
  color: string;
}

interface RippleRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const AmbientParticlesCanvas: React.FC<AmbientParticlesCanvasProps> = ({
  isLight = false,
  atmosphereType,
  isActive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [atmosphereState, setAtmosphereState] = useState<{
    isRunning: boolean;
    type: AmbientAtmosphereType;
    volume: number;
  }>({
    isRunning: isActive || ambientAtmosphere.isActive(),
    type: atmosphereType || ambientAtmosphere.getType(),
    volume: 0.15,
  });

  // Subscribe to real-time atmosphere engine state changes
  useEffect(() => {
    const unsubscribe = ambientAtmosphere.addAtmosphereListener((state) => {
      setAtmosphereState(state);
    });
    return () => unsubscribe();
  }, []);

  const effectiveType = atmosphereType || atmosphereState.type;
  const isAtmosphereRunning = isActive || atmosphereState.isRunning;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let smoothedIntensity = 0;
    let lastTime = performance.now();
    let rings: RippleRing[] = [];
    let lastRingSpawn = 0;

    // ResizeObserver on canvas container for strict responsive alignment
    const handleResize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    handleResize();

    // Generate themed meditative particles
    const particleCount = 28;
    const particles: Particle[] = [];

    const getThemeColors = (type: AmbientAtmosphereType, light: boolean) => {
      if (light) {
        switch (type) {
          case 'river':
            return ['rgba(13, 148, 136, 0.18)', 'rgba(56, 189, 248, 0.16)', 'rgba(217, 119, 6, 0.14)'];
          case 'forest':
            return ['rgba(5, 150, 105, 0.18)', 'rgba(245, 158, 11, 0.15)', 'rgba(101, 163, 13, 0.14)'];
          case 'tanpura':
            return ['rgba(217, 119, 6, 0.20)', 'rgba(190, 24, 93, 0.15)', 'rgba(180, 83, 9, 0.16)'];
          case 'temple_bells':
          default:
            return ['rgba(217, 119, 6, 0.20)', 'rgba(245, 158, 11, 0.18)', 'rgba(251, 191, 36, 0.15)'];
        }
      } else {
        switch (type) {
          case 'river':
            return ['rgba(45, 212, 191, 0.35)', 'rgba(56, 189, 248, 0.32)', 'rgba(251, 191, 36, 0.22)'];
          case 'forest':
            return ['rgba(52, 211, 153, 0.35)', 'rgba(245, 158, 11, 0.28)', 'rgba(163, 230, 53, 0.25)'];
          case 'tanpura':
            return ['rgba(245, 158, 11, 0.38)', 'rgba(236, 72, 153, 0.30)', 'rgba(217, 119, 6, 0.32)'];
          case 'temple_bells':
          default:
            return ['rgba(245, 158, 11, 0.40)', 'rgba(251, 191, 36, 0.35)', 'rgba(253, 230, 138, 0.28)'];
        }
      }
    };

    const colors = getThemeColors(effectiveType, isLight);

    for (let i = 0; i < particleCount; i++) {
      const baseR = Math.random() * 2.5 + 1.2;
      particles.push({
        x: Math.random() * (width || 300),
        y: Math.random() * (height || 200),
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        radius: baseR,
        baseRadius: baseR,
        alpha: Math.random() * 0.4 + 0.1,
        baseAlpha: Math.random() * 0.35 + 0.15,
        phase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length]
      });
    }

    // Animation Loop
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Audio Sync Intensity
      let currentIntensity = 0;
      if (isAtmosphereRunning) {
        currentIntensity = ambientAtmosphere.getAudioIntensity();
      }
      smoothedIntensity += (currentIntensity - smoothedIntensity) * 0.12;

      // 2. Slow-Moving Radial Ambient Gradient Aura
      const focalOffsetX = Math.sin(time * 0.0008) * (width * 0.18);
      const focalOffsetY = Math.cos(time * 0.0006) * (height * 0.15);
      const centerX = width / 2 + focalOffsetX;
      const centerY = height / 2 + focalOffsetY;

      const baseRadius = Math.max(width, height) * 0.65;
      const dynamicRadius = baseRadius * (1 + smoothedIntensity * 0.35);

      const radGrad = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, dynamicRadius
      );

      // Aura coloring based on active atmosphere
      if (isLight) {
        if (effectiveType === 'river') {
          radGrad.addColorStop(0, `rgba(20, 184, 166, ${0.07 + smoothedIntensity * 0.08})`);
          radGrad.addColorStop(0.6, `rgba(56, 189, 248, ${0.04 + smoothedIntensity * 0.05})`);
          radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else if (effectiveType === 'forest') {
          radGrad.addColorStop(0, `rgba(16, 185, 129, ${0.07 + smoothedIntensity * 0.08})`);
          radGrad.addColorStop(0.6, `rgba(245, 158, 11, ${0.04 + smoothedIntensity * 0.04})`);
          radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else if (effectiveType === 'tanpura') {
          radGrad.addColorStop(0, `rgba(217, 119, 6, ${0.08 + smoothedIntensity * 0.09})`);
          radGrad.addColorStop(0.6, `rgba(190, 24, 93, ${0.04 + smoothedIntensity * 0.05})`);
          radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
          // temple_bells
          radGrad.addColorStop(0, `rgba(245, 158, 11, ${0.08 + smoothedIntensity * 0.09})`);
          radGrad.addColorStop(0.6, `rgba(251, 191, 36, ${0.04 + smoothedIntensity * 0.04})`);
          radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
      } else {
        if (effectiveType === 'river') {
          radGrad.addColorStop(0, `rgba(20, 184, 166, ${0.12 + smoothedIntensity * 0.18})`);
          radGrad.addColorStop(0.55, `rgba(14, 116, 144, ${0.06 + smoothedIntensity * 0.10})`);
          radGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');
        } else if (effectiveType === 'forest') {
          radGrad.addColorStop(0, `rgba(16, 185, 129, ${0.12 + smoothedIntensity * 0.18})`);
          radGrad.addColorStop(0.55, `rgba(180, 83, 9, ${0.06 + smoothedIntensity * 0.09})`);
          radGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');
        } else if (effectiveType === 'tanpura') {
          radGrad.addColorStop(0, `rgba(234, 88, 12, ${0.14 + smoothedIntensity * 0.20})`);
          radGrad.addColorStop(0.55, `rgba(147, 51, 234, ${0.07 + smoothedIntensity * 0.12})`);
          radGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');
        } else {
          // temple_bells
          radGrad.addColorStop(0, `rgba(245, 158, 11, ${0.14 + smoothedIntensity * 0.22})`);
          radGrad.addColorStop(0.55, `rgba(217, 119, 6, ${0.06 + smoothedIntensity * 0.10})`);
          radGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');
        }
      }

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Audio Bell Strike / Pulse Harmonic Rings
      if (isAtmosphereRunning && smoothedIntensity > 0.42 && time - lastRingSpawn > 800) {
        lastRingSpawn = time;
        rings.push({
          x: width / 2 + (Math.random() - 0.5) * 40,
          y: height / 2 + (Math.random() - 0.5) * 40,
          radius: 10,
          maxRadius: Math.max(width, height) * 0.6,
          alpha: isLight ? 0.25 : 0.45
        });
      }

      // Render expanding ripple rings
      rings = rings.filter(ring => {
        ring.radius += dt * 60;
        ring.alpha *= 0.96;

        ctx.save();
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isLight 
          ? `rgba(217, 119, 6, ${ring.alpha * 0.6})` 
          : `rgba(251, 191, 36, ${ring.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();

        return ring.radius < ring.maxRadius && ring.alpha > 0.01;
      });

      // 4. Meditative Particles Animation
      const speedMultiplier = 1 + smoothedIntensity * 1.8;

      particles.forEach((p) => {
        // Individual particle movement depends on atmosphere soundscape
        if (effectiveType === 'river') {
          // River: horizontal fluid drift from left to right with sine undulations
          p.x += (0.45 + p.vx * 0.4) * speedMultiplier;
          p.y += Math.sin(time * 0.002 + p.phase) * 0.3 * speedMultiplier;

          if (p.x > width + 10) p.x = -10;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        } else if (effectiveType === 'forest') {
          // Forest: diagonal breeze with gentle organic sway
          p.x += (Math.sin(time * 0.0015 + p.phase) * 0.4 + 0.15) * speedMultiplier;
          p.y -= (0.35 + Math.cos(time * 0.001 + p.phase) * 0.2) * speedMultiplier;

          if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
          if (p.x > width + 10) p.x = -10;
        } else if (effectiveType === 'tanpura') {
          // Tanpura: breathing radial harmonic oscillation
          const dx = p.x - width / 2;
          const dy = p.y - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const radialPush = Math.sin(time * 0.003 + p.phase) * 0.4 * speedMultiplier;

          p.x += (dx / dist) * radialPush + p.vx * 0.3;
          p.y += (dy / dist) * radialPush + p.vy * 0.3;

          if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            p.x = width / 2 + (Math.random() - 0.5) * 40;
            p.y = height / 2 + (Math.random() - 0.5) * 40;
          }
        } else {
          // Temple Bells: ethereal upward float with gentle sway
          p.y += p.vy * speedMultiplier;
          p.x += Math.sin(time * 0.001 + p.phase) * 0.25 * speedMultiplier;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }

        // Particle size & alpha pulse with audio intensity
        const dynamicAlpha = Math.min(
          isLight ? 0.45 : 0.85,
          p.baseAlpha * (0.8 + Math.sin(time * 0.002 + p.phase) * 0.2) + smoothedIntensity * 0.4
        );
        const dynamicRadius = p.baseRadius * (1 + smoothedIntensity * 0.5);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, dynamicRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = dynamicAlpha;
        ctx.fill();

        // Subtle soft glow on higher audio energy
        if (smoothedIntensity > 0.3) {
          ctx.shadowBlur = 4 + smoothedIntensity * 6;
          ctx.shadowColor = isLight ? 'rgba(217, 119, 6, 0.4)' : 'rgba(251, 191, 36, 0.6)';
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [effectiveType, isLight, isAtmosphereRunning]);

  return (
    <div 
      ref={containerRef} 
      id="ambient-atmosphere-canvas-wrapper"
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl transition-opacity duration-700 select-none -z-0"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />
    </div>
  );
};
