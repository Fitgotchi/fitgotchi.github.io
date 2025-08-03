document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('fitgotchiUser')) {
        loadUser();
    } else {
        createNewUser();
    }

    updateFitcoinsDisplay();

    document.getElementById('sleep-button').addEventListener('click', () => {
        updateSleep();
        saveState();
    });
    document.getElementById('feed-button').addEventListener('click', () => {
        feedFitGotchi();
        saveState();
    });
    document.getElementById('play-button').addEventListener('click', () => {
        exerciseFitGotchi();
        saveState();
    });

    setInterval(updateSleepDaily, 86400000);
    setInterval(increaseHungerOverTime, 60000);
    setInterval(increaseEnergyOverTime, 60000);

    loadDailyMissions();

    const avatar = document.createElement('img');
    avatar.id = 'fitgotchi-avatar';
    avatar.src = 'img/neutral.png';
    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'avatar-container';
    avatarContainer.appendChild(avatar);
    document.querySelector('.container').insertBefore(avatarContainer, document.querySelector('.fitcoin-display'));

    const alertDiv = document.createElement('div');
    alertDiv.id = 'fitgotchi-alert';
    document.body.appendChild(alertDiv);

    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = '🔓 Cerrar Sesión';
    logoutBtn.className = 'logout';
    logoutBtn.onclick = logoutUser;
    document.querySelector('.actions')?.appendChild(logoutBtn);
});

function updateName() {
    const nameInput = document.getElementById('fitgotchi-name').value;
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (user) {
        user.name = nameInput;
        localStorage.setItem('fitgotchiUser', JSON.stringify(user));
    }
}

function createNewUser() {
    const name = prompt('Nombre de tu FitGotchi:');
    const password = prompt('Contraseña para guardar tu progreso:');
    if (name && password) {
        const newUser = {
            name,
            password,
            serial: generateSerialNumber(),
            stats: {
                level: 1,
                experience: 0,
                speed: 0,
                cardio: 0,
                endurance: 0,
                strength: 0,
                agility: 0,
                energy: 100,
                hunger: 50,
                sleep: 80
            },
            fitcoins: 0,
            skills: {
                speed: 1,
                strength: 1,
                cardio: 1,
                endurance: 1,
                agility: 1
            },
            lastSleepUpdate: Date.now()
        };
        localStorage.setItem('fitgotchiUser', JSON.stringify(newUser));
        loadUser();
        updateFitcoinsDisplay();
    }
}

function loadUser() {
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (!user) return;
    document.getElementById('fitgotchi-name').value = user.name;
    document.getElementById('serial-number').textContent = `Número de serie: ${user.serial}`;
    loadState(user);
    updateFitcoinsDisplay();
}

function generateSerialNumber() {
    return 'SN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function saveState() {
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (!user) return;
    user.name = document.getElementById('fitgotchi-name').value;
    user.serial = document.getElementById('serial-number').textContent.replace('Número de serie: ', '');
    const ids = ['energy', 'hunger', 'sleep', 'speed', 'cardio', 'endurance', 'strength', 'agility', 'level', 'experience'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) user.stats[id] = parseInt(el.value);
    });
    localStorage.setItem('fitgotchiUser', JSON.stringify(user));
}

function loadState(user) {
    if (user && user.stats) {
        const keys = ['energy', 'hunger', 'sleep', 'speed', 'cardio', 'endurance', 'strength', 'agility', 'level', 'experience'];
        keys.forEach(key => {
            const el = document.getElementById(key);
            if (el && user.stats[key] !== undefined) {
                el.value = user.stats[key];
            }
        });
    }
}

function updateMetric(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.value = value;
        updateFitgotchiImage();
    }
}

function updateFitcoinsDisplay() {
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (user && document.getElementById('fitcoins-count')) {
        document.getElementById('fitcoins-count').textContent = user.fitcoins || 0;
    }
}

function navigateTo(page) {
    window.location.href = `${page}.html`;
}

