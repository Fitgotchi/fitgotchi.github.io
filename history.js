// Cargar y mostrar el historial de actividades
document.addEventListener('DOMContentLoaded', () => {
    const history = JSON.parse(localStorage.getItem('activityHistory')) || [];
    const historyList = document.getElementById('history-list');
    const totalHoursElement = document.getElementById('total-hours');
    const totalKilometersElement = document.getElementById('total-kilometers');
    const totalStepsElement = document.getElementById('total-steps');

    let totalHours = 0;
    let totalKilometers = 0;
    let totalSteps = 0;

    if (history.length === 0) {
        historyList.innerHTML = '<p>No hay actividades registradas.</p>';
    } else {
        history.forEach(activity => {
            // Calcular totales
            totalHours += activity.elapsedTime / 3600; // Convertir segundos a horas
            totalKilometers += activity.distance || 0; // Suponiendo que cada actividad tiene una distancia
            totalSteps += activity.steps || 0; // Suponiendo que cada actividad tiene un conteo de pasos

            const activityButton = document.createElement('button');
            activityButton.classList.add('activity-button');
            activityButton.innerText = `Ejercicio: ${activity.workoutType} - ${formatTime(activity.elapsedTime)}`;

            activityButton.onclick = () => {
                const activityDetails = document.createElement('div');
                activityDetails.classList.add('activity-details');

                activityDetails.innerHTML = `
                    <p>Intensidad: ${activity.intensity}</p>
                    <p>Duración: ${formatTime(activity.elapsedTime)}</p>
                    <p>Fecha: ${activity.date}</p>
                    <p>Hora: ${activity.time}</p>
                    <p>Calorías quemadas: ${activity.rewards.caloriesBurned}</p>
                    <p>Experiencia ganada: ${activity.rewards.experience}</p>
                    <p>Monedas ganadas: ${activity.rewards.coins}</p>
                `;

                // Toggle para mostrar/ocultar detalles
                if (activityButton.nextSibling) {
                    activityButton.nextSibling.remove();
                } else {
                    historyList.insertBefore(activityDetails, activityButton.nextSibling);
                }
            };

            historyList.appendChild(activityButton);
        });

        // Actualizar los totales en la interfaz
        totalHoursElement.innerText = totalHours.toFixed(2);
        totalKilometersElement.innerText = totalKilometers.toFixed(2);
        totalStepsElement.innerText = totalSteps.toFixed(0);
    }
});

// Formatear tiempo en hh:mm:ss
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    seconds = Math.floor(seconds % 60);

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Añadir ceros a la izquierda
function pad(number) {
    return number.toString().padStart(2, '0');
}

// Navegar a diferentes páginas
function navigateTo(page) {
    window.location.href = page + ".html";
}
