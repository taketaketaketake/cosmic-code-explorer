import './style.css';
import * as PIXI from 'pixi.js';
import { GameCanvas } from './scenes/GameCanvas.js';
import { IntroScreen } from './scenes/IntroScreen.js';

class App {
    constructor() {
        this.gameContainer = document.querySelector('#game-canvas-container');
        // Pass the asyncstartGame method to the intro screen
        this.intro = new IntroScreen(this.startGame.bind(this));
    }

    async startGame(selectedCharacter) {
        try {
            console.log('Starting game with character:', selectedCharacter);
            this.intro.hide();

            // Show the game container
            this.gameContainer.style.display = 'block';

            this.pixiApp = new PIXI.Application();
            await this.pixiApp.init({
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: 0x0c0c1f,
                resizeTo: window,
            });
            
            console.log('PIXI app initialized, canvas:', this.pixiApp.canvas);
            this.gameContainer.appendChild(this.pixiApp.canvas);

            // Pass the selected character to GameCanvas
            this.gameScene = new GameCanvas(this.pixiApp, selectedCharacter);
            await this.gameScene.start();
            console.log('Game scene started successfully');
        } catch (error) {
            console.error('Error starting game:', error);
        }
    }
}

window.onload = () => new App();