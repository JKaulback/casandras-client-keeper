const googleAuthHandler = require('../config/googleAuth');
const mobileDevSuccess = require('../templates/mobileDevSuccess');
const mobileProdSuccess = require('../templates/mobileProdSuccess');
const webSuccess = require('../templates/webSuccess');

exports.initiateGoogleAuth = (req, res, next) => {
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
    require('passport').authenticate('google', authenticateOptions)(req, res, next);
};

exports.googleCallback = (req, res) => {
    const token = googleAuthHandler.generateToken(req.user);
    const stateStr = String(req.query.state || '');
    const isMobile = stateStr.includes('mobile=true') ||
        stateStr.includes('mobile%3Dtrue') ||
        req.headers['user-agent']?.includes('Expo') ||
        req.headers['user-agent']?.includes('okhttp');

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    if (!isMobile) {
        res.send(webSuccess(token));
        return;
    }
    // --- FOR MOBILE ---
    let redirectUri = process.end.MOBILE_REDIRECT_URI || 'casandras://auth/callback';
    if (req.query.state && req.query.state.includes('redirectUri=')) {
        const match = req.query.state.match(/redirectUri=([^&]+)/);
        if (match) {
            redirectUri = decodeURIComponent(match[1]);
        }
    }
    const isDevelopment = redirectUri.includes('exp+frontend') ||
        redirectUri.includes('expo-development') ||
        redirectUri.includes('exp://localhost') ||
        redirectUri.includes('exp://192.168');
    const redirectUrl = `${redirectUri}?token=${token}`;
    if (!isDevelopment) {
        res.send(mobileProdSuccess(redirectUrl));
        return;
    }
    // --- DEVELOPMENT MODE ---
    const userEmail = res.user.email;
    global.devTokens = global.devTokens || {};
    global.devTokens[userEmail] = {
        token: token,
        timestamp: Date.now()
    };
    global.devTokens['__latest__'] = {
        token: token,
        email: userEmail,
        timestamp: Date.now()
    };
    res.send(mobileDevSuccess(userEmail)); 
};

exports.failure = (req, res) => {
    res.status(401).json({ error: 'Authentication Failed' });
};

exports.getDevToken = (req, res) => {
    const userEmail = req.query.email;
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'This endpoint is not available in production' });
    }
    if (!global.devTokens || !global.devTokens[userEmail]) {
        return res.status(404).json({ error: 'No token found for the provided email' });
    }
    const tokenData = global.devTokens[userEmail];
    const age = Date.now() - tokenData.timestamp;
    if (age > 5 * 60 * 1000) {
        return res.status(410).json({ error: 'Token has expired' });
    }
    const token = tokenData.token;
    delete global.devTokens[userEmail];
    res.json({ token });
};

exports.getDevTokenLatest = (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'This endpoint is not available in production' });
    }
    if (!global.devTokens || !global.devTokens['__latest__']) {
        return res.status(404).json({ error: 'No token found' });
    }
    const tokenData = global.devTokens['__latest__'];
    const age = Date.now() - tokenData.timestamp;
    if (age > 5 * 60 * 1000) {
        delete global.devTokens[tokenData.email];
        delete global.devTokens['__latest__'];
        return res.status(410).json({ error: 'Token has expired' });
    }
    const token = tokenData.token;
    const email = tokenData.email;
    delete global.devTokens[email];
    delete global.devTokens['__latest__'];
    res.json({ token, email });
};

exports.verifyToken = (req, res) => {
    let token = null;
    const authorization = req.headers.authorization;
    if (authorization) {
        token = authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = googleAuthHandler.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.json({ valid: true, user: decoded });
};

