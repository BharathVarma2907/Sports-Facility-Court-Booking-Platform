import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { Calendar, Clock, MapPin, DollarSign, X } from 'lucide-react';
import { format } from 'date-fns';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getUserBookings(user.id);
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();

    switch (filter) {
      case 'upcoming':
        return bookings.filter(
          (b) =>
            new Date(b.bookingDate) >= now &&
            b.status !== 'cancelled' &&
            b.status !== 'completed'
        );
      case 'past':
        return bookings.filter(
          (b) =>
            new Date(b.bookingDate) < now ||
            b.status === 'completed'
        );
      case 'cancelled':
        return bookings.filter((b) => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage your bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          {['all', 'upcoming', 'past', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-4 px-2 capitalize ${
                filter === tab
                  ? 'border-b-2 border-primary-600 text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab} ({' '}
              {tab === 'all'
                ? bookings.length
                : tab === 'upcoming'
                ? bookings.filter(
                    (b) =>
                      new Date(b.bookingDate) >= new Date() &&
                      b.status !== 'cancelled' &&
                      b.status !== 'completed'
                  ).length
                : tab === 'past'
                ? bookings.filter(
                    (b) =>
                      new Date(b.bookingDate) < new Date() ||
                      b.status === 'completed'
                  ).length
                : bookings.filter((b) => b.status === 'cancelled').length}
              )
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-xl text-gray-600">No bookings found</p>
            <p className="text-gray-500 mt-2">
              {filter === 'all'
                ? 'You haven\'t made any bookings yet'
                : `No ${filter} bookings`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="card">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.court.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {booking.court.type} • {booking.court.sport}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : booking.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(booking.bookingDate), 'MMMM dd, yyyy')}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-primary-600">
                          ${booking.pricingBreakdown.total.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-xs">
                          Payment: {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {booking.resources.coach && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Coach:</span>{' '}
                        {booking.resources.coach.name}
                      </div>
                    )}

                    {booking.resources.equipment.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Equipment:</span>{' '}
                        {booking.resources.equipment
                          .map(
                            (item) => `${item.equipmentId.name} (x${item.quantity})`
                          )
                          .join(', ')}
                      </div>
                    )}

                    {booking.notes && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {booking.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {booking.status !== 'cancelled' &&
                    booking.status !== 'completed' &&
                    new Date(booking.bookingDate) >= new Date() && (
                      <div className="mt-4 md:mt-0 md:ml-4">
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn-danger flex items-center space-x-1"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
