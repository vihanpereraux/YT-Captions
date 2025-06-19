const sendSettingsToContent = () => {
    const settings = {
        showTopRow: document.getElementById('toggleTopRow').checked,
        showComments: document.getElementById('toggleComments').checked,
        showSimilarVideos: document.getElementById('toggleSimilarVideos').checked,
        showDescription: document.getElementById('toggleDescription').checked,
        showShareButton: document.getElementById('toggleShareButton').checked,
        showDownloadButton: document.getElementById('toggleDownloadButton').checked,
        showClipButton: document.getElementById('toggleClipButton').checked,
        showSaveButton: document.getElementById('toggleSaveButton').checked,
        showChannelDetails: document.getElementById('toggleChannelDetails').checked,
        captionColor: document.getElementById('captionColor').value,
        captionSize: document.getElementById('captionSize').value,
        blackBoxOpacity: document.getElementById('blackBoxOpacity').value,
        blackAndWhite: document.getElementById('toggleBlackAndWhite').checked,
        topBarOpacity: document.getElementById('topBarOpacity').value,
        thumbnailOpacity: document.getElementById('thumbnailOpacity').value,
        layoutOpacity: document.getElementById('layoutOpacity').value,
        leftPanelOpacity: document.getElementById('leftPanelOpacity').value,
        filtersPanelOpacity: document.getElementById('filtersPanelOpacity').value
    };

    chrome.storage.local.set(settings);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'updateSettings',
                ...settings
            });
        }
    });
};

const toggleSection = (sectionName, isCollapsed) => {
    const button = document.querySelector(`[data-section="${sectionName}"]`);
    const content = document.getElementById(`${sectionName}-section`);

    if (button && content) {
        button.classList.toggle('collapsed', isCollapsed);
        content.classList.toggle('collapsed', isCollapsed);

        chrome.storage.local.get(['collapsedSections'], (result) => {
            const collapsedSections = result.collapsedSections || {};
            collapsedSections[sectionName] = isCollapsed;
            chrome.storage.local.set({ collapsedSections });
        });
    }
};

const initializeSections = () => {
    chrome.storage.local.get(['collapsedSections'], (result) => {
        const collapsedSections = result.collapsedSections || {};

        document.querySelectorAll('.toggle-btn').forEach(button => {
            const sectionName = button.dataset.section;
            const isCollapsed = collapsedSections[sectionName] ?? false;

            toggleSection(sectionName, isCollapsed);

            button.addEventListener('click', () => {
                const isCurrentlyCollapsed = button.classList.contains('collapsed');
                toggleSection(sectionName, !isCurrentlyCollapsed);
            });
        });
    });
};

