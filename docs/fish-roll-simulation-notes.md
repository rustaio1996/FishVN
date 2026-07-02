# Fish Roll Simulation Notes

## Commands

```powershell
npm run simulate:fish
npm run simulate:fish -- --level=40 --luck=3 --dragon-eye=2 --seed=2026
```

## Baseline: Just-Unlocked Zone

- Config: `casts=10000`, `luck=1`, `level=zone level`, `dragonEye=0`, `seed=1996`.
- `khu_bi_mat`: pool 5, rare 100%. This is expected because the zone is secret-flavored and many entries are gated by `minLevel` or `hidden`.
- `nha_may`: trash 61.56%, epic 33.48%, legendary 4.96%. This matches the polluted factory fantasy.
- `vu_tru`: legendary 85.63%, supreme 14.37%. No `Vô Tri` without Dragon Eye 2 because those entries are hidden.

## Endgame Chase

- Config: `casts=10000`, `level=40`, `luck=3`, `dragonEye=2`, `seed=2026`.
- `khu_bi_mat`: rare 46.09%, epic 37.97%, legendary 10.75%, supreme 5.19%.
- `tien_canh`: legendary 76.91%, supreme 23.09%.
- `vu_tru`: legendary 55.42%, supreme 44.58% (`Tối Cao` 29.65%, `Vô Tri` 14.93%).

## Current Balance Read

- Phase 3 tooling is ready: the game can now simulate catch distribution before changing weights.
- No immediate nerf was applied yet. If `Vô Tri` should feel extremely rare, start by lowering `vu_tru.rarityMods["Vô Tri"]` or `rarityConfig["Vô Tri"].baseWeight`.
- If `khu_bi_mat` feels too thin at Lv8, add more non-hidden `Hiếm` / `Siêu Bựa` fish with `minLevel` 8-10.

