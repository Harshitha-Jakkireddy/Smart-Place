import React, { useContext } from "react";
import { ResumeContext } from "../../context/ResumeContext";

function SkillGap() {
    const { analysis } = useContext(ResumeContext);

    if (!analysis) return <h2>Please upload resume first.</h2>;

    const allMatched = new Set();
    const allMissing = new Set();

    analysis.results.forEach(job => {
        job.matched_skills.forEach(skill => allMatched.add(skill));
        job.missing_skills.forEach(skill => allMissing.add(skill));
    });

    return (
        <div className="student-container">
            <h2>📈 Skill Gap Analysis</h2>

            <h3>✔ Your Strengths</h3>
            {[...allMatched].map((skill, i) => (
                <div key={i}>✔ {skill}</div>
            ))}

            <h3>🚀 Skills To Develop</h3>
            {[...allMissing].map((skill, i) => (
                <div key={i}>• {skill}</div>
            ))}

            <h3>📊 Summary</h3>
            <p>Matched Skills: {allMatched.size}</p>
            <p>Missing Skills: {allMissing.size}</p>
            <p>Jobs Analyzed: {analysis.results.length}</p>
        </div>
    );
}

export default SkillGap;