import api from './api';

export const projectService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/projects?${params}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/projects', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/projects/${id}`);
  },
};
