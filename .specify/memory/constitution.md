# FishVN Game Constitution

This document defines the binding architectural principles, coding standards, and verification guidelines for the **Ngư Ông Bất Ổn (FishVN)** codebase. All features, UI upgrades, and modifications must strictly comply with these rules.

---

## Core Principles

### I. Giao diện & Phong cách HTML/CSS (HTML/CSS Styling & Accessibility)
To ensure maximum responsiveness, maintainability, and clean code separation, the following guidelines are mandatory:
- **No Inline Styles:** Do not use the `style="..."` attribute or inline JavaScript mouseover/mouseout styles on any HTML elements. All visual styles must reside in `css/style.css`.
- **Accessible Controls:** Any input field or selection dropdown (`input`, `select`) must have a descriptive `title` attribute or `placeholder` to satisfy accessibility checkers.
- **HTML5 Compliance:** Do not use self-closing slash syntax on void elements (use `<input>` instead of `<input />`).
- **Entity Encoding:** Always write raw ampersand symbols as `&amp;` inside HTML text content.
- **Vendor Prefixes:** Vendor-prefixed properties (like `-webkit-backdrop-filter`) must be declared BEFORE their standard, prefix-free counterparts (like `backdrop-filter`).
- **Whitespaces:** Avoid trailing whitespaces at the end of lines.

---

### II. Quản lý trạng thái & Lưu dữ liệu (State Integrity & Persistence)
Player save data integrity is vital to prevent progress loss:
- **Hybrid Storage:** All state parameters must persist using the hybrid database wrapper (`db`) supporting local storage fallbacks and server sync.
- **Backwards Compatibility:** Any modifications to the player schema (e.g., progression parameters, pet variables) must include backward-compatible migration logic to seamlessly import legacy save profiles on launch.
- **State Synchronization:** The UI elements displaying progression states (such as gold, level, and experience) must be explicitly synchronized upon startup (via `updateStatsPanel` or `beforeRenderUIUpdates`) and updated after any transaction or reward event.

---

### III. Hỗ trợ đa ngôn ngữ (Bilingual & i18n Support)
The game must fully support Vietnamese and English locales:
- **Translation Declarations:** All user-facing texts, action logs, item names, and descriptions must be defined bilingual inside `js/modules/i18n.js` and `js/data/translations-content.js`.
- **Dynamic Translation Binding:** Standard UI elements must use the `data-i18n` attributes for static translations, and dynamic notifications must leverage translating helpers to fetch localized strings.

---

### IV. Quy trình kiểm định chất lượng (Development Verification)
To maintain runtime stability and ensure the application starts without crashing in Electron:
- **JavaScript Syntax Check:** Before committing any changes, you must run syntax validation locally using:
  ```powershell
  npm run check:js
  ```
- **Error Handling:** All storage reads, cloud synchronization fetches, and file resource operations must be wrapped in `try-catch` structures with appropriate fallback behavior to keep the game playable offline.
