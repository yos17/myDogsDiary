// ===== Visual Editor - Click to Edit Feature =====
// Inspired by Loveable.dev's Select & Edit functionality

class VisualEditor {
    constructor(app) {
        this.app = app;
        this.isEditMode = false;
        this.selectedElement = null;
        this.overlay = null;
        this.init();
    }

    init() {
        this.createEditModeButton();
        this.createOverlay();
    }

    createEditModeButton() {
        const button = document.createElement('button');
        button.id = 'visualEditBtn';
        button.className = 'btn-secondary';
        button.textContent = '🎨 Visual Edit';
        button.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 999;';
        button.addEventListener('click', () => this.toggleEditMode());
        document.body.appendChild(button);
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'visual-edit-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
        `;
        document.body.appendChild(this.overlay);
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        const btn = document.getElementById('visualEditBtn');

        if (this.isEditMode) {
            btn.textContent = '❌ Exit Edit Mode';
            btn.style.background = '#ef4444';
            this.enableEditMode();
            this.app.logToTerminal('Visual edit mode enabled - click on any element in the preview!', 'success');
        } else {
            btn.textContent = '🎨 Visual Edit';
            btn.style.background = '';
            this.disableEditMode();
            this.app.logToTerminal('Visual edit mode disabled', 'info');
        }
    }

    enableEditMode() {
        const iframe = document.getElementById('preview');

        // Switch to preview tab
        this.app.switchTab('preview');

        // Add click event to preview iframe
        iframe.addEventListener('load', () => {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            this.makeElementsSelectable(iframeDoc);
        });

        // Reload iframe to apply changes
        iframe.src = iframe.src;
    }

    disableEditMode() {
        const iframe = document.getElementById('preview');
        iframe.src = iframe.src; // Reload to remove event listeners
    }

    makeElementsSelectable(doc) {
        if (!doc) return;

        // Add hover effect to all elements
        const style = doc.createElement('style');
        style.textContent = `
            .visual-edit-hover {
                outline: 2px dashed #667eea !important;
                outline-offset: 2px !important;
                cursor: pointer !important;
                position: relative !important;
            }
            .visual-edit-selected {
                outline: 3px solid #10b981 !important;
                outline-offset: 2px !important;
            }
            .visual-edit-label {
                position: absolute;
                top: -24px;
                left: 0;
                background: #667eea;
                color: white;
                padding: 4px 8px;
                font-size: 12px;
                border-radius: 4px;
                z-index: 10000;
                pointer-events: none;
            }
        `;
        doc.head.appendChild(style);

        // Add event listeners to all elements
        const elements = doc.body.querySelectorAll('*');
        elements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                if (!this.isEditMode) return;
                e.stopPropagation();
                element.classList.add('visual-edit-hover');

                // Show element tag name
                const label = doc.createElement('div');
                label.className = 'visual-edit-label';
                label.textContent = element.tagName.toLowerCase();
                element.style.position = 'relative';
                element.appendChild(label);
            });

            element.addEventListener('mouseleave', (e) => {
                e.stopPropagation();
                element.classList.remove('visual-edit-hover');
                const label = element.querySelector('.visual-edit-label');
                if (label) label.remove();
            });

            element.addEventListener('click', (e) => {
                if (!this.isEditMode) return;
                e.preventDefault();
                e.stopPropagation();
                this.selectElement(element, doc);
            });
        });
    }

    selectElement(element, doc) {
        // Remove previous selection
        if (this.selectedElement) {
            this.selectedElement.classList.remove('visual-edit-selected');
        }

        this.selectedElement = element;
        element.classList.add('visual-edit-selected');

        // Show edit dialog
        this.showEditDialog(element, doc);
    }

    showEditDialog(element, doc) {
        const tagName = element.tagName.toLowerCase();
        const currentText = element.textContent;
        const currentClasses = element.className;
        const currentStyles = element.style.cssText;

        // Create dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            min-width: 500px;
            color: #333;
        `;

        dialog.innerHTML = `
            <h2 style="margin-bottom: 20px; color: #333;">Edit ${tagName} Element</h2>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">
                    Describe your changes:
                </label>
                <textarea id="editPrompt" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-family: inherit; min-height: 100px; resize: vertical;" placeholder="E.g., 'Change the text to...', 'Make the background blue', 'Add a shadow effect'"></textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">
                    Quick Actions:
                </label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button onclick="quickEdit('hide')" style="padding: 8px 16px; background: #f5f5f5; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Hide</button>
                    <button onclick="quickEdit('duplicate')" style="padding: 8px 16px; background: #f5f5f5; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Duplicate</button>
                    <button onclick="quickEdit('delete')" style="padding: 8px 16px; background: #fee; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; color: #f00;">Delete</button>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <details>
                    <summary style="cursor: pointer; font-weight: 600; margin-bottom: 10px;">Advanced Options</summary>
                    <div style="margin-top: 10px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 14px;">Text Content:</label>
                        <input type="text" id="editText" value="${currentText.substring(0, 100)}" style="width: 100%; padding: 8px; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 10px;" />

                        <label style="display: block; margin-bottom: 4px; font-size: 14px;">CSS Classes:</label>
                        <input type="text" id="editClasses" value="${currentClasses}" style="width: 100%; padding: 8px; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 10px;" />

                        <label style="display: block; margin-bottom: 4px; font-size: 14px;">Inline Styles:</label>
                        <input type="text" id="editStyles" value="${currentStyles}" style="width: 100%; padding: 8px; border: 1px solid #e0e0e0; border-radius: 6px;" />
                    </div>
                </details>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="cancelEdit" style="padding: 10px 24px; background: #f5f5f5; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Cancel</button>
                <button id="applyEdit" style="padding: 10px 24px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Apply Changes</button>
            </div>
        `;

        // Add to overlay
        this.overlay.innerHTML = '';
        this.overlay.appendChild(dialog);
        this.overlay.style.display = 'flex';

        // Event listeners
        dialog.querySelector('#cancelEdit').addEventListener('click', () => {
            this.overlay.style.display = 'none';
            element.classList.remove('visual-edit-selected');
        });

        dialog.querySelector('#applyEdit').addEventListener('click', () => {
            const prompt = dialog.querySelector('#editPrompt').value;
            const newText = dialog.querySelector('#editText').value;
            const newClasses = dialog.querySelector('#editClasses').value;
            const newStyles = dialog.querySelector('#editStyles').value;

            if (prompt) {
                this.applyAIEdit(element, prompt, doc);
            } else {
                // Apply manual changes
                if (newText !== currentText) element.textContent = newText;
                if (newClasses !== currentClasses) element.className = newClasses;
                if (newStyles !== currentStyles) element.style.cssText = newStyles;
                this.updateCodeFromPreview(doc);
            }

            this.overlay.style.display = 'none';
            element.classList.remove('visual-edit-selected');
        });

        // Quick edit functions
        window.quickEdit = (action) => {
            switch (action) {
                case 'hide':
                    element.style.display = 'none';
                    break;
                case 'duplicate':
                    const clone = element.cloneNode(true);
                    element.parentNode.insertBefore(clone, element.nextSibling);
                    break;
                case 'delete':
                    if (confirm('Are you sure you want to delete this element?')) {
                        element.remove();
                    }
                    break;
            }
            this.updateCodeFromPreview(doc);
            this.overlay.style.display = 'none';
        };
    }

