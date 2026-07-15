import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes,
  FaSearch, FaChevronDown, FaTv, FaSnowflake,
  FaWind, FaLaptop, FaMobileAlt, FaTshirt, FaBolt,
  FaMapMarkerAlt, FaCouch, FaTag
} from 'react-icons/fa';
import { BrandLogo } from '../common/BrandLogo';
import './Navbar.css';

const categories = [
  { name: 'Television',     icon: <FaTv />,        slug: 'Television',      group: 'Electronics' },
  { name: 'Laptop',         icon: <FaLaptop />,    slug: 'Laptop',          group: 'Electronics' },
  { name: 'Smartphone',     icon: <FaMobileAlt />, slug: 'Smartphone',      group: 'Electronics' },
  { name: 'Refrigerator',   icon: <FaSnowflake />, slug: 'Refrigerator',    group: 'Appliances' },
  { name: 'Washing Machine',icon: <FaTshirt />,    slug: 'Washing Machine', group: 'Appliances' },
  { name: 'Air Conditioner',icon: <FaWind />,      slug: 'Air Conditioner', group: 'Appliances' },
  { name: 'Microwave',      icon: <FaBolt />,      slug: 'Microwave',       group: 'Appliances' },
  { name: 'Geyser',         icon: <FaBolt />,      slug: 'Geyser',          group: 'Appliances' },
];

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Electronics', path: '/products?category=Laptop', hasDropdown: true, group: 'Electronics' },
  { label: 'Appliances', path: '/products?category=Refrigerator', hasDropdown: true, group: 'Appliances' },
  { label: 'Offers', path: '/offers' },
  { label: 'Blog', path: '/blog' },
  { label: 'Support', path: '/support' },
];

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

