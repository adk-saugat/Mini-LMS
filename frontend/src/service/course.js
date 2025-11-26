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

// Get all courses created by the instructor (requires auth + instructor role)
export async function getInstructorCourses() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/courses/created`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch instructor courses");
  }

  return data;
}

// Get a single course by ID (public)
export async function getCourseById(courseId) {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch course");
  }

  return data.course;
}

// Get lessons for a course (public)
export async function getCourseLessons(courseId) {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch course lessons");
  }

  return data.lessons;
}

// Update a course (requires auth + instructor role)
export async function updateCourse(courseId, courseData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(courseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update course");
  }

  return data;
}

// Delete a course (requires auth + instructor role)
export async function deleteCourse(courseId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete course");
  }

  return data;
}

// Get total students enrolled across all instructor's courses (requires auth + instructor role)
export async function getTotalStudentsEnrolled() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_BASE_URL}/courses/students/total`, {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch total students enrolled");
  }

  return data.totalStudents || 0;
}
