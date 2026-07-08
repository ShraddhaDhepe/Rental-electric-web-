import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
    <div style={{ fontSize: 80, marginBottom: 16 }}>🔍</div>
    <h1 style={{ fontSize: 48, fontWeight: 800, color: '#6C63FF', marginBottom: 8 }}>404</h1>
    <h2 style={{ fontSize: 24, color: '#1a1a2e', marginBottom: 12 }}>Page Not Found</h2>
    <p style={{ color: '#718096', marginBottom: 28, maxWidth: 400 }}>
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div style={{ display: 'flex', gap: 12 }}>
      <Link to="/" className="btn btn-primary">Go Home</Link>
      <Link to="/products" className="btn btn-outline">Browse Products</Link>
    </div>
  </div>
);

export default NotFoundPage;
