import { useState, useEffect } from "react";
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
import { enrollInCourse, checkEnrollment } from "../service/enrollment.js";
import { getUserRole } from "../service/auth";
import { useLessonForm } from "../hooks/useLessonForm.js";

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState(null);
  const [isStudent, setIsStudent] = useState(false);

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

        const courseData = await getCourseById(id);
        setCourse(courseData);
        await fetchLessons();

        // Check if user is student and enrollment status
        const role = getUserRole();
        if (role === "student") {
          setIsStudent(true);
          try {
            const enrollmentData = await checkEnrollment(id);
            setIsEnrolled(enrollmentData.enrolled || false);
          } catch (err) {
            console.warn("Could not check enrollment status:", err);
            setIsEnrolled(false);
          }
        } else {
          setIsStudent(false);
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

  const isInstructor = getUserRole() === "instructor";

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
      // Refresh course data
      const updatedCourse = await getCourseById(id);
      setCourse(updatedCourse);
      setShowEditForm(false);
    } catch (err) {
      throw err; // Let EditCourseForm handle the error display
    }
  };

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      setEnrollmentError(null);
      await enrollInCourse(id);
      setIsEnrolled(true);
    } catch (err) {
      setEnrollmentError(err.message || "Failed to enroll in course");
    } finally {
      setIsEnrolling(false);
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

        {/* Enrollment Section for Students */}
        {!showEditForm && isStudent && (
          <div className="mb-6 border border-gray-300 rounded-lg p-6 bg-white">
            {enrollmentError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {enrollmentError}
              </div>
            )}
            {isEnrolled ? (
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
                  disabled={isEnrolling}
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isEnrolling ? (
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
