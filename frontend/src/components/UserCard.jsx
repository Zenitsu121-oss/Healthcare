import React from 'react';
import { Eye, Edit3, Trash2, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';

export const UserCard = ({
  user,
  currentUserId,
  onView,
  onUpdate,
  onDelete,
}) => {
  const isCurrentUser = currentUserId && user._id === currentUserId;

  return (
    <div className={`glass-panel user-card ${isCurrentUser ? 'is-current-user' : ''}`}>
      <div className="user-card-header">
        <div className="user-avatar-lg">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="user-header-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <h3 className="user-name" title={user.name}>
              {user.name}
            </h3>
            {isCurrentUser && (
              <span className="badge badge-self" title="Currently logged in user">
                <ShieldCheck size={12} /> You
              </span>
            )}
          </div>
          <p className="user-email-text" title={user.email}>
            {user.email}
          </p>
        </div>
      </div>

      <div className="user-details-list">
        <div className="user-detail-row">
          <Mail size={14} style={{ color: 'var(--primary)' }} />
          <span>{user.email}</span>
        </div>
        <div className="user-detail-row">
          <Phone size={14} style={{ color: 'var(--secondary)' }} />
          <span>{user.mobilenumber || 'No phone recorded'}</span>
        </div>
        <div className="user-detail-row">
          <Calendar size={14} style={{ color: 'var(--success)' }} />
          <span>{user.age !== null && user.age !== undefined ? `${user.age} yrs` : 'Age: N/A'}</span>
        </div>
      </div>

      <div className="user-actions">
        {/* View Details Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onView(user)}
          title="View individual details page"
        >
          <Eye size={14} /> Details
        </button>

        {/* Update Button */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onUpdate(user)}
          title="Update user details"
        >
          <Edit3 size={14} /> Update
        </button>

        {/* Delete Button (Whiteboard: Prevent from deleting own data) */}
        {isCurrentUser ? (
          <button
            className="btn btn-secondary btn-sm"
            disabled
            title="Self-deletion prohibited: Cannot delete own account"
            style={{ opacity: 0.4, cursor: 'not-allowed', marginLeft: 'auto' }}
          >
            <Trash2 size={14} /> Delete
          </button>
        ) : (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(user)}
            title="Delete this user"
            style={{ marginLeft: 'auto' }}
          >
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
