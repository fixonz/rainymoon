import React, { useEffect, useRef } from 'react';
import { RainIntensity } from '../types/sound';

interface FogProps {
  isPlaying: boolean;
  intensity: RainIntensity;
}

const Fog: React.FC<FogProps> = ({ isPlaying, intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const fogLayersRef = useRef<Array<{
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

    const createFogLayers = () => {
      const layers = [];
      const layerCount = 3;
      const baseSpeed = intensity === 'heavy' ? 0.5 : intensity === 'medium' ? 0.3 : 0.2;
      const baseOpacity = intensity === 'heavy' ? 0.15 : intensity === 'medium' ? 0.1 : 0.05;

      for (let i = 0; i < layerCount; i++) {
        layers.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          width: canvas.width * (1 + Math.random() * 0.5),
          height: canvas.height * (1 + Math.random() * 0.5),
          speed: baseSpeed * (1 + Math.random() * 0.5),
          opacity: baseOpacity * (1 + Math.random() * 0.3)
        });
      }

      return layers;
    };

    const animate = () => {
      if (!isPlaying) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      fogLayersRef.current.forEach(layer => {
        // Move layer
        layer.x += layer.speed;
        layer.y += layer.speed * 0.5;

        // Reset position if layer moves off screen
        if (layer.x > canvas.width) {
          layer.x = -layer.width;
        }
        if (layer.y > canvas.height) {
          layer.y = -layer.height;
        }

        // Draw fog layer
        ctx.fillStyle = `rgba(200, 200, 200, ${layer.opacity})`;
        ctx.fillRect(layer.x, layer.y, layer.width, layer.height);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    fogLayersRef.current = createFogLayers();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      fogLayersRef.current = createFogLayers();
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

export default Fog; 