
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    dogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dog',
      required: true,
      index: true,
    },
    // Single field for date+time (simplifies queries & sorting)
    dateTime: { type: Date, required: true, index: true },

    durationMinutes: { type: Number, default: 60, min: 15, max: 240 },

    cost: { type: Number, min: 0, default: 0 },
    notes: { type: String, trim: true },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
      index: true,
    },

    // Recurring support (future): e.g., weekly, biweekly, monthly
    isRecurring: { type: Boolean, default: false },
    recurrenceRule: {
      frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
      interval: { type: Number, default: 1 }, // every N units
      byDay: [{ type: String }], // e.g., ['MO','TH']
      endDate: { type: Date },
    },

    // Conflict tracking (future): store conflict notes/findings
    conflictFlag: { type: Boolean, default: false },
    conflictNote: { type: String },

    // Payment (future): Stripe integration
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded', 'partial'],
      default: 'unpaid',
      index: true,
    },
    transactionId: { type: String }, // Stripe PaymentIntent or Charge ID
  },
  { timestamps: true }
);

// Compound index to quickly check potential overlaps per dog
appointmentSchema.index({ dogId: 1, dateTime: 1 });

// Pre-save hook placeholder for conflict detection with recurring awareness.
// You can later expand this to search for overlapping appointments within duration.
appointmentSchema.pre('save', async function (next) {
  try {
    // Example: detect overlap for the same dog within start..start+duration
    // Skip if explicitly marked or recurring logic is pending
    const Appointment = this.constructor;

    const start = this.dateTime;
    const end = new Date(start.getTime() + (this.durationMinutes || 60) * 60000);

    const overlapping = await Appointment.findOne({
      dogId: this.dogId,
      _id: { $ne: this._id },
      dateTime: { $lt: end },
      // naive check: find another appointment whose start is before our end
      // For robust logic, also store endDateTime or compute on the fly.
    }).lean();

    if (overlapping) {
      this.conflictFlag = true;
      this.conflictNote = 'Potential overlap detected';
      // You can decide to block save by returning an error:
      // return next(new Error('Appointment conflict detected'));
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
