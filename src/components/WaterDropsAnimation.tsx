import React, { useEffect, useRef } from 'react';

interface WaterDropsAnimationProps {
  isPlaying: boolean;
  intensity: 'light' | 'medium' | 'heavy';
}

export const WaterDropsAnimation: React.FC<WaterDropsAnimationProps> = ({ isPlaying, intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const dropsRef = useRef<Array<{
    x: number;
    y: number;
    speed: number;
    size: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create initial drops
    const createDrops = () => {
      const numDrops = intensity === 'heavy' ? 100 : intensity === 'medium' ? 70 : 40;
      dropsRef.current = Array.from({ length: numDrops }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1 + Math.random() * 2,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.4,
      }));
    };
    createDrops();

    const animate = () => {
      if (!isPlaying) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dropsRef.current.forEach(drop => {
        // Draw drop
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity})`;
        ctx.fill();

        // Update position
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = 0;
          drop.x = Math.random() * canvas.width;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: isPlaying ? 1 : 0.5,
        transition: 'opacity 0.5s ease-in-out',
      }}
    />
  );
}; 