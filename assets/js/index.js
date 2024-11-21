function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    openModal(targetModalId);
}

function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function toggleDetails(id) {
    const section = document.getElementById(id);
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// Login Functionality
document.querySelector('#loginModal form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
        localStorage.setItem('loggedInUserEmail', data.email);
        closeModal('loginModal');
        window.location.href = '../../pages/dashboard.html'; // Redirect to dashboard
    } else {
        alert(data.message);
    }
    
});

// Signup Functionality
document.querySelector('#signupModal form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (data.success) {
        alert('Signup successful! You can now log in.');
        switchModal('signupModal', 'loginModal');
    } else {
        alert(data.message);
    }
});
document.querySelector('#loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    // Send login request to server
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
    if (data.success) {
      // Store the logged-in user's email in localStorage
      localStorage.setItem('loggedInUserEmail', data.email);
  
      // Close the modal and update the UI (you can also redirect to a dashboard page)
      closeModal('loginModal');
      fetchLoggedInUser(); // Fetch and display the logged-in user's name
    } else {
      alert(data.message); // Show error message if login fails
    }
  });
  // Fetch and display the logged-in user's name from localStorage
function fetchLoggedInUser() {
    const email = localStorage.getItem('loggedInUserEmail');
    if (email) {
        fetch('/get-user', { // You will need a new route for this
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('username').textContent = data.name; // Update username in the UI
            }
        });
    }
}

  