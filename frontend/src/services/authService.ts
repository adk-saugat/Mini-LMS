const API_BASE_URL = "http://localhost:8080";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  role: string;
}

export interface ErrorResponse {
  error: string;
}

/**
 * Logs in a user with email and password
 * @param credentials - User email and password
 * @returns Promise with login response containing token
 * @throws Error if login fails
 */
export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      (data as ErrorResponse).error || "Login failed. Please try again.";
    throw new Error(errorMessage);
  }

  return data as LoginResponse;
}

/**
 * Stores the authentication token in localStorage
 * @param token - JWT token to store
 */
export function storeToken(token: string): void {
  localStorage.setItem("token", token);
}

/**
 * Retrieves the authentication token from localStorage
 * @returns Token string or null if not found
 */
export function getToken(): string | null {
  return localStorage.getItem("token");
}

/**
 * Removes the authentication token from localStorage
 */
export function removeToken(): void {
  localStorage.removeItem("token");
}
