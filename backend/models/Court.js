import mongoose from 'mongoose';

const courtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Court name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['indoor', 'outdoor'],
      required: [true, 'Court type is required'],
    },
    sport: {
      type: String,
      required: [true, 'Sport type is required'],
      trim: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      default: 10,
    },
    amenities: [String],
    images: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Court = mongoose.model('Court', courtSchema);

export default Court;
