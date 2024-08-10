let currentView = 'all';
let currentActiveButton = null;

document.addEventListener('DOMContentLoaded', () => {
    setDefaultView();
    updateStats();
    makeJokerImageClickable();
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

function makeJokerImageClickable() {
    const jokerContainers = document.querySelectorAll('.joker-container');
    jokerContainers.forEach(container => {
        const checkbox = container.querySelector('input[type="checkbox"]');
        const image = container.querySelector('.joker-image');

        if (checkbox && image) {
            image.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                handleCheckboxClick(checkbox);
                updateView();
            });
        }
    });
}

function handleCheckboxClick(checkbox) {
    const status = checkbox.checked ? 'gold sticker' : 'no gold sticker';

    fetch('/change_joker_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            joker_name: checkbox.name,
            status: status
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Response from backend was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        updateStats();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error, check the console');
    });
}
function handleCardClick(card) {
    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked
    const status = checkbox.checked ? 'gold sticker' : 'no gold sticker';

    fetch('/change_joker_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            joker_name: card.id,
            status: status
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Response from backend was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        updateStats();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error, check the console');
    });
    const event = new Event('change', {
        bubbles: true,
        cancelable: true
    });
    checkbox.dispatchEvent(event);
}

function updateStats() {
    const totalJokers = 150;

    const checkboxes = document.querySelectorAll('.joker-container input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    const percentage = ((checkedCount / totalJokers) * 100).toFixed(2);

    const statsElement = document.getElementById("stats");
    const progressBar = document.getElementById('progress');

    statsElement.textContent = `${checkedCount}/${totalJokers} (${percentage}%)`;
    progressBar.ariaValueNow = percentage;
    progressBar.style.width = percentage + '%';

    console.log("Updated Stats:", statsElement.textContent);
}

function handleButtonClickWithRequest(url, action) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Response from backend was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        if (action === 'addAll') {
            addAllStickers();
        } else if (action === 'removeAll') {
            removeAllStickers();
        }
        highlightButton(currentActiveButton);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error, check the console');
   });
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

function addAllStickers() {
    const checkboxes = document.querySelectorAll('.joker-container input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            checkbox.checked = true;
        }
    });
    updateStats();
    updateView();
}

function removeAllStickers() {
    const checkboxes = document.querySelectorAll('.joker-container input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.checked = false;
        }
    });
    updateStats();
    updateView();
}

function setDefaultView() {
    const showAllButton = document.getElementById('showAllButton');
    showAll(showAllButton);
}