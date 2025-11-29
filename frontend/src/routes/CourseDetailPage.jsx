import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CourseHeader from "../components/CourseHeader";
import LessonForm from "../components/LessonForm";
import LessonCard from "../components/LessonCard";
import EditCourseForm from "../components/EditCourseForm";
import {
  getCourseById,
  getCourseLessons,
  deleteCourse,
  updateCourse,
} from "../service/course.js";
import {
  enrollInCourse,
  checkEnrollment,
  getCourseEnrolledStudentsCount,
} from "../service/enrollment.js";
import { getUserRole } from "../service/auth";
import { useLessonForm } from "../hooks/useLessonForm.js";

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Consolidated state
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Combined enrollment state
  const [enrollment, setEnrollment] = useState({
    isEnrolled: false,
    loading: false,
    error: null,
  });

  // Combined role-based data
  const [roleData, setRoleData] = useState({
    studentsCount: 0,
  });

  // Memoize role to avoid repeated calls
  const userRole = useMemo(() => getUserRole(), []);
  const isInstructor = userRole === "instructor";
  const isStudent = userRole === "student";

  const fetchLessons = async () => {
    try {
      const lessonsData = await getCourseLessons(id);
      setLessons(lessonsData || []);
    } catch (lessonsError) {
      console.warn("Could not fetch lessons:", lessonsError.message);
      setLessons([]);
    }
  };

  const {
    showForm: showLessonForm,
    setShowForm: setShowLessonForm,
    formData: lessonForm,
    error: lessonError,
    loading: lessonLoading,
    handleFormChange: handleLessonFormChange,
    handleSubmit: handleCreateLesson,
    resetForm: resetLessonForm,
  } = useLessonForm(id, fetchLessons);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true);
        setError(null);

        // Parallel fetch for better performance
        const [courseData, lessonsData] = await Promise.all([
          getCourseById(id),
          getCourseLessons(id),
        ]);

        setCourse(courseData);
        setLessons(lessonsData || []);

        // Parallel fetch role-specific data
        const promises = [];

        if (isStudent) {
          promises.push(
            checkEnrollment(id)
              .then((data) => ({
                type: "enrollment",
                value: data.enrolled || false,
              }))
              .catch(() => ({ type: "enrollment", value: false }))
          );
        }

        if (isInstructor) {
          promises.push(
            getCourseEnrolledStudentsCount(id)
              .then((count) => ({ type: "studentsCount", value: count }))
              .catch(() => ({ type: "studentsCount", value: 0 }))
          );
        }

        if (promises.length > 0) {
          const results = await Promise.all(promises);
          results.forEach((result) => {
            if (result.type === "enrollment") {
              setEnrollment((prev) => ({ ...prev, isEnrolled: result.value }));
            } else if (result.type === "studentsCount") {
              setRoleData((prev) => ({ ...prev, studentsCount: result.value }));
            }
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, [id, isStudent, isInstructor]);

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

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteCourse(id);
      // Navigate to instructor dashboard after successful deletion
      navigate("/instructor/dashboard");
    } catch (err) {
      alert(err.message || "Failed to delete course");
      setIsDeleting(false);
    }
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      await updateCourse(id, courseData);
      // Refresh course data and students count in parallel
      const promises = [getCourseById(id)];
      if (isInstructor) {
        promises.push(getCourseEnrolledStudentsCount(id));
      }

      const results = await Promise.all(promises);
      setCourse(results[0]);
      if (isInstructor && results[1] !== undefined) {
        setRoleData((prev) => ({ ...prev, studentsCount: results[1] }));
      }
      setShowEditForm(false);
    } catch (err) {
      throw err; // Let EditCourseForm handle the error display
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrollment((prev) => ({ ...prev, loading: true, error: null }));
      await enrollInCourse(id);
      setEnrollment((prev) => ({ ...prev, isEnrolled: true, loading: false }));
    } catch (err) {
      setEnrollment((prev) => ({
        ...prev,
        error: err.message || "Failed to enroll in course",
        loading: false,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="w-[1152px] mx-auto px-6 py-12 flex-1 flex flex-col min-h-[calc(100vh-80px)]">
        <CourseHeader
          course={course}
          onBack={() => navigate(-1)}
          onDelete={handleDelete}
          onEdit={() => setShowEditForm(true)}
          showDelete={isInstructor && !isDeleting && !showEditForm}
          showEdit={isInstructor && !isDeleting && !showEditForm}
        />

        {/* Enrolled Students Count for Instructors */}
        {!showEditForm && isInstructor && (
          <div className="mb-6">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {roleData.studentsCount}
              </span>{" "}
              {roleData.studentsCount === 1 ? "student" : "students"} enrolled
            </p>
          </div>
        )}

        {/* Enrollment Section for Students */}
        {!showEditForm && isStudent && (
          <div className="mb-6 border border-gray-300 rounded-lg p-6 bg-white">
            {enrollment.error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {enrollment.error}
              </div>
            )}
            {enrollment.isEnrolled ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-green-600"
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
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      You are enrolled in this course
                    </p>
                    <p className="text-sm text-gray-600">
                      Access all lessons and start learning!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    Enroll in this course
                  </p>
                  <p className="text-sm text-gray-600">
                    Join this course to access all lessons and materials
                  </p>
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={enrollment.loading}
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {enrollment.loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Enroll Now
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {showEditForm && isInstructor && (
          <EditCourseForm
            course={course}
            onCancel={() => setShowEditForm(false)}
            onSubmit={handleUpdateCourse}
          />
        )}

        {/* Lessons Section */}
        {!showEditForm && (
          <div className="border-t border-gray-200 pt-8 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Course Lessons
              </h2>
              {isInstructor && !showLessonForm && (
                <button
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2"
                  onClick={() => setShowLessonForm(true)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Lesson
                </button>
              )}
            </div>

            {showLessonForm && isInstructor && (
              <LessonForm
                formData={lessonForm}
                error={lessonError}
                loading={lessonLoading}
                onChange={handleLessonFormChange}
                onSubmit={handleCreateLesson}
                onCancel={resetLessonForm}
              />
            )}

            {lessons.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-600">
                  No lessons available for this course yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    index={index}
                    courseId={id}
                    isEnrolled={enrollment.isEnrolled}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default CourseDetailPage;
