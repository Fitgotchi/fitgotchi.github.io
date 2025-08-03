function navigateTo(page) {
    window.location.href = page + ".html";
}

let timer;
let secondsRemaining = 300;
let isRunning = false;
const instructions = [
    "¡Comienza con 40 segundos de saltos de tijera! 🤸‍♂️",
    "¡Descansa por 20 segundos y prepárate para el siguiente ejercicio! 🧘‍♀️",
    "¡Ahora haz 40 segundos de flexiones! 💪",
    "¡Descanso de 20 segundos, respira hondo! 🌬️",
    "¡Sigue con 40 segundos de abdominales! 🏋️‍♂️",
    "¡Descansa 20 segundos, te queda poco! ⏳",
    "¡Finaliza con 40 segundos de burpees! 🎯",
    "¡Gran trabajo! Tu rutina ha terminado. 🎉"
];

const exerciseTimes = [40, 20, 40, 20, 40, 20, 40];
const totalExperience = 50;
const totalCoins = 100;
const totalCalories = 200;
const totalSpeed = 30;
const totalCardio = 40;
const totalEndurance = 25;
const totalStrength = 35;
const totalAgility = 20;

const pointsPerSecondExperience = totalExperience / 300;
const pointsPerSecondCoins = totalCoins / 300;
const pointsPerSecondCalories = totalCalories / 300;
const pointsPerSecondSpeed = totalSpeed / 300;
const pointsPerSecondCardio = totalCardio / 300;
const pointsPerSecondEndurance = totalEndurance / 300;
const pointsPerSecondStrength = totalStrength / 300;
const pointsPerSecondAgility = totalAgility / 300;

function updateTime() {
    if (secondsRemaining <= 0) {
        clearInterval(timer);
        document.getElementById('start-stop-button').textContent = 'Iniciar';
        isRunning = false;
        updateRewards(300);
        document.getElementById('circular-progress').classList.remove('animating');
        return;
    }

    secondsRemaining--;
    const minutes = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    document.getElementById('time-display').textContent = 
        String(minutes).padStart(2, '0') + ':' +
        String(secs).padStart(2, '0');

    const elapsedTime = 300 - secondsRemaining;
    let accumulatedTime = 0;
    for (let i = 0; i < exerciseTimes.length; i++) {
        accumulatedTime += exerciseTimes[i];
        if (elapsedTime < accumulatedTime) {
            document.getElementById('instruction-display').textContent = instructions[i];
            break;
        }
    }
}

function updateRewards(secondsElapsed) {
    const experienceEarned = Math.round(pointsPerSecondExperience * secondsElapsed);
    const coinsEarned = Math.round(pointsPerSecondCoins * secondsElapsed);
    const caloriesBurned = Math.round(pointsPerSecondCalories * secondsElapsed);
    const speedEarned = Math.round(pointsPerSecondSpeed * secondsElapsed);
    const cardioEarned = Math.round(pointsPerSecondCardio * secondsElapsed);
    const enduranceEarned = Math.round(pointsPerSecondEndurance * secondsElapsed);
    const strengthEarned = Math.round(pointsPerSecondStrength * secondsElapsed);
    const agilityEarned = Math.round(pointsPerSecondAgility * secondsElapsed);

    document.getElementById('experience').value = experienceEarned;
    document.getElementById('coins').value = coinsEarned;
    document.getElementById('calories').value = caloriesBurned;
    document.getElementById('speed').value = speedEarned;
    document.getElementById('cardio').value = cardioEarned;
    document.getElementById('endurance').value = enduranceEarned;
    document.getElementById('strength').value = strengthEarned;
    document.getElementById('agility').value = agilityEarned;
}

document.getElementById('start-stop-button').addEventListener('click', function() {
    if (isRunning) {
        clearInterval(timer);
        this.textContent = 'Iniciar';
        updateRewards(300 - secondsRemaining);
        document.getElementById('circular-progress').classList.remove('animating');
    } else {
        timer = setInterval(updateTime, 1000);
        this.textContent = 'Detener';
        document.getElementById('circular-progress').classList.add('animating');
    }
    isRunning = !isRunning;
});

document.getElementById('reset-button').addEventListener('click', function() {
    clearInterval(timer);
    secondsRemaining = 300;
    const minutes = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    document.getElementById('time-display').textContent = 
        String(minutes).padStart(2, '0') + ':' +
        String(secs).padStart(2, '0');
    document.getElementById('start-stop-button').textContent = 'Iniciar';
    isRunning = false;
    document.getElementById('instruction-display').textContent = instructions[0];
    updateRewards(0);
    document.getElementById('circular-progress').classList.remove('animating');
});

document.getElementById('end-button').addEventListener('click', function() {
    clearInterval(timer);
    isRunning = false;
    document.getElementById('start-stop-button').textContent = 'Iniciar';
    updateRewards(300 - secondsRemaining);
    document.getElementById('circular-progress').classList.remove('animating');
});
