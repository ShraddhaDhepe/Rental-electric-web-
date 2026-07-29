import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebook, FaTwitter, FaInstagram, FaYoutube,
  FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
  FaRupeeSign, FaShieldAlt, FaTruck, FaHeadset,
  FaApple, FaGooglePlay, FaStar, FaCheckCircle
} from 'react-icons/fa';
import { BrandLogo } from '../common/BrandLogo';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Stats Strip */}
      <div className="footer-stats">
        <div className="container stats-grid">
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Years in Business</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Products Available</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">25+</div>
            <div className="stat-label">Cities Served</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">4.8 <FaStar className="stat-star" /></div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Features strip */}
      <div className="footer-features">
        <div className="container features-grid">
          <div className="feature-item">
            <FaTruck className="fi-icon" />
            <div>
              <strong>Free Delivery & Setup</strong>
              <span>On all orders above ₹999</span>
            </div>
          </div>
          <div className="feature-item">
            <FaShieldAlt className="fi-icon" />
            <div>
              <strong>Secure Payments</strong>
              <span>Razorpay protected</span>
            </div>
          </div>
          <div className="feature-item">
            <FaHeadset className="fi-icon" />
            <div>
              <strong>24/7 Support</strong>
              <span>Always here to help</span>
            </div>
          </div>
          <div className="feature-item">
            <FaCheckCircle className="fi-icon" />
            <div>
              <strong>Easy Returns</strong>
              <span>7-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo-link">
              <BrandLogo size="md" />
            </Link>
            <p className="footer-tagline">RENT SMART. OWN LESS.</p>
            <p>India's leading platform for renting and buying premium electronics. Get top brands at your doorstep with free delivery and setup.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
            {/* App download
            <div className="app-download">
              <p className="app-download-title">Download Our App</p>
              <div className="app-buttons">
                <a href="#!" className="app-btn">
                  <FaApple />
                  <div>
                    <span>Download on</span>
                    <strong>App Store</strong>
                  </div>
                </a>
                <a href="#!" className="app-btn">
                  <FaGooglePlay />
                  <div>
                    <span>Get it on</span>
                    <strong>Google Play</strong>
                  </div>
                </a>
              </div>
            </div>
           */}
           </div>
          {/* Company */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><a href="#!">Careers</a></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><a href="#!">Press & Media</a></li>
              <li><a href="#!">Investors</a></li>
              <li><a href="#!">Partner With Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/products?category=Television">Television</Link></li>
              <li><Link to="/products?category=Refrigerator">Refrigerator</Link></li>
              <li><Link to="/products?category=Washing Machine">Washing Machine</Link></li>
              <li><Link to="/products?category=Air Conditioner">Air Conditioner</Link></li>
              <li><Link to="/products?category=Laptop">Laptop</Link></li>
              <li><Link to="/products?category=Smartphone">Smartphone</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/support">Contact Us</Link></li>
              <li><Link to="/orders">Track Order</Link></li>
              <li><a href="#!">Shipping Policy</a></li>
              <li><a href="#!">Return Policy</a></li>
              <li><Link to="/rent-vs-buy">Rent vs Buy Calculator</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#!">Terms & Conditions</a></li>
              <li><a href="#!">Privacy Policy</a></li>
              <li><a href="#!">Cancellation Policy</a></li>
              <li><a href="#!">Refund Policy</a></li>
              <li><a href="#!">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col footer-contact">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div><FaPhoneAlt /> <span>9764114499</span></div>
              <div><FaEnvelope /> <span>support@rentselectronics.com</span></div>
              <div><FaMapMarkerAlt /> <span>Pune</span></div>
            </div>
            <div className="working-hours">
              <FaCheckCircle className="hours-icon" />
              <span>Mon–Sat: 9AM – 8PM</span>
            </div>
            <div className="payment-icons-section">
              <p className="payment-title">We Accept</p>
              <div className="payment-icons">
                <span className="pay-icon">💳 Visa</span>
                <span className="pay-icon">💳 Mastercard</span>
                <span className="pay-icon">📱 UPI</span>
                <span className="pay-icon">🏦 Net Banking</span>
                <span className="pay-icon">📲 EMI</span>
                <span className="pay-icon">👛 Wallets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="footer-trust">
        <div className="container footer-trust-inner">
          <div className="trust-badges">
            <span>🔒 SSL Secured</span>
            <span>✅ ISO 9001 Certified</span>
            <span>🛡️ PCI DSS Compliant</span>
            <span>⭐ Trusted Since 2014</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} rentselectronics.com — All rights reserved.</p>
          <p>RENT SMART. OWN LESS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
