export class IntroScreen {
    constructor(onStartCallback) {
        this.onStart = onStartCallback;
        this.launchButton = document.getElementById('launch-button');
        this.introScreen = document.getElementById('intro-screen');
        this.characterImages = document.querySelectorAll('.character-select img');
        this.selectedCharacter = null;

        this.characterImages.forEach(img => {
            img.addEventListener('click', () => {
                this.characterImages.forEach(i => i.dataset.selected = 'false');
                img.dataset.selected = 'true';
                this.selectedCharacter = img.dataset.character;
            });
        });

        this.launchButton.addEventListener('click', () => {
            if (this.selectedCharacter) {
                this.onStart(this.selectedCharacter);
            } else {
                alert("Choose a character first!");
            }
        });
    }

    hide() {
        this.introScreen.classList.add('opacity-0', 'pointer-events-none');
    }
}
