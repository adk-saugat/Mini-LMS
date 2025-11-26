function LessonHeader({ lesson, course, onBack, onEdit, showEdit = false }) {
  return (
    <>
      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          type="button"
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
        {showEdit && (
          <button
            onClick={onEdit}
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-600 rounded hover:bg-gray-50"
            type="button"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Lesson
          </button>
        )}
      </div>

      {/* Lesson Header */}
      <div className="mb-8">
        <div className="mb-4">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded">
            {course.category}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {lesson.title}
        </h1>
        {lesson.overview && (
          <p className="text-gray-600 text-lg mb-4">{lesson.overview}</p>
        )}
        <div className="text-sm text-gray-500">
          Created on {new Date(lesson.createdAt).toLocaleDateString()}
        </div>
      </div>
    </>
  );
}

export default LessonHeader;
