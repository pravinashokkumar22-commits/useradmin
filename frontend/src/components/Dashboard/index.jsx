import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, UserCheck, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Layout';
import { Card, Spinner } from '../UI';
import api from '../../utils/api';

const StatCard = ({ icon, label, value, color }) => (
  <Card style={{ padding: '24px', flex: 1, minWidth: 0 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '10px',
        background: color + '18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>{value}</div>
      </div>
    </div>
  </Card>
);

const QuickAction = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '16px 18px',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      background: '#fff',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
      transition: 'var(--transition)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--accent)';
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.08)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
    <div>
      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{title}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{description}</div>
    </div>
  </button>
);

const DashboardHome = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, admins: 0, regular: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    const fetchStats = async () => {
      try {
        const [usersRes, contactRes] = await Promise.all([
          api.get('/users'),
          api.get('/contact'),
        ]);
        const users = usersRes.data;
        setStats({
          total: users.length,
          admins: users.filter((u) => u.role === 'admin').length,
          regular: users.filter((u) => u.role === 'user').length,
          messages: contactRes.data.length,
        });
      } catch {}
      setLoading(false);
    };
    fetchStats();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Layout title="Profile">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Card style={{ padding: '32px', maxWidth: 600, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 700,
              }}>
                {user?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{user?.name}</h2>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'var(--user-bg)',
                    color: 'var(--user-color)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>USER</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{user?.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { label: 'Full Name', value: user?.name },
                { label: 'Email Address', value: user?.email },
                { label: 'Role', value: user?.role },
                { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/profile')}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '13px',
                background: 'var(--text-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Edit Profile
            </button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard Home">
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Welcome back, {user?.name}!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Here's what's happening with your dashboard today.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Spinner size={32} />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <StatCard icon={<Users size={22} />} label="Total Users" value={stats.total} color="var(--accent)" />
              <StatCard icon={<Shield size={22} />} label="Admin Users" value={stats.admins} color="var(--accent)" />
              <StatCard icon={<UserCheck size={22} />} label="Regular Users" value={stats.regular} color="var(--success)" />
              <StatCard icon={<Mail size={22} />} label="Contact Messages" value={stats.messages} color="var(--danger)" />
            </div>

            {/* Quick actions + Account info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
              <Card style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <QuickAction
                    icon={<Users size={18} />}
                    title="Manage Users"
                    description="View and edit user accounts"
                    onClick={() => navigate('/users')}
                  />
                  <QuickAction
                    icon={<Mail size={18} />}
                    title="View Messages"
                    description="Check contact submissions"
                    onClick={() => navigate('/contact')}
                  />
                </div>
              </Card>

              <Card style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Account Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    { label: 'Role', value: 'Admin', valueStyle: { fontWeight: 700 } },
                    { label: 'Email', value: user?.email },
                    { label: 'Status', value: 'Active', valueStyle: { color: 'var(--success)', fontWeight: 600 } },
                  ].map(({ label, value, valueStyle }) => (
                    <div key={label} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid var(--border-light)',
                    }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ fontSize: '13px', fontWeight: 500, ...valueStyle }}>{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DashboardHome;
