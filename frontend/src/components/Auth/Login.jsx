import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Alert } from '../UI';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(result.role === 'admin' ? '/dashboard' : '/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--main-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: 'var(--shadow-lg)',
        animation: 'scaleIn 0.25s ease both',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
            <span style={{ display: 'inline-block', transform: 'scaleX(1.2)' }}>Welcome Back</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Log In to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && <Alert type="error">{error}</Alert>}

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            icon={<Mail size={15} />}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            icon={<Lock size={15} />}
            required
          />

          <Button
            type="submit"
            size="lg"
            loading={loading}
            style={{ width: '100%', marginTop: '4px' }}
          >
            Login
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign up</Link>
        </p>

        {/* Demo credentials */}
        <div style={{
          marginTop: '20px',
          padding: '14px 16px',
          background: 'var(--info-light)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12.5px',
          color: 'var(--info)',
          lineHeight: 1.7,
        }}>
          <strong>Demo Credentials:</strong><br />
          Admin: admin@example.com / admin123<br />
          User: john@example.com / user123
        </div>
      </div>
    </div>
  );
};

export default Login;
