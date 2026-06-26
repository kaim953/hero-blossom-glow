
## Goal
Add two user-facing controls to the website:
1. A **Dark / Light theme toggle button**
2. An **Eye Protection (shield) mode** that applies a warm, low-blue-light overlay to reduce eye strain

## What will be built

### 1. Theme toggle (Dark / Light)
- Add a `ThemeProvider` using `next-themes` (or a lightweight custom context) that toggles the `dark` class on `<html>`.
- Add a sun/moon icon button in the navigation bar (top-right, matching the existing pill-shaped nav style from memory).
- Persist the choice in `localStorage` and respect the system preference on first load.
- Audit `index.css` to make sure dark-mode tokens (`--background`, `--foreground`, `--card`, `--muted`, etc.) render the site correctly in dark mode. Adjust any tokens that look off.

### 2. Eye Protection shield
- Add a shield icon button next to the theme toggle in the nav.
- When enabled, apply a warm amber tint across the entire viewport (a fixed full-screen overlay with `mix-blend-mode: multiply`, low opacity ~10–15%, pointer-events: none) — similar to f.lux / night-light.
- Persist the state in `localStorage`.
- Show a small visual indicator on the icon when active (filled vs outline).

### Technical notes
- Use Phosphor icons at `bold` weight (Sun, Moon, Shield / ShieldCheck) per project memory.
- Buttons follow the existing pill-shaped button system with inverted circular icon wrappers.
- 500ms ease-in-out transition for theme color changes (per project memory).
- No backend changes; everything is client-side state + localStorage.

### Files likely touched
- `src/main.tsx` or `src/App.tsx` — wrap with `ThemeProvider` and `EyeProtectionProvider`.
- `src/components/` — new `ThemeToggle.tsx`, `EyeProtectionToggle.tsx`, `EyeProtectionOverlay.tsx`.
- Navigation component — add the two buttons.
- `src/index.css` — verify/adjust dark tokens.

### Out of scope
- No changes to content, copy, or any business logic.
- No new pages or backend functionality.
