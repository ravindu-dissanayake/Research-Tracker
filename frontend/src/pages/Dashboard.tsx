import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as projectsService from '../services/projects';
import * as usersService from '../services/users';
import Loading from '../components/Loading';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    userCount: 0,
    recentProjects: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const pRes = await projectsService.fetchProjects();
        const projects = pRes.data || [];
        
        const active = projects.filter((p: any) => p.status === 'ACTIVE' || p.status === 'IN_PROGRESS').length;
        const completed = projects.filter((p: any) => p.status === 'COMPLETED').length;
        const recent = [...projects].sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);

        let userCount = 0;
        if (user?.role === 'ADMIN') {
          const uRes = await usersService.fetchUsers();
          userCount = uRes.data?.length || 0;
        }

        setStats({
          totalProjects: projects.length,
          activeProjects: active,
          completedProjects: completed,
          userCount: userCount,
          recentProjects: recent
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [user]);

  if (loading) return <Loading />;

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'ADMIN': return <Badge bg="danger">System Administrator</Badge>;
      case 'PI': return <Badge bg="primary">Principal Investigator</Badge>;
      case 'MEMBER': return <Badge bg="success">Research Member</Badge>;
      case 'VIEWER': return <Badge bg="info">Guest Viewer</Badge>;
      default: return <Badge bg="secondary">{user?.role}</Badge>;
    }
  };

  const getWelcomeMessage = () => {
    const hours = new Date().getHours();
    let greeting = 'Welcome back';
    if (hours < 12) greeting = 'Good morning';
    else if (hours < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    
    return `${greeting}, ${user?.fullName || user?.username}!`;
  };

  return (
    <div className="dashboard animate-fade-in">
      {/* Header Section */}
      <div className="mb-5">
        <h1 className="mb-2" style={{fontSize: '2.5rem', fontWeight: 800, color: '#1f2937'}}>{getWelcomeMessage()}</h1>
        <div className="d-flex gap-3 align-items-center">
          {getRoleBadge()}
          <span className="text-muted" style={{fontSize: '0.95rem'}}>Managed research tracking environment.</span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <Row className="mb-5 g-3">
        {user?.role === 'ADMIN' && (
          <Col md={6} lg={3}>
            <div className="stat-card stat-card-users" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '16px', padding: '28px', color: 'white', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer'}} 
                 onMouseEnter={(e) => {(e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.3)';}}
                 onMouseLeave={(e) => {(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.2)';}}>
              <div className="d-flex justify-content-between align-items-flex-start mb-3">
                <div>
                  <div style={{fontSize: '2.5rem', fontWeight: 800}}>{stats.userCount}</div>
                  <div style={{fontSize: '0.9rem', opacity: 0.9, marginTop: '4px'}}>Registered Users</div>
                </div>
                <div style={{fontSize: '2rem', opacity: 0.8}}><i className="bi bi-people-fill"></i></div>
              </div>
              <div style={{height: '3px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px', marginTop: '16px', overflow: 'hidden'}}>
                <div style={{width: '65%', height: '100%', background: 'rgba(255,255,255,0.8)'}}></div>
              </div>
            </div>
          </Col>
        )}
        <Col md={6} lg={user?.role === 'ADMIN' ? 3 : 4}>
          <div className="stat-card stat-card-projects" style={{background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', borderRadius: '16px', padding: '28px', color: 'white', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer'}} 
               onMouseEnter={(e) => {(e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 15px 40px rgba(37, 99, 235, 0.3)';}}
               onMouseLeave={(e) => {(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(37, 99, 235, 0.2)';}}>
            <div className="d-flex justify-content-between align-items-flex-start mb-3">
              <div>
                <div style={{fontSize: '2.5rem', fontWeight: 800}}>{stats.totalProjects}</div>
                <div style={{fontSize: '0.9rem', opacity: 0.9, marginTop: '4px'}}>
                  {user?.role === 'ADMIN' ? 'Total Projects' : user?.role === 'PI' ? 'My Projects' : 'Assigned Projects'}
                </div>
              </div>
              <div style={{fontSize: '2rem', opacity: 0.8}}><i className="bi bi-briefcase-fill"></i></div>
            </div>
            <div style={{height: '3px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px', marginTop: '16px', overflow: 'hidden'}}>
              <div style={{width: `${stats.totalProjects > 0 ? Math.min((stats.totalProjects / 10) * 100, 100) : 0}%`, height: '100%', background: 'rgba(255,255,255,0.8)'}}></div>
            </div>
          </div>
        </Col>
        <Col md={6} lg={user?.role === 'ADMIN' ? 3 : 4}>
          <div className="stat-card stat-card-active" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '16px', padding: '28px', color: 'white', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer'}} 
               onMouseEnter={(e) => {(e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.3)';}}
               onMouseLeave={(e) => {(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.2)';}}>
            <div className="d-flex justify-content-between align-items-flex-start mb-3">
              <div>
                <div style={{fontSize: '2.5rem', fontWeight: 800}}>{stats.activeProjects}</div>
                <div style={{fontSize: '0.9rem', opacity: 0.9, marginTop: '4px'}}>Active Research</div>
              </div>
              <div style={{fontSize: '2rem', opacity: 0.8}}><i className="bi bi-lightning-fill"></i></div>
            </div>
            <div style={{height: '3px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px', marginTop: '16px', overflow: 'hidden'}}>
              <div style={{width: `${stats.activeProjects > 0 ? Math.min((stats.activeProjects / stats.totalProjects) * 100 || 100, 100) : 0}%`, height: '100%', background: 'rgba(255,255,255,0.8)'}}></div>
            </div>
          </div>
        </Col>
        <Col md={6} lg={user?.role === 'ADMIN' ? 3 : 4}>
          <div className="stat-card stat-card-completed" style={{background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', borderRadius: '16px', padding: '28px', color: 'white', boxShadow: '0 10px 30px rgba(6, 182, 212, 0.2)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer'}} 
               onMouseEnter={(e) => {(e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 15px 40px rgba(6, 182, 212, 0.3)';}}
               onMouseLeave={(e) => {(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(6, 182, 212, 0.2)';}}>
            <div className="d-flex justify-content-between align-items-flex-start mb-3">
              <div>
                <div style={{fontSize: '2.5rem', fontWeight: 800}}>{stats.completedProjects}</div>
                <div style={{fontSize: '0.9rem', opacity: 0.9, marginTop: '4px'}}>Completed Tasks</div>
              </div>
              <div style={{fontSize: '2rem', opacity: 0.8}}><i className="bi bi-check-circle-fill"></i></div>
            </div>
            <div style={{height: '3px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px', marginTop: '16px', overflow: 'hidden'}}>
              <div style={{width: `${stats.completedProjects > 0 ? Math.min((stats.completedProjects / stats.totalProjects) * 100 || 100, 100) : 0}%`, height: '100%', background: 'rgba(255,255,255,0.8)'}}></div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {user?.role === 'PI' ? 'My Recent Projects' : user?.role === 'MEMBER' ? 'Assigned Projects' : 'System-wide Projects'}
              </h5>
              {(user?.role === 'ADMIN' || user?.role === 'PI') && (
                <Button as={Link as any} to="/projects" variant="outline-primary" size="sm">
                  <i className="bi bi-plus-lg me-1"></i> New Project
                </Button>
              )}
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {stats.recentProjects.length > 0 ? (
                  stats.recentProjects.map(p => (
                    <ListGroup.Item key={p.id} className="py-3 px-4 d-flex justify-content-between align-items-center border-bottom-0 hover-bg">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-blue-soft text-primary rounded p-2 d-none d-sm-block">
                          <i className="bi bi-folder2-open fs-4"></i>
                        </div>
                        <div>
                          <Link to={`/projects/${p.id}`} className="fw-bold text-dark text-decoration-none d-block">
                            {p.title}
                          </Link>
                          <small className="text-muted">
                            PI: {p.pi?.fullName || 'N/A'} • Started: {p.startDate || 'N/A'}
                          </small>
                        </div>
                      </div>
                      <Badge pill bg={
                        p.status === 'COMPLETED' ? 'success' : 
                        p.status === 'ACTIVE' || p.status === 'IN_PROGRESS' ? 'primary' : 
                        p.status === 'ON_HOLD' ? 'warning' : 'secondary'
                      }>
                        {p.status}
                      </Badge>
                    </ListGroup.Item>
                  ))
                ) : (
                  <div className="p-5 text-center text-muted">
                    <i className="bi bi-folder-x fs-1 d-block mb-2 opacity-25"></i>
                    No projects found for your account.
                  </div>
                )}
              </ListGroup>
            </Card.Body>
            <Card.Footer className="bg-white border-0 text-center py-3">
              <Link to="/projects" className="fw-medium">View All Projects <i className="bi bi-arrow-right ms-1"></i></Link>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Quick Access</h5>
            </Card.Header>
            <Card.Body className="pt-0">
               <div className="d-grid gap-2">
                 <Button as={Link as any} to="/projects" variant="light" className="text-start py-3 border hover-lift">
                    <i className="bi bi-kanban text-primary me-3 fs-5"></i>
                    <div>
                      <div className="fw-bold">Browse Projects</div>
                      <div className="small text-muted">View all {user?.role === 'VIEWER' ? 'public' : 'available'} research</div>
                    </div>
                 </Button>
                 
                 <Button as={Link as any} to="/documents" variant="light" className="text-start py-3 border hover-lift">
                    <i className="bi bi-file-earmark-arrow-up text-success me-3 fs-5"></i>
                    <div>
                      <div className="fw-bold">Shared Documents</div>
                      <div className="small text-muted">Access research papers & data</div>
                    </div>
                 </Button>

                 {user?.role === 'ADMIN' && (
                   <Button as={Link as any} to="/admin" variant="light" className="text-start py-3 border hover-lift">
                      <i className="bi bi-shield-lock text-danger me-3 fs-5"></i>
                      <div>
                        <div className="fw-bold">Admin Console</div>
                        <div className="small text-muted">Manage users and system logs</div>
                      </div>
                   </Button>
                 )}

                 <Button as={Link as any} to="/profile" variant="light" className="text-start py-3 border hover-lift">
                    <i className="bi bi-person-badge text-info me-3 fs-5"></i>
                    <div>
                      <div className="fw-bold">My Profile</div>
                      <div className="small text-muted">Update your credentials</div>
                    </div>
                 </Button>
               </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm bg-blue-soft">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-lightbulb text-warning me-2"></i>Research Tip</h6>
              <p className="small text-muted mb-0">
                {user?.role === 'PI' 
                  ? "Don't forget to regularly update project milestones to keep your team informed about the progress."
                  : user?.role === 'MEMBER'
                  ? "Upload your experimental data and findings to the project documents section for peer review."
                  : "Keep your profile information up to date to ensure you receive relevant system notifications."}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
