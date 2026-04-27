import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Mail, User, Settings, LogOut, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../UI';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  const adminLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard Home' },
    { to: '/users', icon: <Users size={17} />, label: 'User Management' },
    { to: '/contact', icon: <Mail size={17} />, label: 'Contact Submissions' },
    { to: '/profile', icon: <User size={17} />, label: 'Profile' },
    { to: '/settings', icon: <Settings size={17} />, label: 'Settings' },
  ];

  const userLinks = [
    { to: '/dashboard', icon: <User size={17} />, label: 'Profile' },
    { to: '/settings', icon: <Settings size={17} />, label: 'Settings' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      minHeight: '100vh',
      background: 'var(--sidebar-bg)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{
        padding: '22px 20px',
        borderBottom: '1px solid var(--sidebar-border)',
      }}>
        <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff', letterSpacing: '-0.02em' }}>
          {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: '8px',
              color: isActive ? 'var(--sidebar-active)' : 'var(--sidebar-text)',
              background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
              fontSize: '13.5px',
              fontWeight: isActive ? 500 : 400,
              transition: 'var(--transition)',
              marginBottom: '2px',
              textDecoration: 'none',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.className.includes('active')) {
                e.currentTarget.style.background = 'var(--sidebar-hover-bg)';
                e.currentTarget.style.color = '#e2e8f0';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--sidebar-text)';
              }
            }}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div style={{
        padding: '14px',
        borderTop: '1px solid var(--sidebar-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <Avatar name={user?.name || ''} size={32} />
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--sidebar-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </div>
        </div>
      </div>
    </aside>
  );
};

const Header = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: 'var(--header-height)',
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <h1 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</h1>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '8px',
            transition: 'var(--transition)',
          }}
        >
          <Avatar name={user?.name || ''} size={36} />
          <ChevronDown size={16} color="var(--text-secondary)" />
        </button>

        {menuOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 49 }}
              onClick={() => setMenuOpen(false)}
            />
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-lg)',
              minWidth: '160px',
              overflow: 'hidden',
              zIndex: 50,
              animation: 'scaleIn 0.15s ease both',
            }}>
              <button
                onClick={() => { navigate('/settings'); setMenuOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--main-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <Settings size={15} /> Settings
              </button>
              <div style={{ height: '1px', background: 'var(--border)' }} />
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: 'var(--danger)',
                  transition: 'var(--transition)',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-light)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

const Layout = ({ children, title }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: 'var(--sidebar-width)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header title={title} />
        <main style={{ flex: 1, padding: '28px', animation: 'fadeIn 0.25s ease both' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
