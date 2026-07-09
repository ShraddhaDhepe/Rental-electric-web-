import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { formatCurrency, getDiscountPercent } from '../../utils/helpers';
import StarRating from '../common/StarRating';
import { FaHeart, FaRegHeart, FaShoppingCart, FaTag } from 'react-icons/fa';
import './ProductCard.css';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);

  const isWishlisted = wishlist?.products?.includes(product._id) ||
    wishlist?.products?.some(p => p._id === product._id || p === product._id);

  const inCart = cart?.items?.some(item =>
    (item.product?._id || item.product) === product._id
  );

  const discount = getDiscountPercent(product.originalPrice, product.buyPrice);
  const image = product.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image';
  const minRental = product.rentalPlans?.length
    ? Math.min(...product.rentalPlans.map(p => p.monthlyRent))
    : null;

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist(product._id));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1, orderType: 'buy' }));
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-card-link">
        {/* Image */}
        <div className="product-image-wrap">
          <img src={image} alt={product.name} loading="lazy" />
          {discount > 0 && (
            <span className="discount-badge">-{discount}%</span>
          )}
          {product.isNewArrival && (
            <span className="new-badge">New</span>
          )}
          {product.availableForRent && (
            <span className="rent-badge">
              <FaTag size={10} /> Rentable
            </span>
          )}
          <button
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            aria-label="Add to wishlist"
          >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        {/* Info */}
        <div className="product-info">
          <span className="product-brand">{product.brand}</span>
          <h3 className="product-name">{product.name}</h3>

          <div className="product-rating">
            <StarRating rating={product.rating} size={13} />
            <span className="rating-count">({product.numReviews})</span>
          </div>

          <div className="product-pricing">
            {product.availableForBuy && (
              <div className="buy-price-row">
                <span className="price-label">Buy</span>
                <span className="current-price">{formatCurrency(product.buyPrice)}</span>
                {product.originalPrice && product.originalPrice > product.buyPrice && (
                  <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                )}
              </div>
            )}
            {product.availableForBuy && product.buyPrice >= 5000 && (
              <div className="emi-row">
                <span className="emi-label">EMI</span>
                <span className="emi-amount">₹{Math.round(product.buyPrice / 12).toLocaleString('en-IN')}/mo</span>
                <span className="emi-info">0% for 12mo</span>
              </div>
            )}
            {product.availableForRent && minRental && (
              <div className="rent-price-row">
                <span className="price-label rent-label">Rent</span>
                <strong className="rent-amount">{formatCurrency(minRental)}<span className="rent-per">/mo</span></strong>
              </div>
            )}
          </div>

          {product.stock <= 0 && (
            <span className="out-of-stock">Out of Stock</span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="low-stock">Only {product.stock} left!</span>
          )}
        </div>
      </Link>

      {/* Actions */}
      <div className="product-actions">
        {product.stock > 0 ? (
          <button
            className={`add-to-cart-btn ${inCart ? 'in-cart' : ''}`}
            onClick={handleAddToCart}
          >
            <FaShoppingCart />
            {inCart ? 'In Cart' : 'Add to Cart'}
          </button>
        ) : (
          <button className="add-to-cart-btn disabled" disabled>
            Out of Stock
          </button>
        )}
        {product.availableForRent && (
          <Link to={`/products/${product._id}`} className="rent-btn">
            Rent Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
