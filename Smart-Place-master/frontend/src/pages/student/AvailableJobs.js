import React, { useEffect, useState } from "react";

function AvailableJobs() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Available Jobs</h2>

      {jobs.map(job => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default AvailableJobs;