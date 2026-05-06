import React, { useEffect, useState } from 'react';
import { ListGroup, Button, Form, Card, Row, Col, Badge } from 'react-bootstrap';
import Loading from '../components/Loading';
import { useParams, useNavigate } from 'react-router-dom';
import * as memberService from '../services/projectMembers';
import * as usersService from '../services/users';
import * as projectsService from '../services/projects';
import { useAuth } from '../contexts/AuthContext';

const ProjectMembers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [filteredAvailableUsers, setFilteredAvailableUsers] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [pRes, mRes, uRes] = await Promise.all([
        projectsService.fetchProject(id),
        memberService.fetchProjectMembers(id),
        usersService.fetchUsers()
      ]);
      
      setProject(pRes.data);
      setMembers(mRes.data || []);
      
      // Filter out users who are already members
      const currentMemberIds = mRes.data?.map((m: any) => m.user?.id || m.userId) || [];
      const piId = pRes.data?.pi?.id;
      
      const nonMembers = (uRes.data || []).filter((u: any) => 
        !currentMemberIds.includes(u.id) && u.id !== piId
      );
      setAvailableUsers(nonMembers);
      setFilteredAvailableUsers(nonMembers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = userSearchTerm.toLowerCase();
    setFilteredAvailableUsers(
      availableUsers.filter(u => 
        (u.fullName?.toLowerCase().includes(term)) || 
        (u.username?.toLowerCase().includes(term)) ||
        (u.email?.toLowerCase().includes(term))
      )
    );
  }, [userSearchTerm, availableUsers]);

  useEffect(() => {
    loadData();
  }, [id]);

  const isAdmin = user?.role === 'ADMIN';
  const isPI = user?.id === project?.pi?.id;
  const canManageTeam = isAdmin || isPI;

  const handleAdd = async () => {
    if (!id || !selectedUserId || !canManageTeam) return;
    try {
      await memberService.addProjectMember(id, selectedUserId);
      setSelectedUserId('');
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to add member');
    }
  };

  const handleRemove = async (memberUserId: string) => {
    if (!id || !canManageTeam) return;
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await memberService.removeProjectMember(id, memberUserId);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to remove member');
    }
  };

  if (loading) return <Loading />;
  if (!project) return <div className="text-center py-5">Project not found</div>;

  return (
    <div className="project-members animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <Button variant="link" className="p-0 mb-1 text-decoration-none hover-text-primary" onClick={() => navigate(`/projects/${id}`)}>
             <i className="bi bi-arrow-left me-1"></i> Back to Project Details
           </Button>
           <h3 className="fw-bold">Project Team: {project.title}</h3>
        </div>
        <Badge pill bg="primary" className="px-3 py-2">{members.length + 1} Members</Badge>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white py-3 border-bottom-0">
               <h5 className="mb-0 fw-bold">Active Members</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {/* Show PI first */}
              <ListGroup.Item className="py-3 px-4 d-flex justify-content-between align-items-center bg-blue-soft border-bottom-0">
                <div className="d-flex align-items-center">
                   <div className="bg-primary text-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{width: '42px', height: '42px'}}>
                      <i className="bi bi-person-workspace fs-4"></i>
                   </div>
                   <div>
                      <div className="fw-bold text-dark">{project.pi?.fullName || project.pi?.username}</div>
                      <div className="text-muted smaller fw-medium"><Badge bg="dark">Principal Investigator</Badge></div>
                   </div>
                </div>
                <span className="text-muted small">Project Owner</span>
              </ListGroup.Item>

              {members.length > 0 ? (
                members.map(m => (
                  <ListGroup.Item key={m.id} className="py-3 px-4 d-flex justify-content-between align-items-center border-bottom-0 hover-bg">
                    <div className="d-flex align-items-center">
                       <div className="bg-light text-primary rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{width: '42px', height: '42px'}}>
                          <i className="bi bi-person-fill fs-4"></i>
                       </div>
                       <div>
                          <div className="fw-bold text-dark">{m.user?.fullName || m.fullName || m.username}</div>
                          <div className="text-muted smaller">Role: <Badge bg="light" text="dark" className="border fw-normal">{m.userRole || 'Researcher'}</Badge></div>
                       </div>
                    </div>
                    {canManageTeam && (
                      <Button 
                        size="sm" 
                        variant="outline-danger" 
                        className="border-0 hover-lift"
                        onClick={() => handleRemove(m.user?.id || m.userId)}
                        title="Remove Member"
                      >
                        <i className="bi bi-person-dash fs-5"></i>
                      </Button>
                    )}
                  </ListGroup.Item>
                ))
              ) : (
                <div className="text-center py-5 text-muted border-top">
                   <i className="bi bi-people fs-1 d-block mb-2 opacity-25"></i>
                   <p className="mb-0">No research members added to this team yet.</p>
                </div>
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col lg={4}>
          {canManageTeam ? (
            <>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white py-3 border-0">
                   <h6 className="mb-0 fw-bold">Add New Researcher</h6>
                </Card.Header>
                <Card.Body className="pt-0">
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-muted fw-bold text-uppercase">Find Researcher</Form.Label>
                    <div className="input-group mb-2">
                       <span className="input-group-text bg-light border-0"><i className="bi bi-search small"></i></span>
                       <Form.Control 
                         className="bg-light border-0 py-2 small" 
                         placeholder="Search by name or email..." 
                         value={userSearchTerm}
                         onChange={e => setUserSearchTerm(e.target.value)}
                       />
                    </div>
                    <Form.Select 
                      className="py-2 bg-light border-0"
                      value={selectedUserId} 
                      onChange={(e) => setSelectedUserId(e.target.value)}
                    >
                      <option value="">Choose user...</option>
                      {filteredAvailableUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.fullName || u.username} ({u.role})</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    className="w-100 py-2 shadow-sm" 
                    onClick={handleAdd}
                    disabled={!selectedUserId}
                  >
                    <i className="bi bi-person-plus me-2"></i> Add to Team
                  </Button>
                </Card.Body>
              </Card>
              
              <Card className="bg-blue-soft border-0 shadow-sm p-4">
                 <h6 className="fw-bold mb-2"><i className="bi bi-shield-check text-primary me-2"></i>Team Permissions</h6>
                 <p className="smaller text-muted mb-0">
                    Added members will have full access to view milestones and contribute research documents to this project.
                 </p>
              </Card>
            </>
          ) : (
            <Card className="border-0 shadow-sm p-4 bg-light text-center">
               <i className="bi bi-lock fs-1 text-muted mb-2"></i>
               <h6 className="fw-bold">Management Restricted</h6>
               <p className="smaller text-muted mb-0">
                 Only the project PI and Administrators can manage the research team composition.
               </p>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProjectMembers;
