// Function to change title color
const changeCaptions = () => {
    // caption wrapper manipulation
    const captionWindow = document.getElementsByClassName("caption-window");
    if (captionWindow) {
        captionWindow[0].style.backgroundColor = "rgba(0, 0, 0, 0)";
        captionWindow[0].style.textAlign = "center";
        captionWindow[0].style.left = "50%";
        captionWindow[0].style.width = "80vw";
        captionWindow[0].style.marginLeft = "0px";
        captionWindow[0].style.border = "0px solid red";
        captionWindow[0].style.transform = "translateX(-50%)";
    }

    // captions manipulation
    const captionElements = document.getElementsByClassName("ytp-caption-segment");
    if (captionElements) {
        for (let i = 0; i < captionElements.length; i++) {
            captionElements[i].style.fontWeight = "500";
            captionElements[i].style.background = "rgba(8, 8, 8, 0)";
            captionElements[i].style.color = "yellow";
            captionElements[i].style.fontSize = "35px";
            captionElements[i].style.textTransform = "lowercase";
        }
    }
}

const hideDOMElements = () => {
    const secondaryColumn = document.getElementById('secondary');
    if (secondaryColumn) {
        secondaryColumn.style.display = 'none';
    }

    const menu = document.getElementById('actions');
    if (menu) {
        menu.style.display = "none";
    }

    const comments = document.getElementById('comments');
    if (comments) {
        comments.style.display = "none";
    }
}

const addTransparentOverlay = () => {
    const videoContainer = document.getElementById('cinematics-full-bleed-container');
    if (videoContainer) {
        videoContainer.style.position = "absolute";
        videoContainer.style.width = "100%";
        videoContainer.style.height = "100%";
        videoContainer.style.left = 0;
        videoContainer.style.top = 0;
        videoContainer.style.zIndex = "5";
        videoContainer.style.background = "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4920168751094187) 51%, rgba(0,0,0,0) 100%); "; 
        // inserting the custom div
        // videoContainer.appendChild(overlay);
    }
}

// Observe changes in the page to detect when the title is available
const observer = new MutationObserver(() => {
    changeCaptions();
    hideDOMElements();

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

// Initial check in case relevant elements are already loaded
changeCaptions();
hideDOMElements();