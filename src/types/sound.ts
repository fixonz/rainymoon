export interface RainPhase {
  start: string[];
  middle: string[];
  end: string[];
  transition: string[];
}

export type RainIntensity = 'light' | 'medium' | 'heavy';

export type RainType = 'gentle' | 'moderate' | 'heavy' | 'storm' | 'tropical' | 'monsoon' | 'drizzle';

export interface RainTypeConfig {
  name: string;
  description: string;
  intensities: Record<RainIntensity, RainPhase>;
}

export interface SoundSettings {
  isPlaying: boolean;
  rainType: RainType | null;
  windType: WindType;
  thunderType: ThunderType;
  volume: number;
  masterVolume: number;
  crossfadeDuration: number;
  minPhaseLength: number;
  maxPhaseLength: number;
  tempo: number;
  bass: number;
  mid: number;
  treble: number;
}

export type Environment = 'forest' | 'city' | 'tropical' | 'ocean' | 'mountain' | 'night';
export type MoonPhase = 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';

export interface RainSound {
  name: string;
  file: string;
  duration: number;
  intensity: RainIntensity;
  environment: Environment;
  ambientSounds?: {
    birds?: string;
    thunder?: {
      file: string;
      intensity: 'weak' | 'strong';
      frequency: number; // seconds between thunder sounds
    };
    wind?: string;
  };
}

export interface SavedPreset {
  id: string;
  name: string;
  settings: SoundSettings;
}

export interface UserPreferences {
  savedPresets: SavedPreset[];
}

export interface SoundPreset {
  name: string;
  rainSound: string;
  settings: SoundSettings;
}

export const RAIN_TYPES: RainTypeConfig[] = [
  {
    name: 'Heavy Rain',
    description: 'Intense rain with thunder',
    intensities: {
      light: {
        start: ['/sounds/newSounds/28 - Playful Raindrops.flac'],
        middle: ['/sounds/newSounds/04 - Cascading Showers.flac'],
        end: ['/sounds/newSounds/17 - Urban Sidewalk Showers.flac'],
        transition: ['/sounds/newSounds/20 - Woodland Drizzle.flac']
      },
      medium: {
        start: ['/sounds/newSounds/04 - Cascading Showers.flac'],
        middle: ['/sounds/newSounds/17 - Urban Sidewalk Showers.flac'],
        end: ['/sounds/newSounds/20 - Woodland Drizzle.flac'],
        transition: ['/sounds/newSounds/09 - Jungle Precipitation.flac']
      },
      heavy: {
        start: ['/sounds/newSounds/16 - Coastal Showers.flac'],
        middle: ['/sounds/newSounds/18 - Indoor Droplets.flac'],
        end: ['/sounds/newSounds/46 - Urban Drain Serenade.flac'],
        transition: ['/sounds/newSounds/47 - Overhead Rainfall.flac']
      }
    }
  },
  {
    name: 'Thunderstorm',
    description: 'Heavy rain with intense thunder',
    intensities: {
      light: {
        start: ['/sounds/newSounds/14 - Thunderous Wave Crash.flac'],
        middle: ['/sounds/newSounds/35 - Tranquil Seafloor.flac'],
        end: ['/sounds/newSounds/24 - Waterway Confluence.flac'],
        transition: ['/sounds/newSounds/40 - Nearby River Flow.flac']
      },
      medium: {
        start: ['/sounds/newSounds/14 - Thunderous Wave Crash.flac'],
        middle: ['/sounds/newSounds/35 - Tranquil Seafloor.flac'],
        end: ['/sounds/newSounds/24 - Waterway Confluence.flac'],
        transition: ['/sounds/newSounds/40 - Nearby River Flow.flac']
      },
      heavy: {
        start: ['/sounds/newSounds/14 - Thunderous Wave Crash.flac'],
        middle: ['/sounds/newSounds/35 - Tranquil Seafloor.flac'],
        end: ['/sounds/newSounds/24 - Waterway Confluence.flac'],
        transition: ['/sounds/newSounds/40 - Nearby River Flow.flac']
      }
    }
  }
];

