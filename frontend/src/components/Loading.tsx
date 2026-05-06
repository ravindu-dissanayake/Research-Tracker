import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading: React.FC<{message?: string}> = ({ message }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '200px' }}>
    <Spinner 
      animation="border" 
      variant="primary" 
      role="status" 
      style={{ width: '3rem', height: '3rem', borderWidth: '0.25rem' }}
      className="mb-3"
    />
    <span className="text-muted fw-bold text-uppercase small" style={{ letterSpacing: '0.1em' }}>
        {message || 'Please Wait...'}
    </span>
  </div>
);

export default Loading;
