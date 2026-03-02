import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JobDescriptions.css";
import { FaPlus } from "react-icons/fa";

function JobDescriptions() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [jobs, setJobs] = useState([]);

  // ================= FETCH ALL JOBS =================
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

  // ================= ADD SKILL =================
  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  // ================= CREATE JOB =================
  const handleCreateJob = async () => {

    // Proper validation
    if (!jobTitle.trim()) {
      alert("Job title is required");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Job description is required");
      return;
    }

    if (skills.length === 0) {
      alert("Please add at least one required skill");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobTitle.trim(),
          description: jobDescription.trim(),
          required_skills: skills,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Job created successfully!");

        // Reset form
        setJobTitle("");
        setJobDescription("");
        setSkills([]);
        setSkillInput("");

        fetchJobs();
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error("Error creating job:", error);
      alert("Error creating job");
    }
  };

  return (
    <div className="job-page">
      <h1 className="page-title">Job Descriptions</h1>
      <p className="page-subtitle">
        Create and manage job postings
      </p>

      {/* ================= CREATE JOB ================= */}
      <div className="job-card">
        <h2>Add New Job</h2>

        <label>Job Title</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g., Senior Software Engineer"
          className="input-field"
        />

        <label>Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Describe the role, responsibilities, requirements..."
          className="textarea-field"
        />

        <label>Required Skills</label>
        <div className="skills-input">
          <input
            type="text"
            placeholder="Add skill (Python, React...)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
          />
          <button onClick={addSkill}>
            <FaPlus />
          </button>
        </div>

        <div className="skills-list">
          {skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>

        <button className="create-btn" onClick={handleCreateJob}>
          <FaPlus /> Create Job
        </button>
      </div>

      {/* ================= POSTED JOBS ================= */}
      <div className="posted-jobs-section">
        <h2>All Posted Jobs</h2>

        {jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          <div className="posted-jobs-grid">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="posted-job-card"
                onClick={() => navigate(`/admin/job/${job.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h3>{job.title}</h3>

                <p className="job-description-preview">
                  {job.description
                    ? job.description.substring(0, 120) + "..."
                    : "No description provided."}
                </p>

                <div className="posted-skills">
                  {job.required_skills.map((skill, i) => (
                    <span key={i} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDescriptions;