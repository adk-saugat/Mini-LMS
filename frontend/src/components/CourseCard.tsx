import { Link } from "react-router-dom";
import type { Course } from "../types/course";

interface CourseCardProps {
  course: Course;
}

/**
 * Individual course card component
 * Displays course information in a card format
 */
export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white h-full flex flex-col">
      {course.category && (
        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">
          {course.category}
        </span>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {course.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
        {course.description || "No description available"}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <Link
          to={`/courses/${course.id}`}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View Details →
        </Link>
        <span className="text-xs text-gray-500">
          {new Date(course.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
