let inventory = {};
let tokens = 0;
let hunger = 0;
let energy = 100; // Inicializado a 100 por defecto
let fitgotchiName = '';

function updateFoodInfo() {
    const selectElement = document.getElementById('food-select');
    const foodInfo = document.getElementById('food-info');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const calories = selectedOption.getAttribute('data-calories');
    const price = selectedOption.getAttribute('data-price');
    foodInfo.textContent = `Calorías: ${calories} | Precio: ${price} tokens`;
}

function feedFitGotchi() {
    const selectElement = document.getElementById('food-select');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const foodName = selectedOption.value;
    const calories = parseInt(selectedOption.getAttribute('data-calories'));

    if (inventory[foodName] > 0) {
        hunger = Math.max(hunger - calories, 0);
        energy = Math.min(energy + 5, 100); // Energía no puede superar 100

        const energyStatus = document.getElementById('energy-status');
        energyStatus.textContent = `Energía: ${energy}%`;

        const feedHistoryList = document.getElementById('feed-history-list');
        const listItem = document.createElement('li');
        listItem.textContent = `Alimento: ${selectedOption.textContent} - Calorías: ${calories}`;
        feedHistoryList.appendChild(listItem);

        inventory[foodName]--;
        updateInventory();
        updateFitGotchiStatus();
    } else {
        alert('No tienes suficiente de este alimento en el inventario.');
    }
}

function buyFood() {
    const selectElement = document.getElementById('food-select');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const foodName = selectedOption.value;
    const price = parseInt(selectedOption.getAttribute('data-price'));

    if (tokens >= price) {
        tokens -= price;
        inventory[foodName] = (inventory[foodName] || 0) + 1;
        updateTokens();
        updateInventory();
    } else {
        alert('No tienes suficientes tokens para comprar este alimento.');
    }
}

function updateTokens() {
    const tokensStatus = document.getElementById('tokens-status');
    tokensStatus.textContent = `Tokens: ${tokens}`;
}

function updateInventory() {
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';
    for (const [item, quantity] of Object.entries(inventory)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.charAt(0).toUpperCase() + item.slice(1)}: ${quantity}`;
        listItem.onclick = () => feedFitGotchi(item);
        inventoryList.appendChild(listItem);
    }
}

function updateFitGotchiStatus() {
    const hungerStatus = document.getElementById('fitgotchi-hunger');
    hungerStatus.textContent = `Hambre: ${hunger}`;
    const energyStatus = document.getElementById('energy-status');
    energyStatus.textContent = `Energía: ${energy}%`;
}

function updateName() {
    fitgotchiName = document.getElementById('fitgotchi-name').value;
    const nameDisplay = document.getElementById('fitgotchi-name-display');
    nameDisplay.textContent = fitgotchiName || 'Nombre de tu FitGotchi';
}

function navigateTo(page) {
    window.location.href = page + ".html";
}

async function loadUserData() {
    try {
        const response = await fetch('user.json');
        const data = await response.json();

        inventory = data.inventory || {};
        tokens = data.tokens || 0;
        hunger = data.stats.hunger || 50; // Valor predeterminado
        energy = data.stats.energy || 100; // Valor predeterminado
        fitgotchiName = data.name || '';

        updateTokens();
        updateInventory();
        updateFitGotchiStatus();
        updateName();
    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadUserData);
