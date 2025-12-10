import PricingRule from '../models/PricingRule.js';

/**
 * Calculate dynamic pricing based on base price and applicable rules
 * @param {Number} basePrice - Base price of the court
 * @param {Date} bookingDate - Date of booking
 * @param {String} startTime - Start time (HH:MM format)
 * @param {String} courtType - Type of court (indoor/outdoor)
 * @param {Number} duration - Duration in hours
 * @returns {Object} Pricing breakdown
 */
export const calculatePrice = async (
  basePrice,
  bookingDate,
  startTime,
  courtType,
  duration = 1
) => {
  try {
    // Initialize pricing breakdown
    const breakdown = {
      basePrice: basePrice * duration,
      peakHourFee: 0,
      weekendFee: 0,
      holidayFee: 0,
      indoorPremium: 0,
      coachFee: 0,
      equipmentFee: 0,
      total: basePrice * duration,
      appliedRules: [],
    };

    // Get all active pricing rules
    const rules = await PricingRule.find({ isActive: true });

    // Parse booking time
    const [hours, minutes] = startTime.split(':').map(Number);
    const bookingDay = bookingDate.toLocaleDateString('en-US', { weekday: 'long' });

    for (const rule of rules) {
      let ruleApplies = false;
      let additionalFee = 0;

      switch (rule.type) {
        case 'peak_hour':
          // Check if booking time falls within peak hours
          if (
            rule.conditions.startHour !== undefined &&
            rule.conditions.endHour !== undefined
          ) {
            if (hours >= rule.conditions.startHour && hours < rule.conditions.endHour) {
              ruleApplies = true;
              additionalFee = basePrice * duration * (rule.multiplier - 1);
              breakdown.peakHourFee += additionalFee;
            }
          }
          break;

        case 'weekend':
          // Check if booking is on weekend
          if (rule.conditions.days && rule.conditions.days.length > 0) {
            if (rule.conditions.days.includes(bookingDay)) {
              ruleApplies = true;
              additionalFee = basePrice * duration * (rule.multiplier - 1);
              breakdown.weekendFee += additionalFee;
            }
          }
          break;

        case 'holiday':
          // Check if booking date is a holiday
          if (rule.conditions.specificDates && rule.conditions.specificDates.length > 0) {
            const isHoliday = rule.conditions.specificDates.some((holiday) => {
              const holidayDate = new Date(holiday);
              return (
                holidayDate.getFullYear() === bookingDate.getFullYear() &&
                holidayDate.getMonth() === bookingDate.getMonth() &&
                holidayDate.getDate() === bookingDate.getDate()
              );
            });

            if (isHoliday) {
              ruleApplies = true;
              additionalFee = basePrice * duration * (rule.multiplier - 1);
              breakdown.holidayFee += additionalFee;
            }
          }
          break;

        case 'indoor_premium':
          // Apply indoor premium if court is indoor
          if (courtType === 'indoor') {
            ruleApplies = true;
            additionalFee = basePrice * duration * (rule.multiplier - 1);
            breakdown.indoorPremium += additionalFee;
          }
          break;

        default:
          break;
      }

      if (ruleApplies) {
        breakdown.total += additionalFee;
        breakdown.appliedRules.push(rule.name);
      }
    }

    return breakdown;
  } catch (error) {
    console.error('Pricing calculation error:', error);
    throw new Error('Failed to calculate pricing');
  }
};

/**
 * Calculate duration in hours between two time strings
 * @param {String} startTime - Start time (HH:MM)
 * @param {String} endTime - End time (HH:MM)
 * @returns {Number} Duration in hours
 */
export const calculateDuration = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  return (endTotalMinutes - startTotalMinutes) / 60;
};
