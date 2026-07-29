import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebook, FaTwitter, FaInstagram, FaYoutube,
  FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
  FaRupeeSign, FaShieldAlt, FaTruck, FaHeadset
} from 'react-icons/fa';
import { BrandLogo } from '../common/BrandLogo';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Features strip */}
      <div className="footer-features">
        <div className="container features-grid">
          <div className="feature-item">
            <FaTruck className="fi-icon" />
            <div>
              <strong>Free Delivery</strong>
              <span>On orders above ₹999</span>
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
            <FaRupeeSign className="fi-icon" />
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
            <p>India's leading platform for renting and buying premium electronics. Get top brands at your doorstep.</p>
            <div className="social-links">
              <a href="#!" aria-label="Facebook"><FaFacebook /></a>
              <a href="#!" aria-label="Twitter"><FaTwitter /></a>
              <a href="#!" aria-label="Instagram"><FaInstagram /></a>
              <a href="#!" aria-label="YouTube"><FaYoutube /></a>
              <a href="#!" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?orderType=rent">Rent Electronics</Link></li>
              <li><Link to="/products?orderType=buy">Buy Electronics</Link></li>
              <li><Link to="/products?isFeatured=true">Featured</Link></li>
              <li><Link to="/products?isNewArrival=true">New Arrivals</Link></li>
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
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/orders">Track Order</Link></li>
              <li><a href="#!">Return Policy</a></li>
              <li><a href="#!">Privacy Policy</a></li>
              <li><a href="#!">Terms of Service</a></li>
              <li><a href="#!">FAQs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div><FaPhoneAlt /> <span>1800-123-4567</span></div>
              <div><FaEnvelope /> <span>support@rentselectronics.com</span></div>
              <div><FaMapMarkerAlt /> <span>123, Tech Park, Bengaluru, Karnataka 560001</span></div>
            </div>
            <div className="payment-icons">
              <span>💳 Visa</span>
              <span>💳 MasterCard</span>
              <span>📱 UPI</span>
              <span>🏦 NetBanking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} rentselectronics.com — All rights reserved.</p>
          <p>RENT SMART. OWN LESS. | Powered by MERN Stack</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
