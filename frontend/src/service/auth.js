const API_BASE_URL = "http://localhost:8080";

export async function RegisterUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function LoginUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
}
