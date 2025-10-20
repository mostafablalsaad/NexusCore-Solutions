const Project = require('../models/Project');
const CaseStudy = require('../models/CaseStudy');
const Whitepaper = require('../models/Whitepaper');
const ContactMessage = require('../models/ContactMessage');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Count documents
    const totalProjects = await Project.countDocuments();
    const totalCaseStudies = await CaseStudy.countDocuments();
    const totalWhitepapers = await Whitepaper.countDocuments();
    const totalMessages = await ContactMessage.countDocuments();
    const unreadMessages = await ContactMessage.countDocuments({ read: false });
    const totalSubscribers = await NewsletterSubscriber.countDocuments({ 
      confirmed: true, 
      unsubscribed: false 
    });

    // Recent messages
    const recentMessages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email message read createdAt');

    // Recent subscribers
    const recentSubscribers = await NewsletterSubscriber.find({ 
      confirmed: true 
    })
      .sort({ confirmedAt: -1 })
      .limit(5)
      .select('email confirmedAt');

    // Monthly stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyMessages = await ContactMessage.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const monthlySubscribers = await NewsletterSubscriber.aggregate([
      {
        $match: {
          confirmedAt: { $gte: sixMonthsAgo, $ne: null }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$confirmedAt' },
            month: { $month: '$confirmedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Projects by industry
    const projectsByIndustry = await Project.aggregate([
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top downloaded whitepapers
    const topWhitepapers = await Whitepaper.find()
      .sort({ downloadCount: -1 })
      .limit(5)
      .select('title downloadCount');

    res.json({
      success: true,
      data: {
        counts: {
          projects: totalProjects,
          caseStudies: totalCaseStudies,
          whitepapers: totalWhitepapers,
          messages: totalMessages,
          unreadMessages,
          subscribers: totalSubscribers,
        },
        recentMessages,
        recentSubscribers,
        charts: {
          monthlyMessages,
          monthlySubscribers,
          projectsByIndustry,
        },
        topWhitepapers,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Error fetching dashboard statistics' });
  }
};

// @desc    Upload image
// @route   POST /api/admin/upload/image
// @access  Private/Admin
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      success: true,
      data: {
        url: req.file.path,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading image' });
  }
};

// @desc    Upload PDF
// @route   POST /api/admin/upload/pdf
// @access  Private/Admin
exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      success: true,
      data: {
        url: req.file.path,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading PDF' });
  }
};
