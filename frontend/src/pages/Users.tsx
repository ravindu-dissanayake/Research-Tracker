import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Badge, Card, Modal, Row, Col } from 'react-bootstrap';
import Loading from '../components/Loading';
import * as usersService from '../services/users';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Add user form state
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await usersService.fetchUsers();
      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(u => 
        (u.fullName?.toLowerCase().includes(term)) || 
        (u.username?.toLowerCase().includes(term)) ||
        (u.role?.toLowerCase().includes(term))
      )
    );
  }, [searchTerm, users]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersService.createUser({ username, password, email, fullName, role });
      setShowModal(false);
      setUsername(''); setPassword(''); setEmail(''); setFullName(''); setRole('MEMBER');
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await usersService.updateUserRole(id, role as any);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to update role');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await usersService.deleteUser(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">User Directory</h3>
          <p className="text-muted small mb-0">Manage system roles and account statuses.</p>
        </div>
        <div className="d-flex gap-2">
           <Button variant="primary" className="shadow-sm" onClick={() => setShowModal(true)}>
              <i className="bi bi-person-plus me-2"></i> Add Researcher
           </Button>
           <Badge bg="primary" className="px-3 py-2 d-flex align-items-center">{users.length} Registered</Badge>
        </div>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-3">
          <Form.Group>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <Form.Control 
                className="border-start-0 ps-0"
                placeholder="Search by name, username or role..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light small text-muted text-uppercase">
              <tr>
                <th className="ps-4">User Details</th>
                <th>System Role</th>
                <th>Member Since</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-blue-soft text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '45px', height: '45px'}}>
                          <i className="bi bi-person-fill fs-4"></i>
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{u.fullName || 'No Name'}</div>
                          <div className="small text-muted">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Form.Select 
                        size="sm" 
                        value={u.role} 
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="form-select-sm border shadow-sm"
                        style={{ maxWidth: '140px' }}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="PI">PI</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="VIEWER">VIEWER</option>
                      </Form.Select>
                    </td>
                    <td>
                      <small className="text-muted">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </small>
                    </td>
                    <td className="text-end pe-4">
                      <Button 
                        variant="link" 
                        className="text-danger p-0 text-decoration-none hover-opacity" 
                        onClick={() => handleDelete(u.id)}
                        title="Delete User"
                      >
                        <i className="bi bi-trash-fill fs-5"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
                    <i className="bi bi-person-x fs-1 d-block mb-2 opacity-25"></i>
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Register New Researcher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-muted text-uppercase">Username</Form.Label>
                  <Form.Control 
                    className="bg-light border-0 py-2"
                    placeholder="unique_handle"
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-muted text-uppercase">Initial Password</Form.Label>
                  <Form.Control 
                    type="password"
                    className="bg-light border-0 py-2"
                    placeholder="••••••••"
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-muted text-uppercase">Full Professional Name</Form.Label>
              <Form.Control 
                className="bg-light border-0 py-2"
                placeholder="Dr. John Smith"
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-muted text-uppercase">Email Address</Form.Label>
              <Form.Control 
                type="email"
                className="bg-light border-0 py-2"
                placeholder="john.smith@university.edu"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold small text-muted text-uppercase">Assigned System Role</Form.Label>
              <Form.Select 
                className="bg-light border-0 py-2"
                value={role} 
                onChange={e => setRole(e.target.value)}
              >
                <option value="ADMIN">ADMIN (Full Control)</option>
                <option value="PI">PI (Project Investigator)</option>
                <option value="MEMBER">MEMBER (Researcher)</option>
                <option value="VIEWER">VIEWER (Read-only)</option>
              </Form.Select>
              <Form.Text className="text-muted small">
                 Roles define the level of access to projects and research data.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <Button variant="link" className="text-muted text-decoration-none" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={saving} className="px-4 shadow-sm">
                {saving ? 'Creating Account...' : 'Register User'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Users;