export const SOUND_PRESETS: Record<string, SoundSettings> = {
  gentle: {
    volume: 0.5,
    masterVolume: 1,
    isPlaying: false,
    rainType: 'gentle' as RainType,
    windType: 'light',
    thunderType: 'distant',
    crossfadeDuration: 2000,
    minPhaseLength: 30000,
    maxPhaseLength: 60000,
    tempo: 1,
    bass: 0,
    mid: 0,
    treble: 0
  },
  moderate: {
    volume: 0.7,
    masterVolume: 1,
    isPlaying: false,
    rainType: 'moderate' as RainType,
    windType: 'moderate',
    thunderType: 'storm',
    crossfadeDuration: 2000,
    minPhaseLength: 30000,
    maxPhaseLength: 60000,
    tempo: 1,
    bass: 0,
    mid: 0,
    treble: 0
  },
  heavy: {
    volume: 0.8,
    masterVolume: 1,
    isPlaying: false,
    rainType: 'heavy' as RainType,
    windType: 'strong',
    thunderType: 'close',
    crossfadeDuration: 2000,
    minPhaseLength: 30000,
    maxPhaseLength: 60000,
    tempo: 1,
    bass: 0,
    mid: 0,
    treble: 0
  },
  storm: {
    volume: 0.9,
    masterVolume: 1,
    isPlaying: false,
    rainType: 'storm' as RainType,
    windType: 'light',
    thunderType: 'distant',
    crossfadeDuration: 2000,
    minPhaseLength: 30000,
    maxPhaseLength: 60000,
    tempo: 1,
    bass: 0,
    mid: 0,
    treble: 0
  },
  tropical: {
    volume: 0.7,
    masterVolume: 1,
    isPlaying: false,
    rainType: 'tropical' as RainType,
    windType: 'light',
    thunderType: 'distant',
    crossfadeDuration: 2000,
    minPhaseLength: 30000,
    maxPhaseLength: 60000,
    tempo: 1,
    bass: 0,
    mid: 0,
    treble: 0
  },
  monsoon: {
    volume: 0.8,
    masterVolume: 1,
    isPlaying: false,
    rainType: 'monsoon' as RainType,
    windType: 'moderate',
    thunderType: 'distant',
    crossfadeDuration: 2000,
    minPhaseLength: 30000,
    maxPhaseLength: 60000,
    tempo: 1,
    bass: 0,
    mid: 0,
    treble: 0
  },
  drizzle: {
    volume: 0.4,
    masterVolume: 1,
    isPlaying: false,
    rainType: 'drizzle' as RainType,
    windType: 'light',
    thunderType: 'distant',
    crossfadeDuration: 2000,
    minPhaseLength: 30000,
    maxPhaseLength: 60000,
    tempo: 1,
    bass: 0,
    mid: 0,
    treble: 0
  }
};

export const RAIN_SOUNDS: RainSound[] = [
  // We'll dynamically load these from a JSON file
  // This way we can keep the large sound files separate
];

export interface MoonSettings {
  position: {
    x: number;
    y: number;
  };
  size: number;
  glow: number;
  color: string;
  phase: MoonPhase;
  showCraters: boolean;
}

export interface RainSoundEngine {
  init(): Promise<void>;
  playSound(soundId: string, volume: number, loop: boolean): Promise<void>;
  stopSound(soundId: string): void;
  setVolume(soundId: string, volume: number): void;
  setMasterVolume(volume: number): void;
  cleanup(): void;
}

export interface Sound {
  id: string;
  label: string;
  file: string;
}

