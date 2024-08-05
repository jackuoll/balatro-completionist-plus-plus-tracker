let currentView = 'all';
let currentActiveButton = null;

function checkboxClicked(checkbox) {
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
        changeJokerStats(checkbox.checked);
        updateView();  // Update the view to maintain the current filter
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error, check the console');
    });
}

function changeJokerStats(isChecked) {
    const statsElement = document.getElementById("stats");
    const progressElement = document.getElementById('progress');

    let statsStr = statsElement.textContent;

    const regex = /(\d+)\/\d+ \((\d+\.\d+)%\)/;
    const match = statsStr.match(regex);

    if (match) {
        let currentStickers = parseInt(match[1], 10);
        const totalStickers = parseInt(match[0].split('/')[1], 10);

        if (isChecked) {
            currentStickers += 1;
        } else {
            currentStickers -= 1;
        }

        const newPercentage = ((currentStickers / totalStickers) * 100).toFixed(2);

        statsElement.textContent = currentStickers + '/' + totalStickers + ' (' + newPercentage + '%)';
        progressElement.value = newPercentage;

        console.log("Updated Stats:", statsElement.textContent);
    } else {
        console.log("No match found.");
    }
}

function handleButtonClickWithRequest(url) {
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
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error, check the console');
   });
}

function updateView() {
    if (currentView === 'checked') {
        showChecked();
    } else if (currentView === 'unchecked') {
        showUnchecked();
    } else {
        showAll();
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