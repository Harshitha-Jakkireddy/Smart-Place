import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";

import Profile from "./pages/student/Profile";
import AvailableJobs from "./pages/student/AvailableJobs";
import Applications from "./pages/student/Applications";

import UploadResume from "./pages/student/UploadResume";
import MatchingJobs from "./pages/student/MatchingJobs";
import SkillGap from "./pages/student/SkillGap";
import Recommendations from "./pages/student/Recommendations";

import AdminDashboard from "./pages/AdminDashboard";
import MatchingResults from "./pages/admin/MatchingResults";

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

      <Route path="/student/upload" element={<UploadResume />} />
      <Route path="/student/matching" element={<MatchingJobs />} />
      <Route path="/student/skill-gap" element={<SkillGap />} />
      <Route path="/student/recommendations" element={<Recommendations />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/matching" element={<MatchingResults />} />

    </Routes>
  );
}

export default App;