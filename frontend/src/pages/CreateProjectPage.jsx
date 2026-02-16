import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import ProjectForm from '../components/project/ProjectForm';
import ErrorMessage from '../components/common/ErrorMessage';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      await createProject(data);
      navigate('/projects');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h1>
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/projects')}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
