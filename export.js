/**
 * Export functionality for Pomodoro Timer
 * Allows exporting task and session data
 */

// Export task statistics
function exportTaskStats() {
    // Show statistics modal first
    if (typeof window.showStatisticsModal === 'function') {
        window.showStatisticsModal();
        return;
    }
    
    // If no statistics modal function, download directly
    downloadTaskStats();
}

// Download task statistics as JSON
function downloadTaskStats() {
    // Get tasks and statistics
    const allTasks = getTasks();
    const stats = getTaskStats();
    
    // Get formatted date
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    // Prepare export data
    const exportData = {
        date: now.toISOString(),
        summary: {
            totalTasks: stats.totalTasks,
            completedTasks: stats.completedTasks,
            activeTasks: stats.activeTasks,
            averageSessionsPerTask: stats.sessionsPerTask.toFixed(1),
            totalPomodoros: getTotalPomodoros()
        },
        tasks: allTasks.map(task => ({
            text: task.text,
            status: task.completed ? 'completed' : 'active',
            sessions: task.sessions ? task.sessions.length : 0,
            createdAt: task.createdAt,
            completedAt: task.completedAt || null
        }))
    };
    
    // Convert to JSON
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // Create download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `pomodoro-stats-${dateStr}.json`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Get total number of Pomodoros completed
function getTotalPomodoros() {
    const completedSessions = localStorage.getItem('completedSessions');
    return completedSessions ? parseInt(completedSessions) : 0;
}

// Export to window object
window.exportTaskStats = exportTaskStats;
