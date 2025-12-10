import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  bookingsAPI,
  coachesAPI,
  equipmentAPI,
} from '../services/api';
import toast from 'react-hot-toast';
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  User,
  Package,
} from 'lucide-react';
import { format } from 'date-fns';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const court = location.state?.court;

  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    coachId: '',
    equipmentList: [],
    notes: '',
  });

  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (!court) {
      navigate('/home');
      return;
    }
    fetchResources();
  }, [court, navigate]);

  useEffect(() => {
    if (
      bookingData.bookingDate &&
      bookingData.startTime &&
      bookingData.endTime
    ) {
      checkAvailabilityAndPrice();
    }
  }, [
    bookingData.bookingDate,
    bookingData.startTime,
    bookingData.endTime,
    bookingData.coachId,
    bookingData.equipmentList,
  ]);

  const fetchResources = async () => {
    try {
      const [coachesRes, equipmentRes] = await Promise.all([
        coachesAPI.getAll({ isActive: true }),
        equipmentAPI.getAll({ isActive: true }),
      ]);

      setCoaches(coachesRes.data.coaches);
      setEquipment(equipmentRes.data.equipment);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    }
  };

  const checkAvailabilityAndPrice = async () => {
    if (!bookingData.bookingDate || !bookingData.startTime || !bookingData.endTime) {
      return;
    }

    setCalculating(true);

    try {
      // Check availability
      const availabilityRes = await bookingsAPI.checkAvailability({
        courtId: court._id,
        coachId: bookingData.coachId || null,
        equipmentList: bookingData.equipmentList,
        bookingDate: bookingData.bookingDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
      });

      setAvailability(availabilityRes.data);

      if (availabilityRes.data.available) {
        // Calculate price
        const priceRes = await bookingsAPI.calculatePrice({
          courtId: court._id,
          coachId: bookingData.coachId || null,
          equipmentList: bookingData.equipmentList,
          bookingDate: bookingData.bookingDate,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
        });

        setPricing(priceRes.data);
      } else {
        setPricing(null);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Failed to check availability');
    } finally {
      setCalculating(false);
    }
  };

  const handleEquipmentChange = (equipmentId, quantity) => {
    setBookingData((prev) => {
      const existingIndex = prev.equipmentList.findIndex(
        (item) => item.equipmentId === equipmentId
      );

      if (quantity === 0) {
        // Remove equipment
        return {
          ...prev,
          equipmentList: prev.equipmentList.filter(
            (item) => item.equipmentId !== equipmentId
          ),
        };
      }

      if (existingIndex >= 0) {
        // Update existing equipment
        const newList = [...prev.equipmentList];
        newList[existingIndex].quantity = parseInt(quantity);
        return { ...prev, equipmentList: newList };
      } else {
        // Add new equipment
        return {
          ...prev,
          equipmentList: [
            ...prev.equipmentList,
            { equipmentId, quantity: parseInt(quantity) },
          ],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (!availability?.available) {
      toast.error('Selected time slot is not available');
      return;
    }

    setLoading(true);

    try {
      // Filter out equipment with quantity 0
      const filteredEquipment = bookingData.equipmentList?.filter(
        (item) => item.quantity > 0
      ) || [];

      const bookingPayload = {
        courtId: court._id,
        ...bookingData,
        equipmentList: filteredEquipment,
        coachId: bookingData.coachId || null,
      };

      const response = await bookingsAPI.create(bookingPayload);

      toast.success('Booking created successfully!');
      navigate('/booking-success', { state: { booking: response.data.booking } });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to create booking'
      );
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (!court) {
    return null;
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Book {court.name}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="inline h-4 w-4 mr-1" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    min={today}
                    value={bookingData.bookingDate}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, bookingDate: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Start Time
                    </label>
                    <select
                      className="input-field"
                      value={bookingData.startTime}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, startTime: e.target.value })
                      }
                      required
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      End Time
                    </label>
                    <select
                      className="input-field"
                      value={bookingData.endTime}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, endTime: e.target.value })
                      }
                      required
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Availability Status */}
                {availability && (
                  <div
                    className={`p-4 rounded-lg ${
                      availability.available
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    <p className="font-medium">
                      {availability.available ? '✓ Available' : '✗ Not Available'}
                    </p>
                    {availability.messages.map((msg, idx) => (
                      <p key={idx} className="text-sm mt-1">
                        {msg}
                      </p>
                    ))}
                  </div>
                )}

                {/* Coach Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Add a Coach (Optional)
                  </label>
                  <select
                    className="input-field"
                    value={bookingData.coachId}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, coachId: e.target.value })
                    }
                  >
                    <option value="">No coach</option>
                    {coaches.map((coach) => (
                      <option key={coach._id} value={coach._id}>
                        {coach.name} - {coach.specialization} (${coach.pricePerHour}/hr)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Equipment Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="inline h-4 w-4 mr-1" />
                    Add Equipment (Optional)
                  </label>
                  <div className="space-y-3">
                    {equipment.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            ${item.pricePerHour}/hr • Available: {item.availableStock}
                          </p>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max={item.availableStock}
                          className="w-20 input-field"
                          placeholder="Qty"
                          onChange={(e) =>
                            handleEquipmentChange(item._id, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Any special requests..."
                    value={bookingData.notes}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, notes: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !availability?.available || calculating}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? 'Booking...'
                    : calculating
                    ? 'Calculating...'
                    : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Court</p>
                  <p className="font-medium">{court.name}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {court.type} • {court.sport}
                  </p>
                </div>

                {bookingData.bookingDate && (
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">
                      {format(new Date(bookingData.bookingDate), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                )}

                {bookingData.startTime && bookingData.endTime && (
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">
                      {bookingData.startTime} - {bookingData.endTime}
                    </p>
                    {pricing && (
                      <p className="text-sm text-gray-500">
                        Duration: {pricing.duration} hour(s)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              {pricing && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Price Breakdown
                  </h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Price</span>
                      <span>${pricing.pricing.basePrice.toFixed(2)}</span>
                    </div>

                    {pricing.pricing.peakHourFee > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Peak Hour Fee</span>
                        <span>+${pricing.pricing.peakHourFee.toFixed(2)}</span>
                      </div>
                    )}

                    {pricing.pricing.weekendFee > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Weekend Fee</span>
                        <span>+${pricing.pricing.weekendFee.toFixed(2)}</span>
                      </div>
                    )}

                    {pricing.pricing.holidayFee > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Holiday Fee</span>
                        <span>+${pricing.pricing.holidayFee.toFixed(2)}</span>
                      </div>
                    )}

                    {pricing.pricing.indoorPremium > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span>Indoor Premium</span>
                        <span>+${pricing.pricing.indoorPremium.toFixed(2)}</span>
                      </div>
                    )}

                    {pricing.pricing.coachFee > 0 && (
                      <div className="flex justify-between text-purple-600">
                        <span>Coach Fee</span>
                        <span>+${pricing.pricing.coachFee.toFixed(2)}</span>
                      </div>
                    )}

                    {pricing.pricing.equipmentFee > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Equipment Fee</span>
                        <span>+${pricing.pricing.equipmentFee.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary-600">
                        ${pricing.pricing.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {pricing.pricing.appliedRules.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-600 mb-2">Applied Rules:</p>
                      <div className="flex flex-wrap gap-1">
                        {pricing.pricing.appliedRules.map((rule, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                          >
                            {rule}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
