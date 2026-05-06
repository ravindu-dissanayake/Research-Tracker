import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Card, Badge, Row, Col, ListGroup, Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import Loading from '../components/Loading';
import api from '../services/api';
import * as projectsService from '../services/projects';
import * as milestonesService from '../services/milestones';
import * as documentsService from '../services/documents';
import * as membersService from '../services/projectMembers';
import { Table } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import ProjectForm from '../components/ProjectForm';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Milestone form state
  const [showMSModal, setShowMSModal] = useState(false);
  const [msEditing, setMsEditing] = useState<any>(null);
  const [msTitle, setMsTitle] = useState('');
  const [msDesc, setMsDesc] = useState('');
  const [msDueDate, setMsDueDate] = useState('');

  // Document form state
  const [showDocModal, setShowDocModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docDesc, setDocDesc] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [pRes, mRes, dRes, memRes] = await Promise.all([
        projectsService.fetchProject(id),
        milestonesService.fetchMilestones(id),
        documentsService.fetchDocuments(id),
        membersService.fetchProjectMembers(id)
      ]);
      setProject(pRes.data);
      setMilestones(mRes.data || []);
      setDocs(dRes.data || []);
      setMembers(memRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectUpdated = () => {
    setShowEditModal(false);
    loadData();
  };

  useEffect(() => { loadData(); }, [id]);

  // Permission Checks
  const isAdmin = user?.role === 'ADMIN';
  const isPI = user?.id === project?.pi?.id;
  const isMember = members.some(m => m.user?.id === user?.id);
  
  const canManageProject = isAdmin || isPI;
  const canContribute = isAdmin || isPI || isMember;

  const handleToggleMS = async (msId: any) => {
    if (!canContribute) return;
    try {
      await milestonesService.toggleMilestoneCompletion(msId);
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleSaveMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !canContribute) return;
    const payload = { title: msTitle, description: msDesc, dueDate: msDueDate };
    try {
      if (msEditing) await milestonesService.updateMilestone(msEditing.id, payload);
      else await milestonesService.createMilestone(id, payload);
      setShowMSModal(false);
      setMsEditing(null);
      setMsTitle(''); setMsDesc(''); setMsDueDate('');
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !canContribute) return;
    const payload = { title: docTitle, description: docDesc, urlOrPath: docUrl };
    try {
      await documentsService.createDocument(id, payload);
      setShowDocModal(false);
      setDocTitle(''); setDocDesc(''); setDocUrl('');
      loadData();
    } catch (err) { 
      console.error(err);
      alert('Failed to register document');
    }
  };

  const handleDeleteDoc = async (docId: any) => {
    if (!canManageProject) return;
    if (!confirm('Are you sure you want to remove this document reference?')) return;
    try {
      await documentsService.deleteDocument(docId);
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteMilestone = async (msId: any) => {
    if (!canManageProject) return;
    if (!confirm('Delete milestone?')) return;
    try {
      await milestonesService.deleteMilestone(msId);
      loadData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <Loading />;
  if (!project) return <div className="text-center py-5">Project not found</div>;

  const completedMilestones = milestones.filter(m => m.isCompleted).length;
  const progress = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  return (
    <div className="project-detail animate-fade-in">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <Button variant="link" className="p-0 mb-2 text-muted text-decoration-none hover-text-primary" onClick={() => navigate('/projects')}>
            <i className="bi bi-arrow-left me-1"></i> Back to Projects
          </Button>
          <h2 className="mb-1 fw-bold">{project.title}</h2>
          <div className="d-flex gap-2 align-items-center">
            <Badge pill bg={
               project.status === 'COMPLETED' ? 'success' : 
               project.status === 'ACTIVE' || project.status === 'IN_PROGRESS' ? 'primary' : 
               project.status === 'ON_HOLD' ? 'warning' : 
               project.status === 'PLANNING' ? 'info' : 
               project.status === 'ARCHIVED' ? 'dark' : 'secondary'
            }>
              {project.status}
            </Badge>
            <span className="text-muted small border-start ps-2">Ref: {project.id.substring(0, 8)}...</span>
          </div>
        </div>
        <div className="text-end d-none d-sm-block">
          <div className="small text-muted mb-2 fw-medium">Project Progress</div>
          <div style={{ width: '200px' }}>
            <ProgressBar now={progress} variant={progress === 100 ? 'success' : 'primary'} className="shadow-sm" style={{ height: '8px' }} />
            <div className="text-end small mt-1 fw-bold">{Math.round(progress)}% Complete</div>
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="overview" id="project-tabs" className="mb-4 custom-tabs">
        <Tab eventKey="overview" title="Overview">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Row>
                <Col lg={8}>
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">Research Summary</h5>
                    <p className="text-secondary lh-lg" style={{ whiteSpace: 'pre-wrap' }}>
                      {project.summary || 'No summary provided.'}
                    </p>
                  </div>
                  
                  {project.tags && (
                    <div className="mt-3">
                      <h6 className="fw-bold mb-2">Tags & Field</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {project.tags.split(',').map((t: string) => (
                          <Badge key={t} bg="light" text="primary" className="px-3 py-2 border fw-normal">#{t.trim()}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Col>
                <Col lg={4} className="border-start-lg ps-lg-4">
                  <h6 className="fw-bold mb-3">Project Meta</h6>
                  <ListGroup variant="flush" className="small">
                    <ListGroup.Item className="d-flex justify-content-between px-0 bg-transparent py-3">
                      <span className="text-muted"><i className="bi bi-person-badge me-2"></i>PI:</span>
                      <strong className="text-dark">{project.pi?.fullName || project.pi?.username}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0 bg-transparent py-3">
                      <span className="text-muted"><i className="bi bi-calendar-event me-2"></i>Start Date:</span>
                      <span className="fw-medium">{project.startDate || 'N/A'}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0 bg-transparent py-3">
                      <span className="text-muted"><i className="bi bi-calendar-check me-2"></i>End Date:</span>
                      <span className="fw-medium">{project.endDate || 'N/A'}</span>
                    </ListGroup.Item>
                  </ListGroup>

                  {canManageProject && (
                    <Card className="border-0 bg-blue-soft mt-4 p-3 shadow-sm">
                      <h6 className="fw-bold mb-3 d-flex align-items-center">
                        <i className="bi bi-gear-fill me-2 text-primary"></i> Management Actions
                      </h6>
                      <div className="d-grid gap-2">
                         <Button size="sm" variant="primary" className="text-start shadow-none" onClick={() => navigate(`/projects/${id}/members`)}>
                            <i className="bi bi-people-fill me-2"></i> Manage Research Team
                         </Button>
                         <Button size="sm" variant="outline-primary" className="text-start bg-white shadow-none" onClick={() => setShowEditModal(true)}>
                            <i className="bi bi-pencil-square me-2"></i> Edit Project Details
                         </Button>
                      </div>
                    </Card>
                  )}

                  <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                    <Modal.Header closeButton>
                      <Modal.Title>Edit Research Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <ProjectForm 
                        project={project} 
                        onSaved={handleProjectUpdated} 
                        onCancel={() => setShowEditModal(false)} 
                      />
                    </Modal.Body>
                  </Modal>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="milestones" title={`Milestones (${milestones.length})`}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 fw-bold">Project Milestones</h5>
                {canContribute && (
                  <Button size="sm" variant="primary" onClick={() => {
                    setMsEditing(null); setMsTitle(''); setMsDesc(''); setMsDueDate('');
                    setShowMSModal(true);
                  }}>
                    <i className="bi bi-plus-lg me-1"></i> Add Milestone
                  </Button>
                )}
              </div>
              
              <ListGroup variant="flush">
                {milestones.length > 0 ? (
                  milestones.map(m => (
                    <ListGroup.Item key={m.id} className="py-3 px-0 d-flex justify-content-between align-items-center border-bottom">
                      <div className="d-flex align-items-center">
                        <Form.Check 
                          type="checkbox" 
                          disabled={!canContribute}
                          checked={m.isCompleted} 
                          onChange={() => handleToggleMS(m.id)}
                          className="me-3 custom-checkbox"
                        />
                        <div>
                          <div className={m.isCompleted ? 'text-decoration-line-through text-muted fw-medium' : 'fw-bold'}>
                            {m.title}
                          </div>
                          <div className="small text-muted d-flex gap-2 align-items-center">
                             <span><i className="bi bi-calendar3 me-1"></i> {m.dueDate || 'No date'}</span>
                             {m.description && <span className="opacity-50">|</span>}
                             {m.description && <span className="text-truncate" style={{maxWidth: '200px'}}>{m.description}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-1">
                        {canContribute && (
                          <Button variant="link" size="sm" className="text-secondary" onClick={() => {
                            setMsEditing(m);
                            setMsTitle(m.title);
                            setMsDesc(m.description || '');
                            setMsDueDate(m.dueDate || '');
                            setShowMSModal(true);
                          }}><i className="bi bi-pencil"></i></Button>
                        )}
                        {canManageProject && (
                          <Button variant="link" size="sm" className="text-danger" onClick={() => handleDeleteMilestone(m.id)}>
                            <i className="bi bi-trash"></i>
                          </Button>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-list-check fs-1 d-block mb-2 opacity-25"></i>
                    No milestones defined for this project.
                  </div>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="documents" title={`Documents (${docs.length})`}>
           <div className="d-flex justify-content-between align-items-center mb-4">
             <h5 className="mb-0 fw-bold">Project Documents</h5>
             {canContribute && (
               <Button size="sm" variant="primary" onClick={() => setShowDocModal(true)}>
                 <i className="bi bi-file-earmark-plus me-1"></i> Register Document
               </Button>
             )}
           </div>
 
           <Card className="border-0 shadow-sm">
             <Card.Body className="p-0">
               <Table hover responsive className="mb-0 align-middle">
                 <thead className="bg-light">
                   <tr>
                     <th className="ps-4">Resource Details</th>
                     <th>Repository</th>
                     <th>Registered By</th>
                     <th className="text-end pe-4">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {docs.length > 0 ? (
                     docs.map(d => (
                       <tr key={d.id}>
                         <td className="ps-4">
                           <div className="d-flex align-items-center gap-3">
                             <div className="bg-light p-2 rounded text-primary">
                               <i className="bi bi-file-earmark-medical fs-5"></i>
                             </div>
                             <div>
                               <div className="fw-bold text-dark">{d.title}</div>
                               <div className="smaller text-muted text-truncate" style={{maxWidth: '200px'}}>{d.description || 'Reference material'}</div>
                             </div>
                           </div>
                         </td>
                         <td><Badge pill bg="light" text="dark" className="border fw-normal">EXTERNAL LINK</Badge></td>
                         <td>
                            <div className="small fw-medium text-dark">{d.uploadedBy?.fullName || 'Researcher'}</div>
                            <div className="extra-small text-muted">{new Date(d.uploadedAt).toLocaleDateString()}</div>
                         </td>
                         <td className="text-end pe-4">
                           <div className="d-flex justify-content-end gap-2">
                             <Button variant="outline-primary" size="sm" as="a" href={d.urlOrPath} target="_blank" rel="noopener noreferrer">
                               <i className="bi bi-box-arrow-up-right me-1"></i> View
                             </Button>
                             {canManageProject && (
                               <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDoc(d.id)}>
                                 <i className="bi bi-trash"></i>
                               </Button>
                             )}
                           </div>
                         </td>
                       </tr>
                     ))
                   ) : (
                     <tr><td colSpan={4} className="text-center py-5 text-muted">No research documents registered yet.</td></tr>
                   )}
                 </tbody>
               </Table>
             </Card.Body>
           </Card>
        </Tab>
 
         <Tab eventKey="members" title={`Team (${members.length})`}>
           <div className="d-flex justify-content-between align-items-center mb-4">
             <h5 className="mb-0 fw-bold">Project Team</h5>
             {canManageProject && (
               <Button size="sm" variant="outline-primary" onClick={() => navigate(`/projects/${id}/members`)}>
                 <i className="bi bi-people me-1"></i> Manage Team
               </Button>
             )}
           </div>
           <Row>
             {members.map(m => (
               <Col md={6} lg={4} key={m.id} className="mb-4">
                 <Card className="border-0 shadow-sm h-100 hover-lift">
                   <Card.Body className="d-flex align-items-center p-3">
                     <div className="bg-blue-soft text-primary rounded-circle p-3 me-3">
                       <i className="bi bi-person fs-4"></i>
                     </div>
                     <div>
                       <h6 className="mb-1 fw-bold">{m.user?.fullName || m.user?.username}</h6>
                       <div className="d-flex gap-2 align-items-center">
                         <Badge bg="info" className="fw-normal smaller">{m.role}</Badge>
                         <small className="text-muted text-truncate" style={{maxWidth: '120px'}}>{m.user?.email}</small>
                       </div>
                     </div>
                   </Card.Body>
                 </Card>
               </Col>
             ))}
           </Row>
         </Tab>
       </Tabs>
 
       {/* Milestone Modal */}
       <Modal show={showMSModal} onHide={() => { setShowMSModal(false); setMsEditing(null); }} centered>
         <Modal.Header closeButton className="border-0 pb-0">
           <Modal.Title className="fw-bold">{msEditing ? 'Edit' : 'Add'} Milestone</Modal.Title>
         </Modal.Header>
         <Modal.Body className="pt-4">
           <Form onSubmit={handleSaveMS}>
             <Form.Group className="mb-3">
               <Form.Label className="fw-medium small">Milestone Title</Form.Label>
               <Form.Control 
                 placeholder="e.g. Completion of Phase 1"
                 value={msTitle} 
                 onChange={e => setMsTitle(e.target.value)} 
                 required 
               />
             </Form.Group>
             <Form.Group className="mb-3">
               <Form.Label className="fw-medium small">Description</Form.Label>
               <Form.Control 
                 as="textarea" 
                 rows={3} 
                 placeholder="Optional details..."
                 value={msDesc} 
                 onChange={e => setMsDesc(e.target.value)} 
               />
             </Form.Group>
             <Form.Group className="mb-4">
               <Form.Label className="fw-medium small">Target Date</Form.Label>
               <Form.Control 
                 type="date" 
                 value={msDueDate} 
                 onChange={e => setMsDueDate(e.target.value)} 
               />
             </Form.Group>
             <div className="d-grid">
               <Button type="submit" variant="primary" className="py-2 fw-bold shadow-sm">
                 {msEditing ? 'Update Milestone' : 'Register Milestone'}
               </Button>
             </div>
           </Form>
         </Modal.Body>
       </Modal>
 
       {/* Document Modal */}
       <Modal show={showDocModal} onHide={() => setShowDocModal(false)} centered>
         <Modal.Header closeButton className="border-0 pb-0">
           <Modal.Title className="fw-bold">Register Document</Modal.Title>
         </Modal.Header>
         <Modal.Body className="pt-4">
           <Form onSubmit={handleSaveDoc}>
             <Form.Group className="mb-3">
               <Form.Label className="fw-medium small">Document Title</Form.Label>
               <Form.Control 
                 placeholder="e.g. Initial Research Findings"
                 value={docTitle} 
                 onChange={e => setDocTitle(e.target.value)} 
                 required 
               />
             </Form.Group>
             <Form.Group className="mb-3">
               <Form.Label className="fw-medium small">Description</Form.Label>
               <Form.Control 
                 as="textarea" 
                 rows={2} 
                 placeholder="Brief overview of the document..."
                 value={docDesc} 
                 onChange={e => setDocDesc(e.target.value)} 
               />
             </Form.Group>
             <Form.Group className="mb-4">
               <Form.Label className="fw-medium small">URL or Path</Form.Label>
               <Form.Control 
                 placeholder="https://drive.google.com/..."
                 value={docUrl} 
                 onChange={e => setDocUrl(e.target.value)} 
                 required 
               />
               <Form.Text className="text-muted extra-small">Link to your shared research files or internal path.</Form.Text>
             </Form.Group>
             <div className="d-grid">
               <Button type="submit" variant="success" className="py-2 fw-bold shadow-sm">
                 Save Reference
               </Button>
             </div>
           </Form>
         </Modal.Body>
       </Modal>
     </div>
   );
 };
 
 export default ProjectDetail;
