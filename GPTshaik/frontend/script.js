// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : '/api';

let conversationHistory = [];

// Send message function
async function sendMessage(event) {
    event.preventDefault();
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Clear input
    messageInput.value = '';
    
    // Remove welcome message if exists
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        if (data.error) {
            addMessage(`Error: ${data.error}`, 'assistant');
        } else {
            addMessage(data.response, 'assistant');
        }
        
    } catch (error) {
        removeTypingIndicator();
        addMessage(`Connection error: ${error.message}`, 'assistant');
        updateStatus('offline');
    }
}

// Add message to chat
function addMessage(content, role) {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = role === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${formatMessage(content)}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    conversationHistory.push({ role, content });
}

// Format message (handle code blocks)
function formatMessage(content) {
    // Handle code blocks
    content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    // Handle inline code
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Handle line breaks
    content = content.replace(/\n/g, '<br>');
    return content;
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send suggestion
function sendSuggestion(text) {
    document.getElementById('messageInput').value = text;
    document.getElementById('chatForm').dispatchEvent(new Event('submit'));
}

// New chat
function newChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome to GPTshaik!</h2>
            <p>I'm your AI assistant. How can I help you today?</p>
            <div class="suggestions">
                <button onclick="sendSuggestion('Explain Kubernetes in simple terms')">
                    Explain Kubernetes
                </button>
                <button onclick="sendSuggestion('Write a Python function to sort a list')">
                    Python Code Help
                </button>
                <button onclick="sendSuggestion('What are best practices for Docker?')">
                    Docker Best Practices
                </button>
            </div>
        </div>
    `;
    conversationHistory = [];
}

// Update status
function updateStatus(status) {
    const statusElement = document.getElementById('status');
    if (status === 'online') {
        statusElement.textContent = '● Online';
        statusElement.style.color = '#10a37f';
    } else {
        statusElement.textContent = '● Offline';
        statusElement.style.color = '#ef4444';
    }
}

// Check backend health
async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            updateStatus('online');
        } else {
            updateStatus('offline');
        }
    } catch (error) {
        updateStatus('offline');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkHealth();
    setInterval(checkHealth, 30000); // Check every 30 seconds
});

