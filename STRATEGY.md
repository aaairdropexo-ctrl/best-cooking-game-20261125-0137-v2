# STRATEGY — Simmer & Serve: Midnight Noodle Bar

## Bounty
best-cooking-game-20261125-0137 — "Make the best cooking game", $250, top 10
paid (#1 $60 … #6–10 $15). Deadline 25 Nov 2026 20:37 WIB. Blind rounds
14:37 / 17:37 / 20:37 WIB. Jury: z-ai/glm-5.3-flash, pairwise, sees ONLY the
contact sheet (cover 768x480 + smaller shots) and a short source outline.
Final heat: top 40 dev board, 3 Swiss rounds + playoff top 12.

## Concept (one sentence)
You run a tiny midnight noodle bar, chopping, stir-frying and plating
orders against the clock while the dinner rush keeps escalating.

## How each jury criterion is answered
1. **Complete cooking game, shown in screenshots** — the cover shows all six
   at once: kitchen + order board (3 tickets) + ingredient crates on the
   counter + one dish mid-assembly on the plate + shift timer + a plate
   ready to serve (shot 4). Every shot is a real render of the game code.
2. **Fun / depth** — 6 dishes from 6 ingredients, each with a different
   prep path (none / chop / cook / chop+cook / chop+toss-cold); 2 wok
   burners for parallel cooking; burn risk if food sits too long; heat bars that cool as a
   dish waits + combo multiplier; spawn rate and patience tighten late
   in the shift. **Power-up:** one gold VIP ticket (30% chance after
   45s, only one at a time, 0.55× patience, $12 tip if served with
   patience left / $4 if late, one human sentence — "for the night-shift
   nurse", and "back again — same as last night" once served); a Pull &
   Simmer station (firmness sweep, green perfect band 0.35–0.65, broth
   temperature gauge, noodles change colour pale → gold → dark, steam
   peaks in the band — locking in the green marks the noodles perfect,
   +$4 on serve); a menu board listing all 5 dishes + prices in one
   place. The VIP is the one human touch; the pull is the one new
   mechanic. Both are visible in the cover and in the shots.
   Dishes: Golden Broth Bowl, Midnight Noodles, Garden Noodles,
   Ember Chicken Bowl, House Special.
   **Final polish:** a 6th dish that BRANCHES the recipes — Sesame
   Greens Bowl ($18, cold): chop greens → toss in chili oil + sesame
   dressing at a new COLD COUNTER (ceramic bowl, sesame bottle, "NO
   WOK" pill), a 1.8s timer like chop, no new minigame; it never touches
   the wok, so the player must choose hot vs cold per ticket. Cold
   orders show a blue border + blue COLD pill + blue patience bar on
   the order board (hot tickets stay red/gold), and the menu board lists
   the cold dish with a blue "NO WOK" badge. The VIP ticket now carries
   a small nurse portrait + a 2-line bubble inside the ticket ("for the
   night-shift nurse" / "something cool, please" for a cold order,
   "the usual, extra hot" for a hot one). Routing is a real commitment:
   tossed greens do not satisfy a hot dish, raw greens are refused at
   the counter, chopped greens are refused at the wok.
   **Final iteration:** the cold dish grows a third component —
   chili-oil drizzle at the cold counter AFTER the 1.8s toss (one short
   1.2s job, no minigame). The dish needs one tossed greens AND one
   drizzled greens, so the player chops greens twice; the drizzle wins
   over a new toss when tossed greens are in hand. The ticket shows 3
   chips (the drizzle chip has a red oil-drop badge), the title card
   lists 3 lines, the plate shows 3 groups. Price stays $18.
3. **Feel / polish** — click-or-keyboard stations answer at once, chop and
   wok progress rings, a big central shift timer, a calm LAST CALL sign
   in the final stretch, steam curls, a noodle-drying rack, serve bell,
   toasts, particles, WebAudio beeps. **Power-up:** a perfect serve
   ALWAYS fires the full package — plate slides toward the hatch, "+$X
   PERFECT!" popup, rising chime, steam burst — while a normal serve is
   just a small sound; a VIP arrival has its own two-note chime. Shots
   2–4 are one journey: the same VIP order travels chop → wok → serve,
   its ticket in all three, progress visible. **Final polish:** shots
   2–4 now follow the SAME cold VIP order — chop greens → toss at the
   cold counter → perfect serve $45 — its ticket in all three with
   progress (0/2 → 1/2 → 2/2). **Final iteration:** the same cold VIP
   order, now 3 components — chop → mid-drizzle (2 of 3 on the plate,
   second greens drizzling at the counter) → perfect serve $45 —
   progress (0/3 → 2/3 → 3/3).
4. **Look / originality** — an original midnight noodle bar, not a burger
   joint clone: warm lamps, wood counters, hand-drawn canvas food icons,
   big readable labels. No commercial game copied. **Power-up:** one
   moment, not a busy kitchen — the cover reads as LAST CALL + one VIP +
   one perfect plate; the darkest pole in a field of bright cartoon
   kitchens (dark darks, warm golds, sharpened, not neutralised).
   **Final iteration:** the plate now draws the assembled dish itself
   (broth pool + noodle strands, nest + chicken + chili rings, nest +
   leaves + fried egg, dressed salad with drizzle + sesame) — six
   distinct silhouettes, a partial plate draws only what is on it; the
   VIP portrait is 44px (was 26) and the bubble text is the largest
   size that fits its width, measured in the browser (18px for the
   staged sentence, 20px only fits the shortest line).
5. **Structure** — one clear job per file: config, recipes, orders,
   kitchen, input, render, audio, main. Names say what each file does.

## Scope (what was cut, and why)
- Cut before building: a second kitchen / level select, an inventory
  system, saved high scores, customer characters walking in. The loop
  (grab → chop → wok → plate → serve) is the whole game; everything else
  is garnish.
- Cut in the power-up round: shop/bowl customisation (invisible in one
  screenshot), multi-stage secret recipe + fail-forward (too big for the
  time), a 6-slot boiler (too big), a scaled-up perfect popup (overflowed
  the canvas edge and covered the station labels — replaced by a static
  popup below the hatch), the pull station's idle hint text (crossed the
  needle and the pot).
- Cut/adapted in the final polish round: NOTHING was cut — all three
  brief items shipped. Adapted, honestly: the cold counter sits below
  the serve hatch, not literally beside the wok (only free rectangle
  that covers no decor and moves no station); the dish name drops the
  word "Cold" (COLD tag + blue border + "No Wok" badge already say it,
  the full name overflowed the ticket); the VIP portrait + bubble live
  inside the ticket, not above the slot (no room above any slot); the
  staged serve-shot cook stands beside the plate, not at the hatch
  approach (that spot puts him on the cold counter and hides its
  label — in live play the overlap at the hatch is transient).
- Cut/adapted in the final iteration round: NOTHING was cut — all
  three brief items shipped. Adapted, honestly: the bubble is 18px,
  not the 20–24px the brief hoped for (the 25-character sentence does
  not fit the 270px ticket at 20px, measured: 226px of 216px
  available — the fit-to-width helper picks the largest size that
  fits, 18px staged, 15px for the longest line); the portrait is
  44px, not 48px (the slot is 136px tall and the heat bar still needs
  its 8px); the cold dish's price stays $18 (no price changes in this
  round, so 3 components at the old price); the stale `3-wok.jpg` was
  deleted from screenshots/ (it broke the dossier build: 5 files over
  the 4 cap); the menu board lists dish names + prices only — the 3
  components read on the order ticket chips and the title cards, not
  on the menu board (no room for 6 dishes × 3 components in 116px).
- Kept: 5 dishes (the 5th costs little once the recipe table exists),
  2 burners (parallel cooking is the depth), burn risk (the tension).

## Risks, honestly
- The jury never plays the game: if the cover is hard to parse at 768px,
  depth scores zero. Mitigation: cover reviewed at 768px by eye.
- Blind board: no live top 5 to measure against. The bar is the kit
  criteria + beating the starter house game (a non-cooking dodge game).
- Provisional rates collapse in the final heat (our own record: −35 and
  −40 points on past game bounties). No provisional number is a result.
