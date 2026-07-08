import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts, fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { BrandLogo } from '../components/common/BrandLogo';
import { formatCurrency } from '../utils/helpers';
import {
  FaTv, FaSnowflake, FaWind, FaLaptop,
  FaMobileAlt, FaBolt, FaTshirt, FaArrowRight,
  FaStar, FaShieldAlt, FaTruck, FaHeadset, FaRupeeSign,
  FaCheckCircle
} from 'react-icons/fa';
import './HomePage.css';

const categories = [
  { name: 'Television', icon: <FaTv />, slug: 'Television', color: '#6C63FF', bg: '#EEF2FF', img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300' },
  { name: 'Refrigerator', icon: <FaSnowflake />, slug: 'Refrigerator', color: '#22c55e', bg: '#dcfce7', img: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300' },
  { name: 'Washing Machine', icon: <FaTshirt />, slug: 'Washing Machine', color: '#3b82f6', bg: '#dbeafe', img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300' },
  { name: 'Air Conditioner', icon: <FaWind />, slug: 'Air Conditioner', color: '#06b6d4', bg: '#cffafe', img: 'https://images.unsplash.com/photo-1601146800832-90f9e4a25f3e?w=300' },
  { name: 'Laptop', icon: <FaLaptop />, slug: 'Laptop', color: '#8b5cf6', bg: '#ede9fe', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300' },
  { name: 'Smartphone', icon: <FaMobileAlt />, slug: 'Smartphone', color: '#f59e0b', bg: '#fef3c7', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300' },
  { name: 'Microwave', icon: <FaBolt />, slug: 'Microwave', color: '#ef4444', bg: '#fee2e2', img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300' },
  { name: 'Geyser', icon: <FaBolt />, slug: 'Geyser', color: '#ec4899', bg: '#fce7f3', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300' }
];

const rentalSteps = [
  { step: '01', title: 'Choose Your Product', desc: 'Browse our wide range of electronics and pick what you need.' },
  { step: '02', title: 'Select Rental Plan', desc: 'Choose from 3, 6, or 12-month rental plans with flexible pricing.' },
  { step: '03', title: 'Pay Security Deposit', desc: 'Pay a small refundable security deposit to confirm your booking.' },
  { step: '04', title: 'Get It Delivered', desc: 'We deliver and set up the product at your doorstep within 3-5 days.' }
];

const testimonials = [
  { name: 'Rahul Sharma', city: 'Mumbai', rating: 5, text: 'Rented a Samsung TV for 6 months. Great experience! Product was in perfect condition and delivery was super fast. Will definitely use again.' },
  { name: 'Priya Singh', city: 'Bangalore', rating: 5, text: 'Needed a laptop for 3 months for my internship. RentoMojo made it so easy. Affordable monthly rent and no hidden charges!' },
  { name: 'Amit Patel', city: 'Delhi', rating: 4, text: 'Great platform for electronics rental. The AC I rented worked perfectly throughout summer. Customer support is excellent.' }
];

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredProducts, products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchProducts({ isNewArrival: true, limit: 8 }));
  }, [dispatch]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <FaStar /> India's #1 Electronics Rental Platform
            </div>
            <h1>
              Rent or Buy<br />
              <span className="gradient-text">Premium Electronics</span><br />
              At Your Doorstep
            </h1>
            <p>
              Get the latest TVs, Refrigerators, ACs, Laptops & more — rent for as low as 
              <strong> ₹399/month</strong> or buy at unbeatable prices. Free setup included.
            </p>
            <div className="hero-actions">
              <Link to="/products?orderType=rent" className="hero-btn-primary">
                🏷️ Rent Electronics
              </Link>
              <Link to="/products?orderType=buy" className="hero-btn-secondary">
                🛒 Shop Now <FaArrowRight size={13} />
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>50K+</strong><span>Happy Customers</span></div>
              <div className="stat-divider"></div>
              <div className="stat"><strong>200+</strong><span>Products</span></div>
              <div className="stat-divider"></div>
              <div className="stat"><strong>15+</strong><span>Cities</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card floating">
              <img src="https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500" alt="Smart TV" />
              <div className="hero-card-badge">⭐ Best Seller</div>
            </div>
            <div className="hero-card-mini floating-delay">
              <div className="mini-card">
                <span>📺</span>
                <div>
                  <strong>Samsung TV</strong>
                  <small>From ₹899/mo</small>
                </div>
              </div>
            </div>
            <div className="hero-card-mini-2 floating">
              <div className="mini-card">
                <span>✅</span>
                <div>
                  <strong>Free Setup</strong>
                  <small>All products</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="container trust-grid">
          <div className="trust-item"><FaTruck /> Free Delivery & Setup</div>
          <div className="trust-item"><FaShieldAlt /> 100% Genuine Products</div>
          <div className="trust-item"><FaHeadset /> 24/7 Customer Support</div>
          <div className="trust-item"><FaRupeeSign /> Easy Monthly Payments</div>
          <div className="trust-item"><FaCheckCircle /> Verified Brands Only</div>
        </div>
      </section>

      {/* Banner Strip */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card promo-rent">
              <div className="promo-text">
                <span>🏷️ RENT</span>
                <h3>Electronics Starting at</h3>
                <div className="promo-price">₹399<small>/month</small></div>
                <p>No maintenance. We handle it all.</p>
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
            <div className="promo-card promo-new">
              <div className="promo-text">
                <span>🆕 NEW</span>
                <h3>Latest Arrivals</h3>
                <div className="promo-price">Just In</div>
                <p>Check out the newest electronics.</p>
                <Link to="/products?isNewArrival=true">See New →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Shop by Category</h2>
              <p>Find the perfect electronics for your home</p>
            </div>
            <Link to="/products" className="see-all-link">View All <FaArrowRight size={12} /></Link>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="category-card"
                style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
              >
                <div className="cat-img-wrap">
                  <img src={cat.img} alt={cat.name} loading="lazy" />
                  <div className="cat-overlay">
                    <span className="cat-icon-large" style={{ color: cat.color }}>{cat.icon}</span>
                  </div>
                </div>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Featured Products</h2>
              <p>Handpicked bestsellers for you</p>
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

      {/* How Renting Works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header centered">
            <h2>How Renting Works</h2>
            <p>Get your favourite electronics in 4 simple steps</p>
          </div>
          <div className="steps-grid">
            {rentalSteps.map((s) => (
              <div key={s.step} className="step-card">
                <div className="step-number">{s.step}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="how-it-works-cta">
            <Link to="/products?orderType=rent" className="btn btn-primary btn-lg">
              Start Renting Today
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>🆕 New Arrivals</h2>
              <p>The latest and greatest electronics</p>
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

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header centered">
            <h2>What Our Customers Say</h2>
            <p>Real reviews from real customers</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, j) => <FaStar key={j} />)}
                </div>
                <p>"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name.charAt(0)}</div>
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

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-content">
          <div>
            <h2>Ready to Upgrade Your Home?</h2>
            <p>Rent premium electronics with zero down payment, free installation & maintenance.</p>
          </div>
          <div className="cta-actions">
            <Link to="/products?orderType=rent" className="cta-btn-white">
              Rent Now
            </Link>
            <Link to="/register" className="cta-btn-outline">
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
