import React, { useContext } from "react";
import { ResumeContext } from "../../context/ResumeContext";
import "./Recommendations.css";

function Recommendations() {

    const { analysis } = useContext(ResumeContext);

    if (!analysis || !analysis.results) {
        return (
            <div style={{ padding: "40px" }}>
                <h2>No recommendations available</h2>
                <p>Please upload resume and run job matching first.</p>
            </div>
        );
    }

    return (
        <div className="recommend-container">

            <h2 className="recommend-title">AI Career Recommendations</h2>

            {analysis.results.map((job, index) => (

                <div className="recommend-card" key={index}>

                    <h3>{job.job_title}</h3>

                    <h4>Priority Skills To Learn</h4>
                    <div className="skills">
                        {job.missing_skills.map((skill, i) => (
                            <span key={i} className="skill">{skill}</span>
                        ))}
                    </div>

                    <h4>Recommended Actions</h4>
                    <ul>
                        {job.missing_skills.map((skill, i) => (
                            <li key={i}>Improve {skill}</li>
                        ))}
                    </ul>

                    <h4>Project Suggestions</h4>
                    <ul>
                        {job.missing_skills.map((skill, i) => (
                            <li key={i}>Build project using {skill}</li>
                        ))}
                    </ul>

                </div>

            ))}

        </div>
    );
}

export default Recommendations;