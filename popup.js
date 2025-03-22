// Function to send settings to the content script
const sendSettings = () => {
    const showComments = document.getElementById('toggleComments').checked;
    const showSimilarVideos = document.getElementById('toggleSimilarVideos').checked;
    const captionColor = document.getElementById('captionColor').value;
    const captionSize = document.getElementById('captionSize').value;
    const blackBoxOpacity = document.getElementById('blackBoxOpacity').value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateSettings',
            showComments: showComments,
            showSimilarVideos: showSimilarVideos,
            captionColor: captionColor,
            captionSize: captionSize,
            blackBoxOpacity: blackBoxOpacity
        });
    });
};

// Function to retrieve current settings from the content script
const getCurrentSettings = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getSettings' }, (response) => {
            if (response) {
                // Update the popup UI with the current settings
                document.getElementById('toggleComments').checked = response.showComments;
                document.getElementById('toggleSimilarVideos').checked = response.showSimilarVideos;
                document.getElementById('captionColor').value = response.captionColor;
                document.getElementById('captionSize').value = response.captionSize;
                document.getElementById('captionSizeValue').textContent = `${response.captionSize}px`;
                document.getElementById('blackBoxOpacity').value = response.blackBoxOpacity;
                document.getElementById('blackBoxOpacityValue').textContent = response.blackBoxOpacity;
            }
        });
    });
};

// Add event listeners to all input elements
document.getElementById('toggleComments').addEventListener('change', sendSettings);
document.getElementById('toggleSimilarVideos').addEventListener('change', sendSettings);
document.getElementById('captionColor').addEventListener('input', sendSettings);
document.getElementById('captionSize').addEventListener('input', () => {
    document.getElementById('captionSizeValue').textContent = `${document.getElementById('captionSize').value}px`;
    sendSettings();
});
document.getElementById('blackBoxOpacity').addEventListener('input', () => {
    document.getElementById('blackBoxOpacityValue').textContent = document.getElementById('blackBoxOpacity').value;
    sendSettings();
});

// Retrieve current settings when the popup loads
getCurrentSettings();