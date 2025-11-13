// Background Service Worker for FocusGuard+
// Handles website blocking, task monitoring, and alarms

importScripts('storage.js');

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('FocusGuard+ installed:', details.reason);
  await StorageManager.initialize();

  // Set up daily reset alarm
  chrome.alarms.create('dailyReset', {
    periodInMinutes: 60 // Check every hour
  });

  // Set up periodic unlock check
  chrome.alarms.create('unlockCheck', {
    periodInMinutes: 1 // Check every minute
  });
});

// Handle alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'dailyReset') {
    await StorageManager.checkDailyReset();
  } else if (alarm.name === 'unlockCheck') {
    await checkAndUpdateBlockingRules();
  }
});

// Update blocking rules dynamically
async function checkAndUpdateBlockingRules() {
  const settings = await StorageManager.getSettings();
  const unlockStatus = await StorageManager.checkUnlockCondition();

  // Update badge to show status
  if (unlockStatus.unlocked) {
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#10B981' }); // Green
  } else {
    const stats = await StorageManager.getTaskStats();
    const remaining = stats.total - stats.completed;
    chrome.action.setBadgeText({ text: remaining.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#EF4444' }); // Red
  }
}

// Intercept web requests to blocked sites
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only handle main frame navigations
  if (details.frameId !== 0) return;

  const url = details.url;
  const blockStatus = await StorageManager.shouldBlockSite(url);

  if (blockStatus.block) {
    // Redirect to block page
    const blockPageUrl = chrome.runtime.getURL('src/block/block.html') +
                        `?url=${encodeURIComponent(url)}&reason=${blockStatus.reason}`;

    chrome.tabs.update(details.tabId, {
      url: blockPageUrl
    });
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message.action) {
      case 'getBlockStatus':
        const blockStatus = await StorageManager.shouldBlockSite(message.url);
        sendResponse(blockStatus);
        break;

      case 'getUnlockStatus':
        const unlockStatus = await StorageManager.checkUnlockCondition();
        sendResponse(unlockStatus);
        break;

      case 'getTaskStats':
        const stats = await StorageManager.getTaskStats();
        sendResponse(stats);
        break;

      case 'updateBlockingRules':
        await checkAndUpdateBlockingRules();
        sendResponse({ success: true });
        break;

      case 'getRandomQuote':
        const quote = await StorageManager.getRandomQuote();
        sendResponse(quote);
        break;

      default:
        sendResponse({ error: 'Unknown action' });
    }
  })();

  return true; // Keep message channel open for async response
});

// Initialize on startup
chrome.runtime.onStartup.addListener(async () => {
  await StorageManager.initialize();
  await checkAndUpdateBlockingRules();
});

// Check and update rules immediately
checkAndUpdateBlockingRules();

console.log('FocusGuard+ background service worker loaded');
