// Declarations for static asset imports to satisfy TypeScript
declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  const content: any;
  export default content;
}

// Allow importing react-router-bootstrap without @types package
declare module 'react-router-bootstrap';
