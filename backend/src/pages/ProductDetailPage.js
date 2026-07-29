import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, clearProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { formatCurrency } from '../utils/helpers';
import StarRating from '../components/common/StarRating';
import {
  FaHeart, FaRegHeart, FaShoppingCart, FaCheckCircle,
  FaTruck, FaShieldAlt, FaRedo, FaStar, FaTag,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, detailLoading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [selectedImage, setSelectedImage] = useState(0);
  const [orderType, setOrderType] = useState('buy');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const isWishlisted = wishlist?.products?.some(
    p => (p._id || p) === id
  );

  useEffect(() => {
    dispatch(fetchProduct(id));
    return () => dispatch(clearProduct());
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.rentalPlans?.length) {
      setSelectedPlan(product.rentalPlans[0]);
    }
  }, [product]);

  if (detailLoading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    if (orderType === 'rent' && !selectedPlan) {
      toast.error('Please select a rental plan');
      return;
    }
    dispatch(addToCart({
      productId: product._id,
      quantity,
      orderType,
      rentalPlan: orderType === 'rent' ? selectedPlan : undefined
    }));
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login');
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist(product._id));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit review');
      return;
    }
    setSubmittingReview(true);
    try {
      const api = (await import('../utils/api')).default;
      await api.post(`/products/${product._id}/review`, {
        rating: reviewRating,
        comment: reviewComment
      });
      toast.success('Review submitted!');
      setReviewComment('');
      dispatch(fetchProduct(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setSubmittingReview(false);
  };

  const images = product.images?.length ? product.images : [{ url: 'https://via.placeholder.com/600x400' }];

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span>
          <span>/</span>
          <span onClick={() => navigate('/products')}>Products</span>
          <span>/</span>
          <span onClick={() => navigate(`/products?category=${product.category}`)}>{product.category}</span>
          <span>/</span>
          <span className="current">{product.name.substring(0, 40)}...</span>
        </div>

        {/* Main section */}
        <div className="detail-main">
          {/* Images */}
          <div className="detail-images">
            <div className="main-image-wrap">
              <img src={images[selectedImage]?.url} alt={product.name} />
              {images.length > 1 && (
                <>
                  <button
                    className="img-nav prev"
                    onClick={() => setSelectedImage(i => (i - 1 + images.length) % images.length)}
                  ><FaChevronLeft /></button>
                  <button
                    className="img-nav next"
                    onClick={() => setSelectedImage(i => (i + 1) % images.length)}
                  ><FaChevronRight /></button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-list">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumbnail ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img.url} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-badges">
              <span className="badge badge-primary">{product.category}</span>
              {product.isNewArrival && <span className="badge badge-success">New Arrival</span>}
              {product.condition !== 'New' && <span className="badge badge-warning">{product.condition}</span>}
            </div>
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-brand">by <strong>{product.brand}</strong></p>

            <div className="detail-rating">
              <StarRating rating={product.rating} size={16} />
              <span>{product.rating?.toFixed(1)}</span>
              <span className="dot">•</span>
              <span>{product.numReviews} reviews</span>
              {product.stock > 0 ? (
                <span className="in-stock"><FaCheckCircle /> In Stock ({product.stock})</span>
              ) : (
                <span className="out-stock">Out of Stock</span>
              )}
            </div>

            {/* Order Type Toggle */}
            {product.availableForRent && product.availableForBuy && (
              <div className="order-type-toggle">
                <button
                  className={orderType === 'buy' ? 'active' : ''}
                  onClick={() => setOrderType('buy')}
                >
                  🛒 Buy
                </button>
                <button
                  className={orderType === 'rent' ? 'active' : ''}
                  onClick={() => setOrderType('rent')}
                >
                  <FaTag size={12} /> Rent
                </button>
              </div>
            )}

            {/* Buy Pricing */}
            {orderType === 'buy' && (
              <div className="detail-pricing">
                <div className="price-row">
                  <span className="price-main">{formatCurrency(product.buyPrice)}</span>
                  {product.originalPrice > product.buyPrice && (
                    <>
                      <span className="price-original">{formatCurrency(product.originalPrice)}</span>
                      <span className="price-discount">
                        {Math.round(((product.originalPrice - product.buyPrice) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="inclusive-tax">Inclusive of all taxes</p>
              </div>
            )}

            {/* Rental Pricing */}
            {orderType === 'rent' && product.rentalPlans?.length > 0 && (
              <div className="rental-plans">
                <h4>Select Rental Plan</h4>
                <div className="plan-grid">
                  {product.rentalPlans.map((plan, i) => (
                    <button
                      key={i}
                      className={`plan-card ${selectedPlan?.duration === plan.duration ? 'selected' : ''}`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      {plan.discount > 0 && (
                        <span className="plan-discount">{plan.discount}% OFF</span>
                      )}
                      <div className="plan-duration">{plan.duration}</div>
                      <div className="plan-rent">{formatCurrency(plan.monthlyRent)}<small>/mo</small></div>
                      <div className="plan-total">Total: {formatCurrency(plan.totalAmount)}</div>
                      <div className="plan-deposit">Security Deposit: {formatCurrency(plan.securityDeposit)}</div>
                    </button>
                  ))}
                </div>
                {selectedPlan && (
                  <div className="plan-summary">
                    <div className="plan-summary-row">
                      <span>Monthly Rent</span>
                      <strong>{formatCurrency(selectedPlan.monthlyRent)}</strong>
                    </div>
                    <div className="plan-summary-row">
                      <span>Total Rent ({selectedPlan.months} months)</span>
                      <strong>{formatCurrency(selectedPlan.totalAmount)}</strong>
                    </div>
                    <div className="plan-summary-row">
                      <span>Refundable Security Deposit</span>
                      <strong>{formatCurrency(selectedPlan.securityDeposit)}</strong>
                    </div>
                    <div className="plan-summary-row total">
                      <span>Pay Now</span>
                      <strong className="text-primary">
                        {formatCurrency(selectedPlan.totalAmount + selectedPlan.securityDeposit)}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            {orderType === 'buy' && (
              <div className="quantity-wrap">
                <label>Quantity:</label>
                <div className="quantity-control">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="detail-actions">
              <button
                className="btn-add-cart"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <FaShoppingCart />
                {product.stock <= 0 ? 'Out of Stock' : orderType === 'rent' ? 'Rent Now' : 'Add to Cart'}
              </button>
              <button
                className={`btn-wishlist ${isWishlisted ? 'active' : ''}`}
                onClick={handleWishlist}
                aria-label="Wishlist"
              >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            {/* Highlights */}
            <div className="detail-highlights">
              <div className="highlight-item"><FaTruck /> Free delivery in {product.deliveryDays} days</div>
              <div className="highlight-item"><FaShieldAlt /> 1 Year Warranty</div>
              <div className="highlight-item"><FaRedo /> 7-Day Easy Return</div>
              <div className="highlight-item"><FaCheckCircle /> 100% Genuine Product</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tab-nav">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && ` (${product.numReviews})`}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-description">
                <p>{product.description}</p>
                {product.features?.length > 0 && (
                  <>
                    <h4>Key Features</h4>
                    <ul>
                      {product.features.map((f, i) => (
                        <li key={i}><FaCheckCircle className="feat-icon" /> {f}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-specs">
                {product.specifications?.length > 0 ? (
                  <table>
                    <tbody>
                      {product.specifications.map((spec, i) => (
                        <tr key={i}>
                          <td className="spec-key">{spec.key}</td>
                          <td className="spec-val">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No specifications available.</p>}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-reviews">
                {/* Rating summary */}
                <div className="rating-summary">
                  <div className="overall-rating">
                    <span className="big-rating">{product.rating?.toFixed(1)}</span>
                    <StarRating rating={product.rating} size={20} />
                    <span>{product.numReviews} reviews</span>
                  </div>
                </div>

                {/* Review form */}
                {isAuthenticated && (
                  <form className="review-form" onSubmit={handleReviewSubmit}>
                    <h4>Write a Review</h4>
                    <div className="star-picker">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button
                          type="button"
                          key={s}
                          className={reviewRating >= s ? 'star-active' : ''}
                          onClick={() => setReviewRating(s)}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Share your experience with this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      rows={4}
                    />
                    <button type="submit" disabled={submittingReview} className="submit-review-btn">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}

                {/* Reviews list */}
                <div className="reviews-list">
                  {product.reviews?.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to review!</p>
                  ) : (
                    product.reviews?.map((review) => (
                      <div key={review._id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-avatar">{review.name?.charAt(0)}</div>
                          <div>
                            <strong>{review.name}</strong>
                            <StarRating rating={review.rating} size={13} />
                          </div>
                          <span className="review-date">
                            {new Date(review.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <p>{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
