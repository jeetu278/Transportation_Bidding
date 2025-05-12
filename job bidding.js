document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    // Set minimum datetime for deadline (current time + 1 hour)
    const deadlineInput = document.getElementById('deadline');
    const minDateTime = new Date();
    minDateTime.setHours(minDateTime.getHours() + 1);
    deadlineInput.min = minDateTime.toISOString().slice(0, 16);

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const pickup = document.getElementById('pickup').value.trim();
        const dropoff = document.getElementById('dropoff').value.trim();
        const weight = parseFloat(document.getElementById('weight').value);
        const deadline = new Date(document.getElementById('deadline').value);
        
        // Validation
        if (!validateInputs(pickup, dropoff, weight, deadline)) {
            return;
        }

        // Calculate bid details
        const bidDetails = calculateBidDetails(pickup, dropoff, weight, deadline);

        // Store bid in localStorage
        storeBid(pickup, dropoff, weight, deadline, bidDetails);

        // Show success message and redirect
        showSuccessAndRedirect();
    });
});

function validateInputs(pickup, dropoff, weight, deadline) {
    const currentTime = new Date();
    const errors = [];

    if (pickup.length < 3) {
        errors.push("Pickup location must be at least 3 characters long");
    }

    if (dropoff.length < 3) {
        errors.push("Drop-off location must be at least 3 characters long");
    }

    if (weight <= 0 || weight > 1000) {
        errors.push("Weight must be between 0 and 1000 kg");
    }

    if (deadline <= currentTime) {
        errors.push("Deadline must be in the future");
    }

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return false;
    }

    return true;
}

function calculateBidDetails(pickup, dropoff, weight, deadline) {
    // Basic price calculation (this should be more sophisticated in a real application)
    const basePrice = 50; // Base price in currency units
    const pricePerKg = 2; // Additional price per kg
    const urgencyFactor = calculateUrgencyFactor(deadline);
    
    const totalPrice = (basePrice + (weight * pricePerKg)) * urgencyFactor;
    
    return {
        estimatedPrice: totalPrice.toFixed(2),
        estimatedTime: calculateEstimatedTime(pickup, dropoff),
        bidId: generateBidId(),
        timestamp: new Date().toISOString()
    };
}

function calculateUrgencyFactor(deadline) {
    const now = new Date();
    const hoursUntilDeadline = (deadline - now) / (1000 * 60 * 60);
    
    if (hoursUntilDeadline < 24) {
        return 1.5; // Rush fee
    } else if (hoursUntilDeadline < 48) {
        return 1.25; // Express fee
    }
    return 1; // Standard fee
}

function calculateEstimatedTime(pickup, dropoff) {
    // This should be replaced with actual distance/time calculation
    // Perhaps using a mapping API in a real application
    return "2-3 hours"; // Placeholder
}

function generateBidId() {
    return 'BID-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function storeBid(pickup, dropoff, weight, deadline, bidDetails) {
    const bid = {
        pickup,
        dropoff,
        weight,
        deadline: deadline.toISOString(),
        ...bidDetails
    };

    // Get existing bids or initialize empty array
    const existingBids = JSON.parse(localStorage.getItem('bids')) || [];
    
    // Add new bid
    existingBids.push(bid);
    
    // Store updated bids
    localStorage.setItem('bids', JSON.stringify(existingBids));
}

function showSuccessAndRedirect() {
    // Create and show success message
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #4CAF50;
        color: white;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
        z-index: 1000;
    `;
    successMessage.textContent = 'Bid placed successfully! Redirecting to real-time tracking...';
    document.body.appendChild(successMessage);

    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'realtime.html';
    }, 2000);
}

// Optional: Add location autocomplete functionality
function initializeLocationInputs() {
    const pickupInput = document.getElementById('pickup');
    const dropoffInput = document.getElementById('dropoff');

    pickupInput.addEventListener('input', function() {
        // Add debounce to avoid too many suggestions
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            // Here you would typically call a location suggestion API
            console.log('Searching for location:', this.value);
        }, 300);
    });

    dropoffInput.addEventListener('input', function() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            console.log('Searching for location:', this.value);
        }, 300);
    });
}

// Initialize location inputs when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLocationInputs);
