import Booking from '../models/Booking.js';
import Court from '../models/Court.js';
import Coach from '../models/Coach.js';
import Equipment from '../models/Equipment.js';
import { checkAllAvailability } from '../utils/availabilityChecker.js';
import { calculatePrice, calculateDuration } from '../utils/pricingEngine.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const {
      courtId,
      bookingDate,
      startTime,
      endTime,
      coachId,
      equipmentList,
      notes,
    } = req.body;

    // Validate required fields
    if (!courtId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Court, booking date, start time, and end time are required',
      });
    }

    // Get court details
    const court = await Court.findById(courtId);
    if (!court || !court.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Court not found or inactive',
      });
    }

    // Check availability of all resources
    const availabilityCheck = await checkAllAvailability({
      courtId,
      coachId,
      equipmentList,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
    });

    if (!availabilityCheck.available) {
      return res.status(400).json({
        success: false,
        message: 'Resources not available',
        details: availabilityCheck.messages,
      });
    }

    // Calculate duration
    const duration = calculateDuration(startTime, endTime);

    if (duration <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time range. End time must be after start time.',
      });
    }

    // Calculate pricing
    const pricingBreakdown = await calculatePrice(
      court.basePrice,
      new Date(bookingDate),
      startTime,
      court.type,
      duration
    );

    // Add coach fee if coach is selected
    if (coachId) {
      const coach = await Coach.findById(coachId);
      if (coach) {
        pricingBreakdown.coachFee = coach.pricePerHour * duration;
        pricingBreakdown.total += pricingBreakdown.coachFee;
      }
    }

    // Add equipment fees
    if (equipmentList && equipmentList.length > 0) {
      let totalEquipmentFee = 0;

      for (const item of equipmentList) {
        const equipment = await Equipment.findById(item.equipmentId);
        if (equipment) {
          totalEquipmentFee += equipment.pricePerHour * item.quantity * duration;
        }
      }

      pricingBreakdown.equipmentFee = totalEquipmentFee;
      pricingBreakdown.total += totalEquipmentFee;
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      court: courtId,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
      resources: {
        coach: coachId || null,
        equipment: equipmentList || [],
      },
      pricingBreakdown,
      status: 'confirmed',
      paymentStatus: 'pending',
      notes,
    });

    // Populate the booking
    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'court' },
      { path: 'resources.coach' },
      { path: 'resources.equipment.equipmentId' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message,
    });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const { status, date, courtId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (courtId) filter.court = courtId;
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filter.bookingDate = {
        $gte: targetDate,
        $lt: nextDay,
      };
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('court')
      .populate('resources.coach')
      .populate('resources.equipment.equipmentId')
      .sort({ bookingDate: -1, startTime: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message,
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/:userId
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if user is requesting their own bookings or is admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const bookings = await Booking.find({ user: userId })
      .populate('court')
      .populate('resources.coach')
      .populate('resources.equipment.equipmentId')
      .sort({ bookingDate: -1, startTime: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user bookings',
      error: error.message,
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('court')
      .populate('resources.coach')
      .populate('resources.equipment.equipmentId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user owns the booking or is admin
    if (
      req.user._id.toString() !== booking.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message,
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user owns the booking or is admin
    if (
      req.user._id.toString() !== booking.user.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'court' },
      { path: 'resources.coach' },
      { path: 'resources.equipment.equipmentId' },
    ]);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email phone')
      .populate('court')
      .populate('resources.coach')
      .populate('resources.equipment.equipmentId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message,
    });
  }
};

// @desc    Check availability
// @route   POST /api/bookings/check-availability
// @access  Public
export const checkAvailability = async (req, res) => {
  try {
    const { courtId, coachId, equipmentList, bookingDate, startTime, endTime } = req.body;

    if (!courtId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Court, booking date, start time, and end time are required',
      });
    }

    const availabilityCheck = await checkAllAvailability({
      courtId,
      coachId,
      equipmentList,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
    });

    res.json({
      success: true,
      available: availabilityCheck.available,
      messages: availabilityCheck.messages,
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: error.message,
    });
  }
};

// @desc    Calculate price for booking
// @route   POST /api/bookings/calculate-price
// @access  Public
export const calculateBookingPrice = async (req, res) => {
  try {
    const { courtId, bookingDate, startTime, endTime, coachId, equipmentList } = req.body;

    if (!courtId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Court, booking date, start time, and end time are required',
      });
    }

    // Get court
    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found',
      });
    }

    // Calculate duration
    const duration = calculateDuration(startTime, endTime);

    // Calculate base pricing
    const pricingBreakdown = await calculatePrice(
      court.basePrice,
      new Date(bookingDate),
      startTime,
      court.type,
      duration
    );

    // Add coach fee
    if (coachId) {
      const coach = await Coach.findById(coachId);
      if (coach) {
        pricingBreakdown.coachFee = coach.pricePerHour * duration;
        pricingBreakdown.total += pricingBreakdown.coachFee;
      }
    }

    // Add equipment fees
    if (equipmentList && equipmentList.length > 0) {
      let totalEquipmentFee = 0;

      for (const item of equipmentList) {
        const equipment = await Equipment.findById(item.equipmentId);
        if (equipment) {
          totalEquipmentFee += equipment.pricePerHour * item.quantity * duration;
        }
      }

      pricingBreakdown.equipmentFee = totalEquipmentFee;
      pricingBreakdown.total += totalEquipmentFee;
    }

    res.json({
      success: true,
      duration,
      pricing: pricingBreakdown,
    });
  } catch (error) {
    console.error('Calculate price error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate price',
      error: error.message,
    });
  }
};
