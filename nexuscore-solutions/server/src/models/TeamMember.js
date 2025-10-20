const mongoose = require('mongoose');
const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
  },
  bio: {
    type: String,
  },
  photo: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  email: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

teamMemberSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
