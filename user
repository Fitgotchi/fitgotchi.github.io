const secretKey = 'your-secret-key'; // Usa una clave secreta fuerte para encriptar la contraseña

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('fitgotchiUser')) {
        loadUser();
    }
});

function encryptPassword(password) {
    return CryptoJS.AES.encrypt(password, secretKey).toString();
}

function decryptPassword(encryptedPassword) {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

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
            password: encryptPassword(password),
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
            }
        };
        localStorage.setItem('fitgotchiUser', JSON.stringify(newUser));
        loadUser();
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
    const user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (user) {
        user.stats = {
            energy: document.getElementById('energy').value,
            hunger: document.getElementById('hunger').value,
            sleep: document.getElementById('sleep').value,
            speed: document.getElementById('speed').value,
            cardio: document.getElementById('cardio').value,
            endurance: document.getElementById('endurance').value,
            strength: document.getElementById('strength').value,
            level: document.getElementById('level').value,
            experience: document.getElementById('experience').value
        };
        localStorage.setItem('fitgotchiUser', JSON.stringify(user));
    }
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
