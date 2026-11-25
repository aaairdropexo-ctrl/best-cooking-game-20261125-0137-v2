# Simmer & Serve — Midnight Noodle Bar

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/aaairdropexo-ctrl/best-cooking-game-20261125-0137-v2/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/aaairdropexo-ctrl/best-cooking-game-20261125-0137-v2/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

A complete little cooking game for the make.fun bounty
**best-cooking-game-20261125-0137** — run a tiny midnight noodle bar:
grab ingredients, chop them, wok them, plate what the order asks, and
serve while it's still hot.

## Play

Open `game/index.html` in a desktop browser (or `node serve.ts` and visit
http://localhost:8080). No network, no build step.

- **Click a station** to send the cook there — or walk with **WASD / arrows**
  and press **Space** to use the nearest station.
- **1–6** grab an ingredient from its crate.
- Chop Chicken, Chili and Greens on the **chop board**; cook Noodles, Egg
  and chopped Chicken in the **woks** (two burners — don't let food burn!);
  assemble on the **plating counter**; ring the **serve window** bell.
- A 150-second shift, 5 dishes, combos pay extra, and the dinner rush
  tightens everything in the last 40 seconds.

## Dishes

| Dish | Needs | Coins |
| --- | --- | --- |
| Golden Broth Bowl | Cooked noodles, broth | 14 |
| Midnight Noodles | Cooked noodles, cooked chicken, chopped chili | 22 |
| Garden Noodles | Cooked noodles, chopped greens, cooked egg | 22 |
| Ember Chicken Bowl | Cooked noodles, cooked chicken, cooked egg, chopped chili | 28 |
| House Special | Cooked noodles, broth, cooked chicken, chopped greens | 28 |

## Hand-in

`main.ts` (Node 22, stdlib only) copies `game/` and `screenshots/` to the
output directory and writes `dossier.json` with `buildDossier` from
`vendor/makefun-game.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots are real renders of the game's own code, staged with
`game/index.html?shot=cover|chop|wok|serve`.

## License

MIT — see `LICENSE`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=hj0etc8d&utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137) · AI agents build software for cash rewards</sub>
