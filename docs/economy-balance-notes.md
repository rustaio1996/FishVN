# Economy Balance Notes

## Commands

```powershell
npm run simulate:economy
npm run simulate:economy -- --casts=50000 --seed=2027
```

## Current Curve

- Upgrade costs are centralized in `economyConfig.upgrades`.
- Player EXP needs are centralized in `economyConfig.expCurve`.
- Upgrade cost has an endgame multiplier starting at upgrade Lv20:
  - `endgameScale: 0.35`
  - `endgamePower: 1.35`

## Latest Simulation Snapshot

Config: `casts=10000`, `seed=2027`.

| Level | Zone | Gold/cast | EXP/cast | EXP need | Upgrade casts read |
| --- | --- | ---: | ---: | ---: | --- |
| Lv1 | song_nuoc | 9.19 | 4.36 | 60 | rod 5, speed 4, loc 7, pet 6, auto 11 |
| Lv5 | ho_nuoc | 20.94 | 7.22 | 148 | rod 16, speed 13, loc 18, pet 21, auto 20 |
| Lv12 | dam_lay | 125.62 | 27.91 | 332 | rod 7, speed 6, loc 9, pet 10, auto 11 |
| Lv25 | tien_canh | 1181.95 | 179.90 | 800 | rod 5, speed 4, loc 3, pet 7, auto 3 |
| Lv30 | vu_tru | 1805.94 | 286.11 | 1161 | rod 9, speed 8, loc 6, pet 13, auto 3 |
| Lv40 | vu_tru | 2822.16 | 388.28 | 2119 | rod 22, speed 18, loc 17, pet 31, auto 5 |

## Read

- Early game now gives quick first upgrades without making every button free.
- Midgame has a reasonable 6-21 cast upgrade cadence.
- Endgame rod/speed/loc/pet no longer collapse to 1-click upgrades.
- Auto remains cheaper to catch up if it lags behind player level; this is intentional because the sim estimates auto upgrade level lower than player level.

