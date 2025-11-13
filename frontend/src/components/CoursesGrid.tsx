import type { Course } from "../types/course";
import CourseCard from "./CourseCard";

interface CoursesGridProps {
  courses: Course[];
  searchQuery?: string;
}

/**
 * Grid layout component for displaying courses
 */
export default function CoursesGrid({
  courses,
  searchQuery,
}: CoursesGridProps) {
  if (courses.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {courses.length} course{courses.length !== 1 ? "s" : ""}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 mb-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}
