const getCurrentSettings = () => {
    chrome.storage.local.get(
        ['showComments', 'showSimilarVideos', 'captionColor', 'captionSize', 'blackBoxOpacity', 'blackAndWhite', 'collapsedSections'],
        (settings) => {
            document.getElementById('toggleComments').checked = settings.showComments ?? true;
            document.getElementById('toggleSimilarVideos').checked = settings.showSimilarVideos ?? true;
            document.getElementById('captionColor').value = settings.captionColor ?? '#ffff00';
            document.getElementById('captionSize').value = settings.captionSize ?? 35;
            document.getElementById('captionSizeValue').textContent = `${settings.captionSize ?? 35}px`;
            document.getElementById('blackBoxOpacity').value = settings.blackBoxOpacity ?? 0;
            document.getElementById('blackBoxOpacityValue').textContent = settings.blackBoxOpacity ?? 0;
            document.getElementById('toggleBlackAndWhite').checked = settings.blackAndWhite ?? false;
            sendSettingsToContent();
        }
    );
};

const sendSettingsToContent = () => {
    const settings = {
        showComments: document.getElementById('toggleComments').checked,
        showSimilarVideos: document.getElementById('toggleSimilarVideos').checked,
        captionColor: document.getElementById('captionColor').value,
        captionSize: document.getElementById('captionSize').value,
        blackBoxOpacity: document.getElementById('blackBoxOpacity').value,
        blackAndWhite: document.getElementById('toggleBlackAndWhite').checked
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

document.getElementById('toggleComments').addEventListener('change', sendSettingsToContent);
document.getElementById('toggleSimilarVideos').addEventListener('change', sendSettingsToContent);
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

document.addEventListener('DOMContentLoaded', () => {
    getCurrentSettings();
    initializeSections();
});