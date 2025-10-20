const TeamMember = require('../models/TeamMember');

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
exports.getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ active: true }).sort({ order: 1 });

    res.json({
      success: true,
      count: teamMembers.length,
      data: teamMembers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching team members' });
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
exports.getTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching team member' });
  }
};

// @desc    Create team member
// @route   POST /api/admin/team
// @access  Private/Admin
exports.createTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.create(req.body);

    res.status(201).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating team member' });
  }
};

// @desc    Update team member
// @route   PUT /api/admin/team/:id
// @access  Private/Admin
exports.updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating team member' });
  }
};

// @desc    Delete team member
// @route   DELETE /api/admin/team/:id
// @access  Private/Admin
exports.deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting team member' });
  }
};
