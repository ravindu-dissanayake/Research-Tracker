import api from './api';

export const fetchUsers = () => api.get('/api/users');
export const fetchCurrentUser = () => api.get('/api/users/me');
export const updateUserRole = (id: string, role: 'ADMIN' | 'PI' | 'MEMBER' | 'VIEWER') =>
  api.put(`/api/users/${id}/role`, { role });
export const deleteUser = (id: string) => api.delete(`/api/users/${id}`);

export const createUser = (data: any) => api.post('/api/users', data);

export default { fetchUsers, fetchCurrentUser, updateUserRole, deleteUser, createUser };
