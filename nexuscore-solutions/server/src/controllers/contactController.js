const ContactMessage = require('../models/ContactMessage');
const { sendContactEmail, sendAdminNotification } = require('../utils/sendEmail');
const { exportToCSV } = require('../utils/csvExport');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { name, email, company, phone, message } = req.body;
    console.log(req.body);

    const contactMessage = await ContactMessage.create({
      name,
      email,
      company,
      phone,
      message,
    });

    // Send confirmation email to user
    try {
      await sendContactEmail(email, name);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // Send notification to admin
    try {
      await sendAdminNotification(name, email, company, message);
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        id: contactMessage._id,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting contact form' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/admin/messages
// @access  Private/Admin
exports.getMessages = async (req, res) => {
  try {
    const { read, responded, limit, page = 1 } = req.query;
    const query = {};

    if (read !== undefined) query.read = read === 'true';
    if (responded !== undefined) query.responded = responded === 'true';

    const pageSize = parseInt(limit) || 20;
    const skip = (parseInt(page) - 1) * pageSize;

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skip);

    const total = await ContactMessage.countDocuments(query);

    res.json({
      success: true,
      count: messages.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / pageSize),
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

// @desc    Get single message
// @route   GET /api/admin/messages/:id
// @access  Private/Admin
exports.getMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Mark as read
    if (!message.read) {
      message.read = true;
      await message.save();
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching message' });
  }
};

// @desc    Mark message as read
// @route   PUT /api/admin/messages/:id/read
// @access  Private/Admin
exports.markAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating message' });
  }
};

// @desc    Update message response
// @route   PUT /api/admin/messages/:id/respond
// @access  Private/Admin
exports.respondToMessage = async (req, res) => {
  try {
    const { responseNote } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { 
        responded: true, 
        responseNote,
        read: true 
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error responding to message' });
  }
};

// @desc    Delete message
// @route   DELETE /api/admin/messages/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting message' });
  }
};

// @desc    Export messages to CSV
// @route   GET /api/admin/messages/export
// @access  Private/Admin
exports.exportMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    const fields = ['name', 'email', 'company', 'phone', 'message', 'read', 'responded', 'createdAt'];
    const csv = exportToCSV(messages, fields);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contact-messages.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Error exporting messages' });
  }
};
