import React, { useContext } from "react";
import { ResumeContext } from "../../context/ResumeContext";

const recommendationMap = {
    react: {
        course: "React – Udemy",
        project: "Build Full Stack Web App"
    },
    aws: {
        course: "AWS – Coursera",
        project: "Deploy Flask App to Cloud"
    },
    docker: {
        course: "Docker – Udemy",
        project: "Containerize Web Application"
    }
};

function Recommendations() {
    const { analysis } = useContext(ResumeContext);

    if (!analysis) return <h2>Please upload resume first.</h2>;

    const missing = new Set();
    analysis.results.forEach(job => {
        job.missing_skills.forEach(skill => missing.add(skill.toLowerCase()));
    });

    return (
        <div className="student-container">
            <h2>💡 Recommendations</h2>

            {[...missing].map((skill, i) => (
                <div key={i} className="recommend-card">
                    <h3>{skill}</h3>
                    <p>Course: {recommendationMap[skill]?.course || "Online Course"}</p>
                    <p>Project: {recommendationMap[skill]?.project || "Build practical project"}</p>
                </div>
            ))}
        </div>
    );
}

export default Recommendations;