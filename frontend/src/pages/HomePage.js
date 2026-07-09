import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts, fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  FaTv, FaSnowflake, FaWind, FaLaptop,
  FaMobileAlt, FaBolt, FaTshirt, FaArrowRight,
  FaStar, FaShieldAlt, FaTruck, FaHeadset, FaRupeeSign,
  FaCheckCircle, FaChevronLeft, FaChevronRight,
  FaSearch, FaClipboardList, FaThumbsUp, FaBoxOpen,
  FaCreditCard, FaGift, FaCalculator, FaQuoteLeft
} from 'react-icons/fa';
import './HomePage.css';

const categories = [
  { name: 'Television', icon: <FaTv />, slug: 'Television', color: '#E8201A', bg: '#FFF0EF', img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300' },
  { name: 'Refrigerator', icon: <FaSnowflake />, slug: 'Refrigerator', color: '#3b82f6', bg: '#dbeafe', img: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300' },
  { name: 'Washing Machine', icon: <FaTshirt />, slug: 'Washing Machine', color: '#8b5cf6', bg: '#ede9fe', img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300' },
  { name: 'Air Conditioner', icon: <FaWind />, slug: 'Air Conditioner', color: '#06b6d4', bg: '#cffafe', img: 'https://images.unsplash.com/photo-1601146800832-90f9e4a25f3e?w=300' },
  { name: 'Laptop', icon: <FaLaptop />, slug: 'Laptop', color: '#1a1a2e', bg: '#f0f0f7', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300' },
  { name: 'Smartphone', icon: <FaMobileAlt />, slug: 'Smartphone', color: '#f59e0b', bg: '#fef3c7', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300' },
  { name: 'Microwave', icon: <FaBolt />, slug: 'Microwave', color: '#22c55e', bg: '#dcfce7', img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300' },
  { name: 'Geyser', icon: <FaBolt />, slug: 'Geyser', color: '#ec4899', bg: '#fce7f3', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300' }
];

const heroSlides = [
  {
    badge: '🏷️ Rental Plans From ₹399/month',
    title: 'Rent Premium',
    highlight: 'Electronics',
    subtitle: 'Pay Monthly. Own Later.',
    desc: 'Get the latest TVs, ACs, Laptops & Refrigerators at your doorstep. No maintenance costs, free setup included.',
    cta1: { label: 'Browse Rentals', to: '/products?orderType=rent' },
    cta2: { label: 'How It Works', to: '#how-it-works' },
    cta3: { label: 'Check Offers', to: '/offers' },
    img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600',
    badge2: '📺 Samsung 55" 4K TV',
    price: 'From ₹899/mo',
  },
  {
    badge: '❄️ Beat the Heat this Summer',
    title: 'Rent an',
    highlight: 'Air Conditioner',
    subtitle: 'Starting at ₹699/month',
    desc: 'Premium inverter ACs from LG, Voltas, Daikin. Installation included. Monthly rental, no hidden charges.',
    cta1: { label: 'Rent an AC', to: '/products?category=Air Conditioner' },
    cta2: { label: 'See All Deals', to: '/offers' },
    cta3: { label: 'How It Works', to: '#how-it-works' },
    img: 'https://images.unsplash.com/photo-1601146800832-90f9e4a25f3e?w=600',
    badge2: '❄️ Inverter AC 1.5 Ton',
    price: 'From ₹699/mo',
  },
  {
    badge: '💻 Work From Home Essentials',
    title: 'Rent a',
    highlight: 'Laptop',
    subtitle: 'Perfect for Students & Professionals',
    desc: 'Dell, HP, Lenovo, Apple MacBook. Rent monthly without a big upfront investment. Return anytime.',
    cta1: { label: 'Rent a Laptop', to: '/products?category=Laptop' },
    cta2: { label: 'View All', to: '/products' },
    cta3: { label: 'Check Offers', to: '/offers' },
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
    badge2: '💻 Dell Inspiron 15',
    price: 'From ₹799/mo',
  },
];

const howItWorksSteps = [
  { icon: <FaSearch />, step: '01', title: 'Browse & Select', desc: 'Explore 500+ products across categories. Filter by brand, specs, and budget.' },
  { icon: <FaClipboardList />, step: '02', title: 'Apply in 2 Minutes', desc: 'Simple KYC process. Just your Aadhaar & PAN. No lengthy paperwork.' },
  { icon: <FaThumbsUp />, step: '03', title: 'Get Approved', desc: 'Instant approval for most customers. We verify and confirm within hours.' },
  { icon: <FaBoxOpen />, step: '04', title: 'Free Delivery & Setup', desc: 'We deliver and professionally set up the product at your doorstep.' },
  { icon: <FaCreditCard />, step: '05', title: 'Monthly Payments', desc: 'Pay a fixed monthly rent via UPI, Card, or Auto-debit. No surprises.' },
  { icon: <FaGift />, step: '06', title: 'Own It (Optional)', desc: 'Early buyout option available. Love it? Buy it at a discounted price anytime.' },
];

const testimonials = [
  {
    name: 'Rahul Sharma', city: 'Mumbai', rating: 5, initials: 'RS',
    text: 'Rented a Samsung TV for 6 months. The experience was fantastic — product arrived on time, setup was done professionally. Will definitely rent again!',
    product: 'Samsung 55" 4K TV'
  },
  {
    name: 'Priya Singh', city: 'Bangalore', rating: 5, initials: 'PS',
    text: 'Needed a laptop for my 3-month internship. rentselectronics.com made it so affordable and easy. Zero hidden charges, great customer support.',
    product: 'Dell Inspiron 15 Laptop'
  },
  {
    name: 'Amit Patel', city: 'Delhi', rating: 5, initials: 'AP',
    text: 'The AC I rented worked perfectly throughout summer. When it needed maintenance, they fixed it within a day at no extra cost. Outstanding service!',
    product: 'Voltas 1.5T Inverter AC'
  },
  {
    name: 'Sneha Gupta', city: 'Pune', rating: 4, initials: 'SG',
    text: 'Moved to a new city and furnished my entire flat with rented appliances. Saved so much vs buying. The monthly plans are very reasonable.',
    product: 'Refrigerator + Washing Machine'
  },
  {
    name: 'Vikram Nair', city: 'Hyderabad', rating: 5, initials: 'VN',
    text: 'I used the early buyout option and bought my rented refrigerator at a great discount. Transparent pricing, no hidden fees whatsoever.',
    product: 'LG 260L Refrigerator'
  },
];

const brands = [
  { name: 'Samsung', logo: '🔷' },
  { name: 'LG', logo: '🔴' },
  { name: 'Sony', logo: '⬛' },
  { name: 'Whirlpool', logo: '🌀' },
  { name: 'Voltas', logo: '❄️' },
  { name: 'Dell', logo: '💻' },
  { name: 'HP', logo: '🖨️' },
  { name: 'Apple', logo: '🍎' },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredProducts, products, loading } = useSelector((state) => state.products);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchProducts({ isNewArrival: true, limit: 8 }));
  }, [dispatch]);

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(i => (i + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">

      {/* ══ HERO CAROUSEL ══ */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge">{slide.badge}</div>
            <h1>
              {slide.title}<br />
              <span className="gradient-text">{slide.highlight}</span><br />
              <span className="hero-subtitle">{slide.subtitle}</span>
            </h1>
            <p>{slide.desc}</p>
            <div className="hero-actions">
              <Link to={slide.cta1.to} className="hero-btn-primary">
                {slide.cta1.label} <FaArrowRight size={13} />
              </Link>
              <a
                href="#how-it-works"
                className="hero-btn-secondary"
                onClick={handleHowItWorksClick}
              >
                {slide.cta2.label}
              </a>
              <Link to={slide.cta3.to} className="hero-btn-outline">
                {slide.cta3.label}
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>50K+</strong><span>Happy Customers</span></div>
              <div className="stat-divider"></div>
              <div className="stat"><strong>10+</strong><span>Years of Trust</span></div>
              <div className="stat-divider"></div>
              <div className="stat"><strong>500+</strong><span>Products</span></div>
              <div className="stat-divider"></div>
              <div className="stat"><strong>4.8 ⭐</strong><span>Rating</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card floating">
              <img src={slide.img} alt={slide.highlight} key={currentSlide} />
              <div className="hero-card-badge">⭐ Best Seller</div>
            </div>
            <div className="hero-card-mini floating-delay">
              <div className="mini-card">
                <span>{slide.badge2.split(' ')[0]}</span>
                <div>
                  <strong>{slide.badge2.substring(2)}</strong>
                  <small>{slide.price}</small>
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

        {/* Carousel controls */}
        <div className="carousel-controls">
          <button
            className="carousel-btn prev"
            onClick={() => setCurrentSlide(i => (i - 1 + heroSlides.length) % heroSlides.length)}
            aria-label="Previous slide"
          ><FaChevronLeft /></button>
          <div className="carousel-dots">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="carousel-btn next"
            onClick={() => setCurrentSlide(i => (i + 1) % heroSlides.length)}
            aria-label="Next slide"
          ><FaChevronRight /></button>
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

      {/* ══ CATEGORIES ══ */}
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
                <div className="cat-img-wrap" style={{ background: cat.bg }}>
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

      {/* ══ OFFERS / DEALS SECTION ══ */}
      <section className="section offers-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>🔥 Hot Deals & Offers</h2>
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
              <Link to="/products?category=Air Conditioner&orderType=rent" className="offer-cta">
                Rent an AC <FaArrowRight size={11} />
              </Link>
            </div>
            <div className="offer-card offer-work">
              <div className="offer-tag">Work From Home</div>
              <h3>Laptop Rental</h3>
              <p>Power your productivity with premium laptops</p>
              <div className="offer-price">From <strong>₹799/mo</strong></div>
              <Link to="/products?category=Laptop&orderType=rent" className="offer-cta">
                Rent a Laptop <FaArrowRight size={11} />
              </Link>
            </div>
            <div className="offer-card offer-home">
              <div className="offer-tag">Home Makeover</div>
              <h3>Appliance Bundle</h3>
              <p>Fridge + Washing Machine combo at special rates</p>
              <div className="offer-price">From <strong>₹1,299/mo</strong></div>
              <Link to="/products?orderType=rent" className="offer-cta">
                View Bundle <FaArrowRight size={11} />
              </Link>
            </div>
            <div className="offer-card offer-emi">
              <div className="offer-tag">Finance Deal</div>
              <h3>0% EMI</h3>
              <p>No-cost EMI on purchases above ₹10,000</p>
              <div className="offer-price">For <strong>6-12 months</strong></div>
              <Link to="/products?orderType=buy" className="offer-cta">
                Shop on EMI <FaArrowRight size={11} />
              </Link>
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

      {/* ══ WHY RENT? ══ */}
      <section className="section why-rent-section">
        <div className="container">
          <div className="section-header centered">
            <h2>Why Rent Instead of Buy?</h2>
            <p>Smart reasons to choose rental over purchase</p>
          </div>
          <div className="why-rent-grid">
            <div className="why-rent-card">
              <span className="why-icon">💰</span>
              <h3>Save Upfront Capital</h3>
              <p>Avoid large one-time investments. Pay a small monthly fee and keep your savings.</p>
            </div>
            <div className="why-rent-card">
              <span className="why-icon">🔧</span>
              <h3>Zero Maintenance Cost</h3>
              <p>We handle all repairs and maintenance. Free service visits whenever you need.</p>
            </div>
            <div className="why-rent-card">
              <span className="why-icon">🔄</span>
              <h3>Upgrade Anytime</h3>
              <p>Switch to newer models as technology evolves. No stuck with outdated gadgets.</p>
            </div>
            <div className="why-rent-card">
              <span className="why-icon">📦</span>
              <h3>Flexible Tenure</h3>
              <p>Rent for 3, 6, or 12 months. Return when you don't need it anymore.</p>
            </div>
            <div className="why-rent-card">
              <span className="why-icon">🚛</span>
              <h3>Free Pickup on Return</h3>
              <p>When your tenure ends, we pick up the product at no extra charge.</p>
            </div>
            <div className="why-rent-card">
              <span className="why-icon">🎁</span>
              <h3>Option to Own</h3>
              <p>Loved the product? Buy it at a special discounted price anytime during rental.</p>
            </div>
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

      {/* ══ TRUSTED BRANDS ══ */}
      <section className="section brands-section">
        <div className="container">
          <div className="section-header centered">
            <h2>Top Brands We Offer</h2>
            <p>Only genuine, verified products from trusted manufacturers</p>
          </div>
          <div className="brands-grid">
            {brands.map(brand => (
              <Link key={brand.name} to={`/products?brand=${brand.name}`} className="brand-card">
                <span className="brand-logo">{brand.logo}</span>
                <span className="brand-name">{brand.name}</span>
              </Link>
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
                <div className="testimonial-product">
                  <FaCheckCircle /> {t.product}
                </div>
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
            <p>Rent premium electronics with zero down payment, free installation & maintenance.</p>
            <div className="cta-trust">
              <span><FaCheckCircle /> No Security Deposit</span>
              <span><FaCheckCircle /> Free Setup</span>
              <span><FaCheckCircle /> 7-Day Returns</span>
            </div>
          </div>
          <div className="cta-actions">
            <Link to="/products?orderType=rent" className="cta-btn-white">
              Rent Now <FaArrowRight size={13} />
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
