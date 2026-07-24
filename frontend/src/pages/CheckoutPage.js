import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { formatCurrency, computeCartTotals } from '../utils/helpers';
import { FaPlus, FaCheckCircle, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

/**
 * ── Matches your real paymentController.js exactly ──────────────────────
 *
 * POST /create-order   body: { amount }              (amount in RUPEES,
 *                             controller does amount * 100 itself)
 *                      returns the RAW Razorpay order object:
 *                      { id, amount, currency, receipt, ... }
 *                      (no keyId in the response — the public key has to
 *                      come from the frontend env var)
 *
 * POST /verify-payment body: { orderId, razorpay_order_id,
 *                              razorpay_payment_id, razorpay_signature }
 *                      returns: { success, order }
 *                      (backend already clears the DB cart on success —
 *                      we still call clearCart() locally so Redux state
 *                      matches)
 *
 * Both routes sit behind `router.use(protect)`, so every call below sends
 * the auth token. This assumes your `protect` middleware reads a Bearer
 * token — if it reads an httpOnly cookie instead, drop the Authorization
 * header below and keep `credentials: 'include'`.
 *
 * Adjust API_BASE_URL to wherever your backend actually lives (Vite env
 * var, proxy, etc.) and PAYMENTS_PATH if paymentRoutes.js is mounted
 * under something other than /api/payments.
 * ─────────────────────────────────────────────────────────────────────────
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
// Confirmed from server.js: app.use('/api/payment', require('./routes/paymentRoutes'))
// singular "payment", and VITE_API_URL already ends in /api, so only add "/payment" here.
const PAYMENTS_PATH = '/payment';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Dynamically loads the Razorpay checkout.js script once
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// Small fetch wrapper that attaches the auth token, matching `protect` middleware
const paymentApi = async (path, body, token) => {
  const res = await fetch(`${API_BASE_URL}${PAYMENTS_PATH}${path}`, {
    method: 'POST',
    credentials: 'include', // keep this if your auth also relies on a cookie
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });

  const rawText = await res.text();
  let data;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch (e) {
    throw new Error(`Server returned non-JSON response (status ${res.status}): ${rawText.slice(0, 200)}`);
  }

  if (!res.ok) {
    throw new Error(data?.message || 'Payment request failed');
  }
  return data;
};

// Small inline style for the payment-method badges (avoids depending on a CSS file)
const pmBadgeStyle = (color) => ({
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: '5px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#fff',
  backgroundColor: color,
  marginLeft: '6px'
});

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user, token: authSliceToken } = useSelector((state) => state.auth);
  const { order, loading, paymentLoading } = useSelector((state) => state.orders);

  const items = cart?.items || [];
  const { itemsPrice, securityDeposit, deliveryCharges, totalAmount } = computeCartTotals(items);

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmed
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    residenceType: '',
    floor: '',
    hasLift: null
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [paidTxnId, setPaidTxnId] = useState('');

  const residenceTypes = [
    'Apartment in Gated Society',
    'Independent House',
    'Independent Apartment',
    'Villa in Gated Community',
    'PG',
  ];

  useEffect(() => {
    if (!items.length) navigate('/cart');
    if (user?.addresses?.length) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    } else {
      setShowNewAddressForm(true);
    }
  }, []);

  // ── Creates the DB order (if not already created) and returns its id ──
  const ensureOrderCreated = async () => {
    if (createdOrderId) return createdOrderId;

    const orderData = {
      orderItems: items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0]?.url || '',
        quantity: item.quantity,
        price: item.price,
        orderType: item.orderType,
        rentalPlan: item.rentalPlan
      })),
      shippingAddress: selectedAddress,
      paymentMethod: 'razorpay',
      itemsPrice,
      securityDeposit,
      deliveryCharges,
      totalAmount
    };

    const orderAction = await dispatch(createOrder(orderData));
    if (!orderAction.payload?.order) {
      throw new Error('Order creation failed');
    }
    const orderId = orderAction.payload.order._id;
    setCreatedOrderId(orderId);
    return orderId;
  };

  // ── Main "Pay Now" handler: creates order -> opens Razorpay -> verifies ──
  const handleRazorpayPayment = async () => {
    try {
      setRazorpayLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Unable to load Razorpay. Check your internet connection and try again.');
        setRazorpayLoading(false);
        return;
      }

      const orderId = await ensureOrderCreated();

      // Tries every common place a JWT usually lives, in order, since we
      // couldn't confirm which one your app uses. First non-empty wins.
      const authToken =
        authSliceToken ||
        user?.token ||
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('authToken') ||
        JSON.parse(localStorage.getItem('user') || 'null')?.token;

      if (!authToken) {
        toast.error('You appear to be logged out. Please log in again and retry payment.');
        setRazorpayLoading(false);
        return;
      }

      // POST /api/payment/create-order  { amount }
      // CONFIRMED real response shape: { success, order: { id, amount, currency, ... }, key }
      const rpResponse = await paymentApi('/create-order', { amount: totalAmount }, authToken);
      const rpOrder = rpResponse?.order;

      if (!rpOrder?.id) {
        toast.error('Could not initiate payment. Please try again.');
        setRazorpayLoading(false);
        return;
      }

      const options = {
        key: rpResponse.key, // backend already returns this — no env var needed
        amount: rpOrder.amount, // in paise, echoed back from backend
        currency: rpOrder.currency || 'INR',
        name: 'Rents Electronics',
        description: `Order #${orderId}`,
        order_id: rpOrder.id,
        prefill: {
          name: selectedAddress?.fullName || user?.name || '',
          contact: selectedAddress?.phone || user?.phone || '',
          email: user?.email || ''
        },
        theme: { color: '#111827' },
        handler: async (response) => {
          // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
          try {
            const verifyResult = await paymentApi('/verify-payment', {
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, authToken);

            if (verifyResult?.success) {
              setPaidTxnId(response.razorpay_payment_id);
              dispatch(clearCart()); // backend already cleared the DB cart; this syncs local Redux state
              setStep(3);
            } else {
              toast.error('Payment verification failed. If money was deducted, contact support with your payment ID.');
            }
          } catch (err) {
            toast.error(err.message || 'Payment verification failed');
          } finally {
            setRazorpayLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setRazorpayLoading(false);
            toast('Payment cancelled', { icon: 'ℹ️' });
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response) => {
        setRazorpayLoading(false);
        toast.error(response?.error?.description || 'Payment failed. Please try again.');
      });

      rzp.open();
    } catch (err) {
      setRazorpayLoading(false);
      toast.error(err.message || 'Something went wrong while starting payment');
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        {/* Steps */}
        <div className="checkout-steps">
          <div className={`checkout-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
            {step > 1 ? <FaCheckCircle /> : <span>1</span>}
            Delivery Address
          </div>
          <div className="step-line"></div>
          <div className={`checkout-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
            {step > 2 ? <FaCheckCircle /> : <span>2</span>}
            Payment
          </div>
          <div className="step-line"></div>
          <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span> Confirmed
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Step 1: Address (unchanged) */}
            {step === 1 && (
              <div className="checkout-section">
                <h2>Delivery Address</h2>

                {user?.addresses?.length > 0 && (
                  <div className="saved-addresses">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`address-card ${selectedAddress?._id === addr._id ? 'selected' : ''}`}
                        onClick={() => { setSelectedAddress(addr); setShowNewAddressForm(false); }}
                      >
                        <div className="address-radio">
                          <div className={`radio-dot ${selectedAddress?._id === addr._id ? 'active' : ''}`}></div>
                        </div>
                        <div className="address-details">
                          <strong>{addr.fullName}</strong>
                          <span>{addr.phone}</span>
                          <span>{addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ', '}{addr.city}, {addr.state} - {addr.pincode}</span>
                          {addr.isDefault && <span className="default-badge">Default</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="add-address-btn"
                  onClick={() => { setShowNewAddressForm(!showNewAddressForm); setSelectedAddress(null); }}
                >
                  <FaPlus size={12} /> Add New Address
                </button>

                {showNewAddressForm && (
                  <form className="new-address-form" onSubmit={(e) => { e.preventDefault(); setSelectedAddress(newAddress); setStep(2); }}>
                    <div className="af-section-label">Contact Details</div>
                    <div className="af-row">
                      <div className="af-group">
                        <label className="af-label">Full Name <span className="af-req">*</span></label>
                        <input className="af-input" required placeholder="e.g. Rahul Sharma" value={newAddress.fullName} onChange={e => setNewAddress(p => ({ ...p, fullName: e.target.value }))} />
                      </div>
                      <div className="af-group">
                        <label className="af-label">Mobile Number <span className="af-req">*</span></label>
                        <input className="af-input" required placeholder="10-digit mobile" value={newAddress.phone} onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                    </div>

                    <div className="af-section-label">Address</div>
                    <div className="af-row">
                      <div className="af-group">
                        <label className="af-label">Flat / House No, Building <span className="af-req">*</span></label>
                        <input className="af-input" required placeholder="e.g. 204, Sunrise Apt" value={newAddress.addressLine1} onChange={e => setNewAddress(p => ({ ...p, addressLine1: e.target.value }))} />
                      </div>
                      <div className="af-group">
                        <label className="af-label">Street / Locality / Landmark</label>
                        <input className="af-input" placeholder="e.g. Near City Mall, MG Road" value={newAddress.addressLine2} onChange={e => setNewAddress(p => ({ ...p, addressLine2: e.target.value }))} />
                      </div>
                    </div>

                    <div className="af-row af-row-3">
                      <div className="af-group">
                        <label className="af-label">City <span className="af-req">*</span></label>
                        <input className="af-input" required placeholder="e.g. Pune" value={newAddress.city} onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} />
                      </div>
                      <div className="af-group">
                        <label className="af-label">State <span className="af-req">*</span></label>
                        <input className="af-input" required placeholder="e.g. Maharashtra" value={newAddress.state} onChange={e => setNewAddress(p => ({ ...p, state: e.target.value }))} />
                      </div>
                      <div className="af-group">
                        <label className="af-label">Pincode <span className="af-req">*</span></label>
                        <input className="af-input" required placeholder="6-digit" maxLength={6} value={newAddress.pincode} onChange={e => setNewAddress(p => ({ ...p, pincode: e.target.value }))} />
                      </div>
                    </div>

                    <div className="af-section-label">Residence Type <span className="af-req">*</span></div>
                    <div className="af-chips">
                      {residenceTypes.map(type => (
                        <button
                          key={type}
                          type="button"
                          className={`af-chip ${newAddress.residenceType === type ? 'selected' : ''}`}
                          onClick={() => setNewAddress(p => ({ ...p, residenceType: type }))}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    <div className="af-section-label">Lift &amp; Floor Details <span className="af-req">*</span></div>
                    <p className="af-hint">Help our delivery partners plan the best route to your door.</p>
                    <div className="af-row af-row-lift">
                      <div className="af-group">
                        <label className="af-label">Floor Number</label>
                        <input className="af-input" type="number" min="0" placeholder="e.g. 3" value={newAddress.floor} onChange={e => setNewAddress(p => ({ ...p, floor: e.target.value }))} />
                      </div>
                      <div className="af-group">
                        <label className="af-label">Service Lift Available?</label>
                        <div className="af-lift-row">
                          <button type="button" className={`af-lift-btn ${newAddress.hasLift === true ? 'selected' : ''}`} onClick={() => setNewAddress(p => ({ ...p, hasLift: true }))}>✓ Available</button>
                          <button type="button" className={`af-lift-btn ${newAddress.hasLift === false ? 'selected' : ''}`} onClick={() => setNewAddress(p => ({ ...p, hasLift: false }))}>✗ Not Available</button>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="af-submit-btn">Use This Address →</button>
                  </form>
                )}

                {!showNewAddressForm && (
                  <button
                    className="btn btn-primary btn-block"
                    style={{ marginTop: 20 }}
                    onClick={() => {
                      if (!selectedAddress) { toast.error('Please select an address'); return; }
                      setStep(2);
                    }}
                  >
                    Continue to Payment →
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Razorpay Payment */}
            {step === 2 && (
              <div className="checkout-section">
                <div className="selected-address-display">
                  <strong>Delivering to:</strong>
                  <span>{selectedAddress?.fullName}, {selectedAddress?.addressLine1}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}</span>
                  <button onClick={() => setStep(1)}>Change</button>
                </div>

                <h2 className="upi-section-title"><FaShieldAlt /> Secure Payment</h2>
                <p className="upi-subtitle">You'll be redirected to Razorpay's secure checkout to pay by UPI, card, netbanking or wallet.</p>

                <div className="rp-pay-block">
                  <div className="rp-amount-row">
                    <span>Amount to pay</span>
                    <strong>{formatCurrency(totalAmount)}</strong>
                  </div>

                  <button
                    className="upi-confirm-btn"
                    onClick={handleRazorpayPayment}
                    disabled={razorpayLoading || loading || paymentLoading}
                  >
                    {razorpayLoading || loading || paymentLoading
                      ? <><span className="btn-spinner" /> Please wait…</>
                      : <><FaShieldAlt /> Pay {formatCurrency(totalAmount)} Now</>}
                  </button>

                  <p className="upi-note">
                    <FaMobileAlt size={12} /> Powered by Razorpay. Your payment details are never stored on our servers.
                  </p>
                </div>

                {/* Payment method badges — inline-styled, no external image or CSS file dependency */}
                <div className="upi-apps">
                  <span>Accepted payment methods</span>
                  <span style={pmBadgeStyle('#5f6368')}>G Pay</span>
                  <span style={pmBadgeStyle('#5f259f')}>PhonePe</span>
                  <span style={pmBadgeStyle('#00baf2')}>Paytm</span>
                  <span style={pmBadgeStyle('#097939')}>UPI</span>
                </div>
              </div>
            )}

            {/* Step 3: Confirmed */}
            {step === 3 && (
              <div className="checkout-section upi-confirmed-section">
                <div className="upi-confirmed-icon">✅</div>
                <h2 className="upi-confirmed-title">Payment Confirmed!</h2>
                <p className="upi-confirmed-msg">
                  Thank you for your order. Your payment has been received and your order is confirmed.
                </p>
                <div className="upi-confirmed-detail">
                  <span>Order Total</span>
                  <strong>{formatCurrency(totalAmount)}</strong>
                </div>
                <div className="upi-confirmed-detail">
                  <span>Payment Method</span>
                  <strong>Razorpay</strong>
                </div>
                {paidTxnId && (
                  <div className="upi-confirmed-detail">
                    <span>Payment ID</span>
                    <strong>{paidTxnId}</strong>
                  </div>
                )}
                <button
                  className="upi-go-orders-btn"
                  onClick={() => navigate('/orders')}
                >
                  View My Orders →
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar (unchanged) */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map((item) => (
                <div key={item._id} className="summary-item">
                  <img src={item.product?.images?.[0]?.url} alt="" />
                  <div>
                    <span>{item.product?.name?.substring(0, 40)}...</span>
                    {item.orderType === 'rent' ? (
                      <small>{item.rentalPlan?.duration} · ₹{item.rentalPlan?.monthlyRent}/mo</small>
                    ) : (
                      <small>Qty: {item.quantity} × {formatCurrency(item.price)}</small>
                    )}
                  </div>
                  <strong>
                    {item.orderType === 'rent'
                      ? formatCurrency(item.rentalPlan?.totalAmount + item.rentalPlan?.securityDeposit)
                      : formatCurrency(item.price * item.quantity)}
                  </strong>
                </div>
              ))}
            </div>
            <div className="summary-rows">
              <div className="summary-row"><span>Items Total</span><span>{formatCurrency(itemsPrice)}</span></div>
              {securityDeposit > 0 && (
                <div className="summary-row"><span>Security Deposit</span><span>{formatCurrency(securityDeposit)}</span></div>
              )}
              <div className="summary-row">
                <span>Delivery</span>
                <span>{deliveryCharges === 0 ? <span style={{ color: '#22c55e', fontWeight: 600 }}>FREE</span> : formatCurrency(deliveryCharges)}</span>
              </div>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
