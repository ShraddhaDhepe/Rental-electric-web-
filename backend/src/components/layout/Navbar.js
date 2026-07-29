import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes,
  FaSearch, FaChevronDown, FaTv, FaSnowflake,
  FaWind, FaLaptop, FaMobileAlt, FaTshirt, FaBolt
} from 'react-icons/fa';
import { BrandLogo } from '../common/BrandLogo';
import './Navbar.css';

const categories = [
  { name: 'Television',     icon: <FaTv />,        slug: 'Television' },
  { name: 'Refrigerator',   icon: <FaSnowflake />, slug: 'Refrigerator' },
  { name: 'Washing Machine',icon: <FaTshirt />,    slug: 'Washing Machine' },
  { name: 'Air Conditioner',icon: <FaWind />,      slug: 'Air Conditioner' },
  { name: 'Laptop',         icon: <FaLaptop />,    slug: 'Laptop' },
  { name: 'Smartphone',     icon: <FaMobileAlt />, slug: 'Smartphone' },
  { name: 'Microwave',      icon: <FaBolt />,      slug: 'Microwave' },
  { name: 'Geyser',         icon: <FaBolt />,      slug: 'Geyser' }
];

const Navbar = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const { cart }     = useSelector(s => s.cart);
  const { wishlist } = useSelector(s => s.wishlist);

  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [categoryOpen,  setCategoryOpen]  = useState(false);

  /* separate refs so clicks don't interfere */
  const userRef = useRef(null);
  const catRef  = useRef(null);

  const cartCount     = cart?.items?.length || 0;
  const wishlistCount = wishlist?.products?.length || 0;

  /* close everything on route change */
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setCategoryOpen(false);
  }, [location.pathname]);

  /* close user dropdown on outside click */
  useEffect(() => {
    const handleClick = e => {
      if (userRef.current && !userRef.current.contains(e.target)) setDropdownOpen(false);
      if (catRef.current  && !catRef.current.contains(e.target))  setCategoryOpen(false);
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

  return (
    <nav className="navbar">

      {/* ── Top bar ── */}
      <div className="navbar-top">
        <div className="container navbar-top-inner">
          <span>🚀 Free delivery on orders above ₹999 &nbsp;|&nbsp; RENT SMART. OWN LESS.</span>
          <span>📞 1800-123-4567 &nbsp;|&nbsp; Mon–Sat 9AM–8PM</span>
        </div>
      </div>

      {/* ── Main bar ── */}
      <div className="navbar-main">
        <div className="container navbar-inner">

          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <BrandLogo size="md" />
          </Link>

          {/* Search */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search TVs, Fridges, Laptops..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search"><FaSearch /></button>
          </form>

          {/* Right actions */}
          <div className="navbar-actions">
            <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
              <FaHeart />
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="nav-icon-btn" aria-label="Cart">
              <FaShoppingCart />
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              /* ── User dropdown ── */
              <div className="user-menu" ref={userRef}>
                <button
                  className="user-btn"
                  onClick={() => setDropdownOpen(o => !o)}
                  aria-expanded={dropdownOpen}
                >
                  <div className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
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

      {/* ── Category bar ── */}
      <div className="navbar-categories">
        <div className="container categories-inner">

          {/* All categories dropdown */}
          <div className="category-dropdown-wrapper" ref={catRef}>
            <button
              className="all-categories-btn"
              onClick={() => setCategoryOpen(o => !o)}
            >
              <FaBars /> All Categories <FaChevronDown size={11} />
            </button>
            {categoryOpen && (
              <div className="categories-mega-menu">
                {categories.map(cat => (
                  <Link
                    key={cat.slug}
                    to={`/products?category=${cat.slug}`}
                    className="mega-menu-item"
                    onClick={() => setCategoryOpen(false)}
                  >
                    <span className="cat-icon">{cat.icon}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="quick-links">
            <Link to="/products?orderType=rent"    className="quick-link">🏷️ Rent</Link>
            <Link to="/products?orderType=buy"     className="quick-link">🛒 Buy</Link>
            <Link to="/products?isFeatured=true"   className="quick-link">⭐ Featured</Link>
            <Link to="/products?isNewArrival=true" className="quick-link">🆕 New</Link>
            <Link to="/products?category=Television"   className="quick-link">📺 TV</Link>
            <Link to="/products?category=Laptop"        className="quick-link">💻 Laptop</Link>
            <Link to="/products?category=Refrigerator" className="quick-link">🧊 Fridge</Link>
            <Link to="/products?category=Air Conditioner" className="quick-link">❄️ AC</Link>
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

          <div className="mobile-links">
            <Link to="/">Home</Link>
            <Link to="/products">All Products</Link>
            <Link to="/products?orderType=rent">Rent Electronics</Link>
            <Link to="/products?orderType=buy">Buy Electronics</Link>
            {categories.map(cat => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`}>
                {cat.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/profile">My Profile</Link>
                <Link to="/orders">My Orders</Link>
                <Link to="/wishlist">Wishlist</Link>
                {user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                <button onClick={handleLogout} className="mobile-logout">🚪 Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
