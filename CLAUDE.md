# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cosmic Code Explorer is an interactive educational game built with Vite, PIXI.js, and Tailwind CSS. The game features a space-themed environment where players control a rocket and interact with coding-themed characters (Loop Kid, Debug Kid, If-Then Kid) to learn programming concepts.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`  
- **Preview production build**: `npm run preview`

## Architecture

### Core Structure
- **Entry point**: `src/main.js` - Initializes the App class and manages game lifecycle
- **Scenes**: Located in `src/scenes/`
  - `IntroScreen.js` - Handles character selection and game launch
  - `GameCanvas.js` - Main game scene with PIXI.js setup
- **Components**: Located in `src/components/`
  - `RocketController.js` - Handles keyboard input and rocket movement
  - `CharacterManager.js` - Manages NPC characters and proximity detection
- **Utilities**: Located in `src/utils/`
  - `AssetLoader.js` - Handles PIXI.js asset preloading

### Key Patterns
- ES6 classes are used throughout for component organization
- Event-driven architecture with callback functions for scene transitions
- PIXI.js Application pattern with ticker-based game loop
- Asset management with alias-based loading system
- Boundary checking for movement constraints

### Asset Structure
- Static assets in `public/assets/`:
  - `bg-space.png` - Background texture
  - `rocket.png` - Player sprite
  - `characters/` - Character sprites (loop-kid.png, debug-kid.png, ifthen-kid.png)

### Styling
- Tailwind CSS with custom theme extensions
- Custom colors: `space-dark` (#0c0c1f), `brand-aqua` (#7DF9FF)
- Monospace font family for coding theme
- Responsive design with viewport-based sizing

## Configuration Files

- **Vite**: `vite.config.js` - Asset inclusion and base path configuration
- **Tailwind**: `tailwind.config.js` - Custom theme, colors, and font settings
- **PostCSS**: `postcss.config.js` - Tailwind and Autoprefixer integration

## Dependencies

### Runtime
- `pixi.js` (^8.1.0) - 2D WebGL rendering engine

### Development
- `vite` (^5.2.0) - Build tool and dev server
- `tailwindcss` (^3.4.3) - Utility-first CSS framework
- `postcss` (^8.4.38) - CSS processor
- `autoprefixer` (^10.4.19) - CSS vendor prefixing