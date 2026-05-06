import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Documents from './pages/Documents';
import Milestones from './pages/Milestones';
import Profile from './pages/Profile';
import ProjectMembers from './pages/ProjectMembers';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavBar />
      <main className="app-shell">
        <div className="container app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/projects/:id/members" element={<ProjectMembers />} />
              <Route path="/milestones" element={<Milestones />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="/admin" element={<Users />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </AuthProvider>
  );
};

export default App;
