import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import api from '../services/api';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateClientSide = () => {
    if (fullName.trim().length < 3) return 'Full name must be at least 3 characters long.';
    if (username.trim().length < 3) return 'Username must be at least 3 characters long.';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores.';
    if (password.length < 6) return 'Password must be at least 6 characters long.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setError(null);
    setFieldErrors({});

    const clientError = validateClientSide();
    if (clientError) {
      setError(clientError);
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/signup', { username, fullName, password, role });
      navigate('/login');
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        setError('Validation failed. Please correct the fields below.');
      } else {
        setError(err?.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center py-5 animate-fade-in">
      <Container>
        <Row className="justify-content-center">
          <Col md={7} lg={6}>
            <div className="text-center mb-5">
               <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-lg" style={{width: '72px', height: '72px'}}>
                  <i className="bi bi-person-plus-fill fs-1"></i>
               </div>
               <h2 className="fw-bold text-dark">Join the Community</h2>
               <p className="text-muted">Create an account to start tracking your research</p>
            </div>

            <Card className="border-0 shadow-lg p-3">
              <Card.Body>
                <div className="mb-4">
                  <h4 className="fw-bold mb-1">Create Account</h4>
                  <p className="text-muted small">Fill in the details to register your profile</p>
                </div>

                {error && (
                  <Alert variant="danger" className="py-2 small d-flex align-items-center border-0 shadow-sm mb-4">
                     <i className="bi bi-exclamation-circle-fill me-2 fs-5"></i>
                     <div>{error}</div>
                  </Alert>
                )}
                
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="fullName">
                        <Form.Label className="small fw-bold">Full Name</Form.Label>
                        <Form.Control 
                          type="text"
                          placeholder="Dr. John Doe"
                          value={fullName} 
                          onChange={e => setFullName(e.target.value)} 
                          isInvalid={!!fieldErrors.fullName}
                          required 
                        />
                        <Form.Control.Feedback type="invalid">{fieldErrors.fullName || 'Full name is required.'}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="username">
                        <Form.Label className="small fw-bold">Username</Form.Label>
                        <Form.Control 
                          type="text"
                          placeholder="johndoe"
                          value={username} 
                          onChange={e => setUsername(e.target.value)} 
                          isInvalid={!!fieldErrors.username}
                          required 
                        />
                        <Form.Control.Feedback type="invalid">{fieldErrors.username || 'Username is required.'}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="role">
                    <Form.Label className="small fw-bold">Intended System Role</Form.Label>
                    <Form.Select 
                      className="py-2"
                      value={role} 
                      onChange={e => setRole(e.target.value)}
                    >
                      <option value="MEMBER">Researcher (Member)</option>
                      <option value="PI">Principal Investigator (PI)</option>
                      <option value="VIEWER">Public Viewer</option>
                      <option value="ADMIN">System Administrator</option>
                    </Form.Select>
                    <Form.Text className="text-muted extra-small">Roles define your permissions within projects.</Form.Text>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="password">
                        <Form.Label className="small fw-bold">Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          placeholder="••••••••"
                          value={password} 
                          onChange={e => setPassword(e.target.value)} 
                          isInvalid={!!fieldErrors.password}
                          required 
                        />
                        <Form.Control.Feedback type="invalid">{fieldErrors.password || 'Password is required.'}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="confirmPassword">
                        <Form.Label className="small fw-bold">Confirm Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          placeholder="••••••••"
                          value={confirmPassword} 
                          onChange={e => setConfirmPassword(e.target.value)} 
                          required 
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-100 py-2 fw-bold shadow-sm" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : 'Complete Registration'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <p className="text-muted small">
                Already have an account? <Link to="/login" className="fw-bold text-decoration-none">Sign in here</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
