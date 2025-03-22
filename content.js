// Store caption settings and visibility states
let settings = {
    captionColor: '#ffff00', // Default color (yellow)
    captionSize: 35, // Default size (35px)
    showComments: false, // Default: hide comments
    showSimilarVideos: false // Default: hide similar videos
};

// Function to change caption styles
const changeCaptions = () => {
    const captionElements = document.getElementsByClassName("ytp-caption-segment");
    if (captionElements) {
        for (let i = 0; i < captionElements.length; i++) {
            captionElements[i].style.fontWeight = "500";
            captionElements[i].style.background = "rgba(8, 8, 8, 0)";
            captionElements[i].style.color = settings.captionColor; // Use stored color
            captionElements[i].style.fontSize = `${settings.captionSize}px`; // Use stored size
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

        // Apply changes
        changeCaptions();
        updateVisibility();
    }
});

// Initial check in case relevant elements are already loaded
changeCaptions();
updateVisibility();