/**
 * Pomodoro Timer Web App
 * A simple, elegant Pomodoro timer with focus and break sessions
 */

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const focusButton = document.querySelector('[data-mode="focus"]');
const breakButton = document.querySelector('[data-mode="break"]');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const progressRing = document.querySelector('.progress-ring-circle');
const sessionsCount = document.getElementById('sessionsCount');
const quoteContainer = document.getElementById('quoteContainer');
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('quoteAuthor');
const musicToggle = document.getElementById('musicToggle');
const volumeControl = document.getElementById('volumeControl');
const notificationSound = document.getElementById('notificationSound');
const backgroundMusic = document.getElementById('backgroundMusic');

// Timer Settings
let FOCUS_TIME = parseInt(localStorage.getItem('focusTime')) || 25 * 60; // 25 minutes in seconds
let BREAK_TIME = parseInt(localStorage.getItem('breakTime')) || 5 * 60;  // 5 minutes in seconds
const RING_CIRCUMFERENCE = parseInt(progressRing.getAttribute('r')) * 2 * Math.PI;

// Timer State
let timerMode = 'focus';
let timeRemaining = FOCUS_TIME;
let totalTime = FOCUS_TIME;
let isRunning = false;
let timerInterval = null;
let completedSessions = 0;

// Initialize app
function init() {
    // Load theme preference
    loadThemePreference();
    
    // Load completed sessions from localStorage
    loadCompletedSessions();
    
    // Setup event listeners
    setupEventListeners();
    
    // Set initial progress ring circumference
    progressRing.style.strokeDasharray = RING_CIRCUMFERENCE;
    progressRing.style.strokeDashoffset = RING_CIRCUMFERENCE;
    
    // Initialize volume if music was previously enabled
    backgroundMusic.volume = volumeControl.value;
    
    // Load random quote
    loadRandomQuote();
    
    // Request notification permission
    requestNotificationPermission();
    
    // Initialize tasks management
    if (typeof window.initTasks === 'function') {
        window.initTasks();
    }
}

// Request notification permission
function requestNotificationPermission() {
    if (Notification && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
}

// Show credits modal
function showCreditsModal() {
    const creditsModal = document.getElementById('creditsModal');
    creditsModal.classList.add('show');
    setTimeout(() => {
        creditsModal.querySelector('.modal-content').style.opacity = 1;
        creditsModal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
}

// Close credits modal
function closeCreditsModal() {
    const creditsModal = document.getElementById('creditsModal');
    const modalContent = creditsModal.querySelector('.modal-content');
    
    modalContent.style.opacity = 0;
    modalContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        creditsModal.classList.remove('show');
    }, 300);
}

// Setup event listeners
function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    focusButton.addEventListener('click', () => switchMode('focus'));
    breakButton.addEventListener('click', () => switchMode('break'));
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    musicToggle.addEventListener('change', toggleBackgroundMusic);
    volumeControl.addEventListener('input', adjustVolume);
    
    // Credits modal functionality
    const creditsModal = document.getElementById('creditsModal');
    const closeModal = document.querySelector('.close-modal');
    
    // Close modal when clicking the X
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            closeCreditsModal();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === creditsModal) {
            closeCreditsModal();
        }
    });
      // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Skip if focus is on input or textarea
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            // Only handle Escape key
            if (e.code === 'Escape' && creditsModal.classList.contains('show')) {
                closeCreditsModal();
            }
            return;
        }
        
        // Space: Start/Pause
        if (e.code === 'Space' && !e.repeat) {
            e.preventDefault(); // Prevent space from scrolling the page
            if (!isRunning) {
                startTimer();
            } else {
                pauseTimer();
            }
        }
        // R: Reset timer
        else if (e.code === 'KeyR' && !e.repeat) {
            resetTimer();
        }
        // F: Switch to focus mode
        else if (e.code === 'KeyF' && !e.repeat && !isRunning) {
            switchMode('focus');
        }
        // B: Switch to break mode
        else if (e.code === 'KeyB' && !e.repeat && !isRunning) {
            switchMode('break');
        }
        // T: Toggle theme
        else if (e.code === 'KeyT' && !e.repeat) {
            toggleTheme();
        }
        // M: Toggle music
        else if (e.code === 'KeyM' && !e.repeat) {
            musicToggle.checked = !musicToggle.checked;
            toggleBackgroundMusic();
        }
        // C: Show credits
        else if (e.code === 'KeyC' && !e.repeat) {
            showCreditsModal();
        }
        // Escape: Close modal
        else if (e.code === 'Escape' && creditsModal.classList.contains('show')) {
            closeCreditsModal();
        }
    });
    
    // Load user preferences on startup
    document.addEventListener('DOMContentLoaded', () => {
        // Check if music preference was saved
        const musicEnabled = localStorage.getItem('musicEnabled') === 'true';
        musicToggle.checked = musicEnabled;
        if (musicEnabled) {
            const savedVolume = localStorage.getItem('musicVolume');
            if (savedVolume) {
                volumeControl.value = savedVolume;
                backgroundMusic.volume = savedVolume;
            }
        }
    });
}

