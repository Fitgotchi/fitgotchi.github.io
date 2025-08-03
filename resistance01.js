function startRoutine(routine) {
    const exerciseName = document.getElementById('exerciseName');
    const exerciseExecution = document.getElementById('exerciseExecution');
    const routineSelection = document.getElementById('routineSelection');

    let exerciseDuration = 30;
    let exerciseLabel = '';

    switch (routine) {
        case 'routine1':
            exerciseLabel = 'Flexiones Suaves';
            exerciseDuration = 30;
            break;
        case 'routine2':
            exerciseLabel = 'Sentadillas Lentas';
            exerciseDuration = 45;
            break;
        case 'routine3':
            exerciseLabel = 'Planchas Cortas';
            exerciseDuration = 60;
            break;
    }

    exerciseName.innerText = exerciseLabel;
    routineSelection.classList.add('hidden');
    exerciseExecution.classList.remove('hidden');

    startTimer(exerciseDuration);
}

function startTimer(duration) {
    const progressCircle = document.getElementById('progressCircle');
    const timerText = document.getElementById('timerText');
    const totalLength = progressCircle.getTotalLength();
    let timeRemaining = duration;

    progressCircle.style.strokeDashoffset = totalLength;

    const interval = setInterval(() => {
        timeRemaining--;

        const offset = (timeRemaining / duration) * totalLength;
        progressCircle.style.strokeDashoffset = offset;
        timerText.innerText = `${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(interval);
            completeExercise();
        }
    }, 1000);
}


function completeExercise() {
    const exerciseExecution = document.getElementById('exerciseExecution');
    exerciseExecution.innerHTML = "<h2>¡Ejercicio completado!</h2><p>¡Buen trabajo! Tu FitGotchi ha ganado experiencia y monedas.</p>";
}

function navigateTo(page) {
    window.location.href = page + '.html';
}
