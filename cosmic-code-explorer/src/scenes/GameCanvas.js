import * as PIXI from 'pixi.js';

export class GameCanvas {
    constructor(app, selectedCharacter) {
        this.app = app;
        this.selectedCharacter = selectedCharacter;
        this.rocketSpeed = 5;
    }

    async start() {
        await this.loadAssets();

        this.createStarfield();
        this.createRocket();
        this.bindControls();
    }

    async loadAssets() {
        const assets = [
            { alias: 'rocket', src: 'assets/rocket.png' },
            { alias: 'bg', src: 'assets/bg-space.png' },
            { alias: 'loop-kid', src: 'assets/characters/loop-kid.png' },
            { alias: 'debug-kid', src: 'assets/characters/debug-kid.png' },
            { alias: 'ifthen-kid', src: 'assets/characters/ifthen-kid.png' },
        ];

        try {
            console.log('Loading assets...');
            
            // Add assets to PIXI Assets
            assets.forEach(({ alias, src }) => {
                PIXI.Assets.add(alias, src);
            });
            
            // Load all assets
            const aliases = assets.map(asset => asset.alias);
            await PIXI.Assets.load(aliases);
            
            console.log('All assets loaded successfully');
        } catch (error) {
            console.error('Error loading assets:', error);
            throw error;
        }
    }

    createStarfield() {
        try {
            console.log('Creating starfield...');
            const bgTexture = PIXI.Texture.from('bg');
            console.log('Background texture:', bgTexture);
            
            this.starfield = new PIXI.TilingSprite(
                bgTexture,
                this.app.screen.width,
                this.app.screen.height
            );
            this.app.stage.addChild(this.starfield);
            console.log('Starfield created and added to stage');
        } catch (error) {
            console.error('Error creating starfield:', error);
        }
    }

    createRocket() {
        try {
            console.log('Creating rocket...');
            const rocketTexture = PIXI.Texture.from('rocket');
            console.log('Rocket texture:', rocketTexture);
            
            this.rocket = new PIXI.Sprite(rocketTexture);
            this.rocket.anchor.set(0.5);
            this.rocket.x = this.app.screen.width / 2;
            this.rocket.y = this.app.screen.height / 2;
            this.app.stage.addChild(this.rocket);
            console.log('Rocket created and added to stage at:', this.rocket.x, this.rocket.y);
        } catch (error) {
            console.error('Error creating rocket:', error);
        }
    }

    bindControls() {
        this.keys = {};
        window.addEventListener('keydown', e => (this.keys[e.key] = true));
        window.addEventListener('keyup', e => (this.keys[e.key] = false));

        this.app.ticker.add(() => this.update());
    }

    update() {
        if (this.keys['ArrowUp']) this.rocket.y -= this.rocketSpeed;
        if (this.keys['ArrowDown']) this.rocket.y += this.rocketSpeed;
        if (this.keys['ArrowLeft']) {
            this.rocket.x -= this.rocketSpeed;
            this.starfield.tilePosition.x += 2; // parallax effect
        }
        if (this.keys['ArrowRight']) {
            this.rocket.x += this.rocketSpeed;
            this.starfield.tilePosition.x -= 2;
        }
    }
}
