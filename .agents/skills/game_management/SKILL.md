---
name: game_management
description: Manage and run code validation, local execution, and economy simulations in the Ngư Ông Bất Ổn project.
---

# Game Management Skill

Use this skill when you need to run tests, validate files, run local test builds of the game, or run game simulations (economy/fish rates).

## Available Commands

### Code Syntax Checks
Before submitting or recommending changes to Javascript files under `js/` or `electron/`, check their syntax:
```powershell
npm run check:js
```

### Local Play & Manual Test
To launch and test the Electron app locally:
```powershell
npm start
```

### Simulation Commands
Use these commands to run simulations when debugging rates, game economy, or balancing fish items:
- **Analyze Fish Balance:**
  ```powershell
  npm run analyze:fish
  ```
- **Simulate Fish Rolls:**
  ```powershell
  npm run simulate:fish
  ```
- **Simulate Economy Progression:**
  ```powershell
  npm run simulate:economy
  ```
