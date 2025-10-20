const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  shortDesc: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters'],
  },
  fullDesc: {
    type: String,
    required: [true, 'Full description is required'],
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: ['renewable', 'medical', 'submarine', 'petroleum', 'automotive'],
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail image is required'],
  },
  gallery: [{
    type: String,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  technologies: [{
    type: String,
  }],
  completionDate: {
    type: Date,
  },
  clientName: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

projectSchema.index({ industry: 1, featured: -1, order: 1 });

module.exports = mongoose.model('Project', projectSchema);
