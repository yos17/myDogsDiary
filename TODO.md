# TODO for FocusGuard+ Extension

## ⚠️ Before First Use

### Required: Add Extension Icons
The extension requires PNG icon files to load properly in Chrome:

**Location**: `assets/icons/`

**Required files**:
- `icon16.png` (16×16 pixels)
- `icon32.png` (32×32 pixels)
- `icon48.png` (48×48 pixels)
- `icon128.png` (128×128 pixels)

**Design specs**:
- Purple gradient background (#667eea to #764ba2)
- Target/bullseye 🎯 symbol
- Clean, minimal design
- High contrast for visibility

**Quick solutions**:
1. Use an online icon generator (realfavicongenerator.net)
2. Create in Figma/Canva/Photoshop
3. Use AI tools (DALL-E, Midjourney)
4. For testing: Comment out icon references in manifest.json

See `assets/icons/README.md` for more details.

## 🚀 Future Enhancements

### High Priority
- [ ] Add proper extension icons
- [ ] Test on multiple browsers (Firefox, Edge)
- [ ] Add onboarding tutorial for first-time users
- [ ] Implement data export/import feature

### Medium Priority
- [ ] Dark mode theme
- [ ] Pomodoro timer integration
- [ ] Custom color themes
- [ ] Sound notifications for task completion
- [ ] Browser notifications for reminders

### Low Priority
- [ ] Cloud sync for tasks
- [ ] Mobile companion app
- [ ] Integration with Google Tasks/Todoist/Notion
- [ ] AI-powered task prioritization suggestions
- [ ] Weekly/monthly analytics dashboard
- [ ] Custom quote collections by category

## 🐛 Known Issues

- Extension icons missing (needs to be added manually)
- No error handling for corrupted storage
- Block screen may flash briefly before redirect

## 📝 Documentation Needed

- [ ] Video tutorial for setup
- [ ] Screenshots for README
- [ ] FAQ section
- [ ] Troubleshooting guide expansion

## 🔧 Code Improvements

- [ ] Add TypeScript for better type safety
- [ ] Implement automated tests (Jest)
- [ ] Add ESLint for code quality
- [ ] Optimize storage operations
- [ ] Add error boundary components
- [ ] Implement retry logic for failed operations

## 📦 Distribution

- [ ] Submit to Chrome Web Store
- [ ] Create Firefox version
- [ ] Create Edge version
- [ ] Set up automated builds
- [ ] Version management strategy