    applyAIEdit(element, prompt, doc) {
        this.app.showLoading();
        this.app.logToTerminal(`Applying AI edit: "${prompt}"`, 'info');

        // Simulate AI processing
        setTimeout(() => {
            // This would call the AI API in production
            const changes = this.simulateAIEdit(element, prompt);

            if (changes.text) element.textContent = changes.text;
            if (changes.style) element.style.cssText += changes.style;
            if (changes.class) element.className += ' ' + changes.class;

            this.updateCodeFromPreview(doc);
            this.app.hideLoading();
            this.app.logToTerminal('Changes applied successfully!', 'success');
            this.app.addMessage('assistant', `✅ I've updated the ${element.tagName.toLowerCase()} element based on your request: "${prompt}"`);
        }, 1000);
    }

    simulateAIEdit(element, prompt) {
        const lowerPrompt = prompt.toLowerCase();
        const changes = {};

        // Simple pattern matching
        if (lowerPrompt.includes('blue')) {
            changes.style = 'background: blue; color: white;';
        }
        if (lowerPrompt.includes('red')) {
            changes.style = 'color: red;';
        }
        if (lowerPrompt.includes('bigger') || lowerPrompt.includes('larger')) {
            changes.style = 'font-size: 24px;';
        }
        if (lowerPrompt.includes('shadow')) {
            changes.style = 'box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
        }
        if (lowerPrompt.includes('rounded') || lowerPrompt.includes('round')) {
            changes.style = 'border-radius: 12px;';
        }
        if (lowerPrompt.includes('center')) {
            changes.style = 'text-align: center;';
        }
        if (lowerPrompt.includes('hide')) {
            changes.style = 'display: none;';
        }

        // Extract new text if mentioned
        const textMatch = prompt.match(/(?:text to|change to|say)\s+["']([^"']+)["']/i);
        if (textMatch) {
            changes.text = textMatch[1];
        }

        return changes;
    }

    updateCodeFromPreview(doc) {
        // Update the HTML code from the modified preview
        const html = doc.documentElement.outerHTML;

        // Extract parts
        const htmlMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const cssMatch = html.match(/<style[^>]*>([\s\S]*)<\/style>/i);
        const jsMatch = html.match(/<script[^>]*>([\s\S]*)<\/script>/i);

        if (htmlMatch) this.app.currentCode.html = htmlMatch[1].trim();
        if (cssMatch) this.app.currentCode.css = cssMatch[1].trim();
        if (jsMatch) this.app.currentCode.js = jsMatch[1].replace(/<\/script>/g, '').trim();

        this.app.updateEditors();
        this.app.logToTerminal('Code updated from visual changes', 'success');
    }
}

// Initialize visual editor when app is ready
window.addEventListener('load', () => {
    if (window.app) {
        window.visualEditor = new VisualEditor(window.app);
    }
});
