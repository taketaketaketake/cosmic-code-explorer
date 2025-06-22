export class IntroScreen {
    constructor() {
        // Now that we're inside a 'DOMContentLoaded' listener, these elements are guaranteed to exist.
        this.launchButton = document.getElementById('launch-button');
        this.characterImages = document.querySelectorAll('.character-select img');
        this.selectedCharacter = null;

        // Set a default character when the page loads
        if (this.characterImages.length > 0) {
            this.selectCharacter(this.characterImages[0]);
        }

        // Add click listener to each character image
        this.characterImages.forEach(img => {
            img.addEventListener('click', () => this.selectCharacter(img));
        });

        // Add click listener to the launch button
        this.launchButton.addEventListener('click', () => {
            if (this.selectedCharacter) {
                // Navigate to the game page with the character as a URL parameter
                window.location.href = `game.html?character=${this.selectedCharacter}`;
            } else {
                alert("Please select a character first!");
            }
        });
    }

    selectCharacter(selectedImg) {
        if (!selectedImg) return;
        
        // Update the visual selection state for all images
        this.characterImages.forEach(i => {
            i.setAttribute('data-selected', 'false');
        });
        selectedImg.setAttribute('data-selected', 'true');

        // Store the name of the selected character
        this.selectedCharacter = selectedImg.dataset.character;
        console.log(`Character selected: ${this.selectedCharacter}`);
    }
}
