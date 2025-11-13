import { Route, Routes } from "react-router-dom";
import "./App.css";

// Public Pages
import LandingPage from "./routes/LandingPage";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";

// Student Pages
import StudentDashboardPage from "./routes/StudentDashboardPage";
import BrowseCoursesPage from "./routes/BrowseCoursesPage";

// Instructor Pages
import InstructorDashboardPage from "./routes/InstructorDashboardPage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Dashboard Routes */}
      <Route path="/dashboard/student" element={<StudentDashboardPage />} />
      <Route
        path="/dashboard/student/courses"
        element={<BrowseCoursesPage />}
      />

      {/* Instructor Dashboard Routes */}
      <Route
        path="/dashboard/instructor"
        element={<InstructorDashboardPage />}
      />
    </Routes>
  );
}

export default App;
