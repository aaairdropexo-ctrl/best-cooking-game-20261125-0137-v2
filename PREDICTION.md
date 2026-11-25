# PREDICTION — Simmer & Serve: Midnight Noodle Bar

Written BEFORE any submit, before any jury verdict. To be compared AFTER
the result. All numbers below are forecasts, not results.

## Forecast (dev phase, vs the four house games)

- Expected dev win rate: **0.55–0.70** (provisional, NOT a result).
- Why that range: the entry is a complete cooking game that shows every
  criterion-1 element in the cover, with real depth (5 dishes, 2 burners,
  burn risk, combos, rush). The starter house game (#2) is a non-cooking
  dodge game, so this entry should beat it clearly. The stronger house
  games are unknown; a mid-to-high dev rate is the honest expectation.
- Expected final heat: **top-40 cut is plausible, top 10 is a stretch.**
  The field is ~3,800 entries; the final heat re-judges from zero and
  provisional rates collapse (our own past collapses: −35 and −40 points).
  A paid place ($15–$60) would need the cover to read decisively better
  than most cooking entries at 768px.

## Power-up round (25 Nov 2026, ~15:00–16:00 WIB) — forecast moved a little, not a lot

What changed, all of it visible in the screenshots (the judge never plays):
- **VIP ticket (gold):** one special order with a human sentence
  ("for the night-shift nurse" / "back again — same as last night"),
  0.55× patience, big tip ($12 if served with patience left, $4 if
  late). The jury is an LLM — it reads that sentence.
- **Pull & Simmer station:** a firmness sweep with a green perfect band
  (0.35–0.65), a broth-temperature gauge, noodles that change colour
  (pale → gold → dark) and steam that peaks in the band. Locking in the
  green marks the noodles perfect (+$4 on serve).
- **Menu board:** all 5 dishes + prices in one place, so depth reads in
  one glance.
- **Perfect-serve package:** a perfect serve ALWAYS fires the full
  package (plate slides toward the hatch + "+$55 PERFECT!" popup +
  rising chime + steam burst); a normal serve is just a small sound.
- **One moment, not a busy kitchen:** the cover is LAST CALL + one VIP +
  one perfect plate. Shots 2–4 are one journey: the SAME VIP order
  travels chop → wok → serve, its ticket in all three.
- **Darkest pole:** dark midnight cover + warm gold, sharpened, not
  neutralised — the field is bright cartoon kitchens.

New forecast: dev win rate **0.60–0.72** (was 0.55–0.70), still
provisional, NOT a result. Top-40 cut still plausible; top 10 still a
stretch, but less of one. Why only a small bump: the entry was already
complete — the power-up makes its depth LEGIBLE to a judge that only
sees screenshots, which is exactly what criteria 2–4 score, but the
field is ~3,800 entries, the board is blind, and provisional rates
collapse −35/−40 in the final heat. No promise of #1, no promise of a
paid place. What is measured, not guessed: the power-up playtest passes
25/25 (VIP spawn + patience + story, pull green/soft/over, perfect VIP
serve pays exactly $55 = 39 + 12 tip + 4, live click-driven VIP loop
end to end, all 4 staged shots render with zero console errors), and
main.ts exits 0 ×2 in a read-only sandbox copy with a byte-identical
dossier (sha 47e42bca…).

## Self-review (before reporting)

1. **Is this weird?** No — checked the cover at 768px AND 300px with my
   own eyes (jury sizes), plus full size. Title, timer 0:38, coins $86,
   combo x3, gold VIP ticket ("Midnight Noodles $22 +TIP", story line
   "for the night-shift nurse" legible), chop board mid-chop, wok with
   noodles cooking, plating with a dish mid-assembly + gold ★, serve
   window, six ingredient crates, pull station + menu board, and the cook
   holding noodles are all readable in one glance. At 300px the gestalt
   holds: dark kitchen, gold VIP, LAST CALL. Fixed in the power-up
   round, found by eye: the perfect popup covered the PLATING/SERVE
   labels (moved below the hatch), the "Plate ready" toast crossed the
   pull station (toasts moved to the top strip), the pull hint text
   crossed the needle/pot (idle hint removed, "SPACE to lock!" tucked
   under the label, steam wisps moved clear of it), and the plate's
   caption/star did not slide with the plate (now they do). No clipped
   text, no overlap, no placeholder text remains in any of the 4 shots.
   The menu rows are small at 768px but the list + prices read.
2. **Is anything missing?** Every criterion-1 element is in the cover.
   Depth is visible: order board with component chips, two wok burners,
   chop progress, plate mid-assembly, pull/firmness meter, menu board,
   VIP ticket with a human sentence. No second kitchen, no save system —
   deliberately cut; the loop is the game.
3. **Can it beat the top 5?** Unknown — the board is blind and hidden, so
   there is no live top 5 to measure against. It can beat the starter
   house game on criterion 1 alone (a cooking game vs a dodge game).
   Whether it beats the best cooking entries depends on how readable the
   cover is at 768px versus theirs. No promise of #1. What is now
   measured, not guessed: the automated playtest passes 25/25, the
   sandbox-like run exits 0 twice with byte-identical output, and
   `makefun check` passed 14/0 (0 failures) on the pre-power-up build —
   the power-up re-check is the lead's job after this round.

## What would change this forecast

- Up: cover reads instantly at 768px (all 6 elements in one glance).
- Down: cover is dense or cluttered (the ACCRETION verdict: "denser and
  harder to parse at a glance"); any gate failure (transcript, sandbox).
