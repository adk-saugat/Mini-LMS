import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUserProfile, getUserRole } from "../service/auth.js";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const userData = await getUserProfile();
        if (!userData) {
          setError("Failed to load profile");
          return;
        }
        setUser(userData);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const role = getUserRole();
  const getDashboardPath = () => {
    if (role === "instructor") {
      return "/instructor/dashboard";
    } else if (role === "student") {
      return "/student/dashboard";
    }
    return "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="py-12">
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="py-12">
            <p className="text-red-600">{error || "Failed to load profile"}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-black hover:underline"
            >
              ← Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <button
            onClick={() => navigate(getDashboardPath())}
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex items-center gap-2 mb-6"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">View and manage your account information</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"}
              </h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <span className="inline-block mt-2 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded">
                {user.role === "instructor" ? "Instructor" : "Student"}
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                First Name
              </h3>
              <p className="text-lg text-gray-900">
                {user.firstName || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Last Name
              </h3>
              <p className="text-lg text-gray-900">
                {user.lastName || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Role</h3>
              <p className="text-lg text-gray-900 capitalize">
                {user.role || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Member Since
              </h3>
              <p className="text-lg text-gray-900">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;

