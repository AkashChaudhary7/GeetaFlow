/**
 * Audio Engine for GeetaFlow
 * - Authentic natural human voice Sanskrit verse recitation (Vedic chanting)
 * - Built-in ambient Vedic Tanpura drone synthesizer using Web Audio API
 * - Real-time playback progress, seek, duration, and state observation
 */

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentShlokaId: string | null;
  chapter: number | null;
  verse: number | null;
  currentTime: number;
  duration: number;
  progressPercent: number;
  isNaturalVoice: boolean;
  isLoading: boolean;
}

type StateListener = (state: AudioPlaybackState) => void;

class AudioEngine {
  private naturalAudio: HTMLAudioElement | null = null;
  private currentShlokaKey: string | null = null;
  private currentChapter: number | null = null;
  private currentVerse: number | null = null;
  private isNaturalPlaying: boolean = false;
  private isLoadingAudio: boolean = false;
  private stateListeners: Set<StateListener> = new Set();
  private onEndCallback: (() => void) | null = null;

  // Legacy Web Speech synth (as secondary fallback only)
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeechSpeaking: boolean = false;
  private onStateChangeCallback: ((isPlaying: boolean) => void) | null = null;

  // Web Audio Context for Tanpura drone
  private audioCtx: AudioContext | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private droneGain: GainNode | null = null;
  private isDronePlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
    }
  }

  // --- Natural Audio Playback Engine ---

  /**
   * Generates primary CDN URL for authentic natural human chanting of Bhagavad Gita verses
   */
  public getNaturalAudioUrl(chapter: number, verse: number): string {
    return `https://cdn.jsdelivr.net/gh/nikhilsi/gitavani@main/ios/GitaVani/GitaVani/Resources/audio/BG${chapter}.${verse}.mp3`;
  }

  /**
   * Generates secondary fallback URL
   */
  public getFallbackAudioUrl(chapter: number, verse: number): string {
    return `https://raw.githubusercontent.com/nikhilsi/gitavani@main/ios/GitaVani/GitaVani/Resources/audio/BG${chapter}.${verse}.mp3`;
  }

  /**
   * Play authentic natural human voice recitation for a given shloka
   */
  public playNaturalShloka(
    chapter: number, 
    verse: number, 
    onEnd?: () => void,
    onError?: () => void
  ): boolean {
    if (typeof window === 'undefined') return false;

    // Stop any existing speech or audio
    this.stop();

    const shlokaKey = `bg_${chapter}_${verse}`;
    this.currentShlokaKey = shlokaKey;
    this.currentChapter = chapter;
    this.currentVerse = verse;
    this.onEndCallback = onEnd || null;
    this.isLoadingAudio = true;
    this.notifyState();

    const primaryUrl = this.getNaturalAudioUrl(chapter, verse);
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';

    let hasTriedFallback = false;

    audio.addEventListener('loadstart', () => {
      this.isLoadingAudio = true;
      this.notifyState();
    });

    audio.addEventListener('canplay', () => {
      this.isLoadingAudio = false;
      this.notifyState();
    });

    audio.addEventListener('play', () => {
      this.isNaturalPlaying = true;
      this.isLoadingAudio = false;
      this.notifyState();
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);
    });

    audio.addEventListener('timeupdate', () => {
      this.notifyState();
    });

    audio.addEventListener('ended', () => {
      this.isNaturalPlaying = false;
      this.isLoadingAudio = false;
      this.notifyState();
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    });

    audio.addEventListener('error', (e) => {
      console.warn(`Primary audio CDN failed for Chapter ${chapter} Verse ${verse}, trying fallback...`, e);
      if (!hasTriedFallback) {
        hasTriedFallback = true;
        audio.src = this.getFallbackAudioUrl(chapter, verse);
        audio.load();
        audio.play().catch(fallbackErr => {
          console.warn('Fallback audio failed as well:', fallbackErr);
          this.isLoadingAudio = false;
          this.isNaturalPlaying = false;
          this.notifyState();
          if (onError) onError();
        });
      } else {
        this.isLoadingAudio = false;
        this.isNaturalPlaying = false;
        this.notifyState();
        if (onError) onError();
      }
    });

    audio.src = primaryUrl;
    this.naturalAudio = audio;

    audio.play().catch(err => {
      console.warn('Failed to start audio playback:', err);
      this.isLoadingAudio = false;
      this.notifyState();
      if (onError) onError();
    });

    // Preload next verse audio silently for instantaneous transition
    this.preloadNextVerse(chapter, verse + 1);

    return true;
  }

  /**
   * Preloads the next verse audio in the background
   */
  private preloadNextVerse(chapter: number, nextVerse: number) {
    if (typeof window === 'undefined') return;
    try {
      const preloadUrl = this.getNaturalAudioUrl(chapter, nextVerse);
      const preloader = new Audio();
      preloader.onerror = () => {};
      preloader.preload = 'metadata';
      preloader.src = preloadUrl;
    } catch {
      // Ignore preloading errors
    }
  }

  /**
   * Helper to play shloka by object or coordinates
   */
  public playShloka(
    shloka: { chapter: number; verse: number; id?: string; sanskrit?: string },
    onEnd?: () => void,
    onError?: () => void
  ): boolean {
    if (shloka.chapter && shloka.verse && shloka.chapter >= 1 && shloka.chapter <= 18 && shloka.verse <= 78) {
      return this.playNaturalShloka(shloka.chapter, shloka.verse, onEnd, onError);
    }

    // For any non-Gita subhashitas without direct MP3s, provide graceful recitation
    return this.speak(shloka.sanskrit || '', 'sa', onEnd);
  }

  /**
   * Pause natural voice playback
   */
  public pause() {
    if (this.naturalAudio && !this.naturalAudio.paused) {
      this.naturalAudio.pause();
      this.isNaturalPlaying = false;
      this.notifyState();
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    }
  }

  /**
   * Resume natural voice playback
   */
  public resume() {
    if (this.naturalAudio && this.naturalAudio.paused) {
      this.naturalAudio.play().then(() => {
        this.isNaturalPlaying = true;
        this.notifyState();
        if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      }).catch(console.warn);
    }
  }

  /**
   * Stop all audio (natural voice recitation & speech synthesis)
   */
  public stop() {
    // 1. Stop natural audio
    if (this.naturalAudio) {
      try {
        this.naturalAudio.pause();
        this.naturalAudio.currentTime = 0;
        this.naturalAudio.src = '';
      } catch {}
      this.naturalAudio = null;
    }
    this.isNaturalPlaying = false;
    this.isLoadingAudio = false;
    this.currentShlokaKey = null;
    this.currentChapter = null;
    this.currentVerse = null;

    // 2. Stop speech synth if any
    this.stopSpeech();

    this.notifyState();
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
  }

  /**
   * Seek natural audio to specific time in seconds
   */
  public seek(seconds: number) {
    if (this.naturalAudio && isFinite(seconds)) {
      this.naturalAudio.currentTime = Math.max(0, Math.min(seconds, this.naturalAudio.duration || 0));
      this.notifyState();
    }
  }

  /**
   * Check if any voice playback is currently active
   */
  public isPlaying(): boolean {
    return this.isNaturalPlaying || this.isSpeechSpeaking;
  }

  public isNaturalActive(): boolean {
    return this.isNaturalPlaying;
  }

  public getCurrentShlokaKey(): string | null {
    return this.currentShlokaKey;
  }

  public getPlaybackState(): AudioPlaybackState {
    const currentTime = this.naturalAudio ? this.naturalAudio.currentTime : 0;
    const duration = this.naturalAudio && isFinite(this.naturalAudio.duration) ? this.naturalAudio.duration : 0;
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return {
      isPlaying: this.isNaturalPlaying || this.isSpeechSpeaking,
      currentShlokaId: this.currentShlokaKey,
      chapter: this.currentChapter,
      verse: this.currentVerse,
      currentTime,
      duration,
      progressPercent,
      isNaturalVoice: this.isNaturalPlaying,
      isLoading: this.isLoadingAudio
    };
  }

  public addStateListener(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.getPlaybackState());
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private notifyState() {
    const state = this.getPlaybackState();
    this.stateListeners.forEach(listener => {
      try {
        listener(state);
      } catch (err) {
        console.error('AudioEngine state listener error:', err);
      }
    });
  }

  public setOnStateChange(cb: (isPlaying: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  // --- Fallback Speech Synthesis (Only used if no natural recording exists) ---

  public speak(text: string, lang: 'hi' | 'sa' | 'en' = 'hi', onEnd?: () => void): boolean {
    if (!this.synth) return false;

    this.stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = this.synth.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('sa') || v.name.includes('Hindi') || v.name.includes('India'));
    
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
    utterance.rate = lang === 'sa' ? 0.82 : 0.90;
    utterance.pitch = 0.95;

    utterance.onstart = () => {
      this.isSpeechSpeaking = true;
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      this.notifyState();
    };

    utterance.onend = () => {
      this.isSpeechSpeaking = false;
      this.currentUtterance = null;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      this.notifyState();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeechSpeaking = false;
      this.currentUtterance = null;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      this.notifyState();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  public stopSpeech() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeechSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public isSpeechActive(): boolean {
    return this.isSpeechSpeaking;
  }

  // --- Web Audio Tanpura Synth ---
  public startAmbientDrone(volume: number = 0.15) {
    try {
      if (this.isDronePlaying) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      // Root base frequency: D3 (~146.83 Hz) with Pa (A3, ~220 Hz)
      const baseFreq = 146.83;
      const fifthFreq = 220.00;
      const octaveFreq = 293.66;

      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(volume * 0.4, this.audioCtx.currentTime + 2.5);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(3, this.audioCtx.currentTime);

      masterGain.connect(filter);
      filter.connect(this.audioCtx.destination);
      this.droneGain = masterGain;

      const freqs = [baseFreq, baseFreq * 1.002, fifthFreq, octaveFreq];
      this.droneOscillators = [];

      freqs.forEach((f, idx) => {
        const osc = this.audioCtx!.createOscillator();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(f, this.audioCtx!.currentTime);

        const lfo = this.audioCtx!.createOscillator();
        const lfoGain = this.audioCtx!.createGain();
        lfo.frequency.setValueAtTime(0.12 + idx * 0.04, this.audioCtx!.currentTime);
        lfoGain.gain.setValueAtTime(0.3, this.audioCtx!.currentTime);
        lfo.connect(lfoGain.gain);

        const oscGain = this.audioCtx!.createGain();
        oscGain.gain.setValueAtTime(0.2, this.audioCtx!.currentTime);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
        lfo.start();
        this.droneOscillators.push(osc);
      });

      this.isDronePlaying = true;
    } catch (e) {
      console.warn('Ambient drone audio init error:', e);
    }
  }

  public stopAmbientDrone() {
    try {
      if (!this.isDronePlaying || !this.droneGain || !this.audioCtx) return;

      this.droneGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);
      setTimeout(() => {
        this.droneOscillators.forEach(osc => {
          try { osc.stop(); } catch {}
        });
        this.droneOscillators = [];
        this.isDronePlaying = false;
      }, 1300);
    } catch (e) {
      this.isDronePlaying = false;
    }
  }

  public startAmbient(volume?: number) {
    this.startAmbientDrone(volume);
  }

  public stopAmbient() {
    this.stopAmbientDrone();
  }

  public setDroneVolume(volume: number) {
    if (this.droneGain && this.audioCtx && this.isDronePlaying) {
      this.droneGain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume * 0.4)), this.audioCtx.currentTime + 0.3);
    }
  }

  public isDroneActive(): boolean {
    return this.isDronePlaying;
  }
}

export const audioEngine = new AudioEngine();

