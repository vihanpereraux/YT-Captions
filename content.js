// Default settings
let settings = {
    captionColor: '#ffff00',
    captionSize: 35,
    showComments: true,
    showSimilarVideos: true,
    blackBoxOpacity: 0,
    blackAndWhite: false
};

// Create black overlay element
const createBlackBox = () => {
    const blackBox = document.createElement('div');
    blackBox.id = 'black-box-overlay';
    blackBox.style.position = 'absolute';
    blackBox.style.top = '0';
    blackBox.style.left = '0';
    blackBox.style.width = '100%';
    blackBox.style.height = '100%';
    blackBox.style.backgroundColor = 'black';
    blackBox.style.pointerEvents = 'none';
    blackBox.style.zIndex = '9999';
    blackBox.style.opacity = settings.blackBoxOpacity;
    return blackBox;
};

// Update black box opacity
const updateBlackBox = () => {
    let blackBox = document.getElementById('black-box-overlay');
    if (!blackBox) {
        blackBox = createBlackBox();
        const videoPlayer = document.getElementById('movie_player');
        if (videoPlayer) {
            videoPlayer.style.position = 'relative';
            videoPlayer.appendChild(blackBox);
        }
    }
    blackBox.style.opacity = settings.blackBoxOpacity;
};

// Apply grayscale filter to video
const updateVideoFilter = () => {
    const video = document.querySelector('video');
    const moviePlayer = document.getElementById('movie_player');
    
    if (video) video.style.filter = settings.blackAndWhite ? 'grayscale(100%)' : 'none';
    if (moviePlayer) moviePlayer.style.filter = settings.blackAndWhite ? 'grayscale(100%)' : 'none';
    
    // Ensure captions remain visible
    const captionWindow = document.querySelector('.ytp-caption-window-container');
    if (captionWindow) {
        captionWindow.style.filter = 'none';
        captionWindow.style.zIndex = '10000';
    }
};

// Update caption styles
const changeCaptions = () => {
    const captionWindow = document.querySelector('.ytp-caption-window-container');
    if (captionWindow) captionWindow.style.zIndex = '10000';
    
    document.querySelectorAll('.ytp-caption-segment').forEach(caption => {
        caption.style.cssText = `
            color: ${settings.captionColor} !important;
            font-size: ${settings.captionSize}px !important;
            font-weight: 500 !important;
            background: transparent !important;
            text-transform: lowercase !important;
        `;
    });
};

// Toggle visibility of comments and related videos
const updateVisibility = () => {
    const secondaryColumn = document.getElementById('secondary');
    if (secondaryColumn) secondaryColumn.style.display = settings.showSimilarVideos ? 'block' : 'none';

    const comments = document.getElementById('comments');
    if (comments) comments.style.display = settings.showComments ? 'block' : 'none';
};

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSettings') {
        settings = { ...settings, ...request };
        changeCaptions();
        updateVisibility();
        updateBlackBox();
        updateVideoFilter();
    }
});

// Watch for caption changes
const captionObserver = new MutationObserver(changeCaptions);
const startCaptionObserver = () => {
    const captionContainer = document.querySelector('.ytp-caption-window-container');
    if (captionContainer) {
        captionObserver.observe(captionContainer, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
};

// Watch for DOM changes
const observer = new MutationObserver(() => {
    changeCaptions();
    updateVisibility();
    updateBlackBox();
    updateVideoFilter();
    startCaptionObserver();
});

// Load settings from storage and initialize
chrome.storage.local.get(
    ['captionColor', 'captionSize', 'showComments', 'showSimilarVideos', 'blackBoxOpacity', 'blackAndWhite'],
    (storedSettings) => {
        settings = { ...settings, ...storedSettings };
        
        // Apply all settings
        changeCaptions();
        updateVisibility();
        updateBlackBox();
        updateVideoFilter();
        
        // Start observers
        startCaptionObserver();
        observer.observe(document.body, { childList: true, subtree: true });
    }
);

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
        for (let key in changes) {
            settings[key] = changes[key].newValue;
        }
        changeCaptions();
        updateVisibility();
        updateBlackBox();
        updateVideoFilter();
    }
});