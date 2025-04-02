import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SoundSettings, SavedPreset, RainType, WindType, ThunderType } from '../types/sound';

interface SoundStore {
  settings: SoundSettings;
  savedPresets: SavedPreset[];
  setRainType: (type: RainType | null) => void;
  setWindType: (type: WindType) => void;
  setThunderType: (type: ThunderType) => void;
  setVolume: (volume: number) => void;
  setMasterVolume: (volume: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
}

const defaultSettings: SoundSettings = {
  rainType: null,
  windType: 'light',
  thunderType: 'distant',
  volume: 0.5,
  isPlaying: false,
  masterVolume: 1,
  crossfadeDuration: 2000,
  minPhaseLength: 30000,
  maxPhaseLength: 60000,
  tempo: 1,
  bass: 0,
  mid: 0,
  treble: 0
};

export const useSoundStore = create<SoundStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      savedPresets: [],
      
      setRainType: (type) => 
        set((state) => ({ settings: { ...state.settings, rainType: type } })),
      
      setWindType: (type) => 
        set((state) => ({ settings: { ...state.settings, windType: type } })),
      
      setThunderType: (type) =>
        set((state) => ({ settings: { ...state.settings, thunderType: type } })),
      
      setVolume: (volume) =>
        set((state) => ({
          settings: { ...state.settings, volume: Math.max(0, Math.min(1, volume)) },
        })),
      
      setMasterVolume: (volume) =>
        set((state) => ({ settings: { ...state.settings, masterVolume: volume } })),
      
      setIsPlaying: (isPlaying) =>
        set((state) => ({ settings: { ...state.settings, isPlaying } })),
      
      savePreset: (name) =>
        set((state) => ({
          savedPresets: [
            ...state.savedPresets,
            {
              id: crypto.randomUUID(),
              name,
              settings: state.settings,
            },
          ],
        })),
      
      loadPreset: (id) =>
        set((state) => {
          const preset = state.savedPresets.find((p) => p.id === id);
          if (!preset) return state;
          return { settings: preset.settings };
        }),
      
      deletePreset: (id) =>
        set((state) => ({
          savedPresets: state.savedPresets.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'rainy-mood-storage',
    }
  )
); 