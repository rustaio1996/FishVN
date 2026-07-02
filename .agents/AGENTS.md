# Ngư Ông Bất Ổn - Workspace Rules

These guidelines define formatting, style, and quality standards specific to the "Ngư Ông Bất Ổn" game repository.

## Coding Style & Standards

### HTML Style Requirements
- **No Inline Styles:** Do not use the `style="..."` attribute or inline JavaScript mouseover/mouseout styles on any HTML elements. All visual styles must reside in `css/style.css`.
- **Accessible Controls:** Any input field or selection dropdown (`input`, `select`) must have a descriptive `title` attribute or `placeholder` to satisfy accessibility checkers.
- **HTML5 Tags:** Do not use self-closing slash syntax on void elements (use `<input>` instead of `<input />`).
- **Entity Encoding:** Always write raw ampersand symbols as `&amp;` inside HTML text content.
- **Whitespaces:** Avoid trailing whitespaces at the end of lines.

### CSS Rules
- **Vendor Prefixes:** Vendor-prefixed properties (like `-webkit-backdrop-filter`) must be declared BEFORE their standard, prefix-free counterparts (like `backdrop-filter`).

## Development Verification
- **JS Syntax Verification:** Before committing javascript changes, run syntax check using the workspace checking script:
  ```powershell
  npm run check:js
  ```
