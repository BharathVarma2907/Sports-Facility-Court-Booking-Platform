import express from 'express';
import {
  getAllCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  updateCoachAvailability,
  deleteCoach,
} from '../controllers/coachController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllCoaches)
  .post(protect, adminOnly, createCoach);

router.route('/:id')
  .get(getCoachById)
  .put(protect, adminOnly, updateCoach)
  .delete(protect, adminOnly, deleteCoach);

router.put('/:id/availability', protect, adminOnly, updateCoachAvailability);

export default router;
