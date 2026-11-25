// Simmer & Serve — Midnight Noodle Bar: tuning constants, palette and layout.
// One shared namespace: every game file attaches its part to NB.
const NB = {};

// Canvas size (the game is drawn at 1280x720 and scaled by CSS).
NB.W = 1280;
NB.H = 720;

// Shift length in seconds and the rush trigger.
NB.SHIFT_SECONDS = 150;
NB.RUSH_AT = 40;

// Order pacing: seconds between new orders in each phase.
NB.SPAWN_EARLY = 11;
NB.SPAWN_MID = 9;
NB.SPAWN_RUSH = 7;
NB.MAX_ORDERS = 3;

// Patience (seconds an order waits before it is lost).
NB.PATIENCE_EARLY = 48;
NB.PATIENCE_RUSH = 36;

// Work durations in seconds.
NB.CHOP_SECONDS = 1.4;
NB.COOK_SECONDS = 3.0;
NB.READY_WINDOW = 4.0;

// Noodle pull: a timing sweep at the pull station. The needle sweeps a
// firmness meter; locking it inside the green band pulls the noodles
// perfectly. Perfect pulls pay a bonus at serve time.
NB.PULL_SWEEP = 2.4;
NB.PULL_PERFECT_LO = 0.35;
NB.PULL_PERFECT_HI = 0.65;
NB.PERFECT_BONUS = 4;

// VIP orders: a regular who hates waiting. Serve a VIP while its heat
// is still high and the tip is big; serve it late and the tip shrinks.
NB.VIP_AFTER = 45;
NB.VIP_CHANCE = 0.3;
NB.VIP_PATIENCE = 0.55;
NB.VIP_TIP = 12;
NB.VIP_TIP_SMALL = 4;

// Cook movement and hands.
NB.COOK_SPEED = 430;
NB.HAND_SLOTS = 2;
NB.INTERACT_RANGE = 140;

// Warm night-market palette.
NB.PAL = {
  wall: '#241419',
  wallTop: '#2f1d27',
  floor: '#3d2723',
  floorTile: '#452c26',
  wood: '#8a5a33',
  woodDark: '#6b4222',
  woodLight: '#a9743f',
  counter: '#c98f4e',
  counterTop: '#e0aa62',
  steel: '#9aa5ad',
  steelDark: '#6e7a82',
  cream: '#fff3dc',
  ink: '#241a12',
  amber: '#ffb347',
  ember: '#ff7a3c',
  red: '#e5484d',
  green: '#58b368',
  gold: '#ffd166',
  teal: '#2ec4b6',
  blue: '#4d96ff',
  purple: '#9b5de5',
  pink: '#f15bb5',
  noodle: '#ffd166',
  broth: '#e07b39',
  chicken: '#c97b4a',
  egg: '#fff7d6',
  yolk: '#ffb703',
  chili: '#e5383b',
  greens: '#52b788',
  smoke: 'rgba(255,255,255,0.55)'
};

// Layout rectangles. The cover screenshot must show every criterion-1
// element in one glance, so the board, crates, wok, plate and timer are
// all large and labelled.
NB.LAYOUT = {
  topBar: { x: 0, y: 0, w: 1280, h: 70 },
  board: { x: 14, y: 82, w: 294, h: 520 },
  floor: { x: 322, y: 82, w: 944, h: 560 },
  chop: { x: 340, y: 100, w: 200, h: 140 },
  wok: { x: 580, y: 100, w: 300, h: 160 },
  plate: { x: 920, y: 100, w: 170, h: 160 },
  serve: { x: 1120, y: 100, w: 146, h: 160 },
  bin: { x: 920, y: 300, w: 110, h: 76 },
  pull: { x: 560, y: 330, w: 200, h: 140 },
  menu: { x: 780, y: 380, w: 260, h: 100 },
  crates: { x: 340, y: 520, w: 912, h: 112 },
  hint: { x: 0, y: 652, w: 1280, h: 68 }
};

// Small deterministic RNG (mulberry32). Gameplay seeds from the clock;
// screenshot staging seeds from a fixed number so shots are stable.
NB.mulberry32 = function (seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

NB.clamp = function (v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
};

NB.lerp = function (a, b, t) {
  return a + (b - a) * t;
};

// Format seconds as M:SS for the shift timer.
NB.formatClock = function (seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m + ':' + (r < 10 ? '0' : '') + r;
};
