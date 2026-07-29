import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatCurrency, formatDateShort, getStatusColor } from '../../utils/helpers';
import {
  FaUsers, FaBoxOpen, FaShoppingCart, FaRupeeSign,
  FaTv, FaArrowUp, FaEye
} from 'react-icons/fa';
import './Admin.css';

const StatCard = ({ icon, label, value, change, color }) => (
  <div className="stat-card" style={{ '--stat-color': color }}>
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-info">
      <span>{label}</span>
      <strong>{value}</strong>
      {change && <small><FaArrowUp size={10} /> {change}</small>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setStats(res.data.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <span className="admin-label">Welcome back, Admin! 👋</span>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard icon={<FaRupeeSign />} label="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} color="#22c55e" />
          <StatCard icon={<FaShoppingCart />} label="Total Orders" value={stats?.totalOrders || 0} color="#E8201A" />
          <StatCard icon={<FaUsers />} label="Total Users" value={stats?.totalUsers || 0} color="#3b82f6" />
          <StatCard icon={<FaTv />} label="Total Products" value={stats?.totalProducts || 0} color="#f59e0b" />
        </div>

        {/* Quick Links */}
        <div className="admin-quick-links">
          <Link to="/admin/products/add" className="quick-action-btn primary">+ Add Product</Link>
          <Link to="/admin/orders" className="quick-action-btn">📦 Manage Orders</Link>
          <Link to="/admin/products" className="quick-action-btn">🛍️ Manage Products</Link>
          <Link to="/admin/users" className="quick-action-btn">👥 Manage Users</Link>
        </div>

        {/* Orders by status */}
        <div className="admin-grid">
          <div className="admin-card">
            <h3>Orders by Status</h3>
            <div className="status-list">
              {stats?.ordersByStatus?.map(s => (
                <div key={s._id} className="status-item">
                  <span style={{ color: getStatusColor(s._id), fontWeight: 600 }}>{s._id}</span>
                  <span className="status-count">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent orders */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Recent Orders</h3>
              <Link to="/admin/orders" className="see-all-link">View All</Link>
            </div>
            <div className="recent-orders">
              {stats?.recentOrders?.map(order => (
                <div key={order._id} className="recent-order-item">
                  <div>
                    <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                    <small>{order.user?.name}</small>
                  </div>
                  <div>
                    <span className="order-status-badge" style={{ background: getStatusColor(order.orderStatus) + '20', color: getStatusColor(order.orderStatus) }}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <strong>{formatCurrency(order.totalAmount)}</strong>
                  <Link to={`/orders/${order._id}`} className="view-btn"><FaEye /></Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top products */}
        {stats?.topProducts?.length > 0 && (
          <div className="admin-card">
            <h3>Top Selling Products</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts.map(p => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.totalSold}</td>
                    <td>{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

