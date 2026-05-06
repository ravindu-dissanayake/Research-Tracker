import api from './api';

export const fetchProjectMembers = (projectId: string) => api.get(`/api/projects/${projectId}/members`);
export const addProjectMember = (projectId: string, userId: string) =>
  api.post(`/api/projects/${projectId}/members`, { userId });
export const removeProjectMember = (projectId: string, userId: string) =>
  api.delete(`/api/projects/${projectId}/members/${userId}`);

export default { fetchProjectMembers, addProjectMember, removeProjectMember };
