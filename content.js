// store caption settings and visibility states
let settings = {
    captionColor: '#ffff00',
    captionSize: 35,
    showComments: false,
    showSimilarVideos: false,
    blackBoxOpacity: 0,
    blackAndWhite: false
};

// black overlay element
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

// update the black box opacity
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

// update video filter
const updateVideoFilter = () => {
    const video = document.querySelector('video');
    const moviePlayer = document.getElementById('movie_player');
    
    if (video) {
        // filter to the video element
        video.style.filter = settings.blackAndWhite ? 'grayscale(100%)' : 'none';
    }
    
    if (moviePlayer) {
        // Also apply filter to the container to catch any video changes
        moviePlayer.style.filter = settings.blackAndWhite ? 'grayscale(100%)' : 'none';
    }

    const captionWindow = document.querySelector('.ytp-caption-window-container');
    if (captionWindow) {
        captionWindow.style.filter = 'none';
        captionWindow.style.zIndex = '10000';
    }
};

// change caption styles
const changeCaptions = () => {
    const captionWindow = document.querySelector('.ytp-caption-window-container');
    if (captionWindow) {
        captionWindow.style.zIndex = '10000';
    }
    
    const captionElements = document.querySelectorAll('.ytp-caption-segment');
    if (captionElements.length > 0) {
        captionElements.forEach(caption => {
            caption.style.cssText = `
                color: ${settings.captionColor} !important;
                font-size: ${settings.captionSize}px !important;
                font-weight: 500 !important;
                background: transparent !important;
                text-transform: lowercase !important;
            `;
        });
    }
};

// hide/show comments and similar videos
const updateVisibility = () => {
    const secondaryColumn = document.getElementById('secondary');
    if (secondaryColumn) {
        secondaryColumn.style.display = settings.showSimilarVideos ? 'block' : 'none';
    }

    const comments = document.getElementById('comments');
    if (comments) {
        comments.style.display = settings.showComments ? 'block' : 'none';
    }
};

// listening to the requests from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSettings') {
        settings = { ...settings, ...request };
        changeCaptions();
        updateVisibility();
        updateBlackBox();
        updateVideoFilter();
    } else if (request.action === 'getSettings') {
        sendResponse(settings);
    }
});

// apply stored settings when the content script is loaded
chrome.storage.sync.get(
    ['captionColor', 'captionSize', 'showComments', 'showSimilarVideos', 'blackBoxOpacity', 'blackAndWhite'],
    (storedSettings) => {
        settings = { ...settings, ...storedSettings };
        changeCaptions();
        updateVisibility();
        updateBlackBox();
        updateVideoFilter();
    }
);

// separate observer for captions
const captionObserver = new MutationObserver(() => {
    changeCaptions();
});

// observing captions
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

// observe changes in the page
const observer = new MutationObserver(() => {
    changeCaptions();
    updateVisibility();
    updateBlackBox();
    updateVideoFilter();
    startCaptionObserver();
});

// observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });

// init setup
startCaptionObserver();
changeCaptions();
updateVisibility();
updateBlackBox();
updateVideoFilter();