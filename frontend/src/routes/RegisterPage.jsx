import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { RegisterUser } from "../service/auth.js";

function RegisterPage() {
  const navigate = useNavigate();

  // Single user state object
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
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

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!user.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!user.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!user.password.trim()) {
      setError("Password is required");
      return;
    }
    if (!user.role) {
      setError("Please select a role");
      return;
    }

    // Split name into firstName and lastName
    const nameParts = user.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      setLoading(true);
      const data = await RegisterUser({
        firstName,
        lastName,
        email: user.email.trim(),
        password: user.password,
        role: user.role,
      });

      // Registration successful - redirect to login
      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-md mx-auto px-6 py-20">
        <div>
          <h1 className="text-3xl font-bold mb-4">Register</h1>
          <p className="text-gray-600 mb-8">Create a new account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
                placeholder="Enter your name"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={user.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              >
                <option value="">Select a role</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white px-6 py-2 rounded hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-black hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
