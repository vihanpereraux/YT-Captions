// Store caption settings and visibility states
let settings = {
    captionColor: '#ffff00', // Default color (yellow)
    captionSize: 35, // Default size (35px)
    showComments: false, // Default: hide comments
    showSimilarVideos: false, // Default: hide similar videos
    blackBoxOpacity: 0 // Default opacity (0 = fully transparent)
};

// Create a black box element
const createBlackBox = () => {
    const blackBox = document.createElement('div');
    blackBox.id = 'black-box-overlay';
    blackBox.style.position = 'absolute';
    blackBox.style.top = '0';
    blackBox.style.left = '0';
    blackBox.style.width = '100%';
    blackBox.style.height = '100%';
    blackBox.style.backgroundColor = 'black';
    blackBox.style.pointerEvents = 'none'; // Allow clicks to pass through
    blackBox.style.zIndex = '9999'; // Ensure it's above the video player
    blackBox.style.opacity = settings.blackBoxOpacity;
    return blackBox;
};

// Function to update the black box opacity
const updateBlackBox = () => {
    let blackBox = document.getElementById('black-box-overlay');
    if (!blackBox) {
        blackBox = createBlackBox();
        const videoPlayer = document.getElementById('movie_player'); // YouTube video player element
        if (videoPlayer) {
            videoPlayer.style.position = 'relative'; // Ensure the video player can contain the black box
            videoPlayer.appendChild(blackBox);
        }
    }
    blackBox.style.opacity = settings.blackBoxOpacity;
};

// Function to change caption styles
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

// Function to hide/show DOM elements
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
    changeCaptions(); // Apply caption styles
    updateVisibility(); // Apply visibility settings
    updateBlackBox(); // Update black box opacity

    // top navbar color change
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

// Start observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSettings') {
        // Update stored settings
        settings.captionColor = request.captionColor;
        settings.captionSize = request.captionSize;
        settings.showComments = request.showComments;
        settings.showSimilarVideos = request.showSimilarVideos;
        settings.blackBoxOpacity = request.blackBoxOpacity;

        // Apply changes
        changeCaptions();
        updateVisibility();
        updateBlackBox();
    } else if (request.action === 'getSettings') {
        // Send current settings back to the popup
        sendResponse(settings);
    }
});

// Initial check in case relevant elements are already loaded
changeCaptions();
updateVisibility();
updateBlackBox();