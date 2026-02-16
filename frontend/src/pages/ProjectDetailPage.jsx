import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import { formatDate } from '../utils/dateFormatter';
import StatusBadge from '../components/project/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, loading, error, refetch } = useProject(id);

  if (loading) return <LoadingSpinner message="Loading project..." />;

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} onRetry={refetch} />
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Project not found</h2>
        <p className="mt-2 text-gray-500">The project you're looking for doesn't exist.</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        <StatusBadge status={project.status} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
        <DetailRow label="Client" value={project.clientName} />
        <DetailRow label="Start Date" value={formatDate(project.startDate)} />
        <DetailRow label="End Date" value={formatDate(project.endDate)} />
        <DetailRow label="Created" value={formatDate(project.createdAt)} />
        <DetailRow label="Last Updated" value={formatDate(project.updatedAt)} />
      </div>

      <div className="flex gap-3">
        <Button onClick={() => navigate(`/edit/${project.id}`)}>Edit Project</Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between px-4 py-3">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}
