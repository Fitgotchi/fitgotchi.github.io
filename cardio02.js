const instructions = [
    { time: 0, text: "Prepárate para comenzar 💪" },
    { time: 60, text: "Calentamiento: Marcha en el lugar 🚶‍♂️" },
    { time: 120, text: "Saltos de tijera 🤸‍♂️" },
    { time: 180, text: "Sentadillas 🏋️‍♂️" },
    { time: 240, text: "Descanso activo: Camina lentamente 🚶‍♂️" },
    { time: 300, text: "Correr en el lugar 🏃‍♂️" },
    { time: 360, text: "Saltos de tijera 🤸‍♂️" },
    { time: 420, text: "Sentadillas 🏋️‍♂️" },
    { time: 480, text: "Descanso activo: Camina lentamente 🚶‍♂️" },
    { time: 540, text: "Enfriamiento: Estiramientos 🧘‍♂️" },
    { time: 600, text: "¡Buen trabajo! Has terminado 🎉" }
];

let timer;
let startTime;
let pausedTime = 0;
let isPaused = false;

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const pauseButton = document.getElementById('pause-button');
    const endButton = document.getElementById('end-button');

    if (startButton) startButton.addEventListener('click', startSession);
    if (pauseButton) pauseButton.addEventListener('click', pauseSession);
    if (endButton) endButton.addEventListener('click', endSession);
});

function navigateTo(page) {
    window.location.href = page + ".html";
}

function startSession() {
    if (isPaused) {
        startTime += (Date.now() - pausedTime);
        isPaused = false;
    } else {
        startTime = Date.now();
    }

    timer = setInterval(updateTime, 1000);
    document.getElementById('start-button').disabled = true;
    document.getElementById('pause-button').disabled = false;
    document.getElementById('end-button').disabled = false;
}

function pauseSession() {
    clearInterval(timer);
    pausedTime = Date.now();
    isPaused = true;
    document.getElementById('start-button').disabled = false;
    document.getElementById('pause-button').disabled = true;
}

function endSession() {
    clearInterval(timer);
    document.getElementById('time-display').textContent = "00:00";
    document.getElementById('instruction-text').textContent = "Prepárate para comenzar 💪";
    document.getElementById('start-button').disabled = false;
    document.getElementById('pause-button').disabled = true;
    document.getElementById('end-button').disabled = true;
    pausedTime = 0;
    isPaused = false;
}

function updateTime() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    document.getElementById('time-display').textContent = `${minutes}:${seconds}`;

    const instruction = instructions.find(inst => inst.time === elapsedTime);
    if (instruction) {
        document.getElementById('instruction-text').textContent = instruction.text;
    }
}
