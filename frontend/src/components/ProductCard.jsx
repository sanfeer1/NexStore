import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const id = product._id || product.product;
  const isWishlisted = isInWishlist(id);
  const isOutOfStock = product.stock <= 0;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const imageSrc = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80';

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
        borderRadius: 'var(--radius-lg)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'var(--border-highlight)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Product Image & Badges */}
      <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden', background: '#0e1424' }}>
        <Link to={`/products/${product.slug || id}`}>
          <img
            src={imageSrc}
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform var(--transition-slow)',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1.0)')}
          />
        </Link>

        {/* Top Floating Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {hasDiscount && (
            <span className="badge badge-danger">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="badge badge-primary">
              NEW
            </span>
          )}
          {isOutOfStock && (
            <span className="badge badge-warning">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={() => toggleWishlist(product)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(11, 15, 25, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            color: isWishlisted ? '#ec4899' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={isWishlisted ? '#ec4899' : 'none'} />
        </button>
      </div>

      {/* Product Info Content */}
      <div style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {product.category}
            </span>

            {/* Rating Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#f59e0b', fontWeight: 600 }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>{product.ratings ? product.ratings.toFixed(1) : '5.0'}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                ({product.numReviews || 0})
              </span>
            </div>
          </div>

          <Link to={`/products/${product.slug || id}`}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.4,
              color: 'var(--text-main)',
              marginBottom: '10px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.8rem',
            }}>
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '14px',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                ${displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.72rem', color: isOutOfStock ? '#ef4444' : '#10b981', fontWeight: 500 }}>
              {isOutOfStock ? 'Sold out' : 'In Stock'}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className="btn btn-primary"
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-md)',
              opacity: isOutOfStock ? 0.5 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            }}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingBag size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
