import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPhoneAlt, FaEnvelope, FaWhatsapp, FaComments,
  FaMapMarkerAlt, FaCheckCircle, FaClock, FaQuestionCircle
} from 'react-icons/fa';
import './SupportPage.css';

const SupportPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="support-page">
        <div className="container">
          <div className="support-success">
            <div className="success-icon">✅</div>
            <h2>Message Sent!</h2>
            <p>Thank you for reaching out. Our support team will get back to you within 2–4 hours.</p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="support-page">
      {/* Hero */}
      <div className="support-hero">
        <div className="container">
          <h1>Customer Support</h1>
          <p>We're here to help. Choose your preferred way to reach us.</p>
        </div>
      </div>

      <div className="container support-layout">
        {/* Contact channels */}
        <div className="support-channels">
          <h2>Contact Us</h2>
          <div className="channels-grid">
            <div className="channel-card channel-phone">
              <div className="channel-icon"><FaPhoneAlt /></div>
              <h3>Phone Support</h3>
              <p>Talk to our experts directly</p>
              <a href="tel:18001234567" className="channel-cta">1800-123-4567</a>
              <span className="channel-hours"><FaClock size={12} /> Mon–Sat: 9AM – 8PM</span>
            </div>
            <div className="channel-card channel-whatsapp">
              <div className="channel-icon"><FaWhatsapp /></div>
              <h3>WhatsApp</h3>
              <p>Quick responses on WhatsApp</p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="channel-cta">
                Chat on WhatsApp
              </a>
              <span className="channel-hours"><FaClock size={12} /> Mon–Sat: 9AM – 10PM</span>
            </div>
            <div className="channel-card channel-email">
              <div className="channel-icon"><FaEnvelope /></div>
              <h3>Email Support</h3>
              <p>Detailed queries & complaints</p>
              <a href="mailto:support@rentselectronics.com" className="channel-cta">
                support@rentselectronics.com
              </a>
              <span className="channel-hours"><FaClock size={12} /> Response within 4 hours</span>
            </div>
            <div className="channel-card channel-live">
              <div className="channel-icon"><FaComments /></div>
              <h3>Live Chat</h3>
              <p>Instant chat with support agents</p>
              <button
                className="channel-cta channel-cta-btn"
                onClick={() => alert('Live chat feature coming soon!')}
              >
                Start Live Chat
              </button>
              <span className="channel-hours"><FaClock size={12} /> Mon–Sat: 9AM – 8PM</span>
            </div>
          </div>
        </div>

        <div className="support-content">
          {/* Contact Form */}
          <div className="support-form-section">
            <h2>Send Us a Message</h2>
            <p>Fill out the form and we'll get back to you within 2–4 business hours.</p>
            <form className="support-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    className="form-control"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    className="form-control"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select
                    className="form-control"
                    required
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  >
                    <option value="">Select a topic</option>
                    <option value="rental">Rental Inquiry</option>
                    <option value="order">Order Issue</option>
                    <option value="payment">Payment Problem</option>
                    <option value="return">Return / Pickup</option>
                    <option value="maintenance">Maintenance Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-control"
                  required
                  rows={5}
                  placeholder="Describe your issue or question in detail..."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                <FaEnvelope /> Send Message
              </button>
            </form>
          </div>

          {/* Office + Quick Links */}
          <div className="support-sidebar">
            <div className="support-office">
              <h3>Our Office</h3>
              <div className="office-info">
                <FaMapMarkerAlt className="office-icon" />
                <div>
                  <p>123, Tech Park, Whitefield</p>
                  <p>Bengaluru, Karnataka 560001</p>
                </div>
              </div>
            </div>

            <div className="support-quick-links">
              <h3>Quick Help</h3>
              <ul>
                <li><Link to="/faq"><FaQuestionCircle /> Browse FAQ</Link></li>
                <li><Link to="/orders"><FaCheckCircle /> Track Your Order</Link></li>
                <li><Link to="/rent-vs-buy"><FaCheckCircle /> Rent vs Buy Guide</Link></li>
                <li><a href="#!"><FaCheckCircle /> Return Policy</a></li>
                <li><a href="#!"><FaCheckCircle /> Cancellation Policy</a></li>
              </ul>
            </div>

            <div className="support-response-times">
              <h3>Response Times</h3>
              <div className="response-item">
                <FaPhoneAlt /> <span>Phone: <strong>Immediate</strong></span>
              </div>
              <div className="response-item">
                <FaWhatsapp /> <span>WhatsApp: <strong>Within 30 min</strong></span>
              </div>
              <div className="response-item">
                <FaEnvelope /> <span>Email: <strong>Within 4 hours</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
