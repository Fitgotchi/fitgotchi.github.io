const missions = [
    { id: 1, text: 'Caminar 5,000 pasos', progress: 0, target: 1 },
    { id: 2, text: 'Beber 2 litros de agua', progress: 0, target: 1 },
    { id: 3, text: 'Dormir al menos 7 horas', progress: 0, target: 1 }
  ];
  
  let freeRewardClaimed = false;
  
  function loadDailyMissions() {
    const list = document.getElementById('missions-list');
    list.innerHTML = '';
  
    missions.forEach(mission => {
      const div = document.createElement('div');
      div.className = 'mission';
  
      const label = document.createElement('label');
      label.textContent = mission.text;
  
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = mission.progress >= mission.target;
      checkbox.addEventListener('change', () => {
        mission.progress = checkbox.checked ? mission.target : 0;
        updateProgressBar(mission.id);
        checkChestStatus();
      });
  
      label.prepend(checkbox);
      div.appendChild(label);
  
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      const progressFill = document.createElement('div');
      progressFill.className = 'progress-bar-fill';
      progressFill.style.width = `${(mission.progress / mission.target) * 100}%`;
      progressBar.appendChild(progressFill);
      div.appendChild(progressBar);
  
      list.appendChild(div);
    });
  
    checkChestStatus();
  }
  
  function updateProgressBar(id) {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;
  
    const missionDivs = document.querySelectorAll('.mission');
    missionDivs.forEach(div => {
      if (div.textContent.includes(mission.text)) {
        const fill = div.querySelector('.progress-bar-fill');
        fill.style.width = `${(mission.progress / mission.target) * 100}%`;
      }
    });
  }
  
  function checkChestStatus() {
    const allCompleted = missions.every(m => m.progress >= m.target);
    const chest = document.getElementById('daily-chest');
    const status = document.getElementById('chest-status');
  
    if (allCompleted) {
      chest.classList.remove('locked');
      chest.classList.add('unlocked');
      status.textContent = '¡Felicidades! Puedes abrir el cofre.';
      chest.title = 'Clic para abrir el cofre';
    } else {
      chest.classList.add('locked');
      chest.classList.remove('unlocked');
      status.textContent = 'Completa todas las misiones para abrir el cofre';
      chest.title = 'Completa todas las misiones para abrir';
    }
  }
  
  document.getElementById('daily-chest').addEventListener('click', () => {
    const chest = document.getElementById('daily-chest');
    if (chest.classList.contains('locked')) return;
  
    if (!localStorage.getItem('chestOpenedToday')) {
      alert('¡Cofre abierto! Ganaste 20 FitCoins');
      let user = JSON.parse(localStorage.getItem('fitgotchiUser'));
      if (user) {
        user.fitcoins = (user.fitcoins || 0) + 20;
        localStorage.setItem('fitgotchiUser', JSON.stringify(user));
      }
      localStorage.setItem('chestOpenedToday', new Date().toDateString());
      chest.classList.add('locked');
      chest.classList.remove('unlocked');
      document.getElementById('chest-status').textContent = 'Cofre abierto, vuelve mañana';
    } else {
      alert('Ya abriste el cofre hoy, vuelve mañana');
    }
  });
  
  document.getElementById('claim-free').addEventListener('click', () => {
    if (freeRewardClaimed || localStorage.getItem('freeRewardClaimedToday') === new Date().toDateString()) {
      alert('Ya reclamaste tu recompensa gratuita hoy');
      return;
    }
    let user = JSON.parse(localStorage.getItem('fitgotchiUser'));
    if (user) {
      user.fitcoins = (user.fitcoins || 0) + 10;
      localStorage.setItem('fitgotchiUser', JSON.stringify(user));
      freeRewardClaimed = true;
      localStorage.setItem('freeRewardClaimedToday', new Date().toDateString());
      alert('¡Has recibido 10 FitCoins gratis!');
      document.getElementById('claim-free').disabled = true;
    }
  });
  
  document.getElementById('back-button').addEventListener('click', () => {
    window.history.back();
  });
  
  window.onload = () => {
    const today = new Date().toDateString();
    if (localStorage.getItem('chestOpenedToday') !== today) {
      localStorage.removeItem('chestOpenedToday');
    }
    if (localStorage.getItem('freeRewardClaimedToday') !== today) {
      localStorage.removeItem('freeRewardClaimedToday');
    }
    if (localStorage.getItem('freeRewardClaimedToday') === today) {
      document.getElementById('claim-free').disabled = true;
    }
    loadDailyMissions();
  };
  