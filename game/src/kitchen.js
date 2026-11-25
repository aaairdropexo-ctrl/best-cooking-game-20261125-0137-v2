// Kitchen: stations, the cook, the chopping board, the woks and the plate.
// Every station is a big labelled target so the kitchen reads at a glance.

NB.stationList = function () {
  const L = NB.LAYOUT;
  const stations = [];
  // The six ingredient crates along the bottom of the kitchen.
  const crateW = L.crates.w / NB.INGREDIENTS.length;
  NB.INGREDIENTS.forEach(function (ing, i) {
    stations.push({
      id: 'crate-' + ing.id,
      kind: 'crate',
      ing: ing.id,
      label: ing.name,
      rect: { x: L.crates.x + i * crateW + 4, y: L.crates.y, w: crateW - 8, h: L.crates.h },
      approach: { x: L.crates.x + i * crateW + crateW / 2, y: L.crates.y - 26 }
    });
  });
  // Chopping board.
  stations.push({
    id: 'chop', kind: 'chop', label: 'CHOP BOARD',
    rect: L.chop, approach: { x: L.chop.x + L.chop.w / 2, y: L.chop.y + L.chop.h + 30 }
  });
  // Two wok burners on one stove.
  const bw = (L.wok.w - 24) / 2;
  stations.push({
    id: 'wok-0', kind: 'wok', burner: 0, label: 'WOK 1',
    rect: { x: L.wok.x + 8, y: L.wok.y + 34, w: bw, h: L.wok.h - 44 },
    approach: { x: L.wok.x + 8 + bw / 2, y: L.wok.y + L.wok.h + 30 }
  });
  stations.push({
    id: 'wok-1', kind: 'wok', burner: 1, label: 'WOK 2',
    rect: { x: L.wok.x + 16 + bw, y: L.wok.y + 34, w: bw, h: L.wok.h - 44 },
    approach: { x: L.wok.x + 16 + bw + bw / 2, y: L.wok.y + L.wok.h + 30 }
  });
  // Plating counter and serve window.
  stations.push({
    id: 'plate', kind: 'plate', label: 'PLATING',
    rect: L.plate, approach: { x: L.plate.x + L.plate.w / 2, y: L.plate.y + L.plate.h + 30 }
  });
  stations.push({
    id: 'serve', kind: 'serve', label: 'SERVE',
    rect: L.serve, approach: { x: L.serve.x + L.serve.w / 2, y: L.serve.y + L.serve.h + 30 }
  });
  // Scrap bin.
  stations.push({
    id: 'bin', kind: 'bin', label: 'BIN',
    rect: L.bin, approach: { x: L.bin.x + L.bin.w / 2, y: L.bin.y + L.bin.h + 30 }
  });
  // Noodle pull and broth simmer: hand-pull cooked noodles to the
  // perfect firmness. A timing station, not a timer — the needle sweeps
  // and the strand changes colour as it passes soft, perfect, overdone.
  stations.push({
    id: 'pull', kind: 'pull', label: 'PULL & SIMMER',
    rect: L.pull, approach: { x: L.pull.x + L.pull.w / 2, y: L.pull.y + L.pull.h + 30 }
  });
  return stations;
};

NB.stationAt = function (state, x, y) {
  for (const st of state.stations) {
    const r = st.rect;
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return st;
  }
  return null;
};

NB.nearestStation = function (state) {
  let best = null;
  let bestD = Infinity;
  for (const st of state.stations) {
    const cx = st.rect.x + st.rect.w / 2;
    const cy = st.rect.y + st.rect.h / 2;
    const d = Math.hypot(state.cook.x - cx, state.cook.y - cy);
    if (d < bestD) { bestD = d; best = st; }
  }
  return bestD <= NB.INTERACT_RANGE + 60 ? best : null;
};

// What the cook can do with the item in hand at each station.
NB.canChop = function (item) {
  const ing = NB.ingredientById(item.ing);
  return item.prep === 'raw' && ing && ing.prep.indexOf('chop') === 0;
};

NB.canCook = function (item) {
  const ing = NB.ingredientById(item.ing);
  if (!ing) return false;
  if (ing.prep === 'cook') return item.prep === 'raw';
  if (ing.prep === 'chop+cook') return item.prep === 'chopped';
  return false;
};

NB.sendCookTo = function (state, station) {
  if (state.chop.active || state.pull.active) return;
  state.cook.tx = station.approach.x;
  state.cook.ty = station.approach.y;
  state.cook.pending = station.id;
  state.cook.moving = true;
};

