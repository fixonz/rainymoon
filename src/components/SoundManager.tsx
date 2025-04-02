import React, { useState } from 'react';

interface SoundManagerProps {
  onPlayPause: () => void;
  onIntensityChange: (intensity: 'light' | 'medium' | 'heavy') => void;
  onRainTypeChange: (type: string) => void;
  onLightningToggle: (enabled: boolean) => void;
  intensity: 'light' | 'medium' | 'heavy';
  showLightning: boolean;
  onVolumeChange?: (volume: number) => void;
  isPlaying: boolean;
}

const SoundManager: React.FC<SoundManagerProps> = ({
  onPlayPause,
  onIntensityChange,
  onRainTypeChange,
  onLightningToggle,
  intensity,
  showLightning,
  onVolumeChange,
  isPlaying
}) => {
  const [volume, setVolume] = useState(1);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <button
          onClick={onPlayPause}
          className={`px-4 py-2 rounded-lg ${
            isPlaying ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Master Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-32"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Rain Intensity</span>
          <select
            value={intensity}
            onChange={(e) => onIntensityChange(e.target.value as 'light' | 'medium' | 'heavy')}
            className="bg-black/50 text-white rounded px-2 py-1"
          >
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Rain Type</span>
          <select
            onChange={(e) => onRainTypeChange(e.target.value)}
            className="bg-black/50 text-white rounded px-2 py-1"
          >
            <option value="gentle">Gentle</option>
            <option value="moderate">Moderate</option>
            <option value="heavy">Heavy</option>
            <option value="storm">Storm</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Lightning</span>
          <button
            onClick={() => onLightningToggle(!showLightning)}
            className={`px-3 py-1 rounded ${
              showLightning ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
          >
            {showLightning ? 'On' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoundManager; 