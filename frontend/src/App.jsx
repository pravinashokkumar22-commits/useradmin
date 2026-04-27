import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Spinner } from './components/UI';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import DashboardHome from './components/Dashboard';
import UserManagement from './components/Users';
import ContactSubmissions from './components/Contact';
import Profile from './components/Profile';
import Settings from './components/Settings';
import './styles/globals.css';

// Protected route wrapper
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, initialized, isAdmin } = useAuth();

  if (!initialized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={36} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

// Public route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, initialized } = useAuth();

  if (!initialized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={36} />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
    <Route path="/dashboard" element={<PrivateRoute><DashboardHome /></PrivateRoute>} />
    <Route path="/users" element={<PrivateRoute adminOnly><UserManagement /></PrivateRoute>} />
    <Route path="/contact" element={<PrivateRoute adminOnly><ContactSubmissions /></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
