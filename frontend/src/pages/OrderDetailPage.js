import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrder, cancelOrder } from '../store/slices/orderSlice';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import { FaArrowLeft, FaTruck, FaMapMarkerAlt, FaReceipt } from 'react-icons/fa';
import './OrderDetailPage.css';

const STATUS_STEPS = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.orders);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => { dispatch(fetchOrder(id)); }, [id, dispatch]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    await dispatch(cancelOrder({ orderId: id, reason: 'Cancelled by customer' }));
    setCancelling(false);
  };

  if (loading || !order) return <div className="page-loader"><div className="spinner"></div></div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="order-detail-page">
      <div className="container">
        <Link to="/orders" className="back-link">
          <FaArrowLeft size={13} /> Back to Orders
        </Link>

        <div className="order-detail-header">
          <div>
            <h1>Order Details</h1>
            <span className="order-detail-id">#{order._id?.slice(-8).toUpperCase()}</span>
            <span className="order-detail-date">{formatDate(order.createdAt)}</span>
          </div>
          <span
            className="order-detail-status"
            style={{ background: getStatusColor(order.orderStatus) + '20', color: getStatusColor(order.orderStatus) }}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* Tracking */}
        {!['Cancelled', 'Returned'].includes(order.orderStatus) && (
          <div className="order-tracking-card">
            <h3><FaTruck /> Order Tracking</h3>
            <div className="tracking-steps">
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div className={`tracking-step ${i <= currentStep ? 'done' : ''} ${i === currentStep ? 'current' : ''}`}>
                    <div className="tracking-dot">{i <= currentStep ? '✓' : i + 1}</div>
                    <span>{step}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`tracking-line ${i < currentStep ? 'done' : ''}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            {order.trackingNumber && (
              <p className="tracking-number">Tracking No: <strong>{order.trackingNumber}</strong></p>
            )}
          </div>
        )}

        <div className="order-detail-layout">
          <div className="order-detail-main">
            {/* Items */}
            <div className="detail-card">
              <h3><FaReceipt /> Order Items</h3>
              {order.orderItems?.map((item) => (
                <div key={item._id} className="detail-item">
                  <img src={item.image} alt={item.name} />
                  <div className="detail-item-info">
                    <span>{item.name}</span>
                    {item.orderType === 'rent' ? (
                      <small>Rental · {item.rentalPlan?.duration} · ₹{item.rentalPlan?.monthlyRent}/mo</small>
                    ) : (
                      <small>Qty: {item.quantity} × {formatCurrency(item.price)}</small>
                    )}
                  </div>
                  <strong>{formatCurrency(
                    item.orderType === 'rent'
                      ? item.rentalPlan?.totalAmount + item.rentalPlan?.securityDeposit
                      : item.price * item.quantity
                  )}</strong>
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="detail-card">
              <h3><FaMapMarkerAlt /> Delivery Address</h3>
              <div className="address-detail">
                <strong>{order.shippingAddress?.fullName}</strong>
                <span>{order.shippingAddress?.phone}</span>
                <span>{order.shippingAddress?.addressLine1}{order.shippingAddress?.addressLine2 && ', ' + order.shippingAddress.addressLine2}</span>
                <span>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="order-detail-summary">
            <div className="detail-card">
              <h3>Payment Summary</h3>
              <div className="summary-rows">
                <div className="summary-row"><span>Items Total</span><span>{formatCurrency(order.itemsPrice)}</span></div>
                {order.securityDeposit > 0 && (
                  <div className="summary-row"><span>Security Deposit</span><span>{formatCurrency(order.securityDeposit)}</span></div>
                )}
                <div className="summary-row"><span>Delivery</span><span>{order.deliveryCharges > 0 ? formatCurrency(order.deliveryCharges) : 'FREE'}</span></div>
                {order.discount > 0 && (
                  <div className="summary-row discount"><span>Discount</span><span>-{formatCurrency(order.discount)}</span></div>
                )}
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total"><span>Total Paid</span><strong>{formatCurrency(order.totalAmount)}</strong></div>
              <div className="payment-status-badge" style={{ color: order.paymentInfo?.status === 'paid' ? '#22c55e' : '#f59e0b' }}>
                Payment: {order.paymentInfo?.status?.toUpperCase()}
              </div>
              {order.paymentInfo?.razorpay_payment_id && (
                <div className="payment-id">TXN: {order.paymentInfo.razorpay_payment_id}</div>
              )}
            </div>

            {/* Cancel button */}
            {!['Delivered', 'Cancelled', 'Returned'].includes(order.orderStatus) && (
              <button
                className="cancel-order-btn"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
