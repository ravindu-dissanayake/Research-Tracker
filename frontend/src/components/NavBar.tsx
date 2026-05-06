import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
 
const NavBar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Navbar expand="lg" className="app-navbar" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-mark d-flex align-items-center">
          <div className="bg-primary text-white rounded p-1 me-2" style={{lineHeight: 1}}>
            <i className="bi bi-journal-check"></i>
          </div>
          <span>ResearchTracker</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={NavLink} to="/projects">Projects</Nav.Link>
                <Nav.Link as={NavLink} to="/milestones">Milestones</Nav.Link>
                <Nav.Link as={NavLink} to="/documents">Documents</Nav.Link>
              </>
            )}
            {user?.role === 'ADMIN' && (
              <Nav.Link as={NavLink} to="/admin" className="text-primary fw-bold">Manage Users</Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-center">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">
                  <Button variant="primary" size="sm" className="px-3">Get Started</Button>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/profile" className="d-flex align-items-center">
                  <div className="bg-light rounded-circle p-1 me-2" style={{width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <i className="bi bi-person text-primary"></i>
                  </div>
                  {user?.fullName || user?.username}
                </Nav.Link>
                <Button variant="outline-danger" size="sm" className="ms-3" onClick={() => logout()}>
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
