import Coach from '../models/Coach.js';

// @desc    Get all coaches
// @route   GET /api/coaches
// @access  Public
export const getAllCoaches = async (req, res) => {
  try {
    const { specialization, isActive } = req.query;

    const filter = {};
    if (specialization) filter.specialization = specialization;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const coaches = await Coach.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: coaches.length,
      coaches,
    });
  } catch (error) {
    console.error('Get coaches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coaches',
      error: error.message,
    });
  }
};

// @desc    Get coach by ID
// @route   GET /api/coaches/:id
// @access  Public
export const getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found',
      });
    }

    res.json({
      success: true,
      coach,
    });
  } catch (error) {
    console.error('Get coach error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coach',
      error: error.message,
    });
  }
};

// @desc    Create new coach
// @route   POST /api/coaches
// @access  Private/Admin
export const createCoach = async (req, res) => {
  try {
    const coach = await Coach.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Coach created successfully',
      coach,
    });
  } catch (error) {
    console.error('Create coach error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create coach',
      error: error.message,
    });
  }
};

// @desc    Update coach
// @route   PUT /api/coaches/:id
// @access  Private/Admin
export const updateCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found',
      });
    }

    res.json({
      success: true,
      message: 'Coach updated successfully',
      coach,
    });
  } catch (error) {
    console.error('Update coach error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update coach',
      error: error.message,
    });
  }
};

// @desc    Update coach availability
// @route   PUT /api/coaches/:id/availability
// @access  Private/Admin
export const updateCoachAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found',
      });
    }

    coach.availability = availability;
    await coach.save();

    res.json({
      success: true,
      message: 'Coach availability updated successfully',
      coach,
    });
  } catch (error) {
    console.error('Update coach availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update coach availability',
      error: error.message,
    });
  }
};

// @desc    Delete coach
// @route   DELETE /api/coaches/:id
// @access  Private/Admin
export const deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id);

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found',
      });
    }

    res.json({
      success: true,
      message: 'Coach deleted successfully',
    });
  } catch (error) {
    console.error('Delete coach error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete coach',
      error: error.message,
    });
  }
};
