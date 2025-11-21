import { Link } from "react-router-dom";

function LessonCard({ lesson, index, courseId }) {
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

