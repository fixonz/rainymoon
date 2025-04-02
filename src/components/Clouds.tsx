import React, { useEffect, useRef } from 'react';

interface CloudsProps {
  isPlaying: boolean;
  intensity: 'light' | 'medium' | 'heavy';
}

const Clouds: React.FC<CloudsProps> = ({ isPlaying, intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const cloudsRef = useRef<Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    opacity: number;
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

    const createClouds = () => {
      const clouds = [];
      const numClouds = intensity === 'heavy' ? 8 : intensity === 'medium' ? 6 : 4;
      const baseSpeed = intensity === 'heavy' ? 0.3 : intensity === 'medium' ? 0.2 : 0.1;
      const baseOpacity = intensity === 'heavy' ? 0.4 : intensity === 'medium' ? 0.3 : 0.2;

      for (let i = 0; i < numClouds; i++) {
        clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.4), // Only in upper 40% of screen
          width: canvas.width * (0.2 + Math.random() * 0.3),
          height: canvas.height * (0.1 + Math.random() * 0.15),
          speed: baseSpeed * (0.5 + Math.random() * 0.5),
          opacity: baseOpacity * (0.5 + Math.random() * 0.5)
        });
      }

      return clouds;
    };

    const drawCloud = (x: number, y: number, width: number, height: number, opacity: number) => {
      ctx.fillStyle = `rgba(200, 200, 200, ${opacity})`;
      ctx.beginPath();
      ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      if (!isPlaying) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cloudsRef.current.forEach(cloud => {
        // Move cloud
        cloud.x += cloud.speed;

        // Reset position if cloud moves off screen
        if (cloud.x > canvas.width + cloud.width) {
          cloud.x = -cloud.width;
          cloud.y = Math.random() * (canvas.height * 0.4);
        }

        // Draw cloud
        drawCloud(cloud.x, cloud.y, cloud.width, cloud.height, cloud.opacity);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    cloudsRef.current = createClouds();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      cloudsRef.current = createClouds();
    });

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
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: isPlaying ? 1 : 0.5 }}
    />
  );
};

export default Clouds; 