import express from 'express';
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  checkAvailability,
  calculateBookingPrice,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/check-availability', checkAvailability);
router.post('/calculate-price', calculateBookingPrice);

// Protected routes
router.post('/', protect, createBooking);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/user/:userId', protect, getUserBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

export default router;
