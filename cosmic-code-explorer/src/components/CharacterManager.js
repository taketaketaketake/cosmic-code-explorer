import * as PIXI from 'pixi.js';

export class CharacterManager {
    constructor(stage, rocket) {
        this.stage = stage;
        this.rocket = rocket;
        this.characters = [];
        this.proximityThreshold = 100; // Pixels
    }

    createCharacters(textures) {
        const positions = [
            { x: 400, y: 300 },
            { x: window.innerWidth - 300, y: 500 },
            { x: 600, y: window.innerHeight - 200 },
        ];

        const charAliases = ['loopKid', 'debugKid', 'ifthenKid'];

        charAliases.forEach((alias, index) => {
            const character = new PIXI.Sprite(textures[alias]);
            character.anchor.set(0.5);
            character.x = positions[index].x;
            character.y = positions[index].y;
            this.stage.addChild(character);
            this.characters.push(character);
        });
    }

    update() {
        this.characters.forEach(character => {
            const distance = this.getDistance(this.rocket.position, character.position);
            
            if (distance < this.proximityThreshold) {
                this.triggerInteraction(character);
            } else {
                character.alpha = 1.0; // Reset visual state
            }
        });
    }

    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    triggerInteraction(character) {
        // Placeholder for Phase 4/5 Goals
        // This is where you would trigger a pop-up, animation, or dialogue
        console.log('Rocket is near a character!');
        character.alpha = 0.5; // Simple visual feedback
        
        // TODO: Implement sprite sheet animation (e.g., character.play())
        // TODO: Display fun fact or dialogue box
    }
}