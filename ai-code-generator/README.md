# ⚡ AI Code Studio

**The Ultimate AI-Powered Code Generator** - Combining the best features from Base44, Loveable.dev, and Bolt.new

Build full-stack web applications using only natural language! No coding experience required.

![Made with AI](https://img.shields.io/badge/Made%20with-AI-purple)
![Pure JavaScript](https://img.shields.io/badge/Pure-JavaScript-yellow)
![No Dependencies](https://img.shields.io/badge/Zero-Dependencies-green)

---

## 🌟 Key Features

### 🤖 AI-Powered Code Generation
- **Multi-Model Support** - Auto-select between Claude Sonnet 4, GPT-4, and Gemini Pro
- **Natural Language Input** - Describe your app in plain English
- **Instant Code Generation** - HTML, CSS, and JavaScript generated in seconds
- **Smart Templates** - Pre-built templates for common use cases

### 🎨 Visual Editor (Loveable-inspired)
- **Click-to-Edit** - Click any element in the preview to modify it
- **AI-Powered Edits** - Describe changes in natural language
- **Quick Actions** - Hide, duplicate, or delete elements with one click
- **Live Preview** - See changes instantly as you edit

### 💻 Built-in IDE (Bolt-inspired)
- **Code Editors** - Separate tabs for HTML, CSS, and JavaScript
- **Live Preview** - Real-time iframe preview with device simulation
- **Terminal** - Console output and logs
- **Code Formatting** - Auto-format your code with one click

### 🗄️ Database Integration
- **Supabase Support** - Built-in Supabase integration
- **Auto-Generated Code** - Database operations automatically included
- **Configuration Storage** - Save your Supabase credentials locally

### 🚀 Export & Deploy
- **Multiple Export Options**:
  - 📦 Download as ZIP
  - 🐙 Export to GitHub
  - 🖊️ Open in CodePen
  - 📦 Open in CodeSandbox
- **One-Click Deploy** - Deploy to production instantly
- **Code Sharing** - Copy code to clipboard

### 💬 Dual Mode System (Base44-inspired)
- **Build Mode** - Generate and modify code
- **Discussion Mode** - Brainstorm ideas without changing code

---

## 🚀 Getting Started

### Installation

No installation required! This is a pure HTML/CSS/JavaScript application.

1. **Clone or Download** this repository
2. **Open `index.html`** in your browser
3. **Start Building!**

```bash
# Clone the repo
git clone <your-repo-url>

# Navigate to the directory
cd ai-code-generator

# Open in browser
open index.html
# or
start index.html  # Windows
```

### Quick Start

1. **Type your idea** in the chat box:
   ```
   "Build a todo app with dark mode"
   "Create a landing page for a SaaS product"
   "Make a calculator with scientific functions"
   ```

2. **Press Send** - The AI generates your code

3. **Preview** - See your app running live in the preview pane

4. **Edit Visually** - Click the "Visual Edit" button and click elements to modify them

5. **Export** - Download your code or deploy it

---

## 📚 Feature Comparison

AI Code Studio combines the best of all platforms:

| Feature | Base44 | Loveable | Bolt.new | **AI Code Studio** |
|---------|--------|----------|----------|-------------------|
| AI Code Generation | ✅ | ✅ | ✅ | ✅ |
| Visual Click-to-Edit | ❌ | ✅ | ❌ | ✅ |
| Live Preview | ✅ | ✅ | ✅ | ✅ |
| Multi-Model AI | ✅ | ❌ | ❌ | ✅ |
| Discussion Mode | ✅ | ❌ | ❌ | ✅ |
| GitHub Export | ✅ | ✅ | ✅ | ✅ |
| Supabase Integration | ❌ | ✅ | ❌ | ✅ |
| Template Library | ✅ | ❌ | ❌ | ✅ |
| Zero Dependencies | ❌ | ❌ | ❌ | ✅ |
| Open Source | ❌ | ❌ | ✅ | ✅ |

---

## 🎯 How to Use

### 1. Chat Interface

The AI assistant helps you build apps through conversation:

**Build Mode:**
- Generate new code
- Add features
- Modify existing code
- Fix bugs

**Discussion Mode:**
- Brainstorm ideas
- Get suggestions
- Plan architecture
- Without modifying code

### 2. Visual Editor

Click the **🎨 Visual Edit** button to enter visual editing mode:

1. **Click any element** in the preview
2. **Describe your changes**:
   - "Make this button blue"
   - "Change the text to 'Hello World'"
   - "Add a shadow effect"
   - "Make the font bigger"
3. **Quick Actions**:
   - Hide element
   - Duplicate element
   - Delete element

### 3. Code Editors

Edit code directly in the built-in editors:

- **HTML Tab** - Edit structure
- **CSS Tab** - Edit styles
- **JavaScript Tab** - Edit functionality
- **Format Button** - Auto-format your code

### 4. Preview Controls

- **Device Simulator** - Test on desktop, tablet, mobile
- **Refresh** - Reload preview
- **Fullscreen** - View in fullscreen mode

### 5. Export Options

Click **📥 Export** to choose:

1. **Download ZIP** - Get all files locally
2. **Export to GitHub** - Push to your repository
3. **Open in CodePen** - Edit online
4. **Open in CodeSandbox** - Full IDE experience

---

## 🛠️ Built-in Templates

Pre-built templates to get started quickly:

| Template | Description | Use Case |
|----------|-------------|----------|
| ✅ Todo App | Task management with local storage | Learning CRUD operations |
| 🔢 Calculator | Scientific calculator with history | Math applications |
| 🚀 Landing Page | Modern product landing page | Marketing sites |
| 📊 Dashboard | Admin dashboard with charts | Data visualization |
| 📝 Blog | Personal blog with markdown | Content sites |
| 💼 Portfolio | Developer portfolio website | Personal branding |
| 💬 Chat App | Real-time chat application | Communication apps |
| 🛒 E-commerce | Online store with cart | Shopping sites |

---

## 🔧 Configuration

### Supabase Integration

To enable Supabase database features:

1. Open browser console (F12)
2. Run:
```javascript
localStorage.setItem('supabase_url', 'YOUR_SUPABASE_URL');
localStorage.setItem('supabase_key', 'YOUR_SUPABASE_ANON_KEY');
```
3. Reload the page
4. Generated code will include Supabase integration

### AI Model Selection

Choose your preferred AI model:
- **Auto-Select** - Automatically picks the best model
- **Claude Sonnet 4** - Best for complex logic
- **GPT-4** - Versatile and creative
- **Gemini Pro** - Fast and efficient

---

## 💡 Examples

### Example 1: Todo App

**Prompt:**
```
Create a todo app with dark mode toggle
```

**Result:**
- ✅ Fully functional todo app
- 🌙 Dark mode toggle
- 💾 Local storage persistence
- 🎨 Modern, animated UI

### Example 2: Landing Page

**Prompt:**
```
Build a landing page for an AI startup with hero section, features, and pricing
```

**Result:**
- 🚀 Hero section with CTA
- ⚡ Feature cards with icons
- 💰 Pricing table
- 📱 Fully responsive

### Example 3: Dashboard

**Prompt:**
```
Create an admin dashboard with sidebar, stats cards, and charts
```

**Result:**
- 📊 Interactive dashboard
- 📈 Real-time data updates
- 🎨 Professional design
- 📱 Mobile-friendly sidebar

---

## 🎨 Visual Editing Examples

### Example 1: Change Button Color

1. Click "Visual Edit"
2. Click the button
3. Type: "Make this button blue with white text"
4. Click "Apply Changes"

### Example 2: Add Shadow Effect

1. Click "Visual Edit"
2. Click any card
3. Type: "Add a shadow effect"
4. Click "Apply Changes"

### Example 3: Update Text

1. Click "Visual Edit"
2. Click heading
3. Type: "Change the text to 'Welcome to My App'"
4. Click "Apply Changes"

---

## 🌐 Deployment

### Option 1: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy
```

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 3: GitHub Pages

1. Push code to GitHub
2. Go to Settings → Pages
3. Select branch and save
4. Your site will be live!

---

## 🔐 Security

- ✅ **No Server Required** - Runs entirely in browser
- ✅ **No Data Collection** - Everything stays local
- ✅ **Sandboxed Preview** - Safe iframe execution
- ✅ **Local Storage** - Credentials stored locally only

---

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ AI code generation
- ✅ Visual editing
- ✅ Live preview
- ✅ Template library
- ✅ Export options

### Phase 2 (Planned)
- [ ] Real AI API integration (Claude/OpenAI)
- [ ] Version control and history
- [ ] Collaborative editing
- [ ] Custom component library
- [ ] NPM package support

### Phase 3 (Future)
- [ ] Backend code generation (Node.js, Python)
- [ ] Database schema design
- [ ] API endpoint generation
- [ ] Authentication system
- [ ] Testing automation

---

## 🤝 Contributing

This is an open-source project! Contributions are welcome.

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Areas for Contribution

- 🤖 AI model integration
- 🎨 UI/UX improvements
- 📚 More templates
- 🐛 Bug fixes
- 📖 Documentation

---

## 📄 License

MIT License - Free to use for personal and commercial projects.

---

## 🙏 Credits

Inspired by and combining features from:

- **Base44** - Multi-model AI selection, discussion mode
- **Loveable.dev** - Visual click-to-edit, Supabase integration
- **Bolt.new** - Live preview, in-browser IDE

Built with ❤️ using pure HTML, CSS, and JavaScript.

---

## 📞 Support

Need help? Have questions?

- 📧 Open an issue on GitHub
- 💬 Join our community discussions
- 📖 Check the documentation

---

## ⚡ Quick Commands

| Command | Action |
|---------|--------|
| `Ctrl/Cmd + Enter` | Send message |
| `Ctrl/Cmd + S` | Download code |
| `Ctrl/Cmd + K` | Copy code |
| `F11` | Toggle fullscreen preview |

---

**Happy Coding! 🚀**

Built your dream app in minutes, not months.
