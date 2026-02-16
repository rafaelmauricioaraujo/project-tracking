import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useDebounce } from '../hooks/useDebounce';
import { PROJECT_STATUS } from '../utils/constants';
import SearchBar from '../components/common/SearchBar';
import StatsCard from '../components/project/StatsCard';
import StatusBadge from '../components/project/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const [allRes, activeRes, completedRes] = await Promise.all([
          projectService.getAll({ limit: 1 }),
          projectService.getAll({ status: PROJECT_STATUS.ACTIVE, limit: 1 }),
          projectService.getAll({ status: PROJECT_STATUS.COMPLETED, limit: 1 }),
        ]);
        setStats({
          total: allRes.pagination.total,
          active: activeRes.pagination.total,
          completed: completedRes.pagination.total,
        });
      } catch (err) {
        setStatsError(err.message);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResults([]);
      return;
    }
    const fetchResults = async () => {
      try {
        setSearchLoading(true);
        const response = await projectService.getAll({ search: debouncedSearch, limit: 10 });
        setSearchResults(response.data);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };
    fetchResults();
  }, [debouncedSearch]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your projects</p>
      </div>

      {statsError ? (
        <ErrorMessage message={statsError} onRetry={() => window.location.reload()} />
      ) : statsLoading ? (
        <LoadingSpinner message="Loading stats..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard label="Total Projects" count={stats.total} color="blue" />
          <StatsCard label="Active" count={stats.active} color="green" />
          <StatsCard label="Completed" count={stats.completed} color="purple" />
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Search Projects</h2>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search by project or client name..."
        />

        {searchLoading && (
          <div className="mt-3">
            <LoadingSpinner size="sm" />
          </div>
        )}

        {!searchLoading && debouncedSearch && searchResults.length === 0 && (
          <p className="mt-3 text-sm text-gray-500">No projects found.</p>
        )}

        {searchResults.length > 0 && (
          <ul className="mt-3 divide-y divide-gray-200 border border-gray-200 rounded-md bg-white shadow-sm">
            {searchResults.map((project) => (
              <li key={project.id}>
                <Link
                  to={`/projects/${project.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.clientName}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
