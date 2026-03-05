import React, { useEffect, useState } from "react";
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

  const [stats, setStats] = useState({
    total_jobs: 0,
    matched_jobs: 0,
    average_match: 0,
    skills_to_improve: 0
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    const userId = localStorage.getItem("user_id");

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/student/dashboard/${userId}`
      );

      const data = await response.json();

      setStats(data);

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

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
            <h3>{stats.total_jobs}</h3>
            <p>Total Jobs</p>
          </div>

          <div className="card">
            <h3>{stats.matched_jobs}</h3>
            <p>Matched Jobs</p>
          </div>

          <div className="card">
            <h3>{stats.average_match}%</h3>
            <p>Average Match</p>
          </div>

          <div className="card">
            <h3>{stats.skills_to_improve}</h3>
            <p>Skills to Improve</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;