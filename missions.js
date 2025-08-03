// Lista ejemplo de misiones
const missions = [
  {
    id: 1,
    title: "Completa una rutina de entrenamiento libre",
    coins: 50,
    exp: 20,
    calories: 100,
    completed: false
  },
  {
    id: 2,
    title: "Realiza 30 minutos de cardio",
    coins: 70,
    exp: 30,
    calories: 300,
    completed: false
  },
  {
    id: 3,
    title: "Haz estiramientos por 15 minutos",
    coins: 30,
    exp: 10,
    calories: 40,
    completed: false
  }
];

// Variables para almacenar recompensas acumuladas
let totalCoins = 0;
let totalExp = 0;
let totalCalories = 0;

const missionsListEl = document.getElementById('missions-list');
const totalCoinsEl = document.getElementById('total-coins');
const totalExpEl = document.getElementById('total-exp');
const totalCaloriesEl = document.getElementById('total-calories');

function loadMissions() {
  missionsListEl.innerHTML = '';
  missions.forEach(mission => {
    const li = document.createElement('li');
    li.textContent = mission.title;
    li.classList.toggle('completed', mission.completed);

    // Botón para completar misión si no está completada
    if (!mission.completed) {
      const btn = document.createElement('button');
      btn.textContent = 'Completar';
      btn.addEventListener('click', () => completeMission(mission.id));
      li.appendChild(btn);
    }

    missionsListEl.appendChild(li);
  });
}

function completeMission(id) {
  const mission = missions.find(m => m.id === id);
  if (!mission || mission.completed) return;

  mission.completed = true;
  totalCoins += mission.coins;
  totalExp += mission.exp;
  totalCalories += mission.calories;

  updateRewardsUI();
  loadMissions();
  showAlert(`Misión completada: +${mission.coins} FitCoins, +${mission.exp} EXP`);
}

function updateRewardsUI() {
  totalCoinsEl.textContent = totalCoins;
  totalExpEl.textContent = totalExp;
  totalCaloriesEl.textContent = totalCalories;
}

// Reutilizo la función showAlert del código anterior para mostrar mensajes
function showAlert(message) {
  let alertBox = document.getElementById('fitgotchi-alert');
  if (!alertBox) {
    alertBox = createAlertBox();
  }
  alertBox.textContent = message;
  alertBox.classList.remove('hide');
  alertBox.classList.add('show');

  setTimeout(() => {
    alertBox.classList.remove('show');
    alertBox.classList.add('hide');
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

document.addEventListener('DOMContentLoaded', () => {
  loadMissions();
});

document.getElementById('btn-home').addEventListener('click', () => {
    window.location.href = 'index.html'; // Cambiar a la URL real del Home
  });
  
  document.getElementById('btn-rutinas').addEventListener('click', () => {
    window.location.href = 'exercise.html'; // Cambiar si tu archivo tiene otro nombre
  });
  
  document.getElementById('btn-misiones').addEventListener('click', () => {
    window.location.href = 'missions.html';
  });
  
  document.getElementById('btn-tienda').addEventListener('click', () => {
    window.location.href = 'store.html'; // Cambiar según tu estructura
  });
  