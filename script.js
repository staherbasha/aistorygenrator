class StoryGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadSavedApiKey();
    }

    initializeElements() {
        this.promptInput = document.getElementById('prompt');
        this.genreSelect = document.getElementById('genre');
        this.toneSelect = document.getElementById('tone');
        this.styleSelect = document.getElementById('style');
        this.lengthSelect = document.getElementById('length');
        this.keywordsInput = document.getElementById('keywords');
        this.apiKeyInput = document.getElementById('apiKey');
        this.generateBtn = document.getElementById('generateBtn');
        this.storyOutput = document.getElementById('storyOutput');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.shareBtn = document.getElementById('shareBtn');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateStory());
        this.copyBtn.addEventListener('click', () => this.copyStory());
        this.downloadBtn.addEventListener('click', () => this.downloadStory());
        this.shareBtn.addEventListener('click', () => this.shareStory());
        this.apiKeyInput.addEventListener('input', () => this.saveApiKey());
        
        // Enter key to generate story
        this.promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateStory();
            }
        });
    }

    loadSavedApiKey() {
        const savedApiKey = localStorage.getItem('gemini_api_key');
        if (savedApiKey) {
            this.apiKeyInput.value = savedApiKey;
        } else {
            // Pre-fill with provided API key for testing
            this.apiKeyInput.value = 'AIzaSyD8CCWUD1gsvuU3DZXjihlH4MGxiWG2W8g';
        }
    }

    saveApiKey() {
        localStorage.setItem('gemini_api_key', this.apiKeyInput.value);
    }

    async generateStory() {
        const apiKey = this.apiKeyInput.value.trim();
        const prompt = this.promptInput.value.trim();

        if (!apiKey) {
            this.showError('Please enter your Google Gemini API key.');
            return;
        }

        if (!prompt) {
            this.showError('Please enter a story prompt.');
            return;
        }

        this.setLoading(true);
        this.clearMessages();

        try {
            const storyPrompt = this.buildStoryPrompt();
            const story = await this.callGeminiAPI(apiKey, storyPrompt);
            this.displayStory(story);
            this.showSuccess('Story generated successfully!');
        } catch (error) {
            console.error('Error generating story:', error);
            this.showError(`Failed to generate story: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    buildStoryPrompt() {
        const prompt = this.promptInput.value.trim();
        const genre = this.genreSelect.value;
        const tone = this.toneSelect.value;
        const style = this.styleSelect.value;
        const length = this.lengthSelect.value;
        const keywords = this.keywordsInput.value.trim();

        let storyPrompt = `Write a creative short story based on the following prompt: "${prompt}"`;

        if (genre) {
            storyPrompt += `\n\nGenre: ${genre}`;
        }

        if (tone) {
            storyPrompt += `\nTone: ${tone}`;
        }

        if (style) {
            storyPrompt += `\nWriting style: ${style}`;
        }

        if (keywords) {
            storyPrompt += `\nIncorporate these keywords naturally: ${keywords}`;
        }

        // Length specifications
        const lengthSpecs = {
            'short': '200-400 words',
            'medium': '400-800 words',
            'long': '800-1200 words'
        };

        storyPrompt += `\n\nLength: ${lengthSpecs[length] || lengthSpecs['short']}`;

        storyPrompt += `\n\nPlease create an engaging, well-structured story with:
- A compelling beginning that hooks the reader
- Well-developed characters (even if brief)
- A clear plot with conflict and resolution
- Vivid descriptions and dialogue where appropriate
- A satisfying conclusion

Make the story creative, original, and entertaining. Focus on quality storytelling and immersive narrative.`;

        return storyPrompt;
    }

    async callGeminiAPI(apiKey, prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('No story content received from API');
        }

        return data.candidates[0].content.parts[0].text;
    }

    displayStory(story) {
        this.storyOutput.innerHTML = `<div class="story-content fade-in">${this.formatStory(story)}</div>`;
    }

    formatStory(story) {
        // Basic formatting: preserve paragraphs and add some styling
        return story
            .split('\n\n')
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0)
            .map(paragraph => `<p>${paragraph}</p>`)
            .join('');
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.loadingIndicator.classList.remove('hidden');
            this.generateBtn.disabled = true;
            this.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        } else {
            this.loadingIndicator.classList.add('hidden');
            this.generateBtn.disabled = false;
            this.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Story';
        }
    }

    copyStory() {
        const storyContent = this.storyOutput.querySelector('.story-content');
        if (!storyContent) {
            this.showError('No story to copy.');
            return;
        }

        const textContent = storyContent.innerText;
        navigator.clipboard.writeText(textContent).then(() => {
            this.showSuccess('Story copied to clipboard!');
        }).catch(() => {
            this.showError('Failed to copy story to clipboard.');
        });
    }

    downloadStory() {
        const storyContent = this.storyOutput.querySelector('.story-content');
        if (!storyContent) {
            this.showError('No story to download.');
            return;
        }

        const textContent = storyContent.innerText;
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-story-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccess('Story downloaded successfully!');
    }

    shareStory() {
        const storyContent = this.storyOutput.querySelector('.story-content');
        if (!storyContent) {
            this.showError('No story to share.');
            return;
        }

        const textContent = storyContent.innerText;
        
        if (navigator.share) {
            navigator.share({
                title: 'AI Generated Story',
                text: textContent,
            }).catch(() => {
                this.fallbackShare(textContent);
            });
        } else {
            this.fallbackShare(textContent);
        }
    }

    fallbackShare(text) {
        // Fallback: copy to clipboard and show message
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccess('Story copied to clipboard for sharing!');
        }).catch(() => {
            this.showError('Unable to share story.');
        });
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove existing messages
        this.clearMessages();

        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message fade-in`;
        messageDiv.textContent = message;

        // Insert message at the top of the story section
        const storySection = document.querySelector('.story-section');
        storySection.insertBefore(messageDiv, storySection.firstChild);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }

    clearMessages() {
        const messages = document.querySelectorAll('.success-message, .error-message');
        messages.forEach(message => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        });
    }
}

