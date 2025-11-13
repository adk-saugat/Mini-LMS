import type { Course } from "../types/course";

const API_BASE_URL = "http://localhost:8080";

/**
 * Fetches courses from the API
 *
 * TODO: Replace this with TanStack Query
 * Example:
 * const { data: courses, isLoading, error } = useQuery({
 *   queryKey: ['courses', page],
 *   queryFn: () => fetchCourses(page)
 * });
 */
export async function fetchCourses(page: number): Promise<Course[]> {
  const response = await fetch(`${API_BASE_URL}/courses?page=${page}`);

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  const data = await response.json();

  // Handle different response formats
  if (data.courses && Array.isArray(data.courses)) {
    return data.courses;
  } else if (Array.isArray(data)) {
    return data;
  } else {
    return [];
  }
}
