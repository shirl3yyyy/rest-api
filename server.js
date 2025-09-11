// Load environment variables
require('dotenv').config({ path: './config/.env' });

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('DB Error:', err));

// Import User model
const User = require('./models/User');

// Routes
// @desc Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc Add a new user
app.post('/users', async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc Delete user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'User updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }  
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
});
