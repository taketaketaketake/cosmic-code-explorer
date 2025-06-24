import * as PIXI from 'pixi.js';

import rocketImg from '../assets/rocket.png';
import loopKidImg from '../assets/characters/loop-kid.png';
import debugKidImg from '../assets/characters/debug-kid.png';
import ifthenKidImg from '../assets/characters/ifthen-kid.png';

export class GameCanvas {
    constructor(app, selectedCharacter) {
        this.app = app;
        this.selectedCharacter = selectedCharacter;
        this.world = new PIXI.Container();

        // Physics properties
        this.velocity = { x: 0, y: 0 };
        this.thrust = 0.08;
        this.drag = 0.985;
        this.maxSpeed = 8;
        this.rotationSpeed = 0.05;
        
        // Keyboard control properties
        this.bankAngle = 0.25; 
        this.keys = {};

        // Character properties
        this.characters = []; 
        this.characterDrag = 0.96; 

        // Particle trail properties
        this.particles = [];
        this.particleContainer = new PIXI.Container();

        // Pointer control properties
        this.isPointerDown = false;
        this.pointerLocation = new PIXI.Point();
    }

    async start() {
        try {
            await this.loadAssets();
            
            this.createFixedBackground();
            this.app.stage.addChild(this.world);
            
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
            console.error('Error loading asset bundle:', error);
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
        this.rocket.scale.set(0.4);
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
            character.scale.set(0.25);
            character.velocity = { x: 0, y: 0 };
            character.rotationSpeed = 0;
            
            this.world.addChild(character);
            this.characters.push(character);
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

    checkCollisions() {
        const radiusScaleFactor = 0.7;

        for (const character of this.characters) {
            const rocketRadius = (this.rocket.width / 2) * radiusScaleFactor;
            const characterRadius = (character.width / 2) * radiusScaleFactor;
            const collisionDistance = rocketRadius + characterRadius;
            
            const dx = character.x - this.rocket.x;
            const dy = character.y - this.rocket.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < collisionDistance) {
                const overlap = collisionDistance - distance;
                const normalX = distance > 0 ? dx / distance : 1; 
                const normalY = distance > 0 ? dy / distance : 0;
                
                character.x += normalX * overlap;
                character.y += normalY * overlap;
                
                const rocketSpeed = Math.sqrt(this.velocity.x**2 + this.velocity.y**2);
                const bounceForce = 2 + rocketSpeed * 0.7;
                character.velocity.x = normalX * bounceForce;
                character.velocity.y = normalY * bounceForce;

                character.rotationSpeed = (Math.random() - 0.5) * 0.2;
            }
        }
    }

    bindControls() {
        window.addEventListener('keydown', e => (this.keys[e.key] = true));
        window.addEventListener('keyup', e => (this.keys[e.key] = false));

        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;

        const onPointerDown = (event) => {
            this.isPointerDown = true;
            this.pointerLocation = event.data.getLocalPosition(this.world);
        };
        const onPointerUp = () => { this.isPointerDown = false; };
        const onPointerMove = (event) => {
            if (this.isPointerDown) {
                this.pointerLocation = event.data.getLocalPosition(this.world);
            }
        };

        this.app.stage.on('pointerdown', onPointerDown);
        this.app.stage.on('pointerup', onPointerUp);
        this.app.stage.on('pointerupoutside', onPointerUp);
        this.app.stage.on('pointermove', onPointerMove);
        
        this.app.ticker.add(() => this.update());
    }

    // --- THIS IS THE UPDATED METHOD ---
    update() {
        let isAccelerating = false;

        // If the pointer is down, ONLY use pointer controls.
        if (this.isPointerDown) {
            const dx = this.pointerLocation.x - this.rocket.x;
            const dy = this.pointerLocation.y - this.rocket.y;
            const angle = Math.atan2(dy, dx);
            
            this.velocity.x += Math.cos(angle) * this.thrust;
            this.velocity.y += Math.sin(angle) * this.thrust;

            this.rocket.rotation = angle + Math.PI / 2; // Instantly point towards the touch location
            isAccelerating = true;
        } 
        // Otherwise, use the simple keyboard controls.
        else {
            if (this.keys['ArrowUp']) { this.velocity.y -= this.thrust; isAccelerating = true; }
            if (this.keys['ArrowDown']) { this.velocity.y += this.thrust; isAccelerating = true; }
            if (this.keys['ArrowLeft']) { this.velocity.x -= this.thrust; isAccelerating = true; }
            if (this.keys['ArrowRight']) { this.velocity.x += this.thrust; isAccelerating = true; }
            
            // If moving with keys, point the rocket in the direction of velocity
            if (isAccelerating) {
                this.rocket.rotation = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2;
            }
        }

        // Apply rocket physics
        this.velocity.x *= this.drag;
        this.velocity.y *= this.drag;
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
        }
        this.rocket.x += this.velocity.x;
        this.rocket.y += this.velocity.y;

        // Check for collisions and update objects
        this.checkCollisions();

        // Update character positions and rotation based on their velocity
        for (const character of this.characters) {
            character.velocity.x *= this.characterDrag;
            character.velocity.y *= this.characterDrag;
            character.x += character.velocity.x;
            character.y += character.velocity.y;
            character.rotation += character.rotationSpeed;
            character.rotationSpeed *= this.characterDrag;
        }

        // Update camera to follow the rocket
        const targetX = -this.rocket.x + this.app.screen.width / 2;
        const targetY = -this.rocket.y + this.app.screen.height / 2;
        this.world.x += (targetX - this.world.x) * 0.05;
        this.world.y += (targetY - this.world.y) * 0.05;

        // Update particles
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