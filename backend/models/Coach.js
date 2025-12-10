import mongoose from 'mongoose';

const coachSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Coach name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: 0,
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: 0,
    },
    bio: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    availability: [
      {
        date: {
          type: Date,
          required: true,
        },
        slots: [
          {
            startTime: {
              type: String,
              required: true,
            },
            endTime: {
              type: String,
              required: true,
            },
            isBooked: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coach = mongoose.model('Coach', coachSchema);

export default Coach;
