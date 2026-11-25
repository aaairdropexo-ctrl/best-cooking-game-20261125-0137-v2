// Input: mouse clicks and keyboard. Clicking a station sends the cook
// there; WASD / arrows walk freely; Space uses the nearest station.

NB.input = { hover: null, keys: {}, mouse: { x: 0, y: 0 } };

NB.attachInput = function (state, canvas) {
  function toGame(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (NB.W / r.width),
      y: (e.clientY - r.top) * (NB.H / r.height)
    };
  }

  canvas.addEventListener('mousemove', function (e) {
    const p = toGame(e);
    NB.input.mouse = p;
    NB.input.hover = state.mode === 'playing' ? NB.stationAt(state, p.x, p.y) : null;
  });

  canvas.addEventListener('click', function (e) {
    const p = toGame(e);
    NB.handleClick(state, p.x, p.y);
  });

  window.addEventListener('keydown', function (e) {
    const k = e.key.toLowerCase();
    NB.input.keys[k] = true;
    if (k === ' ' || k === 'arrowup' || k === 'arrowdown' || k === 'arrowleft' || k === 'arrowright') {
      e.preventDefault();
    }
    NB.handleKey(state, k);
  });

  window.addEventListener('keyup', function (e) {
    NB.input.keys[e.key.toLowerCase()] = false;
  });
};

NB.handleClick = function (state, x, y) {
  if (state.mode === 'title') {
    NB.startShift(state);
    return;
  }
  if (state.mode === 'end') {
    if (state.endGuard <= 0) NB.startShift(state);
    return;
  }
  if (state.paused) return;
  const st = NB.stationAt(state, x, y);
  if (st) {
    // Clicking the pull station while a pull is running locks it.
    if (st.kind === 'pull' && state.pull.active) {
      NB.lockPull(state);
      return;
    }
    NB.sendCookTo(state, st);
  } else if (!state.chop.active && !state.pull.active && !state.cold.active) {
    // Clicking the floor just walks there.
    state.cook.tx = NB.clamp(x, NB.LAYOUT.floor.x + 20, NB.LAYOUT.floor.x + NB.LAYOUT.floor.w - 20);
    state.cook.ty = NB.clamp(y, 300, 500);
    state.cook.pending = null;
    state.cook.moving = true;
  }
};

NB.handleKey = function (state, k) {
  if (k === 'm') {
    state.muted = !state.muted;
    return;
  }
  if (state.mode === 'title' && (k === 'enter' || k === ' ')) {
    NB.startShift(state);
    return;
  }
  if (state.mode === 'end' && (k === 'r' || k === 'enter' || k === ' ')) {
    if (state.endGuard <= 0) NB.startShift(state);
    return;
  }
  if (state.mode !== 'playing' || state.paused) return;
  if (k === 'r') {
    NB.startShift(state);
    return;
  }
  if (k === ' ') {
    const st = NB.nearestStation(state);
    if (st) {
      if (Math.hypot(state.cook.x - (st.rect.x + st.rect.w / 2), state.cook.y - (st.rect.y + st.rect.h / 2)) > NB.INTERACT_RANGE + 60) {
        NB.sendCookTo(state, st);
      } else {
        NB.useStation(state, st);
      }
    }
    return;
  }
  // Number keys 1-6 walk to a crate and grab that ingredient.
  const ing = NB.INGREDIENTS.find(function (g) { return g.key === k; });
  if (ing) {
    const st = state.stations.find(function (s) { return s.id === 'crate-' + ing.id; });
    if (st) NB.sendCookTo(state, st);
  }
};

// Keyboard walking, applied every frame while keys are held.
NB.updateKeyboardMove = function (state, dt) {
  if (state.mode !== 'playing' || state.paused || state.chop.active || state.pull.active || state.cold.active) return;
  const keys = NB.input.keys;
  let dx = 0;
  let dy = 0;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;
  if (keys['w'] || keys['arrowup']) dy -= 1;
  if (keys['s'] || keys['arrowdown']) dy += 1;
  if (dx === 0 && dy === 0) return;
  const len = Math.hypot(dx, dy);
  state.cook.moving = false;
  state.cook.pending = null;
  state.cook.x = NB.clamp(state.cook.x + (dx / len) * NB.COOK_SPEED * dt, NB.LAYOUT.floor.x + 20, NB.LAYOUT.floor.x + NB.LAYOUT.floor.w - 20);
  state.cook.y = NB.clamp(state.cook.y + (dy / len) * NB.COOK_SPEED * dt, 290, 505);
  if (dx !== 0) state.cook.face = dx < 0 ? -1 : 1;
};
