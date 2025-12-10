import express from 'express';
import {
  getAllCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
} from '../controllers/courtController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllCourts)
  .post(protect, adminOnly, createCourt);

router.route('/:id')
  .get(getCourtById)
  .put(protect, adminOnly, updateCourt)
  .delete(protect, adminOnly, deleteCourt);

export default router;
