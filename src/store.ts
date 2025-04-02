import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Mood {
  name: string;
  preset: string;
  volume: number;
  tempo: number;
  timestamp: number;
}

interface MoodStore {
  moods: Mood[];
  saveMood: (mood: Omit<Mood, 'timestamp'>) => void;
  loadMood: (name: string) => Mood | null;
}

export const useStore = create<MoodStore>()(
  persist(
    (set, get) => ({
      moods: [],
      saveMood: (mood) => {
        set((state) => ({
          moods: [
            ...state.moods,
            {
              ...mood,
              timestamp: Date.now(),
            },
          ],
        }));
      },
      loadMood: (name) => {
        const state = get();
        return state.moods.find((mood) => mood.name === name) || null;
      },
    }),
    {
      name: 'rainymood-storage',
    }
  )
); 