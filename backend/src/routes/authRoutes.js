const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const googleAuthHandler = require('../config/googleAuth');

const router = express.Router();

// Configure Google Strategy with dynamic callback
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
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
        failureRedirect: '/api/auth/failure'
    }),
    (req, res) => {
        const token = googleAuthHandler.generateToken(req.user);
        
        // Determine if mobile based on user agent or query parameter
        const isMobile = req.query.mobile === 'true' || 
                        req.headers['user-agent']?.includes('Expo') ||
                        req.headers['user-agent']?.includes('okhttp');

        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JS access
            secure: process.env.NODE_ENV === 'production', // HTTPS in production
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days to match JWT expiry
        });
        
        if (isMobile) {
            // For mobile, redirect to deep link
            const redirectUri = process.env.MOBILE_REDIRECT_URI || 'casandras://auth/callback';
            res.redirect(redirectUri);
        } else {
            // For web, send HTML that closes the popup and notifies the parent window
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Authentication Successful</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                        }
                        .container {
                            text-align: center;
                            padding: 2rem;
                            background: rgba(255, 255, 255, 0.1);
                            border-radius: 12px;
                            backdrop-filter: blur(10px);
                        }
                        .icon {
                            font-size: 64px;
                            margin-bottom: 1rem;
                        }
                        h1 {
                            margin: 0 0 1rem 0;
                            font-size: 24px;
                        }
                        p {
                            margin: 0;
                            opacity: 0.9;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="icon">✓</div>
                        <h1>Authentication Successful!</h1>
                        <p>You can close this window now.</p>
                    </div>
                    <script>
                        // Notify parent window (if opened from window.open)
                        if (window.opener) {
                            window.opener.postMessage({ type: 'auth_success' }, '*');
                        }
                        // Auto-close after 2 seconds
                        setTimeout(() => {
                            window.close();
                        }, 2000);
                    </script>
                </body>
                </html>
            `);
        }
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