NB.cookArrive = function (state) {
  const id = state.cook.pending;
  state.cook.pending = null;
  state.cook.moving = false;
  if (!id) return;
  const st = state.stations.find(function (s) { return s.id === id; });
  if (st) NB.useStation(state, st);
};

NB.useStation = function (state, st) {
  const hand = state.cook.hand;
  if (st.kind === 'crate') {
    if (hand.length >= NB.HAND_SLOTS) {
      NB.addToast(state, 'Hands full!', '#e5484d');
      return;
    }
    hand.push(NB.makeItem(st.ing));
    NB.playSound('grab');
    return;
  }
  if (st.kind === 'chop') {
    if (state.chop.active) return;
    const idx = hand.findIndex(NB.canChop);
    if (idx < 0) {
      NB.addToast(state, 'Nothing to chop — grab Chicken, Chili or Greens', '#ffb347');
      return;
    }
    state.chop = { active: true, item: hand.splice(idx, 1)[0], t: 0, dur: NB.CHOP_SECONDS };
    NB.playSound('chop');
    return;
  }
  if (st.kind === 'wok') {
    const burner = state.woks[st.burner];
    if (burner.item) {
      if (burner.item.state === 'ready' || burner.item.state === 'burnt') {
        if (hand.length >= NB.HAND_SLOTS) {
          NB.addToast(state, 'Hands full!', '#e5484d');
          return;
        }
        hand.push({ ing: burner.item.ing, prep: burner.item.state === 'burnt' ? 'burnt' : 'cooked' });
        burner.item = null;
        NB.playSound('grab');
      } else {
        NB.addToast(state, 'Still cooking…', '#ffb347');
      }
      return;
    }
    const idx = hand.findIndex(NB.canCook);
    if (idx < 0) {
      NB.addToast(state, 'Nothing to cook — grab Noodles, Egg or chopped Chicken', '#ffb347');
      return;
    }
    const item = hand.splice(idx, 1)[0];
    burner.item = { ing: item.ing, state: 'cooking', t: 0, readyT: 0 };
    NB.playSound('sizzle');
    return;
  }
  if (st.kind === 'pull') {
    if (state.pull.active) {
      NB.lockPull(state);
      return;
    }
    if (state.chop.active) return;
    const idx = hand.findIndex(function (it) { return it.ing === 'noodles' && it.prep === 'cooked'; });
    if (idx < 0) {
      NB.addToast(state, 'Bring cooked noodles here to pull', '#ffb347');
      return;
    }
    state.pull = { active: true, item: hand.splice(idx, 1)[0], t: 0 };
    NB.playSound('sizzle');
    return;
  }
  if (st.kind === 'plate') {
    for (let i = 0; i < hand.length; i++) {
      const hit = NB.orderNeeding(state, hand[i]);
      if (hit) {
        state.plateFor = hit.order.id;
        hit.slot.done = true;
        state.plate.items.push(hand.splice(i, 1)[0]);
        NB.playSound('plate');
        if (NB.plateComplete(state)) {
          NB.addToast(state, 'Plate ready — serve it!', '#58b368');
          NB.playSound('ready');
        }
        return;
      }
    }
    NB.addToast(state, 'No order needs that right now', '#ffb347');
    return;
  }
  if (st.kind === 'serve') {
    if (NB.plateComplete(state)) {
      NB.servePlate(state);
    } else {
      NB.addToast(state, 'Plate is not finished yet', '#ffb347');
    }
    return;
  }
  if (st.kind === 'bin') {
    if (hand.length > 0) {
      const gone = hand.shift();
      NB.addToast(state, 'Tossed ' + NB.itemLabel(gone), '#9aa5ad');
    } else if (state.plate.items.length > 0) {
      NB.clearPlate(state);
      NB.addToast(state, 'Plate cleared', '#9aa5ad');
    }
    return;
  }
};

NB.clearPlate = function (state) {
  state.plate.items = [];
  if (state.plateFor !== null) {
    const order = state.orders.find(function (o) { return o.id === state.plateFor; });
    if (order) order.needs.forEach(function (n) { n.done = false; });
  }
  state.plateFor = null;
};

// Where the pull needle sits right now: a triangle wave, 0 at the soft
// end, 1 at the overdone end, sweeping back and forth.
NB.pullPos = function (state) {
  const phase = (state.pull.t / NB.PULL_SWEEP) % 2;
  return phase < 1 ? phase : 2 - phase;
};

