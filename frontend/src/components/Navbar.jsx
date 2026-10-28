import React from 'react';
import { Activity, LogOut, UserPlus, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ currentView, setView, onOpenCreateUser }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={() => setView('home')}>
          <div className="brand-icon">
            <Activity size={24} />
          </div>
          <div>
            <span className="brand-title">HealthPulse</span>
            <span className="brand-subtitle">User & Staff Directory Portal</span>
          </div>
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <button
                className={`btn ${currentView === 'home' ? 'btn-secondary' : 'btn-secondary'}`}
                onClick={() => setView('home')}
                style={{
                  background: currentView === 'home' ? 'rgba(6, 182, 212, 0.15)' : undefined,
                  borderColor: currentView === 'home' ? 'var(--primary)' : undefined,
                }}
              >
                <Users size={16} /> Directory
              </button>

              <button className="btn btn-primary" onClick={onOpenCreateUser}>
                <UserPlus size={16} /> Add User
              </button>

              <div className="user-badge">
                <div className="user-avatar-sm">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name-text">{currentUser?.name}</span>
              </div>

              <button
                className="btn btn-secondary btn-icon-only"
                onClick={logout}
                title="Log out"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn ${currentView === 'login' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setView('login')}
              >
                Login
              </button>
              <button
                className={`btn ${currentView === 'signup' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setView('signup')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