// Switch between focus and break modes
function switchMode(mode) {
    if (isRunning) return; // Don't allow switching while timer is running
    
    timerMode = mode;
    if (mode === 'focus') {
        focusButton.classList.add('active');
        breakButton.classList.remove('active');
        timeRemaining = FOCUS_TIME;
        totalTime = FOCUS_TIME;
    } else {
        focusButton.classList.remove('active');
        breakButton.classList.add('active');
        timeRemaining = BREAK_TIME;
        totalTime = BREAK_TIME;
    }
    
    updateTimerDisplay();
    updateProgressRing();
}

// Start the timer
function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    
    // Add timer-running class for animation
    document.querySelector('.timer-display').classList.add('timer-running');
    
    // Start the timer interval
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
            updateProgressRing();
        } else {
            completeTimer();
        }
    }, 1000);
}

// Pause the timer
function pauseTimer() {
    if (!isRunning) return;
    
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.disabled = false;
    startBtn.textContent = 'Resume';
    pauseBtn.disabled = true;
    
    // Remove timer-running class for animation
    document.querySelector('.timer-display').classList.remove('timer-running');
}

// Reset the timer
function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    
    timeRemaining = timerMode === 'focus' ? FOCUS_TIME : BREAK_TIME;
    totalTime = timeRemaining;
    
    updateTimerDisplay();
    updateProgressRing();
    
    startBtn.disabled = false;
    startBtn.textContent = 'Start';
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    
    // Remove timer-running class for animation
    document.querySelector('.timer-display').classList.remove('timer-running');
}

