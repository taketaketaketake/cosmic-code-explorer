export class RocketController {
    constructor(rocket) {
        this.rocket = rocket;
        this.velocity = { x: 0, y: 0 };
        this.speed = 5;
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
        };

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(e) {
        if (e.key in this.keys) {
            this.keys[e.key] = true;
        }
    }

    handleKeyUp(e) {
        if (e.key in this.keys) {
            this.keys[e.key] = false;
        }
    }

    update(bounds) {
        // Reset velocity
        this.velocity.x = 0;
        this.velocity.y = 0;

        // Update velocity based on keys pressed
        if (this.keys.ArrowUp) this.velocity.y = -this.speed;
        if (this.keys.ArrowDown) this.velocity.y = this.speed;
        if (this.keys.ArrowLeft) this.velocity.x = -this.speed;
        if (this.keys.ArrowRight) this.velocity.x = this.speed;

        // Apply velocity to rocket position
        this.rocket.x += this.velocity.x;
        this.rocket.y += this.velocity.y;

        // Enforce movement boundaries
        this.enforceBounds(bounds);
    }

    enforceBounds(bounds) {
        if (this.rocket.x < bounds.x) this.rocket.x = bounds.x;
        if (this.rocket.x > bounds.width) this.rocket.x = bounds.width;
        if (this.rocket.y < bounds.y) this.rocket.y = bounds.y;
        if (this.rocket.y > bounds.height) this.rocket.y = bounds.height;
    }
}