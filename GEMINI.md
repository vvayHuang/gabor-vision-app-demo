# Gabor Vision App Demo

## Project Overview

**Gabor Vision** is a visual training application built with **Nuxt 4** and **Vue 3**, designed to enhance contrast sensitivity using Gabor patches. The application strictly adheres to a **Swiss Style (International Typographic Style)** design system, featuring a minimalist aesthetic, strict grid layouts, high-contrast typography, and procedural noise textures.

**Key Features:**
-   **Scientific Training:** Uses procedural Gabor patches generated via `p5.js` with adjustable frequency, contrast, and sigma.
-   **Adaptive Difficulty:** Game logic adjusts grid size (2x2 to 3x3), contrast, and line thickness based on player response time (Response Time Adaptation).
-   **Swiss Aesthetic:** minimalist UI with `Inter` and `Monospace` fonts, precise 0.5px borders, and "retina-ready" rendering.
-   **Performance:** Client-side rendering for graphics to ensure 60fps+ animations and smooth interactions.

## Technical Architecture

### Tech Stack
-   **Framework:** [Nuxt 4](https://nuxt.com) (Vue 3 Composition API)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com) with custom config for Swiss Red (`#FF3B30`), Deep Cool Gray (`#1A1A1B`), and specific spacing.
-   **Graphics:** [p5.js](https://p5js.org/) (wrapped in `GaborPatch.client.vue` for Vue reactivity).
-   **State:** Local Component State (`ref`) + `localStorage` for persistence.
-   **Icons:** `lucide-vue-next`

### Directory Structure (Nuxt 4)
This project uses the modern Nuxt 4 directory structure where application code resides in `app/`.

```
/
├── app/
│   ├── app.vue              # Root component
│   ├── pages/               # Application routes (File-based routing)
│   │   └── index.vue        # Main game container and state manager
│   ├── components/          # Vue components
│   │   ├── GaborPatch.client.vue  # Core renderer (Client-only, p5.js)
│   │   ├── TrainingGrid.vue       # 2x2/3x3 Game Grid & Logic
│   │   └── ResultsOverlay.vue     # End-game statistics
│   ├── composables/         # Shared logic
│   │   └── useAudio.ts      # Audio context management
│   └── assets/              # Static assets (CSS, etc.)
├── nuxt.config.ts           # Nuxt configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json             # Dependencies and scripts
```

## Building and Running

### Prerequisites
-   Node.js (Latest LTS recommended)
-   npm, pnpm, or yarn

### Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Conventions

### 1. Component Design
-   **Client-Only Components:** Any component using `p5.js` or `window` objects (like `GaborPatch`) must be suffixed with `.client.vue` or wrapped in `<ClientOnly>` to avoid SSR hydration mismatches.
-   **Props & Reactivity:** The `GaborPatch` component watches specific props (`frequency`, `contrast`, `phase`) to trigger `p5.redraw()`. This is an optimization to avoid recreating the canvas on every frame.

### 2. Swiss Design System Rules
-   **Borders:** Use `border-[0.5px]` for a sharp, technical look.
-   **Radius:** ALWAYS `rounded-none`. No curves allowed.
-   **Typography:** Mix `sans-serif` (Inter/Helvetica) for headers with `monospace` for data/labels.
-   **Colors:**
    -   Background: `#0F1115` (Deep Dark)
    -   Accent: `#FF3B30` (Swiss Red)
    -   Text: White / Slate-200

### 3. Game Logic (TrainingGrid.vue)
-   **Difficulty Scaling:**
    -   **Speed (<1.2s):** Increases difficulty (lowers contrast, moves to 3x3 grid).
    -   **Struggle (>4s):** Decreases difficulty (increases line thickness/contrast).
-   **Scanning Mode:** At Level 10+, the grid offsets from the center to force eye movement.
