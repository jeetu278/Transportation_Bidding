document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    // Basic validation
    if (!name || !email || !password) {
        messageElement.style.color = 'red';
        messageElement.textContent = 'All fields are required';
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        messageElement.style.color = 'red';
        messageElement.textContent = 'Please enter a valid email address';
        return;
    }

    // Password validation (minimum 8 characters)
    if (password.length < 8) {
        messageElement.style.color = 'red';
        messageElement.textContent = 'Password must be at least 8 characters long';
        return;
    }

    // Store user data in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        messageElement.style.color = 'red';
        messageElement.textContent = 'Email already registered';
        return;
    }

    // Add new user
    users.push({
        name: name,
        email: email,
        password: password // Note: In a real application, password should be hashed
    });

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message
    messageElement.style.color = 'green';
    messageElement.textContent = 'Sign up successful! Redirecting...';

    // Redirect to login page after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
});
