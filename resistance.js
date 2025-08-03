function startExercise(routine) {
    switch(routine) {
        case 'resistance01':
            window.location.href = 'resistance01.html';
            break;
        case 'resistance02':
            window.location.href = 'resistance02.html';
            break;
        case 'resistance03':
            window.location.href = 'resistance03.html';
            break;
        default:
            console.log('Rutina no encontrada');
    }
}

function navigateTo(page) {
    window.location.href = page + '.html';
}
