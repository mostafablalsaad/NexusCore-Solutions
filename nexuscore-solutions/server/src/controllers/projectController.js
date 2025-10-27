const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const { industry, featured, limit } = req.query;
    const query = {};

    if (industry) query.industry = industry;
    if (featured) query.featured = featured === 'true';
    console.log("mostafa error before ");
    let projectsQuery = await Project.find(query).sort({ order: 1, createdAt: -1 });
    console.log("mostafa error");
    
    if (limit) {
      projectsQuery = projectsQuery.limit(parseInt(limit));
    }

    const projects =  projectsQuery;

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects ' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching project' });
  }
};

// @desc    Create project
// @route   POST /api/admin/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating project' });
  }
};

// @desc    Update project
// @route   PUT /api/admin/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating project' });
  }
};

// @desc    Delete project
// @route   DELETE /api/admin/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting project' });
  }
};
