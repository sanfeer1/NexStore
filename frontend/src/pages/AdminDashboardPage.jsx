import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Truck,
  Eye,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // New product form state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDiscountPrice, setNewDiscountPrice] = useState('');
  const [newStock, setNewStock] = useState('15');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newBrand, setNewBrand] = useState('Apex');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [formMsg, setFormMsg] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        API.get('/orders'),
        API.get('/products?limit=50'),
        API.get('/categories'),
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders);
        setTotalRevenue(ordersRes.data.totalRevenue || 0);
      }
      if (productsRes.data.success) {
        setProducts(productsRes.data.products);
      }
      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Administrator permissions are required to access this dashboard.
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Return to Storefront
        </Link>
      </div>
    );
  }

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // Handle Create Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFormMsg('');

    try {
      const res = await API.post('/products', {
        title: newTitle,
        description: newDescription,
        price: Number(newPrice),
        discountPrice: Number(newDiscountPrice) || 0,
        stock: Number(newStock),
        category: newCategory,
        brand: newBrand,
        images: newImageUrl ? [newImageUrl] : [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        ],
      });

      if (res.data.success) {
        setProducts([res.data.product, ...products]);
        setShowAddProductModal(false);
        setNewTitle('');
        setNewDescription('');
        setNewPrice('');
        setNewDiscountPrice('');
        setNewImageUrl('');
      }
    } catch (err) {
      setFormMsg(err.response?.data?.message || 'Failed to create product');
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 80px 24px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '6px' }}>ADMIN CONSOLE</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800 }}>
            Store Management
          </h1>
        </div>

        <button
          onClick={() => setShowAddProductModal(true)}
          className="btn btn-primary"
          style={{ padding: '12px 20px' }}
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#10b981' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Revenue</span>
            <DollarSign size={22} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#34d399' }}>Live confirmed orders</span>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#818cf8' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Orders</span>
            <ShoppingBag size={22} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
            {orders.length}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Customer transactions</span>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#f59e0b' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Catalog</span>
            <Package size={22} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
            {products.length}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Listed products in stock</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '24px',
      }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '12px 20px',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: activeTab === 'orders' ? '#818cf8' : 'var(--text-secondary)',
            borderBottom: activeTab === 'orders' ? '2px solid #818cf8' : '2px solid transparent',
          }}
        >
          Customer Orders Fulfillment ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '12px 20px',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: activeTab === 'products' ? '#818cf8' : 'var(--text-secondary)',
            borderBottom: activeTab === 'products' ? '2px solid #818cf8' : '2px solid transparent',
          }}
        >
          Product Catalog Inventory ({products.length})
        </button>
      </div>

      {/* Orders Management View */}
      {activeTab === 'orders' && (
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Order ID</th>
                <th style={{ padding: '12px' }}>Customer</th>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Payment</th>
                <th style={{ padding: '12px' }}>Fulfillment Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No customer orders received yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>
                      #{o._id.substring(0, 8).toUpperCase()}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <strong>{o.user?.name || 'Customer'}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.user?.email}</div>
                    </td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 12px', fontWeight: 700, color: '#fff' }}>
                      ₹{o.totalPrice?.toLocaleString("en-IN")}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={`badge ${o.isPaid ? 'badge-success' : 'badge-warning'}`}>
                        {o.isPaid ? 'PAID' : 'PENDING'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.08)',
                          fontSize: '0.82rem',
                          color: '#fff',
                        }}
                      >
                        <option value="Processing" style={{ background: '#111827' }}>Processing</option>
                        <option value="Confirmed" style={{ background: '#111827' }}>Confirmed</option>
                        <option value="Shipped" style={{ background: '#111827' }}>Shipped</option>
                        <option value="Delivered" style={{ background: '#111827' }}>Delivered</option>
                        <option value="Cancelled" style={{ background: '#111827' }}>Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <Link to={`/orders/${o._id}`} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>
                        <Eye size={14} /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Products Inventory View */}
      {activeTab === 'products' && (
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Product</th>
                <th style={{ padding: '12px' }}>Category</th>
                <th style={{ padding: '12px' }}>Stock</th>
                <th style={{ padding: '12px' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                      alt=""
                      style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <strong style={{ maxWidth: '280px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.title}
                    </strong>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                    {p.category}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 700 }}>
                    ₹{p.price.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      style={{ color: '#f87171', padding: '6px' }}
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '560px',
            padding: '32px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
              Add Product to Inventory
            </h2>

            {formMsg && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '14px' }}>{formMsg}</p>
            )}

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Horizon Studio Monitors"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe specs, frequency response, materials..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="199.99"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Discount Price (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="159.99"
                    value={newDiscountPrice}
                    onChange={(e) => setNewDiscountPrice(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', background: '#111827' }}
                  >
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Inventory Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Image URL (Unsplash HD / Hosted CDN)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
                  Save & Publish Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '12px 20px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
