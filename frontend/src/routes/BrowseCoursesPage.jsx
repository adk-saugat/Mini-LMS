import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAllCourses } from "../service/course.js";

function BrowseCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllCourses(page);
        const fetchedCourses = data.courses || [];
        setAllCourses(fetchedCourses);
        setCourses(fetchedCourses);
      } catch (err) {
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [page]);

  // Filter courses based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setCourses(allCourses);
      return;
    }

    const filtered = allCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCourses(filtered);
  }, [searchQuery, allCourses]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main
        className="max-w-6xl px-6 py-12 flex-1 flex flex-col"
        style={{
          marginLeft: "calc((100% - 72rem) / 2)",
          marginRight: "calc((100% - 72rem) / 2)",
        }}
      >
        <div className="mb-8">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="mb-4 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold mb-2">Browse Courses</h1>
          <p className="text-gray-600 mb-6">
            Discover and explore available courses
          </p>

          {/* Search Bar */}
          <div className="max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by title, description, or category..."
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12">
            <p className="text-gray-600">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 flex flex-col">
              {courses.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="py-12">
                    <p className="text-gray-600">
                      {searchQuery.trim()
                        ? "No courses found matching your search"
                        : "No courses available"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="mb-4">
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded">
                          {course.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                        {course.description}
                      </p>
                      <div className="pt-4 border-t border-gray-200">
                        <Link
                          to={`/courses/${course.id}`}
                          className="text-black hover:underline text-sm font-medium cursor-pointer flex items-center gap-1"
                        >
                          View Course
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination - show when no search query */}
              {!searchQuery.trim() && (
                <div className="mt-auto pt-8 flex justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-600">Page {page}</span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={courses.length === 0 && allCourses.length === 0}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default BrowseCoursesPage;
