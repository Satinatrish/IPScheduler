const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

const USERS_FILE = path.join(__dirname, 'users.json');

// Helper to read users
function readUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
}

// Helper to write users
function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Login Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid email or password.' });
    }
});

// Signup Endpoint
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const users = readUsers();

    if (users.some((u) => u.email === email)) {
        return res.json({ success: false, message: 'Email already exists.' });
    }

    users.push({ name, email, password });
    writeUsers(users);
    res.json({ success: true });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});