import React, { useState, useEffect, useRef } from 'react';
import { MoonAnimation } from './components/MoonAnimation';
import WaterSurface from './components/WaterSurface';
import Stars from './components/Stars';
import Fog from './components/Fog';
import Clouds from './components/Clouds';
import SoundManager from './components/SoundManager';
import { MoonSettings, MoonPhase } from './types/sound';
import { RainSoundEngine } from './utils/soundEngine';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [showLightning, setShowLightning] = useState(false);
  const [showStars] = useState(true);
  const [showFog] = useState(true);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [moonSettings, setMoonSettings] = useState<MoonSettings>({
    position: {
      x: window.innerWidth * 0.8,
      y: window.innerHeight * 0.2
    },
    size: 100,
    glow: 30,
    color: '#FFE5B4',
    phase: 'full' as MoonPhase,
    showCraters: true
  });

  const soundEngineRef = useRef<RainSoundEngine | null>(null);

  const handlePlayPause = async () => {
    if (!soundEngineRef.current) {
      soundEngineRef.current = new RainSoundEngine();
      await soundEngineRef.current.init();
    }
    
    try {
      if (isPlaying) {
        if (activeSound) {
          soundEngineRef.current.stopSound(activeSound);
        }
      } else {
        if (!activeSound) {
          setActiveSound('gentleRain');
          await soundEngineRef.current.playSound('gentleRain', 1, true);
        } else {
          await soundEngineRef.current.playSound(activeSound, 1, true);
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const handleRainTypeChange = async (type: string) => {
    if (!soundEngineRef.current) return;

    try {
      if (isPlaying && activeSound) {
        soundEngineRef.current.stopSound(activeSound);
      }
      setActiveSound(type);
      if (isPlaying) {
        await soundEngineRef.current.playSound(type, 1, true);
      }
    } catch (error) {
      console.error('Error changing rain type:', error);
    }
  };

  const handleIntensityChange = (newIntensity: 'light' | 'medium' | 'heavy') => {
    setIntensity(newIntensity);
  };

  const handleVolumeChange = async (newVolume: number) => {
    if (!soundEngineRef.current || !activeSound) return;
    await soundEngineRef.current.setVolume(activeSound, newVolume);
  };

  const handleLightningToggle = (enabled: boolean) => {
    setShowLightning(enabled);
  };

  // Update moon phase based on current date
  useEffect(() => {
    const updateMoonPhase = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const phase = ((year * 12 + month) * 30 + day) % 30;
      let moonPhase: MoonPhase = 'full';

      if (phase < 3) moonPhase = 'new';
      else if (phase < 7) moonPhase = 'waxing_crescent';
      else if (phase < 10) moonPhase = 'first_quarter';
      else if (phase < 14) moonPhase = 'waxing_gibbous';
      else if (phase < 17) moonPhase = 'full';
      else if (phase < 21) moonPhase = 'waning_gibbous';
      else if (phase < 24) moonPhase = 'last_quarter';
      else moonPhase = 'waning_crescent';

      setMoonSettings(prev => ({ ...prev, phase: moonPhase }));
    };

    updateMoonPhase();
    const interval = setInterval(updateMoonPhase, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />

      {/* Stars */}
      {showStars && (
        <Stars isPlaying={isPlaying} moonPhase={moonSettings.phase} />
      )}

      {/* Clouds */}
      <Clouds isPlaying={isPlaying} intensity={intensity} />

      {/* Fog */}
      {showFog && (
        <Fog isPlaying={isPlaying} intensity={intensity} />
      )}

      <div className="relative z-20">
        {/* Water surface with rain drops and moon reflection */}
        <WaterSurface
          isPlaying={isPlaying}
          intensity={intensity}
          moonSettings={moonSettings}
        />

        {/* Moon animation */}
        <MoonAnimation
          isPlaying={isPlaying}
          moonSettings={moonSettings}
        />
      </div>

      {/* Sound controls */}
      <SoundManager
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onIntensityChange={handleIntensityChange}
        onRainTypeChange={handleRainTypeChange}
        onLightningToggle={handleLightningToggle}
        intensity={intensity}
        showLightning={showLightning}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
};

export default App;
