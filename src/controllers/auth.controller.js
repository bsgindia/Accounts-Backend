const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/auth.model.js');

exports.register = async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newAdmin = new Admin({
        email,
        password: hashedPassword,
        role
    });
    await newAdmin.save();
    res.status(201).json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await Admin.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    req.session.auth_token = token;
    res.status(200).json({
        message: 'Login successful',
        user: {
            email: user.email,
            role: user.role,
            token
        },
    });
};



exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};
