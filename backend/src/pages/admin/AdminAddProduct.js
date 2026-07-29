import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaUpload, FaImage } from 'react-icons/fa';
import './Admin.css';

const CATEGORIES = ['Television', 'Refrigerator', 'Washing Machine', 'Air Conditioner', 'Laptop', 'Smartphone', 'Microwave', 'Geyser', 'Other'];

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '', description: '', brand: '', category: 'Television',
    buyPrice: '', originalPrice: '', stock: '', condition: 'New',
    availableForRent: true, availableForBuy: true,
    isFeatured: false, isNewArrival: false, deliveryDays: 3,
    images: [],
    rentalPlans: [],
    specifications: [],
    features: [''],
    tags: ''
  });

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));

  // ── Image gallery picker ──────────────────────────────────────────
  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        // Compress/resize to max 800x800, quality 0.7 to keep base64 small for MongoDB
        const img = new Image();
        img.onload = () => {
          const MAX = 800;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            const ratio = Math.min(MAX / width, MAX / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          setForm(p => ({
            ...p,
            images: [...p.images, { url: compressed, name: file.name }]
          }));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
    // reset so same file can be re-selected
    e.target.value = '';
  };

  const removeImage = (i) => setField('images', form.images.filter((_, idx) => idx !== i));

  const addRentalPlan = () => setForm(p => ({
    ...p,
    rentalPlans: [...p.rentalPlans, { duration: '', months: '', monthlyRent: '', totalAmount: '', securityDeposit: '', discount: 0 }]
  }));

  const updatePlan = (i, key, val) => setForm(p => {
    const plans = [...p.rentalPlans];
    plans[i] = { ...plans[i], [key]: val };
    return { ...p, rentalPlans: plans };
  });

  const removePlan = (i) => setForm(p => ({ ...p, rentalPlans: p.rentalPlans.filter((_, idx) => idx !== i) }));

  const addSpec = () => setForm(p => ({ ...p, specifications: [...p.specifications, { key: '', value: '' }] }));
  const updateSpec = (i, field, val) => setForm(p => {
    const specs = [...p.specifications];
    specs[i] = { ...specs[i], [field]: val };
    return { ...p, specifications: specs };
  });
  const removeSpec = (i) => setForm(p => ({ ...p, specifications: p.specifications.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        buyPrice: Number(form.buyPrice),
        originalPrice: Number(form.originalPrice) || undefined,
        stock: Number(form.stock),
        deliveryDays: Number(form.deliveryDays),
        images: form.images.map(img => ({ url: img.url })),
        rentalPlans: form.rentalPlans.map(p => ({
          ...p,
          months: Number(p.months),
          monthlyRent: Number(p.monthlyRent),
          totalAmount: Number(p.totalAmount),
          securityDeposit: Number(p.securityDeposit),
          discount: Number(p.discount) || 0
        })),
        features: form.features.filter(Boolean),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      await api.post('/products', payload);
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    }
    setLoading(false);
  };

  return (
    <div className="add-product-page">
      <div className="container">
        <div className="admin-header">
          <h1>Add New Product</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="add-product-card">
            {/* Basic Info */}
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-control" required value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Samsung 43-inch 4K Smart LED TV" />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-control" rows={4} required value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Detailed product description..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <input className="form-control" required value={form.brand} onChange={e => setField('brand', e.target.value)} placeholder="Samsung, LG, Sony..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-control" value={form.category} onChange={e => setField('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="form-section">
              <h3>Pricing & Stock</h3>
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Buy Price (₹) *</label>
                  <input className="form-control" type="number" required value={form.buyPrice} onChange={e => setField('buyPrice', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input className="form-control" type="number" value={form.originalPrice} onChange={e => setField('originalPrice', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input className="form-control" type="number" required value={form.stock} onChange={e => setField('stock', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Condition</label>
                  <select className="form-control" value={form.condition} onChange={e => setField('condition', e.target.value)}>
                    {['New', 'Refurbished', 'Used-Good', 'Used-Fair'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Days</label>
                  <input className="form-control" type="number" value={form.deliveryDays} onChange={e => setField('deliveryDays', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  ['availableForRent', 'Available for Rent'],
                  ['availableForBuy', 'Available to Buy'],
                  ['isFeatured', 'Featured Product'],
                  ['isNewArrival', 'New Arrival']
                ].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form[key]} onChange={e => setField(key, e.target.checked)} style={{ accentColor: '#6C63FF' }} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="form-section">
              <h3>Product Images</h3>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleImageFiles}
              />

              {/* Upload button */}
              <button
                type="button"
                className="img-upload-btn"
                onClick={() => fileInputRef.current.click()}
              >
                <FaUpload size={14} />
                Choose from Gallery
              </button>

              {/* Preview grid */}
              {form.images.length > 0 && (
                <div className="img-preview-grid">
                  {form.images.map((img, i) => (
                    <div key={i} className="img-preview-item">
                      <img src={img.url} alt={img.name || `img-${i}`} />
                      <button
                        type="button"
                        className="img-remove-btn"
                        onClick={() => removeImage(i)}
                        title="Remove"
                      >
                        <FaTrash size={10} />
                      </button>
                      {i === 0 && <span className="img-main-badge">Main</span>}
                    </div>
                  ))}
                </div>
              )}

              {form.images.length === 0 && (
                <div className="img-empty-state">
                  <FaImage size={32} style={{ color: '#cbd5e0', marginBottom: 8 }} />
                  <p>No images selected. Click "Choose from Gallery" to add product images.</p>
                </div>
              )}
            </div>

            {/* Rental Plans */}
            <div className="form-section">
              <h3>Rental Plans</h3>
              {form.rentalPlans.map((plan, i) => (
                <div key={i} className="rental-plan-row">
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input className="form-control" placeholder="3 months" value={plan.duration} onChange={e => updatePlan(i, 'duration', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Months</label>
                    <input className="form-control" type="number" value={plan.months} onChange={e => updatePlan(i, 'months', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Rent</label>
                    <input className="form-control" type="number" value={plan.monthlyRent} onChange={e => updatePlan(i, 'monthlyRent', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Amount</label>
                    <input className="form-control" type="number" value={plan.totalAmount} onChange={e => updatePlan(i, 'totalAmount', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Security Deposit</label>
                    <input className="form-control" type="number" value={plan.securityDeposit} onChange={e => updatePlan(i, 'securityDeposit', e.target.value)} />
                  </div>
                  <button type="button" className="remove-plan-btn" onClick={() => removePlan(i)}><FaTrash size={11} /></button>
                </div>
              ))}
              <button type="button" className="add-plan-btn" onClick={addRentalPlan}>
                <FaPlus size={11} /> Add Rental Plan
              </button>
            </div>

            {/* Specifications */}
            <div className="form-section">
              <h3>Specifications</h3>
              {form.specifications.map((spec, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, marginBottom: 8, alignItems: 'end' }}>
                  <input className="form-control" placeholder="Key (e.g. Screen Size)" value={spec.key} onChange={e => updateSpec(i, 'key', e.target.value)} />
                  <input className="form-control" placeholder="Value (e.g. 43 inches)" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} />
                  <button type="button" className="remove-plan-btn" onClick={() => removeSpec(i)}><FaTrash size={11} /></button>
                </div>
              ))}
              <button type="button" className="add-plan-btn" onClick={addSpec}>
                <FaPlus size={11} /> Add Specification
              </button>
            </div>

            {/* Features & Tags */}
            <div className="form-section">
              <h3>Features & Tags</h3>
              <div className="form-group">
                <label className="form-label">Features (one per line)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.features.join('\n')}
                  onChange={e => setField('features', e.target.value.split('\n'))}
                  placeholder="4K UHD&#10;Smart TV&#10;Built-in Wi-Fi"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input className="form-control" placeholder="tv, samsung, 4k, smart tv" value={form.tags} onChange={e => setField('tags', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Creating...' : 'Create Product'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
