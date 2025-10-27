const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const { industry, featured } = req.query;
    const query = {};

    if (industry) query.industryTags = industry;
    if (featured) query.featured = featured === 'true';

    const services = await Service.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({ error: {"error1":'Error fetching services',"error" :error.message} });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching service' });
  }
};

// @desc    Create service
// @route   POST /api/admin/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating service' });
  }
};

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating service' });
  }
};

// @desc    Delete service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting service' });
  }
};
