import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, newRes, catRes] = await Promise.all([
          API.get('/products/featured'),
          API.get('/products/new-arrivals'),
          API.get('/categories'),
        ]);

        if (featRes.data.success) setFeaturedProducts(featRes.data.products);
        if (newRes.data.success) setNewArrivals(newRes.data.products);
        if (catRes.data.success) setCategories(catRes.data.categories);
      } catch (err) {
        console.error('Failed to fetch home page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '80px 0 60px 0',
        overflow: 'hidden',
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '50px',
          alignItems: 'center',
        }}>
          {/* Hero Left Content */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '20px',
            }}>
              <Sparkles size={16} /> 2026 NEXT-GEN COLLECTION
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1px',
              marginBottom: '24px',
            }}>
              Engineered for Sound. <br />
              <span style={{
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Designed for Life.
              </span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '520px',
              marginBottom: '32px',
            }}>
              Immerse yourself in precision audio, high-performance computing, and timeless lifestyle design crafted for the discerning modern creator.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Shop Full Catalog <ArrowRight size={18} />
              </Link>
              <Link to="/shop?category=Audio" className="btn btn-secondary" style={{ padding: '14px 24px', fontSize: '1rem' }}>
                Explore Audio Gear
              </Link>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'flex',
              gap: '36px',
              marginTop: '40px',
              paddingTop: '30px',
              borderTop: '1px solid var(--border-subtle)',
            }}>
              <div>
                <h4 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>50K+</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Satisfied Customers</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>4.9/5</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Average Product Rating</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>Fast & Free</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Express Global Delivery</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-highlight)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Featured Product"
                style={{ width: '100%', height: '480px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '4px' }}>Top Pick</span>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700 }}>AeroSound Pro ANC</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Studio Acoustic Master</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>$199.99</div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>$249.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills & Highlights */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '24px',
          }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700 }}>
                Curated Categories
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Browse by premium departments
              </p>
            </div>
            <Link to="/shop" style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem' }}>
              View All Categories →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px',
          }}>
            {categories.map((cat) => (
              <Link
                key={cat._id || cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '12px',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--border-highlight)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.05)',
                }}>
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200'}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{cat.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '30px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                <TrendingUp size={16} /> POPULAR NOW
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700 }}>
                Trending Products
              </h2>
            </div>
            <Link to="/shop" className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
              Explore All
            </Link>
          </div>

          <div className="grid-products">
            {featuredProducts.length > 0
              ? featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass-panel" style={{ height: '360px', opacity: 0.4 }} />
                ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '50px 40px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(236, 72, 153, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            <span className="badge badge-primary">LIMITED PROMOTION</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, maxWidth: '600px' }}>
              Get 20% Off Your Entire Cart
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '1rem' }}>
              Apply coupon code <code style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>SAVE20</code> during checkout for instant savings.
            </p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: '10px', padding: '12px 28px' }}>
              Claim Discount Now <Zap size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '30px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ec4899', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                <Sparkles size={16} /> FRESH DROPS
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700 }}>
                New Arrivals
              </h2>
            </div>
            <Link to="/shop?sort=newest" className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
              View Recent Additions
            </Link>
          </div>

          <div className="grid-products">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
