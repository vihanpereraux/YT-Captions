let settings = {
    captionColor: '#ffff00',
    captionSize: 35,
    showComments: true,
    showSimilarVideos: true,
    blackBoxOpacity: 0,
    blackAndWhite: false
};

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

const updateVideoFilter = () => {
    const video = document.querySelector('video');
    const moviePlayer = document.getElementById('movie_player');
    
    if (video) video.style.filter = settings.blackAndWhite ? 'grayscale(100%)' : 'none';
    if (moviePlayer) moviePlayer.style.filter = settings.blackAndWhite ? 'grayscale(100%)' : 'none';
    
    const captionWindow = document.querySelector('.ytp-caption-window-container');
    if (captionWindow) {
        captionWindow.style.filter = 'none';
        captionWindow.style.zIndex = '10000';
    }
};

const changeCaptions = () => {
    let captions = document.querySelectorAll('.ytp-caption-segment');
    if (captions.length === 0) {
        captions = document.querySelectorAll('.captions-text span');
    }
    captions.forEach(caption => {
        caption.style.color = `${settings.captionColor} !important`;
        caption.style.fontSize = `${settings.captionSize}px !important`;
        caption.style.fontWeight = '500 !important';
        caption.style.background = 'transparent !important';
        caption.style.textTransform = 'lowercase !important';
        
        const originalClass = caption.className;
        caption.className = '';
        setTimeout(() => {
            caption.className = originalClass;
        }, 50);
    });
    
    const captionContainer = document.querySelector('.ytp-caption-window-container');
    if (captionContainer) {
        captionContainer.style.zIndex = '10000';
    }
};

const updateVisibility = () => {
    const secondaryColumn = document.getElementById('secondary');
    if (secondaryColumn) secondaryColumn.style.display = settings.showSimilarVideos ? 'block' : 'none';

    const comments = document.getElementById('comments');
    if (comments) comments.style.display = settings.showComments ? 'block' : 'none';
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSettings') {
        settings = { ...settings, ...request };
        changeCaptions();
        updateVisibility();
        updateBlackBox();
        updateVideoFilter();
    }
});

const captionObserver = new MutationObserver((mutations) => {
    mutations.forEach(() => {
        changeCaptions();
    });
});

const startCaptionObserver = () => {
    const captionContainer = document.querySelector('.ytp-caption-window-container') || 
                           document.querySelector('.captions-text');
    if (captionContainer) {
        captionObserver.observe(captionContainer, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });
    }
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
        changeCaptions();
        updateVisibility();
        updateBlackBox();
        updateVideoFilter();
        startCaptionObserver();
    });
});

chrome.storage.local.get(
    ['captionColor', 'captionSize', 'showComments', 'showSimilarVideos', 'blackBoxOpacity', 'blackAndWhite'],
    (storedSettings) => {
        settings = { ...settings, ...storedSettings };
        changeCaptions();
        updateVisibility();
        updateBlackBox();
        updateVideoFilter();
    
        setTimeout(() => {
            startCaptionObserver();
            observer.observe(document.body, { 
                childList: true, 
                subtree: true,
                attributes: true
            });
        }, 500);
    }
);

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

setInterval(changeCaptions, 1000);