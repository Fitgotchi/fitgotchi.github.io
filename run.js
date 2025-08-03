let interval;
let startTime;
let elapsedTime = 0;
let previousPosition = null;
let distanceCovered = 0;
let watchId;
let progressColorIndex = 0;
const progressColors = ['#39ff14', '#8f00ff', '#ff1493'];
let isPaused = false;
let pauseTime = 0;
const durationOptions = { free: Infinity, 15: 15 * 60, 30: 30 * 60, 60: 60 * 60 };

function startTimer() {
    const timerElement = document.getElementById('timer');
    const progressBarFill = document.querySelector('#progress-bar .progress-fill');
    const durationSelect = document.getElementById('duration');
    const selectedDuration = durationSelect.value;

    if (!durationOptions[selectedDuration]) {
        alert("Duración no válida seleccionada.");
        return;
    }

    if (isPaused) {
        startTime = Date.now() + pauseTime - elapsedTime;
    } else {
        startTime = Date.now();
    }
    pauseTime = durationOptions[selectedDuration] * 1000;

    resetTimerVariables();
    updatePositionPeriodically();

    interval = setInterval(updateTimer, 1000);
    updateButtonStates();
}

function resetTimerVariables() {
    distanceCovered = 0;
    previousPosition = null;
    isPaused = false;
}

function updatePositionPeriodically() {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
    });
}

function pauseOrResumeTimer() {
    if (isPaused) {
        startTime = Date.now() + pauseTime - elapsedTime;
        interval = setInterval(updateTimer, 1000);
    } else {
        clearInterval(interval);
        elapsedTime = Date.now() - startTime;
    }
    isPaused = !isPaused;
    updateButtonStates();
}

function updateTimer() {
    if (isPaused) return;

    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const minutes = Math.floor((elapsed / 1000 / 60) % 60);
    const seconds = Math.floor((elapsed / 1000) % 60);
    document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const progressBarFill = document.querySelector('#progress-bar .progress-fill');
    const progressPercentage = Math.max((elapsed / pauseTime) * 100, 0);
    progressBarFill.style.width = `${progressPercentage}%`;

    if (progressPercentage >= 100) {
        progressColorIndex = (progressColorIndex + 1) % progressColors.length;
        progressBarFill.style.backgroundColor = progressColors[progressColorIndex];
        startTime = Date.now();
        pauseTime = Infinity;
    }

    if (elapsed >= pauseTime) {
        stopTimer();
    }
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
    const R = 6371;
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
    const speedReward = Math.round(distanceCovered / (elapsedTime / 1000)) * 2;
    const strengthReward = Math.round(distanceCovered / (elapsedTime / 1000)) * 3;
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

function stopTimer() {
    clearInterval(interval);
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }

    if (confirm('¿Estás seguro de detener el temporizador?')) {
        calculateRewards();
        updateButtonStates();
    } else {
        startTimer();
    }
}

function updateButtonStates() {
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const stopButton = document.getElementById('stop');

    startButton.disabled = isPaused;
    pauseButton.disabled = !isPaused;
    stopButton.disabled = !isPaused;
}

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const stopButton = document.getElementById('stop');

    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseOrResumeTimer);
    stopButton.addEventListener('click', stopTimer);

    initMap();
});

function initMap() {
    const map = L.map('map').setView([0, 0], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    watchId = navigator.geolocation.watchPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const marker = L.marker([lat, lon]);
        map.addLayer(marker);
        map.setView([lat, lon], 17);
    }, handleError, {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
    });
}

document.addEventListener('DOMContentLoaded', initMap);
