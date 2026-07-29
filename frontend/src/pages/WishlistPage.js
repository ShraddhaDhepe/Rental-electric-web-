import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { formatCurrency } from '../utils/helpers';
import StarRating from '../components/common/StarRating';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import './WishlistPage.css';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  const products = wishlist?.products || [];

  if (products.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <h1>My Wishlist</h1>
          <div className="empty-state">
            <FaHeart style={{ fontSize: 64, color: '#fca5a5', marginBottom: 16 }} />
            <h3>Your wishlist is empty</h3>
            <p>Save products you love and come back to them anytime</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <span>{products.length} item{products.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="wishlist-grid">
          {products.map((product) => {
            const p = typeof product === 'object' ? product : { _id: product };
            const image = p.images?.[0]?.url || 'https://via.placeholder.com/300';
            const minRental = p.rentalPlans?.length
              ? Math.min(...p.rentalPlans.map(r => r.monthlyRent))
              : null;
            return (
              <div key={p._id} className="wishlist-card">
                <div className="wishlist-remove">
                  <button onClick={() => dispatch(toggleWishlist(p._id))} aria-label="Remove">
                    <FaTrash />
                  </button>
                </div>
                <Link to={`/products/${p._id}`} className="wishlist-img-link">
                  <img src={image} alt={p.name} />
                </Link>
                <div className="wishlist-info">
                  <span className="wishlist-brand">{p.brand}</span>
                  <Link to={`/products/${p._id}`} className="wishlist-name">{p.name}</Link>
                  <StarRating rating={p.rating} size={12} />
                  <div className="wishlist-pricing">
                    <span className="wishlist-price">{formatCurrency(p.buyPrice)}</span>
                    {minRental && <span className="wishlist-rent">or ₹{minRental}/mo</span>}
                  </div>
                  <div className="wishlist-actions">
                    <button
                      className="wishlist-cart-btn"
                      onClick={() => dispatch(addToCart({ productId: p._id, quantity: 1, orderType: 'buy' }))}
                    >
                      <FaShoppingCart size={13} /> Add to Cart
                    </button>
                    {p.availableForRent && (
                      <Link to={`/products/${p._id}`} className="wishlist-rent-btn">Rent</Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
