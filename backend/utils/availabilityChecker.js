import Booking from '../models/Booking.js';
import Coach from '../models/Coach.js';
import Equipment from '../models/Equipment.js';

/**
 * Check if a time slot overlaps with existing bookings
 * @param {String} startTime1
 * @param {String} endTime1
 * @param {String} startTime2
 * @param {String} endTime2
 * @returns {Boolean}
 */
const timeOverlaps = (startTime1, endTime1, startTime2, endTime2) => {
  const start1 = parseTime(startTime1);
  const end1 = parseTime(endTime1);
  const start2 = parseTime(startTime2);
  const end2 = parseTime(endTime2);

  return start1 < end2 && start2 < end1;
};

/**
 * Parse time string to minutes
 * @param {String} time - Time in HH:MM format
 * @returns {Number} Minutes since midnight
 */
const parseTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Check court availability
 * @param {ObjectId} courtId
 * @param {Date} bookingDate
 * @param {String} startTime
 * @param {String} endTime
 * @returns {Object} { available, message }
 */
export const checkCourtAvailability = async (courtId, bookingDate, startTime, endTime) => {
  try {
    // Normalize date to start of day
    const date = new Date(bookingDate);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    // Find overlapping bookings
    const overlappingBookings = await Booking.find({
      court: courtId,
      bookingDate: {
        $gte: date,
        $lt: nextDay,
      },
      status: { $nin: ['cancelled'] },
    });

    // Check for time overlaps
    for (const booking of overlappingBookings) {
      if (timeOverlaps(startTime, endTime, booking.startTime, booking.endTime)) {
        return {
          available: false,
          message: `Court is already booked from ${booking.startTime} to ${booking.endTime}`,
        };
      }
    }

    return {
      available: true,
      message: 'Court is available',
    };
  } catch (error) {
    console.error('Court availability check error:', error);
    throw new Error('Failed to check court availability');
  }
};

/**
 * Check coach availability
 * @param {ObjectId} coachId
 * @param {Date} bookingDate
 * @param {String} startTime
 * @param {String} endTime
 * @returns {Object} { available, message }
 */
export const checkCoachAvailability = async (coachId, bookingDate, startTime, endTime) => {
  try {
    if (!coachId) {
      return { available: true, message: 'No coach selected' };
    }

    // Normalize date
    const date = new Date(bookingDate);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    // Check if coach exists and is active
    const coach = await Coach.findById(coachId);
    if (!coach || !coach.isActive) {
      return {
        available: false,
        message: 'Coach not available',
      };
    }

    // Find overlapping bookings for this coach
    const overlappingBookings = await Booking.find({
      'resources.coach': coachId,
      bookingDate: {
        $gte: date,
        $lt: nextDay,
      },
      status: { $nin: ['cancelled'] },
    });

    // Check for time overlaps
    for (const booking of overlappingBookings) {
      if (timeOverlaps(startTime, endTime, booking.startTime, booking.endTime)) {
        return {
          available: false,
          message: `Coach is already booked from ${booking.startTime} to ${booking.endTime}`,
        };
      }
    }

    return {
      available: true,
      message: 'Coach is available',
    };
  } catch (error) {
    console.error('Coach availability check error:', error);
    throw new Error('Failed to check coach availability');
  }
};

/**
 * Check equipment availability
 * @param {Array} equipmentList - Array of {equipmentId, quantity}
 * @param {Date} bookingDate
 * @param {String} startTime
 * @param {String} endTime
 * @returns {Object} { available, message }
 */
export const checkEquipmentAvailability = async (
  equipmentList,
  bookingDate,
  startTime,
  endTime
) => {
  try {
    if (!equipmentList || equipmentList.length === 0) {
      return { available: true, message: 'No equipment selected' };
    }

    // Normalize date
    const date = new Date(bookingDate);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    for (const item of equipmentList) {
      const equipment = await Equipment.findById(item.equipmentId);

      if (!equipment || !equipment.isActive) {
        return {
          available: false,
          message: `Equipment ${item.equipmentId} not available`,
        };
      }

      // Check if requested quantity exceeds total stock
      if (item.quantity > equipment.totalStock) {
        return {
          available: false,
          message: `Only ${equipment.totalStock} ${equipment.name} available in total`,
        };
      }

      // Find all bookings that use this equipment on the same date
      const overlappingBookings = await Booking.find({
        'resources.equipment.equipmentId': item.equipmentId,
        bookingDate: {
          $gte: date,
          $lt: nextDay,
        },
        status: { $nin: ['cancelled'] },
      });

      // Calculate total quantity booked during overlapping time slots
      let totalBookedQuantity = 0;

      for (const booking of overlappingBookings) {
        if (timeOverlaps(startTime, endTime, booking.startTime, booking.endTime)) {
          const bookedItem = booking.resources.equipment.find(
            (e) => e.equipmentId.toString() === item.equipmentId.toString()
          );

          if (bookedItem) {
            totalBookedQuantity += bookedItem.quantity;
          }
        }
      }

      const availableQuantity = equipment.totalStock - totalBookedQuantity;

      if (item.quantity > availableQuantity) {
        return {
          available: false,
          message: `Only ${availableQuantity} ${equipment.name} available during this time slot`,
        };
      }
    }

    return {
      available: true,
      message: 'All equipment available',
    };
  } catch (error) {
    console.error('Equipment availability check error:', error);
    throw new Error('Failed to check equipment availability');
  }
};

/**
 * Check all resources availability
 * @param {Object} params
 * @returns {Object} { available, messages }
 */
export const checkAllAvailability = async ({
  courtId,
  coachId,
  equipmentList,
  bookingDate,
  startTime,
  endTime,
}) => {
  try {
    const results = {
      available: true,
      messages: [],
    };

    // Check court availability
    const courtCheck = await checkCourtAvailability(courtId, bookingDate, startTime, endTime);
    if (!courtCheck.available) {
      results.available = false;
      results.messages.push(courtCheck.message);
    }

    // Check coach availability
    const coachCheck = await checkCoachAvailability(coachId, bookingDate, startTime, endTime);
    if (!coachCheck.available) {
      results.available = false;
      results.messages.push(coachCheck.message);
    }

    // Check equipment availability
    const equipmentCheck = await checkEquipmentAvailability(
      equipmentList,
      bookingDate,
      startTime,
      endTime
    );
    if (!equipmentCheck.available) {
      results.available = false;
      results.messages.push(equipmentCheck.message);
    }

    if (results.available) {
      results.messages.push('All resources available');
    }

    return results;
  } catch (error) {
    console.error('Availability check error:', error);
    throw new Error('Failed to check availability');
  }
};
