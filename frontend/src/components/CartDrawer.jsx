import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    discountAmount,
    discountPercent,
    applyCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState({ text: '', isError: false });
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMessage({ text: res.message, isError: !res.success });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer Panel */}
      <aside
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: 'rgba(15, 23, 42, 0.96)',
          borderLeft: '1px solid var(--border-subtle)',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 101,
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Your Bag</h3>
            <span className="badge badge-primary">{cartItems.length} items</span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="btn-icon"
            style={{ width: '36px', height: '36px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              gap: '16px',
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShoppingBag size={32} color="var(--text-muted)" />
              </div>
              <h4>Your shopping bag is empty</h4>
              <p style={{ fontSize: '0.85rem', maxWidth: '240px' }}>
                Discover our curated tech, audio and lifestyle selection.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="btn btn-primary"
                style={{ marginTop: '10px' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                  alt={item.title}
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                  }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <h5 style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {item.title}
                    </h5>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                      title="Remove item"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>

                    {/* Quantity Selector */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255, 255, 255, 0.07)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '2px 8px',
                    }}>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '18px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(11, 15, 25, 0.95)',
          }}>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Promo code (try NEX10)"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                style={{ flex: 1, height: '38px', fontSize: '0.82rem', textTransform: 'uppercase' }}
              />
              <button className="btn btn-secondary" style={{ padding: '0 12px', height: '38px', fontSize: '0.82rem' }}>
                <Tag size={14} /> Apply
              </button>
            </form>

            {couponMessage.text && (
              <p style={{
                fontSize: '0.78rem',
                color: couponMessage.isError ? '#ef4444' : '#10b981',
                marginBottom: '10px',
              }}>
                {couponMessage.text}
              </p>
            )}

            {/* Price Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{itemsPrice.toLocaleString("en-IN")}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `₹${shippingPrice.toLocaleString("en-IN")}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax (5%)</span>
                <span>₹{taxPrice.toLocaleString("en-IN")}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fff',
              }}>
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              Checkout Now <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
