function CourseHeader({ course, onBack, onDelete, onEdit, showDelete = false, showEdit = false }) {
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
        <div className="flex gap-3">
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
              Edit Course
            </button>
          )}
          {showDelete && (
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800 transition-colors cursor-pointer flex items-center gap-2 px-4 py-2 border border-red-600 rounded hover:bg-red-50"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Course
            </button>
          )}
        </div>
      </div>

      {/* Course Header */}
      <div className="mb-8">
        <div className="mb-4">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded">
            {course.category}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{course.title}</h1>
        <p className="text-gray-600 text-lg mb-4">{course.description}</p>
        <div className="text-sm text-gray-500">
          Created on {new Date(course.createdAt).toLocaleDateString()}
        </div>
      </div>
    </>
  );
}

export default CourseHeader;

