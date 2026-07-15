import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import {
  FaTimes, FaChevronDown, FaChevronUp, FaSlidersH, FaFilter,
  FaTv, FaSnowflake, FaWind, FaLaptop, FaMobileAlt,
  FaTshirt, FaBolt, FaThermometerHalf, FaBoxOpen, FaArrowRight
} from 'react-icons/fa';
import './ProductsPage.css';

const CATEGORIES = [
  { name: 'Air Conditioner',  icon: <FaWind />,              slug: 'Air Conditioner' },
  { name: 'Television',       icon: <FaTv />,                slug: 'Television' },
  { name: 'Refrigerator',     icon: <FaSnowflake />,         slug: 'Refrigerator' },
  { name: 'Washing Machine',  icon: <FaTshirt />,            slug: 'Washing Machine' },
  { name: 'Laptop',           icon: <FaLaptop />,            slug: 'Laptop' },
  { name: 'Smartphone',       icon: <FaMobileAlt />,         slug: 'Smartphone' },
  { name: 'Microwave',        icon: <FaBolt />,              slug: 'Microwave' },
  { name: 'Geyser',           icon: <FaThermometerHalf />,   slug: 'Geyser' },
  { name: 'Other',            icon: <FaBoxOpen />,           slug: 'Other' },
];

const BRANDS  = ['Samsung', 'LG', 'Sony', 'Whirlpool', 'Voltas', 'Dell', 'HP', 'IFB', 'Havells', 'Bosch'];
const SORT_OPTIONS = [
  { label: 'Popularity',        value: '-numReviews' },
  { label: 'Newest First',      value: '-createdAt' },
  { label: 'Price: Low → High', value: 'buyPrice' },
  { label: 'Price: High → Low', value: '-buyPrice' },
  { label: 'Top Rated',         value: '-rating' },
];

