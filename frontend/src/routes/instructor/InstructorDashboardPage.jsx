import { useState } from "react";
import Navbar from "../../components/Navbar";

function InstructorDashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courses] = useState([]);
  const [totalStudents] = useState(0);

  const totalCourses = courses.length;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Manage your courses</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 cursor-pointer"
          >
            {showCreateForm ? "Cancel" : "Create Course"}
          </button>
        </div>

        {/* Statistics Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-300 rounded p-6">
            <h3 className="text-lg font-semibold mb-2">
              Total Courses Created
            </h3>
            <p className="text-3xl font-bold">{totalCourses}</p>
          </div>
          <div className="border border-gray-300 rounded p-6">
            <h3 className="text-lg font-semibold mb-2">
              Total Students Enrolled
            </h3>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </div>
        </div>

        {showCreateForm && (
          <div className="border border-gray-300 rounded p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
                  rows="4"
                  placeholder="Enter course description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
                  placeholder="Enter course category"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 cursor-pointer"
              >
                Create Course
              </button>
            </form>
          </div>
        )}

        <div className="border border-gray-300 rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No courses created</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-300 rounded p-6"
                >
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {course.category}
                    </span>
                    <div className="flex gap-2">
                      <button className="text-black hover:underline text-sm cursor-pointer">
                        Edit
                      </button>
                      <button className="text-red-600 hover:underline text-sm cursor-pointer">
                        Delete
                      </button>
                    </div>
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

export default InstructorDashboardPage;

