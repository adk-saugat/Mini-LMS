import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCourseById, getCourseLessons } from "../service/course.js";

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch course details
        const courseData = await getCourseById(id);
        setCourse(courseData);

        // Fetch course lessons
        try {
          const lessonsData = await getCourseLessons(id);
          setLessons(lessonsData || []);
        } catch (lessonsError) {
          // If lessons can't be fetched, set empty array
          console.warn("Could not fetch lessons:", lessonsError.message);
          setLessons([]);
        }
      } catch (err) {
        setError(err.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="w-[1152px] mx-auto px-6 py-12 flex-1">
          <div className="py-12">
            <p className="text-gray-600">Loading course details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="w-[1152px] mx-auto px-6 py-12 flex-1">
          <div className="py-12">
            <p className="text-red-600">{error || "Course not found"}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-black hover:underline"
            >
              ← Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="w-[1152px] mx-auto px-6 py-12 flex-1 flex flex-col min-h-[calc(100vh-80px)]">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
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

        {/* Course Header */}
        <div className="mb-8">
          <div className="mb-4">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded">
              {course.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {course.title}
          </h1>
          <p className="text-gray-600 text-lg mb-4">{course.description}</p>
          <div className="text-sm text-gray-500">
            Created on {new Date(course.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Lessons Section */}
        <div className="border-t border-gray-200 pt-8 flex-1 flex flex-col">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Course Lessons
          </h2>
          {lessons.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-600">
                No lessons available for this course yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 whitespace-pre-wrap">
                        {lesson.content}
                      </p>
                      <div className="text-xs text-gray-500">
                        Created on{" "}
                        {new Date(lesson.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CourseDetailPage;
