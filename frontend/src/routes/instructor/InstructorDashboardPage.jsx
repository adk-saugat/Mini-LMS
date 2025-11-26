import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import CreateCourseForm from "../../components/CreateCourseForm";
import CourseList from "../../components/CourseList";
import {
  createCourse,
  getInstructorCourses,
  getTotalStudentsEnrolled,
} from "../../service/course.js";

function InstructorDashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalCourses = courses.length;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInstructorCourses();
      // Backend returns { course: [...] } (singular "course")
      setCourses(data.course || []);

      // Fetch total students enrolled
      try {
        const total = await getTotalStudentsEnrolled();
        setTotalStudents(total);
      } catch (studentsError) {
        console.warn("Failed to fetch total students:", studentsError);
        // Don't fail the whole page if this fails
        setTotalStudents(0);
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      await createCourse(courseData);
      setShowCreateForm(false);
      // Refresh courses list after successful creation
      await fetchCourses();
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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={fetchCourses}
              className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Retry
            </button>
          </div>
        ) : (
          <CourseList courses={courses} />
        )}
      </main>
    </div>
  );
}

export default InstructorDashboardPage;
