import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts, fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import {
  FaTv, FaSnowflake, FaWind, FaLaptop,
  FaMobileAlt, FaBolt, FaTshirt, FaArrowRight,
  FaStar, FaShieldAlt, FaTruck, FaHeadset, FaRupeeSign,
  FaCheckCircle, FaSearch, FaClipboardList, FaThumbsUp,
  FaBoxOpen, FaCreditCard, FaGift, FaCalculator,
  FaQuoteLeft, FaChevronDown, FaFire
} from 'react-icons/fa';
import './HomePage.css';

/* ─── Category data (matches RentoMojo grid) ─── */
const categories = [
  { name: 'Television',        icon: '📺', slug: 'Television',      img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=200' },
  { name: 'Refrigerator',      icon: '🧊', slug: 'Refrigerator',    img: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200' },
  { name: 'Washing Machine',   icon: '🫧', slug: 'Washing Machine', img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200' },
  { name: 'Air Conditioner',   icon: '❄️', slug: 'Air Conditioner', img: 'https://images.unsplash.com/photo-1601146800832-90f9e4a25f3e?w=200' },
  { name: 'Laptop',            icon: '💻', slug: 'Laptop',          img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200' },
  { name: 'Smartphone',        icon: '📱', slug: 'Smartphone',      img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200' },
  { name: 'Microwave',         icon: '🍽️', slug: 'Microwave',       img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=200' },
  { name: 'Geyser',            icon: '🚿', slug: 'Geyser',          img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200' },
  { name: 'Projector',         icon: '🎥', slug: 'Projector',       img: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=200' },
  { name: 'Camera',            icon: '📷', slug: 'Camera',          img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200' },
];

/* ─── Featured banner slides ─── */
const bannerSlides = [
  {
    tag: 'NEW ARRIVAL',
    title: 'EXPLORE\nWATER PURIFIERS',
    img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500',
    link: '/products?category=Water Purifier',
    accent: '#E8201A'
  },
  {
    tag: 'SUMMER OFFER',
    title: 'RENT AN\nAIR CONDITIONER',
    img: 'https://images.unsplash.com/photo-1601146800832-90f9e4a25f3e?w=500',
    link: '/products?category=Air Conditioner&orderType=rent',
    accent: '#2563eb'
  },
  {
    tag: 'WORK FROM HOME',
    title: 'RENT A\nLAPTOP TODAY',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    link: '/products?category=Laptop&orderType=rent',
    accent: '#1a1a2e'
  },
];

const howItWorksSteps = [
  { icon: <FaSearch />, step: '01', title: 'Browse & Select', desc: 'Explore 500+ products across categories. Filter by brand, specs, and budget.' },
  { icon: <FaClipboardList />, step: '02', title: 'Apply in 2 Minutes', desc: 'Simple KYC process. Just your Aadhaar & PAN.' },
  { icon: <FaThumbsUp />, step: '03', title: 'Get Approved', desc: 'Instant approval for most customers within hours.' },
  { icon: <FaBoxOpen />, step: '04', title: 'Free Delivery & Setup', desc: 'We deliver and professionally set up at your doorstep.' },
  { icon: <FaCreditCard />, step: '05', title: 'Monthly Payments', desc: 'Pay a fixed monthly rent via UPI, Card, or Auto-debit.' },
  { icon: <FaGift />, step: '06', title: 'Own It (Optional)', desc: 'Love it? Buy it at a discounted price anytime.' },
];

const testimonials = [
  { name: 'Rahul Sharma', city: 'Mumbai', rating: 5, initials: 'RS', text: 'Rented a Samsung TV for 6 months. The experience was fantastic — product arrived on time, setup was done professionally.', product: 'Samsung 55" 4K TV' },
  { name: 'Priya Singh', city: 'Bangalore', rating: 5, initials: 'PS', text: 'Needed a laptop for my 3-month internship. Made it so affordable and easy. Zero hidden charges.', product: 'Dell Inspiron 15 Laptop' },
  { name: 'Amit Patel', city: 'Delhi', rating: 5, initials: 'AP', text: 'The AC I rented worked perfectly throughout summer. When it needed maintenance, they fixed it within a day.', product: 'Voltas 1.5T Inverter AC' },
  { name: 'Sneha Gupta', city: 'Pune', rating: 4, initials: 'SG', text: 'Moved to a new city and furnished my entire flat with rented appliances. Saved so much vs buying.', product: 'Refrigerator + Washing Machine' },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, products, loading } = useSelector((state) => state.products);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [showAllCats, setShowAllCats] = useState(false);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchProducts({ isNewArrival: true, limit: 8 }));
  }, [dispatch]);

  // Auto-advance banner
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % bannerSlides.length), 4500);
    return () => clearInterval(t);
  }, []);

  const visibleCats = showAllCats ? categories : categories.slice(0, 10);
  const slide = bannerSlides[bannerIdx];

  return (
    <div className="home-page">

      {/* ══ MAIN CONTENT: BANNER + CATEGORIES ══ */}
      <section className="main-content-section">
        <div className="container main-grid">

          {/* Left: Featured Banner */}
          <div className="banner-panel">
            <div className="banner-card" style={{ '--accent': slide.accent }}>
              <img src={slide.img} alt={slide.title} className="banner-img" key={bannerIdx} />
              <div className="banner-overlay">
                <span className="banner-tag">{slide.tag}</span>
                <h2 className="banner-title">{slide.title}</h2>
                <Link to={slide.link} className="banner-cta">
                  Explore <FaArrowRight size={12} />
                </Link>
              </div>
              {/* Dots */}
              <div className="banner-dots">
                {bannerSlides.map((_, i) => (
                  <button
                    key={i}
                    className={`banner-dot ${i === bannerIdx ? 'active' : ''}`}
                    onClick={() => setBannerIdx(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Trust strip under banner */}
            <div className="mini-trust-strip">
              <span><FaTruck size={12} /> Free Delivery</span>
              <span><FaShieldAlt size={12} /> Genuine Products</span>
              <span><FaHeadset size={12} /> 24/7 Support</span>
            </div>
          </div>

          {/* Right: Categories Grid */}
          <div className="categories-panel">
            <div className="panel-header">
              <h2>Explore <span className="red-text">our Top Categories</span> <span className="red-dash">——</span></h2>
            </div>
            <div className="categories-grid-rm">
              {visibleCats.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/products?category=${cat.slug}`}
                  className="cat-tile"
                >
                  <div className="cat-tile-img-wrap">
                    <img src={cat.img} alt={cat.name} loading="lazy" />
                  </div>
                  <span className="cat-tile-name">{cat.name}</span>
                </Link>
              ))}
            </div>
            {!showAllCats && categories.length > 10 && (
              <button className="view-more-cats" onClick={() => setShowAllCats(true)}>
                View More categories <FaChevronDown size={12} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══ TRUST STRIP ══ */}
      <section className="trust-section">
        <div className="container trust-grid">
          <div className="trust-item"><FaTruck /> Free Delivery & Setup</div>
          <div className="trust-item"><FaShieldAlt /> 100% Genuine Products</div>
          <div className="trust-item"><FaHeadset /> 24/7 Customer Support</div>
          <div className="trust-item"><FaRupeeSign /> Easy Monthly Payments</div>
          <div className="trust-item"><FaCheckCircle /> No Hidden Charges</div>
        </div>
      </section>

      {/* ══ PROMO BANNERS ══ */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card promo-rent">
              <div className="promo-text">
                <span>🏷️ RENT</span>
                <h3>Electronics Starting at</h3>
                <div className="promo-price">₹399<small>/month</small></div>
                <p>No maintenance costs. We handle it all.</p>
                <Link to="/products?orderType=rent">Explore Rentals →</Link>
              </div>
            </div>
            <div className="promo-card promo-buy">
              <div className="promo-text">
                <span>🛒 BUY</span>
                <h3>Upto 40% Off</h3>
                <div className="promo-price">Best Deals</div>
                <p>On top brands. Limited time offer.</p>
                <Link to="/products?orderType=buy">Shop Now →</Link>
              </div>
            </div>
            <div className="promo-card promo-emi">
              <div className="promo-text">
                <span>💳 EMI</span>
                <h3>Easy EMI Options</h3>
                <div className="promo-price">0%<small> interest</small></div>
                <p>No-cost EMI on select products.</p>
                <Link to="/products?isFeatured=true">View EMI Products →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Featured Products</h2>
              <p>Handpicked bestsellers — available to rent or buy</p>
            </div>
            <Link to="/products?isFeatured=true" className="see-all-link">View All <FaArrowRight size={12} /></Link>
          </div>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="products-grid">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ HOT DEALS ══ */}
      <section className="section offers-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2><FaFire style={{color:'#E8201A'}} /> Hot Deals &amp; Offers</h2>
              <p>Limited-time seasonal promotions</p>
            </div>
            <Link to="/offers" className="see-all-link">All Offers <FaArrowRight size={12} /></Link>
          </div>
          <div className="offers-grid">
            <div className="offer-card offer-summer">
              <div className="offer-tag">Summer Special</div>
              <h3>AC Rental</h3>
              <p>Beat the heat with inverter ACs from top brands</p>
              <div className="offer-price">From <strong>₹699/mo</strong></div>
              <Link to="/products?category=Air Conditioner&orderType=rent" className="offer-cta">Rent an AC <FaArrowRight size={11} /></Link>
            </div>
            <div className="offer-card offer-work">
              <div className="offer-tag">Work From Home</div>
              <h3>Laptop Rental</h3>
              <p>Power your productivity with premium laptops</p>
              <div className="offer-price">From <strong>₹799/mo</strong></div>
              <Link to="/products?category=Laptop&orderType=rent" className="offer-cta">Rent a Laptop <FaArrowRight size={11} /></Link>
            </div>
            <div className="offer-card offer-home">
              <div className="offer-tag">Home Makeover</div>
              <h3>Appliance Bundle</h3>
              <p>Fridge + Washing Machine combo at special rates</p>
              <div className="offer-price">From <strong>₹1,299/mo</strong></div>
              <Link to="/products?orderType=rent" className="offer-cta">View Bundle <FaArrowRight size={11} /></Link>
            </div>
            <div className="offer-card offer-emi">
              <div className="offer-tag">Finance Deal</div>
              <h3>0% EMI</h3>
              <p>No-cost EMI on purchases above ₹10,000</p>
              <div className="offer-price">For <strong>6-12 months</strong></div>
              <Link to="/products?orderType=buy" className="offer-cta">Shop on EMI <FaArrowRight size={11} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="section how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header centered">
            <h2>How Renting Works</h2>
            <p>Get your favourite electronics in 6 simple steps</p>
          </div>
          <div className="steps-grid">
            {howItWorksSteps.map((s) => (
              <div key={s.step} className="step-card">
                <div className="step-icon">{s.icon}</div>
                <div className="step-number">{s.step}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="how-it-works-cta">
            <Link to="/products?orderType=rent" className="btn btn-primary btn-lg">
              Start Renting Today <FaArrowRight size={14} />
            </Link>
            <Link to="/rent-vs-buy" className="btn-calc-link">
              <FaCalculator size={14} /> Rent vs Buy Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* ══ NEW ARRIVALS ══ */}
      <section className="section new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>🆕 New Arrivals</h2>
              <p>The latest electronics just added to our catalogue</p>
            </div>
            <Link to="/products?isNewArrival=true" className="see-all-link">View All <FaArrowRight size={12} /></Link>
          </div>
          <div className="products-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header centered">
            <h2>What Our Customers Say</h2>
            <p>Real reviews from 50,000+ satisfied customers</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, j) => <FaStar key={j} />)}
                </div>
                <FaQuoteLeft className="quote-icon" />
                <p>"{t.text}"</p>
                <div className="testimonial-product"><FaCheckCircle /> {t.product}</div>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <small>{t.city}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="cta-banner">
        <div className="container cta-content">
          <div>
            <h2>Ready to Upgrade Your Home?</h2>
            <p>Rent premium electronics with zero down payment, free installation &amp; maintenance.</p>
            <div className="cta-trust">
              <span><FaCheckCircle /> No Security Deposit</span>
              <span><FaCheckCircle /> Free Setup</span>
              <span><FaCheckCircle /> 7-Day Returns</span>
            </div>
          </div>
          <div className="cta-actions">
            <Link to="/products?orderType=rent" className="cta-btn-white">Rent Now <FaArrowRight size={13} /></Link>
            <Link to="/register" className="cta-btn-outline">Sign Up Free</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
