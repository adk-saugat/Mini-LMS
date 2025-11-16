function CourseList({ courses = [] }) {
  return (
    <div className="border border-gray-300 rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No courses created</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
            >
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded">
                  {course.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {course.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
