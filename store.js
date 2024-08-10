function navigateTo(page) {
    window.location.href = page + '.html';
}

function buyItem(item) {
    let fitgotchiState = JSON.parse(localStorage.getItem('fitgotchiState')) || {
        energy: 100,
        hunger: 50,
        sleep: 80,
        coins: 100
    };
    let itemCost = 0;

    switch (item) {
        case 'comida':
            itemCost = 10;
            fitgotchiState.energy = Math.min(fitgotchiState.energy + 10, 100);
            break;
        case 'juguetes':
            itemCost = 20;
            fitgotchiState.hunger = Math.max(fitgotchiState.hunger - 10, 0);
            break;
        case 'accesorios':
            itemCost = 30;
            // Incrementar algún otro atributo del FitGotchi o añadir una lógica específica
            break;
    }

    if (fitgotchiState.coins >= itemCost) {
        fitgotchiState.coins -= itemCost;
        localStorage.setItem('fitgotchiState', JSON.stringify(fitgotchiState));
        alert(`Has comprado ${item} por ${itemCost} monedas. Te quedan ${fitgotchiState.coins} monedas.`);
        updateDisplay();
    } else {
        alert('No tienes suficientes monedas para comprar este artículo.');
    }
}

function updateDisplay() {
    let fitgotchiState = JSON.parse(localStorage.getItem('fitgotchiState'));
    document.getElementById('coins-display').innerText = `Monedas: ${fitgotchiState.coins}`;
}

document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
});
