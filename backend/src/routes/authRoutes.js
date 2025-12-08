const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const googleAuthHandler = require('../config/googleAuth');

const router = express.Router();

// Configure Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await googleAuthHandler.findOrCreateUser(profile);
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// Initiate Google OAuth
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/auth/failure'
    }),
    (req, res) => {
        const token = googleAuthHandler.generateToken(req.user);

        // Redirect to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JS access
            secure: process.env.NODE_ENV === 'production', // HTTPS in production
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        res.redirect(`${frontendUrl}/auth/callback`);
    }
);

// Failure route
router.get('/failure', (req, res) => {
    res.status(401).json({ error: 'Authentication failed' });
});

// Token verification endpoint
router.post('/verify', (req, res) => {
    const token = req.cookies.token;
    const decoded = googleAuthHandler.verifyToken(token);

    if (decoded) {
        res.json({ valid: true, user: decoded });
    } else {
        res.status(401).json({ valid: false, error: 'Invalid token' });
    }
});

module.exports = router;
