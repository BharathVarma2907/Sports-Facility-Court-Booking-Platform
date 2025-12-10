import PricingRule from '../models/PricingRule.js';

// @desc    Get all pricing rules
// @route   GET /api/pricing-rules
// @access  Public
export const getAllPricingRules = async (req, res) => {
  try {
    const { type, isActive } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const rules = await PricingRule.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: rules.length,
      rules,
    });
  } catch (error) {
    console.error('Get pricing rules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pricing rules',
      error: error.message,
    });
  }
};

// @desc    Get pricing rule by ID
// @route   GET /api/pricing-rules/:id
// @access  Public
export const getPricingRuleById = async (req, res) => {
  try {
    const rule = await PricingRule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Pricing rule not found',
      });
    }

    res.json({
      success: true,
      rule,
    });
  } catch (error) {
    console.error('Get pricing rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pricing rule',
      error: error.message,
    });
  }
};

// @desc    Create new pricing rule
// @route   POST /api/pricing-rules
// @access  Private/Admin
export const createPricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Pricing rule created successfully',
      rule,
    });
  } catch (error) {
    console.error('Create pricing rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pricing rule',
      error: error.message,
    });
  }
};

// @desc    Update pricing rule
// @route   PUT /api/pricing-rules/:id
// @access  Private/Admin
export const updatePricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Pricing rule not found',
      });
    }

    res.json({
      success: true,
      message: 'Pricing rule updated successfully',
      rule,
    });
  } catch (error) {
    console.error('Update pricing rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pricing rule',
      error: error.message,
    });
  }
};

// @desc    Delete pricing rule
// @route   DELETE /api/pricing-rules/:id
// @access  Private/Admin
export const deletePricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndDelete(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Pricing rule not found',
      });
    }

    res.json({
      success: true,
      message: 'Pricing rule deleted successfully',
    });
  } catch (error) {
    console.error('Delete pricing rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pricing rule',
      error: error.message,
    });
  }
};
