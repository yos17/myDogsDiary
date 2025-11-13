# Quick Setup Guide for FocusGuard+

## Prerequisites
- Google Chrome (version 88 or higher)
- Basic understanding of browser extensions

## Installation Steps

### 1. Download/Clone Repository
```bash
git clone https://github.com/yourusername/focusguard-plus.git
cd focusguard-plus
```

### 2. Add Extension Icons (Important!)
Before loading the extension, you need to add icon files:
- Navigate to `assets/icons/`
- Add these PNG files:
  - `icon16.png` (16×16 px)
  - `icon32.png` (32×32 px)
  - `icon48.png` (48×48 px)
  - `icon128.png` (128×128 px)

See `assets/icons/README.md` for icon design guidelines.

**Temporary Solution**: You can temporarily comment out the `icons` and `action.default_icon` sections in `manifest.json` to test without icons.

### 3. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`

2. Enable **Developer Mode**:
   - Toggle the switch in the top-right corner

3. Click **"Load unpacked"**:
   - Select the `focusguard-plus` folder (the root directory)

4. The extension should now appear in your extensions list!

### 4. Pin the Extension (Optional)
- Click the puzzle piece icon in Chrome toolbar
- Find "FocusGuard+" in the list
- Click the pin icon to keep it visible

## Initial Configuration

### Step 1: Configure Work Hours
1. Click the FocusGuard+ icon in toolbar
2. Click "⚙️ Settings"
3. Set your work hours:
   - Example: Start 09:00, End 17:00
   - Check "Enable work hours blocking"

### Step 2: Add Blocked Sites
In the Settings tab, add websites to block (one per line):
```
facebook.com
twitter.com
youtube.com
reddit.com
instagram.com
tiktok.com
```

You can use wildcards:
```
*.facebook.com
*.reddit.com
```

### Step 3: Choose Your Mode
- **Standard Mode**: Block only during work hours
- **Strict Mode**: Block all day until tasks complete
- **Lenient Mode**: Unlock after completing only A-tasks

### Step 4: Set Daily Reset Time
- Default: 06:00 AM
- All tasks clear at this time each day
- Adjust based on when your day starts

### Step 5: Save Settings
Click "💾 Save Settings"

## First Day Usage

### Morning Routine
1. Click FocusGuard+ icon
2. Click "📋 Open ABCDE Planner"
3. Add your tasks for the day:

**Example A Tasks** (Critical):
- Complete project proposal (due today)
- Attend client meeting at 2 PM

**Example B Tasks** (Important):
- Review team's pull requests
- Update documentation

**Example C Tasks** (Nice to have):
- Organize email inbox
- Read industry article

**Example D Tasks** (Delegate):
- Ask intern to update spreadsheet

**Example E Tasks** (Eliminate):
- Skip unnecessary status meeting

### During Work Hours
- Blocked sites will show motivational quotes
- You'll see your task progress
- Complete tasks to unlock early!

### End of Day
- Check off all completed tasks
- Build your streak! 🔥
- Tasks automatically reset tomorrow morning

## Troubleshooting

### Extension Doesn't Load
- Make sure you selected the correct folder (containing manifest.json)
- Check for icon files (or comment them out temporarily)
- Look for errors in `chrome://extensions/` under the extension

### Sites Not Blocking
1. Check Settings:
   - Are blocked sites listed?
   - Is current time within work hours?
   - Is work hours blocking enabled?

2. Refresh extension:
   - Go to `chrome://extensions/`
   - Click the refresh icon on FocusGuard+

3. Check browser console:
   - Right-click extension icon → Inspect popup
   - Look for errors in Console tab

### Tasks Not Saving
1. Check storage permissions in manifest.json
2. Open DevTools → Application → Storage
3. Clear extension storage and try again

### Early Unlock Not Working
1. Make sure all required tasks are checked
2. In Lenient Mode: Only A-tasks need completion
3. Otherwise: All tasks must be complete
4. Check console for errors

## Testing the Extension

### Test Blocking
1. Add "google.com" to blocked sites (temporarily)
2. Save settings
3. Try visiting google.com
4. You should see the block screen with a quote

### Test Early Unlock
1. Set work hours to include current time
2. Add one A-priority task
3. Complete the task (check it off)
4. Try accessing a blocked site
5. Should unlock if in Lenient Mode

### Test Daily Reset
1. Set reset time to 1 minute in the future
2. Add a task
3. Wait for reset time
4. Task should disappear

## Advanced Configuration

### Custom Quote Authors
To limit quotes to specific authors:
1. Open `src/js/storage.js`
2. Modify the `getRandomQuote()` function
3. Add your preferred authors to filter

### Modify Block Screen
- Edit `src/block/block.html` for structure
- Edit `src/block/block.css` for styling
- Edit `src/block/block.js` for functionality

### Add More Quotes
1. Open `src/data/quotes.json`
2. Add new quote objects:
```json
{
  "text": "Your quote here",
  "author": "Author Name"
}
```

## Getting Help

- Check the main [README.md](README.md) for detailed documentation
- Look for error messages in Chrome DevTools console
- Verify all files are present in the correct directories

## File Structure
```
focusguard-plus/
├── manifest.json           # Extension configuration
├── rules.json             # Blocking rules
├── README.md              # Full documentation
├── LICENSE                # MIT License
├── assets/
│   └── icons/            # Extension icons (add these!)
├── src/
│   ├── block/            # Block screen
│   │   ├── block.html
│   │   ├── block.css
│   │   └── block.js
│   ├── popup/            # Extension popup/dashboard
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── planner/          # ABCDE planner interface
│   │   ├── planner.html
│   │   ├── planner.css
│   │   └── planner.js
│   ├── data/
│   │   └── quotes.json   # Motivational quotes
│   └── js/
│       ├── storage.js    # Storage management
│       └── background.js # Service worker
```

---

🎯 **Ready to boost your productivity? Start using FocusGuard+ today!**
