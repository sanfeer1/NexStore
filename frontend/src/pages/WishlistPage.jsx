import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 80px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 }}>
            Saved Wishlist ({wishlist.length})
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Products you have bookmarked for later purchase
          </p>
        </div>
        <Link to="/shop" className="btn btn-secondary">
          Explore More Products
        </Link>
      </div>

      {wishlist.length === 0 ? (
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
            background: 'rgba(236, 72, 153, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ec4899',
          }}>
            <Heart size={30} />
          </div>
          <h3>Your wishlist is currently empty</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
            Browse through our shop and click the heart icon on any product to save it here.
          </p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '10px' }}>
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid-products">
          {wishlist.map((product) => (
            <ProductCard key={product._id || product.product} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
