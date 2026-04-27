import React, { useState, useEffect, useCallback } from 'react';
import { Eye, Trash2, User, Mail, Calendar, MessageSquare } from 'lucide-react';
import Layout from '../Layout';
import { Card, Modal, Spinner, EmptyState, Alert, DetailRow, Badge } from '../UI';
import api from '../../utils/api';

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      setSubmissions(res.data);
    } catch {
      setError('Failed to load submissions');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/contact/${deleteTarget.id}`);
      setSuccess('Submission deleted');
      setDeleteTarget(null);
      fetchSubmissions();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Delete failed');
    }
    setDeleting(false);
  };

  const formatDate = (d) => new Date(d).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <Layout title="Contact Submissions">
      <div style={{ maxWidth: 1100 }}>
        {success && <div style={{ marginBottom: '16px' }}><Alert type="success">{success}</Alert></div>}
        {error && <div style={{ marginBottom: '16px' }}><Alert type="error">{error}</Alert></div>}

        <Card>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Spinner size={32} /></div>
          ) : submissions.length === 0 ? (
            <EmptyState icon="✉️" title="No submissions yet" description="Contact form submissions will appear here" />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['NAME', 'EMAIL', 'MESSAGE PREVIEW', 'DATE', 'ACTIONS'].map((h) => (
                    <th key={h} style={{
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.06em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: i < submissions.length - 1 ? '1px solid var(--border-light)' : 'none',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--main-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: '14px' }}>{s.full_name}</td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>{s.email}</td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '320px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.message}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {formatDate(s.created_at)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => setViewItem(s)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            border: '1.5px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            background: '#fff',
                            fontSize: '12.5px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            background: '#fff',
                            color: 'var(--danger)',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger-light)'; e.currentTarget.style.borderColor = 'var(--danger)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      {/* View Modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Contact Message">
        {viewItem && (
          <div>
            <DetailRow icon={<User size={15} />} label="Name" value={viewItem.full_name} />
            <DetailRow icon={<Mail size={15} />} label="Email" value={viewItem.email} />
            <DetailRow icon={<Calendar size={15} />} label="Submitted" value={new Date(viewItem.created_at).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
            <div style={{ padding: '14px 0' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--text-muted)', marginTop: '2px' }}><MessageSquare size={15} /></span>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message</div>
                  <div style={{ fontSize: '14px', lineHeight: 1.7 }}>{viewItem.message}</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setViewItem(null)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px',
                background: 'var(--main-bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      

      {/* Delete Confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Submission" width={400}>
        {deleteTarget && (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
              Delete the submission from <strong>{deleteTarget.full_name}</strong>? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{ flex: 1, padding: '10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ flex: 1, padding: '10px', background: 'var(--danger)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontWeight: 500, cursor: 'pointer' }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};
export default ContactSubmissions;
