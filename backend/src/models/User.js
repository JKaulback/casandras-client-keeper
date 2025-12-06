const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            index: true
        },
        phone: { type: String, trim: true },
        oauthProvider: {
            type: String,
            enum: ['google', 'facebook', 'apple'],
            required: true,
            index: true
        },
        oauthId: { type: String, required: true, unique: true },
        avatarUrl: { type: String },
        role: {
            type: String,
            enum: ['admin', 'customer'],
            default: 'customer',
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);