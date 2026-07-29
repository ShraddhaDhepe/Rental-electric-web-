import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaSlidersH } from 'react-icons/fa';
import './ProductsPage.css';

const CATEGORIES = ['Television', 'Refrigerator', 'Washing Machine', 'Air Conditioner', 'Laptop', 'Smartphone', 'Microwave', 'Geyser', 'Other'];
const BRANDS = ['Samsung', 'LG', 'Sony', 'Whirlpool', 'Voltas', 'Dell', 'HP', 'IFB', 'Havells', 'Bosch'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'buyPrice' },
  { label: 'Price: High to Low', value: '-buyPrice' },
  { label: 'Top Rated', value: '-rating' },
  { label: 'Most Reviews', value: '-numReviews' }
];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
};

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, pagination, loading } = useSelector((state) => state.products);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    orderType: searchParams.get('orderType') || '',
    sort: searchParams.get('sort') || '-createdAt',
    isFeatured: searchParams.get('isFeatured') || '',
    isNewArrival: searchParams.get('isNewArrival') || '',
    page: parseInt(searchParams.get('page') || '1')
  });

  // Single source of truth: dispatch whenever filters change
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    dispatch(fetchProducts(params));
    const newParams = {};
    Object.entries(filters).forEach(([k, v]) => { if (v && k !== 'page') newParams[k] = v; });
    if (filters.page > 1) newParams.page = filters.page;
    setSearchParams(newParams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const applyFilters = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
    setSidebarOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      keyword: '', category: '', brand: '', minPrice: '', maxPrice: '',
      rating: '', orderType: '', sort: '-createdAt',
      isFeatured: '', isNewArrival: '', page: 1
    });
  };

  // Toggle: clicking same value deselects it
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value === prev[key] ? '' : value, page: 1 }));
  };

  const activeFiltersCount = [
    filters.category, filters.brand, filters.minPrice,
    filters.maxPrice, filters.rating, filters.orderType,
    filters.isFeatured, filters.isNewArrival
  ].filter(Boolean).length;

  return (
    <div className="products-page">
      <div className="container products-layout">
        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`products-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3><FaSlidersH /> Filters {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}</h3>
            <div className="sidebar-header-actions">
              {activeFiltersCount > 0 && (
                <button className="clear-all-btn" onClick={clearFilters}>Clear All</button>
              )}
              <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Search within sidebar */}
          <div className="sidebar-search">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.keyword}
              onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(); }}
            />
          </div>

          {/* Order Type */}
          <FilterSection title="Order Type">
            {['buy', 'rent'].map(type => (
              <label key={type} className="filter-checkbox">
                <input
                  type="radio"
                  name="orderType"
                  checked={filters.orderType === type}
                  onChange={() => updateFilter('orderType', type)}
                />
                <span>{type === 'buy' ? '🛒 Buy' : '🏷️ Rent'}</span>
              </label>
            ))}
          </FilterSection>

          {/* Category */}
          <FilterSection title="Category">
            {CATEGORIES.map(cat => (
              <label key={cat} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.category === cat}
                  onChange={() => updateFilter('category', cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </FilterSection>

          {/* Brand */}
          <FilterSection title="Brand">
            {BRANDS.map(brand => (
              <label key={brand} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.brand === brand}
                  onChange={() => updateFilter('brand', brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <div className="price-range">
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              />
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection title="Minimum Rating">
            {[4, 3, 2, 1].map(r => (
              <label key={r} className="filter-checkbox">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === String(r)}
                  onChange={() => updateFilter('rating', String(r))}
                />
                <span>{'⭐'.repeat(r)} & above</span>
              </label>
            ))}
          </FilterSection>

          {/* Special */}
          <FilterSection title="Special" defaultOpen={false}>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.isFeatured === 'true'}
                onChange={() => updateFilter('isFeatured', 'true')}
              />
              <span>⭐ Featured Products</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.isNewArrival === 'true'}
                onChange={() => updateFilter('isNewArrival', 'true')}
              />
              <span>🆕 New Arrivals</span>
            </label>
          </FilterSection>

          <button className="apply-filters-btn" onClick={() => setSidebarOpen(false)}>
            Apply Filters
          </button>
        </aside>

        {/* Main Content */}
        <main className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <div className="toolbar-left">
              <button className="filter-toggle-btn" onClick={() => setSidebarOpen(true)}>
                <FaFilter /> Filters {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
              </button>
              <span className="results-count">
                {loading ? 'Loading...' : `${pagination.total} products found`}
              </span>
            </div>
            <div className="toolbar-right">
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="sort-select"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFiltersCount > 0 && (
            <div className="active-filters">
              {filters.category && (
                <span className="filter-tag">
                  {filters.category} <button onClick={() => updateFilter('category', '')}>×</button>
                </span>
              )}
              {filters.brand && (
                <span className="filter-tag">
                  {filters.brand} <button onClick={() => updateFilter('brand', '')}>×</button>
                </span>
              )}
              {filters.orderType && (
                <span className="filter-tag">
                  {filters.orderType} <button onClick={() => updateFilter('orderType', '')}>×</button>
                </span>
              )}
              {filters.rating && (
                <span className="filter-tag">
                  {filters.rating}★+ <button onClick={() => updateFilter('rating', '')}>×</button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="filter-tag">
                  ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                  <button onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))}>×</button>
                </span>
              )}
              <button className="clear-all-tag" onClick={clearFilters}>Clear all</button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="page-loader">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="btn btn-primary" onClick={clearFilters} style={{ marginTop: 16 }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="products-grid-main">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={filters.page === 1}
              >←</button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={filters.page === p ? 'active' : ''}
                  onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                >{p}</button>
              ))}
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={filters.page === pagination.pages}
              >→</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
