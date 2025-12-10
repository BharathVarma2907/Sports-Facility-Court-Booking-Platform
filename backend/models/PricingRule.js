import mongoose from 'mongoose';

const pricingRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Rule name is required'],
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['weekend', 'peak_hour', 'holiday', 'indoor_premium'],
      required: [true, 'Rule type is required'],
    },
    multiplier: {
      type: Number,
      required: [true, 'Multiplier is required'],
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    conditions: {
      // For peak hours
      startHour: {
        type: Number,
        min: 0,
        max: 23,
      },
      endHour: {
        type: Number,
        min: 0,
        max: 23,
      },
      // For weekends
      days: [
        {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
      ],
      // For holidays
      specificDates: [Date],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PricingRule = mongoose.model('PricingRule', pricingRuleSchema);

export default PricingRule;
