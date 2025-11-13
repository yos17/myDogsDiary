// Popup dashboard logic for FocusGuard+

// Load and display quote
async function loadQuote() {
  try {
    const quote = await chrome.runtime.sendMessage({ action: 'getRandomQuote' });
    if (quote) {
      document.getElementById('dailyQuote').textContent = `"${quote.text}"`;
      document.getElementById('quoteAuthor').textContent = quote.author;
    }
  } catch (error) {
    console.error('Failed to load quote:', error);
  }
}

// Load task statistics and update UI
async function loadStats() {
  try {
    const stats = await chrome.runtime.sendMessage({ action: 'getTaskStats' });
    const settings = await StorageManager.getSettings();
    const unlockStatus = await chrome.runtime.sendMessage({ action: 'getUnlockStatus' });

    // Update overall stats
    document.getElementById('totalTasks').textContent = stats.total;
    document.getElementById('completedTasks').textContent = stats.completed;
    document.getElementById('remainingTasks').textContent = stats.total - stats.completed;

    // Update progress bar
    const progressPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    document.getElementById('progressBar').style.width = `${progressPercentage}%`;
    document.getElementById('progressText').textContent =
      `${stats.completed} of ${stats.total} tasks completed`;

    // Update streak
    document.getElementById('streakText').textContent =
      `🔥 ${settings.streakDays} day streak`;

    // Update priority bars and counts
    ['A', 'B', 'C', 'D', 'E'].forEach(priority => {
      const data = stats.byPriority[priority];
      const percentage = data.total > 0 ? (data.completed / data.total) * 100 : 0;

      document.getElementById(`bar${priority}`).style.width = `${percentage}%`;
      document.getElementById(`count${priority}`).textContent =
        `${data.completed}/${data.total}`;
    });

    // Update status badge
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    if (unlockStatus.unlocked) {
      statusDot.classList.remove('blocked');
      if (unlockStatus.reason === 'a_tasks_complete') {
        statusText.textContent = 'Unlocked (A-tasks done)';
      } else if (unlockStatus.reason === 'all_tasks_complete') {
        statusText.textContent = 'Fully Unlocked! 🎉';
      }
    } else {
      statusDot.classList.add('blocked');

      const inWorkHours = await StorageManager.isInWorkHours();
      if (inWorkHours || settings.strictMode) {
        statusText.textContent = 'Blocking Active';
      } else {
        statusText.textContent = 'Outside Work Hours';
      }
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Event listeners
document.getElementById('refreshQuote').addEventListener('click', () => {
  loadQuote();
});

document.getElementById('openPlannerBtn').addEventListener('click', () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('src/planner/planner.html')
  });
});

document.getElementById('settingsBtn').addEventListener('click', () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('src/planner/planner.html?tab=settings')
  });
});

// Initialize
loadQuote();
loadStats();

// Refresh stats every 5 seconds
setInterval(loadStats, 5000);
