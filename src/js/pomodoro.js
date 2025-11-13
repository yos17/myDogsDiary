// Pomodoro Timer Module for FocusGuard+
// Manages Pomodoro sessions with Chrome Alarms API for accuracy

const PomodoroManager = {
  // Default Pomodoro settings
  defaults: {
    workDuration: 25, // minutes
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true,
    notificationsEnabled: true,
    enforceBlocking: true // Block sites during work sessions
  },

  // Pomodoro states
  states: {
    IDLE: 'idle',
    WORK: 'work',
    SHORT_BREAK: 'short_break',
    LONG_BREAK: 'long_break',
    PAUSED: 'paused'
  },

  // Initialize Pomodoro settings
  async initialize() {
    const data = await chrome.storage.local.get('pomodoroSettings');
    if (!data.pomodoroSettings) {
      await chrome.storage.local.set({
        pomodoroSettings: this.defaults,
        pomodoroState: {
          state: this.states.IDLE,
          sessionCount: 0,
          currentTaskId: null,
          startTime: null,
          endTime: null,
          isPaused: false,
          pausedTime: null
        },
        pomodoroHistory: []
      });
    }
  },

  // Get current Pomodoro settings
  async getSettings() {
    const data = await chrome.storage.local.get('pomodoroSettings');
    return data.pomodoroSettings || this.defaults;
  },

  // Update Pomodoro settings
  async updateSettings(newSettings) {
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };
    await chrome.storage.local.set({ pomodoroSettings: updated });
    return updated;
  },

  // Get current Pomodoro state
  async getState() {
    const data = await chrome.storage.local.get('pomodoroState');
    return data.pomodoroState || {
      state: this.states.IDLE,
      sessionCount: 0,
      currentTaskId: null,
      startTime: null,
      endTime: null,
      isPaused: false,
      pausedTime: null
    };
  },

  // Update Pomodoro state
  async setState(newState) {
    await chrome.storage.local.set({ pomodoroState: newState });
    return newState;
  },

  // Start a work session
  async startWork(taskId = null) {
    const settings = await this.getSettings();
    const state = await this.getState();

    const now = Date.now();
    const endTime = now + (settings.workDuration * 60 * 1000);

    const newState = {
      state: this.states.WORK,
      sessionCount: state.sessionCount,
      currentTaskId: taskId,
      startTime: now,
      endTime: endTime,
      isPaused: false,
      pausedTime: null
    };

    await this.setState(newState);

    // Set Chrome alarm for accurate timing
    await chrome.alarms.create('pomodoroTimer', {
      when: endTime
    });

    // Send message to update UI
    this.broadcastStateChange(newState);

    return newState;
  },

  // Start a break
  async startBreak(isLongBreak = false) {
    const settings = await this.getSettings();
    const state = await this.getState();

    const duration = isLongBreak ?
      settings.longBreakDuration :
      settings.shortBreakDuration;

    const now = Date.now();
    const endTime = now + (duration * 60 * 1000);

    const newState = {
      state: isLongBreak ? this.states.LONG_BREAK : this.states.SHORT_BREAK,
      sessionCount: state.sessionCount,
      currentTaskId: state.currentTaskId,
      startTime: now,
      endTime: endTime,
      isPaused: false,
      pausedTime: null
    };

    await this.setState(newState);

    await chrome.alarms.create('pomodoroTimer', {
      when: endTime
    });

    this.broadcastStateChange(newState);

    return newState;
  },

  // Pause current session
  async pause() {
    const state = await this.getState();

    if (state.state === this.states.IDLE || state.isPaused) {
      return state;
    }

    // Clear the alarm
    await chrome.alarms.clear('pomodoroTimer');

    const newState = {
      ...state,
      isPaused: true,
      pausedTime: Date.now()
    };

    await this.setState(newState);
    this.broadcastStateChange(newState);

    return newState;
  },

  // Resume paused session
  async resume() {
    const state = await this.getState();

    if (!state.isPaused) {
      return state;
    }

    const now = Date.now();
    const pausedDuration = now - state.pausedTime;
    const newEndTime = state.endTime + pausedDuration;

    const newState = {
      ...state,
      endTime: newEndTime,
      isPaused: false,
      pausedTime: null
    };

    await this.setState(newState);

    await chrome.alarms.create('pomodoroTimer', {
      when: newEndTime
    });

    this.broadcastStateChange(newState);

    return newState;
  },

  // Stop/reset current session
  async stop() {
    await chrome.alarms.clear('pomodoroTimer');

    const newState = {
      state: this.states.IDLE,
      sessionCount: 0,
      currentTaskId: null,
      startTime: null,
      endTime: null,
      isPaused: false,
      pausedTime: null
    };

    await this.setState(newState);
    this.broadcastStateChange(newState);

    return newState;
  },

  // Handle session completion
  async completeSession() {
    const state = await this.getState();
    const settings = await this.getSettings();

    // Record in history
    await this.recordSession(state);

    if (state.state === this.states.WORK) {
      // Work session completed
      const newSessionCount = state.sessionCount + 1;

      // Increment task Pomodoro count if linked to a task
      if (state.currentTaskId) {
        await this.incrementTaskPomodoros(state.currentTaskId);
      }

      // Show notification
      if (settings.notificationsEnabled) {
        await this.showNotification(
          'Work Session Complete! 🎉',
          `Great job! Time for a ${newSessionCount % settings.sessionsUntilLongBreak === 0 ? 'long' : 'short'} break.`
        );
      }

      // Update session count
      const updatedState = await this.getState();
      updatedState.sessionCount = newSessionCount;
      await this.setState(updatedState);

      // Auto-start break if enabled
      if (settings.autoStartBreaks) {
        const isLongBreak = newSessionCount % settings.sessionsUntilLongBreak === 0;
        await this.startBreak(isLongBreak);
      } else {
        // Go to idle
        const idleState = {
          ...updatedState,
          state: this.states.IDLE,
          startTime: null,
          endTime: null
        };
        await this.setState(idleState);
        this.broadcastStateChange(idleState);
      }

    } else {
      // Break completed
      if (settings.notificationsEnabled) {
        await this.showNotification(
          'Break Complete! ☕',
          'Ready to start another work session?'
        );
      }

      // Auto-start work if enabled
      if (settings.autoStartWork) {
        await this.startWork(state.currentTaskId);
      } else {
        // Go to idle
        const idleState = {
          ...state,
          state: this.states.IDLE,
          startTime: null,
          endTime: null
        };
        await this.setState(idleState);
        this.broadcastStateChange(idleState);
      }
    }
  },

  // Record session in history
  async recordSession(state) {
    const data = await chrome.storage.local.get('pomodoroHistory');
    const history = data.pomodoroHistory || [];

    const session = {
      type: state.state,
      taskId: state.currentTaskId,
      startTime: state.startTime,
      endTime: Date.now(),
      completed: true,
      date: new Date().toDateString()
    };

    history.push(session);

    // Keep last 100 sessions
    if (history.length > 100) {
      history.shift();
    }

    await chrome.storage.local.set({ pomodoroHistory: history });
  },

  // Increment Pomodoro count for a task
  async incrementTaskPomodoros(taskId) {
    // This integrates with StorageManager
    if (typeof StorageManager !== 'undefined') {
      const tasks = await StorageManager.getTasks();
      const task = tasks.find(t => t.id === taskId);

      if (task) {
        task.pomodoroCount = (task.pomodoroCount || 0) + 1;
        await StorageManager.updateTask(taskId, task);
      }
    }
  },

  // Get remaining time in current session
  async getRemainingTime() {
    const state = await this.getState();

    if (state.state === this.states.IDLE || !state.endTime) {
      return 0;
    }

    if (state.isPaused) {
      return state.endTime - state.pausedTime;
    }

    return Math.max(0, state.endTime - Date.now());
  },

  // Get Pomodoro statistics
  async getStats() {
    const data = await chrome.storage.local.get('pomodoroHistory');
    const history = data.pomodoroHistory || [];
    const today = new Date().toDateString();

    const stats = {
      today: {
        workSessions: 0,
        totalWorkTime: 0,
        totalBreakTime: 0
      },
      thisWeek: {
        workSessions: 0,
        totalWorkTime: 0
      },
      allTime: {
        workSessions: 0,
        totalWorkTime: 0
      }
    };

    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    history.forEach(session => {
      const duration = session.endTime - session.startTime;

      if (session.type === this.states.WORK) {
        stats.allTime.workSessions++;
        stats.allTime.totalWorkTime += duration;

        if (session.startTime >= weekAgo) {
          stats.thisWeek.workSessions++;
          stats.thisWeek.totalWorkTime += duration;
        }

        if (session.date === today) {
          stats.today.workSessions++;
          stats.today.totalWorkTime += duration;
        }
      } else if (session.date === today) {
        stats.today.totalBreakTime += duration;
      }
    });

    return stats;
  },

  // Show browser notification
  async showNotification(title, message) {
    try {
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('assets/icons/icon128.png'),
        title: title,
        message: message,
        priority: 2
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  },

  // Broadcast state change to all listeners
  broadcastStateChange(state) {
    // Send message to all extension pages
    chrome.runtime.sendMessage({
      action: 'pomodoroStateChanged',
      state: state
    }).catch(() => {
      // Ignore errors if no listeners
    });
  },

  // Check if should enforce blocking
  async shouldEnforceBlocking() {
    const settings = await this.getSettings();
    const state = await this.getState();

    return settings.enforceBlocking && state.state === this.states.WORK && !state.isPaused;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.PomodoroManager = PomodoroManager;
}

// For service worker
if (typeof self !== 'undefined' && self.constructor.name === 'ServiceWorkerGlobalScope') {
  self.PomodoroManager = PomodoroManager;
}
