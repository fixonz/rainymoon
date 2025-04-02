import React, { useEffect, useRef } from 'react';
import { MoonSettings } from '../types/sound';

interface MoonAnimationProps {
  isPlaying: boolean;
  moonSettings: MoonSettings;
}

export const MoonAnimation: React.FC<MoonAnimationProps> = ({ isPlaying, moonSettings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const drawMoon = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate moon position and size
      const centerX = canvas.width * 0.8;
      const centerY = canvas.height * 0.2;
      const radius = Math.min(canvas.width, canvas.height) * 0.15;

      // Draw moon glow
      const gradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.5,
        centerX, centerY, radius * 2
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw moon base
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw moon craters
      ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
      const craters = [
        { x: -0.2, y: -0.2, size: 0.2 },
        { x: 0.1, y: 0.1, size: 0.15 },
        { x: -0.1, y: 0.3, size: 0.25 },
      ];

      craters.forEach(crater => {
        ctx.beginPath();
        ctx.arc(
          centerX + crater.x * radius,
          centerY + crater.y * radius,
          crater.size * radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
    };

    const animate = () => {
      drawMoon();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isPlaying, moonSettings]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-20"
      style={{ pointerEvents: 'none' }}
    />
  );
}; 