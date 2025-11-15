import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../service/auth.js";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard =
    location.pathname.includes("/instructor/dashboard") ||
    location.pathname.includes("/student/dashboard");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold hover:text-gray-600">
          MiniLMS
        </Link>
        <div className="flex gap-4">
          {isDashboard ? (
            <>
              <Link
                to="/profile"
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-600 hover:text-gray-900"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
