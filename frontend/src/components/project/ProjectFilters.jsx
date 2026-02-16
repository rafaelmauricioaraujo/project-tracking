import SearchBar from '../common/SearchBar';
import { STATUS_OPTIONS } from '../../utils/constants';

export default function ProjectFilters({ filters, onFilterChange }) {
  const hasFilters = filters.status || filters.search;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="w-full sm:w-64">
        <SearchBar
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
          placeholder="Search projects..."
          onClear={() => onFilterChange({ ...filters, search: '', page: 1 })}
        />
      </div>

      <select
        value={filters.status || ''}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value, page: 1 })}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={() => onFilterChange({ status: '', search: '', page: 1 })}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
