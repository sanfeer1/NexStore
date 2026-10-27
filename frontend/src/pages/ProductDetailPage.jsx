import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState('');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then((res) => {
        if (res.data.success) {
          setProduct(res.data.product);
          setActiveImage(res.data.product.images?.[0] || '');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setReviewSubmitting(true);
    setReviewFeedback('');
    try {
      const res = await API.post(`/products/${product._id}/reviews`, {
        rating: ratingInput,
        comment: commentInput,
      });

      if (res.data.success) {
        setProduct((prev) => ({
          ...prev,
          ratings: res.data.ratings,
          numReviews: res.data.numReviews,
          reviews: res.data.reviews,
        }));
        setCommentInput('');
        setReviewFeedback('Review posted successfully!');
      }
    } catch (err) {
      setReviewFeedback(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 80px 24px' }}>
      {/* Back button */}
      <Link
        to="/shop"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '28px',
        }}
      >
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      {/* Main Product Showcase */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '48px',
        marginBottom: '60px',
      }}>
        {/* Left Image Gallery */}
        <div>
          <div style={{
            width: '100%',
            height: 'clamp(280px, 45vw, 460px)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: '#0e1424',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px',
          }}>
            <img
              src={activeImage || product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: activeImage === img ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    opacity: activeImage === img ? 1 : 0.6,
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Details & Buying Options */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-primary">{product.category}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Brand: {product.brand}</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '16px',
          }}>
            {product.title}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.round(product.ratings || 5) ? '#f59e0b' : 'none'}
                  color="#f59e0b"
                />
              ))}
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {product.ratings ? product.ratings.toFixed(1) : '5.0'}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          {/* Pricing */}
          <div style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'baseline',
            gap: '16px',
          }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: '#fff',
            }}>
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="badge badge-danger">
                  Save ₹{(product.price - product.discountPrice).toLocaleString("en-IN")}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.98rem', marginBottom: '28px' }}>
            {product.description}
          </p>

          {/* Stock Indicator */}
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: isOutOfStock ? '#ef4444' : '#10b981',
              boxShadow: isOutOfStock ? '0 0 10px #ef4444' : '0 0 10px #10b981',
            }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isOutOfStock ? '#f87171' : '#34d399' }}>
              {isOutOfStock ? 'Currently Out of Stock' : `In Stock (${product.stock} units available)`}
            </span>
          </div>

          {/* Action Row: Quantity & Add to Cart */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {/* Quantity */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px 12px',
              gap: '12px',
            }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}
              >
                -
              </button>
              <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product, quantity)}
              disabled={isOutOfStock}
              className="btn btn-primary"
              style={{ flex: 1, minWidth: '180px', padding: '14px 24px', fontSize: '1rem' }}
            >
              <ShoppingBag size={20} /> Add to Bag
            </button>

            {/* Wishlist Toggle */}
            <button
              onClick={() => toggleWishlist(product)}
              className="btn btn-secondary"
              style={{ padding: '0 16px', color: isWishlisted ? '#ec4899' : 'inherit' }}
              title="Add to wishlist"
            >
              <Heart size={20} fill={isWishlisted ? '#ec4899' : 'none'} />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Truck size={18} color="var(--accent-primary)" /> Free express delivery over ₹1,499
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={18} color="var(--success)" /> Official 2-year manufacturer warranty
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <section className="glass-panel" style={{ padding: '40px', marginTop: '60px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '24px' }}>
          Customer Reviews & Ratings
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
        }}>
          {/* Review Submission Form */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '14px' }}>
              Share Your Experience
            </h4>

            {user ? (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Your Rating (1 to 5 Stars)
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingInput(star)}
                        style={{ color: '#f59e0b' }}
                      >
                        <Star size={24} fill={star <= ratingInput ? '#f59e0b' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Review Comment
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe product build quality, sound clarity, comfort..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    style={{ width: '100%', resize: 'vertical' }}
                    required
                  />
                </div>

                {reviewFeedback && (
                  <p style={{ fontSize: '0.85rem', color: '#10b981' }}>{reviewFeedback}</p>
                )}

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start' }}
                >
                  <Send size={16} /> {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div style={{
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                textAlign: 'center',
              }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Please sign in to your verified account to leave a customer review.
                </p>
                <Link to="/login" className="btn btn-secondary">
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>

          {/* Past Reviews List */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '14px' }}>
              Verified Buyer Feedback ({product.reviews?.length || 0})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
              {!product.reviews || product.reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No customer reviews yet. Be the first to share your thoughts!</p>
              ) : (
                product.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '0.92rem' }}>{rev.name}</strong>
                      <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < rev.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