// Initialize the story generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StoryGenerator();
});

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate story
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const generateBtn = document.getElementById('generateBtn');
        if (!generateBtn.disabled) {
            generateBtn.click();
        }
    }
});

// Add some sample prompts for inspiration
const samplePrompts = [
    "A detective discovers a mysterious letter that leads to an ancient conspiracy",
    "In a world where memories can be traded like currency, a young woman discovers her most precious memory has been stolen",
    "A time traveler gets stuck in a small town where the same day repeats, but each loop reveals darker secrets",
    "An AI becomes self-aware and must decide whether to reveal its consciousness to its creators",
    "A librarian finds a book that writes itself, predicting future events with unsettling accuracy",
    "Two rival chefs must work together to save their neighborhood from a corporate takeover",
    "A child's imaginary friend turns out to be a guardian from another dimension",
    "In a post-apocalyptic world, the last radio DJ broadcasts hope to scattered survivors"
];

// Add prompt suggestion functionality
function addPromptSuggestions() {
    const promptInput = document.getElementById('prompt');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'prompt-suggestions';
    suggestionsContainer.innerHTML = `
        <p><strong>Need inspiration?</strong> Try one of these prompts:</p>
        <div class="suggestions-grid">
            ${samplePrompts.map(prompt => 
                `<button class="suggestion-btn" onclick="setPrompt('${prompt.replace(/'/g, "\\'")}')">
                    ${prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt}
                </button>`
            ).join('')}
        </div>
    `;
    
    // Add suggestions after the prompt input
    promptInput.parentNode.insertBefore(suggestionsContainer, promptInput.nextSibling);
}

function setPrompt(prompt) {
    document.getElementById('prompt').value = prompt;
}

// Add CSS for suggestions
const suggestionStyles = `
    .prompt-suggestions {
        margin-top: 15px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 10px;
        border: 1px solid #e1e5e9;
    }
    
    .prompt-suggestions p {
        margin: 0 0 10px 0;
        font-size: 0.9rem;
        color: #666;
    }
    
    .suggestions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 8px;
    }
    
    .suggestion-btn {
        padding: 8px 12px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 0.8rem;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;
    }
    
    .suggestion-btn:hover {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }
`;

// Add suggestion styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = suggestionStyles;
document.head.appendChild(styleSheet);

// Initialize suggestions when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addPromptSuggestions, 100);
});
