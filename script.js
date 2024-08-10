document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('fitgotchiUser')) {
        loadUser();
    } else {
        createNewUser();
    }
    setInterval(updateSleepDaily, 86400000); // Actualiza el sueño diariamente
    setInterval(increaseHungerOverTime, 60000); // Aumenta el hambre cada minuto
    setInterval(increaseEnergyOverTime, 60000); // Aumenta la energía cada minuto
});

function updateName() {
    const fitgotchiName = document.getElementById('fitgotchi-name').value;
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (user) {
        user.name = fitgotchiName;
        localStorage.setItem('fitgotchiUser', JSON.stringify(user));
    }
}

function createNewUser() {
    const fitgotchiName = prompt('Ingresa el nombre de tu FitGotchi:');
    const password = prompt('Ingresa una contraseña:');
    if (fitgotchiName && password) {
        const serialNumber = generateSerialNumber();
        const newUser = {
            name: fitgotchiName,
            password: password,
            serial: serialNumber,
            stats: {
                level: 0,
                experience: 0,
                speed: 0,
                cardio: 0,
                endurance: 0,
                strength: 0,
                energy: 100,
                hunger: 50,
                sleep: 80
            },
            lastSleepUpdate: new Date().getTime()
        };

        localStorage.setItem('fitgotchiUser', JSON.stringify(newUser));
        loadUser(); // Carga los datos del nuevo usuario
    }
}

function loadUser() {
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (user) {
        document.getElementById('fitgotchi-name').value = user.name;
        document.getElementById('serial-number').textContent = `Número de serie: ${user.serial}`;
        loadState(user);
    }
}

function generateSerialNumber() {
    return 'SN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function saveState() {
    const user = {
        name: document.getElementById('fitgotchi-name').value,
        serial: document.getElementById('serial-number').textContent.replace('Número de serie: ', ''),
        stats: {
            energy: document.getElementById('energy').value,
            hunger: document.getElementById('hunger').value,
            sleep: document.getElementById('sleep').value,
            speed: document.getElementById('speed').value,
            cardio: document.getElementById('cardio').value,
            endurance: document.getElementById('endurance').value,
            strength: document.getElementById('strength').value,
            level: document.getElementById('level').value,
            experience: document.getElementById('experience').value
        },
        lastSleepUpdate: JSON.parse(localStorage.getItem('fitgotchiUser')).lastSleepUpdate
    };

    localStorage.setItem('fitgotchiUser', JSON.stringify(user));
}

function loadState(user) {
    if (user) {
        updateMetric('energy', user.stats.energy);
        updateMetric('hunger', user.stats.hunger);
        updateMetric('sleep', user.stats.sleep);
        updateMetric('speed', user.stats.speed);
        updateMetric('cardio', user.stats.cardio);
        updateMetric('endurance', user.stats.endurance);
        updateMetric('strength', user.stats.strength);
        updateMetric('level', user.stats.level);
        updateMetric('experience', user.stats.experience);
    }
}

function updateMetric(id, value) {
    document.getElementById(id).value = value;
    document.getElementById(id).dispatchEvent(new Event('change')); 
    saveState();
}

function resetMetrics() {
    updateMetric('energy', 50);
    updateMetric('hunger', 50);
    updateMetric('sleep', 50);
    updateMetric('speed', 0);
    updateMetric('cardio', 0);
    updateMetric('endurance', 0);
    updateMetric('strength', 0);
    updateMetric('level', 1);
    updateMetric('experience', 0);
}

function navigateTo(page) {
    window.location.href = page + ".html";
}

function feedFitGotchi() {
    window.location.href = 'feed.html';
}

function exerciseFitGotchi() {
    let energy = document.getElementById('energy').value;
    energy = Math.max(0, energy - 20); // Consume energía al ejercitarse
    updateMetric('energy', energy);

    let hunger = document.getElementById('hunger').value;
    hunger = Math.min(100, parseInt(hunger) + 10); // Aumenta el hambre al ejercitarse
    updateMetric('hunger', hunger);

    // Incrementar las métricas al ejercitarse
    let speed = parseInt(document.getElementById('speed').value) + 1;
    updateMetric('speed', speed);
    
    let cardio = parseInt(document.getElementById('cardio').value) + 2;
    updateMetric('cardio', cardio);
    
    let endurance = parseInt(document.getElementById('endurance').value) + 1;
    updateMetric('endurance', endurance);
    
    let strength = parseInt(document.getElementById('strength').value) + 1;
    updateMetric('strength', strength);
    
    let experience = parseInt(document.getElementById('experience').value) + 5;
    updateMetric('experience', experience);

    // Incrementar el nivel basado en la experiencia
    let level = Math.floor(experience / 100);
    updateMetric('level', level);

    // Redirigir a exercise.html
    window.location.href = 'exercise.html';
}

function increaseHungerOverTime() {
    let hunger = document.getElementById('hunger').value;
    hunger = Math.min(100, parseInt(hunger) + 1);
    updateMetric('hunger', hunger);
}

function increaseEnergyOverTime() {
    let energy = document.getElementById('energy').value;
    energy = Math.min(100, parseInt(energy) + 1);
    updateMetric('energy', energy);
}

function updateSleep() {
    let hours = prompt("¿Cuántas horas dormiste hoy?");
    let sleepPercentage = 0;
    if (hours >= 7) {
        sleepPercentage = 100;
    } else if (hours >= 5) {
        sleepPercentage = 75;
    } else if (hours >= 3) {
        sleepPercentage = 25;
    } else {
        sleepPercentage = 0;
    }
    updateMetric('sleep', sleepPercentage);

    // Actualiza el timestamp del último sueño
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    user.lastSleepUpdate = new Date().getTime();
    localStorage.setItem('fitgotchiUser', JSON.stringify(user));
}

function updateSleepDaily() {
    const now = new Date().getTime();
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (user) {
        let lastSleepUpdate = user.lastSleepUpdate;
        if (lastSleepUpdate && now - lastSleepUpdate > 86400000) { // 24 horas en milisegundos
            updateMetric('sleep', Math.min(100, parseInt(document.getElementById('sleep').value) + 10));
            user.lastSleepUpdate = now;
            localStorage.setItem('fitgotchiUser', JSON.stringify(user));
        }
    }
}

document.getElementById('sleep-button').addEventListener('click', updateSleep);
document.getElementById('feed-button').addEventListener('click', feedFitGotchi);
document.getElementById('play-button').addEventListener('click', exerciseFitGotchi);
