import { Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./routes/LandingPage";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import StudentDashboardPage from "./routes/StudentDashboardPage";
import InstructorDashboardPage from "./routes/InstructorDashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard/student" element={<StudentDashboardPage />} />
      <Route
        path="/dashboard/instructor"
        element={<InstructorDashboardPage />}
      />
    </Routes>
  );
}

export default App;
