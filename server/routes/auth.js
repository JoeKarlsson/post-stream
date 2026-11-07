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

// Register new user (invalid fields come back as 400 from the error handler in server.js)
router.post('/register', async (req, res) => {
    const { username, email, password, first_name, last_name, bio } = req.body;

    const existingUser = await User.findOne({
        where: { [Op.or]: [{ email }, { username }] }
    });
    if (existingUser) {
        return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    const user = await User.create({ username, email, password, first_name, last_name, bio });
    res.status(201).json({ success: true, token: generateToken(user), user: user.toJSON() });
});

// Login user
router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
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
    const { first_name, last_name, bio } = req.body;
    await req.user.update({ first_name, last_name, bio });
    res.json({ success: true, user: req.user.toJSON() });
});

// Change password
router.put('/change-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!(await req.user.validatePassword(currentPassword))) {
        return res.status(400).json({ error: 'Current password is incorrect' });
    }
    await req.user.update({ password: newPassword });
    res.json({ success: true });
});

const PUBLIC_USER_FIELDS = ['id', 'username', 'first_name', 'last_name', 'bio', 'createdAt'];

const findUserByUsername = (username) =>
    User.findOne({ where: { username }, attributes: PUBLIC_USER_FIELDS });

// Public profile: no email; follower/following usernames so the client can show counts and follow state
router.get('/user/:username', async (req, res) => {
    const user = await User.findOne({
        where: { username: req.params.username },
        attributes: PUBLIC_USER_FIELDS,
        include: [
            { model: User, as: 'followers', attributes: ['username'], through: { attributes: [] } },
            { model: User, as: 'following', attributes: ['username'], through: { attributes: [] } }
        ]
    });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { followers, following, ...profile } = user.toJSON();
    res.json({
        success: true,
        user: {
            ...profile,
            followers: followers.map((f) => f.username),
            following: following.map((f) => f.username)
        }
    });
});

// Everyone on PostStream, alphabetically: the way to find people now that
// there's no global feed. Names only, no counts.
router.get('/users', async (req, res) => {
    const users = await User.findAll({
        attributes: ['username', 'first_name', 'last_name'],
        order: [['username', 'ASC']]
    });
    res.json(users);
});

router.post('/user/:username/follow', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const target = await findUserByUsername(req.params.username);
    if (!target) {
        return res.status(404).json({ error: 'User not found' });
    }
    if (target.id === req.user.id) {
        return res.status(400).json({ error: 'You cannot follow yourself' });
    }
    await db.Follow.findOrCreate({ where: { followerId: req.user.id, followingId: target.id } });
    res.json({ success: true });
});

router.delete('/user/:username/follow', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const target = await findUserByUsername(req.params.username);
    if (!target) {
        return res.status(404).json({ error: 'User not found' });
    }
    await db.Follow.destroy({ where: { followerId: req.user.id, followingId: target.id } });
    res.json({ success: true });
});

module.exports = router;