/* collapsible sidebar section */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        {open ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────── */
const ProductsPage = () => {
  const dispatch      = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, pagination, loading } = useSelector(s => s.products);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* per-category products fetched client-side */
  const [catProducts, setCatProducts] = useState({}); // { slug: [product, ...] }
  const [catLoading,  setCatLoading]  = useState(true);

  const [filters, setFilters] = useState({
    keyword:     searchParams.get('keyword')     || '',
    category:    searchParams.get('category')    || '',
    brand:       searchParams.get('brand')       || '',
    minPrice:    searchParams.get('minPrice')    || '',
    maxPrice:    searchParams.get('maxPrice')    || '',
    rating:      searchParams.get('rating')      || '',
    sort:        searchParams.get('sort')        || '-numReviews',
    isFeatured:  searchParams.get('isFeatured')  || '',
    isNewArrival:searchParams.get('isNewArrival')|| '',
    page:        parseInt(searchParams.get('page') || '1'),
  });

  /* ── When a specific category is active, show normal filtered grid ── */
  const activeCat = filters.category;

  /* fetch all-categories overview (3 per cat) on first load */
  useEffect(() => {
    if (activeCat) return; // don't need overview when filtering
    const fetchAll = async () => {
      setCatLoading(true);
      const { default: api } = await import('../utils/api');
      const results = await Promise.all(
        CATEGORIES.map(cat =>
          api.get(`/products?category=${encodeURIComponent(cat.slug)}&limit=3`)
            .then(r => ({ slug: cat.slug, items: r.data.products || [] }))
            .catch(() => ({ slug: cat.slug, items: [] }))
        )
      );
      const map = {};
      results.forEach(r => { map[r.slug] = r.items; });
      setCatProducts(map);
      setCatLoading(false);
    };
    fetchAll();
  }, [activeCat]);

  /* fetch filtered products when category/brand/etc change */
  useEffect(() => {
    if (!activeCat && !filters.keyword && !filters.brand &&
        !filters.minPrice && !filters.maxPrice && !filters.rating &&
        !filters.isFeatured && !filters.isNewArrival) return;

    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    dispatch(fetchProducts(params));

    const newParams = {};
    Object.entries(filters).forEach(([k, v]) => { if (v && k !== 'page') newParams[k] = v; });
    if (filters.page > 1) newParams.page = filters.page;
    setSearchParams(newParams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const updateFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value === prev[key] ? '' : value, page: 1 }));

  const clearFilters = () => setFilters({
    keyword: '', category: '', brand: '', minPrice: '', maxPrice: '',
    rating: '', sort: '-numReviews', isFeatured: '', isNewArrival: '', page: 1,
  });

  const activeFiltersCount = [
    filters.brand, filters.minPrice, filters.maxPrice,
    filters.rating, filters.isFeatured, filters.isNewArrival,
  ].filter(Boolean).length;

  /* is browsing in "all categories" mode (no active cat / keyword / brand) */
  const isBrowseMode = !activeCat && !filters.keyword && !filters.brand &&
    !filters.minPrice && !filters.maxPrice && !filters.rating &&
    !filters.isFeatured && !filters.isNewArrival;

  return (
    <div className="products-page">
      <div className="container products-layout">

        {/* overlay */}
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* ── SIDEBAR ── */}
        <aside className={`products-sidebar ${sidebarOpen ? 'open' : ''}`}>

          {/* header */}
          <div className="sidebar-header">
            <h3><FaSlidersH size={14} /> Filters
              {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
            </h3>
            <div className="sidebar-header-actions">
              {activeFiltersCount > 0 && (
                <button className="clear-all-btn" onClick={clearFilters}>Clear All</button>
              )}
              <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><FaTimes /></button>
            </div>
          </div>

          {/* ── Category list (replaces Buy/Rent) ── */}
          <div className="sidebar-categories">
            <div className="sidebar-cat-title">Categories</div>
            {CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                className={`sidebar-cat-item ${activeCat === cat.slug ? 'active' : ''}`}
                onClick={() => { updateFilter('category', cat.slug); setSidebarOpen(false); }}
              >
                <span className="sidebar-cat-icon">{cat.icon}</span>
                <span className="sidebar-cat-name">{cat.name}</span>
              </button>
            ))}
            {activeCat && (
              <button className="sidebar-cat-clear" onClick={() => updateFilter('category', '')}>
                ✕ Show All Categories
              </button>
            )}
          </div>

          {/* Brand */}
          <FilterSection title="Brand">
            {BRANDS.map(brand => (
              <label key={brand} className="filter-checkbox">
                <input type="checkbox" checked={filters.brand === brand}
                  onChange={() => updateFilter('brand', brand)} />
                <span>{brand}</span>
              </label>
            ))}
          </FilterSection>

          {/* Price */}
          <FilterSection title="Price Range">
            <div className="price-range">
              <input type="number" placeholder="Min ₹" value={filters.minPrice}
                onChange={e => setFilters(p => ({ ...p, minPrice: e.target.value }))} />
              <span>—</span>
              <input type="number" placeholder="Max ₹" value={filters.maxPrice}
                onChange={e => setFilters(p => ({ ...p, maxPrice: e.target.value }))} />
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection title="Min Rating">
            {[4, 3, 2, 1].map(r => (
              <label key={r} className="filter-checkbox">
                <input type="radio" name="rating" checked={filters.rating === String(r)}
                  onChange={() => updateFilter('rating', String(r))} />
                <span>{'⭐'.repeat(r)} & above</span>
              </label>
            ))}
          </FilterSection>

          {/* Special */}
          <FilterSection title="Special" defaultOpen={false}>
            <label className="filter-checkbox">
              <input type="checkbox" checked={filters.isFeatured === 'true'}
                onChange={() => updateFilter('isFeatured', 'true')} />
              <span>⭐ Featured</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" checked={filters.isNewArrival === 'true'}
                onChange={() => updateFilter('isNewArrival', 'true')} />
              <span>🆕 New Arrivals</span>
            </label>
          </FilterSection>
        </aside>

        {/* ── MAIN ── */}
        <main className="products-main">

          {/* Toolbar */}
          <div className="products-toolbar">
            <div className="toolbar-left">
              <button className="filter-toggle-btn" onClick={() => setSidebarOpen(true)}>
                <FaFilter size={13} /> Filters
                {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
              </button>
              {activeCat ? (
                <span className="results-count">
                  {loading ? 'Loading…' : `${pagination.total} products in ${activeCat}`}
                </span>
              ) : (
                <span className="results-count">All Categories</span>
              )}
            </div>
            <div className="toolbar-right">
              <label className="sort-label">Sort by</label>
              <select value={filters.sort}
                onChange={e => setFilters(p => ({ ...p, sort: e.target.value }))}
                className="sort-select">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active filter tags */}
          {activeFiltersCount > 0 && (
            <div className="active-filters">
              {filters.brand && <span className="filter-tag">{filters.brand}<button onClick={() => updateFilter('brand', '')}>×</button></span>}
              {filters.rating && <span className="filter-tag">{filters.rating}★+<button onClick={() => updateFilter('rating', '')}>×</button></span>}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="filter-tag">
                  ₹{filters.minPrice||'0'} – ₹{filters.maxPrice||'∞'}
                  <button onClick={() => setFilters(p => ({ ...p, minPrice: '', maxPrice: '' }))}>×</button>
                </span>
              )}
              <button className="clear-all-tag" onClick={clearFilters}>Clear all</button>
            </div>
          )}

          {/* ════ BROWSE MODE: grouped by category ════ */}
          {isBrowseMode ? (
            catLoading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : (
              <div className="browse-sections">
                {CATEGORIES.map(cat => {
                  const items = catProducts[cat.slug] || [];
                  if (!items.length) return null;
                  return (
                    <section key={cat.slug} className="browse-section">
                      <div className="browse-section-header">
                        <h2 className="browse-section-title">{cat.name}</h2>
                        <Link
                          to={`/products?category=${encodeURIComponent(cat.slug)}`}
                          className="browse-view-all"
                          onClick={() => setFilters(p => ({ ...p, category: cat.slug }))}
                        >
                          View All <FaArrowRight size={11} />
                        </Link>
                      </div>
                      <div className="browse-products-row">
                        {items.map(product => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )
          ) : (
            /* ════ FILTERED MODE: normal grid ════ */
            <>
              {/* breadcrumb when category selected */}
              {activeCat && (
                <div className="cat-breadcrumb">
                  <button onClick={() => updateFilter('category', '')}>← All Categories</button>
                  <span>/</span>
                  <span>{activeCat}</span>
                </div>
              )}

              {loading ? (
                <div className="page-loader"><div className="spinner" /><p>Loading…</p></div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">🔍</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters</p>
                  <button className="btn btn-primary" onClick={clearFilters} style={{ marginTop: 16 }}>Clear Filters</button>
                </div>
              ) : (
                <div className="products-grid-main">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && pagination.pages > 1 && (
                <div className="pagination">
                  <button onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={filters.page === 1}>←</button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={filters.page === p ? 'active' : ''}
                      onClick={() => setFilters(prev => ({ ...prev, page: p }))}>{p}</button>
                  ))}
                  <button onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} disabled={filters.page === pagination.pages}>→</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
