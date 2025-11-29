import API_BASE_URL from "../config/api.js";

// Enroll in a course (requires auth)
export async function enrollInCourse(courseId) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
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
          throw new Error(
            "Failed to enroll in course: Invalid server response"
          );
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
    throw new Error(data.error || "Failed to enroll in course");
  }

  return data;
}

// Check if student is enrolled in a course (requires auth)
export async function checkEnrollment(courseId) {
  const token = localStorage.getItem("token");

  if (!token) {
    return { enrolled: false };
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // If not enrolled or error, return false
    return { enrolled: false };
  }

  let data = {};
  try {
    const text = await response.text();
    if (text.trim()) {
      data = JSON.parse(text);
    }
  } catch (error) {
    console.error("Error parsing enrollment check response:", error);
    return { enrolled: false };
  }

  return data;
}

// Get all enrollments for the current student (requires auth)
export async function getStudentEnrollments() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_BASE_URL}/enrollments`, {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
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
          throw new Error(
            "Failed to fetch enrollments: Invalid server response"
          );
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
    throw new Error(data.error || "Failed to fetch enrollments");
  }

  return data.enrollments || [];
}

// Get enrolled courses with course details for the current student (requires auth)
export async function getEnrolledCourses() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_BASE_URL}/enrollments/courses`, {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
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
          throw new Error(
            "Failed to fetch enrolled courses: Invalid server response"
          );
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
    throw new Error(data.error || "Failed to fetch enrolled courses");
  }

  return data.courses || [];
}

// Get enrolled students count for a course (requires auth + instructor role)
export async function getCourseEnrolledStudentsCount(courseId) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(
    `${API_BASE_URL}/courses/${courseId}/students/count`,
    {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
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
          throw new Error(
            "Failed to fetch enrolled students count: Invalid server response"
          );
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
    throw new Error(data.error || "Failed to fetch enrolled students count");
  }

  return data.count || 0;
}
