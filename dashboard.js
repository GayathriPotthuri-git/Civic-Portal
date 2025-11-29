// Check if user is logged in, if not redirect to login
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html';
}

// Display user info in dashboard
document.addEventListener('DOMContentLoaded', function() {
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || '';
    
    // Update welcome message and profile info
    const welcomeElements = document.querySelectorAll('.user-info span');
    welcomeElements.forEach(el => {
        el.textContent = `Welcome, ${userName}!`;
    });
    
    // Update profile section
    const profileName = document.querySelector('.profile-info h2');
    const profileEmail = document.querySelector('.profile-info .user-email');
    
    if (profileName) profileName.textContent = userName;
    if (profileEmail) profileEmail.textContent = userEmail;

    // Update profile details
    const profileFullname = document.getElementById('profile-fullname');
    const profileEmailDetail = document.getElementById('profile-email');
    
    if (profileFullname) profileFullname.textContent = userName;
    if (profileEmailDetail) profileEmailDetail.textContent = userEmail;

    // Update activity stats
    updateActivityStats();
    
    // Initialize complaints list when page loads
    loadComplaintsList();
});

// Update activity statistics
function updateActivityStats() {
    const complaints = JSON.parse(localStorage.getItem('userComplaints')) || [];
    
    const totalIssues = complaints.length;
    const resolvedIssues = complaints.filter(c => c.status === 'Resolved').length;
    const progressIssues = complaints.filter(c => c.status === 'In Progress').length;
    const pendingIssues = complaints.filter(c => c.status === 'Submitted').length;
    
    // Update the stats display
    const totalElement = document.getElementById('total-issues');
    const resolvedElement = document.getElementById('resolved-issues');
    const progressElement = document.getElementById('progress-issues');
    const pendingElement = document.getElementById('pending-issues');
    
    if (totalElement) totalElement.textContent = totalIssues;
    if (resolvedElement) resolvedElement.textContent = resolvedIssues;
    if (progressElement) progressElement.textContent = progressIssues;
    if (pendingElement) pendingElement.textContent = pendingIssues;
}

// Dashboard functionality
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav item
    event.currentTarget.classList.add('active');
    
    // Update section title
    updateSectionTitle(sectionId);
    
    // Load section-specific content
    loadSectionContent(sectionId);
}

function updateSectionTitle(sectionId) {
    const titles = {
        'profile': 'User Profile',
        'raise-issue': 'Raise New Issue',
        'status': 'Issue Status',
        'help-desk': 'Help Desk',
        'history': 'Complaint History'
    };
    
    document.getElementById('section-title').textContent = titles[sectionId] || 'Dashboard';
}

function loadSectionContent(sectionId) {
    switch(sectionId) {
        case 'raise-issue':
            loadComplaintForm();
            break;
        case 'status':
            loadComplaintsList();
            break;
        case 'history':
            loadHistory();
            break;
    }
}

function loadComplaintForm() {
    const container = document.getElementById('complaint-form-container');
    if (!container.innerHTML.trim()) {
        // Load your existing complaint form here
        container.innerHTML = `
            <div class="complaint-form-wrapper">
                <form id="complaint-form" class="complaint-form">
                    <div class="form-group">
                        <label for="description">Describe the Issue:</label>
                        <textarea id="description" placeholder="E.g., Large pothole on Main Street." required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="department">Select Department:</label>
                        <select id="department" required>
                            <option value="">Choose Department</option>
                            <option value="Public Works">Public Works (potholes, lights)</option>
                            <option value="Sanitation">Sanitation (garbage)</option>
                            <option value="Utilities">Utilities (water leaks)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="location">Location:</label>
                        <input type="text" id="location" placeholder="Address or GPS" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="priority">Priority Level:</label>
                        <select id="priority">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="images">Upload Images:</label>
                        <input type="file" id="images" accept="image/*" multiple>
                    </div>
                    
                    <button type="submit" class="submit-btn">
                        <i class="fas fa-paper-plane"></i> Submit Complaint
                    </button>
                </form>
            </div>
        `;
        
        // Add event listener to the new form
        document.getElementById('complaint-form').addEventListener('submit', handleComplaintSubmit);
    }
}

function handleComplaintSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const complaintId = generateComplaintId();
        const complaintData = {
            id: complaintId,
            description: document.getElementById('description').value,
            department: document.getElementById('department').value,
            location: document.getElementById('location').value,
            priority: document.getElementById('priority').value,
            status: 'Submitted',
            date: new Date().toLocaleString(),
            timestamp: Date.now()
        };
        
        // Save to localStorage
        saveComplaint(complaintData);
        
        // Reset form
        e.target.reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Update activity stats
        updateActivityStats();
        
        // Show success popup and return to dashboard
        showSuccessPopup(complaintId);
        
    }, 1500);
}

