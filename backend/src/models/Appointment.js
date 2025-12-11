
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

// Pre-save hook for conflict detection
// Detects overlapping appointments
appointmentSchema.pre('save', async function (next) {
  try {
    const Appointment = this.constructor;

    const start = this.dateTime;
    const end = new Date(start.getTime() + (this.durationMinutes || 60) * 60000);

    // Find all appointments
    const otherAppointments = await Appointment.find({
      _id: { $ne: this._id },
      status: { $nin: ['cancelled', 'completed'] }, // Only check active appointments
    }).lean();

    // Check for actual time overlap
    // Two appointments overlap if:
    // - New appointment starts before existing ends AND new appointment ends after existing starts
    const hasOverlap = otherAppointments.some((apt) => {
      const aptStart = new Date(apt.dateTime);
      const aptEnd = new Date(aptStart.getTime() + (apt.durationMinutes || 60) * 60000);
      
      // Check if time ranges overlap
      return start < aptEnd && end > aptStart;
    });

    if (hasOverlap) {
      this.conflictFlag = true;
      this.conflictNote = 'Time slot overlaps with another appointment for this dog';
    } else {
      // Clear conflict flag if no overlap
      this.conflictFlag = false;
      this.conflictNote = null;
    }
    
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
