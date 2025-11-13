// Storage utility for FocusGuard+
// Handles all Chrome storage operations

const StorageManager = {
  // Default settings
  defaults: {
    blockedSites: [],
    workHours: {
      enabled: true,
      start: '09:00',
      end: '17:00'
    },
    strictMode: false, // If true, blocking persists outside work hours until tasks complete
    lenientMode: false, // If true, completing only A tasks unlocks everything
    resetTime: '06:00',
    tasks: [],
    streakDays: 0,
    lastCompletionDate: null,
    preferredAuthors: []
  },

  // Initialize storage with defaults if needed
  async initialize() {
    const data = await chrome.storage.local.get(null);

    if (!data.settings) {
      await chrome.storage.local.set({
        settings: this.defaults
      });
    }

    // Check if we need to reset tasks for a new day
    await this.checkDailyReset();
  },

  // Get all settings
  async getSettings() {
    const data = await chrome.storage.local.get('settings');
    return data.settings || this.defaults;
  },

  // Update settings
  async updateSettings(newSettings) {
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };
    await chrome.storage.local.set({ settings: updated });
    return updated;
  },

  // Task management
  async getTasks() {
    const settings = await this.getSettings();
    return settings.tasks || [];
  },

  async addTask(task) {
    const tasks = await this.getTasks();
    const newTask = {
      id: Date.now().toString(),
      title: task.title,
      notes: task.notes || '',
      priority: task.priority, // A, B, C, D, E
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    await this.updateSettings({ tasks });
    return newTask;
  },

  async updateTask(taskId, updates) {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      await this.updateSettings({ tasks });
    }
    return tasks[index];
  },

  async deleteTask(taskId) {
    const tasks = await this.getTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    await this.updateSettings({ tasks: filtered });
  },

  async toggleTaskCompletion(taskId) {
    const tasks = await this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      await this.updateSettings({ tasks });

      // Check if all tasks are now complete
      await this.checkUnlockCondition();
    }
    return task;
  },

  // Check if unlock condition is met
  async checkUnlockCondition() {
    const settings = await this.getSettings();
    const tasks = settings.tasks || [];

    if (tasks.length === 0) {
      return { unlocked: false, reason: 'no_tasks' };
    }

    const aTasks = tasks.filter(t => t.priority === 'A');
    const allATasksComplete = aTasks.length > 0 && aTasks.every(t => t.completed);

    if (settings.lenientMode && allATasksComplete) {
      return { unlocked: true, reason: 'a_tasks_complete', early: true };
    }

    const allTasksComplete = tasks.every(t => t.completed);
    if (allTasksComplete) {
      // Update streak
      const today = new Date().toDateString();
      if (settings.lastCompletionDate !== today) {
        const streakDays = settings.streakDays + 1;
        await this.updateSettings({
          lastCompletionDate: today,
          streakDays
        });
      }
      return { unlocked: true, reason: 'all_tasks_complete', early: true };
    }

    return { unlocked: false, reason: 'tasks_incomplete' };
  },

  // Check if currently in work hours
  isInWorkHours() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    return new Promise(async (resolve) => {
      const settings = await this.getSettings();
      if (!settings.workHours.enabled) {
        resolve(false);
        return;
      }

      const inWorkHours = currentTime >= settings.workHours.start &&
                         currentTime < settings.workHours.end;
      resolve(inWorkHours);
    });
  },

  // Check if site should be blocked
  async shouldBlockSite(url) {
    const settings = await this.getSettings();
    const unlockStatus = await this.checkUnlockCondition();

    // If unlocked (tasks complete), don't block
    if (unlockStatus.unlocked) {
      return { block: false, reason: unlockStatus.reason };
    }

    // Check if URL matches any blocked site
    const isBlocked = settings.blockedSites.some(site => {
      try {
        const pattern = site.replace(/\*/g, '.*');
        const regex = new RegExp(pattern, 'i');
        return regex.test(url);
      } catch (e) {
        return url.includes(site);
      }
    });

    if (!isBlocked) {
      return { block: false, reason: 'not_in_blocklist' };
    }

    // Check work hours
    const inWorkHours = await this.isInWorkHours();

    if (settings.strictMode) {
      // In strict mode, block regardless of work hours
      return { block: true, reason: 'strict_mode' };
    }

    // Normal mode: only block during work hours
    if (inWorkHours) {
      return { block: true, reason: 'work_hours' };
    }

    return { block: false, reason: 'outside_work_hours' };
  },

  // Daily reset check
  async checkDailyReset() {
    const settings = await this.getSettings();
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const lastReset = await chrome.storage.local.get('lastReset');
    const today = now.toDateString();

    if (!lastReset.lastReset || lastReset.lastReset !== today) {
      if (currentTime >= settings.resetTime) {
        // Reset all tasks
        await this.updateSettings({ tasks: [] });
        await chrome.storage.local.set({ lastReset: today });
      }
    }
  },

  // Get task statistics
  async getTaskStats() {
    const tasks = await this.getTasks();
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      byPriority: {
        A: { total: 0, completed: 0 },
        B: { total: 0, completed: 0 },
        C: { total: 0, completed: 0 },
        D: { total: 0, completed: 0 },
        E: { total: 0, completed: 0 }
      }
    };

    tasks.forEach(task => {
      stats.byPriority[task.priority].total++;
      if (task.completed) {
        stats.byPriority[task.priority].completed++;
      }
    });

    return stats;
  },

  // Get a random quote
  async getRandomQuote() {
    const response = await fetch(chrome.runtime.getURL('src/data/quotes.json'));
    const data = await response.json();
    const settings = await this.getSettings();

    let quotes = data.quotes;

    // Filter by preferred authors if set
    if (settings.preferredAuthors && settings.preferredAuthors.length > 0) {
      const filtered = quotes.filter(q => settings.preferredAuthors.includes(q.author));
      if (filtered.length > 0) {
        quotes = filtered;
      }
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}

// For service worker
if (typeof self !== 'undefined' && self.constructor.name === 'ServiceWorkerGlobalScope') {
  self.StorageManager = StorageManager;
}
