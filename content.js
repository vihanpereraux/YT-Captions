let settings = {
    showTopRow: true,
    showComments: true,
    showSimilarVideos: true,
    showDescription: true,
    showShareButton: true,
    showDownloadButton: true,
    showClipButton: true,
    showSaveButton: true,
    showChannelDetails: true,
    captionColor: '#ffff00',
    captionSize: 35,
    blackBoxOpacity: 0,
    blackAndWhite: false,
    topBarOpacity: 100,
    thumbnailOpacity: 100,
    layoutOpacity: 100,
    leftPanelOpacity: 100,
    filtersPanelOpacity: 100,
};

const waitForElement = (selector, callback, attempts = 10, interval = 200) => {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else if (attempts > 0) {
        setTimeout(() => waitForElement(selector, callback, attempts - 1, interval), interval);
    }
};

const applySettings = () => {
    updatePlayerControls();
    updateVisibility();
    updateBlackBox();
    updateVideoFilter();
    setupCaptionObservers();
    updateTopBarOpacity();
    updateThumbnailOpacity();
    updateLayoutOpacity();
    updateLeftPanelOpacity();
    updateFitersPanelOpacity();
};

const initialize = () => {
    chrome.storage.local.get(Object.keys(settings), (storedSettings) => {
        Object.assign(settings, storedSettings);

        applySettings();

        const mainObserver = new MutationObserver(() => {
            applySettings();
        });

        mainObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });

        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl && location.href.includes('youtube.com/watch')) {
                lastUrl = location.href;
                applySettings();
            }
        }, 1000);
    });
};

const updateLeftPanelOpacity = () => {
    const domElement = document.querySelector('ytd-guide-renderer');
    if (domElement) {
        domElement.style.opacity = settings.leftPanelOpacity / 100;
    }
};

const updateTopBarOpacity = () => {
    const topBar = document.querySelector('#container.ytd-masthead');
    if (topBar) {
        topBar.style.opacity = settings.topBarOpacity / 100;
    }
};

const updateFitersPanelOpacity = () => {
    const domElement = document.querySelector(' ytd-feed-filter-chip-bar-renderer');
    if (domElement) {
        domElement.style.opacity = settings.filtersPanelOpacity / 100;
    }
};

const updateLayoutOpacity = () => {
    const content = document.querySelector('ytd-rich-grid-renderer');
    if (content) {
        content.style.opacity = settings.layoutOpacity / 100;
    }
};

const updateThumbnailOpacity = () => {
    const domElements = document.querySelectorAll('ytd-rich-item-renderer');
    domElements.forEach(thumbnail => {
        thumbnail.style.opacity = settings.thumbnailOpacity / 100;
    });
};


const applyCaptionStyles = (element) => {
    element.style.cssText = `
        color: ${settings.captionColor} !important;
        font-size: ${settings.captionSize}px !important;
        background: transparent !important;
        z-index: 10001 !important;
    `;
};

const setupCaptionObservers = () => {
    const captionContainer = document.querySelector('.ytp-caption-window-container');
    if (captionContainer) {
        captionContainer.style.zIndex = '10001';
        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('ytp-caption-segment')) {
                        applyCaptionStyles(node);
                    }
                });
            });
        }).observe(captionContainer, { childList: true, subtree: true });
        document.querySelectorAll('.ytp-caption-segment').forEach(applyCaptionStyles);
    }
};

const createBlackBox = () => {
    const blackBox = document.createElement('div');
    blackBox.id = 'yt-black-box-overlay';
    Object.assign(blackBox.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        pointerEvents: 'none',
        zIndex: '10000',
        opacity: settings.blackBoxOpacity
    });
    return blackBox;
};

const updateBlackBox = () => {
    const videoPlayer = document.querySelector('#movie_player');
    if (!videoPlayer) return;
    let blackBox = document.getElementById('yt-black-box-overlay');
    if (!blackBox) {
        blackBox = createBlackBox();
        videoPlayer.style.position = 'relative';
        videoPlayer.appendChild(blackBox);
    }
    blackBox.style.opacity = settings.blackBoxOpacity;
};

const updatePlayerControls = () => {
    const controls = [
        { selector: '[aria-label="Share"], .ytp-share-button', show: settings.showShareButton },
        { selector: '[aria-label="Download"], .ytp-download-button', show: settings.showDownloadButton },
        { selector: '[aria-label="Clip"], .ytp-clip-button', show: settings.showClipButton },
        { selector: '[aria-label="Save"], .ytp-save-button', show: settings.showSaveButton },
        { selector: '.ytd-watch-metadata', show: settings.showChannelDetails }
    ];
    controls.forEach(control => {
        document.querySelectorAll(control.selector).forEach(el => {
            el.style.display = control.show ? '' : 'none';
        });
    });
};

const updateVisibility = () => {
    const elements = [
        { selector: '#top-row, ytd-video-primary-info-renderer', show: settings.showTopRow },
        { selector: '#comments, ytd-comments', show: settings.showComments },
        { selector: '#secondary, ytd-watch-next-secondary-results-renderer', show: settings.showSimilarVideos },
        { selector: '#description, #info-contents, ytd-video-secondary-info-renderer', show: settings.showDescription }
    ];
    elements.forEach(element => {
        document.querySelectorAll(element.selector).forEach(el => {
            el.style.display = element.show ? '' : 'none';
        });
    });
};

const updateVideoFilter = () => {
    const filterValue = settings.blackAndWhite ? 'grayscale(100%)' : 'none';
    document.querySelectorAll('video, #movie_player').forEach(el => {
        el.style.filter = filterValue;
    });
};

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'updateSettings') {
        Object.assign(settings, request);
        updatePlayerControls();
        updateVisibility();
        updateBlackBox();
        updateVideoFilter();
        setupCaptionObservers();
        updateTopBarOpacity();
        updateThumbnailOpacity();
        updateLayoutOpacity();
        updateLeftPanelOpacity();
        updateFitersPanelOpacity();
    }
});

chrome.storage.onChanged.addListener((changes) => {
    Object.entries(changes).forEach(([key, { newValue }]) => {
        settings[key] = newValue;
    });
    updatePlayerControls();
    updateVisibility();
    updateBlackBox();
    updateVideoFilter();
    setupCaptionObservers();
    updateTopBarOpacity();
    updateThumbnailOpacity();
    updateLayoutOpacity();
    updateLeftPanelOpacity();
    updateFitersPanelOpacity();
});

initialize();