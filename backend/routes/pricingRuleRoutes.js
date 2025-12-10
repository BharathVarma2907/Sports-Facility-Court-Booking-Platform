import express from 'express';
import {
  getAllPricingRules,
  getPricingRuleById,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
} from '../controllers/pricingRuleController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllPricingRules)
  .post(protect, adminOnly, createPricingRule);

router.route('/:id')
  .get(getPricingRuleById)
  .put(protect, adminOnly, updatePricingRule)
  .delete(protect, adminOnly, deletePricingRule);

export default router;
