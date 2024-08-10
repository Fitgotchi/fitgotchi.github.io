let net;
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('output');
const canvasCtx = canvasElement.getContext('2d');
const poseInstruction = document.getElementById('pose-instruction');
const poseStatus = document.getElementById('pose-status');
const timeDisplay = document.getElementById('time-display');
const startStopButton = document.getElementById('start-stop-button');
const resetButton = document.getElementById('reset-button');

const instructions = [
    { instruction: 'Abre los brazos', keypoints: ['leftWrist', 'rightWrist'], minConfidence: 0.5 },
    { instruction: 'Estira los brazos', keypoints: ['leftWrist', 'rightWrist'], minConfidence: 0.5 },
    { instruction: 'Sube los brazos', keypoints: ['leftWrist', 'rightWrist'], minConfidence: 0.5 },
];

let currentInstruction = 0;
let timer;
let startTime;
let running = false;

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;

        return new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
                resolve(videoElement);
            };
        });
    } catch (error) {
        console.error('Error al acceder a la cámara: ', error);
        alert('No se pudo acceder a la cámara. Asegúrate de que esté conectada y que el navegador tenga permisos para acceder a ella.');
    }
}

async function loadPosenet() {
    try {
        net = await posenet.load();
        console.log('PoseNet cargado');
    } catch (error) {
        console.error('Error al cargar PoseNet: ', error);
    }
}

async function detectPose() {
    if (!running) return;
    
    if (!net) {
        console.error('PoseNet no está cargado');
        return;
    }

    try {
        const pose = await net.estimateSinglePose(videoElement, {
            flipHorizontal: false,
        });

        // Ajustar tamaño del canvas al del video
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        const minPartConfidence = 0.5;

        pose.keypoints.forEach((keypoint) => {
            if (keypoint.score > minPartConfidence) {
                const { y, x } = keypoint.position;
                canvasCtx.beginPath();
                canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
                canvasCtx.fillStyle = 'aqua';
                canvasCtx.fill();
            }
        });

        checkPose(pose);
    } catch (error) {
        console.error('Error al detectar la pose: ', error);
    }

    requestAnimationFrame(detectPose);
}

function checkPose(pose) {
    const { keypoints } = pose;
    const requiredKeypoints = instructions[currentInstruction].keypoints;

    const isPoseCorrect = requiredKeypoints.every((key) => {
        const point = keypoints.find((kp) => kp.part === key);
        return point && point.score > 0.5 && point.position.y < 300; // Ajustar la condición según la instrucción
    });

    if (isPoseCorrect) {
        poseStatus.innerText = 'Estado: OK';
        poseStatus.style.color = '#39ff14';
        currentInstruction = (currentInstruction + 1) % instructions.length;
        poseInstruction.innerText = `Instrucción: ${instructions[currentInstruction].instruction}`;
    } else {
        poseStatus.innerText = 'Estado: Esperando...';
        poseStatus.style.color = '#ff4141';
    }
}

function startStopTimer() {
    if (running) {
        clearInterval(timer);
        running = false;
        startStopButton.innerText = 'Iniciar Ejercicio';
        calculateRewards();
    } else {
        startTime = Date.now();
        timer = setInterval(updateTime, 1000);
        running = true;
        startStopButton.innerText = 'Detener Ejercicio';
        detectPose();
    }
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    timeDisplay.innerText = '00:00:00';
    startStopButton.innerText = 'Iniciar Ejercicio';
}

function updateTime() {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const seconds = Math.floor((elapsed / 1000) % 60);
    const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
    const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
    timeDisplay.innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
    return number.toString().padStart(2, '0');
}

function calculateRewards() {
    const elapsedTime = (Date.now() - startTime) / 1000;
    let caloriesBurned = elapsedTime * 0.1; // Ajustar la fórmula según el ejercicio
    let experience = elapsedTime * 0.2;
    let coins = elapsedTime * 0.05;

    document.getElementById('calories-burned').innerText = `Calorías quemadas: ${Math.round(caloriesBurned)}`;
    document.getElementById('experience-earned').innerText = `Experiencia ganada: ${Math.round(experience)}`;
    document.getElementById('coins-earned').innerText = `Monedas ganadas: ${Math.round(coins)}`;

    const rewards = {
        caloriesBurned: Math.round(caloriesBurned),
        experience: Math.round(experience),
        coins: Math.round(coins)
    };
    localStorage.setItem('workoutRewards', JSON.stringify(rewards));
}

function navigateTo(page) {
    window.location.href = page + ".html";
}

startStopButton.addEventListener('click', startStopTimer);
resetButton.addEventListener('click', resetTimer);

setupCamera().then(() => {
    videoElement.play();
    loadPosenet();
});
