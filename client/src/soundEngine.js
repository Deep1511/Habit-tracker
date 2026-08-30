// Pure Web Audio API Synthesizer (Zero external dependencies, zero ads)
let audioCtx = null;
let currentSourceNodes = [];

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAmbientSound() {
  currentSourceNodes.forEach((node) => {
    try {
      if (node.stop) node.stop();
      if (node.disconnect) node.disconnect();
    } catch (e) {}
  });
  currentSourceNodes = [];
}

// ── 1. 40Hz Gamma Binaural Beats (Peak Working Memory & DSA Coding) ──
export function playGamma40Hz(volume = 0.15) {
  stopAmbientSound();
  const ctx = getAudioContext();
  if (!ctx) return;

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume, ctx.currentTime);
  masterGain.connect(ctx.destination);

  // Left ear: 200 Hz carrier
  const oscL = ctx.createOscillator();
  const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  oscL.type = "sine";
  oscL.frequency.setValueAtTime(200, ctx.currentTime);
  if (panL) {
    panL.pan.setValueAtTime(-1, ctx.currentTime);
    oscL.connect(panL);
    panL.connect(masterGain);
  } else {
    oscL.connect(masterGain);
  }

  // Right ear: 240 Hz carrier (Difference = 40 Hz Gamma wave)
  const oscR = ctx.createOscillator();
  const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  oscR.type = "sine";
  oscR.frequency.setValueAtTime(240, ctx.currentTime);
  if (panR) {
    panR.pan.setValueAtTime(1, ctx.currentTime);
    oscR.connect(panR);
    panR.connect(masterGain);
  } else {
    oscR.connect(masterGain);
  }

  // Soft low-pass pink noise bed for warmth
  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
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
    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
    b6 = white * 0.115926;
  }
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.06, ctx.currentTime);
  noiseSource.connect(noiseGain);
  noiseGain.connect(masterGain);

  oscL.start();
  oscR.start();
  noiseSource.start();

  currentSourceNodes = [oscL, oscR, noiseSource, masterGain];
}

// ── 2. Deep Brown Noise (Low frequency mask, eliminates cognitive friction) ──
export function playBrownNoise(volume = 0.2) {
  stopAmbientSound();
  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(350, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
  currentSourceNodes = [noise, filter, gain];
}

// ── 3. Soothing Rain Ambience (Modulated white & pink noise) ──
export function playRainAmbience(volume = 0.18) {
  stopAmbientSound();
  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99765 * b0 + white * 0.0990460;
    b1 = 0.96300 * b1 + white * 0.2965164;
    b2 = 0.57000 * b2 + white * 1.0526913;
    data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.08;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1000, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
  currentSourceNodes = [noise, filter, gain];
}

// ── 4. Two-Tone Completion Chime (C5 ➔ E5) ──
export function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.8);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.2);
    osc2.stop(ctx.currentTime + 1.2);
  } catch (e) {
    console.warn("Audio chime disabled:", e);
  }
}
