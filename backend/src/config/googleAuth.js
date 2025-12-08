const User = require('../models/User');
const jwt = require('jsonwebtoken');

class GoogleAuthHandler {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
    }

    async findOrCreateUser(profile) {
        try {
            const existingUser = await User.findOne({
                oauthProvider: 'google',
                oauthId: profile.id
            });

            if (existingUser) {
                return existingUser;
            }

            const newUser = await User.create({
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
                oauthProvider: 'google',
                oauthId: profile.id,
                avatarUrl: profile.photos?.[0]?.value,
                role: 'customer'
            });

            return newUser;
        } catch (error) {
            throw new Error('User creation failed: ' + error.message);
        }
    }

    generateToken(user) {
        return jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            this.jwtSecret,
            { expiresIn: '7d' }
        )
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            return null;
        }
    }
}

module.exports = new GoogleAuthHandler();