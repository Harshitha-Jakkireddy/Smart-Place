import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminDashboard.css";
import "./admin/MatchingResults.css";
import "./admin/JobDescriptions.css";

import JobDescriptions from "./admin/JobDescriptions";

import {
  FaHome,
  FaFileAlt,
  FaUsers,
  FaTrophy,
  FaBriefcase,
  FaSignOutAlt
} from "react-icons/fa";

function AdminDashboard() {

  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  /* ================= AUTH PROTECTION ================= */
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role || role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* ================= MATCHING SECTION ================= */
  const MatchingSection = () => {

    const [jobs, setJobs] = useState([]);
    const [results, setResults] = useState(null);

    useEffect(() => {
      fetchJobs();
    }, []);

    const fetchJobs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/jobs");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchMatches = async (jobId) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/match/${jobId}`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    return (
      <div className="matching-wrapper">

        <div className="matching-header">
          <h2>Candidate Matching</h2>
          <p>Select a job role to view ranked candidates</p>
        </div>

        {/* JOB DROPDOWN */}
        <div className="job-dropdown-container">
          <select
            className="job-dropdown"
            onChange={(e) => fetchMatches(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select Job Role
            </option>

            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        {/* MATCH RESULTS */}
        {results?.results && (
          <div className="cards-container">

            {results.results.map((candidate, index) => (

              <div key={index} className="match-card">

                <div className="card-left">
                  <div className="rank">#{index + 1}</div>

                  <h3>{candidate.resume_name}</h3>

                  <div className="skills">
                    {candidate.matched_skills.map((skill, i) => (
                      <span key={i} className="skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-right">
                  <div
                    className="score-ring"
                    style={{
                      "--percent":
                        candidate.final_score_percentage
                    }}
                  >
                    {candidate.final_score_percentage}%
                  </div>

                  <span className="score-label">
                    Match Score
                  </span>
                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    );
  };

  /* ================= CONTENT SWITCH ================= */
  const renderContent = () => {

    switch (activeSection) {

      case "jobs":
        return <JobDescriptions />;

      case "matching":
        return <MatchingSection />;

      case "ranked":
        return <h2>Ranked Candidates (Coming Soon)</h2>;

      default:
        return (
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Welcome back! Manage your placement system here.
            </p>
          </div>
        );
    }
  };

  /* ================= UI ================= */
  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <div className="sidebar">

        <div>
          <div className="logo-section">
            <div className="logo-icon">
              <FaBriefcase />
            </div>

            <div>
              <h2>Smart Place</h2>
              <p>Admin Portal</p>
            </div>
          </div>

          <div className="nav-links">

            <button
              className={activeSection === "dashboard" ? "active" : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              <FaHome /> Dashboard
            </button>

            <button
              className={activeSection === "jobs" ? "active" : ""}
              onClick={() => setActiveSection("jobs")}
            >
              <FaFileAlt /> Job Descriptions
            </button>

            <button
              className={activeSection === "matching" ? "active" : ""}
              onClick={() => setActiveSection("matching")}
            >
              <FaUsers /> Matching Results
            </button>

            <button
              className={activeSection === "ranked" ? "active" : ""}
              onClick={() => setActiveSection("ranked")}
            >
              <FaTrophy /> Ranked Candidates
            </button>

          </div>
        </div>

        <div className="logout-section">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {renderContent()}
      </div>

    </div>
  );
}

export default AdminDashboard;