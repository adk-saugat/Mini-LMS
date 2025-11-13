import { Link } from "react-router-dom";

interface StudentNavbarProps {
  onLogout: () => void;
}

/**
 * Navigation bar component for student pages
 * Displays logo, dashboard link, profile, and logout button
 */
export default function StudentNavbar({ onLogout }: StudentNavbarProps) {
  return (
    <nav className="container mx-auto px-6 py-6 border-b border-gray-200 shrink-0">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          MiniLMS
        </Link>
        <div className="flex gap-3 items-center">
          <Link
            to="/dashboard/student"
            className="px-5 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-colors"
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=student"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </Link>
          <button
            onClick={onLogout}
            className="px-5 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

