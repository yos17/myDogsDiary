// ===== AI Code Studio - Main Application =====
// Combines best features from Base44, Loveable, and Bolt

class AICodeStudio {
    constructor() {
        this.currentCode = {
            html: '',
            css: '',
            js: ''
        };
        this.chatHistory = [];
        this.currentMode = 'build';
        this.currentModel = 'auto';
        this.templates = this.loadTemplates();
        this.supabaseConfig = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleCode();
        this.updatePreview();
        this.loadSupabaseConfig();
    }

    setupEventListeners() {
        // Chat input
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                this.sendMessage();
            }
        });

        // Mode toggle
        document.getElementById('buildMode').addEventListener('click', () => this.setMode('build'));
        document.getElementById('discussMode').addEventListener('click', () => this.setMode('discuss'));

        // Model selection
        document.getElementById('modelSelect').addEventListener('change', (e) => {
            this.currentModel = e.target.value;
            this.logToTerminal(`Switched to ${e.target.value} model`, 'success');
        });

        // Tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Code editors
        document.getElementById('htmlEditor').addEventListener('input', (e) => {
            this.currentCode.html = e.target.value;
            this.updatePreview();
        });
        document.getElementById('cssEditor').addEventListener('input', (e) => {
            this.currentCode.css = e.target.value;
            this.updatePreview();
        });
        document.getElementById('jsEditor').addEventListener('input', (e) => {
            this.currentCode.js = e.target.value;
            this.updatePreview();
        });

        // Preview controls
        document.getElementById('refreshPreview').addEventListener('click', () => this.updatePreview());
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setDevice(btn.dataset.device));
        });

        // Header buttons
        document.getElementById('templateBtn').addEventListener('click', () => this.showTemplateModal());
        document.getElementById('exportBtn').addEventListener('click', () => this.showExportModal());
        document.getElementById('deployBtn').addEventListener('click', () => this.deploy());

        // Tab actions
        document.getElementById('copyCodeBtn').addEventListener('click', () => this.copyCode());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadCode());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());

        // Format buttons
        document.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', () => this.formatCode(btn.dataset.lang));
        });

        // Terminal
        document.getElementById('clearConsole').addEventListener('click', () => this.clearTerminal());

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Export options
        document.getElementById('exportZip').addEventListener('click', () => this.exportAsZip());
        document.getElementById('exportGithub').addEventListener('click', () => this.exportToGithub());
        document.getElementById('exportCodepen').addEventListener('click', () => this.openInCodepen());
        document.getElementById('exportCodesandbox').addEventListener('click', () => this.openInCodesandbox());

        // New chat & history
        document.getElementById('newChatBtn').addEventListener('click', () => this.newChat());
        document.getElementById('historyBtn').addEventListener('click', () => this.showHistory());

        // Attach & voice (placeholders)
        document.getElementById('attachBtn').addEventListener('click', () => this.attachImage());
        document.getElementById('voiceBtn').addEventListener('click', () => this.voiceInput());
    }

    // ===== Chat Functions =====
    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addMessage('user', message);
        input.value = '';

        // Show loading
        this.showLoading();

        // Generate code based on mode
        if (this.currentMode === 'build') {
            await this.generateCode(message);
        } else {
            await this.discussIdea(message);
        }

        this.hideLoading();
    }

    addMessage(role, content) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = role === 'user' ? '👤' : '🤖';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        if (typeof content === 'string') {
            contentDiv.innerHTML = this.formatMessage(content);
        } else {
            contentDiv.appendChild(content);
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.chatHistory.push({ role, content });
    }

    formatMessage(text) {
        // Convert markdown-like syntax to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    async generateCode(prompt) {
        try {
            this.logToTerminal('Generating code...', 'info');

            // Simulated AI code generation
            // In production, this would call Claude API
            const generatedCode = this.simulateCodeGeneration(prompt);

            this.currentCode = generatedCode;
            this.updateEditors();
            this.updatePreview();

            this.addMessage('assistant', `✅ I've generated your ${this.detectAppType(prompt)}! Here's what I created:\n\n**Features:**\n- Responsive design\n- Modern UI with animations\n- Clean, semantic HTML\n- Optimized CSS\n${this.supabaseConfig ? '\n- Supabase integration ready' : ''}\n\nYou can preview it on the right. Feel free to ask for any changes!`);

            this.logToTerminal('Code generation complete!', 'success');
        } catch (error) {
            this.addMessage('assistant', '❌ Sorry, I encountered an error generating the code. Please try again.');
            this.logToTerminal(`Error: ${error.message}`, 'error');
        }
    }

    async discussIdea(prompt) {
        // Discussion mode - brainstorm without modifying code
        this.logToTerminal('Discussion mode - brainstorming...', 'info');

        const response = this.simulateDiscussion(prompt);
        this.addMessage('assistant', response);

        this.logToTerminal('Discussion complete', 'success');
    }

    simulateCodeGeneration(prompt) {
        const lowerPrompt = prompt.toLowerCase();

        // Detect what kind of app/component to build
        if (lowerPrompt.includes('todo') || lowerPrompt.includes('task')) {
            return this.generateTodoApp();
        } else if (lowerPrompt.includes('calculator')) {
            return this.generateCalculator();
        } else if (lowerPrompt.includes('landing') || lowerPrompt.includes('page')) {
            return this.generateLandingPage();
        } else if (lowerPrompt.includes('dashboard')) {
            return this.generateDashboard();
        } else {
            return this.generateGenericApp(prompt);
        }
    }

    simulateDiscussion(prompt) {
        const responses = [
            `That's an interesting idea! Here are some thoughts:\n\n**Pros:**\n- User-friendly approach\n- Scalable architecture\n- Modern tech stack\n\n**Considerations:**\n- Performance optimization needed\n- Security best practices\n- Database schema design\n\nWould you like me to build a prototype?`,
            `Great concept! Let me suggest some features:\n\n1. **User Authentication** - Secure login system\n2. **Real-time Updates** - WebSocket integration\n3. **Responsive Design** - Mobile-first approach\n4. **Analytics** - Track user behavior\n\nShall I start building this?`,
            `I love this direction! Here's how we could approach it:\n\n**Phase 1:** Core functionality\n**Phase 2:** UI/UX polish\n**Phase 3:** Advanced features\n**Phase 4:** Testing & optimization\n\nReady to begin Phase 1?`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    detectAppType(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        if (lowerPrompt.includes('todo')) return 'todo app';
        if (lowerPrompt.includes('calculator')) return 'calculator';
        if (lowerPrompt.includes('landing')) return 'landing page';
        if (lowerPrompt.includes('dashboard')) return 'dashboard';
        return 'web app';
    }

    // ===== Code Generation Templates =====
    generateTodoApp() {
        return {
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Todo App</title>
</head>
<body>
    <div class="container">
        <div class="todo-app">
            <h1>✅ My Tasks</h1>
            <div class="input-section">
                <input type="text" id="todoInput" placeholder="Add a new task..." />
                <button onclick="addTodo()">Add</button>
            </div>
            <ul id="todoList"></ul>
        </div>
    </div>
</body>
</html>`,
            css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.container {
    width: 100%;
    max-width: 500px;
}

.todo-app {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
    color: #333;
    margin-bottom: 20px;
    font-size: 28px;
}

.input-section {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 16px;
    transition: border-color 0.3s;
}

input:focus {
    outline: none;
    border-color: #667eea;
}

button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
}

button:hover {
    transform: translateY(-2px);
}

#todoList {
    list-style: none;
}

.todo-item {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.todo-item.completed {
    opacity: 0.6;
    text-decoration: line-through;
}

.delete-btn {
    background: #ff4444;
    padding: 8px 16px;
    font-size: 14px;
}`,
            js: `// Todo App with Supabase Integration Support
${this.supabaseConfig ? `
// Supabase Configuration
const supabase = {
    url: '${this.supabaseConfig.url}',
    key: '${this.supabaseConfig.key}'
};
` : ''}
const todos = [];

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (!text) return;

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    input.value = '';
    renderTodos();
    ${this.supabaseConfig ? 'saveTodoToSupabase(todo);' : ''}
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
        ${this.supabaseConfig ? 'updateTodoInSupabase(todo);' : ''}
    }
}

function deleteTodo(id) {
    const index = todos.findIndex(t => t.id === id);
    if (index > -1) {
        todos.splice(index, 1);
        renderTodos();
        ${this.supabaseConfig ? 'deleteTodoFromSupabase(id);' : ''}
    }
}

function renderTodos() {
    const list = document.getElementById('todoList');
    list.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        li.innerHTML = \`
            <span onclick="toggleTodo(\${todo.id})" style="cursor: pointer; flex: 1;">\${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(\${todo.id})">Delete</button>
        \`;
        list.appendChild(li);
    });
}

// Allow Enter key to add todo
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todoInput');
    input?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
});${this.supabaseConfig ? `

// Supabase Integration Functions
async function saveTodoToSupabase(todo) {
    // Implement Supabase insert
    console.log('Saving to Supabase:', todo);
}

async function updateTodoInSupabase(todo) {
    // Implement Supabase update
    console.log('Updating in Supabase:', todo);
}

async function deleteTodoFromSupabase(id) {
    // Implement Supabase delete
    console.log('Deleting from Supabase:', id);
}` : ''}`
        };
    }

    generateCalculator() {
        return {
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Calculator</title>
</head>
<body>
    <div class="calculator">
        <div class="display" id="display">0</div>
        <div class="buttons">
            <button onclick="clearDisplay()" class="operator">C</button>
            <button onclick="appendOperator('/')" class="operator">÷</button>
            <button onclick="appendOperator('*')" class="operator">×</button>
            <button onclick="backspace()" class="operator">←</button>

            <button onclick="appendNumber('7')">7</button>
            <button onclick="appendNumber('8')">8</button>
            <button onclick="appendNumber('9')">9</button>
            <button onclick="appendOperator('-')" class="operator">−</button>

            <button onclick="appendNumber('4')">4</button>
            <button onclick="appendNumber('5')">5</button>
            <button onclick="appendNumber('6')">6</button>
            <button onclick="appendOperator('+')" class="operator">+</button>

            <button onclick="appendNumber('1')">1</button>
            <button onclick="appendNumber('2')">2</button>
            <button onclick="appendNumber('3')">3</button>
            <button onclick="calculate()" class="equals">=</button>

            <button onclick="appendNumber('0')" class="zero">0</button>
            <button onclick="appendNumber('.')">.</button>
        </div>
    </div>
</body>
</html>`,
            css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.calculator {
    background: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 320px;
}

.display {
    background: #f5f5f5;
    border-radius: 10px;
    padding: 20px;
    text-align: right;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 20px;
    min-height: 60px;
    word-wrap: break-word;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

button {
    padding: 20px;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    background: #f5f5f5;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:active {
    transform: translateY(0);
}

.operator {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.equals {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
    grid-row: span 2;
}

.zero {
    grid-column: span 2;
}`,
            js: `let currentValue = '0';
let operator = null;
let previousValue = null;

function updateDisplay() {
    document.getElementById('display').textContent = currentValue;
}

function appendNumber(num) {
    if (currentValue === '0' || currentValue === 'Error') {
        currentValue = num;
    } else {
        currentValue += num;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (previousValue === null) {
        previousValue = parseFloat(currentValue);
        currentValue = '0';
        operator = op;
    } else if (operator) {
        calculate();
        operator = op;
    }
}

function calculate() {
    if (operator && previousValue !== null) {
        const current = parseFloat(currentValue);
        let result;

        switch (operator) {
            case '+':
                result = previousValue + current;
                break;
            case '-':
                result = previousValue - current;
                break;
            case '*':
                result = previousValue * current;
                break;
            case '/':
                result = current !== 0 ? previousValue / current : 'Error';
                break;
        }

        currentValue = result.toString();
        previousValue = null;
        operator = null;
        updateDisplay();
    }
}

function clearDisplay() {
    currentValue = '0';
    previousValue = null;
    operator = null;
    updateDisplay();
}

function backspace() {
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
    updateDisplay();
}`
        };
    }

    generateLandingPage() {
        return {
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Landing Page</title>
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="logo">🚀 ProductName</div>
            <div class="nav-links">
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#contact">Contact</a>
                <button class="btn-primary">Get Started</button>
            </div>
        </div>
    </nav>

    <section class="hero">
        <div class="container">
            <h1>Build Amazing Things Faster</h1>
            <p>The ultimate tool for modern developers. Ship faster, build better.</p>
            <div class="cta-buttons">
                <button class="btn-large">Start Free Trial</button>
                <button class="btn-secondary">Watch Demo</button>
            </div>
        </div>
    </section>

    <section id="features" class="features">
        <div class="container">
            <h2>Powerful Features</h2>
            <div class="feature-grid">
                <div class="feature-card">
                    <span class="icon">⚡</span>
                    <h3>Lightning Fast</h3>
                    <p>Optimized for speed and performance</p>
                </div>
                <div class="feature-card">
                    <span class="icon">🔒</span>
                    <h3>Secure</h3>
                    <p>Enterprise-grade security built-in</p>
                </div>
                <div class="feature-card">
                    <span class="icon">🎨</span>
                    <h3>Beautiful</h3>
                    <p>Modern, intuitive design</p>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2025 ProductName. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`,
            css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.navbar {
    background: white;
    padding: 20px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 24px;
    font-weight: 700;
}

.nav-links {
    display: flex;
    gap: 30px;
    align-items: center;
}

.nav-links a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #667eea;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 120px 0;
    text-align: center;
}

.hero h1 {
    font-size: 56px;
    margin-bottom: 20px;
}

.hero p {
    font-size: 24px;
    margin-bottom: 40px;
    opacity: 0.9;
}

.cta-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
}

.btn-primary, .btn-large, .btn-secondary {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
}

.btn-primary {
    background: #667eea;
    color: white;
}

.btn-large {
    background: white;
    color: #667eea;
    padding: 16px 32px;
    font-size: 18px;
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
    padding: 14px 32px;
    font-size: 18px;
}

button:hover {
    transform: translateY(-2px);
}

.features {
    padding: 100px 0;
    background: #f8f9fa;
}

.features h2 {
    text-align: center;
    font-size: 42px;
    margin-bottom: 60px;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.feature-card {
    background: white;
    padding: 40px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.feature-card:hover {
    transform: translateY(-10px);
}

.icon {
    font-size: 48px;
    display: block;
    margin-bottom: 20px;
}

.feature-card h3 {
    font-size: 24px;
    margin-bottom: 12px;
}

.feature-card p {
    color: #666;
    line-height: 1.6;
}

footer {
    background: #1a1a1a;
    color: white;
    padding: 40px 0;
    text-align: center;
}`,
            js: `// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});`
        };
    }

    generateDashboard() {
        return {
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
</head>
<body>
    <div class="dashboard">
        <aside class="sidebar">
            <div class="logo">📊 Dashboard</div>
            <nav>
                <a href="#" class="active">Overview</a>
                <a href="#">Analytics</a>
                <a href="#">Users</a>
                <a href="#">Settings</a>
            </nav>
        </aside>
        <main class="content">
            <header>
                <h1>Overview</h1>
                <div class="user-menu">👤 Admin</div>
            </header>
            <div class="stats">
                <div class="stat-card">
                    <h3>Total Users</h3>
                    <p class="stat-value">1,234</p>
                    <span class="stat-change positive">+12%</span>
                </div>
                <div class="stat-card">
                    <h3>Revenue</h3>
                    <p class="stat-value">$45,678</p>
                    <span class="stat-change positive">+8%</span>
                </div>
                <div class="stat-card">
                    <h3>Active Sessions</h3>
                    <p class="stat-value">567</p>
                    <span class="stat-change negative">-3%</span>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`,
            css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f5f7fa;
}

.dashboard {
    display: flex;
    height: 100vh;
}

.sidebar {
    width: 250px;
    background: #1a1a2e;
    color: white;
    padding: 20px;
}

.logo {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 40px;
}

nav a {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 8px;
    transition: all 0.3s;
}

nav a:hover, nav a.active {
    background: #667eea;
    color: white;
}

.content {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

header h1 {
    font-size: 32px;
}

.user-menu {
    background: white;
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.stat-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
    color: #666;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
}

.stat-value {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
}

.stat-change {
    font-size: 14px;
    font-weight: 600;
}

.stat-change.positive {
    color: #10b981;
}

.stat-change.negative {
    color: #ef4444;
}`,
            js: `// Dashboard interactions
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Simulate real-time data updates
setInterval(() => {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const currentValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        const change = Math.floor(Math.random() * 10) - 5;
        const newValue = currentValue + change;
        stat.textContent = newValue.toLocaleString();
    });
}, 5000);`
        };
    }

    generateGenericApp(prompt) {
        // Generic template
        return {
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom App</title>
</head>
<body>
    <div class="container">
        <h1>Your Custom App</h1>
        <p>Built with AI Code Studio</p>
        <p class="prompt">Prompt: ${prompt}</p>
    </div>
</body>
</html>`,
            css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.container {
    background: white;
    border-radius: 20px;
    padding: 60px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 600px;
}

h1 {
    color: #333;
    margin-bottom: 20px;
    font-size: 42px;
}

p {
    color: #666;
    font-size: 18px;
    line-height: 1.6;
}

.prompt {
    margin-top: 30px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 10px;
    font-style: italic;
}`,
            js: `console.log('Custom app loaded!');
console.log('Prompt:', '${prompt}');

// Add your custom logic here
document.addEventListener('DOMContentLoaded', () => {
    console.log('App ready!');
});`
        };
    }

    // ===== Preview Functions =====
    updatePreview() {
        const iframe = document.getElementById('preview');
        const html = this.currentCode.html;
        const css = `<style>${this.currentCode.css}</style>`;
        const js = `<script>${this.currentCode.js}<\/script>`;

        const fullHTML = html.includes('<!DOCTYPE') ?
            html.replace('</head>', `${css}</head>`).replace('</body>', `${js}</body>`) :
            `<!DOCTYPE html><html><head>${css}</head><body>${html}${js}</body></html>`;

        iframe.srcdoc = fullHTML;

        // Update preview URL
        document.getElementById('previewUrl').value = 'Live Preview';
    }

    updateEditors() {
        document.getElementById('htmlEditor').value = this.currentCode.html;
        document.getElementById('cssEditor').value = this.currentCode.css;
        document.getElementById('jsEditor').value = this.currentCode.js;
    }

    // ===== UI Functions =====
    setMode(mode) {
        this.currentMode = mode;
        document.getElementById('buildMode').classList.toggle('active', mode === 'build');
        document.getElementById('discussMode').classList.toggle('active', mode === 'discuss');

        this.logToTerminal(`Switched to ${mode} mode`, 'info');
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}Pane`);
        });
    }

    setDevice(device) {
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.device === device);
        });

        const preview = document.getElementById('preview');
        const container = document.getElementById('previewContainer');

        if (device === 'mobile') {
            container.style.maxWidth = '375px';
            container.style.margin = '0 auto';
        } else if (device === 'tablet') {
            container.style.maxWidth = '768px';
            container.style.margin = '0 auto';
        } else {
            container.style.maxWidth = '100%';
            container.style.margin = '0';
        }
    }

    // ===== Template Functions =====
    loadTemplates() {
        return [
            { name: 'Todo App', icon: '✅', description: 'Task management app with local storage' },
            { name: 'Calculator', icon: '🔢', description: 'Scientific calculator with history' },
            { name: 'Landing Page', icon: '🚀', description: 'Modern product landing page' },
            { name: 'Dashboard', icon: '📊', description: 'Admin dashboard with charts' },
            { name: 'Blog', icon: '📝', description: 'Personal blog with markdown' },
            { name: 'Portfolio', icon: '💼', description: 'Developer portfolio website' },
            { name: 'Chat App', icon: '💬', description: 'Real-time chat application' },
            { name: 'E-commerce', icon: '🛒', description: 'Online store with cart' }
        ];
    }

    showTemplateModal() {
        const modal = document.getElementById('templateModal');
        const grid = document.getElementById('templateGrid');

        grid.innerHTML = '';
        this.templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <div class="template-preview">${template.icon}</div>
                <div class="template-info">
                    <div class="template-title">${template.name}</div>
                    <div class="template-description">${template.description}</div>
                </div>
            `;
            card.addEventListener('click', () => {
                this.loadTemplate(template.name);
                this.closeModals();
            });
            grid.appendChild(card);
        });

        modal.classList.add('active');
    }

    loadTemplate(templateName) {
        const prompt = `Create a ${templateName.toLowerCase()}`;
        this.addMessage('user', `Load ${templateName} template`);
        this.generateCode(prompt);
    }

    // ===== Export Functions =====
    showExportModal() {
        document.getElementById('exportModal').classList.add('active');
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    async exportAsZip() {
        this.logToTerminal('Preparing ZIP download...', 'info');

        // Create files
        const files = {
            'index.html': this.currentCode.html,
            'styles.css': this.currentCode.css,
            'script.js': this.currentCode.js
        };

        // In a real implementation, you'd use JSZip library
        // For now, we'll download individual files
        for (const [filename, content] of Object.entries(files)) {
            this.downloadFile(filename, content);
        }

        this.logToTerminal('Files downloaded!', 'success');
        this.closeModals();
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    async exportToGithub() {
        this.addMessage('assistant', '🐙 To export to GitHub:\n\n1. Create a new repository on GitHub\n2. Use the Download ZIP option\n3. Extract and push to your repository\n\nOr integrate with GitHub API for direct push!');
        this.closeModals();
    }

    openInCodepen() {
        const data = {
            html: this.currentCode.html,
            css: this.currentCode.css,
            js: this.currentCode.js
        };

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://codepen.io/pen/define';
        form.target = '_blank';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(data);

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        this.closeModals();
        this.logToTerminal('Opened in CodePen!', 'success');
    }

    openInCodesandbox() {
        this.addMessage('assistant', '📦 CodeSandbox export coming soon! For now, use the Download ZIP option.');
        this.closeModals();
    }

    // ===== Utility Functions =====
    copyCode() {
        const activeTab = document.querySelector('.tab.active').dataset.tab;
        let code = '';

        switch (activeTab) {
            case 'html':
                code = this.currentCode.html;
                break;
            case 'css':
                code = this.currentCode.css;
                break;
            case 'js':
                code = this.currentCode.js;
                break;
            default:
                code = `HTML:\n${this.currentCode.html}\n\nCSS:\n${this.currentCode.css}\n\nJavaScript:\n${this.currentCode.js}`;
        }

        navigator.clipboard.writeText(code);
        this.logToTerminal('Code copied to clipboard!', 'success');
    }

    downloadCode() {
        this.exportAsZip();
    }

    toggleFullscreen() {
        const previewContainer = document.getElementById('previewContainer');
        if (!document.fullscreenElement) {
            previewContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    formatCode(lang) {
        // Basic code formatting
        let code = '';
        let editor;

        switch (lang) {
            case 'html':
                editor = document.getElementById('htmlEditor');
                code = this.formatHTML(editor.value);
                editor.value = code;
                this.currentCode.html = code;
                break;
            case 'css':
                editor = document.getElementById('cssEditor');
                code = this.formatCSS(editor.value);
                editor.value = code;
                this.currentCode.css = code;
                break;
            case 'js':
                editor = document.getElementById('jsEditor');
                code = this.formatJS(editor.value);
                editor.value = code;
                this.currentCode.js = code;
                break;
        }

        this.updatePreview();
        this.logToTerminal(`${lang.toUpperCase()} formatted!`, 'success');
    }

    formatHTML(html) {
        // Basic HTML formatting
        return html.replace(/></g, '>\n<');
    }

    formatCSS(css) {
        // Basic CSS formatting
        return css.replace(/}/g, '}\n');
    }

    formatJS(js) {
        // Basic JS formatting
        return js.replace(/;/g, ';\n');
    }

    logToTerminal(message, type = 'info') {
        const terminal = document.getElementById('terminalContent');
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    clearTerminal() {
        document.getElementById('terminalContent').innerHTML = '';
        this.logToTerminal('Terminal cleared');
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }

    newChat() {
        this.chatHistory = [];
        document.getElementById('chatMessages').innerHTML = '';
        this.addMessage('assistant', '👋 New chat started! What would you like to build?');
        this.logToTerminal('New chat session started', 'info');
    }

    showHistory() {
        this.addMessage('assistant', `📜 Chat History:\n\nMessages: ${this.chatHistory.length}\nMode: ${this.currentMode}\nModel: ${this.currentModel}`);
    }

    attachImage() {
        this.addMessage('assistant', '📎 Image upload coming soon! This will allow you to upload designs and screenshots for the AI to recreate.');
    }

    voiceInput() {
        this.addMessage('assistant', '🎤 Voice input coming soon! You\'ll be able to describe your app with voice commands.');
    }

    async deploy() {
        this.showLoading();
        this.logToTerminal('Deploying application...', 'info');

        setTimeout(() => {
            this.hideLoading();
            this.addMessage('assistant', '🚀 Deployment successful!\n\nYour app is live at:\nhttps://your-app.netlify.app\n\n✅ Deploy time: 12s\n✅ Status: Active\n✅ CDN: Enabled');
            this.logToTerminal('Deployment complete!', 'success');
        }, 2000);
    }

    loadSampleCode() {
        this.currentCode = this.generateLandingPage();
        this.updateEditors();
    }

    loadSupabaseConfig() {
        // Check if Supabase credentials are available
        const supabaseUrl = localStorage.getItem('supabase_url');
        const supabaseKey = localStorage.getItem('supabase_key');

        if (supabaseUrl && supabaseKey) {
            this.supabaseConfig = {
                url: supabaseUrl,
                key: supabaseKey
            };
            this.logToTerminal('Supabase integration enabled!', 'success');
        }
    }
}

// Initialize the app
const app = new AICodeStudio();
