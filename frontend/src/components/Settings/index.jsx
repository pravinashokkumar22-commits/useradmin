import React, { useState } from 'react';
import { Bell, Moon, Globe, Shield, LogOut } from 'lucide-react';
import Layout from '../Layout';
import { Card, Button, Alert } from '../UI';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    style={{
      width: '44px',
      height: '24px',
      borderRadius: '999px',
      background: checked ? 'var(--accent)' : 'var(--border)',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.2s',
      flexShrink: 0,
    }}
  >
    <div style={{
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      background: '#fff',
      position: 'absolute',
      top: '3px',
      left: checked ? '23px' : '3px',
      transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    }} />
  </button>
);

const SettingRow = ({ icon, title, description, control }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderBottom: '1px solid var(--border-light)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '8px',
        background: 'var(--main-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500 }}>{title}</div>
        {description && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{description}</div>}
      </div>
    </div>
    {control}
  </div>
);

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    twoFactor: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout title="Settings">
      <div style={{ maxWidth: 600 }}>
        {saved && <div style={{ marginBottom: '16px' }}><Alert type="success">Settings saved successfully!</Alert></div>}

        <Card style={{ padding: '24px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Preferences</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Manage your account preferences</p>

          <SettingRow
            icon={<Bell size={16} />}
            title="Email Notifications"
            description="Receive email alerts for activity"
            control={<ToggleSwitch checked={settings.notifications} onChange={() => toggle('notifications')} />}
          />
          <SettingRow
            icon={<Moon size={16} />}
            title="Dark Mode"
            description="Switch to dark theme"
            control={<ToggleSwitch checked={settings.darkMode} onChange={() => toggle('darkMode')} />}
          />
          <SettingRow
            icon={<Shield size={16} />}
            title="Two-Factor Authentication"
            description="Add an extra layer of security"
            control={<ToggleSwitch checked={settings.twoFactor} onChange={() => toggle('twoFactor')} />}
          />
          <SettingRow
            icon={<Globe size={16} />}
            title="Language"
            description="Interface language"
            control={
              <select style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '13px', background: '#fff', cursor: 'pointer' }}>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            }
          />

          <Button style={{ marginTop: '20px' }} onClick={handleSave}>Save Settings</Button>
        </Card>

        <Card style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px', color: 'var(--danger)' }}>Danger Zone</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>These actions are irreversible</p>
          <Button variant="danger" icon={<LogOut size={14} />} onClick={handleLogout}>
            Sign Out
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
