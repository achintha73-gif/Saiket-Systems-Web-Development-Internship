
let posts = [];
let editId = null;

// Load posts from localStorage
function loadPosts() {
    const stored = localStorage.getItem('blogPosts');
    if (stored) {
        posts = JSON.parse(stored);
    } else {
        // Default posts
        posts = [
            {
                id: Date.now() - 86400000,
                title: "Getting Started with Web Development",
                author: "Achintha Buddhima",
                category: "Technology",
                content: "Web development is an exciting field that combines creativity with technical skills. In this post, we'll explore the fundamentals of HTML, CSS, and JavaScript...",
                date: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: Date.now() - 172800000,
                title: "5 Tips for Better UI/UX Design",
                author: "Achintha Buddhima",
                category: "Lifestyle",
                content: "User experience is at the heart of every successful digital product. Here are 5 practical tips to improve your UI/UX design skills...",
                date: new Date(Date.now() - 172800000).toISOString()
            }
        ];
        savePosts();
    }
    renderPosts();
}

// Save posts to localStorage
function savePosts() {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}


function renderPosts() {
    const grid = document.getElementById('blogGrid');
    const empty = document.getElementById('emptyState');
    const total = document.getElementById('totalPosts');

    total.textContent = posts.length;

    if (posts.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        document.getElementById('lastPost').textContent = '-';
        return;
    }

    empty.style.display = 'none';

    // Sort by date (newest first)
    const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update last post
    const lastDate = new Date(sorted[0].date);
    document.getElementById('lastPost').textContent = lastDate.toLocaleDateString();

    grid.innerHTML = sorted.map(post => `
        <div class="post-card" data-id="${post.id}">
            <div class="post-header">
                <span class="post-category">${post.category || 'General'}</span>
                <span class="post-date">${formatDate(post.date)}</span>
            </div>
            <h3>${escapeHtml(post.title)}</h3>
            <p class="post-excerpt">${escapeHtml(post.content.substring(0, 120))}...</p>
            <div class="post-author">
                <i class="fas fa-user"></i> ${escapeHtml(post.author)}
            </div>
            <div class="post-actions">
                <button class="btn-edit" onclick="openEditModal('${post.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deletePost('${post.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <button class="btn-view" onclick="viewPost('${post.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `).join('');
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}


// ESCAPE HTML 
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// MODAL FUNCTIONS 
function openModal() {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-pen-fancy"></i> Create New Post';
    document.getElementById('saveBtnText').textContent = 'Publish Post';
    document.getElementById('editId').value = '';
    document.getElementById('postForm').reset();
    document.getElementById('postTitle').focus();
    editId = null;
}

function openEditModal(id) {
    const post = posts.find(p => p.id == id);
    if (!post) return;

    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Post';
    document.getElementById('saveBtnText').textContent = 'Update Post';
    document.getElementById('editId').value = id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postAuthor').value = post.author;
    document.getElementById('postCategory').value = post.category || 'Technology';
    document.getElementById('postContent').value = post.content;
    editId = id;
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    editId = null;
}

function closeModalOutside(event) {
    if (event.target === event.currentTarget) {
        closeModal();
    }
}


//  SAVE POST 

function savePost(event) {
    event.preventDefault();

    const title = document.getElementById('postTitle').value.trim();
    const author = document.getElementById('postAuthor').value.trim();
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value.trim();

    if (!title || !author || !content) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const editIdValue = document.getElementById('editId').value;

    if (editIdValue) {
        // Edit existing post
        const index = posts.findIndex(p => p.id == editIdValue);
        if (index !== -1) {
            posts[index] = {
                ...posts[index],
                title,
                author,
                category,
                content,
                date: new Date().toISOString()
            };
            showToast('Post updated successfully!');
        }
    } else {
        // Create new post
        const newPost = {
            id: Date.now(),
            title,
            author,
            category,
            content,
            date: new Date().toISOString()
        };
        posts.unshift(newPost);
        showToast('Post published successfully! 🎉');
    }

    savePosts();
    renderPosts();
    closeModal();
}

// DELETE POST
function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        posts = posts.filter(p => p.id != id);
        savePosts();
        renderPosts();
        showToast('Post deleted successfully!');
    }
}


//  VIEW POST 
function viewPost(id) {
    const post = posts.find(p => p.id == id);
    if (!post) return;

    alert(`📝 ${post.title}\n\n👤 Author: ${post.author}\n📂 Category: ${post.category || 'General'}\n📅 Date: ${new Date(post.date).toLocaleString()}\n\n${post.content}`);
}


function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');

    toastMsg.textContent = message;

    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = '#e94560';
    } else {
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#10b981';
    }

    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape') {
        if (document.getElementById('modalOverlay').classList.contains('active')) {
            closeModal();
        }
    }
    // Ctrl+N to open new post
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openModal();
    }
});

loadPosts();