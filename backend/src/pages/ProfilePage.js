import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import { FaUser, FaMapMarkerAlt, FaShieldAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '', isDefault: false
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileForm));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setSavingPassword(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/address', addressForm);
      toast.success('Address added successfully!');
      setShowAddressForm(false);
      setAddressForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', isDefault: false });
      // Refresh user
      const res = await api.get('/auth/me');
      dispatch({ type: 'auth/getMe/fulfilled', payload: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/users/address/${id}`);
      toast.success('Address deleted');
      const res = await api.get('/auth/me');
      dispatch({ type: 'auth/getMe/fulfilled', payload: res.data });
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'addresses', label: 'Addresses', icon: <FaMapMarkerAlt /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> }
  ];

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-avatar-section">
              <div className="profile-big-avatar">{user?.name?.charAt(0)}</div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
              {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
            </div>
            <nav className="profile-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`profile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="profile-content">
            {activeTab === 'profile' && (
              <div className="profile-card">
                <h2>Personal Information</h2>
                <form onSubmit={handleProfileSave}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-control"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-control" value={user?.email} disabled style={{ background: '#f8fafc' }} />
                    <small className="input-note">Email cannot be changed</small>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Account Type</label>
                    <input className="form-control" value={user?.role === 'admin' ? 'Administrator' : 'Customer'} disabled style={{ background: '#f8fafc' }} />
                  </div>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="profile-card">
                <div className="profile-card-header">
                  <h2>Saved Addresses</h2>
                  <button className="btn btn-outline btn-sm" onClick={() => setShowAddressForm(!showAddressForm)}>
                    <FaPlus size={11} /> Add New
                  </button>
                </div>

                {showAddressForm && (
                  <form className="new-address-form" onSubmit={handleAddAddress}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input className="form-control" required value={addressForm.fullName} onChange={e => setAddressForm(p => ({ ...p, fullName: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone *</label>
                        <input className="form-control" required value={addressForm.phone} onChange={e => setAddressForm(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address Line 1 *</label>
                      <input className="form-control" required value={addressForm.addressLine1} onChange={e => setAddressForm(p => ({ ...p, addressLine1: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address Line 2</label>
                      <input className="form-control" value={addressForm.addressLine2} onChange={e => setAddressForm(p => ({ ...p, addressLine2: e.target.value }))} />
                    </div>
                    <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input className="form-control" required value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State *</label>
                        <input className="form-control" required value={addressForm.state} onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pincode *</label>
                        <input className="form-control" required value={addressForm.pincode} onChange={e => setAddressForm(p => ({ ...p, pincode: e.target.value }))} />
                      </div>
                    </div>
                    <label className="filter-checkbox" style={{ marginBottom: 16 }}>
                      <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm(p => ({ ...p, isDefault: e.target.checked }))} />
                      <span>Set as default address</span>
                    </label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" className="btn btn-primary">Save Address</button>
                      <button type="button" className="btn btn-outline" onClick={() => setShowAddressForm(false)}>Cancel</button>
                    </div>
                  </form>
                )}

                <div className="addresses-list">
                  {user?.addresses?.length === 0 && !showAddressForm && (
                    <p className="no-addresses">No addresses saved. Add one to get started.</p>
                  )}
                  {user?.addresses?.map((addr) => (
                    <div key={addr._id} className="address-item">
                      <div className="address-item-info">
                        <strong>{addr.fullName} {addr.isDefault && <span className="default-tag">Default</span>}</strong>
                        <span>{addr.phone}</span>
                        <span>{addr.addressLine1}{addr.addressLine2 && ', ' + addr.addressLine2}</span>
                        <span>{addr.city}, {addr.state} - {addr.pincode}</span>
                      </div>
                      <button
                        className="delete-address-btn"
                        onClick={() => handleDeleteAddress(addr._id)}
                        aria-label="Delete address"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="profile-card">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={savingPassword}>
                    {savingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
