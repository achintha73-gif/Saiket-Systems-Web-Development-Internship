// =============================================
// ===== STATE =====
// =============================================
let tasks = [];
let currentFilter = 'all';
let isDark = false;
let sortAsc = false;

// =============================================
// ===== LOAD TASKS =====
// =============================================
function loadTasks() {
    const stored = localStorage.getItem('tasks');
    if (stored) {
        tasks = JSON.parse(stored);
    } else {
        // ===== EXAMPLE TASKS =====
        tasks = [
            {
                id: Date.now() - 86400000,
                title: '🎯 Complete Task 6 - Interactive Web Application',
                priority: 'high',
                completed: false,
                date: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: Date.now() - 172800000,
                title: '📝 Review the Blogging Platform (Task 5)',
                priority: 'medium',
                completed: false,
                date: new Date(Date.now() - 172800000).toISOString()
            },
            {
                id: Date.now() - 259200000,
                title: '🎨 Update portfolio website with new projects',
                priority: 'low',
                completed: false,
                date: new Date(Date.now() - 259200000).toISOString()
            },
            {
                id: Date.now() - 345600000,
                title: '✅ Submit all internship tasks to SaiKet Systems',
                priority: 'high',
                completed: true,
                date: new Date(Date.now() - 345600000).toISOString()
            },
            {
                id: Date.now() - 432000000,
                title: '📱 Create LinkedIn post about internship experience',
                priority: 'medium',
                completed: true,
                date: new Date(Date.now() - 432000000).toISOString()
            },
            {
                id: Date.now() - 518400000,
                title: '📧 Send thank you email to SaiKet Systems team',
                priority: 'low',
                completed: true,
                date: new Date(Date.now() - 518400000).toISOString()
            }
        ];
        saveTasks();
    }
    renderTasks();
}

// =============================================
// ===== SAVE TASKS =====
// =============================================
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// =============================================
// ===== RENDER TASKS =====
// =============================================
function renderTasks() {
    const list = document.getElementById('taskList');
    const empty = document.getElementById('emptyState');
    const total = document.getElementById('totalTasks');
    const pending = document.getElementById('pendingTasks');
    const completed = document.getElementById('completedTasks');
    const rate = document.getElementById('completionRate');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Filter tasks
    let filtered = tasks;
    if (currentFilter === 'pending') {
        filtered = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = tasks.filter(t => t.completed);
    } else if (['high', 'medium', 'low'].includes(currentFilter)) {
        filtered = tasks.filter(t => t.priority === currentFilter);
    }

    // Sort
    if (sortAsc) {
        filtered = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
        filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Update stats
    const totalCount = tasks.length;
    const pendingCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    total.textContent = totalCount;
    pending.textContent = pendingCount;
    completed.textContent = completedCount;
    rate.textContent = completionRate + '%';
    progressFill.style.width = completionRate + '%';
    progressText.textContent = completionRate + '%';

    document.getElementById('tasksCount').textContent = `${filtered.length} task${filtered.length !== 1 ? 's' : ''}`;

    if (filtered.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';

    list.innerHTML = filtered.map(task => `
        <div class="task-item" data-id="${task.id}">
            <button class="task-check ${task.completed ? 'completed' : ''}" 
                    onclick="toggleTask('${task.id}')"></button>
            <span class="task-title ${task.completed ? 'completed' : ''}">${escapeHtml(task.title)}</span>
            <span class="task-priority priority-${task.priority}">${task.priority}</span>
            <span class="task-date">${formatDate(task.date)}</span>
            <button class="task-delete" onclick="deleteTask('${task.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// =============================================
// ===== ADD TASK =====
// =============================================
function addTask() {
    const input = document.getElementById('taskInput');
    const priority = document.getElementById('prioritySelect').value;
    const title = input.value.trim();

    if (!title) {
        showToast('Please enter a task!', 'error');
        input.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        priority: priority,
        completed: false,
        date: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    input.value = '';
    input.focus();
    showToast('✅ Task added successfully!');
}

// =============================================
// ===== ADD EXAMPLE TASKS =====
// =============================================
function addExampleTasks() {
    const examples = [
        '🎯 Complete Task 6 - Interactive Web Application',
        '📝 Review the Blogging Platform (Task 5)',
        '🎨 Update portfolio website with new projects',
        '✅ Submit all internship tasks to SaiKet Systems',
        '📱 Create LinkedIn post about internship experience',
        '📧 Send thank you email to SaiKet Systems team'
    ];

    examples.forEach((title, index) => {
        const priority = ['high', 'medium', 'low', 'high', 'medium', 'low'][index];
        tasks.push({
            id: Date.now() + index,
            title: title,
            priority: priority,
            completed: false,
            date: new Date(Date.now() - (index * 86400000)).toISOString()
        });
    });

    saveTasks();
    renderTasks();
    showToast('🎉 Example tasks added!');
}

// =============================================
// ===== TOGGLE TASK =====
// =============================================
function toggleTask(id) {
    const task = tasks.find(t => t.id == id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        if (task.completed) {
            showToast('🎉 Task completed! Great job!');
        } else {
            showToast('🔄 Task reopened');
        }
    }
}

// =============================================
// ===== DELETE TASK =====
// =============================================
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id != id);
        saveTasks();
        renderTasks();
        showToast('🗑️ Task deleted!');
    }
}

// =============================================
// ===== CLEAR COMPLETED =====
// =============================================
function clearCompleted() {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) {
        showToast('No completed tasks to clear!', 'error');
        return;
    }
    if (confirm(`Delete ${completedTasks.length} completed task(s)?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        showToast('🧹 Completed tasks cleared!');
    }
}

// =============================================
// ===== SORT TASKS =====
// =============================================
function sortTasks() {
    sortAsc = !sortAsc;
    renderTasks();
    showToast(sortAsc ? '📅 Oldest first' : '📅 Newest first');
}

// =============================================
// ===== FILTER =====
// =============================================
function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderTasks();
}

function toggleFilter() {
    const bar = document.getElementById('filterBar');
    bar.classList.toggle('show');
}

// =============================================
// ===== THEME =====
// =============================================
function toggleTheme() {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', isDark);
    const icon = document.querySelector('.btn-theme i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// =============================================
// ===== FORMAT DATE =====
// =============================================
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// =============================================
// ===== ESCAPE HTML =====
// =============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================================
// ===== TOAST =====
// =============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');

    msg.textContent = message;

    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = '#e94560';
    } else {
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#22c55e';
    }

    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// =============================================
// ===== KEYBOARD SHORTCUTS =====
// =============================================
function handleEnter(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        toggleFilter();
    }
    if (e.key === 'Escape') {
        document.getElementById('taskInput').blur();
    }
});

// =============================================
// ===== LOAD DARK MODE PREFERENCE =====
// =============================================
function loadTheme() {
    const dark = localStorage.getItem('darkMode') === 'true';
    if (dark) {
        isDark = true;
        document.body.classList.add('dark');
        document.querySelector('.btn-theme i').className = 'fas fa-sun';
    }
}

// =============================================
// ===== INIT =====
// =============================================
loadTheme();
loadTasks();