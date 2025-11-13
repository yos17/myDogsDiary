# 🎯 FocusGuard+

**Stay focused. Complete your plan. Unlock early.**

FocusGuard+ is a Chrome browser extension that helps you stay productive by blocking distracting websites until you complete your daily ABCDE priority plan. Get inspired with motivational quotes from productivity legends like Brian Tracy, Jim Rohn, Zig Ziglar, and more.

## ✨ Key Features

### 🚫 Smart Website Blocking
- Block distracting websites during work hours
- Automatic blocking based on your schedule
- Strict mode: Block sites even outside work hours until tasks are done

### 📋 ABCDE Priority Planning System
Inspired by Brian Tracy's "Eat That Frog!" methodology:
- **A Tasks** - Must do (critical consequences)
- **B Tasks** - Should do (mild consequences)
- **C Tasks** - Nice to do (no consequences)
- **D Tasks** - Delegate to others
- **E Tasks** - Eliminate completely

### 🎉 Dynamic Early Unlock
Complete your tasks, unlock websites early—even before work hours end!
- **Lenient Mode**: Complete all A-tasks to unlock
- **Full Unlock**: Complete all ABCDE tasks for complete freedom

### 💭 Motivational Quotes
Get inspired every time you're blocked with rotating quotes from:
- Brian Tracy
- Jim Rohn
- Zig Ziglar
- James Clear
- Napoleon Hill
- Les Brown
- And more!

### 📊 Productivity Tracking
- Daily streak counter
- Task completion statistics
- Progress visualization by priority
- Real-time unlock status

## 🚀 Installation

### From Source (Developer Mode)

1. **Clone or Download** this repository
   ```bash
   git clone https://github.com/yourusername/focusguard-plus.git
   cd focusguard-plus
   ```

2. **Open Chrome Extensions**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)

3. **Load Extension**
   - Click "Load unpacked"
   - Select the `focusguard-plus` folder
   - The extension icon should appear in your toolbar!

4. **Pin the Extension** (optional)
   - Click the puzzle piece icon in Chrome toolbar
   - Find FocusGuard+ and click the pin icon

## 📖 How to Use

### First-Time Setup

1. **Click the FocusGuard+ icon** in your Chrome toolbar
2. **Click "⚙️ Settings"** to configure:
   - Set your work hours (e.g., 9:00 AM - 5:00 PM)
   - Add websites to block (e.g., facebook.com, twitter.com, youtube.com)
   - Choose your unlock mode (Strict or Lenient)
   - Set daily reset time (default: 6:00 AM)
3. **Save Settings**

### Daily Workflow

1. **Plan Your Day**
   - Click the extension icon
   - Click "📋 Open ABCDE Planner"
   - Add your tasks with appropriate priorities:
     - **A**: Critical deadlines, important meetings
     - **B**: Important but not urgent tasks
     - **C**: Nice-to-have tasks
     - **D**: Tasks you should delegate
     - **E**: Time-wasters to eliminate

2. **Start Working**
   - During work hours, distracting sites are blocked
   - If you try to access a blocked site, you'll see:
     - A motivational quote
     - Your remaining tasks
     - Encouragement to stay focused

3. **Complete Tasks**
   - Check off tasks as you complete them
   - Watch your progress bars fill up!
   - **Early Unlock**: Complete all tasks before work hours end? Automatic unlock! 🎉

4. **Track Your Progress**
   - View your daily streak
   - See task breakdown by priority
   - Monitor your productivity stats

### Understanding Unlock Modes

#### Standard Mode
- Sites blocked during work hours
- Sites accessible outside work hours
- Early unlock when all tasks complete

#### Strict Mode ⚡
- Sites blocked ALL DAY until tasks complete
- Even outside work hours
- Only way to unlock: finish your plan

#### Lenient Mode 🎯
- Complete only A-tasks to unlock everything
- Perfect for focusing on critical work
- B/C/D/E tasks become optional

## 🎨 Screenshots

### Dashboard
View your daily progress, streak, and task breakdown at a glance.

### ABCDE Planner
Plan your day with the proven ABCDE priority system.

### Block Screen
Stay motivated with inspiring quotes when you're tempted to visit distracting sites.

## 🛠️ Configuration Options

### Work Hours
- **Enabled**: Toggle work hours blocking on/off
- **Start Time**: When blocking should begin (e.g., 09:00)
- **End Time**: When blocking should end (e.g., 17:00)

### Blocked Websites
Add websites one per line. Supports wildcards:
```
facebook.com
*.twitter.com
youtube.com
reddit.com
```

### Unlock Modes
- **Strict Mode**: Block outside work hours until tasks complete
- **Lenient Mode**: Unlock after completing only A-tasks

### Daily Reset
- **Reset Time**: When to clear all tasks (default: 06:00)
- Tasks automatically reset every morning

## 🧠 The ABCDE Method Explained

The ABCDE method comes from Brian Tracy's bestselling book "Eat That Frog!"

### Priority Definitions

**A - Must Do** 🔴
- Most important tasks
- Serious consequences if not done
- Do these FIRST
- Example: Project deadline today, critical client meeting

**B - Should Do** 🟠
- Important but less critical than A
- Mild consequences if not done
- Do after all A tasks
- Example: Respond to non-urgent emails, routine reports

**C - Nice to Do** 🟡
- Would be nice but no real consequences
- Do only after A and B are done
- Example: Organize desk, browse industry news

**D - Delegate** 🟢
- Someone else should do this
- Free up your time for A/B tasks
- Example: Administrative tasks, routine data entry

**E - Eliminate** ⚪
- Shouldn't be done at all
- Time wasters
- Learn to say NO!
- Example: Unnecessary meetings, busywork

### The Golden Rule
> "Never do a B task when an A task is left undone. Never do a C task when a B task is left undone."
>
> — Brian Tracy

## 💡 Productivity Tips

1. **Start with A Tasks** - "Eat that frog" first thing in the morning
2. **Limit Your A Tasks** - Only 1-3 truly critical tasks per day
3. **Be Honest** - Don't label everything as "A" priority
4. **Review Daily** - Update your plan as priorities shift
5. **Build Streaks** - Consistency beats intensity
6. **Celebrate Wins** - Completed early? Enjoy your unlocked access!

## 🔒 Privacy & Permissions

FocusGuard+ requires these permissions:

- **storage**: Store your tasks and settings locally
- **alarms**: Schedule daily resets and unlock checks
- **tabs**: Detect when you visit blocked sites
- **declarativeNetRequest**: Block specified websites
- **webNavigation**: Redirect to block screen

### Your Data
- All data stored **locally** on your device
- No cloud sync or external servers
- No tracking or analytics
- Your tasks and settings are 100% private

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- **Brian Tracy** - ABCDE Method from "Eat That Frog!"
- **Motivational Quotes** - Various productivity authors and thought leaders
- Built with ❤️ for productivity enthusiasts

## 📧 Support

Having issues? Found a bug?
- Open an issue on GitHub
- Check existing issues for solutions
- Contribute a fix via Pull Request

## 🎯 Roadmap

Future enhancements planned:
- [ ] Dark mode theme
- [ ] Pomodoro timer integration
- [ ] Cloud sync for tasks
- [ ] Mobile companion app
- [ ] Integration with Google Tasks/Todoist
- [ ] AI-powered task prioritization
- [ ] Weekly/monthly analytics
- [ ] Custom quote collections

---

**Stay focused. Complete your plan. Unlock early!** 💪

*"The hardest part of any important task is getting started on it in the first place." — Brian Tracy*
