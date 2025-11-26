import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import LessonHeader from "../components/LessonHeader";
import LessonForm from "../components/LessonForm";
import { getCourseById, getCourseLessons } from "../service/course.js";
import { updateLesson } from "../service/lesson.js";
import { getUserRole, getUserProfile } from "../service/auth.js";

function LessonDetailPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    content: "",
  });
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch course details
        const courseData = await getCourseById(courseId);
        setCourse(courseData);

        // Fetch all lessons for the course
        const lessonsData = await getCourseLessons(courseId);
        const foundLesson = lessonsData.find(
          (l) => l.id === parseInt(lessonId)
        );

        if (!foundLesson) {
          setError("Lesson not found");
          return;
        }

        setLesson(foundLesson);

        // Check if user is instructor and owns the course
        const userRole = getUserRole();
        if (userRole === "instructor") {
          const user = await getUserProfile();
          if (user && user.id === courseData.instructorId) {
            setIsInstructor(true);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="w-[1152px] mx-auto px-6 py-12 flex-1">
          <div className="py-12">
            <p className="text-gray-600">Loading lesson details...</p>
          </div>
        </main>
      </div>
    );
  }

  const handleEdit = () => {
    if (lesson) {
      setFormData({
        title: lesson.title || "",
        overview: lesson.overview || "",
        content: lesson.content || "",
      });
      setShowEditForm(true);
      setEditError(null);
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setFormData({
      title: "",
      overview: "",
      content: "",
    });
    setEditError(null);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setEditError(null);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    setEditError(null);

    // Validation
    if (!formData.title.trim()) {
      setEditError("Title is required");
      return;
    }
    if (!formData.overview.trim()) {
      setEditError("Overview is required");
      return;
    }
    if (!formData.content.trim()) {
      setEditError("Content is required");
      return;
    }

    try {
      setEditLoading(true);
      await updateLesson(courseId, lessonId, {
        title: formData.title.trim(),
        overview: formData.overview.trim(),
        content: formData.content.trim(),
      });

      // Refresh lesson data
      const lessonsData = await getCourseLessons(courseId);
      const updatedLesson = lessonsData.find(
        (l) => l.id === parseInt(lessonId)
      );
      if (updatedLesson) {
        setLesson(updatedLesson);
      }

      setShowEditForm(false);
    } catch (err) {
      setEditError(err.message || "Failed to update lesson");
    } finally {
      setEditLoading(false);
    }
  };

  if (error || !lesson || !course) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="w-[1152px] mx-auto px-6 py-12 flex-1">
          <div className="py-12">
            <p className="text-red-600">{error || "Lesson not found"}</p>
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
        {!showEditForm && (
          <LessonHeader
            lesson={lesson}
            course={course}
            onBack={() => navigate(-1)}
            onEdit={handleEdit}
            showEdit={isInstructor}
          />
        )}

        {showEditForm && isInstructor ? (
          <LessonForm
            formData={formData}
            error={editError}
            loading={editLoading}
            onChange={handleFormChange}
            onSubmit={handleUpdateLesson}
            onCancel={handleCancelEdit}
            isEditMode={true}
          />
        ) : (
          /* Lesson Content */
          <div className="border-t border-gray-200 pt-8 flex-1 flex flex-col">
            <div className="prose prose-lg prose-gray max-w-none">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Content
              </h2>
              <div className="markdown-content text-gray-700 leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-3xl font-bold mt-8 mb-4 text-gray-900"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-2xl font-semibold mt-6 mb-3 text-gray-900"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-xl font-semibold mt-4 mb-2 text-gray-900"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-4 leading-relaxed" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-inside mb-4 space-y-2"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside mb-4 space-y-2"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="ml-4" {...props} />
                    ),
                    code: ({ node, inline, ...props }) =>
                      inline ? (
                        <code
                          className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
                          {...props}
                        />
                      ) : (
                        <code
                          className="block bg-gray-100 text-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4"
                          {...props}
                        />
                      ),
                    pre: ({ node, ...props }) => (
                      <pre
                        className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-gray-300 pl-4 italic my-4"
                        {...props}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="my-8 border-gray-300" {...props} />
                    ),
                  }}
                >
                  {lesson.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default LessonDetailPage;
