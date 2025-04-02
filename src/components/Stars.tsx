import React, { useEffect, useRef } from 'react';
import { MoonPhase } from '../types/sound';

interface StarsProps {
  isPlaying: boolean;
  moonPhase: MoonPhase;
}

const Stars: React.FC<StarsProps> = ({ isPlaying, moonPhase }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const starsRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    brightness: number;
    twinkleSpeed: number;
    twinkleOffset: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      const stars = [];
      const numStars = 200;
      const baseBrightness = moonPhase === 'new' ? 1 : moonPhase === 'full' ? 0.3 : 0.6;

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          brightness: baseBrightness * (0.5 + Math.random() * 0.5),
          twinkleSpeed: 0.5 + Math.random() * 0.5,
          twinkleOffset: Math.random() * Math.PI * 2
        });
      }

      return stars;
    };

    const animate = (timestamp: number) => {
      if (!isPlaying) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach(star => {
        const twinkle = Math.sin(timestamp * 0.001 * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
        const brightness = star.brightness * (0.5 + twinkle * 0.5);

        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    starsRef.current = createStars();
    animationFrameRef.current = requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
      resizeCanvas();
      starsRef.current = createStars();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, moonPhase]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: isPlaying ? 1 : 0.5 }}
    />
  );
};

export default Stars; 