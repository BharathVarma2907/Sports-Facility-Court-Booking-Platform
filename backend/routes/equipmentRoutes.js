import express from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from '../controllers/equipmentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllEquipment)
  .post(protect, adminOnly, createEquipment);

router.route('/:id')
  .get(getEquipmentById)
  .put(protect, adminOnly, updateEquipment)
  .delete(protect, adminOnly, deleteEquipment);

export default router;
