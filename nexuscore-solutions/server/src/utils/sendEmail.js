const { sendEmail: sendEmailHelper } = require('../config/email');

const emailTemplates = {
  contactConfirmation: (name) => ({
    subject: 'Thank you for contacting NexusCore Solutions',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NexusCore Solutions</h1>
          </div>
          <div class="content">
            <h2>Thank you for reaching out, ${name}!</h2>
            <p>We've received your message and our team will get back to you within 24-48 hours.</p>
            <p>In the meantime, feel free to explore our:</p>
            <ul>
              <li><a href="${process.env.CLIENT_URL}/projects">Portfolio</a></li>
              <li><a href="${process.env.CLIENT_URL}/case-studies">Case Studies</a></li>
              <li><a href="${process.env.CLIENT_URL}/resources">Resources</a></li>
            </ul>
            <p>Best regards,<br>The NexusCore Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} NexusCore Solutions. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Thank you for reaching out, ${name}! We've received your message and will get back to you soon.`,
  }),

  adminNotification: (name, email, company, message) => ({
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>Received at ${new Date().toLocaleString()}</small></p>
      </body>
      </html>
    `,
    text: `New contact from ${name} (${email})\n\nCompany: ${company || 'N/A'}\n\nMessage: ${message}`,
  }),

  newsletterConfirmation: (email, confirmToken) => ({
    subject: 'Confirm your newsletter subscription',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Confirm Your Subscription</h2>
          <p>Thank you for subscribing to NexusCore Solutions newsletter!</p>
          <p>Please click the button below to confirm your subscription:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/newsletter/confirm/${confirmToken}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Confirm Subscription
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${process.env.CLIENT_URL}/newsletter/confirm/${confirmToken}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            If you didn't subscribe to our newsletter, please ignore this email.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `Confirm your subscription: ${process.env.CLIENT_URL}/newsletter/confirm/${confirmToken}`,
  }),
};

const sendContactEmail = async (to, name) => {
  const template = emailTemplates.contactConfirmation(name);
  return await sendEmailHelper({ to, ...template });
};

const sendAdminNotification = async (name, email, company, message) => {
  const template = emailTemplates.adminNotification(name, email, company, message);
  return await sendEmailHelper({ to: process.env.ADMIN_EMAIL, ...template });
};

const sendNewsletterConfirmation = async (email, confirmToken) => {
  const template = emailTemplates.newsletterConfirmation(email, confirmToken);
  return await sendEmailHelper({ to: email, ...template });
};

module.exports = {
  sendContactEmail,
  sendAdminNotification,
  sendNewsletterConfirmation,
};
