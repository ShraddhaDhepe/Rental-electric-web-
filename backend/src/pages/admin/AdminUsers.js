import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatDateShort } from '../../utils/helpers';
import { FaSearch, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const loadUsers = async (keyword = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?${keyword ? `keyword=${keyword}&` : ''}limit=50`);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to load users');
    }
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      loadUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const toggleRole = async (id, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await api.put(`/admin/users/${id}`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      loadUsers(search);
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Users <span style={{ color: '#718096', fontSize: '16px' }}>({total})</span></h1>
        </div>
        <div className="admin-card">
          <div className="admin-toolbar">
            <form className="admin-search" onSubmit={(e) => { e.preventDefault(); loadUsers(search); }}>
              <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                    <th>User</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6C63FF, #5548D9)',
                            color: 'white', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0
                          }}>
                            {u.name?.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                            <div style={{ fontSize: 12, color: '#718096' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{u.phone || '—'}</td>
                      <td>
                        <span style={{
                          background: u.role === 'admin' ? '#eef2ff' : '#f8fafc',
                          color: u.role === 'admin' ? '#6C63FF' : '#718096',
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: 12 }}>{formatDateShort(u.createdAt)}</td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-edit-btn"
                            onClick={() => toggleRole(u._id, u.role)}
                            title="Toggle role"
                          >
                            {u.role === 'admin' ? '👤 Make User' : '⚙️ Make Admin'}
                          </button>
                          <button
                            className="admin-delete-btn"
                            onClick={() => handleDelete(u._id, u.name)}
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

export default AdminUsers;
