import { useState } from "react";
import Navbar from "../../components/Navbar";
import CreateCourseForm from "../../components/CreateCourseForm";
import CourseList from "../../components/CourseList";
import { createCourse } from "../../service/course.js";

function InstructorDashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courses] = useState([]);
  const [totalStudents] = useState(0);

  const totalCourses = courses.length;

  const handleCreateCourse = async (courseData) => {
    try {
      await createCourse(courseData);
      setShowCreateForm(false);
      // TODO: Refresh courses list after successful creation
    } catch (error) {
      throw error; // Let CreateCourseForm handle the error display
    }
  };

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
          <CreateCourseForm
            onCancel={() => setShowCreateForm(false)}
            onSubmit={handleCreateCourse}
          />
        )}

        <CourseList courses={courses} />
      </main>
    </div>
  );
}

export default InstructorDashboardPage;
