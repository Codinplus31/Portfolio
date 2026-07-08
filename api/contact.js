const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Use express.json() for parsing JSON bodies
app.use(express.json());
app.use(cors());

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Send email to you (portfolio owner)
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #06b6d4;">New Portfolio Contact Message</h2>
          <hr style="border: 1px solid #e2e8f0;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 10px;">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="border: 1px solid #e2e8f0; margin-top: 20px;" />
          <p style="color: #64748b; font-size: 12px;">Sent from your portfolio contact form</p>
        </div>
      `,
    });

    // Send confirmation email to the user
    await transporter.sendMail({
      from: `"Paul Uhunoma" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for reaching out!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #06b6d4;">Thank you, ${name}!</h2>
          <p>I've received your message and will get back to you as soon as possible.</p>
          <hr style="border: 1px solid #e2e8f0;" />
          <p><strong>Your message:</strong></p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 10px;">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="border: 1px solid #e2e8f0; margin-top: 20px;" />
          <p style="color: #64748b; font-size: 14px;">— Paul Uhunoma | Full Stack Developer & Security Researcher</p>
          <p style="color: #64748b; font-size: 12px;">
            <a href="https://codinplus.vercel.app" style="color: #06b6d4;">codinplus.vercel.app</a> |
            <a href="https://github.com/Codinplus31" style="color: #06b6d4;">GitHub</a> |
            <a href="https://bugcrowd.com/h/codinplus" style="color: #06b6d4;">Bugcrowd</a>
          </p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Contact API server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
