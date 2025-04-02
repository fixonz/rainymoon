import React, { useEffect, useRef } from 'react';

interface RainAnimationProps {
  isPlaying: boolean;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Moon {
  x: number;
  y: number;
  radius: number;
  glowRadius: number;
  glowOpacity: number;
  craters: Array<{
    x: number;
    y: number;
    radius: number;
    depth: number;
  }>;
}

export const RainAnimation: React.FC<RainAnimationProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const raindropsRef = useRef<RainDrop[]>([]);
  const starsRef = useRef<Star[]>([]);
  const moonRef = useRef<Moon>({
    x: 0,
    y: 0,
    radius: 0,
    glowRadius: 0,
    glowOpacity: 0,
    craters: [],
  });

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize moon
    moonRef.current = {
      x: canvas.width * 0.8,
      y: canvas.height * 0.2,
      radius: Math.min(canvas.width, canvas.height) * 0.15,
      glowRadius: Math.min(canvas.width, canvas.height) * 0.25,
      glowOpacity: 0.3,
      craters: [
        { x: 0.2, y: 0.2, radius: 0.1, depth: 0.3 },
        { x: 0.6, y: 0.4, radius: 0.15, depth: 0.4 },
        { x: 0.4, y: 0.7, radius: 0.12, depth: 0.35 },
        { x: 0.8, y: 0.8, radius: 0.08, depth: 0.25 },
      ],
    };

    // Initialize stars
    starsRef.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.5,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    // Initialize raindrops
    raindropsRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 5 + 5,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  };

  const drawMoon = (ctx: CanvasRenderingContext2D) => {
    const moon = moonRef.current;
    const centerX = moon.x;
    const centerY = moon.y;

    // Draw moon glow
    const gradient = ctx.createRadialGradient(
      centerX, centerY, moon.radius,
      centerX, centerY, moon.glowRadius
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${moon.glowOpacity})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, moon.glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw moon base
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.arc(centerX, centerY, moon.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw craters
    moon.craters.forEach(crater => {
      const craterX = centerX + (crater.x - 0.5) * moon.radius * 2;
      const craterY = centerY + (crater.y - 0.5) * moon.radius * 2;
      const craterRadius = crater.radius * moon.radius;

      // Crater shadow
      ctx.fillStyle = `rgba(0, 0, 0, ${crater.depth})`;
      ctx.beginPath();
      ctx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2);
      ctx.fill();

      // Crater highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(
        craterX - craterRadius * 0.3,
        craterY - craterRadius * 0.3,
        craterRadius * 0.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  };

  const drawStars = (ctx: CanvasRenderingContext2D, time: number) => {
    starsRef.current.forEach(star => {
      const opacity = star.opacity * (0.5 + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawRain = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
    ctx.lineWidth = 1;

    raindropsRef.current.forEach(drop => {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.stroke();

      drop.y += drop.speed;
      if (drop.y > canvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * canvas.width;
      }
    });
  };

  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    drawStars(ctx, time);

    // Draw moon
    drawMoon(ctx);

    // Draw rain if playing
    if (isPlaying) {
      drawRain(ctx);
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    initializeCanvas();
    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      initializeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}; 