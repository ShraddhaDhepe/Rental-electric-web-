import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { formatCurrency } from '../../utils/helpers';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './ProductCard.css';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const { isAuthenticated } = useSelector(s => s.auth);
  const { wishlist }    = useSelector(s => s.wishlist);

  const isWishlisted = wishlist?.products?.some(
    p => p._id === product._id || p === product._id
  );

  const image = product.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image';

  const minRental = product.rentalPlans?.length
    ? Math.min(...product.rentalPlans.map(p => p.monthlyRent))
    : null;

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login'); navigate('/login'); return; }
    dispatch(toggleWishlist(product._id));
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-card-link">

        {/* Image */}
        <div className="product-image-wrap">
          <img src={image} alt={product.name} loading="lazy" />
          <button
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            aria-label="Wishlist"
          >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        {/* Info: name + price */}
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price-row">
            {minRental ? (
              <>
                <span className="pc-price">₹{minRental.toLocaleString('en-IN')}</span>
                <span className="pc-per"> /month</span>
              </>
            ) : product.buyPrice ? (
              <>
                <span className="pc-price">{formatCurrency(product.buyPrice)}</span>
              </>
            ) : null}
          </div>
        </div>
      </Link>

      {/* Action button */}
      <div className="product-actions">
        {product.availableForRent ? (
          <Link to={`/products/${product._id}`} className="pc-rent-btn">
            Rent Now
          </Link>
        ) : (
          <Link to={`/products/${product._id}`} className="pc-buy-btn">
            Buy Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
