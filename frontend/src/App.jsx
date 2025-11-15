import { Routes, Route } from "react-router-dom";
import LandingPage from "./routes/LandingPage";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import StudentDashboardPage from "./routes/student/StudentDashboardPage";
import InstructorDashboardPage from "./routes/instructor/InstructorDashboardPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Routes  */}
      <Route path="/dashboard/student" element={<StudentDashboardPage />} />

      {/* Instructor Routes  */}
      <Route
        path="/dashboard/instructor"
        element={<InstructorDashboardPage />}
      />
    </Routes>
  );
}

export default App;
