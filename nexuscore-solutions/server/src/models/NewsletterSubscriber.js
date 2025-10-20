const crypto = require('crypto');
const mongoose = require('mongoose');
const newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  confirmToken: {
    type: String,
  },
  confirmedAt: {
    type: Date,
  },
  unsubscribed: {
    type: Boolean,
    default: false,
  },
  unsubscribedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate confirmation token
newsletterSubscriberSchema.methods.generateConfirmToken = function () {
  this.confirmToken = crypto.randomBytes(32).toString('hex');
  return this.confirmToken;
};

newsletterSubscriberSchema.index({ email: 1, confirmed: 1 });

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
