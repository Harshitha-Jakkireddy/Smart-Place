import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUpload,
  FaChartBar,
  FaLightbulb,
  FaSignOutAlt
} from "react-icons/fa";

import "./StudentLayout.css";

function StudentDashboard() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="brand">
          <h2>Smart Place</h2>
          <p>Student Portal</p>
        </div>

        <button onClick={() => navigate("/student")}>
          <FaTachometerAlt /> Dashboard
        </button>

        <button onClick={() => navigate("/student/upload")}>
          <FaUpload /> Upload Resume
        </button>

        <button onClick={() => navigate("/student/matching")}>
          <FaChartBar /> Matching Jobs
        </button>

        <button onClick={() => navigate("/student/skill-gap")}>
          <FaChartBar /> Skill Gap Analysis
        </button>

        <button onClick={() => navigate("/student/recommendations")}>
          <FaLightbulb /> Recommendations
        </button>

        <div className="bottom">
          <button onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>

      </div>

      {/* MAIN */}
      <div className="main">

        <h1>Dashboard</h1>

        <div className="stats">
          <div className="card">
            <h3>12</h3>
            <p>Total Jobs</p>
          </div>

          <div className="card">
            <h3>5</h3>
            <p>Matched Jobs</p>
          </div>

          <div className="card">
            <h3>68%</h3>
            <p>Average Match</p>
          </div>

          <div className="card">
            <h3>4</h3>
            <p>Skills to Improve</p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;