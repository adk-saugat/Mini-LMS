import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getEnrolledCourses } from "../../service/enrollment.js";
import { getCourseLessons } from "../../service/course.js";

function StudentDashboardPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [coursesThisMonth, setCoursesThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEnrolledCourses() {
      try {
        setLoading(true);
        setError(null);
        const courses = await getEnrolledCourses();
        setEnrolledCourses(courses || []);

        // Calculate total lessons and courses this month
        if (courses && courses.length > 0) {
          let total = 0;
          let thisMonthCount = 0;
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          const lessonPromises = courses.map(async (enrolledCourse) => {
            const course = enrolledCourse.course || enrolledCourse;

            // Count courses enrolled this month
            if (enrolledCourse.enrolledAt) {
              const enrolledDate = new Date(enrolledCourse.enrolledAt);
              if (enrolledDate >= startOfMonth) {
                thisMonthCount++;
              }
            }

            try {
              const lessons = await getCourseLessons(course.id);
              return lessons ? lessons.length : 0;
            } catch (err) {
              console.warn(
                `Failed to fetch lessons for course ${course.id}:`,
                err
              );
              return 0;
            }
          });

          const lessonCounts = await Promise.all(lessonPromises);
          total = lessonCounts.reduce((sum, count) => sum + count, 0);
          setTotalLessons(total);
          setCoursesThisMonth(thisMonthCount);
        }
      } catch (err) {
        setError(err.message || "Failed to load enrolled courses");
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEnrolledCourses();
  }, []);

  const totalCourses = enrolledCourses.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
              <p className="text-gray-600">
                Manage your courses and track your progress
              </p>
            </div>
            <Link
              to="/student/courses"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 cursor-pointer"
            >
              Browse Courses
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">Loading enrolled courses...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-gray-600">
              Manage your courses and track your progress
            </p>
          </div>
          <Link
            to="/student/courses"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 cursor-pointer"
          >
            Browse Courses
          </Link>
        </div>

        {/* Statistics Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-300 rounded p-6">
            <h3 className="text-lg font-semibold mb-2">
              Total Courses Enrolled
            </h3>
            <p className="text-3xl font-bold">{totalCourses}</p>
          </div>
          <div className="border border-gray-300 rounded p-6">
            <h3 className="text-lg font-semibold mb-2">Courses This Month</h3>
            <p className="text-3xl font-bold">{coursesThisMonth}</p>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No courses enrolled yet</p>
            <Link
              to="/student/courses"
              className="text-black hover:underline text-sm font-medium inline-flex items-center gap-1"
            >
              Browse available courses →
            </Link>
          </div>
        ) : (
          <div className="border border-gray-300 rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((enrolledCourse) => {
                const course = enrolledCourse.course || enrolledCourse;
                return (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-white flex flex-col cursor-pointer"
                  >
                    <div className="mb-2">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                        {course.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 grow">
                      {course.description}
                    </p>
                    <div className="flex justify-end mt-auto">
                      <span className="text-black hover:underline text-sm font-medium flex items-center gap-1">
                        View Course
                        <span>→</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboardPage;
