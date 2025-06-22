import * as PIXI from 'pixi.js';
import { GameCanvas } from './scenes/GameCanvas.js';

class GameApp {
    constructor() {
        this.gameContainer = document.querySelector('#game-canvas-container');
        this.start();
    }

    async start() {
        // Get the selected character from the URL (e.g., ?character=loop-kid)
        const urlParams = new URLSearchParams(window.location.search);
        const selectedCharacter = urlParams.get('character');

        if (!selectedCharacter) {
            console.error("No character selected!");
            this.gameContainer.innerHTML = `<div style="color: white; padding: 20px;">Error: No character was selected. Please return to the homepage.</div>`;
            return;
        }

        try {
            const app = new PIXI.Application();
            await app.init({
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: 0x100F3A, // Dark blue background
                resizeTo: window,
            });
            
            this.gameContainer.appendChild(app.canvas);

            // Now we start the actual game scene
            const gameScene = new GameCanvas(app, selectedCharacter);
            await gameScene.start();
            console.log(`Game started with character: ${selectedCharacter}`);

        } catch (error) {
            console.error("Failed to start the game:", error);
        }
    }
}

// Initialize the game when the window loads
window.onload = () => new GameApp();
