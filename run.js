let interval;
let startTime;
let elapsedTime = 0;
let previousPosition = null;
let distanceCovered = 0;
let speed = 0;
let watchId;
let progressColorIndex = 0;
const progressColors = ['#39ff14', '#8f00ff', '#ff1493'];
let isPaused = false;
let pauseTime = 0;
const durationOptions = { free: Infinity, 15: 15 * 60, 30: 30 * 60, 60: 60 * 60 }; // Duraciones en segundos

function startTimer() {
    const timerElement = document.getElementById('timer');
    const progressBarFill = document.querySelector('#progress-bar .progress-fill');
    const durationSelect = document.getElementById('duration');
    const selectedDuration = durationSelect.value;

    if (selectedDuration === 'free') {
        startTime = Date.now();
        elapsedTime = 0;
        pauseTime = Infinity;
    } else {
        startTime = Date.now() - elapsedTime;
        elapsedTime = 0;
        pauseTime = durationOptions[selectedDuration] * 1000; // Convertir a milisegundos
    }

    distanceCovered = 0;
    speed = 0;
    previousPosition = null;
    isPaused = false;

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000
        });
    } else {
        alert("La geolocalización no es compatible con este navegador.");
    }

    interval = setInterval(() => {
        if (isPaused) return;

        updateTimer();

        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progressPercentage = (elapsed / (pauseTime || durationOptions[selectedDuration] * 1000)) * 100; // Convertir duración a milisegundos
        progressBarFill.style.width = `${Math.min(progressPercentage, 100)}%`;

        if (progressPercentage >= 100) {
            progressColorIndex = (progressColorIndex + 1) % progressColors.length;
            progressBarFill.style.backgroundColor = progressColors[progressColorIndex];
            startTime = Date.now(); // Reiniciar el temporizador
            pauseTime = Infinity; // Para duración libre, no se detiene
        }

        if (elapsed >= (pauseTime || durationOptions[selectedDuration] * 1000)) {
            stopTimer();
        }
    }, 1000);

    updateButtonStates();
}

function pauseOrResumeTimer() {
    const pauseButton = document.getElementById('pause');

    if (isPaused) {
        startTime = Date.now() - elapsedTime;
        interval = setInterval(updateTimer, 1000);
        isPaused = false;
        pauseButton.textContent = 'Pausar ⏸️';
    } else {
        clearInterval(interval);
        elapsedTime = Date.now() - startTime;
        isPaused = true;
        pauseButton.textContent = 'Reanudar ▶️';
    }
    updateButtonStates();
}

function updateTimer() {
    if (isPaused) return;

    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const minutes = Math.floor((elapsed / 1000 / 60) % 60);
    const seconds = Math.floor((elapsed / 1000) % 60);
    document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const durationSelect = document.getElementById('duration');
    const selectedDuration = durationSelect.value;
    const totalDuration = durationOptions[selectedDuration] * 1000; // Convertir a milisegundos
    const progressPercentage = (elapsed / totalDuration) * 100;
    const progressBarFill = document.querySelector('#progress-bar .progress-fill');

    progressBarFill.style.width = `${Math.min(progressPercentage, 100)}%`;

    if (progressPercentage >= 100) {
        progressColorIndex = (progressColorIndex + 1) % progressColors.length;
        progressBarFill.style.backgroundColor = progressColors[progressColorIndex];
        startTime = Date.now(); // Reiniciar el temporizador
        pauseTime = Infinity; // Para duración libre, no se detiene
    }

    if (elapsed >= totalDuration) {
        stopTimer();
    }
}

function navigateTo(page) {
    window.location.href = page + ".html";
}

function stopTimer() {
    clearInterval(interval);
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
    calculateRewards();
    updateButtonStates();
}

function updateButtonStates() {
    const isRunning = !isPaused && interval;
    document.getElementById('start').disabled = isRunning;
    document.getElementById('pause').disabled = !isRunning; // Cambiado de 'pause-resume' a 'pause'
    document.getElementById('stop').disabled = !isRunning;
}

function updatePosition(position) {
    if (previousPosition) {
        const lat1 = previousPosition.coords.latitude;
        const lon1 = previousPosition.coords.longitude;
        const lat2 = position.coords.latitude;
        const lon2 = position.coords.longitude;
        distanceCovered += getDistance(lat1, lon1, lat2, lon2);
    }
    previousPosition = position;
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function calculateRewards() {
    const cardioReward = Math.round(distanceCovered * 10);
    const resistanceReward = Math.round(distanceCovered * 5);
    const speedReward = Math.round(speed * 2);
    const strengthReward = Math.round(speed * 3);
    const xpReward = Math.round(distanceCovered * 2);
    const tokensReward = Math.round(distanceCovered);

    document.getElementById('cardio-reward').textContent = cardioReward;
    document.getElementById('resistance-reward').textContent = resistanceReward;
    document.getElementById('speed-reward').textContent = speedReward;
    document.getElementById('strength-reward').textContent = strengthReward;
    document.getElementById('xp-reward').textContent = xpReward;
    document.getElementById('tokens-reward').textContent = tokensReward;
}

function handleError(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
}

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseOrResumeTimer); // Cambiado de 'pause-resume' a 'pause'
document.getElementById('stop').addEventListener('click', stopTimer);
