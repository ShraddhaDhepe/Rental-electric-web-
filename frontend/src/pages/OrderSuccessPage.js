import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrder } from '../store/slices/orderSlice';
import { formatCurrency } from '../utils/helpers';
import { FaCheckCircle, FaRupeeSign } from 'react-icons/fa';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.orders);

  useEffect(() => { dispatch(fetchOrder(id)); }, [id, dispatch]);

  if (loading || !order) {
    return <div className="page-loader"><div className="spinner"></div></div>;
  }

  const isPaid = order.paymentInfo?.status === 'paid';

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-card">

          {/* Payment status icon */}
          <div className={`success-icon ${isPaid ? 'paid' : 'pending'}`}>
            {isPaid ? <FaCheckCircle /> : <FaRupeeSign />}
          </div>

          <h1>{isPaid ? 'Payment Successful!' : 'Order Placed!'}</h1>
          <p>
            {isPaid
              ? 'Your payment has been received. Your order is now confirmed.'
              : 'Your order has been placed. Payment is pending.'}
          </p>

          {/* Payment summary box */}
          <div className="payment-summary-box">
            <div className="payment-summary-row">
              <span>Payment Status</span>
              <span className={`payment-badge ${isPaid ? 'paid' : 'pending'}`}>
                {isPaid ? '✅ PAID' : '⏳ PENDING'}
              </span>
            </div>
            <div className="payment-summary-row">
              <span>Amount Paid</span>
              <strong>{formatCurrency(order.totalAmount)}</strong>
            </div>
            {order.paymentInfo?.razorpay_payment_id && (
              <div className="payment-summary-row">
                <span>Payment ID</span>
                <code>{order.paymentInfo.razorpay_payment_id}</code>
              </div>
            )}
            <div className="payment-summary-row">
              <span>Order ID</span>
              <code>{order._id}</code>
            </div>
          </div>

          <div className="success-actions">
            <Link to={`/orders/${order._id}`} className="btn btn-primary">
              View Order
            </Link>
            <Link to="/products" className="btn btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
