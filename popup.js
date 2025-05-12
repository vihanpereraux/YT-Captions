const sendSettings = () => {
    const showComments = document.getElementById('toggleComments').checked;
    const showSimilarVideos = document.getElementById('toggleSimilarVideos').checked;
    const captionColor = document.getElementById('captionColor').value;
    const captionSize = document.getElementById('captionSize').value;
    const blackBoxOpacity = document.getElementById('blackBoxOpacity').value;
    const blackAndWhite = document.getElementById('toggleBlackAndWhite').checked;

    const settings = {
        showComments,
        showSimilarVideos,
        captionColor,
        captionSize,
        blackBoxOpacity,
        blackAndWhite
    };

    chrome.storage.sync.set(settings, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateSettings',
                    ...settings
                });
            }
        });
    });
};

// section toggling
const toggleSection = (sectionName, isCollapsed) => {
    const button = document.querySelector(`[data-section="${sectionName}"]`);
    const content = document.getElementById(`${sectionName}-section`);
    
    if (button && content) {
        button.classList.toggle('collapsed', isCollapsed);
        content.classList.toggle('collapsed', isCollapsed);
        
        // save the state
        chrome.storage.sync.get(['collapsedSections'], (result) => {
            const collapsedSections = result.collapsedSections || {};
            collapsedSections[sectionName] = isCollapsed;
            chrome.storage.sync.set({ collapsedSections });
        });
    }
};

// Initialize section states
const initializeSections = () => {
    chrome.storage.sync.get(['collapsedSections'], (result) => {
        const collapsedSections = result.collapsedSections || {};
        
        // Setup toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(button => {
            const sectionName = button.dataset.section;
            const isCollapsed = collapsedSections[sectionName] || false;
            
            toggleSection(sectionName, isCollapsed);
            
            button.addEventListener('click', () => {
                const isCurrentlyCollapsed = button.classList.contains('collapsed');
                toggleSection(sectionName, !isCurrentlyCollapsed);
            });
        });
    });
};

const getCurrentSettings = () => {
    chrome.storage.sync.get(
        ['showComments', 'showSimilarVideos', 'captionColor', 'captionSize', 'blackBoxOpacity', 'blackAndWhite'],
        (settings) => {
            document.getElementById('toggleComments').checked = settings.showComments ?? false;
            document.getElementById('toggleSimilarVideos').checked = settings.showSimilarVideos ?? false;
            document.getElementById('captionColor').value = settings.captionColor ?? '#ffff00';
            document.getElementById('captionSize').value = settings.captionSize ?? 35;
            document.getElementById('captionSizeValue').textContent = `${settings.captionSize ?? 35}px`;
            document.getElementById('blackBoxOpacity').value = settings.blackBoxOpacity ?? 0;
            document.getElementById('blackBoxOpacityValue').textContent = settings.blackBoxOpacity ?? 0;
            document.getElementById('toggleBlackAndWhite').checked = settings.blackAndWhite ?? false;

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateSettings',
                        ...settings
                    });
                }
            });
        }
    );
};

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
document.getElementById('toggleBlackAndWhite').addEventListener('change', sendSettings);

// Initialize settings and section states
getCurrentSettings();
initializeSections();