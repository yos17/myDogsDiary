// Block screen logic for FocusGuard+

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const blockedUrl = urlParams.get('url');
const blockReason = urlParams.get('reason');

// Display blocked URL
document.getElementById('blockedUrl').textContent = `Blocked: ${blockedUrl}`;

// Load random quote
async function loadQuote() {
  try {
    const quote = await chrome.runtime.sendMessage({ action: 'getRandomQuote' });
    if (quote) {
      document.getElementById('quoteText').textContent = `"${quote.text}"`;
      document.getElementById('quoteAuthor').textContent = quote.author;
    }
  } catch (error) {
    console.error('Failed to load quote:', error);
  }
}

// Load task statistics
async function loadTaskStats() {
  try {
    const stats = await chrome.runtime.sendMessage({ action: 'getTaskStats' });

    // Update summary
    document.getElementById('totalTasks').textContent = stats.total;
    document.getElementById('completedTasks').textContent = stats.completed;
    document.getElementById('remainingTasks').textContent = stats.total - stats.completed;

    // Update priority breakdown
    ['A', 'B', 'C', 'D', 'E'].forEach(priority => {
      const data = stats.byPriority[priority];
      document.getElementById(`count${priority}`).textContent =
        `${data.completed}/${data.total}`;
    });

    // Check unlock status
    const unlockStatus = await chrome.runtime.sendMessage({ action: 'getUnlockStatus' });

    if (unlockStatus.unlocked) {
      showUnlockedState(unlockStatus);
    }
  } catch (error) {
    console.error('Failed to load task stats:', error);
  }
}

// Show unlocked state
function showUnlockedState(unlockStatus) {
  const statusCard = document.getElementById('statusCard');
  const statusIcon = document.getElementById('statusIcon');
  const statusTitle = document.getElementById('statusTitle');
  const statusMessage = document.getElementById('statusMessage');

  statusIcon.textContent = '🎉';
  statusTitle.textContent = 'Congratulations!';
  statusTitle.style.color = '#10b981';

  if (unlockStatus.reason === 'a_tasks_complete') {
    statusMessage.textContent = 'You completed all your A-tasks! You can now access websites.';
  } else if (unlockStatus.reason === 'all_tasks_complete') {
    statusMessage.textContent = 'Amazing work! You completed your entire ABCDE plan. Full access granted!';
  }

  // Change button text
  document.getElementById('viewPlanBtn').textContent = '✅ View Completed Plan';
  document.getElementById('goBackBtn').textContent = 'Continue Browsing →';
}

// Button event listeners
document.getElementById('viewPlanBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById('goBackBtn').addEventListener('click', () => {
  window.history.back();
});

// Initialize
loadQuote();
loadTaskStats();

// Refresh stats every 10 seconds
setInterval(loadTaskStats, 10000);
