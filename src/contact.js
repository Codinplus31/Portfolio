import React, { useState } from 'react';

const EMPTY_FORM = { name: '', email: '', message: '', website: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(formData) {
  const errors = {};
  if (!formData.name.trim()) errors.name = 'Name is required.';
  else if (formData.name.trim().length > 100) errors.name = 'Name must be 100 characters or fewer.';

  if (!formData.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_PATTERN.test(formData.email.trim())) errors.email = 'Enter a valid email address.';

  if (!formData.message.trim()) errors.message = 'Message is required.';
  else if (formData.message.trim().length > 5000) errors.message = 'Message must be 5000 characters or fewer.';
  return errors;
}

function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (status.type) setStatus({ type: '', message: '' });
  };

  const sendEmail = async (event) => {
    event.preventDefault();
    if (sending) return;

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus({ type: 'error', message: 'Please correct the highlighted fields.' });
      return;
    }

    setSending(true);
    setErrors({});
    setStatus({ type: 'info', message: 'Sending your message…' });
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          website: formData.website,
        }),
        signal: controller.signal,
      });

      const responseText = await response.text();
      let result = {};
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (_) {
        // Keep a friendly fallback when a host returns a non-JSON error page.
      }

      if (!response.ok || !result.success) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.error || 'Your message could not be sent. Please try again.');
      }

      setFormData(EMPTY_FORM);
      setStatus({
        type: 'success',
        message: result.confirmationSent === false
          ? 'Message sent successfully. I’ll get back to you soon.'
          : 'Message sent! Please check your inbox for confirmation.',
      });
    } catch (error) {
      const message = error.name === 'AbortError'
        ? 'The request took too long. Please check your connection and try again.'
        : error.message || 'Unable to send your message. Please try again later.';
      setStatus({ type: 'error', message });
    } finally {
      window.clearTimeout(timeout);
      setSending(false);
    }
  };

  return (
    <>
      <form id="contact" onSubmit={sendEmail} className="contact" noValidate>
        <h1>Contact Me</h1>
        <img src="isme.jpg" alt="Paul Uhunoma" />

        <div className={`input first ${errors.name ? 'field-error' : ''}`}>
          <label className="sr-only" htmlFor="contact-name">Full name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength="100"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
          />
          {errors.name && <span id="contact-name-error" className="contact-field-error">{errors.name}</span>}
        </div>

        <div className={`input last ${errors.email ? 'field-error' : ''}`}>
          <label className="sr-only" htmlFor="contact-email">Email address</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength="254"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
          />
          {errors.email && <span id="contact-email-error" className="contact-field-error">{errors.email}</span>}
        </div>

        <div className={`textarea ${errors.message ? 'field-error' : ''}`}>
          <label className="sr-only" htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            maxLength="5000"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell me about your project or opportunity"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
          />
          {errors.message && <span id="contact-message-error" className="contact-field-error">{errors.message}</span>}
        </div>

        {/* Honeypot field: hidden from people, filled by basic form bots. */}
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex="-1"
            autoComplete="off"
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" disabled={sending}>
          {sending ? 'Sending…' : 'Send Message'}
        </button>

        {status.message && (
          <div className={`contact-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'} aria-live="polite">
            {status.type === 'success' && <span aria-hidden="true">✓</span>}
            {status.message}
          </div>
        )}
      </form>

      <div className="footer">
        <h3>
          <svg style={{ marginTop: '0.1rem' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM8.146 4.992c-1.212 0-1.927.92-1.927 2.502v1.06c0 1.571.703 2.462 1.927 2.462.979 0 1.641-.586 1.729-1.418h1.295v.093c-.1 1.448-1.354 2.467-3.03 2.467-2.091 0-3.269-1.336-3.269-3.603V7.482c0-2.261 1.201-3.638 3.27-3.638 1.681 0 2.935 1.054 3.029 2.572v.088H9.875c-.088-.879-.768-1.512-1.729-1.512Z" />
          </svg>
          Developed by Uhunoma Paul
        </h3>
      </div>
    </>
  );
}

export default Contact;
