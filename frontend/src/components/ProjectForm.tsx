import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import * as projectsService from '../services/projects';
import * as usersService from '../services/users';
import { useAuth } from '../contexts/AuthContext';

const ProjectStatus = ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'];

interface ProjectFormProps {
  project?: any;
  onSaved?: (p: any) => void;
  onCancel?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSaved, onCancel }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(project?.title || '');
  const [summary, setSummary] = useState(project?.summary || '');
  const [status, setStatus] = useState(project?.status || 'PLANNING');
  const [piId, setPiId] = useState(project?.pi?.id || '');
  const [tags, setTags] = useState(project?.tags || '');
  const [startDate, setStartDate] = useState(project?.startDate || '');
  const [endDate, setEndDate] = useState(project?.endDate || '');
  
  const [users, setUsers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    // If user is PI and creating new project, set themselves as PI
    if (!project?.id && user?.role === 'PI' && !piId) {
      setPiId(user.id);
    }

    if (isAdmin) {
      const loadUsers = async () => {
        try {
          const res = await usersService.fetchUsers();
          setUsers(res.data || []);
        } catch (err) {
          console.error('Failed to load users', err);
        }
      };
      loadUsers();
    }
  }, [isAdmin, user, project, piId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { title, summary, status, piId, tags, startDate, endDate };
    
    try {
      if (project?.id) {
        const res = await projectsService.updateProject(project.id, payload);
        onSaved && onSaved(res.data);
      } else {
        const res = await projectsService.createProject(payload);
        onSaved && onSaved(res.data);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving project. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="project-form">
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold text-muted small text-uppercase">Project Title</Form.Label>
        <Form.Control 
          className="py-2 border-0 bg-light focus-ring"
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          placeholder="Research name or objective..."
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold text-muted small text-uppercase">Project Summary</Form.Label>
        <Form.Control 
          as="textarea" 
          rows={4} 
          className="py-2 border-0 bg-light focus-ring"
          value={summary} 
          onChange={e => setSummary(e.target.value)} 
          placeholder="What is this research about?"
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold text-muted small text-uppercase">Status</Form.Label>
            <Form.Select className="py-2 border-0 bg-light focus-ring" value={status} onChange={e => setStatus(e.target.value)}>
              {ProjectStatus.map(s => <option key={s} value={s}>{s}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          {isAdmin ? (
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-muted small text-uppercase">Principal Investigator</Form.Label>
              <Form.Select 
                className="py-2 border-0 bg-light focus-ring"
                value={piId} 
                onChange={e => setPiId(e.target.value)} 
                required
              >
                <option value="">Select PI</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.fullName || u.username}</option>
                ))}
              </Form.Select>
            </Form.Group>
          ) : (
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-muted small text-uppercase">Principal Investigator</Form.Label>
              <Form.Control 
                className="py-2 border-0 bg-light"
                value={user?.fullName || user?.username}
                disabled
              />
              <Form.Text className="text-muted smaller">PI is automatically set to your account.</Form.Text>
            </Form.Group>
          )}
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold text-muted small text-uppercase">Tags (Keywords)</Form.Label>
        <Form.Control 
          className="py-2 border-0 bg-light focus-ring"
          value={tags} 
          onChange={e => setTags(e.target.value)} 
          placeholder="e.g. AI, Quantum, Medical"
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold text-muted small text-uppercase">Start Date</Form.Label>
            <Form.Control 
              className="py-2 border-0 bg-light focus-ring"
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold text-muted small text-uppercase">Project End Date</Form.Label>
            <Form.Control 
              className="py-2 border-0 bg-light focus-ring"
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end mt-4 pt-3 border-top">
        <Button variant="link" className="me-3 text-muted text-decoration-none" onClick={onCancel}>
          Discard Changes
        </Button>
        <Button type="submit" variant="primary" className="px-5 shadow-sm" disabled={saving}>
          {saving ? 'Processing...' : (project?.id ? 'Update Project' : 'Create Project')}
        </Button>
      </div>
    </Form>
  );
};

export default ProjectForm;
