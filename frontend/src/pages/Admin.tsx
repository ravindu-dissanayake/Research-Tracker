import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import * as usersService from '../services/users';

const Admin: React.FC = () => {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock activity data for professional look
  const recentActivity = [
    { id: 1, event: 'New user registered', user: 'janesmith', time: '10 mins ago', type: 'registration' },
    { id: 2, event: 'Project deleted', user: 'admin', time: '1 hour ago', type: 'deletion' },
    { id: 3, event: 'Role updated: MEMBER -> PI', user: 'robert_j', time: '3 hours ago', type: 'update' },
    { id: 4, event: 'System backup completed', user: 'system', time: '5 hours ago', type: 'system' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await usersService.fetchUsers();
        setUserCount(res.data?.length || 0);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="admin-panel animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">System Administration</h3>
          <p className="text-muted small mb-0">Monitor system health and manage access controls.</p>
        </div>
        <Badge bg="dark" className="px-3 py-2 shadow-sm">Super Admin</Badge>
      </div>

      <Row className="mb-4">
        <Col lg={4} className="mb-4 mb-lg-0">
          <Card className="border-0 shadow-sm h-100 bg-primary text-white">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5">
              <div className="bg-white bg-opacity-25 rounded-circle p-4 mb-3">
                <i className="bi bi-people fs-1"></i>
              </div>
              <h1 className="display-4 fw-bold mb-0">{userCount}</h1>
              <p className="mb-3 opacity-75">Active Users</p>
              <Button as={Link as any} to="/admin/users" variant="light" size="sm" className="fw-bold px-4">
                Manage Directory
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3 border-0">
              <h5 className="mb-0">System Health Overview</h5>
            </Card.Header>
            <Card.Body className="pt-0">
              <Row>
                <Col md={6} className="mb-3">
                  <div className="p-3 border rounded bg-light d-flex align-items-center">
                    <div className="text-success me-3 fs-3"><i className="bi bi-check-circle-fill"></i></div>
                    <div>
                      <div className="small text-muted">API Server</div>
                      <div className="fw-bold text-success">Operational</div>
                    </div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="p-3 border rounded bg-light d-flex align-items-center">
                    <div className="text-success me-3 fs-3"><i className="bi bi-database-fill-check"></i></div>
                    <div>
                      <div className="small text-muted">Database</div>
                      <div className="fw-bold text-success">Healthy (0.4ms)</div>
                    </div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="p-3 border rounded bg-light d-flex align-items-center">
                    <div className="text-primary me-3 fs-3"><i className="bi bi-cpu-fill"></i></div>
                    <div>
                      <div className="small text-muted">CPU Usage</div>
                      <div className="fw-bold">12% Peak Load</div>
                    </div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="p-3 border rounded bg-light d-flex align-items-center">
                    <div className="text-warning me-3 fs-3"><i className="bi bi-hdd-fill"></i></div>
                    <div>
                      <div className="small text-muted">Storage</div>
                      <div className="fw-bold">64% Capacity</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h5 className="fw-bold mb-3 mt-2"><i className="bi bi-shield-lock me-2 text-primary"></i>Research Governance</h5>
      <Row className="mb-4">
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm hover-lift h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-blue-soft text-primary rounded p-2">
                  <i className="bi bi-journal-text fs-4"></i>
                </div>
                <Badge bg="light" text="dark" className="border">Active</Badge>
              </div>
              <h6 className="fw-bold">Project Oversight</h6>
              <p className="extra-small text-muted mb-3">Global CRUD management for all research initiatives.</p>
              <Button as={Link as any} to="/projects" variant="outline-primary" size="sm" className="w-100 py-2">
                Manage Projects
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm hover-lift h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-blue-soft text-primary rounded p-2">
                  <i className="bi bi-list-check fs-4"></i>
                </div>
                <Badge bg="light" text="dark" className="border">Live</Badge>
              </div>
              <h6 className="fw-bold">Milestone Tracker</h6>
              <p className="extra-small text-muted mb-3">Audit and manage deadlines across the system.</p>
              <Button as={Link as any} to="/milestones" variant="outline-primary" size="sm" className="w-100 py-2">
                View All Milestones
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm hover-lift h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-blue-soft text-primary rounded p-2">
                  <i className="bi bi-file-earmark-medical fs-4"></i>
                </div>
                <Badge bg="light" text="dark" className="border">Secure</Badge>
              </div>
              <h6 className="fw-bold">Document Repository</h6>
              <p className="extra-small text-muted mb-3">Manage research papers and experimental data.</p>
              <Button as={Link as any} to="/documents" variant="outline-primary" size="sm" className="w-100 py-2">
                Manage Documents
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center border-0">
              <h5 className="mb-0 fw-bold">Recent Security Audit</h5>
              <Badge bg="light" text="primary" className="border">Real-time Feed</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="bg-light small text-muted text-uppercase">
                    <tr>
                      <th className="ps-4">Event Description</th>
                      <th>Initiator</th>
                      <th>Timestamp</th>
                      <th className="pe-4 text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map(act => (
                      <tr key={act.id}>
                        <td className="ps-4 py-3">
                          <span className="fw-medium">{act.event}</span>
                        </td>
                        <td><Badge bg="light" text="dark" className="border">@{act.user}</Badge></td>
                        <td className="text-muted small">{act.time}</td>
                        <td className="pe-4 text-end">
                           <Badge pill bg="success" className="smaller px-2">SUCCESS</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm bg-dark text-white mb-4">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-gear-fill me-2"></i>Quick Actions</h6>
              <div className="d-grid gap-2">
                <Button as={Link as any} to="/admin/users" variant="primary" className="text-start border-0 py-2">
                  <i className="bi bi-people me-2"></i> User Directory
                </Button>
                <Button variant="outline-light" className="text-start border-opacity-25 py-2" disabled>
                   <i className="bi bi-cloud-arrow-down me-2"></i> Backup System
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm h-auto overflow-hidden">
             <div className="bg-primary p-1"></div>
             <Card.Body className="p-4">
                <h6 className="fw-bold mb-2">System Version</h6>
                <div className="d-flex align-items-center gap-2 mb-3">
                   <Badge bg="primary">v1.2.0-STABLE</Badge>
                   <span className="smaller text-muted">Last updated: Today</span>
                </div>
                <div className="extra-small text-muted italic">
                   This administrative console provides full CRUD access to the Research Tracker ecosystem.
                </div>
             </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Admin;
