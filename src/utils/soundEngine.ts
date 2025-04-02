import { SOUNDS, SoundId } from '../types/sound';

export interface SoundInstance {
  source: AudioBufferSourceNode;
  gain: GainNode;
  isPlaying: boolean;
}

export class RainSoundEngine {
  private context: AudioContext | null = null;
  private activeSounds: Map<SoundId, SoundInstance> = new Map();
  private preloadedBuffers: Map<SoundId, AudioBuffer> = new Map();
  private masterGain: GainNode | null = null;
  private isInitialized = false;

  constructor() {
    this.init = this.init.bind(this);
    this.loadSound = this.loadSound.bind(this);
    this.playSound = this.playSound.bind(this);
    this.stopSound = this.stopSound.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.setMasterVolume = this.setMasterVolume.bind(this);
    this.cleanup = this.cleanup.bind(this);
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Don't create AudioContext here - wait for playSound
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize:', error);
      throw error;
    }
  }

  private async ensureContext(): Promise<void> {
    if (!this.context) {
      this.context = new AudioContext();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      
      // Resume context if it's suspended (needed for Safari)
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }
    }
  }

  async loadSound(soundId: SoundId): Promise<AudioBuffer> {
    await this.ensureContext();

    if (!this.context) {
      throw new Error('AudioContext not initialized');
    }

    try {
      // Check if already preloaded
      if (this.preloadedBuffers.has(soundId)) {
        return this.preloadedBuffers.get(soundId)!;
      }

      const sound = SOUNDS[soundId];
      const response = await fetch(sound.path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.preloadedBuffers.set(soundId, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error('Failed to load sound:', error);
      throw error;
    }
  }

  async preloadSound(soundId: SoundId) {
    if (!this.isInitialized) {
      await this.init();
    }

    if (this.preloadedBuffers.has(soundId)) {
      return;
    }

    try {
      await this.loadSound(soundId);
    } catch (error) {
      console.error(`Failed to preload sound ${soundId}:`, error);
    }
  }

  async playSound(soundId: SoundId, volume: number = 1, loop: boolean = true): Promise<void> {
    try {
      await this.ensureContext();
      
      // Get or load the audio buffer
      let buffer = this.preloadedBuffers.get(soundId);
      if (!buffer) {
        buffer = await this.loadSound(soundId);
      }
      
      // Create source and gain nodes
      const source = this.context!.createBufferSource();
      const gain = this.context!.createGain();
      
      // Set buffer and loop
      source.buffer = buffer;
      source.loop = loop;
      
      // Connect nodes
      source.connect(gain);
      gain.connect(this.context!.destination);
      
      // Set volume
      gain.gain.value = volume;
      
      // Start playback
      source.start(0);
      
      // Store instance
      this.activeSounds.set(soundId, { source, gain, isPlaying: true });
      
      console.log(`Playing sound: ${soundId}`);
    } catch (error) {
      console.error(`Failed to play sound ${soundId}:`, error);
      throw error;
    }
  }

  stopSound(soundId: SoundId): void {
    const instance = this.activeSounds.get(soundId);
    if (instance) {
      try {
        instance.source.stop();
        instance.gain.disconnect();
        this.activeSounds.delete(soundId);
        console.log(`Stopped sound: ${soundId}`);
      } catch (error) {
        console.error(`Error stopping sound ${soundId}:`, error);
      }
    }
  }

  setVolume(soundId: SoundId, volume: number): void {
    const instance = this.activeSounds.get(soundId);
    if (instance) {
      instance.gain.gain.value = volume;
    }
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
  }

  isSoundPlaying(soundId: SoundId): boolean {
    return this.activeSounds.has(soundId) && this.activeSounds.get(soundId)!.isPlaying;
  }

  cleanup() {
    // Stop all playing sounds
    for (const [soundId] of this.activeSounds) {
      this.stopSound(soundId);
    }
    
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    
    this.preloadedBuffers.clear();
    this.activeSounds.clear();
    this.isInitialized = false;
  }
} 