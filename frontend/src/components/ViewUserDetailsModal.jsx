import React from 'react';
import { X, User, Mail, Phone, Calendar, Shield, Hash, Edit3, Trash2 } from 'lucide-react';

export const ViewUserDetailsModal = ({
  user,
  currentUserId,
  onClose,
  onOpenUpdate,
  onOpenDelete,
}) => {
  if (!user) return null;

  const isCurrentUser = currentUserId && user._id === currentUserId;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '560px' }}
      >
        <div className="modal-header">
          <div className="modal-title">
            <User size={22} className="text-primary" />
            <span>Healthcare Staff Profile</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1.25rem',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
          }}
        >
          <div
            className="user-avatar-lg"
            style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.35rem', margin: 0 }}>{user.name}</h3>
              {isCurrentUser && (
                <span className="badge badge-self">Current User</span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Detailed Attribute Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div
            style={{
              padding: '0.85rem 1rem',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              <Mail size={14} /> Email Address
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', wordBreak: 'break-all' }}>
              {user.email}
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem 1rem',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              <Phone size={14} /> Mobile Number
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {user.mobilenumber || 'Not Provided'}
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem 1rem',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              <Calendar size={14} /> Age
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {user.age !== null && user.age !== undefined ? `${user.age} years old` : 'Not specified'}
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem 1rem',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              <Shield size={14} /> Password Privacy
            </div>
            <div style={{ fontWeight: 600, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Protected (Excluded)
            </div>
          </div>
        </div>

        {/* Timestamp & Mongo ID */}
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hash size={14} /> System ID: <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{user._id}</span>
          </div>
          <div>Registered On: {formatDate(user.createdAt)}</div>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onOpenUpdate(user);
            }}
          >
            <Edit3 size={16} /> Edit Details
          </button>
          {!isCurrentUser ? (
            <button
              className="btn btn-danger"
              onClick={() => {
                onClose();
                onOpenDelete(user);
              }}
            >
              <Trash2 size={16} /> Delete User
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              disabled
              title="Prevented from deleting own data"
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              <Trash2 size={16} /> Self-Delete Prohibited
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetailsModal;
