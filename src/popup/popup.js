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

// Pomodoro Timer Management
async function loadPomodoroState() {
  try {
    const state = await chrome.runtime.sendMessage({ action: 'pomodoroGetState' });
    const settings = await chrome.runtime.sendMessage({ action: 'pomodoroGetSettings' });

    const pomodoroSection = document.getElementById('pomodoroSection');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerLabel = document.getElementById('timerLabel');
    const sessionCount = document.getElementById('pomodoroSessionCount');
    const startBtn = document.getElementById('pomodoroStartBtn');
    const pauseBtn = document.getElementById('pomodoroPauseBtn');
    const stopBtn = document.getElementById('pomodoroStopBtn');

    // Update session count
    sessionCount.textContent = `${state.sessionCount}/${settings.sessionsUntilLongBreak}`;

    // Get remaining time
    const { remainingTime } = await chrome.runtime.sendMessage({ action: 'pomodoroGetRemainingTime' });

    // Format time display
    const minutes = Math.floor(remainingTime / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Update UI based on state
    pomodoroSection.className = 'pomodoro-section';

    if (state.state === 'idle') {
      timerLabel.textContent = 'Ready to focus';
      startBtn.style.display = 'block';
      pauseBtn.style.display = 'none';
      stopBtn.style.display = 'none';
    } else if (state.state === 'work') {
      pomodoroSection.classList.add('work');
      timerLabel.textContent = state.isPaused ? 'Paused - Work Session' : 'Work Session';
      startBtn.style.display = 'none';
      pauseBtn.style.display = state.isPaused ? 'none' : 'block';
      pauseBtn.textContent = '⏸ Pause';
      stopBtn.style.display = 'block';

      if (state.isPaused) {
        const resumeBtn = pauseBtn.cloneNode(true);
        resumeBtn.textContent = '▶ Resume';
        resumeBtn.style.display = 'block';
        pauseBtn.replaceWith(resumeBtn);
        document.getElementById('pomodoroPauseBtn').addEventListener('click', handlePomodoroResume);
      }
    } else if (state.state === 'short_break' || state.state === 'long_break') {
      pomodoroSection.classList.add('break');
      timerLabel.textContent = state.state === 'long_break' ? 'Long Break ☕' : 'Short Break ☕';
      startBtn.style.display = 'none';
      pauseBtn.style.display = 'none';
      stopBtn.style.display = 'block';
    }
  } catch (error) {
    console.error('Failed to load Pomodoro state:', error);
  }
}

// Pomodoro button handlers
async function handlePomodoroStart() {
  try {
    await chrome.runtime.sendMessage({ action: 'pomodoroStart' });
    await loadPomodoroState();
  } catch (error) {
    console.error('Failed to start Pomodoro:', error);
  }
}

async function handlePomodoroPause() {
  try {
    await chrome.runtime.sendMessage({ action: 'pomodoroPause' });
    await loadPomodoroState();
  } catch (error) {
    console.error('Failed to pause Pomodoro:', error);
  }
}

async function handlePomodoroResume() {
  try {
    await chrome.runtime.sendMessage({ action: 'pomodoroResume' });
    await loadPomodoroState();
  } catch (error) {
    console.error('Failed to resume Pomodoro:', error);
  }
}

async function handlePomodoroStop() {
  try {
    await chrome.runtime.sendMessage({ action: 'pomodoroStop' });
    await loadPomodoroState();
  } catch (error) {
    console.error('Failed to stop Pomodoro:', error);
  }
}

// Pomodoro event listeners
document.getElementById('pomodoroStartBtn').addEventListener('click', handlePomodoroStart);
document.getElementById('pomodoroPauseBtn').addEventListener('click', handlePomodoroPause);
document.getElementById('pomodoroStopBtn').addEventListener('click', handlePomodoroStop);

// Listen for Pomodoro state changes from background
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'pomodoroStateChanged') {
    loadPomodoroState();
  }
});

// Initialize
loadQuote();
loadStats();
loadPomodoroState();

// Refresh stats every 5 seconds
setInterval(loadStats, 5000);

// Update Pomodoro timer every second
setInterval(loadPomodoroState, 1000);
