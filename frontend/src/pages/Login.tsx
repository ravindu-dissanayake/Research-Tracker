import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const isExpired = new URLSearchParams(location.search).get('expired') === 'true';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { username, password });
      const token = res.data.accessToken || res.data.token;
      login(token);
      
      // Flash success message or just redirect
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center py-5 animate-fade-in">
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <div className="text-center mb-5">
               <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-lg" style={{width: '72px', height: '72px'}}>
                  <i className="bi bi-shield-lock-fill fs-1"></i>
               </div>
               <h2 className="fw-bold text-dark">Research Portal</h2>
               <p className="text-muted">Secure access to research projects and analytics</p>
            </div>
            
            <Card className="border-0 shadow-lg p-3">
              <Card.Body>
                <div className="mb-4">
                  <h4 className="fw-bold mb-1">Sign In</h4>
                  <p className="text-muted small">Enter your credentials to continue</p>
                </div>

                {isExpired && !error && (
                  <Alert variant="warning" className="py-2 small d-flex align-items-center border-0 shadow-sm mb-3">
                    <i className="bi bi-clock-history me-2 fs-5"></i>
                    <div>Your session has expired. Please sign in again.</div>
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="py-2 small d-flex align-items-center border-0 shadow-sm">
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                    <div>{error}</div>
                  </Alert>
                )}
                
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="small fw-bold">Username</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-muted"></i></span>
                      <Form.Control 
                        className="border-start-0 py-2"
                        type="text"
                        placeholder="your_username"
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        required 
                      />
                      <Form.Control.Feedback type="invalid">Username is required.</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <Form.Label className="small fw-bold mb-0">Password</Form.Label>
                      <Link to="/forgot-password" style={{fontSize: '0.75rem'}} className="text-decoration-none">Forgot password?</Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-key text-muted"></i></span>
                      <Form.Control 
                        className="border-start-0 py-2"
                        type="password" 
                        placeholder="••••••••"
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                      />
                      <Form.Control.Feedback type="invalid">Password is required.</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-100 py-2 fw-bold shadow-sm" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Authenticating...
                      </>
                    ) : 'Sign In to Portal'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            
            <div className="text-center mt-4">
              <p className="text-muted small">
                Don't have an account? <Link to="/register" className="fw-bold text-decoration-none">Create a Member account</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
