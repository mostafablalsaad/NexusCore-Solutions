const Achievement = require('../models/Achievement');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
exports.getAchievements = async (req, res) => {
  try {
    const { type, featured } = req.query;
    const query = {};

    if (type) query.type = type;
    if (featured) query.featured = featured === 'true';

    const achievements = await Achievement.find(query).sort({ date: -1, order: 1 });

    res.json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching achievements' });
  }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
exports.getAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching achievement' });
  }
};

// @desc    Create achievement
// @route   POST /api/admin/achievements
// @access  Private/Admin
exports.createAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);

    res.status(201).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating achievement' });
  }
};

// @desc    Update achievement
// @route   PUT /api/admin/achievements/:id
// @access  Private/Admin
exports.updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating achievement' });
  }
};

// @desc    Delete achievement
// @route   DELETE /api/admin/achievements/:id
// @access  Private/Admin
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);

    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json({
      success: true,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting achievement' });
  }
};