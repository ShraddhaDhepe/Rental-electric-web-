import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaSearch, FaHeadset, FaEnvelope } from 'react-icons/fa';
import './FAQPage.css';

const faqData = [
  {
    category: 'Renting Basics',
    questions: [
      {
        q: 'How does renting electronics work?',
        a: 'Simply browse our catalogue, choose a product and rental plan (3, 6, or 12 months), complete a quick KYC, pay a security deposit, and we deliver and set up the product at your home for free.'
      },
      {
        q: 'What documents are required for renting?',
        a: 'We require a valid government ID (Aadhaar/Passport/Driving License), PAN card, and address proof. The process is fully online and takes under 2 minutes.'
      },
      {
        q: 'Is there a security deposit?',
        a: 'Yes, a refundable security deposit is required. It typically ranges from 1 to 2 months of rent depending on the product. This is fully refunded when you return the product in good condition.'
      },
      {
        q: 'Can I rent for less than 3 months?',
        a: 'Our minimum rental tenure is 3 months. This ensures we can offer you the best monthly rates and proper service commitments.'
      },
    ]
  },
  {
    category: 'Delivery & Setup',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'We deliver within 3–5 business days in most cities. Express delivery (1–2 days) is available in metro cities for an additional charge.'
      },
      {
        q: 'Is installation included in the rental?',
        a: 'Yes! Free professional installation and setup is included for all products. Our technicians will set up and demonstrate the product at your home.'
      },
      {
        q: 'Which cities do you operate in?',
        a: 'We currently serve 25+ cities including Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, and more. Check our website for the complete list.'
      },
    ]
  },
  {
    category: 'Payments & Pricing',
    questions: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept UPI, Debit/Credit Cards, Net Banking, EMI, and popular wallets like PhonePe, Paytm, and Google Pay. Monthly payments can also be set up as auto-debit.'
      },
      {
        q: 'Are there any hidden charges?',
        a: 'No hidden charges whatsoever. You pay the monthly rent + security deposit upfront. Maintenance and repairs during the rental period are completely free.'
      },
      {
        q: 'Can I get EMI on purchases?',
        a: 'Yes, we offer 0% EMI for 6–12 months on purchases above ₹10,000 through select banks and fintech partners.'
      },
    ]
  },
  {
    category: 'Returns & Maintenance',
    questions: [
      {
        q: 'What if the product needs repair?',
        a: 'Maintenance and repairs are completely free during your rental tenure. Call us or raise a service request through your account, and we\'ll send a technician within 24–48 hours.'
      },
      {
        q: 'How do I return the product?',
        a: 'At the end of your tenure, contact us to schedule a free pickup. Our team will collect the product, inspect it, and process your security deposit refund within 7 working days.'
      },
      {
        q: 'What happens if I damage the product?',
        a: 'Minor wear and tear is normal. For significant damage, we charge a repair cost based on the extent of damage. We recommend our damage protection plan for added peace of mind.'
      },
      {
        q: 'Can I extend my rental tenure?',
        a: 'Absolutely! You can extend your tenure online from your account dashboard. We\'ll confirm the new end date and any revised pricing.'
      },
    ]
  },
  {
    category: 'Buying Options',
    questions: [
      {
        q: 'Can I buy the product I\'m renting?',
        a: 'Yes! We offer an "Early Buyout" option at any time during your rental. The price is discounted based on how long you\'ve rented. Login to your account to see your buyout price.'
      },
      {
        q: 'Do you sell new and refurbished products?',
        a: 'We sell both new and certified refurbished products. All refurbished items are thoroughly tested, cleaned, and come with a minimum 6-month warranty.'
      },
    ]
  },
];

const FAQPage = () => {
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleItem = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = ['All', ...faqData.map(f => f.category)];

  const filteredFaqs = faqData
    .filter(cat => activeCategory === 'All' || cat.category === activeCategory)
    .map(cat => ({
      ...cat,
      questions: cat.questions.filter(
        q => !searchQuery ||
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(cat => cat.questions.length > 0);

  return (
    <div className="faq-page">
      {/* Header */}
      <div className="faq-hero">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Find clear answers to all your questions about renting and buying electronics</p>
          <div className="faq-search">
            <FaSearch className="faq-search-icon" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container faq-layout">
        {/* Category Filter */}
        <div className="faq-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`faq-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="faq-content">
          {filteredFaqs.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 48 }}>🔍</div>
              <h3>No results found</h3>
              <p>Try different search terms</p>
            </div>
          ) : (
            filteredFaqs.map((cat, catIdx) => (
              <div key={catIdx} className="faq-section">
                <h2 className="faq-section-title">{cat.category}</h2>
                <div className="faq-list">
                  {cat.questions.map((item, qIdx) => {
                    const key = `${catIdx}-${qIdx}`;
                    const isOpen = openItems[key];
                    return (
                      <div key={qIdx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                        <button
                          className="faq-question"
                          onClick={() => toggleItem(catIdx, qIdx)}
                          aria-expanded={isOpen}
                        >
                          <span>{item.q}</span>
                          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {isOpen && (
                          <div className="faq-answer">
                            <p>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Still have questions */}
        <div className="faq-contact">
          <h3>Still have questions?</h3>
          <p>Our support team is available Mon–Sat, 9AM–8PM</p>
          <div className="faq-contact-actions">
            <Link to="/support" className="btn btn-primary">
              <FaHeadset /> Contact Support
            </Link>
            <a href="mailto:support@rentselectronics.com" className="btn btn-outline">
              <FaEnvelope /> Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
