import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/slices/orderSlice';
import { formatCurrency, formatDateShort, getStatusColor } from '../utils/helpers';
import { FaEye, FaBoxOpen } from 'react-icons/fa';
import './OrdersPage.css';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <FaBoxOpen style={{ fontSize: 64, color: '#e2e8f0', marginBottom: 16 }} />
            <h3>No orders yet</h3>
            <p>Your orders will appear here once you make a purchase</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">{formatDateShort(order.createdAt)}</span>
                  </div>
                  <span className="order-status" style={{ backgroundColor: getStatusColor(order.orderStatus) + '20', color: getStatusColor(order.orderStatus) }}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="order-card-items">
                  {order.orderItems?.slice(0, 3).map((item) => (
                    <div key={item._id} className="order-mini-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <span>{item.name?.substring(0, 50)}</span>
                        <small>{item.orderType === 'rent' ? `Rental · ${item.rentalPlan?.duration}` : `Qty: ${item.quantity}`}</small>
                      </div>
                    </div>
                  ))}
                  {order.orderItems?.length > 3 && (
                    <span className="more-items">+{order.orderItems.length - 3} more items</span>
                  )}
                </div>
                <div className="order-card-footer">
                  <div className="order-total">
                    <span>Total</span>
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                  </div>
                  <div className="order-payment-status" style={{ color: order.paymentInfo?.status === 'paid' ? '#22c55e' : '#f59e0b' }}>
                    {order.paymentInfo?.status?.toUpperCase()}
                  </div>
                  <Link to={`/orders/${order._id}`} className="view-order-btn">
                    <FaEye size={13} /> View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
