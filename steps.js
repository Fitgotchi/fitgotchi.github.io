let steps = 0;
let distance = 0;
let calories = 0;
let startTime;
let isActive = false;
let chartUpdateInterval;
const chart = document.getElementById('stepChart').getContext('2d');
const stepChart = new Chart(chart, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Pasos en Tiempo Real',
            data: [],
            borderColor: '#39ff14',
            borderWidth: 2,
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Tiempo (segundos)',
                    color: '#ffffff'
                },
                type: 'linear',
                ticks: {
                    callback: function(value) {
                        return Math.round(value);
                    }
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Pasos',
                    color: '#ffffff'
                },
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff'
                }
            }
        }
    }
});

let pedometer = null;

function initPedometer() {
    if ('Sensor' in window && 'PedometerSensor' in window) {
        pedometer = new PedometerSensor();
        pedometer.addEventListener('reading', handlePedometerReading);
        startPedometer();
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(handlePositionUpdate);
        } else {
            alert('Este dispositivo no soporta PedometerSensor ni geolocalización.');
            console.error('PedometerSensor is not supported on this device.');
        }
    }
}

function handlePedometerReading() {
    steps = pedometer.steps;
    distance = (steps * STEP_TO_DISTANCE).toFixed(2);
    calories = (steps * STEP_TO_CALORIES).toFixed(0);
    updateDisplay();
}

function handlePositionUpdate(position) {
    const { latitude, longitude } = position.coords;
    calculateDistanceFromPosition(latitude, longitude);
    updateDisplay();
}

let lastLat = null;
let lastLong = null;

function calculateDistanceFromPosition(lat, long) {
    if (lastLat !== null && lastLong !== null) {
        const R = 6371e3; // Radio de la Tierra en metros
        const φ1 = lastLat * Math.PI / 180;
        const φ2 = lat * Math.PI / 180;
        const Δφ = (lat - lastLat) * Math.PI / 180;
        const Δλ = (long - lastLong) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distanceMeters = R * c;
        distance += distanceMeters / 1000; // Convertimos a kilómetros
        steps += distanceMeters / 0.762; // 0.762 es el promedio de longitud de paso en metros
        calories += distanceMeters * 0.05; // Aproximación de calorías quemadas por metro

        updateDisplay();
    }

    lastLat = lat;
    lastLong = long;
}

function startPedometer() {
    try {
        pedometer.start();
    } catch (error) {
        console.error('Error starting pedometer:', error);
    }
}

function updateDisplay() {
    const stepCount = document.getElementById('step-count');
    const distanceDisplay = document.getElementById('distance');
    const caloriesDisplay = document.getElementById('calories');
    const progressBar = document.getElementById('progress-bar');

    if (stepCount && distanceDisplay && caloriesDisplay && progressBar) {
        stepCount.textContent = steps;
        distanceDisplay.textContent = distance;
        caloriesDisplay.textContent = calories;

        const dailyGoal = parseInt(document.getElementById('daily-goal').textContent);
        progressBar.value = (steps / dailyGoal) * 100;
    }
}

function updateElapsedTime() {
    const timeElapsedDisplay = document.getElementById('time-elapsed');
    if (!timeElapsedDisplay) return;

    const now = new Date();
    const elapsed = new Date(now - startTime);

    timeElapsedDisplay.textContent = formatElapsedTime(elapsed);
}

function formatElapsedTime(elapsed) {
    const hours = String(elapsed.getUTCHours()).padStart(2, '0');
    const minutes = String(elapsed.getUTCMinutes()).padStart(2, '0');
    const seconds = String(elapsed.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function startStepCounter() {
    if (!isActive) {
        startTime = new Date();
        initPedometer();
        timeInterval = setInterval(updateElapsedTime, 1000);
        chartUpdateInterval = setInterval(updateChart, 1000);
        isActive = true;
        console.log('Step counter started');
    }
}

function pauseStepCounter() {
    if (isActive) {
        if (pedometer) {
            pedometer.stop();
        }
        clearInterval(timeInterval);
        clearInterval(chartUpdateInterval);
        isActive = false;
        console.log('Step counter paused');
    }
}

function stopStepCounter() {
    if (isActive) {
        if (pedometer) {
            pedometer.stop();
        }
        clearInterval(timeInterval);
        clearInterval(chartUpdateInterval);
        isActive = false;
        resetCounters();
        updateChart(); 
        console.log('Step counter stopped');
    }
}

function resetCounters() {
    steps = 0;
    distance = 0;
    calories = 0;
    updateDisplay();
}

function updateChart() {
    const now = (new Date() - startTime) / 1000; 
    addChartData(now.toFixed(0), steps);
    stepChart.update();
}

function addChartData(label, data) {
    if (stepChart.data.labels.length >= 60) { 
        stepChart.data.labels.shift();
        stepChart.data.datasets[0].data.shift();
    }
    stepChart.data.labels.push(label);
    stepChart.data.datasets[0].data.push(data);
}

function navigateTo(page) {
    window.location.href = `${page}.html`;
}
