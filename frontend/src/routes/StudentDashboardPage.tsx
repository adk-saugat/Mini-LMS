import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function StudentDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // Dummy user profile data
  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
  };
  const [allCourses, setAllCourses] = useState<
    Array<{
      id: number;
      title: string;
      description: string;
      instructor: string;
    }>
  >([]);
  const [enrolledCourses, setEnrolledCourses] = useState<
    Array<{
      id: number;
      title: string;
      description: string;
    }>
  >([]);

  useEffect(() => {
    // Fetch all courses
    fetch("http://localhost:8080/courses?page=1")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllCourses(data);
        } else if (data.courses && Array.isArray(data.courses)) {
          setAllCourses(data.courses);
        }
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const filteredCourses = allCourses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-colors"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=student"
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
              {enrolledCourses.length} Enrolled Course
              {enrolledCourses.length !== 1 ? "s" : ""}
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {allCourses.length} Total Courses Available
            </span>
          </div>
        </div>

        {/* Search Courses Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Search Courses
          </h2>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for courses by title, description, or instructor..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {searchQuery && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Search Results ({filteredCourses.length})
              </h3>
              {filteredCourses.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {course.description}
                      </p>
                      {course.instructor && (
                        <p className="text-xs text-gray-500 mb-4">
                          Instructor: {course.instructor}
                        </p>
                      )}
                      <Link
                        to={`/courses/${course.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Course →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    No courses found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              My Enrollments
            </h2>
            <p className="text-gray-600 mb-4">
              {enrolledCourses.length === 0
                ? "You haven't enrolled in any courses yet."
                : `You're enrolled in ${enrolledCourses.length} course(s).`}
            </p>
            <Link
              to="/me/enrollments"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all enrollments →
            </Link>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Browse Courses
            </h2>
            <p className="text-gray-600 mb-4">
              Discover new courses to expand your knowledge.
            </p>
            <Link
              to="/dashboard/student/courses"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Explore courses →
            </Link>
          </div>
        </div>

        {enrolledCourses.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Courses
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {enrolledCourses.map((course) => (
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
                  <Link
                    to={`/courses/${course.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Continue learning →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">
              You haven't enrolled in any courses yet.
            </p>
            <Link
              to="/dashboard/student/courses"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboardPage;
