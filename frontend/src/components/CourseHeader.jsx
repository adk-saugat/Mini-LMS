function CourseHeader({ course, onBack }) {
  return (
    <>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
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

