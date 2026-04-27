import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Edit2, X, Check } from 'lucide-react';
import Layout from '../Layout';
import { Card, Input, Button, Avatar, Badge, Alert } from '../UI';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const res = await api.put('/profile', payload);
      updateUser(res.data.user);
      setSuccess('Profile updated successfully');
      setEditing(false);
      setForm({ ...form, password: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setForm({ name: user?.name || '', email: user?.email || '', password: '' });
    setEditing(false);
    setError('');
  };

  const fields = [
    { icon: <User size={16} />, label: 'Full Name', value: user?.name },
    { icon: <Mail size={16} />, label: 'Email Address', value: user?.email },
    { icon: <Shield size={16} />, label: 'Role', value: user?.role === 'admin' ? 'Admin' : 'User' },
    {
      icon: <Calendar size={16} />,
      label: 'Member Since',
      value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—',
    },
  ];

  return (
    <Layout title="Profile">
      <div style={{ maxWidth: 600 }}>
        {success && <div style={{ marginBottom: '16px' }}><Alert type="success">{success}</Alert></div>}

        <Card style={{ padding: '28px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
            <Avatar name={user?.name || ''} size={60} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>{user?.name}</h2>
                <Badge variant={user?.role}>{user?.role}</Badge>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{user?.email}</div>
            </div>
          </div>

          {/* Fields */}
          {!editing ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {fields.map(({ icon, label, value }) => (
                  <div key={label} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 0',
                    borderBottom: '1px solid var(--border-light)',
                  }}>
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{label}</div>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                style={{ width: '100%', marginTop: '24px' }}
                size="lg"
                icon={<Edit2 size={15} />}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && <Alert type="error">{error}</Alert>}
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                icon={<User size={14} />}
              />
              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                icon={<Mail size={14} />}
              />
              <Input
                label="New Password (leave blank to keep current)"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter new password"
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <Button variant="secondary" icon={<X size={14} />} style={{ flex: 1 }} onClick={handleCancel}>Cancel</Button>
                <Button icon={<Check size={14} />} style={{ flex: 1 }} loading={loading} onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
