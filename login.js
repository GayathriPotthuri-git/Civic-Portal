// Check if user is already logged in - but don't auto-redirect if they want to login again
if (localStorage.getItem('isLoggedIn') === 'true' && !window.location.hash.includes('login')) {
    window.location.href = 'dashboard.html';
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation - in real app, you'd check against a database
    if (email && password) {
        // Store login state and user info
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', email.split('@')[0]); // Simple username from email
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Logging in...';
        submitBtn.disabled = true;
        
        // Simulate login process
        setTimeout(() => {
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } else {
        alert('Please enter both email and password');
    }
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (name && email && password) {
        // Store user data and login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Creating account...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Account created successfully!');
            window.location.href = 'dashboard.html';
        }, 1000);
    }
});

// Toggle between login and signup forms
function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Force login function - clear existing data and allow new login
function forceLogin() {
    // Clear all login data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userComplaints'); // Optional: clear complaints too
    
    // Show confirmation
    alert('Previous login data cleared. You can now login with new credentials.');
    
    // Refresh the page
    location.reload();
}

// Demo credentials info (optional - for testing)
function showDemoCredentials() {
    alert('Demo Credentials:\n\nEmail: user@example.com\nPassword: any password will work\n\nThis is a demo - no real authentication.');
}

// Add demo info link (optional)
document.addEventListener('DOMContentLoaded', function() {
    // Add demo info link to login form
    const loginForm = document.getElementById('loginForm');
    const demoLink = document.createElement('p');
    demoLink.className = 'center';
    demoLink.innerHTML = '<a href="#" onclick="showDemoCredentials()" style="font-size: 12px; color: #0078FF;">Demo Login Info</a>';
    loginForm.appendChild(demoLink);
});