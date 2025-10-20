const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
  },
  industryTags: [{
    type: String,
    enum: ['renewable', 'medical', 'submarine', 'petroleum', 'automotive'],
  }],
  icon: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
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

serviceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', serviceSchema);