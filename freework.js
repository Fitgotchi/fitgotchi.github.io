let timer;
let startTime;
let running = false;

function startStopTimer() {
    if (running) {
        clearInterval(timer);
        running = false;
        updateButtonState('start');
        calculateRewards();
    } else {
        startTime = Date.now();
        timer = setInterval(updateTime, 1000);
        running = true;
        updateButtonState('stop');
    }
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    updateDisplayTime(0);
    updateButtonState('start');
    resetCircularProgress();
}

function finishActivity() {
    clearInterval(timer);
    running = false;
    calculateRewards();

    const elapsedTime = (Date.now() - startTime) / 1000;
    const workoutType = document.getElementById('exercise-name-select').value;
    const intensity = document.getElementById('exercise-intensity').value;
    const currentTime = new Date();
    const rewards = JSON.parse(localStorage.getItem('workoutRewards'));

    const activityDetails = {
        workoutType: workoutType,
        intensity: intensity,
        elapsedTime: elapsedTime,
        date: currentTime.toLocaleDateString(),
        time: currentTime.toLocaleTimeString(),
        rewards: rewards
    };

    let history = JSON.parse(localStorage.getItem('activityHistory')) || [];
    history.push(activityDetails);
    localStorage.setItem('activityHistory', JSON.stringify(history));

    updateButtonState('start');
    resetTimer();
    alert('Actividad finalizada y guardada en el historial.');
}

function updateTime() {
    const elapsed = Date.now() - startTime;
    updateDisplayTime(elapsed);
    updateCircularProgress(elapsed);
}

function updateDisplayTime(elapsed) {
    const seconds = Math.floor((elapsed / 1000) % 60);
    const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
    const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
    document.getElementById('time-display').innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function updateCircularProgress(elapsed) {
    const progress = Math.min((elapsed / 60000) * 100, 100);
    document.querySelector('.circular-progress').style.background = `conic-gradient(
        rgba(57, 255, 20, 0.5) 0%,
        rgba(57, 255, 20, 0.5) ${progress}%,
        transparent ${progress}%,
        transparent 100%
    )`;
}

function resetCircularProgress() {
    document.querySelector('.circular-progress').style.background = `conic-gradient(
        transparent 0%,
        transparent 100%
    )`;
}

function pad(number) {
    return number.toString().padStart(2, '0');
}

function calculateRewards() {
    const elapsedTime = (Date.now() - startTime) / 1000;
    const workoutType = document.getElementById('exercise-name-select').value;
    const intensity = document.getElementById('exercise-intensity').value;

    let caloriesBurned = 0;
    let experience = 0;
    let coins = 0;

    switch (workoutType) {
        case 'warm-up':
            caloriesBurned = elapsedTime * 0.03;
            break;
        case 'cardio':
            caloriesBurned = elapsedTime * 0.1;
            break;
        case 'strength':
            caloriesBurned = elapsedTime * 0.08;
            break;
        case 'stretching':
            caloriesBurned = elapsedTime * 0.05;
            break;
    }

    switch (intensity) {
        case 'intense':
            caloriesBurned *= 1.5;
            experience = elapsedTime * 0.2;
            coins = elapsedTime * 0.1;
            break;
        case 'full':
            caloriesBurned *= 2;
            experience = elapsedTime * 0.3;
            coins = elapsedTime * 0.15;
            break;
        default:
            experience = elapsedTime * 0.1;
            coins = elapsedTime * 0.05;
            break;
    }

    updateRewards(Math.round(caloriesBurned), Math.round(experience), Math.round(coins));

    const rewards = {
        caloriesBurned: Math.round(caloriesBurned),
        experience: Math.round(experience),
        coins: Math.round(coins)
    };
    localStorage.setItem('workoutRewards', JSON.stringify(rewards));
}

function updateRewards(caloriesBurned, experience, coins) {
    document.getElementById('calories-burned').innerText = `Calorías quemadas: ${caloriesBurned}`;
    document.getElementById('experience-earned').innerText = `Experiencia ganada: ${experience}`;
    document.getElementById('coins-earned').innerText = `Monedas ganadas: ${coins}`;
}

function updateButtonState(state) {
    const button = document.getElementById('start-routine-button');
    if (state === 'start') {
        button.innerText = 'Iniciar Rutina';
        button.setAttribute('aria-pressed', 'false');
    } else {
        button.innerText = 'Detener Rutina';
        button.setAttribute('aria-pressed', 'true');
    }
}

function navigateTo(page) {
    window.location.href = page + ".html";
}

document.getElementById('start-routine-button').addEventListener('click', startStopTimer);
document.getElementById('reset-button').addEventListener('click', resetTimer);
document.getElementById('finish-button').addEventListener('click', finishActivity);

document.getElementById('exercise-name-select').addEventListener('change', function() {
    const customExerciseContainer = document.getElementById('custom-exercise-container');
    if (this.value === 'custom') {
        customExerciseContainer.style.display = 'block';
    } else {
        customExerciseContainer.style.display = 'none';
    }
});

document.getElementById('add-exercise-button').addEventListener('click', function() {
    const exerciseNameSelect = document.getElementById('exercise-name-select');
    const exerciseName = exerciseNameSelect.value === 'custom' ? document.getElementById('exercise-name').value : exerciseNameSelect.options[exerciseNameSelect.selectedIndex].text;
    const intensity = document.getElementById('exercise-intensity').value;
    const duration = document.getElementById('exercise-duration').value;

    if (exerciseName && intensity && duration) {
        const listItem = document.createElement('li');
        listItem.innerText = `${exerciseName} - ${intensity} - ${duration} minutos`;
        document.getElementById('routine-steps').appendChild(listItem);

        document.getElementById('exercise-name').value = '';
        document.getElementById('exercise-duration').value = '';
    } else {
        alert('Por favor, complete todos los campos.');
    }
});
