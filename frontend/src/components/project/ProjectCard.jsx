import StatusBadge from './StatusBadge';
import Button from '../common/Button';
import { formatDate } from '../../utils/dateFormatter';
import { STATUS_OPTIONS } from '../../utils/constants';

export default function ProjectCard({ project, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">{project.name}</h3>
          <p className="text-sm text-gray-500">{project.clientName}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p>
          <span className="font-medium">Start:</span> {formatDate(project.startDate)}
        </p>
        <p>
          <span className="font-medium">End:</span> {formatDate(project.endDate)}
        </p>
      </div>

      <div className="mb-4">
        <select
          value={project.status}
          onChange={(e) => onStatusChange(project.id, e.target.value)}
          className="w-full text-sm px-2 py-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Change status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => onEdit(project.id)} className="flex-1">
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(project)} className="flex-1">
          Delete
        </Button>
      </div>
    </div>
  );
}
