// store caption settings and visibility states
let settings = {
    captionColor: '#ffff00',
    captionSize: 35,
    showComments: false,
    showSimilarVideos: false,
    blackBoxOpacity: 0 
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

// change caption styles
const changeCaptions = () => {
    const captionElements = document.getElementsByClassName("ytp-caption-segment");
    if (captionElements) {
        for (let i = 0; i < captionElements.length; i++) {
            captionElements[i].style.fontWeight = "500";
            captionElements[i].style.background = "rgba(8, 8, 8, 0)";
            captionElements[i].style.color = settings.captionColor;
            captionElements[i].style.fontSize = `${settings.captionSize}px`;
            captionElements[i].style.textTransform = "lowercase";
        }
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

// Observe changes in the page to detect when the title is available
const observer = new MutationObserver(() => {
    changeCaptions();
    updateVisibility(); 
    updateBlackBox(); 

    const topbar = document.getElementById('background');
    if (topbar) {
        topbar.style.background = 'black !important';
    }
    // background color change
    const primary = document.getElementById('columns');
    if (primary) {
        primary.style.background = 'black';
    }
});

// observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });

// listening to the requests from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSettings') {
        // update stored settings
        settings.captionColor = request.captionColor;
        settings.captionSize = request.captionSize;
        settings.showComments = request.showComments;
        settings.showSimilarVideos = request.showSimilarVideos;
        settings.blackBoxOpacity = request.blackBoxOpacity;

        changeCaptions();
        updateVisibility();
        updateBlackBox();
    } else if (request.action === 'getSettings') {
        // update popup with current settings
        sendResponse(settings);
    }
});

// in case relevant elements are already loaded
changeCaptions();
updateVisibility();
updateBlackBox();