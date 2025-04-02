import React, { useEffect, useRef } from 'react';
import { MoonSettings } from '../types/sound';

interface WaterSurfaceProps {
  isPlaying: boolean;
  intensity: 'light' | 'medium' | 'heavy';
  moonSettings: MoonSettings;
}

const WaterSurface: React.FC<WaterSurfaceProps> = ({
  isPlaying,
  intensity,
  moonSettings
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawMoon = () => {
      const { size = 100, color = '#FFE5B4' } = moonSettings;
      const x = moonSettings.position.x;
      const y = moonSettings.position.y;

      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const drawRain = () => {
      if (!isPlaying) return;

      const dropCount = intensity === 'light' ? 100 : intensity === 'medium' ? 200 : 300;
      const dropLength = intensity === 'light' ? 10 : intensity === 'medium' ? 15 : 20;

      ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
      ctx.lineWidth = 1;

      for (let i = 0; i < dropCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + dropLength);
        ctx.stroke();
      }
    };

    const animate = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMoon();
      drawRain();

      lastTimeRef.current = time;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [moonSettings, isPlaying, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10"
      style={{ background: 'transparent' }}
    />
  );
};

export default WaterSurface; 