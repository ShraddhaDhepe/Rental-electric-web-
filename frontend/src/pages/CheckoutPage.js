import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, confirmUpiPayment } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { formatCurrency, computeCartTotals } from '../utils/helpers';
import { FaPlus, FaCheckCircle, FaQrcode, FaMobileAlt } from 'react-icons/fa';
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

  const [step, setStep] = useState(1); // 1: Address, 2: QR Payment, 3: Confirmed
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
  const [upiTxnId, setUpiTxnId] = useState('');

  const UPI_ID   = import.meta.env.VITE_UPI_ID   || 'admin@upi';
  const UPI_NAME = import.meta.env.VITE_UPI_NAME  || 'Rents Electronics';

  // UPI QR string  →  use Google Charts to render QR (no extra lib)
  const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${totalAmount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiString)}&size=220x220&margin=10`;

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

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!selectedAddress && !showNewAddressForm) {
      toast.error('Please select a delivery address');
      return;
    }
    setStep(2);
  };

  const handleUpiConfirm = async () => {
    if (!upiTxnId.trim()) {
      toast.error('🔔 Payment not done yet? Complete your UPI payment first, then enter the Transaction ID here to confirm your order.', { duration: 5000 });
      return;
    }
    try {
      // Create the order first if not yet created
      let orderId = createdOrderId;
      if (!orderId) {
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
          paymentMethod: 'upi',
          itemsPrice,
          securityDeposit,
          deliveryCharges,
          totalAmount
        };
        const orderAction = await dispatch(createOrder(orderData));
        if (!orderAction.payload?.order) { toast.error('Order creation failed'); return; }
        orderId = orderAction.payload.order._id;
        setCreatedOrderId(orderId);
      }

      const confirmAction = await dispatch(confirmUpiPayment({ orderId, upiTxnId }));
      if (confirmAction.payload?.success) {
        dispatch(clearCart());
        setStep(3);
      }
    } catch (err) {
      toast.error(err.message || 'Confirmation failed');
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
            Pay via UPI
          </div>
          <div className="step-line"></div>
          <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span> Confirmed
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

                    {/* ── Row 1: Name + Phone ── */}
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

                    {/* ── Row 2: Address Lines ── */}
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

                    {/* ── Row 3: City + State + Pincode ── */}
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

                    {/* ── Row 4: Residence Type ── */}
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

                    {/* ── Row 5: Floor + Lift ── */}
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

            {/* Step 2: UPI QR Payment */}
            {step === 2 && (
              <div className="checkout-section">
                <div className="selected-address-display">
                  <strong>Delivering to:</strong>
                  <span>{selectedAddress?.fullName}, {selectedAddress?.addressLine1}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}</span>
                  <button onClick={() => setStep(1)}>Change</button>
                </div>

                <h2 className="upi-section-title"><FaQrcode /> Pay via UPI</h2>
                <p className="upi-subtitle">Scan the QR code below using any UPI app to pay</p>

                <div className="upi-qr-block">
                  <div className="upi-qr-left">
                    <div className="upi-qr-wrap">
                      <img src={qrUrl} alt="UPI QR Code" className="upi-qr-img" />
                    </div>
                    <p className="upi-id-text">UPI ID: <strong>{UPI_ID}</strong></p>
                    <p className="upi-amount-text">Amount: <strong>{formatCurrency(totalAmount)}</strong></p>
                  </div>
                  <div className="upi-qr-right">
                    <div className="upi-steps">
                      <div className="upi-step-item">
                        <span className="upi-step-num">1</span>
                        <span>Open any UPI app — GPay, PhonePe, Paytm, BHIM</span>
                      </div>
                      <div className="upi-step-item">
                        <span className="upi-step-num">2</span>
                        <span>Scan the QR code or enter UPI ID manually</span>
                      </div>
                      <div className="upi-step-item">
                        <span className="upi-step-num">3</span>
                        <span>Enter amount <strong>{formatCurrency(totalAmount)}</strong> and complete payment</span>
                      </div>
                      <div className="upi-step-item">
                        <span className="upi-step-num">4</span>
                        <span>Enter your UPI Transaction ID below and click Confirm</span>
                      </div>
                    </div>

                    <div className="upi-txn-group">
                      <label className="upi-txn-label">UPI Transaction ID <span className="upi-txn-req">*</span></label>
                      <input
                        className={`upi-txn-input ${!upiTxnId.trim() ? 'upi-txn-empty' : ''}`}
                        placeholder="Enter Transaction ID after paying (e.g. 426789012345)"
                        value={upiTxnId}
                        onChange={e => setUpiTxnId(e.target.value)}
                      />
                      {!upiTxnId.trim() && (
                        <span className="upi-txn-hint">⚠️ Required — pay first, then enter the ID shown in your UPI app</span>
                      )}
                    </div>

                    <button
                      className="upi-confirm-btn"
                      onClick={handleUpiConfirm}
                      disabled={loading || paymentLoading}
                    >
                      {loading || paymentLoading
                        ? <><span className="btn-spinner" /> Confirming…</>
                        : <><FaCheckCircle /> I've Paid — Confirm Order</>}
                    </button>
                    <p className="upi-note">
                      <FaMobileAlt size={12} /> Your order will be confirmed once you click the button above.
                    </p>
                  </div>
                </div>

                {/* UPI app logos */}
                <div className="upi-apps">
                  <span>Pay using</span>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" alt="GPay" title="Google Pay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png" alt="PhonePe" title="PhonePe" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" title="Paytm" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png" alt="UPI" title="BHIM UPI" />
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
                  <strong>UPI</strong>
                </div>
                {upiTxnId && (
                  <div className="upi-confirmed-detail">
                    <span>Transaction ID</span>
                    <strong>{upiTxnId}</strong>
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

