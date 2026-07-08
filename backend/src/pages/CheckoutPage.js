import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, createRazorpayOrder, verifyPayment } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { formatCurrency, computeCartTotals } from '../utils/helpers';
import { FaLock, FaPlus, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { order, loading, paymentLoading } = useSelector((state) => state.orders);

  const items = cart?.items || [];
  const { itemsPrice, securityDeposit, deliveryCharges, totalAmount } = computeCartTotals(items);

  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  useEffect(() => {
    if (!items.length) navigate('/cart');
    if (user?.addresses?.length) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    } else {
      setShowNewAddressForm(true);
    }
  }, []);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!selectedAddress && !showNewAddressForm) {
      toast.error('Please select a delivery address');
      return;
    }
    setStep(2);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { toast.error('Failed to load payment gateway'); return; }

      // Create backend order first
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
        shippingAddress: selectedAddress || newAddress,
        paymentMethod: 'razorpay',
        itemsPrice,
        securityDeposit,
        deliveryCharges,
        totalAmount
      };

      const orderAction = await dispatch(createOrder(orderData));
      if (!orderAction.payload?.order) { toast.error('Order creation failed'); return; }
      const createdOrder = orderAction.payload.order;

      // Create Razorpay order
      const rzpAction = await dispatch(createRazorpayOrder({ amount: totalAmount }));
      if (!rzpAction.payload?.order) { toast.error('Payment initialization failed'); return; }
      const rzpOrder = rzpAction.payload.order;

      const options = {
        key: rzpAction.payload.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'RentoMojo',
        description: 'Electronics Rental & Purchase',
        image: 'https://via.placeholder.com/50',
        order_id: rzpOrder.id,
        handler: async function (response) {
          const verifyAction = await dispatch(verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: createdOrder._id
          }));
          if (verifyAction.payload?.success) {
            dispatch(clearCart());
            navigate(`/order-success/${createdOrder._id}`);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || ''
        },
        theme: { color: '#6C63FF' },
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message || 'Payment failed');
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
          <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span> Payment
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="checkout-section">
                <h2>Delivery Address</h2>

                {/* Saved addresses */}
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

                {/* New address toggle */}
                <button
                  className="add-address-btn"
                  onClick={() => { setShowNewAddressForm(!showNewAddressForm); setSelectedAddress(null); }}
                >
                  <FaPlus size={12} /> Add New Address
                </button>

                {showNewAddressForm && (
                  <form className="new-address-form" onSubmit={(e) => { e.preventDefault(); setSelectedAddress(newAddress); setStep(2); }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input className="form-control" required value={newAddress.fullName} onChange={e => setNewAddress(p => ({ ...p, fullName: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone *</label>
                        <input className="form-control" required value={newAddress.phone} onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address Line 1 *</label>
                      <input className="form-control" required placeholder="House/Flat No, Street" value={newAddress.addressLine1} onChange={e => setNewAddress(p => ({ ...p, addressLine1: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address Line 2</label>
                      <input className="form-control" placeholder="Landmark (optional)" value={newAddress.addressLine2} onChange={e => setNewAddress(p => ({ ...p, addressLine2: e.target.value }))} />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input className="form-control" required value={newAddress.city} onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State *</label>
                        <input className="form-control" required value={newAddress.state} onChange={e => setNewAddress(p => ({ ...p, state: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pincode *</label>
                        <input className="form-control" required value={newAddress.pincode} onChange={e => setNewAddress(p => ({ ...p, pincode: e.target.value }))} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Use This Address</button>
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

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="checkout-section">
                <div className="selected-address-display">
                  <strong>Delivering to:</strong>
                  <span>
                    {selectedAddress?.fullName}, {selectedAddress?.addressLine1}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
                  </span>
                  <button onClick={() => setStep(1)}>Change</button>
                </div>

                <h2>Payment Method</h2>
                <div className="payment-method-card selected">
                  <div className="payment-method-radio active"></div>
                  <div className="payment-method-info">
                    <img src="https://razorpay.com/favicon.ico" alt="Razorpay" width={20} />
                    <strong>Razorpay</strong>
                    <span>UPI, Cards, Net Banking, Wallets</span>
                  </div>
                  <FaLock className="payment-secure" />
                </div>

                <button
                  className="pay-now-btn"
                  onClick={handleRazorpayPayment}
                  disabled={loading || paymentLoading}
                >
                  {loading || paymentLoading ? (
                    <><span className="btn-spinner"></span> Processing...</>
                  ) : (
                    <><FaLock /> Pay {formatCurrency(totalAmount)} Securely</>
                  )}
                </button>
                <p className="payment-note">
                  🔒 Your payment is secured by Razorpay. We do not store your card details.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
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
