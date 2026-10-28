import React, { useState } from 'react';
import { X, Lock, User, Phone, Calendar, Key, AlertCircle } from 'lucide-react';

export const UpdateUserModal = ({ user, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age !== null && user?.age !== undefined ? user.age : '',
    mobilenumber: user?.mobilenumber || '',
    password: '', // REQUIRED password confirmation from whiteboard
    newPassword: '', // optional new password
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError('Password is required to confirm and authorize updates.');
      return;
    }

    if (!formData.mobilenumber || !/^\d{10}$/.test(formData.mobilenumber.trim())) {
      setError('Mobile number must be exactly 10 digits (e.g., 9876543210).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onUpdateSuccess(user._id, {
        password: formData.password,
        name: formData.name.trim(),
        age: formData.age === '' ? null : formData.age,
        mobilenumber: formData.mobilenumber.trim(),
        newPassword: formData.newPassword || undefined,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update user details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <User size={20} className="text-primary" />
            <span>Update User: {user.name}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger)',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* User Email (Read Only) */}
          <div className="form-group">
            <label className="form-label">Email Address (Fixed)</label>
            <input
              type="text"
              className="form-input no-icon"
              value={user.email}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              Full Name <span className="req">*</span>
            </label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Dr. John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Age & Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Age</label>
              <div className="input-wrapper">
                <Calendar className="input-icon" size={18} />
                <input
                  type="number"
                  name="age"
                  min="0"
                  max="130"
                  className="form-input"
                  placeholder="35"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input
                  type="tel"
                  name="mobilenumber"
                  className="form-input"
                  placeholder="10-digit number (e.g. 9876543210)"
                  maxLength="10"
                  pattern="\d{10}"
                  value={formData.mobilenumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Optional New Password */}
          <div className="form-group">
            <label className="form-label">New Password (Optional)</label>
            <div className="input-wrapper">
              <Key className="input-icon" size={18} />
              <input
                type="password"
                name="newPassword"
                className="form-input"
                placeholder="Leave blank to keep current password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Whiteboard Requirement: Ask Password & Match */}
          <div
            style={{
              padding: '1rem',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid var(--border-glow)',
              borderRadius: 'var(--radius-md)',
              margin: '1.25rem 0',
            }}
          >
            <label className="form-label" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Security Verification Password <span className="req">*</span>
            </label>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Confirm your password to authorize this modification.
            </p>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} style={{ color: 'var(--primary)' }} />
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter password to match"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Verifying & Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