function feedFitGotchi() {
    window.location.href = 'feed.html';
}

function exerciseFitGotchi() {
    const getVal = id => parseInt(document.getElementById(id).value);
    updateMetric('energy', Math.max(0, getVal('energy') - 20));
    updateMetric('hunger', Math.min(100, getVal('hunger') + 10));
    updateMetric('speed', getVal('speed') + 1);
    updateMetric('cardio', getVal('cardio') + 2);
    updateMetric('endurance', getVal('endurance') + 1);
    updateMetric('strength', getVal('strength') + 1);
    updateMetric('agility', getVal('agility') + 1);
    let experience = getVal('experience') + 10;
    updateMetric('experience', experience);
    let level = Math.floor(experience / 100);
    updateMetric('level', level);
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (user) {
        user.fitcoins = (user.fitcoins || 0) + 5;
        localStorage.setItem('fitgotchiUser', JSON.stringify(user));
        showAlert(`¡Ganaste 5 FitCoins! 💰 Total: ${user.fitcoins}`);
        updateFitcoinsDisplay();
    }
    saveState();
    window.location.href = 'exercise.html';
}

function increaseHungerOverTime() {
    let hunger = parseInt(document.getElementById('hunger').value);
    updateMetric('hunger', Math.min(100, hunger + 1));
    saveState();
}

function increaseEnergyOverTime() {
    let energy = parseInt(document.getElementById('energy').value);
    updateMetric('energy', Math.min(100, energy + 1));
    saveState();
}

function updateSleep() {
    let hours = parseInt(prompt("¿Cuántas horas dormiste hoy?"));
    let sleepPercentage = 0;
    if (hours >= 7) sleepPercentage = 100;
    else if (hours >= 5) sleepPercentage = 75;
    else if (hours >= 3) sleepPercentage = 25;
    else sleepPercentage = 0;
    updateMetric('sleep', sleepPercentage);
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (user) {
        user.lastSleepUpdate = Date.now();
        localStorage.setItem('fitgotchiUser', JSON.stringify(user));
    }
    saveState();
}

function updateSleepDaily() {
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (!user) return;
    const now = Date.now();
    if (now - user.lastSleepUpdate > 86400000) {
        const currentSleep = parseInt(document.getElementById('sleep').value);
        updateMetric('sleep', Math.min(100, currentSleep + 10));
        user.lastSleepUpdate = now;
        localStorage.setItem('fitgotchiUser', JSON.stringify(user));
        saveState();
    }
}

function updateFitgotchiImage() {
    const energy = parseInt(document.getElementById('energy').value);
    const hunger = parseInt(document.getElementById('hunger').value);
    const sleep = parseInt(document.getElementById('sleep').value);
    const avatar = document.getElementById('fitgotchi-avatar');
    if (!avatar) return;
    if (energy > 70 && hunger < 40 && sleep > 60) {
        avatar.src = 'img/happy.png';
    } else if (hunger > 80 || sleep < 30) {
        avatar.src = 'img/sad.png';
    } else if (energy < 30) {
        avatar.src = 'img/tired.png';
    } else {
        avatar.src = 'img/neutral.png';
    }
}

function showAlert(message) {
    const alertBox = document.getElementById('fitgotchi-alert');
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.classList.add('show');
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
}

function upgradeSkill(skill) {
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (!user || !user.skills || !user.fitcoins) return;
    const currentLevel = user.skills[skill];
    const cost = currentLevel * 10;
    if (user.fitcoins >= cost) {
        user.skills[skill]++;
        user.fitcoins -= cost;
        localStorage.setItem('fitgotchiUser', JSON.stringify(user));
        showAlert(`Mejoraste ${skill} a nivel ${user.skills[skill]} 🎯`);
        updateFitcoinsDisplay();
    } else {
        showAlert(`Necesitás ${cost} FitCoins para mejorar ${skill}`);
    }
}
