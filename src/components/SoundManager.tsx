import React, { useRef, useEffect, useState } from 'react';
import { RainSoundEngine } from '../utils/soundEngine';
import { SOUNDS, SoundId } from '../types/sound';

interface SoundManagerProps {
  onPlayPause: () => void;
  onIntensityChange: (intensity: 'light' | 'medium' | 'heavy') => void;
  onRainTypeChange: (type: string) => void;
  onLightningToggle: (enabled: boolean) => void;
  intensity: 'light' | 'medium' | 'heavy';
  showLightning: boolean;
  onVolumeChange?: (volume: number) => void;
  onMasterVolumeChange?: (volume: number) => void;
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
  onMasterVolumeChange,
  isPlaying
}) => {
  const engineRef = useRef<RainSoundEngine | null>(null);
  const [masterVolume, setMasterVolume] = useState(1);
  const [activeSounds, setActiveSounds] = useState<Partial<Record<SoundId, boolean>>>({});
  const [soundVolumes, setSoundVolumes] = useState<Partial<Record<SoundId, number>>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const initSoundEngine = async () => {
      try {
        const engine = new RainSoundEngine();
        await engine.init();
        engineRef.current = engine;
        
        // Initialize with gentle rain
        await initSound('gentleRain');
      } catch (error) {
        console.error('Failed to initialize sound engine:', error);
        setError('Failed to initialize sound engine. Please try again.');
      }
    };

    initSoundEngine();

    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup();
      }
    };
  }, []);

  const initSound = async (soundId: SoundId) => {
    if (!engineRef.current) {
      console.error('Sound engine not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await engineRef.current.playSound(soundId, soundVolumes[soundId] || 1);
      setActiveSounds(prev => ({ ...prev, [soundId]: true }));
    } catch (error) {
      console.error('Failed to initialize sound:', error);
      setError('Failed to initialize sound. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoundToggle = async (soundId: SoundId) => {
    if (!engineRef.current) return;

    try {
      if (activeSounds[soundId]) {
        engineRef.current.stopSound(soundId);
        setActiveSounds(prev => ({ ...prev, [soundId]: false }));
      } else {
        await engineRef.current.playSound(soundId, soundVolumes[soundId] || 1);
        setActiveSounds(prev => ({ ...prev, [soundId]: true }));
      }
    } catch (error) {
      console.error('Failed to toggle sound:', error);
      setError('Failed to toggle sound. Please try again.');
    }
  };

  const handleVolumeChange = (soundId: SoundId, volume: number) => {
    if (!engineRef.current) return;

    try {
      engineRef.current.setVolume(soundId, volume);
      setSoundVolumes(prev => ({ ...prev, [soundId]: volume }));
      onVolumeChange?.(volume);
    } catch (error) {
      console.error('Failed to change volume:', error);
      setError('Failed to change volume. Please try again.');
    }
  };

  const handleMasterVolumeChange = (volume: number) => {
    if (!engineRef.current) return;

    try {
      engineRef.current.setMasterVolume(volume);
      setMasterVolume(volume);
      onMasterVolumeChange?.(volume);
    } catch (error) {
      console.error('Failed to change master volume:', error);
      setError('Failed to change master volume. Please try again.');
    }
  };

  // Group sounds by category
  const soundsByCategory = Object.values(SOUNDS).reduce((acc, sound) => {
    const category = sound.id.includes('Rain') ? 'Rain' :
                    sound.id.includes('water') || sound.id.includes('stream') || sound.id.includes('ocean') ? 'Water' :
                    sound.id.includes('bird') || sound.id.includes('forest') || sound.id.includes('jungle') || sound.id.includes('cicada') ? 'Nature' :
                    sound.id.includes('fire') ? 'Fire' : 'Other';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sound);
    return acc;
  }, {} as Record<string, typeof SOUNDS[keyof typeof SOUNDS][]>);

  // Filter sounds based on search term
  const filteredSoundsByCategory = Object.entries(soundsByCategory).reduce((acc, [category, sounds]) => {
    const filteredSounds = sounds.filter(sound => 
      sound.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredSounds.length > 0) {
      acc[category] = filteredSounds;
    }
    return acc;
  }, {} as Record<string, typeof SOUNDS[keyof typeof SOUNDS][]>);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out">
      <div className={`max-w-4xl mx-auto p-4 ${isExpanded ? 'h-[80vh]' : 'h-auto'}`}>
        {error && (
          <div className="bg-red-500 text-white p-2 rounded-lg mb-2 text-sm">
            {error}
          </div>
        )}
        
        {isLoading && (
          <div className="bg-black/50 text-white p-2 rounded-lg mb-2 text-sm">
            Loading sounds...
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Controls Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={onPlayPause}
              className="bg-black/50 text-white px-3 py-1 rounded"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            {/* Master Volume Control */}
            <div className="flex items-center gap-2">
              <span className="text-white text-sm min-w-[100px]">Master Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={masterVolume}
                onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
                className="w-32"
              />
            </div>

            {/* Rain Intensity Control */}
            <div className="flex items-center gap-2">
              <span className="text-white text-sm min-w-[100px]">Rain Intensity</span>
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

            {/* Rain Type Control */}
            <div className="flex items-center gap-2">
              <span className="text-white text-sm min-w-[100px]">Rain Type</span>
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

            {/* Lightning Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-white text-sm min-w-[100px]">Lightning</span>
              <button
                onClick={() => onLightningToggle(!showLightning)}
                className={`px-3 py-1 rounded ${
                  showLightning ? 'bg-yellow-500' : 'bg-black/50'
                } text-white`}
              >
                {showLightning ? 'On' : 'Off'}
              </button>
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white bg-black/50 px-3 py-1 rounded"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>

          {/* Sound Controls - Only visible when expanded */}
          {isExpanded && (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search sounds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/50 text-white rounded px-3 py-2"
              />

              {/* Sound Categories */}
              {Object.entries(filteredSoundsByCategory).map(([category, sounds]) => (
                <div key={category} className="flex flex-col gap-2">
                  <h3 className="text-white font-semibold">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {sounds.map((sound) => (
                      <div
                        key={sound.id}
                        className="flex items-center justify-between bg-black/50 p-2 rounded"
                      >
                        <span className="text-white text-sm">{sound.label}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={soundVolumes[sound.id] || 0}
                            onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                            className="w-24"
                          />
                          <button
                            onClick={() => handleSoundToggle(sound.id)}
                            className={`px-2 py-1 rounded ${
                              activeSounds[sound.id] ? 'bg-green-500' : 'bg-black/50'
                            } text-white`}
                          >
                            {activeSounds[sound.id] ? 'Stop' : 'Play'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoundManager; 