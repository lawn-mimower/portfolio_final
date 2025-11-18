// main.js

// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('i');
const body = document.body;

function applyTheme(theme) {
  body.classList.remove('light-theme', 'dark-theme');
  body.classList.add(theme + '-theme');
  if (themeIcon) {
    if (theme === 'dark') {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }
  localStorage.setItem('theme', theme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
    applyTheme(newTheme);
  });
}

// Check for saved theme preference on load
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// ==================== MOBILE MENU TOGGLE ====================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  });
}

// ==================== PROJECT FILTERING ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category').split(' ');
      if (filter === 'all' || categories.includes(filter)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ==================== CHAT WIDGET ====================
// DOM Elements
const chatToggle   = document.getElementById('chat-toggle');
const chatModal    = document.getElementById('chat-modal');
const closeChat    = document.getElementById('close-chat');
const messageInput = document.getElementById('message-input');
const sendButton   = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');
const clearChatBtn = document.getElementById('clear-chat');
const suggestedQuestions = document.getElementById('suggested-questions');

// Chat history management
const CHAT_HISTORY_KEY = 'mihir_portfolio_chat_history';
let lastMessageTime = 0;
const MESSAGE_COOLDOWN = 1000; // 1 second cooldown

// Load chat history from localStorage
function loadChatHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || '[]');
    // Clear existing messages except the welcome message
    const welcomeMessage = chatMessages.querySelector('.chat-message.bot');
    chatMessages.innerHTML = '';
    if (welcomeMessage) {
      chatMessages.appendChild(welcomeMessage);
    }

    // Restore messages
    history.forEach(msg => {
      addMessage(msg.text, msg.isUser, false); // false = don't save to history again
    });

    // Hide suggested questions if there's history
    if (history.length > 0 && suggestedQuestions) {
      suggestedQuestions.style.display = 'none';
    }
  } catch (e) {
    console.error('Error loading chat history:', e);
  }
}

// Save chat history to localStorage
function saveChatHistory() {
  try {
    const messages = Array.from(chatMessages.querySelectorAll('.chat-message:not(.typing)'))
      .filter(msg => !msg.querySelector('.message-content')?.textContent?.includes('Hi there!'))
      .map(msg => ({
        text: msg.querySelector('.message-content')?.textContent || '',
        isUser: msg.classList.contains('user')
      }));
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving chat history:', e);
  }
}

// Clear chat history
function clearChatHistory() {
  if (confirm('Are you sure you want to clear the chat history?')) {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    // Keep only the welcome message
    const welcomeMessage = chatMessages.querySelector('.chat-message.bot');
    chatMessages.innerHTML = '';
    if (welcomeMessage) {
      chatMessages.appendChild(welcomeMessage);
    }
    // Show suggested questions again
    if (suggestedQuestions) {
      suggestedQuestions.style.display = 'block';
    }
  }
}

// Show/hide chat modal
if (chatToggle) {
  chatToggle.addEventListener('click', () => {
    if (chatModal) {
      chatModal.style.display = 'flex';
      chatToggle.style.display = 'none';
      messageInput?.focus();
      loadChatHistory(); // Load history when opening chat
    }
  });
}

if (closeChat) {
  closeChat.addEventListener('click', () => {
    if (chatModal) {
      chatModal.style.display = 'none';
    }
    if (chatToggle) {
      chatToggle.style.display = 'block';
    }
  });
}

// Clear chat button
if (clearChatBtn) {
  clearChatBtn.addEventListener('click', clearChatHistory);
}

// Suggested questions
if (suggestedQuestions) {
  const suggestionBtns = suggestedQuestions.querySelectorAll('.suggestion-btn');
  suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (messageInput) {
        messageInput.value = btn.textContent;
        handleSend();
        suggestedQuestions.style.display = 'none';
      }
    });
  });
}

// Utility to append a message
function addMessage(text, isUser = false, saveHistory = true) {
  if (!chatMessages) return;

  const msg = document.createElement('div');
  msg.className = `chat-message ${isUser ? 'user' : 'bot'}`;
  msg.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (saveHistory) {
    saveChatHistory();
  }

  // Hide suggested questions after first message
  if (suggestedQuestions && isUser) {
    suggestedQuestions.style.display = 'none';
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Send & receive with rate limiting
async function handleSend() {
  if (!messageInput || !sendButton) return;

  const text = messageInput.value.trim();
  if (!text) return;

  // Rate limiting
  const now = Date.now();
  if (now - lastMessageTime < MESSAGE_COOLDOWN) {
    addMessage('Please wait a moment before sending another message.', false);
    return;
  }
  lastMessageTime = now;

  addMessage(text, true);
  messageInput.value = '';
  sendButton.disabled = true;

  // Add typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.classList.add('chat-message', 'bot', 'typing');
  typingIndicator.innerHTML = '<div class="message-content"><span>.</span><span>.</span><span>.</span></div>';
  chatMessages.appendChild(typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    // Remove typing indicator
    if (chatMessages.contains(typingIndicator)) {
      chatMessages.removeChild(typingIndicator);
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || res.statusText);
    }
    const { reply } = await res.json();
    addMessage(reply, false);
  } catch (e) {
    console.error('Chat error:', e);
    if (chatMessages.contains(typingIndicator)) {
      chatMessages.removeChild(typingIndicator);
    }
    addMessage(`Sorry, I encountered an error: ${e.message}`, false);
  } finally {
    sendButton.disabled = false;
    messageInput.focus();
  }
}

// Wire up send events
if (sendButton) {
  sendButton.addEventListener('click', handleSend);
}
if (messageInput) {
  messageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') handleSend();
  });
}
