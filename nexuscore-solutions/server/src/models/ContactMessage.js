const mongoose = require('mongoose');
const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  company: {
    type: String,
  },
  phone: {
    type: String,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  read: {
    type: Boolean,
    default: false,
  },
  responded: {
    type: Boolean,
    default: false,
  },
  responseNote: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

contactMessageSchema.index({ read: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
