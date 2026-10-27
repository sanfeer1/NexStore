import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Headphones, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(8, 11, 18, 0.95)',
      borderTop: '1px solid var(--border-subtle)',
      marginTop: '80px',
      paddingTop: '60px',
      paddingBottom: '30px',
    }}>
      <div className="container">
        {/* Features / Value Props Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '30px',
          paddingBottom: '50px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
            }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Express Delivery</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Free shipping on orders over $150</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success)',
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Secure Checkout</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>256-Bit SSL encrypted payments</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(236, 72, 153, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ec4899',
            }}>
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>30-Day Returns</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Hassle-free money-back guarantee</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-secondary)',
            }}>
              <Headphones size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>24/7 VIP Support</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Dedicated customer concierge</p>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          padding: '50px 0',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
              }}>
                N
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>
                NexStore
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              Next-generation marketplace for premium personal technology, studio acoustics, and precision-engineered lifestyle accessories.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.5px' }}>
              CATEGORIES
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/shop?category=Electronics">Electronics & Computing</Link></li>
              <li><Link to="/shop?category=Audio">Studio & Hi-Fi Audio</Link></li>
              <li><Link to="/shop?category=Wearables">Smart Wearables</Link></li>
              <li><Link to="/shop?category=Footwear">Athletic Footwear</Link></li>
              <li><Link to="/shop?category=Smart Home">Smart Home Living</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.5px' }}>
              CUSTOMER SERVICE
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/profile">Manage Account</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              <li><a href="#help">Shipping & Returns</a></li>
              <li><a href="#privacy">Privacy Policy & Terms</a></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.5px' }}>
              EXCLUSIVE OFFERS
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Subscribe to unlock 10% off your first luxury order.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{ flex: 1, height: '40px', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.05)' }}
              />
              <button className="btn btn-primary" style={{ padding: '0 16px', height: '40px' }}>
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
        }}>
          <p>© {new Date().getFullYear()} NexStore Inc. Built with MERN Stack. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Security Verified</span>
            <span>PCI-DSS Compliant</span>
            <span>Stripe Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