const Navbar = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const dispatch   = useDispatch();
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const { cart }     = useSelector(s => s.cart);
  const { wishlist } = useSelector(s => s.wishlist);

  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [activeNavDrop, setActiveNavDrop] = useState(null);
  const [selectedCity,  setSelectedCity]  = useState('Pune');

  const userRef = useRef(null);
  const navRef  = useRef(null);

  const cartCount     = cart?.items?.length || 0;
  const wishlistCount = wishlist?.products?.length || 0;

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setActiveNavDrop(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = e => {
      if (userRef.current && !userRef.current.contains(e.target)) setDropdownOpen(false);
      if (navRef.current  && !navRef.current.contains(e.target))  setActiveNavDrop(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logout());
    navigate('/');
  };

  const goTo = path => {
    setDropdownOpen(false);
    navigate(path);
  };

  const getCategoriesForGroup = (group) =>
    categories.filter(c => c.group === group);

  return (
    <nav className="navbar">

      {/* ── Main bar ── */}
      <div className="navbar-main">
        <div className="container navbar-inner">

          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <BrandLogo size="md" />
          </Link>

          {/* Location — fixed Pune */}
          <div className="location-selector">
            <div className="location-btn">
              <FaMapMarkerAlt className="loc-icon" />
              <div className="loc-text">
                <span className="loc-label">Deliver to</span>
                <span className="loc-city">Pune</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search TVs, Fridges, Laptops, ACs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search"><FaSearch /></button>
          </form>

          {/* Right actions */}
          <div className="navbar-actions">
            <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
              <FaHeart />
              <span className="nav-icon-label">Wishlist</span>
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="nav-icon-btn" aria-label="Cart">
              <FaShoppingCart />
              <span className="nav-icon-label">Cart</span>
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="user-menu" ref={userRef}>
                <button
                  className="user-btn"
                  onClick={() => setDropdownOpen(o => !o)}
                  aria-expanded={dropdownOpen}
                >
                  <div className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-btn-text">
                    <span className="user-greeting">Hello,</span>
                    <span className="user-name">{user?.name?.split(' ')[0]}</span>
                  </div>
                  <FaChevronDown size={11} style={{ transition: 'transform .2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <strong>{user?.name}</strong>
                      <small>{user?.email}</small>
                    </div>
                    <button className="dropdown-item" onClick={() => goTo('/profile')}>
                      <FaUser size={13} /> My Profile
                    </button>
                    <button className="dropdown-item" onClick={() => goTo('/orders')}>
                      <FaShoppingCart size={13} /> My Orders
                    </button>
                    <button className="dropdown-item" onClick={() => goTo('/wishlist')}>
                      <FaHeart size={13} /> Wishlist
                    </button>
                    {user?.role === 'admin' && (
                      <button className="dropdown-item admin-item" onClick={() => goTo('/admin')}>
                        ⚙️ Admin Panel
                      </button>
                    )}
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login"    className="btn-login">Login</Link>
                <Link to="/register" className="btn-register">Sign Up</Link>
              </div>
            )}

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Nav Links bar ── */}
      <div className="navbar-nav" ref={navRef}>
        <div className="container nav-links-inner">

          {/* All Categories dropdown */}
          <div
            className="nav-item has-dropdown"
            onMouseEnter={() => setActiveNavDrop('all')}
            onMouseLeave={() => setActiveNavDrop(null)}
          >
            <button className="all-categories-btn">
              <FaBars /> All Categories <FaChevronDown size={10} />
            </button>
            {activeNavDrop === 'all' && (
              <div className="categories-mega-menu">
                {categories.map(cat => (
                  <Link
                    key={cat.slug}
                    to={`/products?category=${cat.slug}`}
                    className="mega-menu-item"
                    onClick={() => setActiveNavDrop(null)}
                  >
                    <span className="cat-icon">{cat.icon}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links */}
          {navLinks.map(link => (
            <div
              key={link.label}
              className="nav-item"
              onMouseEnter={() => link.hasDropdown ? setActiveNavDrop(link.group) : null}
              onMouseLeave={() => setActiveNavDrop(null)}
            >
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
                {link.hasDropdown && <FaChevronDown size={10} />}
              </Link>
              {link.hasDropdown && activeNavDrop === link.group && (
                <div className="nav-dropdown">
                  {getCategoriesForGroup(link.group).map(cat => (
                    <Link
                      key={cat.slug}
                      to={`/products?category=${cat.slug}`}
                      className="nav-dropdown-item"
                      onClick={() => setActiveNavDrop(null)}
                    >
                      <span className="cat-icon">{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                  <Link
                    to={`/products?category=${link.group === 'Electronics' ? 'Laptop' : 'Refrigerator'}`}
                    className="nav-dropdown-all"
                    onClick={() => setActiveNavDrop(null)}
                  >
                    View All {link.group} →
                  </Link>
                </div>
              )}
            </div>
          ))}

          {/* Quick rent/buy links */}
          <div className="nav-quick-links">
            <Link to="/products?orderType=rent" className="nav-link rent-link">
              <FaTag size={11} /> Rent Now
            </Link>
            <Link to="/offers" className="nav-link offers-link">
              🔥 Hot Deals
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit"><FaSearch /></button>
          </form>

          <div className="mobile-location">
            <FaMapMarkerAlt />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
            >
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="mobile-links">
            <Link to="/">🏠 Home</Link>
            <Link to="/products">📦 All Products</Link>
            <Link to="/products?orderType=rent">🏷️ Rent Electronics</Link>
            <Link to="/products?orderType=buy">🛒 Buy Electronics</Link>
            <Link to="/offers">🔥 Offers & Deals</Link>
            <div className="mobile-section-title">Electronics</div>
            <Link to="/products?category=Television">📺 Television</Link>
            <Link to="/products?category=Laptop">💻 Laptop</Link>
            <Link to="/products?category=Smartphone">📱 Smartphone</Link>
            <div className="mobile-section-title">Appliances</div>
            <Link to="/products?category=Refrigerator">🧊 Refrigerator</Link>
            <Link to="/products?category=Air Conditioner">❄️ Air Conditioner</Link>
            <Link to="/products?category=Washing Machine">🫧 Washing Machine</Link>
            <div className="mobile-section-title">Help & Info</div>
            <Link to="/blog">📝 Blog</Link>
            <Link to="/support">🎧 Support</Link>
            <Link to="/faq">❓ FAQ</Link>
            <Link to="/rent-vs-buy">📊 Rent vs Buy Calculator</Link>
            {isAuthenticated ? (
              <>
                <div className="mobile-section-title">My Account</div>
                <Link to="/profile">👤 My Profile</Link>
                <Link to="/orders">📋 My Orders</Link>
                <Link to="/wishlist">❤️ Wishlist</Link>
                {user?.role === 'admin' && <Link to="/admin">⚙️ Admin Panel</Link>}
                <button onClick={handleLogout} className="mobile-logout">🚪 Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
