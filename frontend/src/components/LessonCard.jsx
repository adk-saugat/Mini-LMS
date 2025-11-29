import { Link } from "react-router-dom";
import { getUserRole } from "../service/auth";

function LessonCard({ lesson, index, courseId, isEnrolled }) {
  const userRole = getUserRole();
  const isInstructor = userRole === "instructor";
  const isStudent = userRole === "student";

  if (isStudent && !isEnrolled) {
    // Show only title for non-enrolled students
    return (
      <div className="block border border-gray-300 rounded-lg p-6 bg-gray-50 opacity-75">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold flex-shrink-0">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 text-gray-600">
              {lesson.title}
            </h3>
            <p className="text-gray-500 text-sm italic">
              Enroll in this course to access lesson content
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full lesson card for enrolled students and instructors
  return (
    <Link
      to={`/courses/${courseId}/lessons/${lesson.id}`}
      className="block border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow bg-white cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-gray-700">
            {lesson.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 whitespace-pre-wrap line-clamp-3">
            {lesson.overview || lesson.content}
          </p>
          <div className="text-xs text-gray-500">
            Created on {new Date(lesson.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default LessonCard;
