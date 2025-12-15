const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

// Initiate Google OAuth
router.get('/google', authController.initiateGoogleAuth);

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/api/auth/failure'
    }),
    authController.googleCallback
);

// Authentication failure
router.get('/failure', authController.failure);

// Development token retrieval
router.get('/dev-token/:email', authController.getDevToken);
router.get('/dev-token-latest', authController.getDevTokenLatest);

// Token verification
router.post('/verify', authController.verifyToken);

module.exports = router;
