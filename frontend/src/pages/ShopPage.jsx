import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw, Search, Star } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Filters state from URL query
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const ratingParam = searchParams.get('rating') || '';
  const sortParam = searchParams.get('sortBy') || 'featured';
  const pageParam = Number(searchParams.get('page')) || 1;
  const inStockParam = searchParams.get('inStock') || 'false';

  // Fetch categories
  useEffect(() => {
    API.get('/categories')
      .then((res) => {
        if (res.data.success) setCategories(res.data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch filtered products
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (queryParam) params.set('q', queryParam);
    if (categoryParam && categoryParam !== 'all') params.set('category', categoryParam);
    if (minPriceParam) params.set('minPrice', minPriceParam);
    if (maxPriceParam) params.set('maxPrice', maxPriceParam);
    if (ratingParam) params.set('rating', ratingParam);
    if (sortParam) params.set('sortBy', sortParam);
    if (inStockParam === 'true') params.set('inStock', 'true');
    params.set('page', pageParam.toString());

    API.get(`/products?${params.toString()}`)
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.products);
          setTotal(res.data.total);
          setPages(res.data.pages);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === 'false') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    nextParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      {/* Top Header & Sort Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 }}>
            {categoryParam !== 'all' ? `${categoryParam}` : 'Explore All Products'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{products.length}</strong> of <strong>{total}</strong> curated items
          </p>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Sort by:</span>
          <select
            value={sortParam}
            onChange={(e) => updateParam('sortBy', e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.06)',
              fontSize: '0.88rem',
              color: '#fff',
            }}
          >
            <option value="featured" style={{ background: '#111827' }}>Featured First</option>
            <option value="price-asc" style={{ background: '#111827' }}>Price: Low to High</option>
            <option value="price-desc" style={{ background: '#111827' }}>Price: High to Low</option>
            <option value="rating" style={{ background: '#111827' }}>Top Rated</option>
            <option value="newest" style={{ background: '#111827' }}>Newest Arrivals</option>
          </select>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '32px',
        alignItems: 'start',
      }}>
        {/* Left Filter Sidebar */}
        <aside
          className="glass-panel"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <SlidersHorizontal size={18} color="var(--accent-primary)" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              style={{
                fontSize: '0.78rem',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Reset all filters"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Search within results */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Keyword Search
            </label>
            <div style={{ position: 'relative', marginTop: '8px' }}>
              <input
                type="text"
                placeholder="Search..."
                value={queryParam}
                onChange={(e) => updateParam('q', e.target.value)}
                style={{ width: '100%', fontSize: '0.88rem', padding: '8px 12px' }}
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>
              Category
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => updateParam('category', 'all')}
                style={{
                  textAlign: 'left',
                  fontSize: '0.88rem',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: categoryParam === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: categoryParam === 'all' ? '#818cf8' : 'var(--text-secondary)',
                  fontWeight: categoryParam === 'all' ? 700 : 400,
                }}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c._id || c.name}
                  onClick={() => updateParam('category', c.name)}
                  style={{
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: categoryParam.toLowerCase() === c.name.toLowerCase() ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    color: categoryParam.toLowerCase() === c.name.toLowerCase() ? '#818cf8' : 'var(--text-secondary)',
                    fontWeight: categoryParam.toLowerCase() === c.name.toLowerCase() ? 700 : 400,
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              Price Range (₹)
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Min"
                value={minPriceParam}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem', padding: '6px 8px' }}
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPriceParam}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem', padding: '6px 8px' }}
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              Minimum Rating
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => updateParam('rating', ratingParam === stars.toString() ? '' : stars.toString())}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: ratingParam === stars.toString() ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    color: ratingParam === stars.toString() ? '#fbbf24' : 'var(--text-secondary)',
                  }}
                >
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span>{stars} Stars & Above</span>
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="inStockCheck"
              checked={inStockParam === 'true'}
              onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : 'false')}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <label htmlFor="inStockCheck" style={{ fontSize: '0.88rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              In Stock Only
            </label>
          </div>
        </aside>

        {/* Right Products Content */}
        <div>
          {loading ? (
            <div className="grid-products">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-panel" style={{ height: '360px', opacity: 0.3 }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '60px 40px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Search size={40} color="var(--text-muted)" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>No products matched your criteria</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                Try adjusting your filters, clearing search keywords or price brackets.
              </p>
              <button onClick={resetFilters} className="btn btn-primary" style={{ marginTop: '10px' }}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid-products">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '50px',
                }}>
                  {Array.from({ length: pages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === pageParam;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateParam('page', pageNum.toString())}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          background: isActive ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          border: isActive ? 'none' : '1px solid var(--border-subtle)',
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
