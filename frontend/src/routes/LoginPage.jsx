import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-md mx-auto px-6 py-20">
        <div>
          <h1 className="text-3xl font-bold mb-4">Login</h1>
          <p className="text-gray-600 mb-8">Sign in to your account</p>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white px-6 py-2 rounded hover:bg-gray-800 cursor-pointer"
            >
              Sign In
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
