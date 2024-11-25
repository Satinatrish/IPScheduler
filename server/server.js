const express = require('express'); // Framework for handling HTTP requests
const fs = require('fs'); // For file system operations
const path = require('path'); // For file path management

// Server setup
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.static(path.join(__dirname, '..'))); // Serves static files

// OOP: Encapsulation and Abstraction through Classes

// Class to encapsulate user file operations (Encapsulation and Reusability)
class UserManager {
    constructor(usersFile) {
        this.usersFile = usersFile; // Encapsulation: Stores file path as a class property
    }

    // Method to read users from the file (Abstraction of file operations)
    readUsers() {
        if (!fs.existsSync(this.usersFile)) {
            return []; // Returns an empty array if the file doesn't exist
        }
        const data = fs.readFileSync(this.usersFile); // Reads the file synchronously
        return JSON.parse(data); // Parses and returns user data as JSON
    }

    // Method to write users to the file (Abstraction of file operations)
    writeUsers(users) {
        fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2)); // Writes data to file
    }
}

// Class to manage user-related operations (Encapsulation and Abstraction)
class UserService {
    constructor(userManager) {
        this.userManager = userManager; // Dependency Injection: UserManager instance
    }

    // Method to handle user login
    login(email, password) {
        const users = this.userManager.readUsers(); // Reads users from file
        return users.find((user) => user.email === email && user.password === password); // Finds matching user
    }

    // Method to handle user signup
    signup(name, email, password) {
        const users = this.userManager.readUsers(); // Reads existing users
        if (users.some((u) => u.email === email)) {
            throw new Error('Email already exists.'); // Prevents duplicate emails
        }
        users.push({ name, email, password }); // Adds new user
        this.userManager.writeUsers(users); // Saves updated user list to file
    }

    // Method to fetch a user's information by email
    getUser(email) {
        const users = this.userManager.readUsers(); // Reads users from file
        return users.find((u) => u.email === email); // Finds and returns the user
    }
}

// Path to the users file
const USERS_FILE = path.join(__dirname, 'users.json');

// OOP in Action: Creating Instances
const userManager = new UserManager(USERS_FILE); // Encapsulates file operations
const userService = new UserService(userManager); // Encapsulates user-related logic

// Routes

// Login Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = userService.login(email, password); // OOP: Using the `login` method of UserService

    if (user) {
        res.json({ success: true, name: user.name, email: user.email }); // Sends user data if login is successful
    } else {
        res.json({ success: false, message: 'Invalid email or password.' }); // Error response
    }
});

// Signup Endpoint
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    try {
        userService.signup(name, email, password); // OOP: Using the `signup` method of UserService
        res.json({ success: true }); // Success response
    } catch (error) {
        res.json({ success: false, message: error.message }); // Error response
    }
});

// Get User Endpoint
app.post('/get-user', (req, res) => {
    const { email } = req.body;
    const user = userService.getUser(email); // OOP: Using the `getUser` method of UserService

    if (user) {
        res.json({ success: true, name: user.name }); // Sends user name if found
    } else {
        res.json({ success: false, message: 'User not found' }); // Error response
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
