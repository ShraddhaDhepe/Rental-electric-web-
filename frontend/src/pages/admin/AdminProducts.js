import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/helpers';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const loadProducts = async (keyword = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/products?${keyword ? `keyword=${keyword}&` : ''}limit=50`);
      setProducts(res.data.products);
      setTotal(res.data.pagination.total);
    } catch (err) {
      toast.error('Failed to load products');
    }
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      loadProducts(search);
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Products <span style={{ color: '#718096', fontSize: '16px' }}>({total})</span></h1>
          <Link to="/admin/products/add" className="quick-action-btn primary">
            <FaPlus size={12} /> Add Product
          </Link>
        </div>

        <div className="admin-card">
          <div className="admin-toolbar">
            <form className="admin-search" onSubmit={(e) => { e.preventDefault(); loadProducts(search); }}>
              <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <button type="submit"><FaSearch /></button>
            </form>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Buy Price</th>
                    <th>Stock</th>
                    <th>Rental</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={p.images?.[0]?.url} alt={p.name} className="admin-product-img" />
                          <div>
                            <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 13 }}>{p.name.substring(0, 45)}</div>
                            <div style={{ fontSize: 11, color: '#E8201A' }}>{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-primary">{p.category}</span></td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(p.buyPrice)}</td>
                      <td>
                        <span style={{ color: p.stock > 5 ? '#22c55e' : p.stock > 0 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                          {p.stock}
                        </span>
                      </td>
                      <td>{p.availableForRent ? '✅' : '❌'}</td>
                      <td>
                        <span style={{ fontSize: 12, color: p.isFeatured ? '#E8201A' : '#a0aec0', fontWeight: 600 }}>
                          {p.isFeatured ? '⭐ Featured' : 'Regular'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link to={`/products/${p._id}`} className="admin-edit-btn" title="View">
                            👁
                          </Link>
                          <Link to={`/admin/products/edit/${p._id}`} className="admin-edit-btn" title="Edit">
                            <FaEdit size={11} />
                          </Link>
                          <button
                            className="admin-delete-btn"
                            onClick={() => handleDelete(p._id, p.name)}
                          >
                            <FaTrash size={11} />
                          </button>
                        </div>
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

export default AdminProducts;

