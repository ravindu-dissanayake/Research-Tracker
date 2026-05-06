import api from './api';

export const fetchMilestones = (projectId?: string) => {
    if (projectId) return api.get(`/api/projects/${projectId}/milestones`);
    return api.get('/api/milestones');
};
export const fetchMilestone = (id: string | number) => api.get(`/api/milestones/${id}`);
export const createMilestone = (projectId: string, payload: any) => api.post(`/api/projects/${projectId}/milestones`, payload);
export const updateMilestone = (id: string | number, payload: any) => api.put(`/api/milestones/${id}`, payload);
export const toggleMilestoneCompletion = (id: string | number) => api.patch(`/api/milestones/${id}/toggle-completion`);
export const deleteMilestone = (id: string | number) => api.delete(`/api/milestones/${id}`);

export default {
	fetchMilestones,
	fetchMilestone,
	createMilestone,
	updateMilestone,
	toggleMilestoneCompletion,
	deleteMilestone,
};
