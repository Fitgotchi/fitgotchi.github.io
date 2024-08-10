const fitgotchiImage = document.getElementById('fitgotchi-image');

function setHappy() {
    fitgotchiImage.classList.add('happy');
    fitgotchiImage.classList.remove('sick');
}

function setSick() {
    fitgotchiImage.classList.add('sick');
    fitgotchiImage.classList.remove('happy');
}

function setActive() {
    fitgotchiImage.classList.add('active');
    fitgotchiImage.classList.remove('inactive');
}

function setInactive() {
    fitgotchiImage.classList.add('inactive');
    fitgotchiImage.classList.remove('active');
}

// Event listeners para los botones que afectan el estado visual
document.getElementById('some-button').addEventListener('click', setHappy);
document.getElementById('another-button').addEventListener('click', setSick);
document.getElementById('activate-button').addEventListener('click', setActive);
document.getElementById('deactivate-button').addEventListener('click', setInactive);
