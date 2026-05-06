import React, { useEffect, useState } from 'react';
import { Button, Modal, Row, Col, Form, InputGroup, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import * as projectsService from '../services/projects';
import ProjectForm from '../components/ProjectForm';
import { useAuth } from '../contexts/AuthContext';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const canCreate = user?.role === 'ADMIN' || user?.role === 'PI';
  const isAdmin = user?.role === 'ADMIN';

  const load = async () => {
    setLoading(true);
    try {
      const res = await projectsService.fetchProjects();
      setProjects(res.data || []);
      setFilteredProjects(res.data || []);
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
    setFilteredProjects(
      projects.filter(p => 
        (p.title?.toLowerCase().includes(term)) || 
        (p.summary?.toLowerCase().includes(term)) ||
        (p.tags?.toLowerCase().includes(term))
      )
    );
  }, [searchTerm, projects]);

  const handleDelete = async (id: any) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsService.deleteProject(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  const handleSaved = () => {
    setShowNew(false);
    setEditing(null);
    load();
  };

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Research Projects</h3>
        {canCreate && (
          <Button variant="primary" onClick={() => setShowNew(true)}>
            <i className="bi bi-plus-lg me-2"></i> New Project
          </Button>
        )}
      </div>

      <div className="mb-4">
        <InputGroup className="shadow-sm rounded">
          <InputGroup.Text className="bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </InputGroup.Text>
          <Form.Control
            className="border-start-0 py-2"
            placeholder="Search by title, summary or tags..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <Row>
        {filteredProjects.length > 0 ? (
          filteredProjects.map(p => {
            const isProjectPI = user?.id === p.pi?.id;
            const canEdit = isAdmin || (user?.role === 'PI' && isProjectPI);
            const canDelete = isAdmin;

            return (
              <Col md={6} lg={4} key={p.id} className="mb-4">
                <Card className="h-100 border-0 shadow-sm hover-lift">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge pill bg={
                        p.status === 'COMPLETED' ? 'success' : 
                        p.status === 'ACTIVE' || p.status === 'IN_PROGRESS' ? 'primary' : 
                        p.status === 'ON_HOLD' ? 'warning' : 
                        p.status === 'PLANNING' ? 'info' : 
                        p.status === 'ARCHIVED' ? 'dark' : 'secondary'
                      }>
                        {p.status}
                      </Badge>
                      <small className="text-muted">{new Date(p.createdAt).toLocaleDateString()}</small>
                    </div>
                    <Card.Title className="h5 mb-3">
                      <Link to={`/projects/${p.id}`} className="text-dark text-decoration-none hover-text-primary">
                        {p.title}
                      </Link>
                    </Card.Title>
                    <Card.Text className="text-muted small mb-4 flex-grow-1">
                      {p.summary ? (p.summary.length > 120 ? p.summary.substring(0, 120) + '...' : p.summary) : 'No summary provided.'}
                    </Card.Text>
                    
                    {p.tags && (
                      <div className="mb-4">
                        {p.tags.split(',').map((tag: string) => (
                          <Badge key={tag} bg="light" text="primary" className="me-1 border fw-normal">
                            #{tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                      <div className="small text-muted d-flex align-items-center">
                         <div className="bg-light rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                            <i className="bi bi-person text-primary"></i>
                         </div>
                         <span>{p.pi?.fullName || p.pi?.username || 'Unknown PI'}</span>
                      </div>
                      <div className="d-flex gap-2">
                        {canEdit && (
                          <Button size="sm" variant="outline-secondary" className="border-0" onClick={() => setEditing(p)} title="Edit Project">
                            <i className="bi bi-pencil"></i>
                          </Button>
                        )}
                        {canDelete && (
                          <Button size="sm" variant="outline-danger" className="border-0" onClick={() => handleDelete(p.id)} title="Delete Project">
                            <i className="bi bi-trash"></i>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col className="text-center py-5">
            <div className="opacity-25 mb-3">
               <i className="bi bi-search" style={{ fontSize: '4rem' }}></i>
            </div>
            <p className="text-muted fs-5">No projects found matching your search.</p>
            <Button variant="link" onClick={() => setSearchTerm('')}>Clear Search</Button>
          </Col>
        )}
      </Row>

      <Modal show={showNew || !!editing} onHide={() => { setShowNew(false); setEditing(null); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit Project' : 'Register New Research Project'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectForm 
            project={editing} 
            onSaved={handleSaved} 
            onCancel={() => { setShowNew(false); setEditing(null); }} 
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Projects;
