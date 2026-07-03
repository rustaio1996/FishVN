Repo review checklist - Ngư Ông Bất Ổn

1. Security

- [ ] Validate and strictly parse imported JSON saves (`importSaveFile`) against a schema. Do not `eval` or trust external data.
- [ ] Authenticate cloud sync endpoints or require a per-user token. Avoid anonymous writes to global API.
- [ ] Sanitize any user/cloud-provided strings before inserting into innerHTML (log, names, achievements). Already added sanitizer for logs.

2. Accessibility

- [ ] Add `role="dialog"` and `aria-modal` to major modals; ensure focus trap and restore on close (implemented for confirm modals).
- [ ] Ensure all interactive non-button elements have `role="button"` and keyboard handlers (Enter/Space).
- [ ] Add explicit `<label for=>` for inputs like `playerNameInput`, `cloudSyncIdInput`.

3. Performance

- [ ] Add `defer` to script tags or convert modules to `type="module"` where appropriate.
- [ ] Bundle and minify JS/CSS for production; enable gzip/brotli on server.
- [ ] Lazy-load heavy sections like encyclopedia and sprite assets.

4. Maintainability

- [ ] Replace many inline `onclick` handlers with centralized event listeners.
- [ ] Split `game-core.js` into smaller modules (rendering, economy, save, ui).
- [ ] Add unit tests for economy functions (`getUpgradeCost`, `calculateCurrentPrice`, `getExpNeededForLevel`).

5. Gameplay / Balance

- [ ] Review RNG weighting and pity system caps to avoid abuse.
- [ ] Add telemetry metrics to measure average gold per hour, rare drop rates, and pity usage.

Suggested quick fixes applied:

- Sanitize log outputs in `js/game-core.js`.
- Improve confirm modal accessibility and focus handling in `js/game-core.js`.

Next actions:

- I can implement JSON schema validation for save imports and audit `db.save`/`db.load` for error handling.
- I can add labels and ARIA attributes to `NguOngBatOn.html` for key inputs and modals.
