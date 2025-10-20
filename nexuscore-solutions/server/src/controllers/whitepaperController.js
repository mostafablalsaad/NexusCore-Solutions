const Whitepaper = require('../models/Whitepaper');

// @desc    Get all whitepapers
// @route   GET /api/whitepapers
// @access  Public
exports.getWhitepapers = async (req, res) => {
  try {
    const { industry, featured } = req.query;
    const query = {};

    if (industry) query.industryTags = industry;
    if (featured) query.featured = featured === 'true';

    const whitepapers = await Whitepaper.find(query).sort({ publishDate: -1 });

    res.json({
      success: true,
      count: whitepapers.length,
      data: whitepapers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching whitepapers' });
  }
};

// @desc    Get single whitepaper
// @route   GET /api/whitepapers/:id
// @access  Public
exports.getWhitepaper = async (req, res) => {
  try {
    const whitepaper = await Whitepaper.findById(req.params.id);

    if (!whitepaper) {
      return res.status(404).json({ error: 'Whitepaper not found' });
    }

    res.json({
      success: true,
      data: whitepaper,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching whitepaper' });
  }
};

// @desc    Track whitepaper download
// @route   GET /api/whitepapers/:id/download
// @access  Public
exports.downloadWhitepaper = async (req, res) => {
  try {
    const whitepaper = await Whitepaper.findById(req.params.id);

    if (!whitepaper) {
      return res.status(404).json({ error: 'Whitepaper not found' });
    }

    // Increment download count
    whitepaper.downloadCount += 1;
    await whitepaper.save();

    res.json({
      success: true,
      data: {
        pdfUrl: whitepaper.pdfUrl,
        downloadCount: whitepaper.downloadCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error downloading whitepaper' });
  }
};

// @desc    Create whitepaper
// @route   POST /api/admin/whitepapers
// @access  Private/Admin
exports.createWhitepaper = async (req, res) => {
  try {
    const whitepaper = await Whitepaper.create(req.body);

    res.status(201).json({
      success: true,
      data: whitepaper,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating whitepaper' });
  }
};

// @desc    Update whitepaper
// @route   PUT /api/admin/whitepapers/:id
// @access  Private/Admin
exports.updateWhitepaper = async (req, res) => {
  try {
    const whitepaper = await Whitepaper.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!whitepaper) {
      return res.status(404).json({ error: 'Whitepaper not found' });
    }

    res.json({
      success: true,
      data: whitepaper,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating whitepaper' });
  }
};

// @desc    Delete whitepaper
// @route   DELETE /api/admin/whitepapers/:id
// @access  Private/Admin
exports.deleteWhitepaper = async (req, res) => {
  try {
    const whitepaper = await Whitepaper.findByIdAndDelete(req.params.id);

    if (!whitepaper) {
      return res.status(404).json({ error: 'Whitepaper not found' });
    }

    res.json({
      success: true,
      message: 'Whitepaper deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting whitepaper' });
  }
};