import { Routes, Route } from "react-router-dom";
import LandingPage from "./routes/LandingPage";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import StudentDashboardPage from "./routes/student/StudentDashboardPage";
import InstructorDashboardPage from "./routes/instructor/InstructorDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute requiredRole="instructor">
            <InstructorDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
