interface LoopPoint {
  start: number;
  end: number;
  crossfadeStart: number;
  crossfadeEnd: number;
}

export class SoundAnalyzer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private static readonly MIN_LOOP_DURATION = 10; // Minimum 10 seconds loop
  private static readonly CROSSFADE_DURATION = 2; // 2 seconds crossfade

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
  }

  public static async analyzeAudioBuffer(buffer: AudioBuffer): Promise<LoopPoint> {
    const channelData = buffer.getChannelData(0); // Use first channel for analysis
    const sampleRate = buffer.sampleRate;
    const totalSamples = buffer.length;

    // Find sections with similar amplitude patterns
    const windowSize = Math.floor(sampleRate * 5); // 5-second window
    const stepSize = Math.floor(sampleRate * 1); // 1-second step
    let bestLoopPoint: LoopPoint | null = null;
    let bestSimilarity = 0;

    // Skip the first and last 2 seconds
    const startOffset = Math.floor(sampleRate * 2);
    const endOffset = Math.floor(sampleRate * 2);

    for (let i = startOffset; i < totalSamples - windowSize - endOffset; i += stepSize) {
      const window1 = channelData.slice(i, i + windowSize);
      
      // Look for similar patterns later in the file
      for (let j = i + windowSize; j < totalSamples - windowSize - endOffset; j += stepSize) {
        const window2 = channelData.slice(j, j + windowSize);
        const similarity = this.calculateSimilarity(window1, window2);

        // Check if this is a better loop point
        if (similarity > bestSimilarity && 
            (j - i) / sampleRate >= this.MIN_LOOP_DURATION) {
          bestSimilarity = similarity;
          bestLoopPoint = {
            start: i / sampleRate,
            end: j / sampleRate,
            crossfadeStart: (i / sampleRate) - this.CROSSFADE_DURATION,
            crossfadeEnd: (j / sampleRate) + this.CROSSFADE_DURATION
          };
        }
      }
    }

    // If no good loop point found, use a reasonable portion of the file
    if (!bestLoopPoint) {
      const duration = buffer.duration;
      const loopStart = Math.min(duration * 0.2, 5); // Start at 20% or 5 seconds
      const loopEnd = Math.max(duration * 0.8, duration - 5); // End at 80% or 5 seconds from end

      bestLoopPoint = {
        start: loopStart,
        end: loopEnd,
        crossfadeStart: Math.max(0, loopStart - this.CROSSFADE_DURATION),
        crossfadeEnd: Math.min(duration, loopEnd + this.CROSSFADE_DURATION)
      };
    }

    return bestLoopPoint;
  }

  private static calculateSimilarity(window1: Float32Array, window2: Float32Array): number {
    // Calculate RMS (Root Mean Square) for both windows
    const rms1 = this.calculateRMS(window1);
    const rms2 = this.calculateRMS(window2);

    // Compare RMS values
    const rmsDiff = Math.abs(rms1 - rms2);
    
    // Calculate waveform correlation
    const correlation = this.calculateCorrelation(window1, window2);

    // Combine RMS similarity and correlation
    const rmsSimilarity = 1 - (rmsDiff / Math.max(rms1, rms2));
    return (rmsSimilarity + correlation) / 2;
  }

  private static calculateRMS(samples: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < samples.length; i++) {
      sum += samples[i] * samples[i];
    }
    return Math.sqrt(sum / samples.length);
  }

  private static calculateCorrelation(window1: Float32Array, window2: Float32Array): number {
    let sum = 0;
    const len = Math.min(window1.length, window2.length);
    
    for (let i = 0; i < len; i++) {
      sum += window1[i] * window2[i];
    }

    return sum / len;
  }
} 