// Show success popup message
function showSuccessPopup(complaintId) {
    // Create popup overlay
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    popupOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    popupContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
    `;
    
    popupContent.innerHTML = `
        <div class="popup-icon" style="font-size: 48px; color: #28a745; margin-bottom: 20px;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2 style="color: #28a745; margin-bottom: 15px;">Issue Reported Successfully!</h2>
        <p style="margin-bottom: 20px; color: #666; font-size: 16px;">
            Your complaint has been submitted successfully.
        </p>
        <p style="margin-bottom: 25px; background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace;">
            <strong>Complaint ID:</strong><br>${complaintId}
        </p>
        <button onclick="closePopupAndReturn()" class="popup-ok-btn" style="
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s ease;
        ">
            <i class="fas fa-check"></i> OK
        </button>
    `;
    
    // Add hover effect for button
    const style = document.createElement('style');
    style.textContent = `
        .popup-ok-btn:hover {
            background: #218838 !important;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
    
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);
    
    // Add animation
    popupContent.style.animation = 'popIn 0.5s ease-out';
}

// Close popup and return to dashboard (Profile section)
function closePopupAndReturn() {
    // Remove popup
    const popup = document.querySelector('.popup-overlay');
    if (popup) {
        popup.style.animation = 'popOut 0.3s ease-in';
        setTimeout(() => {
            popup.remove();
        }, 300);
    }
    
    // Return to Profile section in dashboard
    showSection('profile');
    
    // Show a small notification in the dashboard
    showNotification('Complaint submitted successfully! You can check status in the Status section.', 'success');
}

