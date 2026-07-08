import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { formatCurrency, computeCartTotals } from '../utils/helpers';
import { FaTrash, FaArrowLeft, FaTag, FaTruck } from 'react-icons/fa';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);

  const items = cart?.items || [];
  const { itemsPrice, securityDeposit, deliveryCharges, totalAmount } = computeCartTotals(items);

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state" style={{ padding: '80px 20px' }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;
              const image = product.images?.[0]?.url || 'https://via.placeholder.com/100';
              return (
                <div key={item._id} className="cart-item">
                  <Link to={`/products/${product._id}`} className="cart-item-img">
                    <img src={image} alt={product.name} />
                  </Link>
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <div>
                        <span className="cart-item-brand">{product.brand}</span>
                        <Link to={`/products/${product._id}`} className="cart-item-name">
                          {product.name}
                        </Link>
                        {item.orderType === 'rent' ? (
                          <span className="cart-item-type rent"><FaTag size={10} /> Rental</span>
                        ) : (
                          <span className="cart-item-type buy">Purchase</span>
                        )}
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => dispatch(removeFromCart(item._id))}
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {item.orderType === 'rent' && item.rentalPlan ? (
                      <div className="rental-detail">
                        <div className="rental-detail-row">
                          <span>Plan</span>
                          <strong>{item.rentalPlan.duration}</strong>
                        </div>
                        <div className="rental-detail-row">
                          <span>Monthly Rent</span>
                          <strong>{formatCurrency(item.rentalPlan.monthlyRent)}/mo</strong>
                        </div>
                        <div className="rental-detail-row">
                          <span>Total Rent</span>
                          <strong>{formatCurrency(item.rentalPlan.totalAmount)}</strong>
                        </div>
                        <div className="rental-detail-row">
                          <span>Security Deposit</span>
                          <strong>{formatCurrency(item.rentalPlan.securityDeposit)}</strong>
                        </div>
                        <div className="rental-detail-row total">
                          <span>Pay Now</span>
                          <strong className="text-primary">
                            {formatCurrency(item.rentalPlan.totalAmount + item.rentalPlan.securityDeposit)}
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <div className="cart-item-bottom">
                        <div className="quantity-control">
                          <button
                            onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity - 1 }))}
                          >−</button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity + 1 }))}
                          >+</button>
                        </div>
                        <div className="cart-item-price">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="cart-footer">
              <Link to="/products" className="continue-shopping">
                <FaArrowLeft size={12} /> Continue Shopping
              </Link>
              <button className="clear-cart-btn" onClick={() => dispatch(clearCart())}>
                <FaTrash size={12} /> Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({items.length} items)</span>
                <span>{formatCurrency(itemsPrice)}</span>
              </div>
              {securityDeposit > 0 && (
                <div className="summary-row">
                  <span>Security Deposit (Refundable)</span>
                  <span>{formatCurrency(securityDeposit)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery</span>
                <span className={deliveryCharges === 0 ? 'free-delivery' : ''}>
                  {deliveryCharges === 0 ? (
                    <><FaTruck size={12} /> Free</>
                  ) : formatCurrency(deliveryCharges)}
                </span>
              </div>
              {deliveryCharges === 0 && (
                <div className="free-delivery-msg">
                  🎉 You saved on delivery charges!
                </div>
              )}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total Amount</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>
            <div className="summary-secure">
              🔒 Secure Checkout powered by Razorpay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
