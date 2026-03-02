import React, { useEffect, useState } from "react";
import "./MatchingResults.css";

function MatchingResults() {

    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState("");
    const [results, setResults] = useState([]);

    // Load jobs
    useEffect(() => {
        fetch("http://127.0.0.1:5000/jobs")
            .then(res => res.json())
            .then(data => setJobs(data))
            .catch(err => console.error("Error loading jobs:", err));
    }, []);

    // When job selected
    const handleSelect = async (e) => {
        const jobId = e.target.value;
        setSelectedJobId(jobId);

        if (!jobId) {
            setResults([]);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/match/${jobId}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Error fetching match results:", error);
        }
    };

    return (
        <div className="matching-container">
            <h2>Candidate Matching</h2>

            <select value={selectedJobId} onChange={handleSelect}>
                <option value="">Select Job Role</option>
                {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                        {job.title}
                    </option>
                ))}
            </select>

            <div className="results-section">
                {results.length === 0 && selectedJobId && (
                    <p>No resumes found.</p>
                )}

                {results.map((res, index) => (
                    <div key={index} className="result-card">
                        <h4>{res.resume_name}</h4>

                        <p><strong>Final Score:</strong> {res.final_score_percentage}%</p>
                        <p><strong>Exact Match:</strong> {res.exact_match_percentage}%</p>
                        <p><strong>Cosine Similarity:</strong> {res.cosine_similarity_percentage}%</p>

                        <p>
                            <strong>Matched Skills:</strong> {res.matched_skills.join(", ")}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MatchingResults;