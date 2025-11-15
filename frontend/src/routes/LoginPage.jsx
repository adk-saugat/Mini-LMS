import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { LoginUser } from "../service/auth.js";

function LoginPage() {
  const navigate = useNavigate();

  // Single user state object
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to update user fields
  const handleChange = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!user.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!user.password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);
      const data = await LoginUser({
        email: user.email.trim(),
        password: user.password,
      });

      // Store token and role in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.role) {
        localStorage.setItem("userRole", data.role);
      }

      // Redirect based on role
      if (data.role === "instructor") {
        navigate("/instructor/dashboard");
      } else if (data.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-md mx-auto px-6 py-20">
        <div>
          <h1 className="text-3xl font-bold mb-4">Login</h1>
          <p className="text-gray-600 mb-8">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={user.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white px-6 py-2 rounded hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-black hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
