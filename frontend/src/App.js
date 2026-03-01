import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";

import Profile from "./pages/student/Profile";
import AvailableJobs from "./pages/student/AvailableJobs";
import Applications from "./pages/student/Applications";

import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* STUDENT */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/profile" element={<Profile />} />
      <Route path="/student/jobs" element={<AvailableJobs />} />
      <Route path="/student/applications" element={<Applications />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminDashboard />} />

    </Routes>
  );
}

export default App;