// Complete the timer
function completeTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    
    // Remove timer-running class for animation
    document.querySelector('.timer-display').classList.remove('timer-running');
    
    // Play notification sound
    notificationSound.play();
    
    // Send browser notification if permission is granted
    if (Notification && Notification.permission === 'granted') {
        const message = timerMode === 'focus' 
            ? 'Focus session completed! Time for a break.' 
            : 'Break time over! Ready to focus again?';
        const notification = new Notification('Pomodoro Timer', {
            body: message,
            icon: 'images/favicon.png'
        });
    }
    
    // If focus session completed, increment counter
    if (timerMode === 'focus') {
        completedSessions++;
        sessionsCount.textContent = completedSessions;
        saveCompletedSessions();
        
        // Generate unique session ID
        const sessionId = Date.now();
        
        // Dispatch event for session completion
        const sessionCompletedEvent = new CustomEvent('pomodoroCompleted', {
            detail: {
                sessionId: sessionId,
                timestamp: new Date().toISOString(),
                duration: FOCUS_TIME
            }
        });
        document.dispatchEvent(sessionCompletedEvent);
        
        // Show confetti animation
        if (typeof showConfetti === 'function') {
            showConfetti();
        }
        
        // Auto switch to break mode
        setTimeout(() => {
            switchMode('break');
        }, 500);
    } else {
        // Auto switch to focus mode
        setTimeout(() => {
            switchMode('focus');
        }, 500);
    }
    
    startBtn.disabled = false;
    startBtn.textContent = 'Start';
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    
    // Update quote after each session
    loadRandomQuote();
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update document title to show current timer
    const modeText = timerMode === 'focus' ? 'Focus' : 'Break';
    document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - ${modeText} | Pomodoro Timer`;
}

// Update progress ring
function updateProgressRing() {
    const progress = 1 - (timeRemaining / totalTime);
    const dashOffset = RING_CIRCUMFERENCE * progress;
    progressRing.style.strokeDashoffset = dashOffset;
}

// Toggle theme (light/dark mode)
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode.toString());
}

// Load theme preference from localStorage
function loadThemePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Toggle background music
function toggleBackgroundMusic() {
    if (musicToggle.checked) {
        backgroundMusic.play();
        localStorage.setItem('musicEnabled', 'true');
    } else {
        backgroundMusic.pause();
        localStorage.setItem('musicEnabled', 'false');
    }
}

// Adjust music volume
function adjustVolume() {
    backgroundMusic.volume = volumeControl.value;
    localStorage.setItem('musicVolume', volumeControl.value);
}

// Save completed sessions to localStorage
function saveCompletedSessions() {
    localStorage.setItem('completedSessions', completedSessions);
}

// Load completed sessions from localStorage
function loadCompletedSessions() {
    const saved = localStorage.getItem('completedSessions');
    if (saved) {
        completedSessions = parseInt(saved);
        sessionsCount.textContent = completedSessions;
    }
}

// Customize timer settings - can be used for future enhancements
function customizeTimer(focusMinutes, breakMinutes) {
    // Only allow customization when timer is not running
    if (isRunning) return;
    
    const newFocusTime = focusMinutes * 60;
    const newBreakTime = breakMinutes * 60;
    
    // Update constants
    FOCUS_TIME = newFocusTime;
    BREAK_TIME = newBreakTime;
    
    // Update current timer based on mode
    if (timerMode === 'focus') {
        timeRemaining = newFocusTime;
        totalTime = newFocusTime;
    } else {
        timeRemaining = newBreakTime;
        totalTime = newBreakTime;
    }
    
    // Update display
    updateTimerDisplay();
    updateProgressRing();
    
    // Save settings to localStorage
    localStorage.setItem('focusTime', newFocusTime);
    localStorage.setItem('breakTime', newBreakTime);
}

// Collection of motivational quotes
const quotes = [
    {
        text: "The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.",
        author: "Francesco Cirillo"
    },
    {
        text: "Time management is not about having all the time in the world; it's about being able to prioritize how you spend the time that you have.",
        author: "Michelle Moore"
    },
    {
        text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
        author: "Stephen Covey"
    },
    {
        text: "Focus on being productive instead of busy.",
        author: "Tim Ferriss"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        text: "It's not that I'm so smart, it's just that I stay with problems longer.",
        author: "Albert Einstein"
    },
    {
        text: "The most effective way to do it, is to do it.",
        author: "Amelia Earhart"
    },
    {
        text: "Don't count the days, make the days count.",
        author: "Muhammad Ali"
    },
    {
        text: "You don't have to be great to start, but you have to start to be great.",
        author: "Zig Ziglar"
    },
    {
        text: "Either you run the day or the day runs you.",
        author: "Jim Rohn"
    }
];

// Load random motivational quote
function loadRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = `- ${quote.author}`;
    
    // Add fade animation
    quoteContainer.style.opacity = '0';
    setTimeout(() => {
        quoteContainer.style.opacity = '1';
    }, 300);
}

// Initialize Tasks
function initializeTasksIntegration() {
    // Initialize the tasks module
    if (typeof window.initTasks === 'function') {
        window.initTasks();
        
        // When a focus session completes, associate with the active task (if any)
        document.addEventListener('pomodoroCompleted', (e) => {
            // Check if there's a manually set active task
            if (window.activeTaskId) {
                window.associateTaskWithSession(e.detail.sessionId, window.activeTaskId);
            } else {
                // Fallback: use first uncompleted task
                const activeTaskElements = document.querySelectorAll('.task-item:not(.completed)');
                if (activeTaskElements.length > 0) {
                    // Associate the first uncompleted task with this session
                    const taskId = parseInt(activeTaskElements[0].dataset.id);
                    window.associateTaskWithSession(e.detail.sessionId, taskId);
                }
            }
        });
    }
}

// Initialize the app
init();
initializeTasksIntegration();

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
