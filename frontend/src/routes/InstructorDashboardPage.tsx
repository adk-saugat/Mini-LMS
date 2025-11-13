import { Link } from "react-router-dom";

function InstructorDashboardPage() {
  // Dummy user profile data
  const userProfile = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
  };

  // TODO: Fetch instructor's courses and stats from API
  const myCourses: Array<{
    id: number;
    title: string;
    description: string;
  }> = [];
  const totalEnrollments = 0; // TODO: Fetch from API

  const handleLogout = () => {
    // TODO: Implement logout
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="container mx-auto px-6 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            MiniLMS
          </Link>
          <div className="flex gap-3 items-center">
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-purple-500 transition-colors"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=instructor"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section with User Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile.name}!
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-2">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              {myCourses.length} Course{myCourses.length !== 1 ? "s" : ""}{" "}
              Created
            </span>
            <span className="flex items-center gap-2">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {totalEnrollments} Total Enrollments
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Instructor Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Manage your courses and track student progress
            </p>
          </div>
          <Link
            to="/courses/new"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Create Course
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Courses
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {myCourses.length}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Enrollments
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {totalEnrollments}
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Active Students
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {totalEnrollments}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <Link
              to="/my-courses"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </Link>
          </div>

          {myCourses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {myCourses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {course.description}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/courses/${course.id}/edit`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      to={`/courses/${course.id}/lessons`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Manage Lessons
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">
                You haven't created any courses yet.
              </p>
              <Link
                to="/courses/new"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Your First Course
              </Link>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/courses/new"
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium"
            >
              Create New Course
            </Link>
            <Link
              to="/my-courses"
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardPage;
