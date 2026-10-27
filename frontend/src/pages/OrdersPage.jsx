import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Eye, Clock } from 'lucide-react';
import API from '../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/myorders')
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your orders history...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 80px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 }}>
            Order History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Track previous purchases, receipts and delivery updates
          </p>
        </div>
        <Link to="/shop" className="btn btn-secondary">
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
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
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Package size={30} color="var(--text-muted)" />
          </div>
          <h3>You haven't placed any orders yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
            When you purchase items, your orders and tracking information will appear right here.
          </p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '10px' }}>
            Browse Latest Products
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '1.05rem', color: '#fff' }}>
                    #{order._id.substring(0, 10).toUpperCase()}
                  </strong>
                  <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>
                    {order.isPaid ? 'PAID' : 'PENDING'}
                  </span>
                  <span className="badge badge-primary">
                    {order.orderStatus}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems?.length} item(s)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</span>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
                    ₹{order.totalPrice?.toLocaleString("en-IN")}
                  </h4>
                </div>

                <Link to={`/orders/${order._id}`} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                  View Invoice & Tracking <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
