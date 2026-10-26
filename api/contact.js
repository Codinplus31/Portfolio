const nodemailer = require('nodemailer');

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.end(JSON.stringify(payload));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (_) {
      return {};
    }
  }
  return req.body;
}

function validateContact(body) {
  const isPlainObject = body !== null
    && typeof body === 'object'
    && !Array.isArray(body)
    && (Object.getPrototypeOf(body) === Object.prototype || Object.getPrototypeOf(body) === null);

  if (!isPlainObject) {
    return {
      values: { name: '', email: '', message: '', website: '' },
      errors: { body: 'Request body must be a JSON object.' },
    };
  }

  const nonStringField = Object.keys(body).find((key) => typeof body[key] !== 'string');
  if (nonStringField) {
    return {
      values: { name: '', email: '', message: '', website: '' },
      errors: { [nonStringField]: 'This field must be a string.' },
    };
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const website = typeof body.website === 'string' ? body.website.trim() : '';
  const errors = {};

  if (!name) errors.name = 'Name is required.';
  else if (name.length > MAX_NAME_LENGTH) errors.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;

  if (!email) errors.email = 'Email is required.';
  else if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address.';

  if (!message) errors.message = 'Message is required.';
  else if (message.length > MAX_MESSAGE_LENGTH) errors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;

  return { values: { name, email, message, website }, errors };
}

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('Email service is not configured');
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: { user, pass },
  });
}

function ownerEmail({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#0f172a">
      <h2 style="color:#0891b2">New portfolio contact message</h2>
      <hr style="border:0;border-top:1px solid #e2e8f0">
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      <p><strong>Message:</strong></p>
      <div style="background:#f1f5f9;padding:15px;border-radius:8px;line-height:1.6">${safeMessage}</div>
      <p style="color:#64748b;font-size:12px;margin-top:20px">Sent from your portfolio contact form.</p>
    </div>`;
}

function confirmationEmail({ name, message }) {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#0f172a">
      <h2 style="color:#0891b2">Thank you, ${safeName}!</h2>
      <p>I've received your message and will get back to you as soon as possible.</p>
      <hr style="border:0;border-top:1px solid #e2e8f0">
      <p><strong>Your message:</strong></p>
      <div style="background:#f1f5f9;padding:15px;border-radius:8px;line-height:1.6">${safeMessage}</div>
      <p style="color:#64748b;font-size:14px;margin-top:20px">— Paul Uhunoma | Full Stack Developer &amp; Security Researcher</p>
    </div>`;
}

async function contactHandler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { success: false, error: 'Method not allowed.' });
  }

  const { values, errors } = validateContact(getBody(req));
  if (Object.keys(errors).length > 0) {
    return sendJson(res, 400, { success: false, error: 'Please correct the highlighted fields.', errors });
  }

  // Hidden honeypot: acknowledge bots without sending email.
  if (values.website) {
    return sendJson(res, 200, { success: true, message: 'Message sent successfully.' });
  }

  try {
    const transporter = createTransporter();
    const sender = process.env.EMAIL_USER;
    const recipient = process.env.EMAIL_TO || sender;

    // The owner notification is the primary operation. Once it succeeds, the
    // contact request is successful even if the courtesy confirmation fails.
    await transporter.sendMail({
      from: `"Portfolio Contact" <${sender}>`,
      to: recipient,
      replyTo: values.email,
      subject: `Portfolio contact from ${values.name.replace(/[\r\n]/g, ' ')}`,
      text: `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`,
      html: ownerEmail(values),
    });

    // Send a copy of every contact message to the additional notification address.
    const notificationRecipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'codinplus30@gmail.com';
    let notificationSent = true;
    if (notificationRecipient !== recipient) {
      try {
        await transporter.sendMail({
          from: `"Portfolio Contact" <${sender}>`,
          to: notificationRecipient,
          replyTo: values.email,
          subject: `New portfolio message from ${values.name.replace(/[\r\n]/g, ' ')}`,
          text: `Someone sent a message through your portfolio contact form.\n\nName: ${values.name}\nEmail: ${values.email}\n\nMessage:\n${values.message}`,
          html: ownerEmail(values),
        });
      } catch (notificationError) {
        notificationSent = false;
        console.error('Additional contact notification failed:', notificationError.message);
      }
    }

    let confirmationSent = true;
    try {
      await transporter.sendMail({
        from: `"Paul Uhunoma" <${sender}>`,
        to: values.email,
        subject: 'Thank you for reaching out!',
        text: `Thank you, ${values.name}!\n\nI've received your message and will get back to you as soon as possible.\n\nYour message:\n${values.message}`,
        html: confirmationEmail(values),
      });
    } catch (confirmationError) {
      confirmationSent = false;
      console.error('Contact confirmation email failed:', confirmationError.message);
    }

    return sendJson(res, 200, {
      success: true,
      notificationSent,
      confirmationSent,
      message: 'Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('Contact email failed:', error.message);
    const notConfigured = error.message === 'Email service is not configured';
    return sendJson(res, 500, {
      success: false,
      error: notConfigured
        ? 'The contact service is temporarily unavailable.'
        : 'Your message could not be sent. Please try again later.',
    });
  }
}

module.exports = contactHandler;
module.exports.validateContact = validateContact;
module.exports.escapeHtml = escapeHtml;
