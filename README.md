# jchanler-labs
A React site with varied interactive explorations, games, maps, test automation reporting, and small projects.

---

## Theming Engine & Architecture
This project utilizes a pure CSS-based `ThemeToggle` feature leveraging Tailwind CSS v4's native `@theme` support. It transitions between distinct aesthetic modes seamlessly across the platform:
- **Geometric (Default)**: Modern, clean styling with animated background blobs and a tech-industry feel.
- **Retro (90s Neon)**: Magenta and cyan contrasts with monospace fonts.
- **Steampunk**: Brass, rust, and wood color palettes paired with serif typography.
- **Dark Mode**: Integrated explicitly into the toggle for all available themes.

## Project & Route Infrastructure
- `react-router-dom` handles complex client-side routing within a single page application (SPA).
- A responsive, animated navigation bar provides quick traversal between functional areas.

### The Pages Structure
1. **Home (`/`)**: A powerful landing interface utilizing smooth color gradients, hover cards, and micro-animations for a living feel.
2. **Arcade (`/arcade`)**: A bold, retro-inspired interface cataloging interactive browser-based games (Othello, Minesweeper, etc.) using scale animations.
3. **Map (`/map`)**: Integrates reactive components like **OpenStreetMap** (via `react-leaflet`) for mapping, explicitly designed to support mapping tasks ("Broken Atlas")
4. **Media (`/media`)**: Links to Spotify playlists, Youtube videos, and other media I enjoy.
5. **Tests (`/tests`)**: A professional dashboard frame structure for hosting and presenting Allure Playwright automation reports and mock test statistics.

---

## Setup & Executionr

### 1. Prerequisite: Node.js (via NVM)
Recommended to install and utilize Node.js through Node Version Manager (NVM) ensuring isolation:
```bash
# If you don't have NVM, install it:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Load NVM (or restart your terminal)
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install the latest LTS version of Node:
nvm install --lts
nvm use --lts
```

### 2. Install Packages & Run Local Dev Server
Once Node LTS is active, run the following:
```bash
# Install NPM dependencies
npm install

# Start the Vite development server
npm run dev
```
Navigate to your local host (usually `http://localhost:5173/`) to begin browsing!
