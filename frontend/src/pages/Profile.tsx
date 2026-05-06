import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, ListGroup, Button, Modal, Form, Alert } from 'react-bootstrap';
import api from '../services/api';
import Loading from '../components/Loading';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { 
      const res = await api.get('/api/users/me'); 
      setUser(res.data);
      setFullName(res.data.fullName || '');
    }
    catch (err) { 
      console.error(err); 
    }
    finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (password && password !== confirmPassword) {
      setEditError('Passwords do not match');
      return;
    }

    setEditLoading(true);
    try {
      await api.put('/api/users/me', { fullName, password });
      setShowEdit(false);
      setPassword('');
      setConfirmPassword('');
      load();
    } catch (err: any) {
      setEditError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!user) return <div className="text-center py-5">No user data available.</div>;

  return (
    <div className="profile-page">
      <h3 className="mb-4">My Profile</h3>
      
      <Row>
        <Col md={4}>
          <Card className="text-center border-0 shadow-sm mb-4">
            <Card.Body className="py-5">
              <div className="mb-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow" style={{ width: '100px', height: '100px' }}>
                  <i className="bi bi-person-fill" style={{ fontSize: '3rem' }}></i>
                </div>
              </div>
              <h4 className="mb-1">{user.fullName || user.username}</h4>
              <p className="text-muted mb-3">@{user.username}</p>
              <Badge bg="primary" className="px-3 py-2">{user.role}</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Personal Information</h5>
              <Button variant="link" size="sm" onClick={() => setShowEdit(true)}>
                <i className="bi bi-pencil-square me-1"></i> Edit Profile
              </Button>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="py-3 px-0 d-flex">
                  <div className="text-muted w-25">Full Name</div>
                  <div className="fw-bold">{user.fullName || 'N/A'}</div>
                </ListGroup.Item>
                <ListGroup.Item className="py-3 px-0 d-flex">
                  <div className="text-muted w-25">Username</div>
                  <div className="fw-bold">{user.username}</div>
                </ListGroup.Item>
                <ListGroup.Item className="py-3 px-0 d-flex">
                  <div className="text-muted w-25">Account Role</div>
                  <div>
                    <Badge bg="info" text="dark">{user.role}</Badge>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="py-3 px-0 d-flex">
                  <div className="text-muted w-25">Member Since</div>
                  <div className="text-secondary">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm mt-4">
            <Card.Body>
              <h5>Security</h5>
              <p className="text-muted small">Manage your password and security settings.</p>
              <Button variant="outline-secondary" size="sm" onClick={() => setShowEdit(true)}>
                Change Password
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && <Alert variant="danger" className="py-2 small">{editError}</Alert>}
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Full Name</Form.Label>
              <Form.Control 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </Form.Group>
            
            <hr className="my-4" />
            <p className="small text-muted mb-3">Leave password fields blank if you don't want to change it.</p>
            
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">Confirm New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="light" onClick={() => setShowEdit(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={editLoading}>
                {editLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
