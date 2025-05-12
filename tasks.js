/**
 * Tasks Management for Pomodoro Timer
 * Handles task creation, completion, and persistence
 */

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const activeTaskCount = document.getElementById('activeTaskCount');

// Tasks State
let tasks = [];
let activeTaskId = null;

// Initialize tasks
function initTasks() {
    // Load tasks from localStorage
    loadTasks();
    
    // Setup event listeners
    setupTaskEventListeners();
    
    // Update task count
    updateTaskCount();
    
    // Load active task from localStorage
    const savedActiveTaskId = localStorage.getItem('activeTaskId');
    if (savedActiveTaskId) {
        activeTaskId = parseInt(savedActiveTaskId);
        updateActiveTaskVisual();
    }
}

// Setup task event listeners
function setupTaskEventListeners() {
    // Add task on button click
    addTaskBtn.addEventListener('click', addTask);
    
    // Add task on Enter key
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    // Export task statistics
    const exportTasksBtn = document.getElementById('exportTasksBtn');
    if (exportTasksBtn) {
        exportTasksBtn.addEventListener('click', () => {
            if (typeof window.exportTaskStats === 'function') {
                window.exportTaskStats();
            }
        });
    }
    
    // Global shortcut for focusing the task input
    document.addEventListener('keydown', (e) => {
        // N: Focus task input field
        if (e.code === 'KeyN' && !e.repeat && 
            !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            taskInput.focus();
        }
        
        // X: Export task stats
        if (e.code === 'KeyX' && !e.repeat && 
            !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            if (typeof window.exportTaskStats === 'function') {
                window.exportTaskStats();
            }
        }
    });
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') return;
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    
    renderTask(task);
    saveTasks();
    updateTaskCount();
    
    // Clear input
    taskInput.value = '';
    taskInput.focus();
}

// Render a single task
function renderTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''} ${task.active ? 'active-task' : ''}`;
    li.dataset.id = task.id;
    
    li.innerHTML = `
        <div class="task-checkbox ${task.completed ? 'completed' : ''}"></div>
        <div class="task-text">${task.text}</div>
        <button class="task-focus" aria-label="Focus on this task" title="Set as current focus">▶</button>
        <button class="task-delete" aria-label="Delete task">×</button>
    `;
    
    // Add event listener for checkbox
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('click', () => {
        toggleTaskCompletion(task.id);
    });
    
    // Add event listener for focus button
    const focusBtn = li.querySelector('.task-focus');
    focusBtn.addEventListener('click', () => {
        setActiveTask(task.id);
    });
    
    // Add event listener for delete button
    const deleteBtn = li.querySelector('.task-delete');
    deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
    });
    
    taskList.appendChild(li);
}

// Render all tasks
function renderTasks() {
    // Clear task list
    taskList.innerHTML = '';
    
    // Render each task
    tasks.forEach(task => renderTask(task));
    
    // Update task count
    updateTaskCount();
}

// Toggle task completion
function toggleTaskCompletion(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        
        // If completing an active task, remove its active status
        if (tasks[taskIndex].completed && tasks[taskIndex].active) {
            tasks[taskIndex].active = false;
            activeTaskId = null;
            localStorage.removeItem('activeTaskId');
        }
        
        saveTasks();
        renderTasks();
    }
}

// Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    
    saveTasks();
    renderTasks();
}

// Clear completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    
    saveTasks();
    renderTasks();
}

// Update active task count
function updateTaskCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    activeTaskCount.textContent = activeTasks;
}

// Set a task as the active task
function setActiveTask(taskId) {
    // Reset any previously active task
    tasks.forEach(task => task.active = false);
    
    // Set the new active task
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1 && !tasks[taskIndex].completed) {
        tasks[taskIndex].active = true;
        activeTaskId = taskId;
        localStorage.setItem('activeTaskId', taskId);
    } else {
        activeTaskId = null;
        localStorage.removeItem('activeTaskId');
    }
    
    // Update UI
    updateActiveTaskVisual();
    saveTasks();
    
    // Show feedback if task is now active
    if (activeTaskId) {
        // Find the active task text to show in notification
        const activeTask = tasks.find(task => task.id === activeTaskId);
        if (activeTask) {
            showTaskNotification(`Now focusing on: ${activeTask.text}`);
        }
    }
}

// Show a task notification
function showTaskNotification(message) {
    const notificationEl = document.createElement('div');
    notificationEl.className = 'task-notification';
    notificationEl.textContent = message;
    
    document.body.appendChild(notificationEl);
    
    setTimeout(() => {
        notificationEl.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notificationEl.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notificationEl);
        }, 300);
    }, 3000);
}

// Update active task visual indicators
function updateActiveTaskVisual() {
    // Remove active class from all tasks
    document.querySelectorAll('.task-item').forEach(el => {
        el.classList.remove('active-task');
    });
    
    // Add active class to current active task
    if (activeTaskId) {
        const activeTaskEl = document.querySelector(`.task-item[data-id="${activeTaskId}"]`);
        if (activeTaskEl) {
            activeTaskEl.classList.add('active-task');
        }
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('pomodoroTasks');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        
        // Check if any task is marked as active
        const activeTask = tasks.find(task => task.active);
        if (activeTask) {
            activeTaskId = activeTask.id;
        } else {
            activeTaskId = null;
        }
        
        renderTasks();
    }
}

// Associate task with Pomodoro session
function associateTaskWithSession(sessionId, taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        if (!tasks[taskIndex].sessions) {
            tasks[taskIndex].sessions = [];
        }
        
        tasks[taskIndex].sessions.push(sessionId);
        saveTasks();
        
        // Show a visual indication that the session was associated with this task
        const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
        if (taskElement) {
            taskElement.classList.add('session-added');
            setTimeout(() => {
                taskElement.classList.remove('session-added');
            }, 2000);
        }
    }
}

// Get active task (first non-completed task)
function getActiveTask() {
    return tasks.find(task => !task.completed);
}

// Get task stats
function getTaskStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const sessionsPerTask = tasks.reduce((acc, task) => {
        const sessionCount = task.sessions ? task.sessions.length : 0;
        return acc + sessionCount;
    }, 0) / (totalTasks || 1); // Avoid division by zero
    
    return {
        totalTasks,
        completedTasks,
        activeTasks,
        sessionsPerTask
    };
}

// Get today's tasks
function getTodayTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
    });
}

// Get all tasks
function getTasks() {
    return [...tasks];
}

// Export functions to window
window.initTasks = initTasks;
window.associateTaskWithSession = associateTaskWithSession;
window.getActiveTask = getActiveTask;
window.getTaskStats = getTaskStats;
window.getTodayTasks = getTodayTasks;
window.getTasks = getTasks;
window.activeTaskId = activeTaskId;
