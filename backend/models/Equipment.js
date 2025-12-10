import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    totalStock: {
      type: Number,
      required: [true, 'Total stock is required'],
      min: 0,
    },
    availableStock: {
      type: Number,
      required: [true, 'Available stock is required'],
      min: 0,
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: 0,
    },
    image: {
      type: String,
    },
    condition: {
      type: String,
      enum: ['new', 'good', 'fair', 'needs_repair'],
      default: 'good',
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

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;
