export class AudioStreamer {
  private url: string;
  private audioContext: AudioContext;
  private bufferSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode;
  private isPlaying = false;
  private buffer: AudioBuffer | null = null;

  constructor(url: string) {
    this.url = url;
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  public async play(): Promise<void> {
    if (this.isPlaying) return;

    try {
      // Load audio file
      const response = await fetch(this.url);
      const arrayBuffer = await response.arrayBuffer();

      // Decode and play
      this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.bufferSource = this.audioContext.createBufferSource();
      this.bufferSource.buffer = this.buffer;
      
      this.bufferSource.connect(this.gainNode);
      
      this.bufferSource.start(0);
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.5);
      
      this.isPlaying = true;
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  public stop(): void {
    if (!this.isPlaying || !this.bufferSource) return;

    this.gainNode.gain.setValueAtTime(1, this.audioContext.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);

    setTimeout(() => {
      if (this.bufferSource) {
        this.bufferSource.stop();
        this.bufferSource.disconnect();
        this.bufferSource = null;
      }
      this.isPlaying = false;
    }, 500);
  }

  public setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  public cleanup(): void {
    this.stop();
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
} 