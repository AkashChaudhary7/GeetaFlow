import { AmbientAtmosphereType } from '../types';

/**
 * Low-Fidelity Meditative Ambient Atmosphere Engine
 * Synthesizes organic, seamless background loops using the Web Audio API:
 * - Temple Bells: Resonant singing bowls, harmonic chimes & warm sanctum resonance
 * - Sacred River: Flowing Himalayan mountain stream, water eddies & gentle ripples
 * - Forest Breeze: Soothing wind rustling through sacred peepal leaves & bamboo chimes
 * - Vedic Tanpura: Sacred 4-string acoustic drone tuned to Sa-Pa with rich overtones
 * 
 * Features:
 * - 100% offline & client-side (no network drops, zero external CDN dependencies)
 * - Automatic audio ducking during spoken verse recitation
 * - Smooth exponential fade-ins and fade-outs (no clicks or pops)
 */

class AmbientAtmosphereEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private currentType: AmbientAtmosphereType = 'temple_bells';
  private targetVolume: number = 0.15;
  private isRunning: boolean = false;
  private isDucked: boolean = false;
  private analyser: AnalyserNode | null = null;
  private freqDataArray: Uint8Array | null = null;
  private stateListeners: Set<(state: { isRunning: boolean; type: AmbientAtmosphereType; volume: number }) => void> = new Set();

  // Active nodes & timers cleanup
  private activeOscillators: OscillatorNode[] = [];
  private activeNoiseSources: AudioBufferSourceNode[] = [];
  private activeTimeouts: number[] = [];
  private activeIntervals: number[] = [];

  // Cached noise buffer
  private noiseBuffer: AudioBuffer | null = null;

  private initAudioContext(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return false;

      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      if (!this.masterGain) {
        this.masterGain = this.audioCtx.createGain();
        this.duckGain = this.audioCtx.createGain();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.75;
        this.freqDataArray = new Uint8Array(this.analyser.frequencyBinCount);

        // Connect: Sound Generators -> Duck Gain -> Master Gain -> Analyser -> Destination
        this.duckGain.gain.setValueAtTime(1.0, this.audioCtx.currentTime);
        this.masterGain.gain.setValueAtTime(this.targetVolume, this.audioCtx.currentTime);

        this.duckGain.connect(this.masterGain);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
      }

      return true;
    } catch (e) {
      console.warn('AmbientAtmosphereEngine AudioContext error:', e);
      return false;
    }
  }

  /**
   * Generates a 6-second high-quality looping stereo pink/brown noise buffer
   * for realistic natural water and wind sounds
   */
  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.audioCtx) return null;
    if (this.noiseBuffer) return this.noiseBuffer;

    const sampleRate = this.audioCtx.sampleRate;
    const duration = 6.0;
    const frameCount = sampleRate * duration;
    const buffer = this.audioCtx.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      let lastOut = 0.0;

      for (let i = 0; i < frameCount; i++) {
        const white = Math.random() * 2 - 1;
        
        // Pink noise filter algorithm (Paul Kellet)
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;

        // Blend with subtle brownian walk for deep soothing warmth
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = (pink * 0.07 + lastOut * 0.35) * 0.8;
      }
    }

    this.noiseBuffer = buffer;
    return buffer;
  }

  /**
   * Start ambient atmosphere loop
   */
  public start(type: AmbientAtmosphereType = this.currentType, volume?: number) {
    if (typeof window === 'undefined') return;

    if (volume !== undefined) {
      this.targetVolume = Math.max(0.01, Math.min(1.0, volume));
    }

    this.currentType = type;

    if (!this.initAudioContext()) return;

    // Smoothly transition if already running
    this.stopNodes();

    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
      this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, this.audioCtx.currentTime + 1.8);
    }

    this.isRunning = true;
    this.notifyListeners();

    switch (type) {
      case 'temple_bells':
        this.buildTempleBells();
        break;
      case 'river':
        this.buildRiverStream();
        break;
      case 'forest':
        this.buildForestAtmosphere();
        break;
      case 'tanpura':
        this.buildTanpuraAtmosphere();
        break;
    }
  }

  /**
   * Stop ambient atmosphere with gentle fade-out
   */
  public stop(fadeSeconds: number = 1.0) {
    if (!this.isRunning) return;

    if (this.masterGain && this.audioCtx && this.audioCtx.state === 'running') {
      try {
        const now = this.audioCtx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(Math.max(0.001, this.masterGain.gain.value), now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + fadeSeconds);
      } catch {}
    }

    const timer = window.setTimeout(() => {
      this.stopNodes();
      this.isRunning = false;
      this.notifyListeners();
    }, fadeSeconds * 1000 + 50);

    this.activeTimeouts.push(timer);
  }

  public setVolume(volume: number) {
    this.targetVolume = Math.max(0.01, Math.min(1.0, volume));
    if (this.masterGain && this.audioCtx && this.isRunning && !this.isDucked) {
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, now + 0.2);
    }
    this.notifyListeners();
  }

  public setType(type: AmbientAtmosphereType) {
    if (this.currentType === type && this.isRunning) return;
    this.currentType = type;
    if (this.isRunning) {
      this.start(type);
    } else {
      this.notifyListeners();
    }
  }

  public getType(): AmbientAtmosphereType {
    return this.currentType;
  }

  public isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Returns current audio energy / intensity between 0 and 1
   * for syncing canvas animations, particle velocity and gradient pulses
   */
  public getAudioIntensity(): number {
    if (!this.isRunning || !this.analyser || !this.freqDataArray) return 0;
    try {
      this.analyser.getByteFrequencyData(this.freqDataArray);
      let sum = 0;
      const count = this.freqDataArray.length;
      for (let i = 0; i < count; i++) {
        sum += this.freqDataArray[i];
      }
      const avg = sum / (count * 255);
      return Math.min(1.0, Math.max(0, avg * 2.8));
    } catch {
      return 0;
    }
  }

  /**
   * Returns frequency data bins for wave or spectrum rendering
   */
  public getFrequencyData(): Uint8Array | null {
    if (!this.isRunning || !this.analyser || !this.freqDataArray) return null;
    try {
      this.analyser.getByteFrequencyData(this.freqDataArray);
      return this.freqDataArray;
    } catch {
      return null;
    }
  }

  public addAtmosphereListener(listener: (state: { isRunning: boolean; type: AmbientAtmosphereType; volume: number }) => void) {
    this.stateListeners.add(listener);
    listener({ isRunning: this.isRunning, type: this.currentType, volume: this.targetVolume });
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.stateListeners.forEach(listener => {
      try {
        listener({ isRunning: this.isRunning, type: this.currentType, volume: this.targetVolume });
      } catch (e) {
        console.warn('Atmosphere listener error:', e);
      }
    });
  }

  /**
   * Audio Ducking: lowers ambient atmosphere to 25% when spoken recitation is active
   */
  public duck() {
    if (!this.duckGain || !this.audioCtx || this.isDucked) return;
    this.isDucked = true;
    const now = this.audioCtx.currentTime;
    this.duckGain.gain.cancelScheduledValues(now);
    this.duckGain.gain.setValueAtTime(this.duckGain.gain.value, now);
    this.duckGain.gain.linearRampToValueAtTime(0.22, now + 0.6);
  }

  /**
   * Restores ambient atmosphere volume back to normal after recitation ends
   */
  public unduck() {
    if (!this.duckGain || !this.audioCtx || !this.isDucked) return;
    this.isDucked = false;
    const now = this.audioCtx.currentTime;
    this.duckGain.gain.cancelScheduledValues(now);
    this.duckGain.gain.setValueAtTime(this.duckGain.gain.value, now);
    this.duckGain.gain.linearRampToValueAtTime(1.0, now + 1.2);
  }

  // --- Soundscape 1: Temple Bells & Sanctum Resonance ---
  private buildTempleBells() {
    if (!this.audioCtx || !this.duckGain) return;

    // 1. Deep Sanctum Low-Pass Sub-Bass Pad (108 Hz Om resonance)
    const baseFreq = 108.0;
    const padOsc = this.audioCtx.createOscillator();
    padOsc.type = 'sine';
    padOsc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);

    const padFilter = this.audioCtx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(220, this.audioCtx.currentTime);

    const padGain = this.audioCtx.createGain();
    padGain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);

    // Subtle gentle breathing modulation (0.1 Hz)
    const padLfo = this.audioCtx.createOscillator();
    const padLfoGain = this.audioCtx.createGain();
    padLfo.frequency.setValueAtTime(0.08, this.audioCtx.currentTime);
    padLfoGain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
    padLfo.connect(padLfoGain);
    padLfoGain.connect(padGain.gain);

    padOsc.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(this.duckGain);

    padOsc.start();
    padLfo.start();
    this.activeOscillators.push(padOsc, padLfo);

    // 2. Periodic Meditative Temple Singing Bowl / Bell strikes
    const strikeBell = () => {
      if (!this.audioCtx || !this.duckGain || !this.isRunning) return;

      const now = this.audioCtx.currentTime;
      // Pentatonic meditative fundamental frequencies (F#4, A4, B4, C#5, E5)
      const fundamentals = [370.0, 440.0, 493.88, 554.37, 659.25];
      const root = fundamentals[Math.floor(Math.random() * fundamentals.length)];

      // Bell inharmonic overtone ratios: 1.0, 2.76, 5.4, 8.93
      const bellModes = [
        { ratio: 1.0, gain: 0.35, decay: 4.5 },
        { ratio: 2.76, gain: 0.18, decay: 3.2 },
        { ratio: 5.40, gain: 0.08, decay: 2.0 },
        { ratio: 8.93, gain: 0.03, decay: 1.2 }
      ];

      bellModes.forEach(mode => {
        const osc = this.audioCtx!.createOscillator();
        const modeGain = this.audioCtx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(root * mode.ratio, now);

        modeGain.gain.setValueAtTime(0.0001, now);
        modeGain.gain.linearRampToValueAtTime(mode.gain * 0.5, now + 0.03);
        modeGain.gain.exponentialRampToValueAtTime(0.0001, now + mode.decay);

        osc.connect(modeGain);
        modeGain.connect(this.duckGain!);

        osc.start(now);
        osc.stop(now + mode.decay + 0.1);
      });
    };

    // Strike immediately once, then at random soothing intervals (every 4.5 to 7 seconds)
    strikeBell();
    const intervalId = window.setInterval(() => {
      strikeBell();
    }, 5500);

    this.activeIntervals.push(intervalId);
  }

  // --- Soundscape 2: Sacred Mountain River / Ganga Stream ---
  private buildRiverStream() {
    if (!this.audioCtx || !this.duckGain) return;

    const noiseBuffer = this.getNoiseBuffer();
    if (!noiseBuffer) return;

    // Loop 1: Deep water flow & current body
    const noiseSource1 = this.audioCtx.createBufferSource();
    noiseSource1.buffer = noiseBuffer;
    noiseSource1.loop = true;

    const filter1 = this.audioCtx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(380, this.audioCtx.currentTime);
    filter1.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

    // Filter LFO: simulates water swaying over river rocks
    const lfo1 = this.audioCtx.createOscillator();
    const lfo1Gain = this.audioCtx.createGain();
    lfo1.frequency.setValueAtTime(0.18, this.audioCtx.currentTime);
    lfo1Gain.gain.setValueAtTime(120, this.audioCtx.currentTime);
    lfo1.connect(lfo1Gain);
    lfo1Gain.connect(filter1.frequency);

    const gain1 = this.audioCtx.createGain();
    gain1.gain.setValueAtTime(0.7, this.audioCtx.currentTime);

    noiseSource1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(this.duckGain);

    // Loop 2: Gentle surface ripples and water bubbles
    const noiseSource2 = this.audioCtx.createBufferSource();
    noiseSource2.buffer = noiseBuffer;
    noiseSource2.loop = true;

    const filter2 = this.audioCtx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(950, this.audioCtx.currentTime);
    filter2.Q.setValueAtTime(2.2, this.audioCtx.currentTime);

    const lfo2 = this.audioCtx.createOscillator();
    const lfo2Gain = this.audioCtx.createGain();
    lfo2.frequency.setValueAtTime(0.35, this.audioCtx.currentTime);
    lfo2Gain.gain.setValueAtTime(240, this.audioCtx.currentTime);
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(filter2.frequency);

    const gain2 = this.audioCtx.createGain();
    gain2.gain.setValueAtTime(0.35, this.audioCtx.currentTime);

    // Lo-Fi Warmth: Gentle Master Lowpass at 2200Hz
    const loFiWarmth = this.audioCtx.createBiquadFilter();
    loFiWarmth.type = 'lowpass';
    loFiWarmth.frequency.setValueAtTime(2100, this.audioCtx.currentTime);

    noiseSource2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(loFiWarmth);
    loFiWarmth.connect(this.duckGain);

    noiseSource1.start();
    noiseSource2.start();
    lfo1.start();
    lfo2.start();

    this.activeNoiseSources.push(noiseSource1, noiseSource2);
    this.activeOscillators.push(lfo1, lfo2);
  }

  // --- Soundscape 3: Sacred Forest Breeze & Bamboo Wind Chimes ---
  private buildForestAtmosphere() {
    if (!this.audioCtx || !this.duckGain) return;

    const noiseBuffer = this.getNoiseBuffer();
    if (!noiseBuffer) return;

    // 1. Wind breeze through sacred Peepal leaves
    const windSource = this.audioCtx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = this.audioCtx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(750, this.audioCtx.currentTime);

    // Slow wind gust LFO (0.09 Hz)
    const windLfo = this.audioCtx.createOscillator();
    const windLfoGain = this.audioCtx.createGain();
    windLfo.frequency.setValueAtTime(0.09, this.audioCtx.currentTime);
    windLfoGain.gain.setValueAtTime(280, this.audioCtx.currentTime);
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);

    const windGain = this.audioCtx.createGain();
    windGain.gain.setValueAtTime(0.55, this.audioCtx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.duckGain);

    windSource.start();
    windLfo.start();
    this.activeNoiseSources.push(windSource);
    this.activeOscillators.push(windLfo);

    // 2. Gentle soft bamboo breeze flutes / distance bird tone
    const playForestChime = () => {
      if (!this.audioCtx || !this.duckGain || !this.isRunning) return;

      const now = this.audioCtx.currentTime;
      // High peaceful harmonic notes: E5, G#5, B5, E6
      const chimeNotes = [659.25, 830.61, 987.77, 1318.51];
      const freq = chimeNotes[Math.floor(Math.random() * chimeNotes.length)];

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.duckGain!);

      osc.start(now);
      osc.stop(now + 2.3);
    };

    const intervalId = window.setInterval(() => {
      if (Math.random() > 0.25) {
        playForestChime();
      }
    }, 4000);

    this.activeIntervals.push(intervalId);
  }

  // --- Soundscape 4: Vedic Tanpura & Sacred Om Drone ---
  private buildTanpuraAtmosphere() {
    if (!this.audioCtx || !this.duckGain) return;

    // Classic Indian Tanpura tuning: Pa - Sa - Sa - Sa(low)
    // D3 base tuning: Pa (220 Hz), Sa (146.83 Hz), Kharaj Sa (73.41 Hz)
    const strings = [
      { freq: 220.00, gain: 0.16, type: 'sawtooth' as OscillatorType, lfoFreq: 0.12 },
      { freq: 146.83, gain: 0.22, type: 'triangle' as OscillatorType, lfoFreq: 0.15 },
      { freq: 147.20, gain: 0.20, type: 'sawtooth' as OscillatorType, lfoFreq: 0.18 }, // Slight chorused detune
      { freq: 73.41,  gain: 0.26, type: 'sine' as OscillatorType, lfoFreq: 0.07 },     // Warm root base
    ];

    const warmFilter = this.audioCtx.createBiquadFilter();
    warmFilter.type = 'lowpass';
    warmFilter.frequency.setValueAtTime(480, this.audioCtx.currentTime);
    warmFilter.Q.setValueAtTime(3.0, this.audioCtx.currentTime);
    warmFilter.connect(this.duckGain);

    strings.forEach(str => {
      const osc = this.audioCtx!.createOscillator();
      osc.type = str.type;
      osc.frequency.setValueAtTime(str.freq, this.audioCtx!.currentTime);

      const oscGain = this.audioCtx!.createGain();
      oscGain.gain.setValueAtTime(str.gain, this.audioCtx!.currentTime);

      // Phased gentle undulating pluck resonance
      const lfo = this.audioCtx!.createOscillator();
      const lfoGain = this.audioCtx!.createGain();
      lfo.frequency.setValueAtTime(str.lfoFreq, this.audioCtx!.currentTime);
      lfoGain.gain.setValueAtTime(str.gain * 0.45, this.audioCtx!.currentTime);
      lfo.connect(lfoGain.gain);

      osc.connect(oscGain);
      oscGain.connect(warmFilter);

      osc.start();
      lfo.start();
      this.activeOscillators.push(osc, lfo);
    });
  }

  private stopNodes() {
    this.activeTimeouts.forEach(t => clearTimeout(t));
    this.activeTimeouts = [];

    this.activeIntervals.forEach(i => clearInterval(i));
    this.activeIntervals = [];

    this.activeOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    this.activeOscillators = [];

    this.activeNoiseSources.forEach(src => {
      try { src.stop(); src.disconnect(); } catch {}
    });
    this.activeNoiseSources = [];
  }
}

export const ambientAtmosphere = new AmbientAtmosphereEngine();
