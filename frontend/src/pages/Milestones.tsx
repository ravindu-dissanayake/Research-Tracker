import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Button, Form, ProgressBar, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import * as milestonesService from '../services/milestones';
import * as projectsService from '../services/projects';
import { useAuth } from '../contexts/AuthContext';

const Milestones: React.FC = () => {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredMilestones, setFilteredMilestones] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Form state
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  const canAdd = user?.role === 'ADMIN' || user?.role === 'PI' || user?.role === 'MEMBER';

  const load = async () => {
    setLoading(true);
    try {
      const [mRes, pRes] = await Promise.all([
        milestonesService.fetchMilestones(),
        projectsService.fetchProjects()
      ]);
      setMilestones(mRes.data || []);
      setFilteredMilestones(mRes.data || []);
      setProjects(pRes.data || []);
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
    setFilteredMilestones(
      milestones.filter(m => 
        (m.title?.toLowerCase().includes(term)) || 
        (m.description?.toLowerCase().includes(term)) ||
        (m.projectTitle?.toLowerCase().includes(term))
      )
    );
  }, [searchTerm, milestones]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) { alert('Please select a project'); return; }
    setSaving(true);
    try {
      await milestonesService.createMilestone(selectedProjectId, { title, description, dueDate });
      setShowModal(false);
      setTitle(''); setDescription(''); setDueDate(''); setSelectedProjectId('');
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to add milestone');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await milestonesService.toggleMilestoneCompletion(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  const completedCount = milestones.filter(m => m.isCompleted).length;
  const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Research Milestones</h3>
          <p className="text-muted small mb-0">Track deadlines and research progress across all active projects.</p>
        </div>
        <div className="d-flex gap-3 align-items-center text-end">
           {canAdd && (
             <Button variant="primary" className="shadow-sm" onClick={() => {
                setSelectedProjectId(''); setTitle(''); setDescription(''); setDueDate('');
                setShowModal(true);
             }}>
                <i className="bi bi-plus-lg me-2"></i> Add Milestone
             </Button>
           )}
           <div className="d-none d-sm-block">
              <div className="small text-muted mb-1 fw-medium">Global Completion</div>
              <ProgressBar now={progress} variant="success" className="shadow-sm" style={{height: '10px', width: '150px'}} />
              <div className="extra-small mt-1 fw-bold">{Math.round(progress)}% Overall Progress</div>
           </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-3">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <Form.Control 
                  className="border-start-0 ps-0 shadow-none"
                  placeholder="Search milestones or projects..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col md={6} className="text-md-end mt-3 mt-md-0 text-muted small">
               <i className="bi bi-info-circle me-1"></i> Register new goals or update existing research milestones.
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        {filteredMilestones.length > 0 ? (
          filteredMilestones.map(m => (
            <Col lg={6} key={m.id} className="mb-4">
              <Card className={`border-0 shadow-sm h-100 hover-lift ${m.isCompleted ? 'opacity-75' : ''}`}>
                <Card.Body className="p-4 d-flex">
                  <div className="me-3">
                    <Form.Check 
                      type="checkbox" 
                      className="custom-checkbox fs-4"
                      checked={m.isCompleted}
                      onChange={() => handleToggle(m.id)}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                       <h5 className={`mb-0 fw-bold ${m.isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>{m.title}</h5>
                       <Badge bg={m.isCompleted ? 'success' : 'primary'} className="shadow-sm">
                         {m.isCompleted ? 'Completed' : 'Pending'}
                       </Badge>
                    </div>
                    
                    <p className="text-secondary small mb-3">{m.description || 'No detailed description.'}</p>
                    
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                       <div className="small text-muted">
                          <i className="bi bi-calendar3 me-1"></i> Due: <span className="fw-medium text-dark">{m.dueDate || 'Unscheduled'}</span>
                       </div>
                       <Badge bg="light" text="dark" className="border">
                          {m.projectId ? (
                            <Link to={`/projects/${m.projectId}`} className="text-decoration-none text-dark">
                               <i className="bi bi-journal-code me-1"></i> Project Link
                            </Link>
                          ) : 'Global Task'}
                       </Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center py-5 text-muted">
            <i className="bi bi-list-check fs-1 d-block mb-2 opacity-25"></i>
            No milestones found matching your criteria.
          </Col>
        )}
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Define New Research Milestone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-muted text-uppercase">Associated Project</Form.Label>
              <Form.Select 
                value={selectedProjectId} 
                onChange={e => setSelectedProjectId(e.target.value)} 
                required
                className="bg-light border-0 py-2"
              >
                <option value="">Select Project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-muted text-uppercase">Milestone Title</Form.Label>
              <Form.Control 
                className="bg-light border-0 py-2"
                placeholder="e.g. Data Collection, Initial Analysis"
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-muted text-uppercase">Goal Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                className="bg-light border-0"
                placeholder="Describe the specific objectives of this milestone..."
                value={description} 
                onChange={e => setDescription(e.target.value)} 
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold small text-muted text-uppercase">Target Due Date</Form.Label>
              <Form.Control 
                type="date"
                className="bg-light border-0 py-2"
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
                required 
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <Button variant="link" className="text-muted text-decoration-none" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={saving} className="px-4 shadow-sm">
                {saving ? 'Creating...' : 'Add Milestone'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Milestones;
