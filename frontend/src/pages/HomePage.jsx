import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  UserCheck,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  Hash,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import UserCard from '../components/UserCard';
import ViewUserDetailsModal from '../components/ViewUserDetailsModal';
import UpdateUserModal from '../components/UpdateUserModal';
import DeleteUserModal from '../components/DeleteUserModal';
import CreateUserModal from '../components/CreateUserModal';

export const HomePage = ({ notify }) => {
  const { currentUser, refreshUser, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active Modals state
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [selectedUserToUpdate, setSelectedUserToUpdate] = useState(null);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch users list
  const fetchUsers = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getAllUsers(search);
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchQuery);
  }, [searchQuery]);

  // Handle User Update Success
  const handleUpdateSuccess = async (id, payload) => {
    const res = await api.updateUser(id, payload);
    notify(res.message || 'User updated successfully!', 'success');
    // Refresh user list
    fetchUsers(searchQuery);
    // If the updated user is the current logged-in user, refresh profile
    if (currentUser && currentUser._id === id) {
      refreshUser();
    }
  };

  // Handle User Delete Success (including self-deletion)
  const handleDeleteSuccess = async (id, password) => {
    const res = await api.deleteUser(id, password);
    notify(res.message || 'User deleted successfully', 'success');
    if ((currentUser && currentUser._id === id) || res.isSelfDeleted) {
      setTimeout(() => {
        logout();
      }, 800);
    } else {
      fetchUsers(searchQuery);
    }
  };

  // Handle User Creation Success
  const handleCreateSuccess = (newUser) => {
    notify(`User '${newUser.name}' created successfully!`, 'success');
    fetchUsers(searchQuery);
  };

  // Calculate statistics
  const totalCount = users.length;
  const usersWithAge = users.filter((u) => u.age !== null && u.age !== undefined && u.age > 0);
  const averageAge =
    usersWithAge.length > 0
      ? Math.round(usersWithAge.reduce((acc, curr) => acc + Number(curr.age), 0) / usersWithAge.length)
      : 'N/A';

  return (
    <div className="main-content">
      {/* Top Banner / Hero Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={14} /> Healthcare Directory Management
          </div>
          <h1 style={{ fontSize: '2.1rem', marginBottom: '0.35rem' }}>
            Staff & User Registry
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage medical practitioners, staff credentials, and identity records securely.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={() => fetchUsers(searchQuery)}
            title="Refresh list"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle size={16} /> New User
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{totalCount}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--secondary)' }}>
            <Hash size={24} />
          </div>
          <div>
            <div className="stat-value">{averageAge}</div>
            <div className="stat-label">Average Age</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.name || 'Active'}
            </div>
            <div className="stat-label">Current Session</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '1.1rem', color: '#f87171' }}>
              Self-Delete Blocked
            </div>
            <div className="stat-label">Security Guard</div>
          </div>
        </div>
      </div>

      {/* Search Bar Section (Whiteboard: Search option as well) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or mobile number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Showing <strong>{users.length}</strong> {users.length === 1 ? 'user' : 'users'}
          {searchQuery && (
            <span>
              {' '}
              matching &quot;<strong>{searchQuery}</strong>&quot;
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: '1rem',
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-md)',
            color: '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton or User Grid */}
      {loading && users.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <RefreshCw size={36} className="spin" style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
          <h3>Loading healthcare directory...</h3>
        </div>
      ) : users.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <Users size={48} style={{ color: 'var(--text-dim)', margin: '0 auto 1rem' }} />
          <h3>No users found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {searchQuery
              ? `No user records matched "${searchQuery}". Try clearing your search.`
              : 'The user database is currently empty. Click "New User" to register a record.'}
          </p>
          {searchQuery && (
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '1rem' }}
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="user-grid">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              currentUserId={currentUser?._id}
              onView={(u) => setSelectedUserDetails(u)}
              onUpdate={(u) => setSelectedUserToUpdate(u)}
              onDelete={(u) => setSelectedUserToDelete(u)}
            />
          ))}
        </div>
      )}

      {/* View Individual Details Modal (Whiteboard: View individual details page) */}
      {selectedUserDetails && (
        <ViewUserDetailsModal
          user={selectedUserDetails}
          currentUserId={currentUser?._id}
          onClose={() => setSelectedUserDetails(null)}
          onOpenUpdate={(u) => setSelectedUserToUpdate(u)}
          onOpenDelete={(u) => setSelectedUserToDelete(u)}
        />
      )}

      {/* Update User Modal (Whiteboard: Update button & UI, Ask password & match) */}
      {selectedUserToUpdate && (
        <UpdateUserModal
          user={selectedUserToUpdate}
          onClose={() => setSelectedUserToUpdate(null)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Delete User Modal (Whiteboard: Delete button & UI, Ask password & match, Prevent from deleting own data) */}
      {selectedUserToDelete && (
        <DeleteUserModal
          user={selectedUserToDelete}
          currentUserId={currentUser?._id}
          onClose={() => setSelectedUserToDelete(null)}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}

      {/* Create User Modal (Whiteboard: User creation) */}
      {isCreateModalOpen && (
        <CreateUserModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default HomePage;
