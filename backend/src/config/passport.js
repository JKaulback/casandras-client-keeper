const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const googleAuthHandler = require('./googleAuth');

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