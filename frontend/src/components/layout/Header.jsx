import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Project Tracker
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Projects
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
