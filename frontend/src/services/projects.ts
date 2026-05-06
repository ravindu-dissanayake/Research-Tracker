import api from './api';

export const fetchProjects = () => api.get('/api/projects');
export const fetchProject = (id: string | number) => api.get(`/api/projects/${id}`);
export const createProject = (payload: any) => api.post('/api/projects', payload);
export const updateProject = (id: string | number, payload: any) => api.put(`/api/projects/${id}`, payload);
export const deleteProject = (id: string | number) => api.delete(`/api/projects/${id}`);

export default { fetchProjects, fetchProject, createProject, updateProject, deleteProject };
