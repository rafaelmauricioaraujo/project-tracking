import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useProject } from '../hooks/useProject';
import ProjectForm from '../components/project/ProjectForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProject } = useProjects();
  const { project, loading, error: fetchError } = useProject(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await updateProject(id, data);
      navigate('/projects');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading project..." />;

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage message={fetchError} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-500 text-lg">Project not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Project</h1>
      {submitError && <div className="mb-4"><ErrorMessage message={submitError} /></div>}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <ProjectForm
          initialData={project}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/projects')}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
