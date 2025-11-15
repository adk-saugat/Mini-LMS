import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function StudentDashboardPage() {
  // Dummy enrolled courses data
  const enrolledCourses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      description:
        "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
      category: "Programming",
    },
    {
      id: 2,
      title: "Data Structures and Algorithms",
      description:
        "Master essential data structures and algorithms for problem solving.",
      category: "Computer Science",
    },
    {
      id: 3,
      title: "Database Design Fundamentals",
      description:
        "Learn how to design and implement efficient database systems.",
      category: "Database",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-gray-600">
              Manage your courses and track your progress
            </p>
          </div>
          <Link
            to="/courses"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 cursor-pointer"
          >
            Browse Courses
          </Link>
        </div>

        {/* Enrolled Courses Section */}
        <div className="border border-gray-300 rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No courses enrolled yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-white flex flex-col"
                >
                  <div className="mb-2">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                      {course.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {course.description}
                  </p>
                  <div className="flex justify-end mt-auto">
                    <button className="text-black hover:underline text-sm font-medium cursor-pointer flex items-center gap-1">
                      View Course
                      <span>→</span>
                    </button>
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

export default StudentDashboardPage;

