import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import { getCourseById, getCourseLessons } from "../service/course.js";

function LessonDetailPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (error || !lesson || !course) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="w-[1152px] mx-auto px-6 py-12 flex-1">
          <div className="py-12">
            <p className="text-red-600">{error || "Lesson not found"}</p>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="mt-4 text-black hover:underline"
            >
              ← Back to Course
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="w-[1152px] mx-auto px-6 py-12 flex-1">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link to={`/courses/${courseId}`} className="hover:text-gray-900">
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{lesson.title}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
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

        {/* Lesson Content */}
        <article className="max-w-4xl">
          <div className="mb-6">
            <div className="mb-4">
              <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded">
                {course.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {lesson.title}
            </h1>
            {lesson.overview && (
              <p className="text-lg text-gray-600 mb-6">{lesson.overview}</p>
            )}
            <div className="text-sm text-gray-500 mb-6">
              Created on {new Date(lesson.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
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
        </article>
      </main>
    </div>
  );
}

export default LessonDetailPage;
