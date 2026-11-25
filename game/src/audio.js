// Audio: tiny WebAudio beeps, generated at runtime — no audio files,
// no network, nothing to load. The context starts on the first gesture.

NB.audioCtx = null;

NB.ensureAudio = function (state) {
  if (state.muted) return null;
  try {
    if (!NB.audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      NB.audioCtx = new AC();
    }
    if (NB.audioCtx.state === 'suspended') NB.audioCtx.resume();
    return NB.audioCtx;
  } catch (err) {
    return null;
  }
};

NB.tone = function (state, freq, dur, type, vol, delay) {
  const ac = NB.ensureAudio(state);
  if (!ac) return;
  try {
    const t0 = ac.currentTime + (delay || 0);
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(vol || 0.12, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch (err) {
    // Sound is garnish; a failure must never break the game.
  }
};

NB.playSound = function (name) {
  const state = NB.state;
  if (!state || state.muted) return;
  if (name === 'grab') NB.tone(state, 520, 0.07, 'triangle', 0.1);
  else if (name === 'chop') NB.tone(state, 190, 0.08, 'square', 0.1);
  else if (name === 'chopDone') { NB.tone(state, 660, 0.08, 'triangle', 0.1); NB.tone(state, 880, 0.1, 'triangle', 0.1, 0.07); }
  else if (name === 'sizzle') { NB.tone(state, 240, 0.25, 'sawtooth', 0.05); NB.tone(state, 320, 0.2, 'sawtooth', 0.04, 0.1); }
  else if (name === 'plate') NB.tone(state, 740, 0.07, 'triangle', 0.1);
  else if (name === 'ready') { NB.tone(state, 880, 0.12, 'sine', 0.12); NB.tone(state, 1318, 0.16, 'sine', 0.1, 0.1); }
  else if (name === 'vip') { NB.tone(state, 1046, 0.12, 'triangle', 0.12); NB.tone(state, 1568, 0.2, 'triangle', 0.12, 0.09); }
  else if (name === 'perfect') { NB.tone(state, 784, 0.09, 'triangle', 0.12); NB.tone(state, 1046, 0.09, 'triangle', 0.12, 0.08); NB.tone(state, 1568, 0.2, 'triangle', 0.12, 0.16); }
  else if (name === 'serve') { NB.tone(state, 784, 0.1, 'triangle', 0.12); NB.tone(state, 1046, 0.12, 'triangle', 0.12, 0.08); NB.tone(state, 1318, 0.16, 'triangle', 0.1, 0.16); }
  else if (name === 'lost') NB.tone(state, 220, 0.3, 'sawtooth', 0.08);
  else if (name === 'burnt') { NB.tone(state, 160, 0.2, 'square', 0.08); NB.tone(state, 120, 0.25, 'square', 0.08, 0.12); }
};