export const SOUNDS = {
  // Rain Sounds
  gentleRain: {
    id: 'gentleRain',
    label: 'Gentle Rain',
    path: '/sounds/newSounds/28 - Playful Raindrops.flac'
  },
  heavyRain: {
    id: 'heavyRain',
    label: 'Heavy Rain',
    path: '/sounds/newSounds/04 - Cascading Showers.flac'
  },
  urbanRain: {
    id: 'urbanRain',
    label: 'Urban Rain',
    path: '/sounds/newSounds/17 - Urban Sidewalk Showers.flac'
  },
  woodlandRain: {
    id: 'woodlandRain',
    label: 'Woodland Rain',
    path: '/sounds/newSounds/20 - Woodland Drizzle.flac'
  },
  jungleRain: {
    id: 'jungleRain',
    label: 'Jungle Rain',
    path: '/sounds/newSounds/09 - Jungle Precipitation.flac'
  },
  coastalRain: {
    id: 'coastalRain',
    label: 'Coastal Rain',
    path: '/sounds/newSounds/16 - Coastal Showers.flac'
  },
  indoorRain: {
    id: 'indoorRain',
    label: 'Indoor Rain',
    path: '/sounds/newSounds/18 - Indoor Droplets.flac'
  },
  urbanDrain: {
    id: 'urbanDrain',
    label: 'Urban Drain',
    path: '/sounds/newSounds/46 - Urban Drain Serenade.flac'
  },
  overheadRain: {
    id: 'overheadRain',
    label: 'Overhead Rain',
    path: '/sounds/newSounds/47 - Overhead Rainfall.flac'
  },
  commuterRain: {
    id: 'commuterRain',
    label: 'Commuter Rain',
    path: '/sounds/newSounds/49 - Commuter Rain.flac'
  },
  
  // Water Sounds
  stream: {
    id: 'stream',
    label: 'Stream',
    path: '/sounds/newSounds/42 - Nearby Swift Stream.flac'
  },
  waterfall: {
    id: 'waterfall',
    label: 'Waterfall',
    path: '/sounds/newSounds/29 - Waterfall Noise.flac'
  },
  ocean: {
    id: 'ocean',
    label: 'Ocean',
    path: '/sounds/newSounds/48 - Calm Seascapes.flac'
  },
  waves: {
    id: 'waves',
    label: 'Waves',
    path: '/sounds/newSounds/14 - Thunderous Wave Crash.flac'
  },
  seafloor: {
    id: 'seafloor',
    label: 'Seafloor',
    path: '/sounds/newSounds/35 - Tranquil Seafloor.flac'
  },
  waterway: {
    id: 'waterway',
    label: 'Waterway',
    path: '/sounds/newSounds/24 - Waterway Confluence.flac'
  },
  river: {
    id: 'river',
    label: 'River',
    path: '/sounds/newSounds/40 - Nearby River Flow.flac'
  },
  
  // Nature Sounds
  birds: {
    id: 'birds',
    label: 'Birds',
    path: '/sounds/newSounds/10 - Morning Avian Life.flac'
  },
  forest: {
    id: 'forest',
    label: 'Forest',
    path: '/sounds/newSounds/25 - Serene Woodland Mornings.flac'
  },
  jungle: {
    id: 'jungle',
    label: 'Jungle',
    path: '/sounds/newSounds/09 - Jungle Precipitation.flac'
  },
  cicadas: {
    id: 'cicadas',
    label: 'Cicadas',
    path: '/sounds/newSounds/33 - Woodland Cicada Whispers.flac'
  },
  gulls: {
    id: 'gulls',
    label: 'Gulls',
    path: '/sounds/newSounds/15 - Overhead Wave Gulls.flac'
  },
  nocturnalBirds: {
    id: 'nocturnalBirds',
    label: 'Nocturnal Birds',
    path: '/sounds/newSounds/50 - Nocturnal Avian Chorus.flac'
  },
  field: {
    id: 'field',
    label: 'Field',
    path: '/sounds/newSounds/05 - Open Field.flac'
  },
  rainforest: {
    id: 'rainforest',
    label: 'Rainforest',
    path: '/sounds/newSounds/13 - Windy Rainforest Atmosphere.flac'
  },
  
  // Fire Sounds
  fire: {
    id: 'fire',
    label: 'Fire',
    path: '/sounds/newSounds/19 - Crackle and Flame.flac'
  },
  campfire: {
    id: 'campfire',
    label: 'Campfire',
    path: '/sounds/newSounds/43 - Blaze Ignition.flac'
  }
} as const;

export type SoundId = keyof typeof SOUNDS;

export type WindType = 'light' | 'moderate' | 'strong';
export type ThunderType = 'distant' | 'close' | 'storm';

export interface SoundInstance {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  isPlaying: boolean;
} 