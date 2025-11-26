const API_BASE_URL = "http://localhost:8080";

export async function createLesson(courseId, lessonData) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(lessonData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create lesson");
  }

  return data;
}

export async function updateLesson(courseId, lessonId, lessonData) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(
    `${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(lessonData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update lesson");
  }

  return data;
}
