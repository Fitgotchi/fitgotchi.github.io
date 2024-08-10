let steps = 0;
let distance = 0;
let calories = 0;
let startTime;
let stepInterval;
let timeInterval;
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

// Define variables to store sensor data
let pedometer = null;

function initPedometer() {
    if ('Sensor' in window && 'PedometerSensor' in window) {
        pedometer = new PedometerSensor();
        pedometer.addEventListener('reading', () => {
            // Get the step count from the sensor
            steps = pedometer.steps;
            distance = (steps * 0.0008).toFixed(2);
            calories = (steps * 0.04).toFixed(0);
            updateDisplay();
        });
        pedometer.start();
    } else {
        console.error('PedometerSensor is not supported on this device.');
    }
}

function updateDisplay() {
    const stepCount = document.getElementById('step-count');
    const distanceDisplay = document.getElementById('distance');
    const caloriesDisplay = document.getElementById('calories');
    const progressBar = document.getElementById('progress-bar');

    stepCount.textContent = steps;
    distanceDisplay.textContent = distance;
    caloriesDisplay.textContent = calories;

    const dailyGoal = parseInt(document.getElementById('daily-goal').textContent);
    progressBar.value = (steps / dailyGoal) * 100;
}

function updateElapsedTime() {
    const timeElapsedDisplay = document.getElementById('time-elapsed');
    const now = new Date();
    const elapsed = new Date(now - startTime);

    const hours = String(elapsed.getUTCHours()).padStart(2, '0');
    const minutes = String(elapsed.getUTCMinutes()).padStart(2, '0');
    const seconds = String(elapsed.getUTCSeconds()).padStart(2, '0');

    timeElapsedDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function startStepCounter() {
    if (!isActive) {
        startTime = new Date();
        initPedometer();
        timeInterval = setInterval(updateElapsedTime, 1000);
        chartUpdateInterval = setInterval(updateChart, 1000);
        isActive = true;
    }
}

function pauseStepCounter() {
    if (pedometer) {
        pedometer.stop();
    }
    clearInterval(timeInterval);
    clearInterval(chartUpdateInterval);
    isActive = false;
}

function stopStepCounter() {
    if (pedometer) {
        pedometer.stop();
    }
    clearInterval(timeInterval);
    clearInterval(chartUpdateInterval);
    isActive = false;
    updateChart(); // Ensure final update to chart
}

function updateChart() {
    const now = (new Date() - startTime) / 1000; // Convert milliseconds to seconds
    if (stepChart.data.labels.length >= 60) { // Maintain 1 minute of data
        stepChart.data.labels.shift();
        stepChart.data.datasets[0].data.shift();
    }
    stepChart.data.labels.push(now.toFixed(0));
    stepChart.data.datasets[0].data.push(steps);
    stepChart.update();
}

function navigateTo(page) {
    window.location.href = `${page}.html`;
}
