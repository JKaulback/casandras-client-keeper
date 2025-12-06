const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true, index: true },
    occupation: { type: String, trim: true },
    address: { type: String, trim: true },
    // Optional link to an authenticated user (future)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Text index for name + occupation (for flexible search)
customerSchema.index({ name: 'text', occupation: 'text' });

module.exports = mongoose.model('Customer', customerSchema);