function generateComplaintId() {
    return 'CMP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

function saveComplaint(complaintData) {
    let complaints = JSON.parse(localStorage.getItem('userComplaints')) || [];
    complaints.push(complaintData);
    localStorage.setItem('userComplaints', JSON.stringify(complaints));
}

function loadComplaintsList() {
    const container = document.getElementById('complaints-list');
    const complaints = JSON.parse(localStorage.getItem('userComplaints')) || [];
    
    if (complaints.length === 0) {
        container.innerHTML = `
            <div class="no-complaints">
                <i class="fas fa-inbox"></i>
                <h3>No Complaints Found</h3>
                <p>You haven't submitted any complaints yet.</p>
                <button onclick="showSection('raise-issue')" class="primary-btn">
                    <i class="fas fa-plus"></i> Raise Your First Issue
                </button>
            </div>
        `;
        return;
    }
    
    // Sort complaints by timestamp (newest first)
    complaints.sort((a, b) => b.timestamp - a.timestamp);
    
    container.innerHTML = complaints.map(complaint => `
        <div class="complaint-card" id="complaint-${complaint.id}">
            <div class="complaint-header">
                <span class="complaint-id">${complaint.id}</span>
                <span class="complaint-status status-${complaint.status.toLowerCase().replace(' ', '-')}">
                    ${complaint.status}
                </span>
            </div>
            <div class="complaint-details">
                <p><strong>Description:</strong> ${complaint.description}</p>
                <p><strong>Department:</strong> ${complaint.department}</p>
                <p><strong>Location:</strong> ${complaint.location}</p>
                <p><strong>Priority:</strong> <span class="priority-${complaint.priority}">${complaint.priority}</span></p>
                <p><strong>Submitted:</strong> ${complaint.date}</p>
            </div>
            <div class="complaint-actions">
                <button class="action-btn" onclick="updateComplaintStatus('${complaint.id}', 'In Progress')">
                    <i class="fas fa-play-circle"></i>  In Progress
                </button>
                <button class="action-btn resolved" onclick="updateComplaintStatus('${complaint.id}', 'Resolved')">
                    <i class="fas fa-check-circle"></i>  Resolved
                </button>
            </div>
        </div>
    `).join('');
}

// Update complaint status
function updateComplaintStatus(complaintId, newStatus) {
    let complaints = JSON.parse(localStorage.getItem('userComplaints')) || [];
    const complaintIndex = complaints.findIndex(c => c.id === complaintId);
    
    if (complaintIndex !== -1) {
        complaints[complaintIndex].status = newStatus;
        complaints[complaintIndex].updatedAt = new Date().toLocaleString();
        localStorage.setItem('userComplaints', JSON.stringify(complaints));
        
        showNotification(`Complaint ${complaintId} marked as ${newStatus}`, 'success');
        loadComplaintsList();
        updateActivityStats();
    }
}

function searchComplaint() {
    const searchId = document.getElementById('search-complaint-id').value.trim();
    const complaints = JSON.parse(localStorage.getItem('userComplaints')) || [];
    const container = document.getElementById('complaints-list');
    
    if (!searchId) {
        loadComplaintsList();
        return;
    }
    
    const filteredComplaints = complaints.filter(complaint => 
        complaint.id.toLowerCase().includes(searchId.toLowerCase())
    );
    
    if (filteredComplaints.length === 0) {
        container.innerHTML = `
            <div class="no-complaints">
                <i class="fas fa-search"></i>
                <h3>No Matching Complaints</h3>
                <p>No complaints found with ID: ${searchId}</p>
                <button onclick="loadComplaintsList()" class="primary-btn">
                    <i class="fas fa-list"></i> Show All Complaints
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredComplaints.map(complaint => `
        <div class="complaint-card" id="complaint-${complaint.id}">
            <div class="complaint-header">
                <span class="complaint-id">${complaint.id}</span>
                <span class="complaint-status status-${complaint.status.toLowerCase().replace(' ', '-')}">
                    ${complaint.status}
                </span>
            </div>
            <div class="complaint-details">
                <p><strong>Description:</strong> ${complaint.description}</p>
                <p><strong>Department:</strong> ${complaint.department}</p>
                <p><strong>Location:</strong> ${complaint.location}</p>
                <p><strong>Priority:</strong> <span class="priority-${complaint.priority}">${complaint.priority}</span></p>
                <p><strong>Submitted:</strong> ${complaint.date}</p>
                ${complaint.updatedAt ? `<p><strong>Last Updated:</strong> ${complaint.updatedAt}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function filterComplaints(status) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    const complaints = JSON.parse(localStorage.getItem('userComplaints')) || [];
    const container = document.getElementById('complaints-list');
    
    let filteredComplaints = complaints;
    if (status !== 'all') {
        filteredComplaints = complaints.filter(complaint => 
            complaint.status.toLowerCase().replace(' ', '-') === status
        );
    }
    
    if (filteredComplaints.length === 0) {
        container.innerHTML = `
            <div class="no-complaints">
                <i class="fas fa-filter"></i>
                <h3>No Complaints Found</h3>
                <p>No complaints match the selected filter.</p>
                <button onclick="loadComplaintsList()" class="primary-btn">
                    <i class="fas fa-list"></i> Show All Complaints
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredComplaints.map(complaint => `
        <div class="complaint-card" id="complaint-${complaint.id}">
            <div class="complaint-header">
                <span class="complaint-id">${complaint.id}</span>
                <span class="complaint-status status-${complaint.status.toLowerCase().replace(' ', '-')}">
                    ${complaint.status}
                </span>
            </div>
            <div class="complaint-details">
                <p><strong>Description:</strong> ${complaint.description}</p>
                <p><strong>Department:</strong> ${complaint.department}</p>
                <p><strong>Location:</strong> ${complaint.location}</p>
                <p><strong>Priority:</strong> <span class="priority-${complaint.priority}">${complaint.priority}</span></p>
                <p><strong>Submitted:</strong> ${complaint.date}</p>
            </div>
        </div>
    `).join('');
}

function loadHistory() {
    const container = document.getElementById('history-list');
    const complaints = JSON.parse(localStorage.getItem('userComplaints')) || [];
    
    if (complaints.length === 0) {
        container.innerHTML = `
            <div class="no-complaints">
                <i class="fas fa-history"></i>
                <h3>No History Available</h3>
                <p>You haven't submitted any complaints yet.</p>
            </div>
        `;
        return;
    }
    
    // Group complaints by date
    const groupedComplaints = complaints.reduce((groups, complaint) => {
        const date = complaint.date.split(',')[0]; // Get date part only
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(complaint);
        return groups;
    }, {});
    
    container.innerHTML = Object.entries(groupedComplaints).map(([date, dayComplaints]) => `
        <div class="history-day">
            <h3 class="history-date">${date}</h3>
            ${dayComplaints.map(complaint => `
                <div class="history-item">
                    <div class="history-item-header">
                        <span class="complaint-id">${complaint.id}</span>
                        <span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">
                            ${complaint.status}
                        </span>
                    </div>
                    <p class="complaint-description">${complaint.description}</p>
                    <div class="history-item-details">
                        <span><i class="fas fa-building"></i> ${complaint.department}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${complaint.location}</span>
                        <span><i class="fas fa-flag"></i> ${complaint.priority}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}