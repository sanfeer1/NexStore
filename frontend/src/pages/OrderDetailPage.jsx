import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowLeft, Clock } from 'lucide-react';
import API from '../services/api';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then((res) => {
        if (res.data.success) {
          setOrder(res.data.order);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch order details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading order receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>{error || 'Order Not Found'}</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to My Orders
        </Link>
      </div>
    );
  }

  const steps = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.orderStatus);

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 80px 24px' }}>
      <Link
        to="/orders"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '24px',
        }}
      >
        <ArrowLeft size={16} /> Back to Orders History
      </Link>

      {/* Header with Success Alert */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--success)',
          }}>
            <CheckCircle2 size={30} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700 }}>
              Order #{order._id.substring(0, 10).toUpperCase()}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            {order.isPaid ? 'PAID & CONFIRMED' : 'PAYMENT PENDING'}
          </span>
          <span className="badge badge-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            STATUS: {order.orderStatus.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Delivery Tracking Stepper */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>
          Shipment Progress
        </h3>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
        }}>
          {/* Progress bar line */}
          <div style={{
            position: 'absolute',
            top: '18px',
            left: '30px',
            right: '30px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1,
          }}>
            <div style={{
              width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
              height: '100%',
              background: 'var(--accent-gradient)',
              transition: 'width 0.4s ease',
            }} />
          </div>

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            return (
              <div
                key={step}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 2,
                  gap: '8px',
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: isCompleted ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  border: isCompleted ? '2px solid #818cf8' : '2px solid var(--border-subtle)',
                }}>
                  {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                </div>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: isCompleted ? 700 : 500,
                  color: isCompleted ? '#fff' : 'var(--text-muted)',
                }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
      }}>
        {/* Purchased Items */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>
            Purchased Items ({order.orderItems?.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {order.orderItems?.map((item) => (
              <div
                key={item._id || item.product}
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <Link to={`/products/${item.product}`}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {item.title}
                    </h5>
                  </Link>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    ₹{item.price?.toLocaleString("en-IN")} × {item.quantity}
                  </p>
                </div>
                <strong style={{ fontSize: '1rem', color: '#fff' }}>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Financial Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Shipping Destination */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color="var(--accent-secondary)" /> Delivery Destination
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country}
            </p>
          </div>

          {/* Payment & Invoice Breakdown */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
              Financial Breakdown
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{order.itemsPrice?.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>₹{order.shippingPrice?.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Taxes</span>
                <span>₹{order.taxPrice?.toLocaleString("en-IN")}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#fff',
              }}>
                <span>Total Paid</span>
                <span style={{ color: '#34d399' }}>₹{order.totalPrice?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
