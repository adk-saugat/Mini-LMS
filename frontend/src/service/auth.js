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
}


export async function getUserProfile() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch profile");
    }

    return data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export function getUserName() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    // JWT format: header.payload.signature
    // We only need the payload (middle part)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (base64url)
    const payload = parts[1];
    // Replace URL-safe base64 characters and add padding if needed
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(paddedBase64);
    const claims = JSON.parse(decoded);

    return claims.name || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function getUserRole() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    // JWT format: header.payload.signature
    // We only need the payload (middle part)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (base64url)
    const payload = parts[1];
    // Replace URL-safe base64 characters and add padding if needed
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(paddedBase64);
    const claims = JSON.parse(decoded);

    return claims.role || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