// Lock the pull where the needle is. Green band: the noodles come out
// perfect and pay a bonus at serve. Soft or overdone: still good noodles,
// just no bonus — a miss costs the bonus, never the dish.
NB.lockPull = function (state) {
  if (!state.pull.active) return;
  const pos = NB.pullPos(state);
  const item = state.pull.item;
  state.pull = { active: false, item: null, t: 0 };
  if (pos >= NB.PULL_PERFECT_LO && pos <= NB.PULL_PERFECT_HI) {
    item.perfect = true;
    if (state.cook.hand.length < NB.HAND_SLOTS) state.cook.hand.push(item);
    NB.addToast(state, 'Perfect pull! +$4 at serve', '#ffd166');
    NB.burst(state, 660, 380, '#ffd166', 12);
    NB.playSound('ready');
  } else if (pos < NB.PULL_PERFECT_LO) {
    if (state.cook.hand.length < NB.HAND_SLOTS) state.cook.hand.push(item);
    NB.addToast(state, 'Too soft — still good noodles', '#ffb347');
    NB.playSound('plate');
  } else {
    if (state.cook.hand.length < NB.HAND_SLOTS) state.cook.hand.push(item);
    NB.addToast(state, 'Overworked — no bonus this time', '#ffb347');
    NB.playSound('plate');
  }
};

NB.updateKitchen = function (state, dt) {
  // Chopping job.
  if (state.chop.active) {
    state.chop.t += dt;
    if (state.chop.t >= state.chop.dur) {
      const item = state.chop.item;
      item.prep = 'chopped';
      if (state.cook.hand.length < NB.HAND_SLOTS) state.cook.hand.push(item);
      state.chop = { active: false, item: null, t: 0, dur: NB.CHOP_SECONDS };
      NB.playSound('chopDone');
    }
  }
  // Noodle pull: the needle keeps sweeping until the cook locks it.
  if (state.pull.active) state.pull.t += dt;
  // Perfect-serve celebration: the plate slides and the popup lives
  // for half a second, then clears itself.
  if (state.serveFx) {
    state.serveFx.t += dt;
    if (state.serveFx.t >= state.serveFx.dur) state.serveFx = null;
  }
  // Wok burners.
  for (const burner of state.woks) {
    if (!burner.item) continue;
    if (burner.item.state === 'cooking') {
      burner.item.t += dt;
      if (burner.item.t >= NB.COOK_SECONDS) {
        burner.item.state = 'ready';
        burner.item.readyT = 0;
        NB.playSound('ready');
      }
    } else if (burner.item.state === 'ready') {
      burner.item.readyT += dt;
      if (burner.item.readyT > NB.READY_WINDOW) {
        burner.item.state = 'burnt';
        NB.addToast(state, 'Burnt! Toss it in the bin', '#e5484d');
        NB.playSound('burnt');
      }
    }
  }
  // Cook movement toward the target point.
  const cook = state.cook;
  if (cook.moving) {
    const dx = cook.tx - cook.x;
    const dy = cook.ty - cook.y;
    const d = Math.hypot(dx, dy);
    const step = NB.COOK_SPEED * dt;
    if (d <= step) {
      cook.x = cook.tx;
      cook.y = cook.ty;
      NB.cookArrive(state);
    } else {
      cook.x += (dx / d) * step;
      cook.y += (dy / d) * step;
      cook.face = dx < 0 ? -1 : 1;
    }
  }
  // Toasts and particles fade.
  for (let i = state.toasts.length - 1; i >= 0; i--) {
    state.toasts[i].ttl -= dt;
    if (state.toasts[i].ttl <= 0) state.toasts.splice(i, 1);
  }
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.ttl -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 60 * dt;
    if (p.ttl <= 0) state.particles.splice(i, 1);
  }
};

NB.addToast = function (state, text, color) {
  state.toasts.push({ text: text, color: color || '#fff3dc', ttl: 2.2 });
  if (state.toasts.length > 3) state.toasts.shift();
};

NB.burst = function (state, x, y, color, n) {
  for (let i = 0; i < n; i++) {
    const a = state.rng() * Math.PI * 2;
    const sp = 40 + state.rng() * 120;
    state.particles.push({
      x: x, y: y,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60,
      ttl: 0.6 + state.rng() * 0.5, color: color,
      r: 2 + state.rng() * 3
    });
  }
};
