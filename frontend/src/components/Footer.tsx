import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer" style={{marginTop: 'auto'}}>
      <Container className="py-5">
        <Row className="mb-4">
          {/* Company Info */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <div className="d-flex align-items-center mb-3">
              <div 
                className="text-white rounded me-3" 
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                <i className="bi bi-journal-check"></i>
              </div>
              <h6 className="mb-0 fw-bold" style={{color: '#2563eb'}}>ResearchTracker</h6>
            </div>
            <p className="text-secondary" style={{fontSize: '0.9rem', lineHeight: 1.6}}>
              Modern research project management platform designed for collaborative teams and efficient workflow management.
            </p>
          </Col>

          {/* Product Links */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h6 className="fw-bold mb-3" style={{color: '#1f2937'}}>Product</h6>
            <ul className="list-unstyled" style={{fontSize: '0.9rem'}}>
              <li className="mb-2">
                <a href="#features" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>Features</a>
              </li>
              <li className="mb-2">
                <a href="#projects" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>Projects</a>
              </li>
              <li className="mb-2">
                <a href="#dashboard" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>Dashboard</a>
              </li>
              <li>
                <a href="#pricing" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>Pricing</a>
              </li>
            </ul>
          </Col>

          {/* Resources */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h6 className="fw-bold mb-3" style={{color: '#1f2937'}}>Resources</h6>
            <ul className="list-unstyled" style={{fontSize: '0.9rem'}}>
              <li className="mb-2">
                <a href="#docs" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>Documentation</a>
              </li>
              <li className="mb-2">
                <a href="#blog" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>Blog</a>
              </li>
              <li className="mb-2">
                <a href="#support" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>Support</a>
              </li>
              <li>
                <a href="#api" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>API Docs</a>
              </li>
            </ul>
          </Col>

          {/* Company */}
          <Col lg={4} md={6}>
            <h6 className="fw-bold mb-3" style={{color: '#1f2937'}}>Company</h6>
            <ul className="list-unstyled" style={{fontSize: '0.9rem'}}>
              <li className="mb-2">
                <a href="#about" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>About Us</a>
              </li>
              <li className="mb-2">
                <a href="#careers" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>Careers</a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>Contact</a>
              </li>
              <li>
                <a href="#status" className="text-decoration-none text-secondary" style={{transition: 'color 0.2s'}}>Status</a>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Divider */}
        <div style={{height: '1px', background: '#e5e7eb', margin: '2rem 0'}}></div>

        {/* Bottom Section */}
        <Row className="align-items-center">
          <Col md={6} className="mb-3 mb-md-0">
            <p style={{fontSize: '0.85rem', color: '#6b7280', margin: 0}}>
              &copy; {currentYear} ResearchTracker. All rights reserved. Built for CMJD.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="d-flex justify-content-md-end gap-3" style={{fontSize: '0.85rem'}}>
              <a href="#privacy" className="text-decoration-none text-secondary" style={{color: '#6b7280'}}>Privacy Policy</a>
              <span style={{color: '#d1d5db'}}>•</span>
              <a href="#terms" className="text-decoration-none text-secondary" style={{color: '#6b7280'}}>Terms of Service</a>
              <span style={{color: '#d1d5db'}}>•</span>
              <a href="#cookies" className="text-decoration-none text-secondary" style={{color: '#6b7280'}}>Cookie Policy</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
