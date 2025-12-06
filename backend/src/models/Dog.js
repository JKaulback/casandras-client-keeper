const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, index: true },
    sex: { type: String, enum: ['male', 'female', 'unknown'], default: 'unknown' },
    breed: { type: String, trim: true },
    dob: { type: Date },
    color: { type: String, trim: true },
    weight: { type: Number, min: 0 },
    vet: { type: String, trim: true },
    medicalInfo: { type: String, trim: true },
    rabiesVaccineDate: { type: Date },
    areVaccinesCurrent: { type: Boolean, default: false },
    isFixed: { type: Boolean, default: false },
    temperament: { type: String, trim: true },
    imageURL: { type: String },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Optional text index for flexible search (name & breed)
dogSchema.index({ name: 'text', breed: 'text' });

module.exports = mongoose.model('Dog', dogSchema);
