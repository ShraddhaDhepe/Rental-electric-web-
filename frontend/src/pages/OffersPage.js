import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaTag, FaClock, FaPercent } from 'react-icons/fa';
import './OffersPage.css';

const offers = [
  {
    id: 1, tag: 'SUMMER SPECIAL', badge: '🌞',
    title: 'Beat the Heat with AC Rentals',
    desc: 'Rent inverter ACs from top brands — LG, Voltas, Daikin. Installation included. No maintenance cost.',
    from: '₹699/mo', saving: 'Save up to ₹200/mo', expires: '31 Aug 2026',
    to: '/products?category=Air+Conditioner&orderType=rent',
    color: '#1a6b8a', light: '#e6f4f9'
  },
  {
    id: 2, tag: 'WORK FROM HOME', badge: '💻',
    title: 'Laptop Rental for Students & Professionals',
    desc: 'Dell, HP, Lenovo, Apple MacBook. Rent monthly without a big upfront investment. Flexible plans.',
    from: '₹799/mo', saving: 'Save up to ₹300/mo', expires: '31 Dec 2026',
    to: '/products?category=Laptop&orderType=rent',
    color: '#4a3f8c', light: '#ede9fe'
  },
  {
    id: 3, tag: 'HOME MAKEOVER', badge: '🏠',
    title: 'Appliance Bundle Deal',
    desc: 'Rent a Fridge + Washing Machine together at special combo pricing. Perfect for new apartments.',
    from: '₹1,299/mo', saving: 'Save ₹400 vs renting separately', expires: '30 Sep 2026',
    to: '/products?orderType=rent',
    color: '#1e6b3c', light: '#d1fae5'
  },
  {
    id: 4, tag: 'CLEARANCE SALE', badge: '🔖',
    title: 'Up to 40% Off on Purchases',
    desc: 'Grab refurbished and last-season models at massive discounts. All products tested & warranted.',
    from: 'Up to 40% OFF', saving: 'Limited stock', expires: '15 Aug 2026',
    to: '/products?orderType=buy',
    color: '#8b4513', light: '#fef3c7'
  },
  {
    id: 5, tag: 'FESTIVAL OFFER', badge: '🎉',
    title: '0% EMI on Purchases Above ₹10,000',
    desc: 'Split your purchase into 6 or 12 monthly installments at zero interest with select banks.',
    from: '0% EMI', saving: 'No processing fee', expires: '30 Oct 2026',
    to: '/products?orderType=buy',
    color: '#6b21a8', light: '#ede9fe'
  },
  {
    id: 6, tag: 'NEW CUSTOMER', badge: '🎁',
    title: 'First Rental Free Delivery + ₹500 Off',
    desc: 'First-time renters get free delivery + ₹500 off on security deposit. Use code FIRSTRENT at checkout.',
    from: '₹500 OFF', saving: 'Code: FIRSTRENT', expires: 'Ongoing',
    to: '/register',
    color: '#E8201A', light: '#fff0ef'
  },
];

const OffersPage = () => {
  return (
    <div className="offers-page">
      {/* Hero */}
      <div className="offers-hero">
        <div className="container">
          <div className="offers-hero-badge"><FaTag /> Exclusive Deals</div>
          <h1>Offers & Promotions</h1>
          <p>The best deals on electronics rentals and purchases. Updated regularly.</p>
        </div>
      </div>

      <div className="container">
        <div className="offers-grid">
          {offers.map(offer => (
            <div
              key={offer.id}
              className="offer-detail-card"
              style={{ borderColor: offer.color }}
            >
              <div className="offer-header" style={{ background: offer.light }}>
                <div className="offer-meta">
                  <span className="offer-tag-badge" style={{ background: offer.color }}>
                    {offer.tag}
                  </span>
                  <div className="offer-emoji">{offer.badge}</div>
                </div>
                <h2 style={{ color: offer.color }}>{offer.title}</h2>
                <p>{offer.desc}</p>
              </div>
              <div className="offer-body">
                <div className="offer-pricing">
                  <div className="offer-from">
                    <FaPercent className="offer-icon" style={{ color: offer.color }} />
                    <div>
                      <span>Starting from</span>
                      <strong style={{ color: offer.color }}>{offer.from}</strong>
                    </div>
                  </div>
                  <div className="offer-save">
                    <span className="save-badge">{offer.saving}</span>
                  </div>
                </div>
                <div className="offer-expires">
                  <FaClock size={12} />
                  <span>Offer valid till: <strong>{offer.expires}</strong></span>
                </div>
                <Link to={offer.to} className="offer-btn" style={{ background: offer.color }}>
                  Grab This Deal <FaArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon codes */}
        <div className="coupon-section">
          <h2>Coupon Codes</h2>
          <div className="coupon-grid">
            {[
              { code: 'FIRSTRENT', desc: '₹500 off on first rental', validFor: 'New customers' },
              { code: 'SUMMER25', desc: '25% off on AC & Cooler rentals', validFor: 'All customers' },
              { code: 'EMI0', desc: '0% EMI on 6-month plans', validFor: 'Purchase above ₹10K' },
              { code: 'BUNDLE15', desc: '15% off on appliance bundles', validFor: 'Rent 2+ appliances' },
            ].map(c => (
              <div key={c.code} className="coupon-card">
                <div className="coupon-code">{c.code}</div>
                <p>{c.desc}</p>
                <span>{c.validFor}</span>
                <button
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(c.code);
                    alert(`Copied: ${c.code}`);
                  }}
                >
                  Copy Code
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
