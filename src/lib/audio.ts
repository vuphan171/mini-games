// ---------- Âm thanh (Web Audio, bọc try/catch để không bao giờ crash game) ----------

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType, vol: number) {
  const c = ctx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type || "square";
  o.frequency.setValueAtTime(freq, c.currentTime + start);
  g.gain.setValueAtTime(vol || 0.15, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur);
}

export const safe = (fn: () => void) => {
  try {
    fn();
  } catch {
    /* không bao giờ để lỗi âm thanh làm crash game */
  }
};

export const ensureAudioContext = () => safe(() => ctx());

export const sfx = {
  eat: () =>
    safe(() => {
      tone(660, 0, 0.08, "square", 0.12);
      tone(880, 0.06, 0.1, "square", 0.12);
    }),
  whistle: () =>
    safe(() => {
      const c = ctx();
      if (!c) return;
      for (let i = 0; i < 2; i++) {
        const o = c.createOscillator();
        const g = c.createGain();
        const t0 = c.currentTime + i * 0.22;
        o.type = "sawtooth";
        o.frequency.setValueAtTime(2200, t0);
        o.frequency.linearRampToValueAtTime(2400, t0 + 0.08);
        o.frequency.linearRampToValueAtTime(2100, t0 + 0.16);
        g.gain.setValueAtTime(0.18, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
        o.connect(g);
        g.connect(c.destination);
        o.start(t0);
        o.stop(t0 + 0.2);
      }
    }),
  bounce: () => safe(() => tone(180, 0, 0.1, "sine", 0.15)), // tiếng bóng nảy khi bóng xuất hiện
  win: () =>
    safe(() => {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.14, 0.3, "triangle", 0.2));
      tone(1319, 0.6, 0.5, "triangle", 0.2);
    }),
  lose: () =>
    safe(() => {
      [400, 340, 280, 200].forEach((f, i) => tone(f, i * 0.18, 0.28, "sawtooth", 0.15));
    }),
};