const getCurrentSettings = () => {
    chrome.storage.local.get([
        'showTopRow', 'showComments', 'showSimilarVideos', 'showDescription',
        'showShareButton', 'showDownloadButton', 'showClipButton', 'showSaveButton',
        'showChannelDetails', 'captionColor', 'captionSize', 'blackBoxOpacity',
        'blackAndWhite', 'topBarOpacity', 'thumbnailOpacity', 'layoutOpacity'
        , 'leftPanelOpacity', 'filtersPanelOpacity'
    ], (settings) => {
        document.getElementById('toggleTopRow').checked = settings.showTopRow ?? true;
        document.getElementById('toggleComments').checked = settings.showComments ?? true;
        document.getElementById('toggleSimilarVideos').checked = settings.showSimilarVideos ?? true;
        document.getElementById('toggleDescription').checked = settings.showDescription ?? true;
        document.getElementById('toggleShareButton').checked = settings.showShareButton ?? true;
        document.getElementById('toggleDownloadButton').checked = settings.showDownloadButton ?? true;
        document.getElementById('toggleClipButton').checked = settings.showClipButton ?? true;
        document.getElementById('toggleSaveButton').checked = settings.showSaveButton ?? true;
        document.getElementById('toggleChannelDetails').checked = settings.showChannelDetails ?? true;
        document.getElementById('captionColor').value = settings.captionColor ?? '#ffff00';
        document.getElementById('captionSize').value = settings.captionSize ?? 35;
        document.getElementById('captionSizeValue').textContent = `${settings.captionSize ?? 35}px`;
        document.getElementById('blackBoxOpacity').value = settings.blackBoxOpacity ?? 0;
        document.getElementById('blackBoxOpacityValue').textContent = settings.blackBoxOpacity ?? 0;
        document.getElementById('toggleBlackAndWhite').checked = settings.blackAndWhite ?? false;
        document.getElementById('topBarOpacity').value = settings.topBarOpacity ?? 100;
        document.getElementById('topBarOpacityValue').textContent = `${settings.topBarOpacity ?? 100}%`;
        document.getElementById('thumbnailOpacity').value = settings.thumbnailOpacity ?? 100;
        document.getElementById('thumbnailOpacityValue').textContent = `${settings.thumbnailOpacity ?? 100}%`;
        document.getElementById('layoutOpacity').value = settings.layoutOpacity ?? 100;
        document.getElementById('layoutOpacityValue').textContent = `${settings.layoutOpacity ?? 100}%`;
        document.getElementById('leftPanelOpacity').value = settings.leftPanelOpacity ?? 100;
        document.getElementById('leftPanelOpacityValue').textContent = `${settings.leftPanelOpacity ?? 100}%`;
        document.getElementById('filtersPanelOpacity').value = settings.filtersPanelOpacity ?? 100;
        document.getElementById('filtersPanelOpacityValue').textContent = `${settings.filtersPanelOpacity ?? 100}%`;
        
        
        sendSettingsToContent();
    });
};

// Event listeners
document.getElementById('toggleTopRow').addEventListener('change', sendSettingsToContent);
document.getElementById('toggleComments').addEventListener('change', sendSettingsToContent);
document.getElementById('toggleSimilarVideos').addEventListener('change', sendSettingsToContent);
document.getElementById('toggleDescription').addEventListener('change', sendSettingsToContent);
document.getElementById('toggleShareButton').addEventListener('change', sendSettingsToContent);
document.getElementById('toggleDownloadButton').addEventListener('change', sendSettingsToContent);
document.getElementById('toggleClipButton').addEventListener('change', sendSettingsToContent);
document.getElementById('toggleSaveButton').addEventListener('change', sendSettingsToContent);
document.getElementById('toggleChannelDetails').addEventListener('change', sendSettingsToContent);
document.getElementById('captionColor').addEventListener('input', sendSettingsToContent);
document.getElementById('captionSize').addEventListener('input', () => {
    document.getElementById('captionSizeValue').textContent = `${document.getElementById('captionSize').value}px`;
    sendSettingsToContent();
});
document.getElementById('blackBoxOpacity').addEventListener('input', () => {
    document.getElementById('blackBoxOpacityValue').textContent = document.getElementById('blackBoxOpacity').value;
    sendSettingsToContent();
});
document.getElementById('toggleBlackAndWhite').addEventListener('change', sendSettingsToContent);

document.getElementById('topBarOpacity').addEventListener('input', () => {
    document.getElementById('topBarOpacityValue').textContent = `${document.getElementById('topBarOpacity').value}%`;
    sendSettingsToContent();
});

document.getElementById('leftPanelOpacity').addEventListener('input', () => {
    document.getElementById('leftPanelOpacityValue').textContent = `${document.getElementById('leftPanelOpacity').value}%`;
    sendSettingsToContent();
});

document.getElementById('filtersPanelOpacity').addEventListener('input', () => {
    document.getElementById('filtersPanelOpacityValue').textContent = `${document.getElementById('filtersPanelOpacity').value}%`;
    sendSettingsToContent();
});

document.getElementById('thumbnailOpacity').addEventListener('input', () => {
    document.getElementById('thumbnailOpacityValue').textContent = `${document.getElementById('thumbnailOpacity').value}%`;
    sendSettingsToContent();
});

document.getElementById('layoutOpacity').addEventListener('input', () => {
    document.getElementById('layoutOpacityValue').textContent = `${document.getElementById('layoutOpacity').value}%`;
    sendSettingsToContent();
});

document.addEventListener('DOMContentLoaded', () => {
    getCurrentSettings();
    initializeSections();
});

