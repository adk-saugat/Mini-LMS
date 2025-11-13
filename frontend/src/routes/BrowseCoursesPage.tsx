import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  instructorId: number;
  createdAt: string;
}

function BrowseCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  const fetchCourses = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/courses?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      if (data.courses && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
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
              onClick={handleLogout}
              className="px-5 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Courses
          </h1>
          <p className="text-gray-600">
            Discover and explore all available courses
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for courses by title, description, or category..."
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
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={() => fetchCourses(currentPage)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && (
          <>
            {filteredCourses.length > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">
                    Showing {filteredCourses.length} course
                    {filteredCourses.length !== 1 ? "s" : ""}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
                    >
                      {course.category && (
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">
                          {course.category}
                        </span>
                      )}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {course.description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/courses/${course.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View Details →
                        </Link>
                        <span className="text-xs text-gray-500">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? `No courses found matching "${searchQuery}"`
                    : "No courses available at the moment."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {!searchQuery && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={courses.length < 5}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default BrowseCoursesPage;

