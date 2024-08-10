function navigateTo(page) {
    window.location.href = page + ".html";
}

let timer;
let secondsRemaining = 300;
let isRunning = false;
let instructionIndex = 0;
const instructionInterval = 5; // Cambiar la instrucción cada 30 segundos

const instructions = [
    "¡Prepárate para comenzar! 🏃‍♂️",
    "¡Empieza a trotar suavemente! 🏃",
    "Mantén un ritmo constante. 🕒",
    "¡Estás haciendo un gran trabajo! 💪",
    "¡Mantén el ritmo, ya casi terminas! 🏅",
    "¡Excelente trabajo, sigue así! 🎉"
];

function updateTime() {
    if (secondsRemaining <= 0) {
        clearInterval(timer);
        document.getElementById('start-stop-button').textContent = 'Iniciar';
        isRunning = false;
        document.getElementById('experience-earned').textContent = 'Experiencia ganada: 20';
        document.getElementById('coins-earned').textContent = 'Monedas ganadas: 50';
        document.getElementById('calories-burned').textContent = 'Calorías quemadas: 100';
        return;
    }
    
    secondsRemaining--;
    const minutes = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    document.getElementById('time-display').textContent = 
        String(minutes).padStart(2, '0') + ':' +
        String(secs).padStart(2, '0');

    // Cambiar la instrucción según el tiempo transcurrido
    if (secondsRemaining % instructionInterval === 0) {
        instructionIndex = Math.floor((300 - secondsRemaining) / instructionInterval);
        if (instructionIndex < instructions.length) {
            document.getElementById('instruction-display').textContent = instructions[instructionIndex];
        }
    }
}

document.getElementById('start-stop-button').addEventListener('click', function() {
    if (isRunning) {
        clearInterval(timer);
        this.textContent = 'Iniciar';
    } else {
        timer = setInterval(updateTime, 1000);
        this.textContent = 'Detener';
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
    instructionIndex = 0;
    document.getElementById('instruction-display').textContent = instructions[instructionIndex];
});

document.getElementById('end-button').addEventListener('click', function() {
    clearInterval(timer);
    isRunning = false;
    document.getElementById('start-stop-button').textContent = 'Iniciar';
    document.getElementById('experience-earned').textContent = 'Experiencia ganada: 20';
    document.getElementById('coins-earned').textContent = 'Monedas ganadas: 50';
    document.getElementById('calories-burned').textContent = 'Calorías quemadas: 100';
});
