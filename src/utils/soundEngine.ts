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
      gentleRain: '/sounds/gentle-rain.mp3',
      heavyRain: '/sounds/heavy-rain.mp3',
      urbanRain: '/sounds/urban-rain.mp3',
      woodlandRain: '/sounds/woodland-rain.mp3',
      jungleRain: '/sounds/jungle-rain.mp3',
      coastalRain: '/sounds/coastal-rain.mp3',
      indoorRain: '/sounds/indoor-rain.mp3',
      overheadRain: '/sounds/overhead-rain.mp3',
      commuterRain: '/sounds/commuter-rain.mp3',
      urbanDrain: '/sounds/urban-drain.mp3',
      waves: '/sounds/waves.mp3',
      seafloor: '/sounds/seafloor.mp3',
      river: '/sounds/river.mp3',
      gulls: '/sounds/gulls.mp3',
      nocturnalBirds: '/sounds/nocturnal-birds.mp3',
      field: '/sounds/field.mp3'
    };

    const url = soundUrls[soundId];
    if (!url) {
      throw new Error(`Sound ${soundId} not found`);
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(soundId, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error(`Error loading sound ${soundId}:`, error);
      throw error;
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