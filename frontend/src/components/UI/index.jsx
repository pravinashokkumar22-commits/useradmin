import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// ─── Button ─────────────────────────────────────────────────────────────────
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  ...props
}) => {
  const styles = {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      fontWeight: 500,
      borderRadius: 'var(--radius-sm)',
      transition: 'var(--transition)',
      cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
      opacity: props.disabled || loading ? 0.65 : 1,
      border: '1.5px solid transparent',
      letterSpacing: '-0.01em',
    },
    sizes: {
      sm: { padding: '6px 12px', fontSize: '12px' },
      md: { padding: '9px 18px', fontSize: '13px' },
      lg: { padding: '12px 24px', fontSize: '14px' },
      icon: { padding: '8px', fontSize: '13px' },
    },
    variants: {
      primary: {
        background: 'var(--text-primary)',
        color: '#fff',
        borderColor: 'var(--text-primary)',
      },
      secondary: {
        background: 'transparent',
        color: 'var(--text-primary)',
        borderColor: 'var(--border)',
      },
      danger: {
        background: 'var(--danger)',
        color: '#fff',
        borderColor: 'var(--danger)',
      },
      ghost: {
        background: 'transparent',
        color: 'var(--text-secondary)',
        borderColor: 'transparent',
      },
      accent: {
        background: 'var(--accent)',
        color: '#fff',
        borderColor: 'var(--accent)',
      },
    },
  };

  return (
    <button
      style={{ ...styles.base, ...styles.sizes[size], ...styles.variants[variant] }}
      className={className}
      {...props}
    >
      {loading ? <Spinner size={14} color="currentColor" /> : icon}
      {children}
    </button>
  );
};

// ─── Input ───────────────────────────────────────────────────────────────────
export const Input = ({ label, error, icon, className = '', style = {}, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
          }}>
            {icon}
          </span>
        )}
        <input
          style={{
            width: '100%',
            padding: icon ? '10px 14px 10px 38px' : '10px 14px',
            border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            background: '#fff',
            fontSize: '13px',
            color: 'var(--text-primary)',
            transition: 'var(--transition)',
            ...style,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--accent)';
            e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239,68,68,0.1)' : 'rgba(124,58,237,0.1)'}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)';
            e.target.style.boxShadow = 'none';
          }}
          className={className}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: '12px', color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
};

// ─── Select ──────────────────────────────────────────────────────────────────
export const Select = ({ label, error, children, style = {}, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <select
        style={{
          width: '100%',
          padding: '10px 14px',
          border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          background: '#fff',
          fontSize: '13px',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          ...style,
        }}
        {...props}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: '12px', color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
};

// ─── Badge ───────────────────────────────────────────────────────────────────
export const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    admin: { background: 'var(--admin-bg)', color: 'var(--admin-color)' },
    user: { background: 'var(--user-bg)', color: 'var(--user-color)' },
    active: { background: 'var(--success-light)', color: 'var(--success)' },
    inactive: { background: 'var(--danger-light)', color: 'var(--danger)' },
    default: { background: 'var(--border-light)', color: 'var(--text-secondary)' },
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: size === 'sm' ? '2px 8px' : '4px 12px',
      borderRadius: '999px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      ...variants[variant],
    }}>
      {children}
    </span>
  );
};

// ─── Avatar ──────────────────────────────────────────────────────────────────
export const Avatar = ({ name = '', size = 40, style = {} }) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.35,
      fontWeight: 700,
      flexShrink: 0,
      letterSpacing: '-0.02em',
      ...style,
    }}>
      {initials}
    </div>
  );
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 20, color = 'var(--accent)' }) => (
  <div style={{
    width: size,
    height: size,
    border: `2px solid ${color}22`,
    borderTop: `2px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  }} />
);

// ─── Card ────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {}, className = '' }) => (
  <div
    className={className}
    style={{
      background: 'var(--card-bg)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Modal ───────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, width = 480 }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.15s ease both',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: width,
        maxHeight: '90vh',
        overflow: 'auto',
        animation: 'scaleIn 0.2s ease both',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              padding: '4px',
              borderRadius: '6px',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--border-light)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
};

// ─── Detail Row ──────────────────────────────────────────────────────────────
export const DetailRow = ({ icon, label, value }) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 0',
    borderBottom: '1px solid var(--border-light)',
  }}>
    <span style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }}>{icon}</span>
    <div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{value}</div>
    </div>
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, description }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '12px',
    color: 'var(--text-muted)',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: '40px', opacity: 0.5 }}>{icon}</div>
    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</div>
    {description && <div style={{ fontSize: '13px' }}>{description}</div>}
  </div>
);

// ─── Alert ───────────────────────────────────────────────────────────────────
export const Alert = ({ type = 'info', children }) => {
  const types = {
    error: { bg: 'var(--danger-light)', color: 'var(--danger)', border: '#fca5a5' },
    success: { bg: 'var(--success-light)', color: 'var(--success)', border: '#6ee7b7' },
    info: { bg: 'var(--info-light)', color: 'var(--info)', border: '#93c5fd' },
    warning: { bg: 'var(--warning-light)', color: 'var(--warning)', border: '#fcd34d' },
  };
  const t = types[type] || types.info;

  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: 'var(--radius-sm)',
      background: t.bg,
      color: t.color,
      border: `1px solid ${t.border}`,
      fontSize: '13px',
      fontWeight: 500,
    }}>
      {children}
    </div>
  );
};
