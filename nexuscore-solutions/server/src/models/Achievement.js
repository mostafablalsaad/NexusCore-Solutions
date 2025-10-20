const mongoose = require('mongoose');
const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['award', 'certification', 'partnership', 'milestone'],
  },
  logo: {
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
});

achievementSchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('Achievement', achievementSchema);
