import React, { useState } from 'react';
import { SOUNDS, SoundId } from '../types/sound';

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

const RAIN_TYPES = [
  { id: 'gentleRain', label: 'Gentle Rain' },
  { id: 'heavyRain', label: 'Heavy Rain' },
  { id: 'urbanRain', label: 'Urban Rain' },
  { id: 'woodlandRain', label: 'Woodland Rain' },
  { id: 'jungleRain', label: 'Jungle Rain' },
  { id: 'coastalRain', label: 'Coastal Rain' },
  { id: 'indoorRain', label: 'Indoor Rain' },
  { id: 'overheadRain', label: 'Overhead Rain' },
  { id: 'commuterRain', label: 'Commuter Rain' }
];

const OTHER_SOUNDS = [
  { id: 'urbanDrain', label: 'Urban Drain' },
  { id: 'waves', label: 'Waves' },
  { id: 'seafloor', label: 'Seafloor' },
  { id: 'river', label: 'River' },
  { id: 'gulls', label: 'Gulls' },
  { id: 'nocturnalBirds', label: 'Nocturnal Birds' },
  { id: 'field', label: 'Field' }
];

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  const filteredRainTypes = RAIN_TYPES.filter(type =>
    type.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOtherSounds = OTHER_SOUNDS.filter(sound =>
    sound.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto p-4">
        {/* Main controls row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-4 py-2 rounded-lg ${
              isPlaying ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">Master Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1"
              />
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {/* Expanded sound controls */}
        {isExpanded && (
          <div className="mt-4 space-y-6">
            <input
              type="text"
              placeholder="Search sounds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700/50"
            />

            {/* Rain sounds */}
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Rain</h3>
              <div className="grid grid-cols-3 gap-2">
                {filteredRainTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => onRainTypeChange(type.id)}
                    className="px-4 py-2 rounded-lg bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors"
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Other sounds */}
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Other</h3>
              <div className="grid grid-cols-3 gap-2">
                {filteredOtherSounds.map((sound) => (
                  <button
                    key={sound.id}
                    className="px-4 py-2 rounded-lg bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors"
                  >
                    {sound.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onIntensityChange('light')}
                  className={`px-4 py-2 rounded-lg ${
                    intensity === 'light' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800/50 text-white'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => onIntensityChange('medium')}
                  className={`px-4 py-2 rounded-lg ${
                    intensity === 'medium' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800/50 text-white'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => onIntensityChange('heavy')}
                  className={`px-4 py-2 rounded-lg ${
                    intensity === 'heavy' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800/50 text-white'
                  }`}
                >
                  Heavy
                </button>
              </div>

              <button
                onClick={() => onLightningToggle(!showLightning)}
                className={`px-4 py-2 rounded-lg ${
                  showLightning ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-gray-800/50 text-white'
                }`}
              >
                Lightning
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundManager; 