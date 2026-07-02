# Technical Implementation Plan: Bể Cá Báo Thủ (Pet Tank Upgrade)

**Branch**: `001-pet-tank-upgrade` | **Date**: 2026-07-02 | **Spec**: [specs/001-pet-tank-upgrade/spec.md](file:///d:/FishVN/specs/001-pet-tank-upgrade/spec.md)

## Summary
Refactor the single-pet system to a multi-slot pet simulator. Create a standalone "Bể Báo" tab, styling it responsively on mobile, and implementing petting, slot upgrading, feeding, and class selection.

## Technical Context
- **Language/Version**: JavaScript (ES6)
- **Target Platform**: Desktop (Electron) & Mobile Web
- **Storage**: IndexedDB (via Hybrid Database wrapper `db`) and fallback LocalStorage

## Project Structure

### Documentation
```text
specs/001-pet-tank-upgrade/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
└── tasks.md             # Tasks checklist
```

### Source Code Changes
- **NguOngBatOn.html**: Create new nav tab button and separate `#petTankPanel` containers.
- **css/style.css**: Add layouts for the new tab panels and mobile stylesheet support.
- **js/data/progression-data.js**: Add `petTank` slots object structure to default state.
- **js/game-core.js**: Add active pet helper handlers, `renderPetTankTab()`, and `switchMobileTab('pet')` routing callbacks.
- **js/modules/i18n.js**: Translate tab interface keys to vi and en.
