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
    cold: { active: false, item: null, t: 0, dur: NB.COLD_SECONDS },
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
    // LAST CALL: one moment — the VIP at two of two, her cold dish
    // ready on the plate, noodles steaming in the wok for the next
    // ticket, the cold counter dressed and waiting beside the serve
    // window. The cover's cold branch must read in one glance: blue
    // COLD ticket, No Wok badge on the menu, cold counter.
    state.elapsed = 112;
    state.timeLeft = 38;
    state.coins = 86;
    state.combo = 3;
    state.served = 4;
    state.lost = 1;
    state.orders = [
      NB.stagedOrder(state, 'sesame-greens', 2, 0.55, true),
      NB.stagedOrder(state, 'broth-bowl', 0, 0.8),
      NB.stagedOrder(state, 'garden-noodles', 0, 0.9)
    ];
    state.plateFor = state.orders[0].id;
    state.plate.items = [
      { ing: 'chili', prep: 'chopped' },
      { ing: 'greens', prep: 'tossed' }
    ];
    state.cook.x = 860;
    state.cook.y = 335;
    state.cook.hand = [];
    state.woks[0].item = { ing: 'noodles', state: 'cooking', t: 1.8, readyT: 0 };
  } else if (shot === 'chop') {
    // The journey begins: the VIP just arrived, nothing done yet, the
    // greens for her cold bowl are on the chop board.
    state.elapsed = 18;
    state.timeLeft = 132;
    state.coins = 34;
    state.combo = 1;
    state.served = 1;
    state.orders = [
      NB.stagedOrder(state, 'sesame-greens', 0, 0.85, true),
      NB.stagedOrder(state, 'broth-bowl', 0, 0.85)
    ];
    state.cook.x = 440;
    state.cook.y = 272;
    state.cook.hand = [];
    state.chop = { active: true, item: { ing: 'greens', prep: 'raw' }, t: 0.8, dur: NB.CHOP_SECONDS };
  } else if (shot === 'wok') {
    // Mid-journey: the VIP's chili is chopped and on the plate, her
    // greens are mid-toss at the cold counter, and noodles steam in
    // wok 1 for the next hot ticket.
    state.elapsed = 61;
    state.timeLeft = 89;
    state.coins = 58;
    state.combo = 2;
    state.served = 2;
    state.orders = [
      NB.stagedOrder(state, 'sesame-greens', 1, 0.7, true),
      NB.stagedOrder(state, 'garden-noodles', 0, 0.85)
    ];
    state.plateFor = state.orders[0].id;
    state.plate.items = [
      { ing: 'chili', prep: 'chopped' }
    ];
    state.cook.x = 1153;
    state.cook.y = 476;
    state.cook.hand = [];
    state.cold = { active: true, item: { ing: 'greens', prep: 'chopped' }, t: 1.1, dur: NB.COLD_SECONDS };
    state.woks[0].item = { ing: 'noodles', state: 'cooking', t: 1.8, readyT: 0 };
  } else if (shot === 'serve') {
    // The payoff: the VIP's cold plate is complete, and the serve is
    // mid-flight — plate sliding, popup up. A VIP served with her heat
    // still high is a perfect serve: $45 = $33 payout + $12 tip.
    state.elapsed = 98;
    state.timeLeft = 52;
    state.coins = 124;
    state.combo = 5;
    state.served = 6;
    state.orders = [
      NB.stagedOrder(state, 'sesame-greens', 2, 0.6, true),
      NB.stagedOrder(state, 'broth-bowl', 0, 0.9)
    ];
    state.plateFor = state.orders[0].id;
    state.plate.items = [
      { ing: 'chili', prep: 'chopped' },
      { ing: 'greens', prep: 'tossed' }
    ];
    // Beside the plate, in the gap between the wok and plating
    // panels: the cook at the hatch approach (1193, 320) would stand
    // on the cold counter and hide its label, so he stands here.
    state.cook.x = 900;
    state.cook.y = 300;
    state.cook.hand = [];
    state.serveFx = { t: 0.15, dur: 0.5, perfect: true, pay: 45 };
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
