import React, { useEffect, useState } from "react";
import "./MatchingJobs.css";

function MatchingJobs() {

    const [results, setResults] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {

        const userId = localStorage.getItem("user_id");

        const response = await fetch(
            `http://127.0.0.1:5000/student/match/${userId}`
        );

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            setMessage("No Job Matches Yet");
        } else {
            setResults(data.results);
        }
    };

    return (
        <div className="matching-container">

            <h2 className="page-title">Matching Jobs</h2>

            {message && <h3>{message}</h3>}

            {results.map((job, index) => (

                <div key={index} className="job-card">

                    <div className="job-header">
                        <h3>{job.job_title}</h3>

                        <div className="match-score">
                            {job.match_percentage}%
                            <span>Match</span>
                        </div>
                    </div>

                    <p className="job-description">
                        {job.description.substring(0, 120)}...
                    </p>

                    <div className="skills-section">

                        <h4>Matched Skills</h4>
                        <div className="skills">
                            {job.matched_skills.map((skill, i) => (
                                <span key={i} className="skill matched">
                                    ✔ {skill}
                                </span>
                            ))}
                        </div>

                        <h4>Missing Skills</h4>
                        <div className="skills">
                            {job.missing_skills.map((skill, i) => (
                                <span key={i} className="skill missing">
                                    ✖ {skill}
                                </span>
                            ))}
                        </div>

                    </div>

                    <div className="recommend-box">

                        <h4>Recommendations</h4>

                        <div className="recommend-grid">
                            {job.recommendations.map((rec, i) => (
                                <div key={i} className={`recommend-card rec${(i % 4) + 1}`}>
                                    💡 {rec}
                                </div>
                            ))}
                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
}

export default MatchingJobs;