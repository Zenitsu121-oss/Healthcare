import React, { useState } from 'react';
import { X, AlertTriangle, Lock, ShieldAlert, Trash2 } from 'lucide-react';

export const DeleteUserModal = ({ user, currentUserId, onClose, onDeleteSuccess }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const isSelf = currentUserId && user._id === currentUserId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError('Password is required to confirm account deletion.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onDeleteSuccess(user._id, password);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: 'var(--danger)' }}>
            <AlertTriangle size={22} />
            <span>{isSelf ? 'Delete Your Account' : 'Confirm User Deletion'}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {isSelf && (
          <div
            style={{
              padding: '1rem',
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}
          >
            <ShieldAlert size={22} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            <div>
              <h4 style={{ color: '#fca5a5', marginBottom: '0.25rem' }}>Warning: Self-Account Deletion</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                You are about to permanently delete your own profile (<strong>{user.email}</strong>).
                Once deleted, you will be logged out automatically.
              </p>
            </div>
          </div>
        )}

        <div>
          {!isSelf && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Are you sure you want to permanently delete user{' '}
              <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong> ({user.email})?
              This action cannot be undone.
            </p>
          )}

          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-md)',
                color: '#fca5a5',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Ask Password & Match */}
            <div
              style={{
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
              }}
            >
              <label className="form-label" style={{ color: '#f87171', fontWeight: 700 }}>
                Enter Your Password to Confirm <span className="req">*</span>
              </label>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Provide your password to verify and authorize this permanent deletion.
              </p>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} style={{ color: '#f87171' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-danger" disabled={loading}>
                <Trash2 size={16} />
                {loading ? 'Verifying & Deleting...' : isSelf ? 'Delete My Account' : 'Confirm & Delete User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
