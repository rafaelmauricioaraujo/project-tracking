import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useDebounce } from '../hooks/useDebounce';
import ProjectList from '../components/project/ProjectList';
import ProjectFilters from '../components/project/ProjectFilters';
import DeleteConfirmModal from '../components/project/DeleteConfirmModal';
import Button from '../components/common/Button';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects, loading, error, fetchProjects, updateProject, deleteProject } = useProjects();

  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || '',
    page: 1,
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(filters.search);

  const loadProjects = useCallback(() => {
    const params = { ...filters, search: debouncedSearch };
    if (!params.status) delete params.status;
    if (!params.search) delete params.search;
    fetchProjects(params);
  }, [filters.status, filters.page, debouncedSearch, fetchProjects]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    setSearchParams(params, { replace: true });
  }, [filters.status, filters.search, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (project) => {
    setDeleteTarget(project);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteProject(deleteTarget.id);
      setDeleteTarget(null);
      loadProjects();
    } catch {
      // error is handled by context
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateProject(id, { status });
      loadProjects();
    } catch {
      // error handled by context
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Button onClick={() => navigate('/create')}>Create Project</Button>
      </div>

      <div className="mb-6">
        <ProjectFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <ProjectList
        projects={projects}
        isLoading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onRetry={loadProjects}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        projectName={deleteTarget?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
