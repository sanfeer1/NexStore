import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const CheckoutPage = () => {
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    discountAmount,
    discountPercent,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  // Address fields
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '100 Innovation Avenue');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Bengaluru');
  const [state, setState] = useState(user?.addresses?.[0]?.state || 'Karnataka');
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || '560001');
  const [country, setCountry] = useState(user?.addresses?.[0]?.country || 'India');
  const [phone, setPhone] = useState('9876543210');

  // Payment method: 'Razorpay' (Online) or 'COD' (Cash on Delivery)
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Your Bag is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Add items to your bag before proceeding to checkout.
        </p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Browse Catalog
        </Link>
      </div>
    );
  }

  // Handle Razorpay Payment flow
  const handleRazorpayPayment = async (orderId) => {
    try {
      // 1. Ask backend to create a Razorpay order
      const { data: rzpData } = await API.post('/payment/razorpay/create-order', { orderId });

      if (!rzpData.success || !rzpData.razorpayOrder) {
        throw new Error('Could not initialize Razorpay order. Please try again.');
      }

      // Check if Razorpay script is loaded in window
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const options = {
        key: rzpData.keyId,
        amount: rzpData.razorpayOrder.amount,
        currency: rzpData.razorpayOrder.currency,
        name: 'NexStore E-Commerce',
        description: `Order #${orderId.substring(0, 8).toUpperCase()}`,
        order_id: rzpData.razorpayOrder.id,
        handler: async function (response) {
          try {
            setLoading(true);
            // 2. Cryptographic signature verification on backend
            const verifyRes = await API.post('/payment/razorpay/verify', {
              orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              isMock: rzpData.isMock,
            });

            if (verifyRes.data.success) {
              clearCart();
              navigate(`/orders/${orderId}`);
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: phone || '',
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment was cancelled. You can retry payment anytime.');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error?.description || 'Transaction declined'}`);
        setLoading(false);
      });
      razorpayInstance.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment initiation failed');
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!street || !city || !state || !postalCode) {
      setError('Please fill in complete shipping address details');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order in MongoDB
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street,
          city,
          state,
          postalCode,
          country,
          phone,
        },
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const { data } = await API.post('/orders', orderPayload);

      if (data.success && data.order) {
        if (paymentMethod === 'Razorpay') {
          // Launch Razorpay Payment Gateway popup
          await handleRazorpayPayment(data.order._id);
        } else {
          // COD (Cash on Delivery)
          clearCart();
          navigate(`/orders/${data.order._id}`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 80px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '28px' }}>
        Secure Checkout
      </h1>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          marginBottom: '24px',
        }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'start',
      }}>
        {/* Left Column: Shipping & Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Shipping Address Section */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Truck size={20} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>1. Shipping Address</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    State / Province
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <CreditCard size={20} color="var(--accent-secondary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>2. Payment Selection</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '10px' }}>
              {/* Option 1: Razorpay (Online Gateway) */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: paymentMethod === 'Razorpay' ? 'rgba(99, 102, 241, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'Razorpay' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '0.98rem' }}>Online Payment (Razorpay)</strong>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>POPULAR</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, Netbanking & Wallets
                  </p>
                </div>
              </label>

              {/* Option 2: Cash on Delivery */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: paymentMethod === 'COD' ? 'rgba(99, 102, 241, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'COD' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                />
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.98rem' }}>Cash on Delivery (COD)</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Pay via cash or UPI upon package arrival at your doorstep
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="glass-panel" style={{ padding: '28px', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
            Order Summary ({cartItems.length} items)
          </h3>

          {/* Item previews */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '260px',
            overflowY: 'auto',
            marginBottom: '20px',
            paddingRight: '6px',
          }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </h5>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                </div>
                <strong style={{ fontSize: '0.88rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items Subtotal</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                <span>Coupon Savings ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated Shipping</span>
              <span>{shippingPrice === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Taxes & Duties (5%)</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '12px',
              marginTop: '6px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#fff',
            }}>
              <span>Total Payable</span>
              <span style={{ color: '#34d399' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '24px' }}
          >
            {loading ? 'Processing...' : (
              paymentMethod === 'Razorpay'
                ? `Pay with Razorpay ($${totalPrice.toFixed(2)})`
                : `Place COD Order ($${totalPrice.toFixed(2)})`
            )}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}>
            <ShieldCheck size={16} color="var(--success)" />
            Razorpay 256-bit encrypted secure payment
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
