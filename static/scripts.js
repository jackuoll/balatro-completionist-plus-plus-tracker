let currentView = 'all';
let currentActiveButton = null;
const staticDir = "./static/";
let totalJokers = 0;

document.addEventListener('DOMContentLoaded', () => {
    initPage()
        .then(() => {
            setDefaultView();
            updateStats();
        });
});

 window.addEventListener('scroll', function() {
    const stickyHeader = document.querySelector('.sticky-top');
    const stickyHeaderDiv = stickyHeader.querySelector('.row');
    const headerMarginBotton = parseInt(getComputedStyle(stickyHeaderDiv).marginBottom, 10);
    if (window.scrollY > headerMarginBotton) {
        stickyHeader.classList.add('sticky-active');
    } else {
        stickyHeader.classList.remove('sticky-active');
    }
});


function generateJokerGrid(jokers) {
    const container = document.getElementById('joker-grid');

    jokers.forEach(joker => {
        const jokerState = localStorage.getItem('card:' + joker.name) === 'true';

        const jokerHtml = `
            <div class="joker-container col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                <div class="card pixel-corners h-100" id="${joker.name}" onclick="handleCardClick(this)">
                    <div class="card-body">
                        <img src="${staticDir}jokers/${joker.image}" alt="${joker.name}" class="card-img-bottom">
                        <div class="form-check py-1">
                            <input type="checkbox" id="${joker.name}.checkbox" ${jokerState ? 'checked' : ''} onchange="updateView()">
                            <label for="${joker.name}.checkbox" class="custom-checkbox">${joker.name}</label>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += jokerHtml;
    });
}

function initPage() {
    return fetch(staticDir + "jokers.json", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Getting joker list error');
        }
        return response.json();
    })
    .then(data => {
        totalJokers = data.length;
        // console.log('Success:', data);
        generateJokerGrid(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error, check the console');
   });
}
function handleCardClick(card) {
    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked
    localStorage.setItem('card:' + card.id, checkbox.checked);
    updateStats();

    const event = new Event('change', {
        bubbles: true,
        cancelable: true
    });
    checkbox.dispatchEvent(event);
}

function updateStats() {
    const checkboxes = document.querySelectorAll('.joker-container input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    console.log(totalJokers);
    const percentage = ((checkedCount / totalJokers) * 100).toFixed(2);

    const statsElement = document.getElementById("stats");
    const progressBar = document.getElementById('progress');

    statsElement.textContent = `${checkedCount}/${totalJokers} (${percentage}%)`;
    progressBar.ariaValueNow = percentage;
    progressBar.style.width = percentage + '%';

    console.log("Updated Stats:", statsElement.textContent);
}

function setAllState(state) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        checkbox.checked = state
        localStorage.setItem('card:' + card.id, checkbox.checked);

        const event = new Event('change', {
            bubbles: true,
            cancelable: true
        });
        checkbox.dispatchEvent(event);
   });
    updateStats();
}

function updateView() {
    if (currentView === 'checked') {
        showChecked(currentActiveButton);
    } else if (currentView === 'unchecked') {
        showUnchecked(currentActiveButton);
    } else {
        showAll(currentActiveButton);
    }
}

function filterStickers(button) {
    const containers = document.querySelectorAll('.joker-container');
    switch (button.id) {
        case 'filter-all':
            currentView = 'all';
            containers.forEach(container => {
                container.style.display = 'block';
           });
            break;
        case 'filter-stickers-only':
            currentView = 'checked';
            containers.forEach(container => {
                const checkbox = container.querySelector('input[type="checkbox"]');
                container.style.display = checkbox.checked ? 'block' : 'none';
            });
            break;
        case 'filter-no-stickers-only':
            currentView = 'unchecked';
            containers.forEach(container => {
                const checkbox = container.querySelector('input[type="checkbox"]');
                container.style.display = !checkbox.checked ? 'block' : 'none';
            });
            break;
        default:
            return;
    }
}

function showAll(button) {
    highlightButton(button);
    currentView = 'all';

    const containers = document.querySelectorAll('.joker-container');
    containers.forEach(container => {
        container.style.display = 'block';
   });
}

function showChecked(button) {
    highlightButton(button);
    currentView = 'checked';

    const containers = document.querySelectorAll('.joker-container');
    containers.forEach(container => {
        const checkbox = container.querySelector('input[type="checkbox"]');
        container.style.display = checkbox.checked ? 'block' : 'none';
    });
}

function showUnchecked(button) {
    highlightButton(button);
    currentView = 'unchecked';

    const containers = document.querySelectorAll('.joker-container');
    containers.forEach(container => {
        const checkbox = container.querySelector('input[type="checkbox"]');
        container.style.display = !checkbox.checked ? 'block' : 'none';
    });
}

function highlightButton(button) {
    const allButtons = document.querySelectorAll('.button-container .pixel-corners');
    allButtons.forEach(btn => {
        btn.style.backgroundColor = '#2A3839';
    });

    if (button) {
        button.style.backgroundColor = 'lightgreen';
        currentActiveButton = button;
    } else if (currentActiveButton) {
        currentActiveButton.style.backgroundColor = 'lightgreen';
    }
}

function setDefaultView() {
    const showAllButton = document.getElementById('showAllButton');
    showAll(showAllButton);
}