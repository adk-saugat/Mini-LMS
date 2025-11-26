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
