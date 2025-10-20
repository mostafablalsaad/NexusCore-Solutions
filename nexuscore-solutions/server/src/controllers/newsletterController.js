const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { sendNewsletterConfirmation } = require('../utils/sendEmail');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if already subscribed
    let subscriber = await NewsletterSubscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.confirmed) {
        return res.status(400).json({ 
          error: 'Email is already subscribed to our newsletter' 
        });
      }
      if (subscriber.unsubscribed) {
        // Resubscribe
        subscriber.unsubscribed = false;
        subscriber.unsubscribedAt = null;
        subscriber.confirmed = false;
        subscriber.generateConfirmToken();
        await subscriber.save();
      }
    } else {
      // Create new subscriber
      subscriber = await NewsletterSubscriber.create({ email });
      subscriber.generateConfirmToken();
      await subscriber.save();
    }

    // Send confirmation email
    try {
      await sendNewsletterConfirmation(email, subscriber.confirmToken);
    } catch (emailError) {
      console.error('Failed to send newsletter confirmation:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Please check your email to confirm your subscription',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error subscribing to newsletter' });
  }
};

// @desc    Confirm newsletter subscription
// @route   GET /api/newsletter/confirm/:token
// @access  Public
exports.confirmSubscription = async (req, res) => {
  try {
    const { token } = req.params;

    const subscriber = await NewsletterSubscriber.findOne({ confirmToken: token });

    if (!subscriber) {
      return res.status(400).json({ error: 'Invalid or expired confirmation token' });
    }

    subscriber.confirmed = true;
    subscriber.confirmedAt = Date.now();
    subscriber.confirmToken = undefined;
    await subscriber.save();

    res.json({
      success: true,
      message: 'Email confirmed! You are now subscribed to our newsletter.',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error confirming subscription' });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await NewsletterSubscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found in our subscription list' });
    }

    subscriber.unsubscribed = true;
    subscriber.unsubscribedAt = Date.now();
    await subscriber.save();

    res.json({
      success: true,
      message: 'You have been unsubscribed from our newsletter',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error unsubscribing' });
  }
};

// @desc    Get all subscribers
// @route   GET /api/admin/subscribers
// @access  Private/Admin
exports.getSubscribers = async (req, res) => {
  try {
    const { confirmed, unsubscribed } = req.query;
    const query = {};

    if (confirmed !== undefined) query.confirmed = confirmed === 'true';
    if (unsubscribed !== undefined) query.unsubscribed = unsubscribed === 'true';

    const subscribers = await NewsletterSubscriber.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subscribers' });
  }
};

// @desc    Export subscribers to CSV
// @route   GET /api/admin/subscribers/export
// @access  Private/Admin
exports.exportSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find({ 
      confirmed: true, 
      unsubscribed: false 
    }).sort({ createdAt: -1 });

    const fields = ['email', 'confirmed', 'confirmedAt', 'createdAt'];
    const csv = exportToCSV(subscribers, fields);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=newsletter-subscribers.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Error exporting subscribers' });
  }
};

// @desc    Delete subscriber
// @route   DELETE /api/admin/subscribers/:id
// @access  Private/Admin
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    res.json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting subscriber' });
  }
};
