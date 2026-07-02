---
name: translation_management
description: Manage internationalization (i18n), translation compilation, and localization integrations in the Ngư Ông Bất Ổn project.
---

# Translation Management Skill

Use this skill when you need to add bilingual text, translate fish names/rarities, update the game's language dictionary, or run i18n scripts.

## Core Translation Files

- **Translation dictionary output:** `js/data/translations-content.js` (loaded directly by the HTML file)
- **Source translation helper:** `scratch/generate_translation_file.js`
- **Fish name catalog:** `scratch/fish_names.json`
- **i18n code integration scripts:** `scratch/i18n_integrate.js` and `scratch/i18n_zones.js`

## Procedures

### 1. Compile Translation Files
Whenever you make updates to the fish catalog or modify `manualFishTranslations` inside `scratch/generate_translation_file.js`, recompile the bilingual dictionary:
```powershell
node scratch/generate_translation_file.js
```
This generates a fresh `js/data/translations-content.js` and integrates it into the client application.

### 2. Integrate i18n Placeholders in Game Core
If you want to apply the bilingual translation engine (`i18n.js` / translations mapping) across game-core logs or zones:
- Run the integration scripts to refactor static Vietnamese text to localized tags:
  ```powershell
  node scratch/i18n_integrate.js
  node scratch/i18n_zones.js
  ```
