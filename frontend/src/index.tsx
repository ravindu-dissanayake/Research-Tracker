import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const container = document.getElementById('root') as HTMLElement | null;
if (!container) throw new Error('Root element #root not found');

const basenameEnv = process.env.REACT_APP_BASENAME;
const basename = typeof basenameEnv === 'string' && basenameEnv.length > 0 ? basenameEnv : '/';
const root = createRoot(container as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
