// Planner page logic for FocusGuard+

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;

    // Update active tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// Check URL parameters for tab selection
const urlParams = new URLSearchParams(window.location.search);
const initialTab = urlParams.get('tab');
if (initialTab) {
  const tabButton = document.querySelector(`[data-tab="${initialTab}"]`);
  if (tabButton) {
    tabButton.click();
  }
}

// Load header stats
async function loadHeaderStats() {
  const settings = await StorageManager.getSettings();
  const stats = await StorageManager.getTaskStats();

  document.getElementById('headerCompleted').textContent = `${stats.completed}/${stats.total}`;
  document.getElementById('headerStreak').textContent = `🔥 ${settings.streakDays}`;
}

// Load and display tasks
async function loadTasks() {
  const tasks = await StorageManager.getTasks();
  const tasksList = document.getElementById('tasksList');
  const emptyState = document.getElementById('emptyState');

  if (tasks.length === 0) {
    tasksList.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  tasksList.style.display = 'flex';
  emptyState.style.display = 'none';

  // Sort tasks by priority (A first, E last) and completion status
  const priorityOrder = { A: 0, B: 1, C: 2, D: 3, E: 4 };
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  tasksList.innerHTML = sortedTasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
      <div class="task-content">
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.notes ? `<div class="task-notes">${escapeHtml(task.notes)}</div>` : ''}
      </div>
      <div class="task-priority ${task.priority.toLowerCase()}">${task.priority}</div>
      <button class="task-delete" title="Delete task">🗑️</button>
    </div>
  `).join('');

  // Add event listeners
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', async (e) => {
      const taskItem = e.target.closest('.task-item');
      const taskId = taskItem.dataset.taskId;
      await StorageManager.toggleTaskCompletion(taskId);
      await loadTasks();
      await loadHeaderStats();

      // Notify background script to update blocking rules
      chrome.runtime.sendMessage({ action: 'updateBlockingRules' });
    });
  });

  document.querySelectorAll('.task-delete').forEach(button => {
    button.addEventListener('click', async (e) => {
      const taskItem = e.target.closest('.task-item');
      const taskId = taskItem.dataset.taskId;

      if (confirm('Are you sure you want to delete this task?')) {
        await StorageManager.deleteTask(taskId);
        await loadTasks();
        await loadHeaderStats();
      }
    });
  });
}

// Add task form handler
document.getElementById('addTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('taskTitle').value.trim();
  const notes = document.getElementById('taskNotes').value.trim();
  const priority = document.getElementById('taskPriority').value;

  if (!title) return;

  await StorageManager.addTask({
    title,
    notes,
    priority
  });

  // Clear form
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskNotes').value = '';
  document.getElementById('taskPriority').value = 'A';

  await loadTasks();
  await loadHeaderStats();

  // Show success animation
  const form = document.getElementById('addTaskForm');
  form.style.animation = 'pulse 0.3s';
  setTimeout(() => {
    form.style.animation = '';
  }, 300);
});

// Clear completed tasks
document.getElementById('clearCompletedBtn').addEventListener('click', async () => {
  const tasks = await StorageManager.getTasks();
  const completedTasks = tasks.filter(t => t.completed);

  if (completedTasks.length === 0) {
    alert('No completed tasks to clear.');
    return;
  }

  if (confirm(`Clear ${completedTasks.length} completed task(s)?`)) {
    for (const task of completedTasks) {
      await StorageManager.deleteTask(task.id);
    }
    await loadTasks();
    await loadHeaderStats();
  }
});

// Load settings
async function loadSettings() {
  const settings = await StorageManager.getSettings();

  document.getElementById('workHoursEnabled').checked = settings.workHours.enabled;
  document.getElementById('workStart').value = settings.workHours.start;
  document.getElementById('workEnd').value = settings.workHours.end;
  document.getElementById('blockedSites').value = settings.blockedSites.join('\n');
  document.getElementById('strictMode').checked = settings.strictMode;
  document.getElementById('lenientMode').checked = settings.lenientMode;
  document.getElementById('resetTime').value = settings.resetTime;
}

// Save settings
document.getElementById('saveSettingsBtn').addEventListener('click', async () => {
  const workHoursEnabled = document.getElementById('workHoursEnabled').checked;
  const workStart = document.getElementById('workStart').value;
  const workEnd = document.getElementById('workEnd').value;
  const blockedSitesText = document.getElementById('blockedSites').value;
  const blockedSites = blockedSitesText
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  const strictMode = document.getElementById('strictMode').checked;
  const lenientMode = document.getElementById('lenientMode').checked;
  const resetTime = document.getElementById('resetTime').value;

  await StorageManager.updateSettings({
    workHours: {
      enabled: workHoursEnabled,
      start: workStart,
      end: workEnd
    },
    blockedSites,
    strictMode,
    lenientMode,
    resetTime
  });

  // Show save message
  const saveMessage = document.getElementById('saveMessage');
  saveMessage.classList.add('show');
  setTimeout(() => {
    saveMessage.classList.remove('show');
  }, 3000);

  // Update blocking rules
  chrome.runtime.sendMessage({ action: 'updateBlockingRules' });
});

// Utility function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize
loadHeaderStats();
loadTasks();
loadSettings();

// Refresh tasks every 10 seconds
setInterval(() => {
  loadTasks();
  loadHeaderStats();
}, 10000);
