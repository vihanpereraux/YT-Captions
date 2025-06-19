chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
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