import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Card, Row, Col, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import * as documentsService from '../services/documents';
import * as projectsService from '../services/projects';
import { useAuth } from '../contexts/AuthContext';

const Documents: React.FC = () => {
  const [docs, setDocs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Form state
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const canAdd = user?.role === 'ADMIN' || user?.role === 'PI' || user?.role === 'MEMBER';

  const load = async () => {
    setLoading(true);
    try { 
        const [dRes, pRes] = await Promise.all([
          documentsService.fetchDocuments(),
          projectsService.fetchProjects()
        ]);
        setDocs(dRes.data || []); 
        setFilteredDocs(dRes.data || []);
        setProjects(pRes.data || []);
    }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredDocs(
      docs.filter(d => 
        (d.title?.toLowerCase().includes(term)) || 
        (d.description?.toLowerCase().includes(term)) ||
        (d.projectTitle?.toLowerCase().includes(term))
      )
    );
  }, [searchTerm, docs]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) { alert('Please select a project'); return; }
    setSaving(true);
    try {
      await documentsService.createDocument(selectedProjectId, { title, description, urlOrPath: url });
      setShowModal(false);
      setTitle(''); setDescription(''); setUrl(''); setSelectedProjectId('');
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to register document');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research document?')) return;
    try { 
      await documentsService.deleteDocument(id); 
      load(); 
    } catch (err) { 
      console.error(err); 
      alert('Failed to delete document');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Shared Documents</h3>
          <p className="text-muted small mb-0">Access research papers, experimental data, and project reports.</p>
        </div>
        <div className="d-flex gap-2">
           {canAdd && (
             <Button variant="primary" className="shadow-sm" onClick={() => setShowModal(true)}>
                <i className="bi bi-file-earmark-plus me-2"></i> Register Document
             </Button>
           )}
           <Badge bg="success" className="px-3 py-2 shadow-sm d-flex align-items-center">{docs.length} Total Files</Badge>
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
                  placeholder="Search by title, description or project..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col md={6} className="text-md-end mt-3 mt-md-0">
               <span className="text-muted small italic">Note: Upload new documents directly within individual project pages.</span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light small text-muted text-uppercase">
              <tr>
                <th className="ps-4">Document Details</th>
                <th>Project</th>
                <th>Uploaded By</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length > 0 ? (
                filteredDocs.map(d => (
                  <tr key={d.id}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-blue-soft text-primary rounded d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                          <i className="bi bi-file-earmark-pdf-fill fs-4"></i>
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{d.title}</div>
                          <div className="small text-muted text-truncate" style={{maxWidth: '200px'}}>{d.description || 'No description provided.'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="border">
                        {d.projectId ? (
                           <Link to={`/projects/${d.projectId}`} className="text-decoration-none text-dark">Project Reference</Link>
                        ) : 'System wide'}
                      </Badge>
                    </td>
                    <td>
                       <div className="small fw-medium text-dark">{d.uploadedBy?.fullName || 'Researcher'}</div>
                       <div className="extra-small text-muted">{d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString() : 'Recent'}</div>
                    </td>
                    <td className="text-end pe-4">
                       <div className="d-flex justify-content-end gap-2">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="border shadow-sm"
                            as="a" 
                            href={d.urlOrPath} 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="bi bi-eye-fill me-1"></i> View
                          </Button>
                          {(user?.role === 'ADMIN' || user?.id === d.uploadedBy?.id) && (
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => handleDelete(d.id)}
                            >
                              <i className="bi bi-trash-fill"></i>
                            </Button>
                          )}
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
                    <i className="bi bi-file-earmark-x fs-1 d-block mb-2 opacity-25"></i>
                    No research documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Register Research Document</Modal.Title>
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
              <Form.Label className="fw-bold small text-muted text-uppercase">Document Title</Form.Label>
              <Form.Control 
                className="bg-light border-0 py-2"
                placeholder="e.g. Analysis Report, Lab Notes"
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-muted text-uppercase">Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                className="bg-light border-0"
                placeholder="Brief summary of the document's content..."
                value={description} 
                onChange={e => setDescription(e.target.value)} 
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold small text-muted text-uppercase">Resource URL</Form.Label>
              <Form.Control 
                className="bg-light border-0 py-2"
                placeholder="https://drive.google.com/..."
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                required 
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <Button variant="link" className="text-muted text-decoration-none" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={saving} className="px-4 shadow-sm">
                {saving ? 'Registering...' : 'Register Document'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Documents;
