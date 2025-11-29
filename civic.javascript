// Generate unique ID
function generateID() {
    return 'CMP-' + Date.now();
}

// Submit form
document.getElementById('complaint-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = generateID();
    const data = {
        description: document.getElementById('description').value,
        department: document.getElementById('department').value,
        location: document.getElementById('location').value,
        status: 'Submitted'
    };
    localStorage.setItem(id, JSON.stringify(data));
    alert('Submitted! Your ID: ' + id);
    this.reset();
});

// Check status
function checkStatus() {
    const id = document.getElementById('complaint-id').value;
    const data = localStorage.getItem(id);
    const msg = document.getElementById('status-message');
    if (data) {
        const parsed = JSON.parse(data);
        msg.textContent = Status: ${parsed.status} | Dept: ${parsed.department} | Loc: ${parsed.location};
        msg.style.color = 'green';
    } else {
        msg.textContent = 'ID not found.';
        msg.style.color = 'red';
    }
}