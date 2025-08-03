const fitgotchiImage = document.getElementById('fitgotchi-image');

function clearStates() {
    fitgotchiImage.classList.remove(
        'happy', 'sick', 'active', 'inactive',
        'tired', 'hungry', 'playful', 'sleepy', 'boosted', 'level-up'
    );
}

function updateFitgotchiImage() {
    clearStates();

    const hunger = parseInt(document.getElementById('hunger').value);
    const energy = parseInt(document.getElementById('energy').value);
    const sleep = parseInt(document.getElementById('sleep').value);
    const experience = parseInt(document.getElementById('experience').value);
    const level = parseInt(document.getElementById('level').value);

    if (hunger >= 95 && energy <= 10 && sleep <= 10) {
        setInactive();
    } else if (hunger >= 80) {
        setHungry();
    } else if (energy <= 30) {
        setTired();
    } else if (sleep <= 30) {
        setSleepy();
    } else if (energy > 70 && hunger < 50 && sleep > 50) {
        setPlayful();
    } else if (level >= 5) {
        setActive();
        if (experience % 100 >= 90) {
            setLevelUp();
        }
    } else {
        setHappy();
    }
}

function setHappy() {
    clearStates();
    fitgotchiImage.classList.add('happy');
    fitgotchiImage.src = 'images/fitgotchi_happy.jpg';
}

function setSick() {
    clearStates();
    fitgotchiImage.classList.add('sick');
    fitgotchiImage.src = 'images/fitgotchi_sick.jpg';
}

function setActive() {
    fitgotchiImage.classList.add('active');
}

function setInactive() {
    clearStates();
    fitgotchiImage.classList.add('inactive');
    fitgotchiImage.src = 'images/fitgotchi_dead.jpg';
}

function setTired() {
    clearStates();
    fitgotchiImage.classList.add('tired');
    fitgotchiImage.src = 'images/fitgotchi_tired.jpg';
}

function setHungry() {
    clearStates();
    fitgotchiImage.classList.add('hungry');
    fitgotchiImage.src = 'images/fitgotchi_hungry.jpg';
}

function setSleepy() {
    clearStates();
    fitgotchiImage.classList.add('sleepy');
    fitgotchiImage.src = 'images/fitgotchi_sleepy.jpg';
}

function setPlayful() {
    clearStates();
    fitgotchiImage.classList.add('playful');
    fitgotchiImage.src = 'images/fitgotchi_playful.jpg';
}

function setLevelUp() {
    fitgotchiImage.classList.add('level-up');
}

// LLama updateFitgotchiImage para que al cargar la página ya se actualice:
document.addEventListener('DOMContentLoaded', () => {
    updateFitgotchiImage();
});

// También llama updateFitgotchiImage después de cada cambio relevante en tus métricas
