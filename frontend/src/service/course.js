const API_BASE_URL = "http://localhost:8080";

// Get all courses (public)
export async function getAllCourses(page = 1) {
  const response = await fetch(`${API_BASE_URL}/courses?page=${page}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch courses");
  }

  return data;
}

// Create a new course (requires auth + instructor role)
export async function createCourse(courseData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(courseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create course");
  }

  return data;
}
