/**
 * Statistics visualization for Pomodoro Timer
 * Creates charts and visualizations for task data
 */

// Show statistics modal with task data
function showStatisticsModal() {
    // Create modal if it doesn't exist
    let statsModal = document.getElementById('statisticsModal');
    if (!statsModal) {
        statsModal = createStatisticsModal();
    }
    
    // Update statistics content
    updateStatisticsContent();
    
    // Show the modal
    statsModal.classList.add('show');
    setTimeout(() => {
        statsModal.querySelector('.modal-content').style.opacity = 1;
        statsModal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
}

// Create statistics modal
function createStatisticsModal() {
    const modal = document.createElement('div');
    modal.id = 'statisticsModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content statistics-modal">
            <span class="close-modal">&times;</span>
            <h2>Your Productivity Stats</h2>
            
            <div class="stats-container">
                <div class="stats-summary">
                    <div class="stat-item">
                        <span class="stat-value" id="statTotalPomodoros">0</span>
                        <span class="stat-label">Total Pomodoros</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="statCompletedTasks">0</span>
                        <span class="stat-label">Tasks Completed</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="statFocusTime">0h</span>
                        <span class="stat-label">Focus Time</span>
                    </div>
                </div>
                
                <div class="stats-chart-container">
                    <canvas id="tasksChart"></canvas>
                </div>
                
                <div class="recent-tasks">
                    <h3>Recent Tasks</h3>
                    <ul id="recentTasksList" class="recent-tasks-list">
                        <!-- Tasks will be added here dynamically -->
                    </ul>
                </div>
            </div>
            
            <div class="stats-footer">
                <button id="downloadStatsBtn" class="btn">Download Report</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        closeStatisticsModal();
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeStatisticsModal();
        }
    });
    
    const downloadBtn = modal.querySelector('#downloadStatsBtn');
    downloadBtn.addEventListener('click', () => {
        if (typeof window.exportTaskStats === 'function') {
            window.exportTaskStats();
        }
    });
    
    return modal;
}

// Close statistics modal
function closeStatisticsModal() {
    const statsModal = document.getElementById('statisticsModal');
    if (!statsModal) return;
    
    const modalContent = statsModal.querySelector('.modal-content');
    modalContent.style.opacity = 0;
    modalContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        statsModal.classList.remove('show');
    }, 300);
}

// Update statistics content
function updateStatisticsContent() {
    // Get statistics data
    const taskStats = window.getTaskStats ? window.getTaskStats() : { totalTasks: 0, completedTasks: 0, activeTasks: 0 };
    const totalPomodoros = localStorage.getItem('completedSessions') || 0;
    const focusTimeMinutes = totalPomodoros * 25; // Each Pomodoro is 25 minutes
    
    // Update summary values
    document.getElementById('statTotalPomodoros').textContent = totalPomodoros;
    document.getElementById('statCompletedTasks').textContent = taskStats.completedTasks;
    
    // Convert minutes to hours and minutes
    const hours = Math.floor(focusTimeMinutes / 60);
    const minutes = focusTimeMinutes % 60;
    document.getElementById('statFocusTime').textContent = `${hours}h ${minutes}m`;
    
    // Update recent tasks list
    updateRecentTasksList();
}

// Update recent tasks list
function updateRecentTasksList() {
    const recentTasksList = document.getElementById('recentTasksList');
    if (!recentTasksList) return;
    
    // Clear existing list
    recentTasksList.innerHTML = '';
    
    // Get recent tasks (completed or active)
    const allTasks = window.getTasks ? window.getTasks() : [];
    
    // Sort tasks by creation date (newest first)
    const sortedTasks = [...allTasks].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Take only the 5 most recent tasks
    const recentTasks = sortedTasks.slice(0, 5);
    
    // Add tasks to the list
    if (recentTasks.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'recent-task-item empty';
        emptyItem.textContent = 'No tasks yet. Add some tasks to see them here!';
        recentTasksList.appendChild(emptyItem);
    } else {
        recentTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `recent-task-item ${task.completed ? 'completed' : ''}`;
            
            const sessionCount = task.sessions ? task.sessions.length : 0;
            
            li.innerHTML = `
                <div class="recent-task-text">${task.text}</div>
                <div class="recent-task-meta">
                    <span class="recent-task-sessions">${sessionCount} sessions</span>
                    <span class="recent-task-status">${task.completed ? 'Completed' : 'Active'}</span>
                </div>
            `;
            
            recentTasksList.appendChild(li);
        });
    }
}

// Export functions to window
window.showStatisticsModal = showStatisticsModal;
window.closeStatisticsModal = closeStatisticsModal;
