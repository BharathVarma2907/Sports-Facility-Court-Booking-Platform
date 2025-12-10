import Equipment from '../models/Equipment.js';

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
export const getAllEquipment = async (req, res) => {
  try {
    const { category, isActive } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const equipment = await Equipment.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: equipment.length,
      equipment,
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch equipment',
      error: error.message,
    });
  }
};

// @desc    Get equipment by ID
// @route   GET /api/equipment/:id
// @access  Public
export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    res.json({
      success: true,
      equipment,
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch equipment',
      error: error.message,
    });
  }
};

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private/Admin
export const createEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Equipment created successfully',
      equipment,
    });
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create equipment',
      error: error.message,
    });
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private/Admin
export const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    res.json({
      success: true,
      message: 'Equipment updated successfully',
      equipment,
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update equipment',
      error: error.message,
    });
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private/Admin
export const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    res.json({
      success: true,
      message: 'Equipment deleted successfully',
    });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete equipment',
      error: error.message,
    });
  }
};
