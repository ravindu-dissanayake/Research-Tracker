import api from './api';

export const fetchDocuments = (projectId?: string) => {
  if (projectId) return api.get(`/api/projects/${projectId}/documents`);
  return api.get('/api/documents');
};

export const createDocument = (projectId: string, data: any) => {
  return api.post(`/api/projects/${projectId}/documents`, data);
};

export const deleteDocument = (id: string | number) => api.delete(`/api/documents/${id}`);

export default { fetchDocuments, createDocument, deleteDocument };
