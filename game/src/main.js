// Main loop: game state, shift lifecycle, screenshot staging, boot.
// The game is a single canvas; state is one plain object.

NB.newState = function () {
  return {
    ctx: null,
    mode: 'title',
    rng: NB.mulberry32((Date.now() % 2147483647) || 1),
    elapsed: 0,
    timeLeft: NB.SHIFT_SECONDS,
    spawnIn: 6,
    nextOrderId: 1,
    orders: [],
    coins: 0,
    served: 0,
    lost: 0,
    combo: 0,
    bestCombo: 0,
    stars: 0,
    cook: { x: 700, y: 420, tx: 700, ty: 420, moving: false, pending: null, face: 1, hand: [] },
    chop: { active: false, item: null, t: 0, dur: NB.CHOP_SECONDS },
    pull: { active: false, item: null, t: 0 },
    serveFx: null,
    vipServed: 0,
    woks: [{ item: null }, { item: null }],
    plate: { items: [] },
    plateFor: null,
    stations: NB.stationList(),
    toasts: [],
    particles: [],
    muted: false,
    paused: false,
    endGuard: 0,
    shot: null
  };
};

NB.startShift = function (state) {
  const fresh = NB.newState();
  fresh.ctx = state.ctx;
  fresh.muted = state.muted;
  fresh.rng = state.rng;
  Object.keys(fresh).forEach(function (k) { state[k] = fresh[k]; });
  state.mode = 'playing';
  state.orders.push(NB.newOrder(state));
  state.spawnIn = NB.SPAWN_EARLY;
  NB.addToast(state, 'Shift started — first order is up!', '#ffd166');
};

NB.endShift = function (state) {
  state.timeLeft = 0;
  state.mode = 'end';
  state.endGuard = 1.0;
  state.serveFx = null;
  state.stars = state.coins >= 150 ? 3 : state.coins >= 100 ? 2 : state.coins >= 50 ? 1 : 0;
  NB.playSound('serve');
};

NB.update = function (state, dt) {
  if (state.paused) return;
  state.elapsed += dt;
  if (state.mode === 'end') {
    if (state.endGuard > 0) state.endGuard -= dt;
    return;
  }
  if (state.mode !== 'playing') return;
  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    NB.endShift(state);
    return;
  }
  NB.updateOrders(state, dt);
  NB.updateKitchen(state, dt);
  NB.updateKeyboardMove(state, dt);
};

// ---- Screenshot staging -------------------------------------------------
// ?shot=cover|chop|wok|serve freezes a real game state so each screenshot
// is a genuine render of the game's own code at a readable moment.

NB.stagedOrder = function (state, dishId, doneCount, patienceFrac, vip) {
  const dish = NB.dishById(dishId);
  const order = {
    id: state.nextOrderId++,
    dishId: dish.id,
    needs: dish.needs.map(function (n, i) {
      return { ing: n.ing, prep: n.prep, done: i < doneCount };
    }),
    patience: 0,
    patienceMax: NB.PATIENCE_EARLY,
    value: dish.coins,
    vip: !!vip,
    story: vip ? 'for the night-shift nurse' : null
  };
  // A staged VIP runs on the same fast heat as a live one.
  if (vip) order.patienceMax = Math.round(order.patienceMax * NB.VIP_PATIENCE);
  order.patience = order.patienceMax * patienceFrac;
  return order;
};

