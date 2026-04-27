import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, User, Mail, Shield, Calendar } from 'lucide-react';
import Layout from '../Layout';
import { Button, Input, Select, Card, Avatar, Badge, Modal, Spinner, EmptyState, Alert, DetailRow } from '../UI';
import api from '../../utils/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'user' });
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'user' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openEdit = (user) => {
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setEditUser(user);
  };

  const handleEdit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await api.put(`/users/${editUser.id}`, editForm);
      setSuccess('User updated successfully');
      setEditUser(null);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      setSuccess('User deleted successfully');
      setDeleteTarget(null);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
    setSubmitting(false);
  };

  const handleAdd = async () => {
    setSubmitting(true);
    setError('');
    try {
      await api.post('/signup', addForm);
      setSuccess('User created successfully');
      setAddModal(false);
      setAddForm({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Creation failed');
    }
    setSubmitting(false);
  };

  return (
    <Layout title="User Management">
      <div style={{ maxWidth: 1100 }}>
        {success && <div style={{ marginBottom: '16px' }}><Alert type="success">{success}</Alert></div>}
        {error && !editUser && !deleteTarget && !addModal && (
          <div style={{ marginBottom: '16px' }}><Alert type="error">{error}</Alert></div>
        )}

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                background: '#fff',
                outline: 'none',
              }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <Button icon={<Plus size={15} />} onClick={() => { setAddModal(true); setError(''); }}>
            Add New User
          </Button>
        </div>

        {/* User Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <Spinner size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="👤" title="No users found" description="Try adjusting your search or filters" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filtered.map((u) => (
              <Card key={u.id} style={{ padding: '24px', textAlign: 'center' }}>
                <Avatar name={u.name} size={60} style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{u.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px', marginBottom: '10px' }}>{u.email}</div>
                <div style={{ marginBottom: '16px' }}>
                  <Badge variant={u.role}>{u.role}</Badge>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                  <Button variant="secondary" size="sm" icon={<Eye size={13} />} onClick={() => setViewUser(u)}>View</Button>
                  <Button variant="secondary" size="sm" icon={<Edit2 size={13} />} onClick={() => openEdit(u)}>Edit</Button>
                  <button
                    onClick={() => setDeleteTarget(u)}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--border)',
                      background: '#fff',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger-light)'; e.currentTarget.style.borderColor = 'var(--danger)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="User Details">
        {viewUser && (
          <div>
            <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
              <Avatar name={viewUser.name} size={64} style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{viewUser.name}</div>
              <div style={{ marginTop: '6px' }}><Badge variant={viewUser.role}>{viewUser.role}</Badge></div>
            </div>
            <DetailRow icon={<User size={15} />} label="Full Name" value={viewUser.name} />
            <DetailRow icon={<Mail size={15} />} label="Email Address" value={viewUser.email} />
            <DetailRow icon={<Shield size={15} />} label="Role" value={viewUser.role === 'admin' ? 'Admin' : 'User'} />
            <DetailRow icon={<Calendar size={15} />} label="Member Since" value={new Date(viewUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
            <Button variant="secondary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setViewUser(null)}>Close</Button>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editUser} onClose={() => { setEditUser(null); setError(''); }} title="Edit User">
        {editUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && <Alert type="error">{error}</Alert>}
            <Input label="Full Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <Input label="Email Address" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            <Select label="Role" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <Button variant="secondary" style={{ flex: 1 }} onClick={() => { setEditUser(null); setError(''); }}>Cancel</Button>
              <Button style={{ flex: 1 }} loading={submitting} onClick={handleEdit}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User" width={400}>
        {deleteTarget && (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="secondary" style={{ flex: 1 }} onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="danger" style={{ flex: 1 }} loading={submitting} onClick={handleDelete}>Delete User</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal open={addModal} onClose={() => { setAddModal(false); setError(''); }} title="Add New User">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && <Alert type="error">{error}</Alert>}
          <Input label="Full Name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
          <Input label="Email Address" type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
          <Input label="Password" type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} />
          <Select label="Role" value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Select>
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <Button variant="secondary" style={{ flex: 1 }} onClick={() => { setAddModal(false); setError(''); }}>Cancel</Button>
            <Button style={{ flex: 1 }} loading={submitting} onClick={handleAdd}>Create User</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default UserManagement;
