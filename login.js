document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    // Basic validation
    if (!email || !password) {
        messageElement.style.color = 'red';
        messageElement.textContent = 'Please enter both email and password';
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Login successful
        messageElement.style.color = 'green';
        messageElement.textContent = 'Login successful! Redirecting...';

        // Store login status (optional)
        localStorage.setItem('loggedInUser', JSON.stringify({
            name: user.name,
            email: user.email
        }));

        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
    } else {
        // Login failed
        messageElement.style.color = 'red';
        messageElement.textContent = 'Invalid email or password';

        // Clear password field
        document.getElementById('password').value = '';
    }
});

// Optional: Add password visibility toggle
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    
    // Create password toggle button
    // const toggleButton = document.createElement('button');
    // toggleButton.type = 'button';
    // toggleButton.textContent = 'Show';
    // toggleButton.style.marginLeft = '10px';
    
    passwordInput.parentNode.insertBefore(toggleButton, passwordInput.nextSibling);
    
    toggleButton.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.textContent = 'Hide';
        } else {
            passwordInput.type = 'password';
            toggleButton.textContent = 'Show';
        }
    });
});

// Optional: Add auto-logout when browser is closed
window.onbeforeunload = function() {
    localStorage.removeItem('loggedInUser');
};
