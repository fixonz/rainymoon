import { SoundInstance } from '../types/sound';

export class RainSoundEngine {
  private context: AudioContext | null = null;
  private sounds: Map<string, SoundInstance> = new Map();
  private audioBuffers: Map<string, AudioBuffer> = new Map();

  private async ensureContext() {
    if (!this.context) {
      this.context = new AudioContext();
    }
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
    return this.context;
  }

  private async loadSound(soundId: string): Promise<AudioBuffer> {
    const context = await this.ensureContext();
    
    if (this.audioBuffers.has(soundId)) {
      return this.audioBuffers.get(soundId)!;
    }

    const soundUrls: Record<string, string> = {
      // Default gentle sounds
      gentleRain: '/sounds/newSounds/32 - Descending Drizzles.flac',
      distantRain: '/sounds/newSounds/20 - Woodland Drizzle.flac',
      
      // Rain variations
      heavyRain: '/sounds/newSounds/04 - Cascading Showers.flac',
      urbanRain: '/sounds/newSounds/22 - Urban Rainfall Serenade.flac',
      woodlandRain: '/sounds/newSounds/08 - Leafy Woodland Drizzles.flac',
      jungleRain: '/sounds/newSounds/09 - Jungle Precipitation.flac',
      coastalRain: '/sounds/newSounds/16 - Coastal Showers.flac',
      indoorRain: '/sounds/newSounds/18 - Indoor Droplets.flac',
      overheadRain: '/sounds/newSounds/47 - Overhead Rainfall.flac',
      commuterRain: '/sounds/newSounds/49 - Commuter Rain.flac',

      // Ambient sounds
      urbanDrain: '/sounds/newSounds/46 - Urban Drain Serenade.flac',
      waves: '/sounds/newSounds/34 - Distant Mighty Waves.flac',
      seafloor: '/sounds/newSounds/35 - Tranquil Seafloor.flac',
      river: '/sounds/newSounds/40 - Nearby River Flow.flac',
      gulls: '/sounds/newSounds/15 - Overhead Wave Gulls.flac',
      nocturnalBirds: '/sounds/newSounds/50 - Nocturnal Avian Chorus.flac',
      field: '/sounds/newSounds/05 - Open Field.flac'
    };

    const url = soundUrls[soundId];
    if (!url) {
      throw new Error(`Sound ${soundId} not found`);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(soundId, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error(`Error loading sound ${soundId}:`, error);
      // Fallback to RainyMood.mp3 if other sounds fail
      try {
        const fallbackResponse = await fetch('/sounds/RainyMood.mp3');
        const fallbackBuffer = await fallbackResponse.arrayBuffer();
        const fallbackAudio = await context.decodeAudioData(fallbackBuffer);
        this.audioBuffers.set(soundId, fallbackAudio);
        return fallbackAudio;
      } catch (fallbackError) {
        console.error('Even fallback sound failed:', fallbackError);
        throw error;
      }
    }
  }

  async init() {
    // Initialize context when needed instead of here
  }

  async playSound(soundId: string, volume = 1, loop = false): Promise<void> {
    const context = await this.ensureContext();
    
    try {
      // Stop the sound if it's already playing
      if (this.sounds.has(soundId)) {
        await this.stopSound(soundId);
      }

      const audioBuffer = await this.loadSound(soundId);
      const source = context.createBufferSource();
      const gainNode = context.createGain();

      source.buffer = audioBuffer;
      source.loop = loop;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(context.destination);
      source.start(0);

      this.sounds.set(soundId, {
        source,
        gainNode,
        isPlaying: true
      });
    } catch (error) {
      console.error(`Error playing sound ${soundId}:`, error);
      throw error;
    }
  }

  async stopSound(soundId: string): Promise<void> {
    const sound = this.sounds.get(soundId);
    if (sound && sound.isPlaying) {
      sound.source.stop();
      sound.isPlaying = false;
      this.sounds.delete(soundId);
    }
  }

  async setVolume(soundId: string, volume: number): Promise<void> {
    const sound = this.sounds.get(soundId);
    if (sound) {
      sound.gainNode.gain.value = volume;
    }
  }

  cleanup() {
    Array.from(this.sounds.keys()).forEach(soundId => {
      this.stopSound(soundId);
    });
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    this.sounds.clear();
    this.audioBuffers.clear();
  }
} 