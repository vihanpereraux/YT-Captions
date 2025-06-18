chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    showComments: true,
    showSimilarVideos: true,
    showDescription: true,
    showShareButton: true,
    showDownloadButton: true,
    showClipButton: true,
    showSaveButton: true,
    captionColor: '#ffff00',
    captionSize: 35,
    blackBoxOpacity: 0,
    blackAndWhite: false
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes('youtube.com/watch')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch(err => console.log("Injection failed:", err));
  }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.url.includes('youtube.com/watch')) {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['content.js']
    }).catch(err => console.log("Injection failed:", err));
  }
});