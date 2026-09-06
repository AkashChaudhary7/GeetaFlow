import { AmbientAtmosphereType } from '../types';

export interface SpiritualAudioController {
  stop: () => void;
}

/**
 * Creates high-fidelity spiritual ambient soundscapes using the Web Audio API.
 * The audio graph is routed directly into the MediaStreamAudioDestinationNode,
 * ensuring high-quality AAC stereo encoding in the final MP4 video reel.
 */
export function setupSpiritualAtmosphereAudio(
  audioCtx: AudioContext,
  destination: MediaStreamAudioDestinationNode,
  type: AmbientAtmosphereType = 'temple_bells',
  durationSec: number = 30
): SpiritualAudioController {
  const activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  const intervals: number[] = [];

  // Resume context if suspended
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.42, audioCtx.currentTime);
  masterGain.connect(destination);

  const startTime = audioCtx.currentTime;

  // Master warm filter to give rich analogue warmth
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2400, startTime);
  filter.connect(masterGain);

  if (type === 'temple_bells') {
    // 1. Root Pranav Om Drone (136.1 Hz + harmonics)
    const droneFreqs = [136.1, 204.15, 272.2];
    droneFreqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, startTime);

      // Gentle vibrato
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.18 + i * 0.05, startTime);
      lfoGain.gain.setValueAtTime(0.7, startTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.18 / (i + 1), startTime);
      osc.connect(gain);
      gain.connect(filter);

      osc.start(startTime);
      lfo.start(startTime);
      activeNodes.push(osc, lfo);
    });

    // 2. Sacred Temple Bell chimes struck at intervals (0.5s, 6.5s, 12.5s, 18.5s, 24.5s)
    const bellTimes = [0.6, 6.5, 12.5, 18.5, 24.5];
    bellTimes.forEach((sec) => {
      const strikeTime = startTime + sec;
      if (strikeTime >= startTime + durationSec) return;

      const partials = [
        { mult: 1.0, gain: 0.22, decay: 2.5 },
        { mult: 2.0, gain: 0.12, decay: 1.8 },
        { mult: 3.01, gain: 0.08, decay: 1.2 },
        { mult: 4.15, gain: 0.04, decay: 0.8 },
      ];

      const baseFreq = 544.4; // Meditative F#4 / Sacred Bell frequency

      partials.forEach((p) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * p.mult, strikeTime);

        gain.gain.setValueAtTime(0.0001, strikeTime);
        gain.gain.exponentialRampToValueAtTime(p.gain, strikeTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + p.decay);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(strikeTime);
        osc.stop(strikeTime + p.decay + 0.1);
        activeNodes.push(osc);
      });
    });

  } else if (type === 'tanpura') {
    // Authentic 4-String Classical Tanpura Drone
    // Strings: Pa (196 Hz), Sa (261.6 Hz), Sa (262.8 Hz detuned), Kharaj Sa (130.8 Hz)
    const strings = [
      { freq: 196.0, name: 'Pa' },
      { freq: 261.63, name: 'Sa1' },
      { freq: 262.8, name: 'Sa2' },
      { freq: 130.81, name: 'Kharaj' },
    ];

    strings.forEach((str, strIdx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(str.freq, startTime);

      // Low pass to soften sawtooth into string buzz (Javari effect)
      const strFilter = audioCtx.createBiquadFilter();
      strFilter.type = 'lowpass';
      strFilter.frequency.setValueAtTime(800, startTime);
      strFilter.Q.setValueAtTime(3.5, startTime);

      // Pluck envelope scheduled across 30 seconds
      gain.gain.setValueAtTime(0.03, startTime);

      const cycleInterval = 1.35; // 1.35s per string pluck
      const totalPlucks = Math.floor(durationSec / (cycleInterval * 4));

      for (let c = 0; c < totalPlucks + 1; c++) {
        const pluckTime = startTime + c * (cycleInterval * 4) + strIdx * cycleInterval;
        if (pluckTime < startTime + durationSec) {
          gain.gain.setValueAtTime(0.03, pluckTime);
          gain.gain.linearRampToValueAtTime(0.18, pluckTime + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.04, pluckTime + cycleInterval * 1.8);
        }
      }

      osc.connect(strFilter);
      strFilter.connect(gain);
      gain.connect(filter);

      osc.start(startTime);
      activeNodes.push(osc);
    });

  } else {
    // Sacred River / Ganga ghat atmosphere
    // 1. Water flow ripple synthesizer using filtered white/pink noise
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const riverFilter = audioCtx.createBiquadFilter();
    riverFilter.type = 'bandpass';
    riverFilter.frequency.setValueAtTime(450, startTime);
    riverFilter.Q.setValueAtTime(1.2, startTime);

    // LFO to create gentle ebb and flow of water ripples
    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.25, startTime);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(120, startTime);
    lfo.connect(lfoGain);
    lfoGain.connect(riverFilter.frequency);

    const riverGain = audioCtx.createGain();
    riverGain.gain.setValueAtTime(0.26, startTime);

    whiteNoise.connect(riverFilter);
    riverFilter.connect(riverGain);
    riverGain.connect(masterGain);

    whiteNoise.start(startTime);
    lfo.start(startTime);
    activeNodes.push(whiteNoise, lfo);

    // Deep Om Drone in background
    const drone = audioCtx.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(136.1, startTime);
    const droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.14, startTime);
    drone.connect(droneGain);
    droneGain.connect(masterGain);
    drone.start(startTime);
    activeNodes.push(drone);
  }

  return {
    stop: () => {
      intervals.forEach((id) => clearInterval(id));
      activeNodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
        } catch {}
        try {
          if (node.disconnect) node.disconnect();
        } catch {}
      });
      try {
        masterGain.disconnect();
      } catch {}
    },
  };
}
