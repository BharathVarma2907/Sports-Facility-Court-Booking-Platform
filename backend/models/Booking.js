import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Court',
      required: [true, 'Court is required'],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    resources: {
      coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach',
      },
      equipment: [
        {
          equipmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment',
          },
          quantity: {
            type: Number,
            min: 1,
          },
        },
      ],
    },
    pricingBreakdown: {
      basePrice: {
        type: Number,
        required: true,
      },
      peakHourFee: {
        type: Number,
        default: 0,
      },
      weekendFee: {
        type: Number,
        default: 0,
      },
      holidayFee: {
        type: Number,
        default: 0,
      },
      indoorPremium: {
        type: Number,
        default: 0,
      },
      coachFee: {
        type: Number,
        default: 0,
      },
      equipmentFee: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
      appliedRules: [String],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
bookingSchema.index({ court: 1, bookingDate: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ user: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
