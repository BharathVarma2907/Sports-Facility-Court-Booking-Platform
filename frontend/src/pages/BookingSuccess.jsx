import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, DollarSign, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 mb-8">
            Your booking has been successfully created
          </p>

          <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Court</p>
                <p className="font-semibold">{booking.court.name}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {booking.court.type} • {booking.court.sport}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">
                  {format(new Date(booking.bookingDate), 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">
                  {booking.startTime} - {booking.endTime}
                </p>
              </div>
            </div>

            {booking.resources.coach && (
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 text-gray-400 mt-0.5">👤</div>
                <div>
                  <p className="text-sm text-gray-600">Coach</p>
                  <p className="font-semibold">{booking.resources.coach.name}</p>
                  <p className="text-sm text-gray-500">
                    {booking.resources.coach.specialization}
                  </p>
                </div>
              </div>
            )}

            {booking.resources.equipment.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 text-gray-400 mt-0.5">📦</div>
                <div>
                  <p className="text-sm text-gray-600">Equipment</p>
                  <ul className="text-sm space-y-1">
                    {booking.resources.equipment.map((item, idx) => (
                      <li key={idx}>
                        {item.equipmentId.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="border-t pt-4 mt-4">
              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Price Breakdown</p>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Base Price</span>
                      <span>${booking.pricingBreakdown.basePrice.toFixed(2)}</span>
                    </div>

                    {booking.pricingBreakdown.peakHourFee > 0 && (
                      <div className="flex justify-between">
                        <span>Peak Hour Fee</span>
                        <span>+${booking.pricingBreakdown.peakHourFee.toFixed(2)}</span>
                      </div>
                    )}

                    {booking.pricingBreakdown.weekendFee > 0 && (
                      <div className="flex justify-between">
                        <span>Weekend Fee</span>
                        <span>+${booking.pricingBreakdown.weekendFee.toFixed(2)}</span>
                      </div>
                    )}

                    {booking.pricingBreakdown.coachFee > 0 && (
                      <div className="flex justify-between">
                        <span>Coach Fee</span>
                        <span>+${booking.pricingBreakdown.coachFee.toFixed(2)}</span>
                      </div>
                    )}

                    {booking.pricingBreakdown.equipmentFee > 0 && (
                      <div className="flex justify-between">
                        <span>Equipment Fee</span>
                        <span>+${booking.pricingBreakdown.equipmentFee.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-primary-600">
                        ${booking.pricingBreakdown.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-yellow-800">
                <strong>Payment Status:</strong>{' '}
                <span className="capitalize">{booking.paymentStatus}</span>
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/my-bookings')}
              className="btn-primary"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/home')}
              className="btn-secondary"
            >
              Book Another Court
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
