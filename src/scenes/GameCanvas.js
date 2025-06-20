import * as PIXI from 'pixi.js';

import rocketImg from '../assets/rocket.png';
import loopKidImg from '../assets/characters/loop-kid.png';
import debugKidImg from '../assets/characters/debug-kid.png';
import ifthenKidImg from '../assets/characters/ifthen-kid.png';

export class GameCanvas {
    constructor(app, selectedCharacter) {
        this.app = app;
        this.selectedCharacter = selectedCharacter;

        // A container for all game objects that will move with the camera
        this.world = new PIXI.Container();

        // Physics and control properties
        this.velocity = { x: 0, y: 0 };
        this.thrust = 0.08;
        this.drag = 0.985;
        this.maxSpeed = 8;
        this.bankAngle = 0.25;

        // Particle trail properties
        this.particles = [];
        this.particleContainer = new PIXI.Container();
    }

    async start() {
        try {
            await this.loadAssets();
            
            // The solid color background stays on the main stage and does not move
            this.createFixedBackground();
            
            // Add the 'world' container to the stage. This will be our moving camera view.
            this.app.stage.addChild(this.world);
            
            // Add stars, particles, the rocket, and characters to the 'world' container
            this.createStarfield(3000, 200);
            this.world.addChild(this.particleContainer);
            this.createRocket();
            this.createCharacters();
            
            this.bindControls();
        } catch (error) {
            console.error("A critical error occurred during game scene setup:", error);
        }
    }

    async loadAssets() {
        const assetsToLoad = [
            { alias: 'rocket', src: rocketImg },
            { alias: 'loop-kid', src: loopKidImg },
            { alias: 'debug-kid', src: debugKidImg },
            { alias: 'ifthen-kid', src: ifthenKidImg },
        ];

        try {
            await PIXI.Assets.load(assetsToLoad);
        } catch (error) {
            console.error('Error loading asset bundle with PIXI.Assets.load():', error);
            throw error;
        }
    }

    createFixedBackground() {
        const background = new PIXI.Graphics();
        background.fill(0x100F3A);
        background.rect(0, 0, this.app.screen.width, this.app.screen.height);
        background.fill();
        this.app.stage.addChild(background);
    }
    
    createStarfield(size, starCount) {
        const starfield = new PIXI.Container();
        for (let i = 0; i < starCount; i++) {
            const star = new PIXI.Graphics();
            star.beginFill(0xFFFFFF, Math.random() * 0.5 + 0.5);
            star.drawCircle(0, 0, Math.random() * 1.5 + 0.5);
            star.endFill();
            
            star.x = Math.random() * size - size / 2;
            star.y = Math.random() * size - size / 2;
            
            starfield.addChild(star);
        }
        this.world.addChild(starfield);
    }

    createRocket() {
        const rocketTexture = PIXI.Texture.from('rocket');
        this.rocket = new PIXI.Sprite(rocketTexture);
        this.rocket.anchor.set(0.5);
        this.rocket.x = 0;
        this.rocket.y = 0;
        this.rocket.scale.set(0.75);
        this.world.addChild(this.rocket);
    }

    createCharacters() {
        const characterData = [
            { alias: 'loop-kid', x: 500, y: 200 },
            { alias: 'debug-kid', x: -400, y: 500 },
            { alias: 'ifthen-kid', x: 200, y: -600 }
        ];

        characterData.forEach(data => {
            const texture = PIXI.Texture.from(data.alias);
            const character = new PIXI.Sprite(texture);
            character.anchor.set(0.5);
            character.x = data.x;
            character.y = data.y;
            character.scale.set(0.5);
            this.world.addChild(character);
        });
    }

    emitParticle() {
        const particle = new PIXI.Graphics();
        const colors = [0xFFF3B0, 0xFFDE7C, 0xFFB74D, 0xFF8F00];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const exhaustPointLocal = new PIXI.Point(0, this.rocket.height / 2);
        const exhaustPointGlobal = this.rocket.toGlobal(exhaustPointLocal);
        const particlePosition = this.world.toLocal(exhaustPointGlobal);

        const spread = (Math.random() - 0.5) * 15;
        particle.x = particlePosition.x + spread;
        particle.y = particlePosition.y + spread;

        particle.beginFill(randomColor, 0.7);
        particle.drawCircle(0, 0, Math.random() * 8 + 4);
        particle.endFill();

        particle.alphaDecay = Math.random() * 0.01 + 0.005;
        particle.scaleDecay = Math.random() * 0.01 + 0.005;
        particle.velocity = { 
            x: (Math.random() - 0.5) * 0.5, 
            y: (Math.random() - 0.5) * 0.5 
        };

        this.particleContainer.addChild(particle);
        this.particles.push(particle);
    }

    bindControls() {
        this.keys = {};
        window.addEventListener('keydown', e => (this.keys[e.key] = true));
        window.addEventListener('keyup', e => (this.keys[e.key] = false));
        this.app.ticker.add(() => this.update());
    }

    update() {
        let isAccelerating = false;

        if (this.keys['ArrowUp']) { this.velocity.y -= this.thrust; isAccelerating = true; }
        if (this.keys['ArrowDown']) { this.velocity.y += this.thrust; isAccelerating = true; }
        if (this.keys['ArrowLeft']) { this.velocity.x -= this.thrust; isAccelerating = true; }
        if (this.keys['ArrowRight']) { this.velocity.x += this.thrust; isAccelerating = true; }

        this.velocity.x *= this.drag;
        this.velocity.y *= this.drag;
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
        }
        this.rocket.x += this.velocity.x;
        this.rocket.y += this.velocity.y;

        let targetRotation = 0;
        if (this.keys['ArrowLeft']) targetRotation = -this.bankAngle;
        else if (this.keys['ArrowRight']) targetRotation = this.bankAngle;
        this.rocket.rotation += (targetRotation - this.rocket.rotation) * 0.08;

        const targetX = -this.rocket.x + this.app.screen.width / 2;
        const targetY = -this.rocket.y + this.app.screen.height / 2;
        this.world.x += (targetX - this.world.x) * 0.05;
        this.world.y += (targetY - this.world.y) * 0.05;

        if (isAccelerating) {
            for (let i = 0; i < 3; i++) this.emitParticle();
        }
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.alpha -= particle.alphaDecay;
            particle.scale.x -= particle.scaleDecay;
            particle.scale.y -= particle.scaleDecay;
            if (particle.alpha <= 0 || particle.scale.x <= 0) {
                this.particleContainer.removeChild(particle);
                this.particles.splice(i, 1);
            }
        }
    }
}
