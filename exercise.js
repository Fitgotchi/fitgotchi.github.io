function navigateTo(page) {
    window.location.href = page + ".html";
}

function startExercise(type) {
    let exercisePage;
    
    switch (type) {
        case 'cardio':
            exercisePage = 'cardio';
            break;
        case 'resistance':
            exercisePage = 'resistance';
            break;
        case 'strength':
            exercisePage = 'strength';
            break;
        case 'speed':
            exercisePage = 'speed';
            break;
        case 'running':
            exercisePage = 'run';
            break;
        case 'bike':
            exercisePage = 'bike';
            break;
        default:
            alert('Tipo de ejercicio desconocido.');
            return;
    }

    navigateTo(exercisePage);
}
