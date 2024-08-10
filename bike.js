let interval;
let startTime;
let elapsedTime = 0;
let distanceCovered = 0;
let watchId;
let lastPosition = null;
let isPaused = false;

function startTimer() {
    const timerElement = document.getElementById('timer');
    const progressBarFill = document.querySelector('#progress-bar .progress-fill');
    const rideTypeSelect = document.getElementById('ride-type');
    const selectedRideType = rideTypeSelect.value;

    startTime = Date.now() - elapsedTime;
    elapsedTime = 0;
    distanceCovered = 0;
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
        if (!isPaused) {
            updateTimer();
            updateProgressBar(selectedRideType, progressBarFill);
        }
    }, 1000);

    updateButtonStates();
}

function updateProgressBar(selectedRideType, progressBarFill) {
    const distanceGoal = getDistanceGoal(selectedRideType);
    const progressPercentage = (distanceCovered / distanceGoal) * 100;
    progressBarFill.style.width = `${Math.min(progressPercentage, 100)}%`;
    if (progressPercentage >= 100) {
        progressBarFill.style.backgroundColor = '#ff1493'; // Color para completado
    }
}

function getDistanceGoal(rideType) {
    switch (rideType) {
        case 'training-5k':
            return 5; // 5 km
        case 'training-10k':
            return 10; // 10 km
        default:
            return Infinity; // Paseo Libre
    }
}

function pauseOrResumeTimer() {
    const pauseButton = document.getElementById('pause-resume');
    const startButton = document.getElementById('start');

    if (isPaused) {
        startTime = Date.now() - elapsedTime;
        interval = setInterval(() => {
            if (!isPaused) updateTimer();
        }, 1000);
        isPaused = false;
        pauseButton.textContent = 'Pausar ⏸️';
        startButton.textContent = 'Reanudar ▶️'; // Cambiar texto de 'Iniciar' a 'Reanudar'
    } else {
        clearInterval(interval);
        elapsedTime = Date.now() - startTime;
        isPaused = true;
        pauseButton.textContent = 'Reanudar ▶️';
        startButton.textContent = 'Iniciar ▶️'; // Cambiar texto de 'Reanudar' a 'Iniciar'
    }
    updateButtonStates();
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const minutes = Math.floor((elapsed / 1000 / 60) % 60);
    const seconds = Math.floor((elapsed / 1000) % 60);
    document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const distanceElement = document.getElementById('distance');
    distanceElement.textContent = `${distanceCovered.toFixed(2)} km`;
}

function stopTimer() {
    const confirmation = confirm('¿Desea confirmar que desea detener y finalizar el entrenamiento?');
    if (confirmation) {
        clearInterval(interval);
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
        }
        calculateRewards();
        updateButtonStates();
    }
}

function updateButtonStates() {
    const isRunning = !isPaused && interval;
    document.getElementById('start').disabled = isRunning;
    document.getElementById('pause-resume').disabled = !isRunning;
    document.getElementById('stop').disabled = !isRunning;
}

function navigateTo(page) {
    window.location.href = page + ".html";
}

function updatePosition(position) {
    if (lastPosition) {
        const lat1 = lastPosition.coords.latitude;
        const lon1 = lastPosition.coords.longitude;
        const lat2 = position.coords.latitude;
        const lon2 = position.coords.longitude;
        distanceCovered += getDistance(lat1, lon1, lat2, lon2);
    }
    lastPosition = position;
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

function handleError(error) {
    console.error('Error de geolocalización: ', error);
}

function calculateRewards() {
    alert('¡Felicidades! Has completado tu paseo.');
    // Aquí puedes agregar la lógica para calcular y mostrar recompensas.
}

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause-resume').addEventListener('click', pauseOrResumeTimer);
document.getElementById('stop').addEventListener('click', stopTimer);
