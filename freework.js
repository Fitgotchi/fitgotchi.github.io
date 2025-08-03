let timer;
let startTime;
let totalRoutineTime = 0;
let running = false;
let routineExercises = [];

function startStopTimer() {
    if (running) {
        clearInterval(timer);
        running = false;
        updateButtonState('start');
        calculateRewardsAndUpdateUser();
    } else {
        if (routineExercises.length === 0) {
            alert('Agrega al menos un ejercicio a la rutina antes de iniciar.');
            return;
        }
        totalRoutineTime = routineExercises.reduce((acc, ex) => acc + (ex.duration * 60), 0);
        if (isNaN(totalRoutineTime) || totalRoutineTime <= 0) {
            alert('La duración total de la rutina no es válida.');
            return;
        }
        startTime = Date.now();
        timer = setInterval(updateTime, 1000);
        running = true;
        updateButtonState('stop');
    }
}

function updateTime() {
    const elapsed = (Date.now() - startTime) / 1000;
    updateDisplayTime(elapsed);
    updateProgressBar(elapsed, totalRoutineTime);
    if (elapsed >= totalRoutineTime) {
        finishActivity();
    }
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    startTime = null;
    updateDisplayTime(0);
    updateButtonState('start');
    updateProgressBar(0, totalRoutineTime);
    clearRoutine();
    resetRewards();
}

function finishActivity() {
    if (!startTime) {
        alert("No has iniciado ninguna rutina.");
        return;
    }
    clearInterval(timer);
    running = false;
    calculateRewardsAndUpdateUser();
    const elapsedTime = (Date.now() - startTime) / 1000;
    const currentTime = new Date();
    const activityDetails = {
        routine: [...routineExercises],
        elapsedTime,
        date: currentTime.toLocaleDateString(),
        time: currentTime.toLocaleTimeString(),
        rewards: JSON.parse(localStorage.getItem('workoutRewards')) || {}
    };
    const history = JSON.parse(localStorage.getItem('activityHistory')) || [];
    history.push(activityDetails);
    localStorage.setItem('activityHistory', JSON.stringify(history));
    updateButtonState('start');
    resetTimer();
    alert('¡Actividad finalizada! Tus datos han sido guardados en el historial.');
}

function updateDisplayTime(elapsed) {
    const seconds = Math.floor(elapsed % 60);
    const minutes = Math.floor((elapsed / 60) % 60);
    const hours = Math.floor(elapsed / 3600);
    document.getElementById('time-display').innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function updateProgressBar(elapsed, total) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const percentage = total > 0 ? (elapsed / total) * 100 : 0;
        progressBar.style.width = `${Math.min(percentage, 100)}%`;
    }
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('fitgotchiUser');
        if (!userStr) return null;
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

function saveCurrentUser(user) {
    if (!user) return;
    localStorage.setItem('fitgotchiUser', JSON.stringify(user));
}

function calculateRewardsAndUpdateUser() {
    if (!startTime) return;
    let totalCalories = 0, totalExp = 0, totalCoins = 0;
    routineExercises.forEach(({type, intensity, duration}) => {
        let calories = 0, exp = 0, coins = 0;
        switch (type) {
            case 'warm-up': calories = duration * 0.03 * 60; break;
            case 'cardio': calories = duration * 0.1 * 60; break;
            case 'strength': calories = duration * 0.08 * 60; break;
            case 'stretching': calories = duration * 0.05 * 60; break;
            case 'custom': calories = duration * 0.06 * 60; break;
            default: calories = duration * 0.05 * 60; break;
        }
        switch (intensity) {
            case 'intense':
                calories *= 1.5;
                exp = duration * 0.2 * 60;
                coins = duration * 0.1 * 60;
                break;
            case 'full':
                calories *= 2;
                exp = duration * 0.3 * 60;
                coins = duration * 0.15 * 60;
                break;
            default:
                exp = duration * 0.1 * 60;
                coins = duration * 0.05 * 60;
                break;
        }
        totalCalories += calories;
        totalExp += exp;
        totalCoins += coins;
    });
    const caloriesBurned = Math.round(totalCalories);
    const experience = Math.round(totalExp);
    const coins = Math.round(totalCoins);
    updateRewards(caloriesBurned, experience, coins);
    localStorage.setItem('workoutRewards', JSON.stringify({caloriesBurned, experience, coins}));
    const user = getCurrentUser();
    if (user) {
        user.stats = user.stats || {};
        user.fitcoins = (user.fitcoins || 0) + coins;
        user.stats.experience = (user.stats.experience || 0) + experience;
        user.stats.level = Math.floor(user.stats.experience / 100);
        saveCurrentUser(user);
        showAlert(`¡Ganaste ${coins} FitCoins y ${experience} de experiencia! 🎉`);
    }
}

