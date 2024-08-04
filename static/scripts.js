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
        changeJokerStats(checkbox.checked)
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error, check the console')
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

function handleButtonClick(url) {
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
        alert('Error, check the console')
   });
}

let currentView = 'all';

function updateView() {
    if (currentView === 'checked') {
        showChecked();
    } else if (currentView === 'unchecked') {
        showUnchecked();
    } else {
        showAll();
    }
}

function showAll() {
    currentView = 'all';
    const containers = document.querySelectorAll('.joker-container');
    containers.forEach(container => {
        container.style.display = 'block';
   });
}

function showChecked() {
    currentView = 'checked';
    const containers = document.querySelectorAll('.joker-container');
    containers.forEach(container => {
        const checkbox = container.querySelector('input[type="checkbox"]');
        container.style.display = checkbox.checked ? 'block' : 'none';
    });
}

function showUnchecked() {
    currentView = 'unchecked';
    const containers = document.querySelectorAll('.joker-container');
    containers.forEach(container => {
    const checkbox = container.querySelector('input[type="checkbox"]');
    container.style.display = !checkbox.checked ? 'block' : 'none';
    });
}
