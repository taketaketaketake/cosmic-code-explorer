import './style.css';
import { IntroScreen } from './scenes/IntroScreen.js';

// Import assets so Vite can process them
import rocketImg from './assets/rocket.png';
import debugKidImg from './assets/characters/debug-kid.png';
import loopKidImg from './assets/characters/loop-kid.png';
import ifthenKidImg from './assets/characters/ifthen-kid.png';

/**
 * The main entry point for the application.
 * This function waits for the HTML document to be fully loaded
 * before trying to manipulate any elements.
 */
function main() {
    // Set the image sources now that we know the elements exist
    document.getElementById('launch-button').src = rocketImg;
    document.getElementById('debug-kid-img').src = debugKidImg;
    document.getElementById('loop-kid-img').src = loopKidImg;
    document.getElementById('ifthen-kid-img').src = ifthenKidImg;
    
    // Now that images are set, initialize the intro screen logic
    // which adds the click listeners.
    new IntroScreen();
}

// This is the crucial part: it waits for the HTML to be ready
// before running our main function.
document.addEventListener('DOMContentLoaded', main);
