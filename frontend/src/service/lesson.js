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

  let data = {};
  try {
    const text = await response.text();
    if (text.trim()) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Response text:", text);
        if (!response.ok) {
          throw new Error("Failed to create lesson: Invalid server response");
        }
        throw new Error("Invalid response from server");
      }
    }
  } catch (error) {
    if (error.message.includes("Invalid")) {
      throw error;
    }
    throw new Error("Network error or invalid server response");
  }

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

  let data = {};
  try {
    const text = await response.text();
    if (text.trim()) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Response text:", text);
        if (!response.ok) {
          throw new Error("Failed to update lesson: Invalid server response");
        }
        throw new Error("Invalid response from server");
      }
    }
  } catch (error) {
    if (error.message.includes("Invalid")) {
      throw error;
    }
    throw new Error("Network error or invalid server response");
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to update lesson");
  }

  return data;
}

export async function deleteLesson(courseId, lessonId) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(
    `${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    }
  );

  let data = {};
  try {
    const text = await response.text();
    if (text.trim()) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Response text:", text);
        if (!response.ok) {
          throw new Error("Failed to delete lesson: Invalid server response");
        }
        throw new Error("Invalid response from server");
      }
    }
  } catch (error) {
    if (error.message.includes("Invalid")) {
      throw error;
    }
    throw new Error("Network error or invalid server response");
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete lesson");
  }

  return data;
}
