// ===== Configuration for AI Code Studio =====

const CONFIG = {
    // Application Settings
    app: {
        name: 'AI Code Studio',
        version: '1.0.0',
        author: 'AI Code Studio Team'
    },

    // AI Models Configuration
    models: {
        auto: {
            name: 'Auto-Select',
            description: 'Automatically selects the best model for your task',
            priority: ['claude', 'gpt4', 'gemini']
        },
        claude: {
            name: 'Claude Sonnet 4',
            description: 'Best for complex logic and detailed code generation',
            strengths: ['Complex algorithms', 'Documentation', 'Debugging']
        },
        gpt4: {
            name: 'GPT-4',
            description: 'Versatile and creative code generation',
            strengths: ['Creative solutions', 'Multiple approaches', 'Quick iterations']
        },
        gemini: {
            name: 'Gemini Pro',
            description: 'Fast and efficient for standard tasks',
            strengths: ['Speed', 'Simple apps', 'Prototyping']
        }
    },

    // Template Configuration
    templates: [
        {
            id: 'todo',
            name: 'Todo App',
            icon: '✅',
            description: 'Task management app with local storage',
            category: 'productivity',
            difficulty: 'beginner',
            features: ['CRUD operations', 'Local storage', 'Responsive design']
        },
        {
            id: 'calculator',
            name: 'Calculator',
            icon: '🔢',
            description: 'Scientific calculator with history',
            category: 'utility',
            difficulty: 'beginner',
            features: ['Basic operations', 'Scientific functions', 'Keyboard support']
        },
        {
            id: 'landing',
            name: 'Landing Page',
            icon: '🚀',
            description: 'Modern product landing page',
            category: 'marketing',
            difficulty: 'intermediate',
            features: ['Hero section', 'Features grid', 'Responsive design']
        },
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: '📊',
            description: 'Admin dashboard with charts',
            category: 'business',
            difficulty: 'advanced',
            features: ['Sidebar navigation', 'Stats cards', 'Data visualization']
        },
        {
            id: 'blog',
            name: 'Blog',
            icon: '📝',
            description: 'Personal blog with markdown',
            category: 'content',
            difficulty: 'intermediate',
            features: ['Markdown support', 'Post listing', 'Responsive']
        },
        {
            id: 'portfolio',
            name: 'Portfolio',
            icon: '💼',
            description: 'Developer portfolio website',
            category: 'personal',
            difficulty: 'intermediate',
            features: ['Project showcase', 'About section', 'Contact form']
        },
        {
            id: 'chat',
            name: 'Chat App',
            icon: '💬',
            description: 'Real-time chat application',
            category: 'communication',
            difficulty: 'advanced',
            features: ['Real-time messaging', 'User presence', 'Typing indicators']
        },
        {
            id: 'ecommerce',
            name: 'E-commerce',
            icon: '🛒',
            description: 'Online store with cart',
            category: 'business',
            difficulty: 'advanced',
            features: ['Product catalog', 'Shopping cart', 'Checkout flow']
        }
    ],

    // UI Settings
    ui: {
        theme: 'dark', // or 'light'
        animations: true,
        soundEffects: false,
        showWelcomeMessage: true,
        autoSave: true,
        autoSaveInterval: 30000 // 30 seconds
    },

    // Editor Settings
    editor: {
        fontSize: 14,
        tabSize: 2,
        wordWrap: true,
        lineNumbers: true,
        autoComplete: true,
        minimap: false
    },

    // Preview Settings
    preview: {
        autoRefresh: true,
        refreshDelay: 500, // milliseconds
        defaultDevice: 'desktop',
        sandbox: true
    },

    // Export Settings
    export: {
        defaultFormat: 'zip',
        includeReadme: true,
        includePackageJson: true,
        zipFilename: 'ai-code-studio-project'
    },

    // Feature Flags
    features: {
        visualEditor: true,
        supabaseIntegration: true,
        githubExport: true,
        realTimeCollaboration: false, // Coming soon
        aiAssistant: true,
        codeFormatting: true,
        terminalOutput: true
    },

    // Keyboard Shortcuts
    shortcuts: {
        send: 'Ctrl+Enter',
        save: 'Ctrl+S',
        copy: 'Ctrl+K',
        refresh: 'Ctrl+R',
        fullscreen: 'F11',
        newChat: 'Ctrl+N',
        formatCode: 'Ctrl+Shift+F'
    },

    // Rate Limiting (for AI requests)
    rateLimits: {
        requestsPerMinute: 10,
        requestsPerHour: 100,
        requestsPerDay: 500
    },

    // Default Prompts
    samplePrompts: [
        'Build a todo app with dark mode',
        'Create a landing page for a SaaS product',
        'Make a calculator with scientific functions',
        'Build a dashboard with sidebar and stats',
        'Create a blog with markdown support',
        'Make a portfolio website for a developer',
        'Build a chat app with real-time messaging',
        'Create an e-commerce store'
    ],

    // Error Messages
    errors: {
        networkError: 'Network error. Please check your connection.',
        aiError: 'AI generation failed. Please try again.',
        exportError: 'Export failed. Please try again.',
        invalidInput: 'Invalid input. Please check and try again.',
        rateLimitExceeded: 'Rate limit exceeded. Please wait and try again.'
    },

    // Success Messages
    success: {
        codeGenerated: 'Code generated successfully!',
        codeCopied: 'Code copied to clipboard!',
        codeFormatted: 'Code formatted successfully!',
        exported: 'Project exported successfully!',
        deployed: 'Project deployed successfully!'
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
