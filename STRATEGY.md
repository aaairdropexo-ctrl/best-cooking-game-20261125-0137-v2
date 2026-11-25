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
2. **Fun / depth** — 5 dishes from 6 ingredients, each with a different
   prep path (none / chop / cook / chop+cook); 2 wok burners for parallel
   cooking; burn risk if food sits too long; heat bars that cool as a
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
3. **Feel / polish** — click-or-keyboard stations answer at once, chop and
   wok progress rings, a big central shift timer, a calm LAST CALL sign
   in the final stretch, steam curls, a noodle-drying rack, serve bell,
   toasts, particles, WebAudio beeps. **Power-up:** a perfect serve
   ALWAYS fires the full package — plate slides toward the hatch, "+$X
   PERFECT!" popup, rising chime, steam burst — while a normal serve is
   just a small sound; a VIP arrival has its own two-note chime. Shots
   2–4 are one journey: the same VIP order travels chop → wok → serve,
   its ticket in all three, progress visible.
4. **Look / originality** — an original midnight noodle bar, not a burger
   joint clone: warm lamps, wood counters, hand-drawn canvas food icons,
   big readable labels. No commercial game copied. **Power-up:** one
   moment, not a busy kitchen — the cover reads as LAST CALL + one VIP +
   one perfect plate; the darkest pole in a field of bright cartoon
   kitchens (dark darks, warm golds, sharpened, not neutralised).
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
- Kept: 5 dishes (the 5th costs little once the recipe table exists),
  2 burners (parallel cooking is the depth), burn risk (the tension).

## Risks, honestly
- The jury never plays the game: if the cover is hard to parse at 768px,
  depth scores zero. Mitigation: cover reviewed at 768px by eye.
- Blind board: no live top 5 to measure against. The bar is the kit
  criteria + beating the starter house game (a non-cooking dodge game).
- Provisional rates collapse in the final heat (our own record: −35 and
  −40 points on past game bounties). No provisional number is a result.
