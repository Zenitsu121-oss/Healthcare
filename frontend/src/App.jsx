import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreateUserModal from './components/CreateUserModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentView, setView] = useState('home');
  const [toasts, setToasts] = useState([]);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  // Toast notification helper
  const notify = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-main)',
          fontSize: '1.25rem',
          background: 'var(--bg-dark)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(6, 182, 212, 0.2)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p>Initializing Healthcare Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar
        currentView={currentView}
        setView={setView}
        onOpenCreateUser={() => setIsQuickCreateOpen(true)}
      />

      {isAuthenticated ? (
        <HomePage notify={notify} />
      ) : (
        <>
          {currentView === 'signup' ? (
            <SignupPage
              onNavigateToLogin={() => setView('login')}
              onSignupSuccess={() => {
                notify('Account created successfully! Welcome to HealthPulse.', 'success');
                setView('home');
              }}
            />
          ) : (
            <LoginPage
              onNavigateToSignup={() => setView('signup')}
              onLoginSuccess={() => {
                notify('Logged in successfully!', 'success');
                setView('home');
              }}
            />
          )}
        </>
      )}

      {/* Quick Add User Modal accessible from Navbar */}
      {isQuickCreateOpen && (
        <CreateUserModal
          onClose={() => setIsQuickCreateOpen(false)}
          onSuccess={(user) => {
            notify(`Staff member '${user.name}' registered successfully!`, 'success');
          }}
        />
      )}

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast-${t.type}`}
            onClick={() => removeToast(t.id)}
            style={{ cursor: 'pointer' }}
          >
            {t.type === 'success' && <CheckCircle2 size={18} />}
            {t.type === 'error' && <AlertCircle size={18} />}
            {t.type === 'info' && <Info size={18} />}
            <span style={{ flex: 1 }}>{t.message}</span>
            <X size={14} style={{ opacity: 0.7 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
