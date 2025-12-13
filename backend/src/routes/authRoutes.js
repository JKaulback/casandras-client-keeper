const express = require('express');
const passport = require('passport');
const googleAuthHandler = require('../config/googleAuth');
const mobileDevSuccess = require('../templates/mobileDevSuccess');
const mobileProdSuccess = require('../templates/mobileProdSuccess');
const webSuccess = require('../templates/webSuccess');

const router = express.Router();

// Initiate Google OAuth
router.get('/google', (req, res, next) => {
    // Preserve the mobile parameter and redirectUri through the OAuth flow
    const isMobile = req.query.mobile === 'true';
    const redirectUri = req.query.redirectUri;
    
    let state = '';
    if (isMobile) {
        state = 'mobile=true';
        if (redirectUri) {
            state += `&redirectUri=${encodeURIComponent(redirectUri)}`;
        }
    }
    
    const authenticateOptions = {
        scope: ['profile', 'email'],
        session: false,
        state: state || undefined
    };
    
    console.log('Initiating Google auth with state:', state);
    passport.authenticate('google', authenticateOptions)(req, res, next);
});

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/api/auth/failure'
    }),
    (req, res) => {
        const token = googleAuthHandler.generateToken(req.user);
        
        // Check if mobile from state parameter or user agent
        const stateStr = String(req.query.state || '');
        const isMobile = stateStr.includes('mobile=true') ||
                        stateStr.includes('mobile%3Dtrue') ||
                        req.headers['user-agent']?.includes('Expo') ||
                        req.headers['user-agent']?.includes('okhttp');

        console.log('Auth callback - isMobile:', isMobile, 'state:', req.query.state, 'user-agent:', req.headers['user-agent']);

        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JS access
            secure: process.env.NODE_ENV === 'production', // HTTPS in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' required for cross-origin in production
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days to match JWT expiry
        });
        
        if (isMobile) {
            // For mobile, get the redirect URI from state or use default
            // The state format is "mobile=true&redirectUri=..."
            let redirectUri = process.env.MOBILE_REDIRECT_URI || 'casandras://auth/callback';
            
            console.log('=== MOBILE AUTH CALLBACK ===');
            console.log('State:', req.query.state);
            
            // Try to extract redirectUri from state parameter
            if (req.query.state && req.query.state.includes('redirectUri=')) {
                const match = req.query.state.match(/redirectUri=([^&]+)/);
                if (match) {
                    redirectUri = decodeURIComponent(match[1]);
                    console.log('Extracted redirectUri from state:', redirectUri);
                }
            }
            
            const isDevelopment = redirectUri.includes('exp+frontend') || 
                                 redirectUri.includes('expo-development') ||
                                 redirectUri.includes('exp://localhost') ||
                                 redirectUri.includes('exp://192.168');
            console.log('Is development mode:', isDevelopment);
            
            const redirectUrl = `${redirectUri}?token=${token}`; // With the jwt as a query param
            
            // For Expo development, the redirect won't work from Chrome Custom Tabs
            // Store token temporarily so app can retrieve it
            if (isDevelopment) {
                console.log('Final redirect URL:', redirectUrl);
                console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
                console.log('===========================');
                // Store the token with user's email as key for retrieval
                const userEmail = req.user.email;
                global.devTokens = global.devTokens || {};
                global.devTokens[userEmail] = {
                    token: token,
                    timestamp: Date.now()
                };
                // Also store as "latest" for easier retrieval
                global.devTokens['__latest__'] = {
                    token: token,
                    email: userEmail,
                    timestamp: Date.now()
                };
                
                console.log('Stored dev token for:', userEmail);
                
                res.send(mobileDevSuccess(userEmail));
                return;
            }
            
            // For production builds with proper deep links
            // Send HTML page with redirect link
            res.send(mobileProdSuccess(redirectUrl));
        } else {
            // For web, send HTML that closes the popup and notifies the parent window
            res.send(webSuccess(token));
        }
    }
);

// Failure route
router.get('/failure', (req, res) => {
    res.status(401).json({ error: 'Authentication failed' });
});

// Development token retrieval endpoint
router.get('/dev-token/:email', (req, res) => {
    const email = req.params.email;
    
    // Only allow in development/test environments
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'This endpoint is only available in development' });
    }
    
    // Check if token exists
    if (!global.devTokens || !global.devTokens[email]) {
        return res.status(404).json({ error: 'Token not found or expired' });
    }
    
    const tokenData = global.devTokens[email];
    
    // Check if token is expired (5 minutes)
    const now = Date.now();
    const age = now - tokenData.timestamp;
    if (age > 5 * 60 * 1000) {
        delete global.devTokens[email];
        return res.status(404).json({ error: 'Token expired' });
    }
    
    // Return token and delete it (one-time use)
    const token = tokenData.token;
    delete global.devTokens[email];
    
    res.json({ token });
});

// Development: Get latest token (no email required)
router.get('/dev-token-latest', (req, res) => {
    // Only allow in development/test environments
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'This endpoint is only available in development' });
    }
    
    // Check if token exists
    if (!global.devTokens || !global.devTokens['__latest__']) {
        return res.status(404).json({ error: 'No token available' });
    }
    
    const tokenData = global.devTokens['__latest__'];
    
    // Check if token is expired (5 minutes)
    const now = Date.now();
    const age = now - tokenData.timestamp;
    if (age > 5 * 60 * 1000) {
        delete global.devTokens['__latest__'];
        delete global.devTokens[tokenData.email];
        return res.status(404).json({ error: 'Token expired' });
    }
    
    // Return token and delete it (one-time use)
    const token = tokenData.token;
    const email = tokenData.email;
    delete global.devTokens['__latest__'];
    delete global.devTokens[email];
    
    res.json({ token, email });
});

// Token verification endpoint
router.post('/verify', (req, res) => {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    const decoded = googleAuthHandler.verifyToken(token);

    if (decoded) {
        res.json({ valid: true, user: decoded });
    } else {
        res.status(401).json({ valid: false, error: 'Invalid token' });
    }
});

module.exports = router;