NB.stageShot = function (state, shot) {
  state.rng = NB.mulberry32(12345);
  state.mode = 'playing';
  state.paused = true;
  state.shot = shot;
  state.spawnIn = 5;
  if (shot === 'cover') {
    // LAST CALL: one moment — the VIP at two of three, her dish
    // mid-assembly on the plate, chili chopping, noodles in the wok.
    state.elapsed = 112;
    state.timeLeft = 38;
    state.coins = 86;
    state.combo = 3;
    state.served = 4;
    state.lost = 1;
    state.orders = [
      NB.stagedOrder(state, 'midnight-noodles', 2, 0.55, true),
      NB.stagedOrder(state, 'broth-bowl', 0, 0.8),
      NB.stagedOrder(state, 'garden-noodles', 0, 0.9)
    ];
    state.plateFor = state.orders[0].id;
    state.plate.items = [
      { ing: 'noodles', prep: 'cooked', perfect: true },
      { ing: 'chicken', prep: 'cooked' }
    ];
    state.cook.x = 860;
    state.cook.y = 335;
    state.cook.hand = [{ ing: 'noodles', prep: 'raw' }];
    state.chop = { active: true, item: { ing: 'chili', prep: 'raw' }, t: 0.8, dur: NB.CHOP_SECONDS };
    state.woks[0].item = { ing: 'noodles', state: 'cooking', t: 1.8, readyT: 0 };
  } else if (shot === 'chop') {
    // The journey begins: the VIP just arrived, nothing done yet, the
    // chili for her noodles is on the board.
    state.elapsed = 18;
    state.timeLeft = 132;
    state.coins = 34;
    state.combo = 1;
    state.served = 1;
    state.orders = [
      NB.stagedOrder(state, 'midnight-noodles', 0, 0.85, true),
      NB.stagedOrder(state, 'broth-bowl', 0, 0.85)
    ];
    state.cook.x = 440;
    state.cook.y = 272;
    state.cook.hand = [];
    state.chop = { active: true, item: { ing: 'chili', prep: 'raw' }, t: 0.8, dur: NB.CHOP_SECONDS };
  } else if (shot === 'wok') {
    // Mid-journey: the VIP's chili is chopped, her noodles are ready in
    // wok 1, chicken still cooking in wok 2 — and the next batch of
    // noodles is on the pull station, needle in the green band.
    state.elapsed = 61;
    state.timeLeft = 89;
    state.coins = 58;
    state.combo = 2;
    state.served = 2;
    state.orders = [
      NB.stagedOrder(state, 'midnight-noodles', 1, 0.7, true),
      NB.stagedOrder(state, 'garden-noodles', 0, 0.85)
    ];
    state.cook.x = 730;
    state.cook.y = 292;
    state.cook.hand = [{ ing: 'egg', prep: 'raw' }];
    state.woks[0].item = { ing: 'noodles', state: 'ready', t: NB.COOK_SECONDS, readyT: 0.5 };
    state.woks[1].item = { ing: 'chicken', state: 'cooking', t: 1.5, readyT: 0 };
    state.pull = { active: true, item: { ing: 'noodles', prep: 'cooked' }, t: 1.15 };
  } else if (shot === 'serve') {
    // The payoff: the VIP's plate is complete with perfectly pulled
    // noodles, and the serve is mid-flight — plate sliding, popup up.
    state.elapsed = 98;
    state.timeLeft = 52;
    state.coins = 124;
    state.combo = 5;
    state.served = 6;
    state.orders = [
      NB.stagedOrder(state, 'midnight-noodles', 3, 0.6, true),
      NB.stagedOrder(state, 'broth-bowl', 0, 0.9)
    ];
    state.plateFor = state.orders[0].id;
    state.plate.items = [
      { ing: 'noodles', prep: 'cooked', perfect: true },
      { ing: 'chicken', prep: 'cooked' },
      { ing: 'chili', prep: 'chopped' }
    ];
    state.cook.x = 1193;
    state.cook.y = 320;
    state.cook.hand = [];
    state.serveFx = { t: 0.15, dur: 0.5, perfect: true, pay: 55 };
    NB.addToast(state, 'Plate ready — serve it!', '#58b368');
  }
};

// ---- Boot ---------------------------------------------------------------

NB.boot = function () {
  const canvas = document.getElementById('game');
  const state = NB.newState();
  state.ctx = canvas.getContext('2d');
  NB.state = state;
  NB.attachInput(state, canvas);
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (shot === 'cover' || shot === 'chop' || shot === 'wok' || shot === 'serve') {
    NB.stageShot(state, shot);
  }
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    NB.update(state, dt);
    NB.render(state);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};

// Exposed for automated playtests (not part of the game itself).
window.__game = NB;

NB.boot();
