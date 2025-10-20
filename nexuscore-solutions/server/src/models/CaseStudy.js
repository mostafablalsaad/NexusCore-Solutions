const mongoose = require('mongoose');
const caseStudySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Case study title is required'],
    trim: true,
  },
  client: {
    type: String,
    required: [true, 'Client name is required'],
  },
  industry: {
    type: String,
    enum: ['renewable', 'medical', 'submarine', 'petroleum', 'automotive'],
  },
  challenge: {
    type: String,
    required: [true, 'Challenge description is required'],
  },
  solution: {
    type: String,
    required: [true, 'Solution description is required'],
  },
  results: {
    type: String,
    required: [true, 'Results description is required'],
  },
  metrics: [{
    label: String,
    value: String,
  }],
  pdfUrl: {
    type: String,
  },
  relatedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  thumbnail: {
    type: String,
  },
  featured: {
    type: Boolean,
    default: false,
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

caseStudySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CaseStudy', caseStudySchema);
