import { useState, useEffect } from "react";
import StudentNavbar from "../components/StudentNavbar";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import CoursesGrid from "../components/CoursesGrid";
import EmptyState from "../components/EmptyState";
import PaginationControls from "../components/PaginationControls";
import { fetchCourses } from "../services/courseService";
import type { Course } from "../types/course";

const COURSES_PER_PAGE = 6;

/**
 * Browse Courses Page
 * 
 * Main page component for students to browse and search through available courses.
 * Features:
 * - Search functionality
 * - Pagination (6 courses per page)
 * - Loading and error states
 * - Responsive grid layout
 * 
 * TODO: Replace manual state management with TanStack Query
 * Example:
 * const { data: courses = [], isLoading, error } = useQuery({
 *   queryKey: ['courses', currentPage],
 *   queryFn: () => fetchCourses(currentPage)
 * });
 */
function BrowseCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch courses when page changes
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCourses(currentPage);
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [currentPage]);

  // Filter courses based on search query
  const filteredCourses = courses.filter((course: Course) => {
    const query = searchQuery.toLowerCase();
    return (
      course.title?.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.category?.toLowerCase().includes(query)
    );
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourses(currentPage);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <StudentNavbar onLogout={handleLogout} />

      <main className="container mx-auto px-6 py-8 flex-1 flex flex-col overflow-auto">
        <PageHeader
          title="Browse Courses"
          description="Discover and explore all available courses"
        />

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for courses by title, description, or category..."
        />

        {loading && <LoadingState />}

        {error && !loading && (
          <ErrorState error={error} onRetry={handleRetry} />
        )}

        {!loading && !error && (
          <>
            {filteredCourses.length > 0 ? (
              <>
                <CoursesGrid courses={filteredCourses} searchQuery={searchQuery} />
                {!searchQuery && (
                  <PaginationControls
                    currentPage={currentPage}
                    coursesCount={courses.length}
                    coursesPerPage={COURSES_PER_PAGE}
                    onPrevious={handlePreviousPage}
                    onNext={handleNextPage}
                  />
                )}
              </>
            ) : (
              <>
                <EmptyState
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                />
                {!searchQuery && currentPage > 1 && (
                  <PaginationControls
                    currentPage={currentPage}
                    coursesCount={courses.length}
                    coursesPerPage={COURSES_PER_PAGE}
                    onPrevious={handlePreviousPage}
                    onNext={handleNextPage}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default BrowseCoursesPage;

