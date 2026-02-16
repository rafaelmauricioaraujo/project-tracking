import { createContext, useState, useCallback } from 'react';
import { projectService } from '../services/projectService';

export const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '', page: 1, limit: 10 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchProjects = useCallback(async (overrideFilters) => {
    try {
      setLoading(true);
      setError(null);
      const activeFilters = overrideFilters || filters;
      const result = await projectService.getAll(activeFilters);
      setProjects(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createProject = useCallback(async (data) => {
    const project = await projectService.create(data);
    return project;
  }, []);

  const updateProject = useCallback(async (id, data) => {
    const project = await projectService.update(id, data);
    return project;
  }, []);

  const deleteProject = useCallback(async (id) => {
    await projectService.delete(id);
  }, []);

  const value = {
    projects,
    loading,
    error,
    filters,
    pagination,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    setFilters,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
