import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatCurrency, formatDateShort, getStatusColor } from '../../utils/helpers';
import { FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Admin.css';

const STATUSES = ['', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async (status = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/orders${status ? `?status=${status}` : ''}`);
      setOrders(res.data.orders);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to load orders');
    }
    setLoading(false);
  };

  useEffect(() => { loadOrders(statusFilter); }, [statusFilter]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/admin/orders/${orderId}`, { orderStatus: newStatus });
      toast.success('Status updated');
      loadOrders(statusFilter);
    } catch (err) {
      toast.error('Failed to update status');
    }
    setUpdatingId(null);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Orders <span style={{ color: '#718096', fontSize: '16px' }}>({total})</span></h1>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button
              key={s}
              className={`quick-action-btn ${statusFilter === s ? 'primary' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        <div className="admin-card">
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td>
                        <div style={{ fontSize: 13 }}>
                          <div style={{ fontWeight: 600 }}>{order.user?.name}</div>
                          <div style={{ color: '#718096', fontSize: 12 }}>{order.user?.email}</div>
                        </div>
                      </td>
                      <td>{order.orderItems?.length}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(order.totalAmount)}</td>
                      <td>
                        <span style={{
                          color: order.paymentInfo?.status === 'paid' ? '#22c55e' : '#f59e0b',
                          fontWeight: 700, fontSize: 12
                        }}>
                          {order.paymentInfo?.status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontSize: 12 }}>{formatDateShort(order.createdAt)}</td>
                      <td>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                          style={{
                            padding: '4px 8px',
                            border: `1.5px solid ${getStatusColor(order.orderStatus)}`,
                            borderRadius: 6,
                            color: getStatusColor(order.orderStatus),
                            fontWeight: 700,
                            fontSize: 12,
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {STATUSES.filter(Boolean).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <Link to={`/orders/${order._id}`} className="view-btn">
                          <FaEye size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
