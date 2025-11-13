import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">MiniLMS</div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm hover:shadow-md"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MiniLMS
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          A lightweight Learning Management System for students and instructors.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
