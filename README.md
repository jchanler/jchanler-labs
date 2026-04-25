# jchanler-labs
A React site with varied interactive explorations, games, maps, test automation reporting, and small projects.



---

## Theming Engine & Architecture
This project utilizes a pure CSS-based `ThemeToggle` feature leveraging Tailwind CSS v4's native `@theme` support. It transitions between distinct aesthetic modes seamlessly across the platform:
- **Default**: Modern, clean styling with animated background blobs and a tech-industry feel.
- **Neon**: Magenta and cyan contrasts with monospace fonts.
- **Vintage**: Brass, rust, and wood color palettes paired with serif typography.
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
6. **Links (`/links`)**: A collection of useful links for development and other fun stuff.

---

## Setup & Run Locally

### 1. Prerequisite: Node.js (via NVM)
https://github.com/nvm-sh/nvm

```bash
# Install Node 24 as defined in .nvmrc:
nvm install
nvm use
```

### 2. Install Packages & Run Local Dev Server
Once Node LTS is active, run the following:
```bash
# Install NPM dependencies
npm install

# Start the Vite development server
npm run dev
```
Navigate to your local host (usually `http://localhost:5173/`) to begin browsing

---

## References

[Lucide](https://lucide.dev/) - Open Source icon library
[Coolors](https://coolors.co/) - Color Palette Generator
[Unplash](https://unsplash.com/) - 
[Pexels](https://www.pexels.com/) - Free stock photos

## Color Palettes
[Sunrise For you](https://www.schemecolor.com/sunrise-for-you.php)
[Fantasy Purple Orange Blue](https://www.schemecolor.com/fantasy-purple-orange-blue.php)
[Neon Multicolored Heart](https://www.schemecolor.com/neon-multicolored-heart.php)