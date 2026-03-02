import React, { useContext } from "react";
import { ResumeContext } from "../../context/ResumeContext";

function MatchingJobs() {
    const { analysis } = useContext(ResumeContext);

    if (!analysis) return <h2>Please upload resume first.</h2>;

    return (
        <div className="student-container">
            <h2>📊 Matching Jobs</h2>

            {analysis.results.map((job, index) => (
                <div className="job-card" key={index}>
                    <h3>🧾 {job.job_title}</h3>

                    <div className="progress">
                        <div
                            className="progress-fill"
                            style={{ width: `${job.final_score_percentage}%` }}
                        >
                            {job.final_score_percentage}%
                        </div>
                    </div>

                    <h4>🧠 Matched Skills</h4>
                    {job.matched_skills.map((skill, i) => (
                        <span key={i} className="badge">
                            {skill}
                        </span>
                    ))}

                    <h4>❌ Missing Skills</h4>
                    {job.missing_skills.map((skill, i) => (
                        <span key={i} className="badge-missing">
                            {skill}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default MatchingJobs;