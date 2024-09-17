
import React , { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/LogIn';
import Signup from './components/Signup';
import AdminDashboard from './components/AdmidDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

function AppContent() {
  const { user, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = (userData) => {
    login(userData);
  };

  const handleLogout = () => {
    logout();
  };

  const switchToSignup = () => setShowLogin(false);
  const switchToLogin = () => setShowLogin(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {!user ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          {showLogin ? (
            <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />
          ) : (
            <Signup onSwitchToLogin={switchToLogin} />
          )}
        </div>
      ) : user.role === 'admin' ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <EmployeeDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;