const CaseStudy = require('../models/CaseStudy');

// @desc    Get all case studies
// @route   GET /api/case-studies
// @access  Public
exports.getCaseStudies = async (req, res) => {
  try {
    const { industry, featured } = req.query;
    const query = {};

    if (industry) query.industry = industry;
    if (featured) query.featured = featured === 'true';

    const caseStudies = await CaseStudy.find(query)
      .populate('relatedProject', 'title thumbnail')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: caseStudies.length,
      data: caseStudies,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching case studies' });
  }
};

// @desc    Get single case study
// @route   GET /api/case-studies/:id
// @access  Public
exports.getCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id)
      .populate('relatedProject', 'title shortDesc thumbnail industry');

    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    res.json({
      success: true,
      data: caseStudy,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching case study' });
  }
};

// @desc    Create case study
// @route   POST /api/admin/case-studies
// @access  Private/Admin
exports.createCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.create(req.body);

    res.status(201).json({
      success: true,
      data: caseStudy,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating case study' });
  }
};

// @desc    Update case study
// @route   PUT /api/admin/case-studies/:id
// @access  Private/Admin
exports.updateCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    res.json({
      success: true,
      data: caseStudy,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating case study' });
  }
};

// @desc    Delete case study
// @route   DELETE /api/admin/case-studies/:id
// @access  Private/Admin
exports.deleteCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndDelete(req.params.id);

    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    res.json({
      success: true,
      message: 'Case study deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting case study' });
  }
};
