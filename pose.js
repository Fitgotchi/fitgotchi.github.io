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
    { instruction: 'Abre los brazos', validate: armsOpen },
    { instruction: 'Estira los brazos hacia adelante', validate: armsForward },
    { instruction: 'Sube los brazos', validate: armsUp },
    { instruction: 'Toca tus hombros con las manos', validate: touchShoulders }
];

let currentInstruction = 0;
let timer, startTime, running = false, animationFrameId;

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        return new Promise((res) => {
            videoElement.onloadedmetadata = () => {
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
                res(videoElement);
            };
        });
    } catch (e) {
        console.error('No se pudo acceder a la cámara:', e);
    }
}

async function loadPosenet() {
    net = await posenet.load();
}

async function detectPose() {
    if (!running || !net) return;
    try {
        const pose = await net.estimateSinglePose(videoElement, { flipHorizontal: false });
        drawKeypoints(pose);
        checkPose(pose);
    } catch (e) {
        console.error('Error en la detección:', e);
    }
    animationFrameId = requestAnimationFrame(detectPose);
}

function drawKeypoints(pose) {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    pose.keypoints.forEach(({ score, position: { x, y } }) => {
        if (score > 0.5) {
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
            canvasCtx.fillStyle = 'aqua';
            canvasCtx.fill();
        }
    });
}

function checkPose(pose) {
    const keypoints = pose.keypoints.reduce((map, kp) => { map[kp.part] = kp; return map; }, {});
    const valid = instructions[currentInstruction].validate(keypoints);
    updatePoseStatus(valid);
}

function updatePoseStatus(valid) {
    if (valid) {
        poseStatus.innerText = 'Estado: OK';
        poseStatus.style.color = '#39ff14';
        currentInstruction = (currentInstruction + 1) % instructions.length;
        poseInstruction.innerText = `Instrucción: ${instructions[currentInstruction].instruction}`;
    } else {
        poseStatus.innerText = 'Estado: Esperando...';
        poseStatus.style.color = '#ff4141';
    }
}

function getAngle(a, b, c) {
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const cb = { x: b.x - c.x, y: b.y - c.y };
    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.hypot(ab.x, ab.y);
    const magCB = Math.hypot(cb.x, cb.y);
    return Math.acos(dot / (magAB * magCB)) * (180 / Math.PI);
}

// Validaciones

function armsOpen(kp) {
    return validateArmAngle(kp, 80, 100);
}

function armsForward(kp) {
    return validateArmAngle(kp, 160, 200);
}

function armsUp(kp) {
    if (!kp.leftWrist || !kp.rightWrist || !kp.leftShoulder || !kp.rightShoulder) return false;
    return kp.leftWrist.position.y < kp.leftShoulder.position.y &&
           kp.rightWrist.position.y < kp.rightShoulder.position.y;
}

function touchShoulders(kp) {
    if (!kp.leftWrist || !kp.leftShoulder || !kp.rightWrist || !kp.rightShoulder) return false;
    const lDist = Math.abs(kp.leftWrist.position.x - kp.leftShoulder.position.x) +
                  Math.abs(kp.leftWrist.position.y - kp.leftShoulder.position.y);
    const rDist = Math.abs(kp.rightWrist.position.x - kp.rightShoulder.position.x) +
                  Math.abs(kp.rightWrist.position.y - kp.rightShoulder.position.y);
    return lDist < 60 && rDist < 60;
}

function validateArmAngle(kp, min, max) {
    if (!kp.leftShoulder || !kp.leftElbow || !kp.leftWrist ||
        !kp.rightShoulder || !kp.rightElbow || !kp.rightWrist) return false;

    const l = getAngle(kp.leftShoulder.position, kp.leftElbow.position, kp.leftWrist.position);
    const r = getAngle(kp.rightShoulder.position, kp.rightElbow.position, kp.rightWrist.position);

    return l > min && l < max && r > min && r < max;
}

function startStopTimer() {
    if (running) {
        clearInterval(timer);
        running = false;
        startStopButton.innerText = 'Iniciar Ejercicio';
        calculateRewards();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
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
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
}

function updateTime() {
    const elapsed = Date.now() - startTime;
    const s = Math.floor((elapsed / 1000) % 60);
    const m = Math.floor((elapsed / 60000) % 60);
    const h = Math.floor((elapsed / 3600000) % 24);
    timeDisplay.innerText = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function pad(n) {
    return n.toString().padStart(2, '0');
}

function calculateRewards() {
    const elapsed = (Date.now() - startTime) / 1000;
    const cals = Math.round(elapsed * 0.1);
    const exp = Math.round(elapsed * 0.2);
    const coins = Math.round(elapsed * 0.05);

    document.getElementById('calories-burned').innerText = `Calorías quemadas: ${cals}`;
    document.getElementById('experience-earned').innerText = `Experiencia ganada: ${exp}`;
    document.getElementById('coins-earned').innerText = `Monedas ganadas: ${coins}`;

    const old = JSON.parse(localStorage.getItem('fitUserStats')) || { calories: 0, experience: 0, coins: 0 };
    const updated = {
        calories: old.calories + cals,
        experience: old.experience + exp,
        coins: old.coins + coins
    };
    localStorage.setItem('fitUserStats', JSON.stringify(updated));
}

function navigateTo(p) {
    window.location.href = p + ".html";
}

startStopButton.addEventListener('click', startStopTimer);
resetButton.addEventListener('click', resetTimer);

setupCamera().then(() => {
    videoElement.play();
    loadPosenet();
});
