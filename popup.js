// Function to send settings to the content script
const sendSettings = () => {
    const showComments = document.getElementById('toggleComments').checked;
    const showSimilarVideos = document.getElementById('toggleSimilarVideos').checked;
    const captionColor = document.getElementById('captionColor').value;
    const captionSize = document.getElementById('captionSize').value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateSettings',
            showComments: showComments,
            showSimilarVideos: showSimilarVideos,
            captionColor: captionColor,
            captionSize: captionSize
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

// Send initial settings when the popup loads
sendSettings();