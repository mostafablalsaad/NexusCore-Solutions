const mongoose = require('mongoose');
const whitepaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Whitepaper title is required'],
    trim: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
  },
  pdfUrl: {
    type: String,
    required: [true, 'PDF URL is required'],
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  industryTags: [{
    type: String,
    enum: ['renewable', 'medical', 'submarine', 'petroleum', 'automotive'],
  }],
  downloadCount: {
    type: Number,
    default: 0,
  },
  thumbnail: {
    type: String,
  },
  author: {
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
});

module.exports = mongoose.model('Whitepaper', whitepaperSchema);
