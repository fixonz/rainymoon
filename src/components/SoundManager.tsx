import React, { useRef, useEffect, useState } from 'react';
import { RainSoundEngine } from '../utils/soundEngine';

interface SoundManagerProps {
  onPlayPause: () => void;
  onIntensityChange: (intensity: 'light' | 'medium' | 'heavy') => void;
  onRainTypeChange: (type: string) => void;
  onLightningToggle: (enabled: boolean) => void;
  intensity: 'light' | 'medium' | 'heavy';
  showLightning: boolean;
  onVolumeChange?: (volume: number) => void;
  isPlaying: boolean;
  isLoading: boolean;
}

const SoundManager: React.FC<SoundManagerProps> = ({
  onPlayPause,
  onIntensityChange,
  onRainTypeChange,
  onLightningToggle,
  intensity,
  showLightning,
  onVolumeChange,
  isPlaying,
  isLoading
}) => {
  const engineRef = useRef<RainSoundEngine | null>(null);
  const [masterVolume, setMasterVolume] = useState(1);

  useEffect(() => {
    const initSoundEngine = async () => {
      try {
        const engine = new RainSoundEngine();
        await engine.init();
        engineRef.current = engine;
      } catch (error) {
        console.error('Failed to initialize sound engine:', error);
      }
    };

    initSoundEngine();

    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup();
      }
    };
  }, []);

  const handleVolumeChange = (volume: number) => {
    if (!engineRef.current) return;
    engineRef.current.setMasterVolume(volume);
    setMasterVolume(volume);
    onVolumeChange?.(volume);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4">
      <button
        onClick={onPlayPause}
        disabled={isLoading}
        className={`px-4 py-2 rounded-lg transition-colors ${
          isLoading ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' :
          isPlaying ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 
          'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
        }`}
      >
        {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
      </button>

      <div className="flex items-center gap-2">
        <span className="text-white text-sm">Volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={masterVolume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-24"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-white text-sm">Rain</span>
        <select
          value={intensity}
          onChange={(e) => onIntensityChange(e.target.value as 'light' | 'medium' | 'heavy')}
          className="bg-black/50 text-white rounded px-2 py-1 border border-white/20"
        >
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="heavy">Heavy</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-white text-sm">Type</span>
        <select
          onChange={(e) => onRainTypeChange(e.target.value)}
          className="bg-black/50 text-white rounded px-2 py-1 border border-white/20"
        >
          <option value="gentle">Gentle</option>
          <option value="moderate">Moderate</option>
          <option value="heavy">Heavy</option>
          <option value="storm">Storm</option>
        </select>
      </div>

      <button
        onClick={() => onLightningToggle(!showLightning)}
        className={`px-4 py-2 rounded-lg transition-colors ${
          showLightning ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30' : 
          'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30'
        }`}
      >
        Lightning {showLightning ? 'On' : 'Off'}
      </button>
    </div>
  );
};

export default SoundManager; 