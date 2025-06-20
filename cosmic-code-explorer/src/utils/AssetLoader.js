import * as PIXI from 'pixi.js';

export class AssetLoader {
    constructor() {
        this.assets = [
            // Add all assets that need to be preloaded
            { alias: 'rocket', src: 'assets/rocket.png' },
            { alias: 'background', src: 'assets/bg-space.png' },
            { alias: 'loopKid', src: 'assets/characters/loop-kid.png' },
            { alias: 'debugKid', src: 'assets/characters/debug-kid.png' },
            { alias: 'ifthenKid', src: 'assets/characters/ifthen-kid.png' },
            // Example for a future sprite sheet
            // { alias: 'debugKidSheet', src: 'assets/characters/debug-kid-sheet.json' },
        ];
    }

    async preload() {
        console.log('Preloading assets...');
        // Add all assets to the loader
        this.assets.forEach(asset => PIXI.Assets.add(asset));
        
        // Load all assets
        const loadedAssets = await PIXI.Assets.load(this.assets.map(a => a.alias));
        console.log('Assets loaded!');
        return loadedAssets;
    }
}