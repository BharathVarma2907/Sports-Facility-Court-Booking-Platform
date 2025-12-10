import Court from '../models/Court.js';

// @desc    Get all courts
// @route   GET /api/courts
// @access  Public
export const getAllCourts = async (req, res) => {
  try {
    const { type, sport, isActive } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (sport) filter.sport = sport;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const courts = await Court.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courts.length,
      courts,
    });
  } catch (error) {
    console.error('Get courts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courts',
      error: error.message,
    });
  }
};

// @desc    Get court by ID
// @route   GET /api/courts/:id
// @access  Public
export const getCourtById = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found',
      });
    }

    res.json({
      success: true,
      court,
    });
  } catch (error) {
    console.error('Get court error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch court',
      error: error.message,
    });
  }
};

// @desc    Create new court
// @route   POST /api/courts
// @access  Private/Admin
export const createCourt = async (req, res) => {
  try {
    const court = await Court.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Court created successfully',
      court,
    });
  } catch (error) {
    console.error('Create court error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create court',
      error: error.message,
    });
  }
};

// @desc    Update court
// @route   PUT /api/courts/:id
// @access  Private/Admin
export const updateCourt = async (req, res) => {
  try {
    const court = await Court.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found',
      });
    }

    res.json({
      success: true,
      message: 'Court updated successfully',
      court,
    });
  } catch (error) {
    console.error('Update court error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update court',
      error: error.message,
    });
  }
};

// @desc    Delete court
// @route   DELETE /api/courts/:id
// @access  Private/Admin
export const deleteCourt = async (req, res) => {
  try {
    const court = await Court.findByIdAndDelete(req.params.id);

    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found',
      });
    }

    res.json({
      success: true,
      message: 'Court deleted successfully',
    });
  } catch (error) {
    console.error('Delete court error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete court',
      error: error.message,
    });
  }
};
