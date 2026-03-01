import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    const response = await fetch("http://127.0.0.1:5000/jobs");
    const data = await response.json();

    const selectedJob = data.find(
      (j) => j.id === parseInt(id)
    );

    setJob(selectedJob);
  };

  if (!job) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="job-details-container">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="job-details-card">
        <h1>{job.title}</h1>

        <h3>Description</h3>
        <p>{job.description || "No description provided."}</p>

        <h3>Required Skills</h3>
        <div className="skills">
          {job.required_skills.map((skill, index) => (
            <span key={index} className="skill-pill">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobDetails;