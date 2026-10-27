import React, { useState } from 'react';
import { User, MapPin, Lock, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, addAddress, deleteAddress } = useAuth();

  // Profile details state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState({ text: '', isError: false });
  const [savingProfile, setSavingProfile] = useState(false);

  // New Address state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [addressMsg, setAddressMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ text: '', isError: false });

    try {
      const payload = { name, email };
      if (password) payload.password = password;
      const res = await updateProfile(payload);
      if (res.success) {
        setProfileMsg({ text: 'Profile updated successfully!', isError: false });
        setPassword('');
      }
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || 'Failed to update profile', isError: true });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !postalCode) return;

    try {
      await addAddress({ street, city, state, postalCode, country });
      setStreet('');
      setCity('');
      setState('');
      setPostalCode('');
      setShowAddressModal(false);
      setAddressMsg('New address saved!');
    } catch (err) {
      setAddressMsg(err.response?.data?.message || 'Failed to save address');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 80px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '28px' }}>
        My Account Settings
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'start',
      }}>
        {/* Profile Card & Edit Form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#fff',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user?.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user?.email}</p>
              <span className="badge badge-primary" style={{ marginTop: '4px' }}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>

          {profileMsg.text && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: profileMsg.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: profileMsg.isError ? '#f87171' : '#34d399',
              fontSize: '0.85rem',
              marginBottom: '20px',
            }}>
              {profileMsg.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="btn btn-primary"
              style={{ marginTop: '10px', padding: '12px' }}
            >
              {savingProfile ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Saved Shipping Addresses */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} color="var(--accent-secondary)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Saved Addresses</h3>
            </div>
            <button
              onClick={() => setShowAddressModal(!showAddressModal)}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <Plus size={14} /> Add Address
            </button>
          </div>

          {addressMsg && (
            <p style={{ fontSize: '0.85rem', color: '#10b981', marginBottom: '14px' }}>
              {addressMsg}
            </p>
          )}

          {/* Add Address Form Toggle */}
          {showAddressModal && (
            <form
              onSubmit={handleAddAddress}
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <input
                type="text"
                placeholder="Street address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '8px' }}>
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* List of addresses */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!user?.addresses || user.addresses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No shipping addresses saved yet.
              </p>
            ) : (
              user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{addr.street}</strong>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                    </p>
                    {addr.isDefault && (
                      <span className="badge badge-success" style={{ marginTop: '6px' }}>
                        Default Address
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteAddress(addr._id)}
                    style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                    title="Delete address"
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