function updateRewards(calories, exp, coins) {
    document.getElementById('calories-burned').innerText = `Calorías quemadas: ${calories}`;
    document.getElementById('experience-earned').innerText = `Experiencia ganada: ${exp}`;
    document.getElementById('coins-earned').innerText = `Monedas ganadas: ${coins}`;
}

function resetRewards() {
    updateRewards(0, 0, 0);
}

function updateButtonState(state) {
    const btn = document.getElementById('start-routine-button');
    if (state === 'start') {
        btn.innerText = 'Iniciar Rutina';
        btn.setAttribute('aria-pressed', 'false');
    } else {
        btn.innerText = 'Detener Rutina';
        btn.setAttribute('aria-pressed', 'true');
    }
}

function updateSpecificExercises(category) {
    const select = document.getElementById('specific-exercise-select');
    select.innerHTML = '<option value="">Seleccionar...</option>';
    const options = {
        'warm-up': ['Saltos suaves', 'Rotaciones articulares', 'Trote en el lugar'],
        'cardio': ['Jumping Jacks', 'Burpees', 'Correr en el lugar'],
        'strength': ['Flexiones', 'Sentadillas', 'Abdominales'],
        'stretching': ['Estiramiento de piernas', 'Estiramiento de brazos', 'Estiramiento de espalda']
    };
    (options[category] || []).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
    });
}

function clearRoutine() {
    routineExercises = [];
    document.getElementById('routine-steps').innerHTML = '';
}

document.getElementById('exercise-name-select').addEventListener('change', function () {
    const custom = document.getElementById('custom-exercise-container');
    const specific = document.getElementById('specific-exercise-container');
    if (this.value === 'custom') {
        custom.style.display = 'block';
        specific.style.display = 'none';
    } else {
        custom.style.display = 'none';
        specific.style.display = 'block';
        updateSpecificExercises(this.value);
    }
});

document.getElementById('add-exercise-button').addEventListener('click', function () {
    const type = document.getElementById('exercise-name-select').value;
    const name = type === 'custom'
        ? document.getElementById('exercise-name').value.trim()
        : (document.getElementById('specific-exercise-select').value || document.getElementById('exercise-name-select').options[document.getElementById('exercise-name-select').selectedIndex].text);
    const intensity = document.getElementById('exercise-intensity').value;
    const durationStr = document.getElementById('exercise-duration').value.trim();
    const duration = parseInt(durationStr, 10);
    if (!name) {
        alert('Por favor, ingresa un nombre para el ejercicio.');
        return;
    }
    if (!intensity) {
        alert('Por favor, selecciona la intensidad.');
        return;
    }
    if (isNaN(duration) || duration <= 0) {
        alert('Por favor, ingresa una duración válida (mayor a 0).');
        return;
    }
    routineExercises.push({ type, name, intensity, duration });
    const li = document.createElement('li');
    li.innerText = `${name} - Intensidad: ${intensity} - Duración: ${duration} minutos`;
    document.getElementById('routine-steps').appendChild(li);
    if (type === 'custom') document.getElementById('exercise-name').value = '';
    document.getElementById('exercise-duration').value = '';
});

document.getElementById('start-routine-button').addEventListener('click', startStopTimer);
document.getElementById('reset-button').addEventListener('click', resetTimer);
document.getElementById('finish-button').addEventListener('click', finishActivity);

document.getElementById('exercise-name-select').value = 'warm-up';
updateSpecificExercises('warm-up');

function navigateTo(page) {
    window.location.href = `${page}.html`;
}

function showAlert(message) {
    const alertBox = document.getElementById('fitgotchi-alert') || createAlertBox();
    alertBox.textContent = message;
    alertBox.classList.remove('hide');
    alertBox.classList.add('show');

    // Desaparece con fade out después de 3s
    setTimeout(() => {
        alertBox.classList.remove('show');
        alertBox.classList.add('hide');

        // Limpiar texto y clases tras transición (0.5s)
        setTimeout(() => {
            alertBox.textContent = '';
            alertBox.classList.remove('hide');
        }, 500);
    }, 3000);
}

function createAlertBox() {
    const alertBox = document.createElement('div');
    alertBox.id = 'fitgotchi-alert';
    alertBox.style.position = 'fixed';
    alertBox.style.bottom = '20px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.background = '#00ff90';
    alertBox.style.color = '#000';
    alertBox.style.padding = '10px 20px';
    alertBox.style.borderRadius = '10px';
    alertBox.style.fontWeight = 'bold';
    alertBox.style.zIndex = '9999';
    alertBox.style.opacity = '0';
    alertBox.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(alertBox);
    return alertBox;
}
