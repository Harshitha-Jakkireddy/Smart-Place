import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import {
  FaUser,
  FaBriefcase,
  FaFileAlt,
  FaSignOutAlt
} from "react-icons/fa";

function StudentDashboard() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <div className="sidebar">

        <h2>Student Portal</h2>

        <button onClick={() => navigate("/student/profile")}>
          <FaUser /> My Profile
        </button>

        <button onClick={() => navigate("/student/jobs")}>
          <FaBriefcase /> Available Jobs
        </button>

        <button onClick={() => navigate("/student/applications")}>
          <FaFileAlt /> My Applications
        </button>

        <button onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>

      </div>

      {/* HOME CONTENT */}
      <div className="main-content">
        <h1>Welcome Student 🎓</h1>
        <p>Select an option from sidebar</p>
      </div>

    </div>
  );
}

export default StudentDashboard;