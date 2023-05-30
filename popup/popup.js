const statusDiv = document.getElementById('status');

statusDiv.innerText = 'Hello from popup.js';

const visitButton = document.getElementById('visit-button');

visitButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.google.com' });
    }
);