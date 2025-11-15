import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to MiniLMS</h1>
          <p className="text-gray-600 mb-8">
            Learning Management System for students and instructors.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 cursor-pointer"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 cursor-pointer"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
