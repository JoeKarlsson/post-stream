'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Op } = require('sequelize');
const db = require('./../models');
const User = db.User;

// Configure Passport Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }

        if (!user.isActive) {
            return done(null, false, { message: 'Account is deactivated' });
        }

        const isValidPassword = await user.validatePassword(password);

        if (!isValidPassword) {
            return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Generate JWT token
const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is required');
    }

    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, first_name, last_name, bio } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'User with this email or username already exists'
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            first_name,
            last_name,
            bio
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login user
router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Login failed' });
        }

        if (!user) {
            return res.status(401).json({ error: info.message });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            token,
            user: user.toJSON()
        });
    })(req, res, next);
});

// Get current user profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        success: true,
        user: req.user.toJSON()
    });
});

// Update user profile
router.put('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { first_name, last_name, bio } = req.body;

        await req.user.update({
            first_name,
            last_name,
            bio
        });

        res.json({
            success: true,
            user: req.user.toJSON()
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Profile update failed' });
    }
});

// Change password
router.put('/change-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate current password
        const isValidPassword = await req.user.validatePassword(currentPassword);

        if (!isValidPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Update password
        await req.user.update({ password: newPassword });

        res.json({ success: true });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ error: 'Password change failed' });
    }
});

// Get user profile by username
router.get('/user/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({
            where: { username: username },
            attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'createdAt']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
});

module.exports = router;
